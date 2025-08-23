module.exports = async (
  userSocketMap,
  pubClient,
  subClient,
  redisClient,
  io,
  instanceId
) => {
  console.info("from socket");

  // Redis keys and channels
  const USER_KEY_PREFIX = "user:";
  const CHANNEL = "socket-events";

  // Subscribe to Redis channel
  subClient.subscribe(CHANNEL, (err) => {
    if (err) {
      console.error("Failed to subscribe:", err);
    } else {
      console.info(`Instance ${instanceId} subscribed to ${CHANNEL}`);
    }
  });

  // Handle Redis pub/sub messages
  subClient.on("message", (channel, message) => {
    console.info(
      `Received message on channel ${channel} for instance ${instanceId}`
    );
    let parsedMessage;
    try {
      parsedMessage = JSON.parse(message);
    } catch (err) {
      console.error(`Failed to parse message on channel ${channel}:`, err);
      return;
    }
    const { type, userId, msg } = parsedMessage;
    console.info(`Parsed message: type=${type}, userId=${userId}, msg=${msg}`);

    if (channel === CHANNEL) {
      if (type === "direct") {
        // Forward direct message to user if connected to this instance
        const socket = userSocketMap.get(userId);
        if (socket) {
          console.info(
            `Sending direct message to user ${userId} on instance ${instanceId}`
          );
          socket.emit("message", msg);
        } else {
          console.info(
            `User ${userId} not found in userSocketMap on instance ${instanceId}`
          );
        }
      } else if (type === "broadcast") {
        // Broadcast to all connected sockets in this instance
        console.info(
          `Broadcasting message to all sockets on instance ${instanceId}`
        );
        io.emit("message", msg);
      }
    }
  });

  // Socket.IO connection handler
  io.on("connection", (socket) => {
    console.info(`New connection: ${socket.id} on instance ${instanceId}`);

    // Client must send userId on connect
    socket.on("register", async ({ userId }) => {
      console.info(`Received register event for userId: ${userId}`);
      if (!userId) {
        socket.emit("socket_error", "userId required");
        return;
      }

      // Check if userId is already registered on this instance
      if (userSocketMap.has(userId)) {
        console.info(`User ${userId} already registered, updating socket`);
        const oldSocket = userSocketMap.get(userId);
        if (oldSocket) {
          oldSocket.removeAllListeners(); // remove all listeners for this existing one
          oldSocket.disconnect(true);
        }
        userSocketMap.delete(userId);
        await redisClient.del(`${USER_KEY_PREFIX}${userId}`);
      }

      // Store in memory
      userSocketMap.set(userId, socket);

      // Store metadata in Redis
      const userData = {
        socketId: socket.id,
        instanceId,
        lastSeen: Date.now(),
        sync: true,
        sync_count: 0,
        sync_instance_no: instanceId,
      };

      try {
        await redisClient.set(
          `${USER_KEY_PREFIX}${userId}`,
          JSON.stringify(userData),
          "EX",
          60 * 60 // Expire after 1 hour
        );
        console.info(`User ${userId} registered on instance ${instanceId}`);
      } catch (err) {
        console.error(`Failed to store user ${userId} in Redis:`, err);
        socket.emit("socket_error", "Failed to register user");
        return;
      }

      console.info(`User ${userId} registered on instance ${instanceId}`);

      // Notify client of successful registration
      socket.emit("registered", { userId, instanceId });

      // Handle direct messages
      socket.on("message", async ({ toUserId, msg }) => {
        console.info(
          `Received message event from ${userId} to ${toUserId}: ${msg}`
        );
        try {
          const targetUserData = await redisClient.get(
            `${USER_KEY_PREFIX}${toUserId}`
          );
          console.info(`Redis lookup for ${toUserId}: ${targetUserData}`);
          if (targetUserData) {
            const { instanceId: targetInstanceId, socketId } =
              JSON.parse(targetUserData);

            if (targetInstanceId === instanceId) {
              // User is on this instance
              const targetSocket = userSocketMap.get(toUserId);
              if (targetSocket) {
                console.info(
                  `Sending message to ${toUserId} on same instance ${instanceId}`
                );
                targetSocket.emit("message", msg);
              } else {
                console.info(
                  `Target socket for ${toUserId} not found in userSocketMap`
                );
                socket.emit("socket_error", `User ${toUserId} not connected`);
              }
            } else {
              console.info(
                `Publishing message to ${toUserId} on instance ${targetInstanceId} from ${instanceId}`
              );
              pubClient.publish(
                CHANNEL,
                JSON.stringify({
                  type: "direct",
                  userId: toUserId,
                  msg,
                })
              );
            }
          } else {
            console.info(`User ${toUserId} not found in Redis`);
            socket.emit("socket_error", `User ${toUserId} not found`);
          }
        } catch (err) {
          console.error(`Error handling message to ${toUserId}:`, err);
          socket.emit("socket_error", "Failed to send message");
        }
      });

      // Handle broadcast messages
      socket.on("broadcast", (msg) => {
        console.info(`Received broadcast from ${userId}: ${msg}`);
        io.emit("message", msg);
        pubClient.publish(
          CHANNEL,
          JSON.stringify({
            type: "broadcast",
            msg,
          })
        );
      });

      // Handle disconnection
      socket.on("disconnect", async () => {
        console.info(`Socket ${socket.id} disconnected for user ${userId}`);
        userSocketMap.delete(userId);
        try {
          await redisClient.del(`${USER_KEY_PREFIX}${userId}`);
          console.info(
            `User ${userId} disconnected from instance ${instanceId}`
          );
        } catch (err) {
          console.error(`Failed to delete user ${userId} from Redis:`, err);
        }
      });
    });

    // Handle socket errors
    socket.on("error", (err) => {
      console.error(`Socket error on ${socket.id}:`, err);
    });

    socket.on("connect_error", (err) => {
      console.error(`Connection error on ${socket.id}:`, err.message);
    });
  });

  // Periodic sync of in-memory Map to Redis (every 30 seconds)
  setInterval(async () => {
    for (const [userId, socket] of userSocketMap) {
      const userData = {
        socketId: socket.id,
        instanceId,
        lastSeen: Date.now(),
        sync: true,
        sync_count: (await redisClient.get(`${USER_KEY_PREFIX}${userId}`))
          ? JSON.parse(await redisClient.get(`${USER_KEY_PREFIX}${userId}`))
              .sync_count + 1
          : 1,
        sync_instance_no: instanceId,
      };
      try {
        await redisClient.set(
          `${USER_KEY_PREFIX}${userId}`,
          JSON.stringify(userData),
          "EX",
          60 * 60
        );
      } catch (err) {
        console.error(`Failed to sync user ${userId} to Redis:`, err);
      }
    }
    console.info(
      `Synced ${userSocketMap.size} users to Redis on instance ${instanceId}`
    );
  }, 30 * 1000);
};
