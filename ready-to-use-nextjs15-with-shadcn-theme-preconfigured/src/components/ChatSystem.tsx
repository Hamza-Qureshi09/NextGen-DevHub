// "use client";

// import { useQuery } from "@tanstack/react-query";
// import { fetchChats } from "@/server/actions";

// interface ChatSystemProps {
//   initialChats: any[];
// }

// export default function ChatSystem({ initialChats }: ChatSystemProps) {
//   const { data, isLoading } = useQuery<any[]>({
//     queryKey: ["chats"],
//     queryFn: fetchChats,
//     initialData: initialChats,
//     staleTime: Infinity,
//   });

//   if (isLoading || !data) {
//     throw new Promise(() => {});
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-sm border p-6">
//       <h2 className="text-lg font-semibold mb-4">Chat</h2>
//       <div className="space-y-3 max-h-96 overflow-y-auto">
//         {data.map((chat) => (
//           <div
//             key={chat.id}
//             className={`flex ${
//               chat.sender === "user" ? "justify-end" : "justify-start"
//             }`}
//           >
//             <div
//               className={`max-w-xs p-3 rounded-lg ${
//                 chat.sender === "user"
//                   ? "bg-blue-100 text-blue-900"
//                   : "bg-gray-100 text-gray-900"
//               }`}
//             >
//               <p className="text-sm">{chat.message}</p>
//               <p className="text-xs text-gray-500 mt-1">
//                 {new Date(chat.timestamp).toLocaleString()}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useQuery } from "@tanstack/react-query";
// import { fetchChats } from "@/server/actions";

// export default function ChatSystem() {
//   const { data, isLoading } = useQuery<any[]>({
//     queryKey: ["chats"],
//     queryFn: fetchChats,
//     staleTime: Infinity,
//   });

//   if (isLoading || !data) {
//     throw new Promise(() => {});
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-sm border p-6">
//       <h2 className="text-lg font-semibold mb-4">Chat</h2>
//       <div className="space-y-3 max-h-96 overflow-y-auto">
//         {data.map((chat) => (
//           <div
//             key={chat.id}
//             className={`flex ${
//               chat.sender === "user" ? "justify-end" : "justify-start"
//             }`}
//           >
//             <div
//               className={`max-w-xs p-3 rounded-lg ${
//                 chat.sender === "user"
//                   ? "bg-blue-100 text-blue-900"
//                   : "bg-gray-100 text-gray-900"
//               }`}
//             >
//               <p className="text-sm">{chat.message}</p>
//               <p className="text-xs text-gray-500 mt-1">
//                 {new Date(chat.timestamp).toLocaleString()}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchChats } from "@/server/actions";

interface ChatSystemProps {
  initialChats: any[] | null;
}

export default function ChatSystem({ initialChats }: ChatSystemProps) {
  const { data, isLoading, error } = useQuery<any[]>({
    queryKey: ["chats"],
    queryFn: fetchChats,
    initialData: initialChats ?? undefined,
    staleTime: Infinity,
  });

  if (isLoading) {
    return <div>Loading chats...</div>;
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-red-600">
          Error loading chats. Please try again.
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-gray-600">No chats available.</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-lg font-semibold mb-4">Chat</h2>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {data.map((chat) => (
          <div
            key={chat.id}
            className={`flex ${
              chat.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg ${
                chat.sender === "user"
                  ? "bg-blue-100 text-blue-900"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              <p className="text-sm">{chat.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(chat.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
