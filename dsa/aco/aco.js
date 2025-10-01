// Overview
// Defination:- Ant Colony Optimization (ACO) is a metaheuristic algorithm inspired by the foraging
// behavior of ants. It is used to find optimal solutions for combinatorial problems, such as the
// Traveling Salesman Problem (TSP) and Logistics Optimization.
// Core concepts:-
// 1. Evaporation:Reduces pheromone strength/values globally, encouraging exploration.
// Higher evaporation rates minimize the influence of older solutions faster.
// 2.Reinforcement:
// Updates pheromones only on paths visited by ants, rewarding shorter paths.
// Paths with higher pheromones are more likely to be chosen in future iterations.

// 3. Effect of High vs. Low Pheromone Values:
// High pheromone values: Attract ants, encouraging exploitation of successful paths.
// Low pheromone values: Discourage ants, reducing the probability of choosing those paths.

// 3. Shorter vs. Longer Distances:
// Shorter Distance/Path Example:
// A route with a total distance of 10 km (A → B → C → D).
// This route gets more pheromone reinforcement:
// Reinforcement = 1/distance  =>  1/10=0.1
// The shorter path is more attractive to ants, leading to more pheromone buildup over time.
// Longer Distance/Path Example:

// A route with a total distance of 50 km (A → E → D → C).
// This route gets less pheromone reinforcement:
// Reinforcement = 1/distance => 1/50=0.02
// The longer path is discouraged because it contributes less pheromone, making it less likely to be chosen.

// Exploration vs. Exploitation:
// High evaporation + low reinforcement = exploration (ants try new paths).
// Low evaporation + strong reinforcement = exploitation (ants focus on promising paths).

// Key Concepts about Probability:
// Impact of Pheromones (τ):High pheromones increase the probability of selecting a path, encouraging exploitation.
// Low pheromones reduce the likelihood of choosing that path, supporting exploration.
// Impact of Distance (η):Shorter distances (higher  η=1/distance) are more attractive. Longer distances (lower η ) are less preferred.
// Balance between α and β:High α: Ants rely more on pheromones (exploitation).
// High β: Ants rely more on distances (exploration).
// Proper balance ensures both exploration and exploitation

// Pheromone Update
// o Reinforcement: Shorter paths get higher pheromones.
// o Evaporation: Pheromones decay over time to avoid premature convergence

// 4. Evaporation ensures older paths lose relevance.
// Explanation: Pheromones decay over time because of Evaporation reduces pheromone strength globally. simulating the fact that less-used paths should become less attractive. This is done by multiplying pheromone values by   (1−EVAPORATION_RATE).  Purpose: Prevents stagnation by reducing reliance on old solutions and encourages ants to explore new paths.
// Example:
// Initial pheromone values:
// {
//   'A-B': 1,
//   'A-C': 1,
//   'A-D': 1,
//   'A-E': 1
// }
// EVAPORATION_RATE = 0.5 (50% decay rate)
// After evaporation:
// {
//   'A-B': 0.5,
//   'A-C': 0.5,
//   'A-D': 0.5,
//   'A-E': 0.5
// }
// Effect: Pheromones on all paths decrease. Paths not reinforced by ants will eventually have near-zero pheromones.
// 5. Exploration: Ants explore less-traveled or new paths. Purpose: Discover new potential solutions.

// ________________________________________
// Ant 🐜 Colony Optimization (ACO) for Traveling Salesman Problem (TSP) 🐜
// Core Concepts of ACO
// 1.	Pheromone Trails 🐜
// o	Ants deposit pheromones along their paths.
// o	Higher pheromones → More attractive the path.
// 2.	Path Selection (Exploration vs Exploitation)
// o	Ants choose the next node based on:
// 	Pheromone Level (exploitation - sticking to good paths)
// 	Distance (exploration - finding new paths)
// 3.	Pheromone Update
// o	Reinforcement: Shorter paths get higher pheromones.
// o	Evaporation: Pheromones decay over time to avoid premature convergence.
// ________________________________________
// ACO Steps for the Traveling Salesman Problem (TSP) 🗺️
// 1.	Initialize Cities & Distance Matrix
// 2.	Initialize Pheromone Levels
// 3.	Deploy Ants & Build Solutions
// 4.	Evaluate Paths & Update Pheromones
// 5.	Repeat Until Convergence
// 6.	Return the Best Path
// ________________________________________
// JavaScript Implementation of ACO for TSP
// javascript
// CopyEdit
// Ant Colony Optimization for the Traveling Salesman Problem (TSP)
// const cities = ["A", "B", "C", "D", "E"];

// // Distance matrix between cities
// const distances = {
//   "A-B": 2, // Km
//   "A-C": 9, // Km
//   "A-D": 10, // Km
//   "A-E": 7, // Km
//   "B-C": 8, // Km
//   "B-D": 5, // Km
//   "B-E": 6, // Km
//   "C-D": 4, // Km
//   "C-E": 3, // Km
//   "D-E": 1, // Km
// };

// // Initialize pheromone levels for all paths
// let pheromones = {};
// Object.keys(distances).forEach((route) => (pheromones[route] = 1.0));
// console.info("Initializing pherom", pheromones);

// // ACO Parameters
// const ALPHA = 1; // Pheromone influence
// const BETA = 2; // Distance influence
// const EVAPORATION_RATE = 0.5;
// const NUM_ANTS = 5;
// const ITERATIONS = 1;

// // Function to calculate probability of choosing a path
// const probability = (city, neighbors, pheromones) => {
//   let probs = neighbors.map((neighbor, index) => {
//     let route = `${city}-${neighbor}`;
//     let pheromone = pheromones[route] || 0.1;
//     let distance = distances[route] || 50;
//     console.info(
//       "probablity route",
//       index,
//       route,
//       pheromone,
//       distance,
//       "and neighbor",
//       neighbor,
//       ALPHA,
//       BETA,
//       Math.pow(pheromone, ALPHA),
//       Math.pow(1 / distance, BETA),
//       Math.pow(pheromone, ALPHA) * Math.pow(1 / distance, BETA)
//     );
//     return {
//       neighbor,
//       prob: Math.pow(pheromone, ALPHA) * Math.pow(1 / distance, BETA),
//     };
//   });

//   let sumProb = probs.reduce((sum, p) => sum + p.prob, 0);
//   console.info("proba", probs, "sumProb", sumProb);
//   return probs.map((p) => ({ neighbor: p.neighbor, prob: p.prob / sumProb }));
// };

// // Function to simulate one ant's tour
// const constructTour = () => {
//   let availableCities = [...cities];
//   let startCity = availableCities.splice(
//     Math.floor(Math.random() * availableCities.length),
//     1
//   )[0]; //splice will give the deleted city value in array so [0] mean we are getting the string value from the deleted city array
//   let route = [startCity];
//   let totalDistance = 0;

//   while (availableCities.length > 0) {
//     let lastCity = route[route.length - 1];
//     let probs = probability(lastCity, availableCities, pheromones);
//     console.info("Route", route, startCity, lastCity, availableCities, probs);

//     let selectedCity = probs.sort((a, b) => Math.random() - 0.5)[0].neighbor;
//     availableCities = availableCities.filter((c) => c !== selectedCity);

//     totalDistance += distances[`${lastCity}-${selectedCity}`] || 50;
//     console.info(
//       "selected city:",
//       selectedCity,
//       availableCities,
//       totalDistance
//     );
//     route.push(selectedCity);
//   }
//   console.info("Best Route:", route, "Best Distance:", totalDistance);

//   return { route, totalDistance };
// };

// // ACO Execution
// const antColonyOptimization = () => {
//   let bestRoute = null;
//   let bestDistance = Infinity;

//   for (let iter = 0; iter < ITERATIONS; iter++) {
//     let allRoutes = [];

//     // Each ant finds a tour
//     for (let ant = 0; ant < 1; ant++) {
//       //NUM_ANTS
//       let tour = constructTour();
//       allRoutes.push(tour);
//       console.info("tour: ", tour, bestDistance);
//       if (tour.totalDistance < bestDistance) {
//         console.info("tour: ", tour, bestDistance);
//         bestDistance = tour.totalDistance;
//         bestRoute = tour.route;
//       }
//     }
//     console.info("pheromon", pheromones, EVAPORATION_RATE);
//     // Evaporate pheromones
//     Object.keys(pheromones).forEach((route) => {
//       pheromones[route] = pheromones[route] * 1 - EVAPORATION_RATE;
//     });
//     console.info("pheromon2", pheromones, EVAPORATION_RATE, allRoutes);
//     // Reinforce best routes
//     allRoutes.forEach(({ route, totalDistance }) => {
//       let pheromoneDeposit = 1 / totalDistance;
//       for (let i = 0; i < route.length - 1; i++) {
//         console.info("trail", i);
//         let key = `${route[i]}-${route[i + 1]}`;
//         pheromones[key] += pheromoneDeposit;
//       }
//     });
//     console.info("pheromon3", pheromones, EVAPORATION_RATE, allRoutes);
//     console.log(`Iteration ${iter + 1}: Best Distance = ${bestDistance}`);
//   }

//   return { bestRoute, bestDistance };
// };

// // Run ACO
// console.log("Best Route:", antColonyOptimization());
// ________________________________________;
// Explanation of Each Step
// 1. Initialization
// •	Cities & Distances: A set of 5 cities with a distance matrix.
// •	Pheromone Levels: Each path starts with equal pheromone levels.

// 2. Probability Calculation
// •	Uses pheromone strength and distance to determine the likelihood of selecting a path.
// •	Formula: P(route)=(pheromone)α×(1/distance)β∑(pheromone)α×(1/distance)βP(route) = \frac{(\text{pheromone})^\alpha \times (1 / \text{distance})^\beta}{\sum (\text{pheromone})^\alpha \times (1 / \text{distance})^\beta}P(route)=∑(pheromone)α×(1/distance)β(pheromone)α×(1/distance)β
// o	Higher pheromone → More probability
// o	Shorter distance → More probability

// 3. Constructing an Ant’s Tour
// •	Each ant starts at a random city.
// •	It selects the next city based on probabilities.
// •	The process repeats until all cities are visited.

// 4. Evaluating Paths
// •	Total distance of the tour is calculated.
// •	If it's better than the best route found so far, we update the best solution.

// 5. Pheromone Update
// •	Evaporation: Pheromones are reduced over time.
// •	Reinforcement: Shorter paths get stronger pheromone deposits.

// 6. Iterations Until Convergence
// •	The process repeats for 100 iterations.
// •	The algorithm converges to the shortest route.
// ________________________________________
// Key Takeaways
// ✔️ Functional Programming: Used pure functions like probability(), constructTour(), antColonyOptimization().
// ✔️ Pheromone-based Optimization: Balance between exploitation (following good paths) and exploration (trying new paths).
// ✔️ Efficient for TSP: Can be adapted for other problems like logistics, delivery routing, or scheduling.

const deliveryCities = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const distances = {
  "A-B": 10,
  "A-C": 15,
  "A-D": 20,
  "B-E": 25,
  "B-F": 30,
  "C-G": 35,
  "D-H": 40,
  "E-I": 20,
  "F-J": 25,
  "G-H": 10,
  "H-I": 5,
  "I-J": 15,
  "B-G": 20,
  "C-H": 25,
};
let pheromoneLevels = {};
Object.keys(distances).forEach((route) => (pheromoneLevels[route] = 1.0));
const findBestDeliveryRoute = () => {
  let bestRoute = null;
  let bestCost = Infinity;
  for (let iter = 0; iter < 100; iter++) {
    let routes = [];
    for (let ant = 0; ant < 10; ant++) {
      let path = ["A"];
      let totalCost = 0;
      while (path.length < deliveryCities.length) {
        let lastCity = path[path.length - 1];
        let nextCities = deliveryCities.filter((c) => !path.includes(c));
        let probabilities = nextCities.map((city) => {
          let route = `${lastCity}-${city}`;
          let pheromone = pheromoneLevels[route] || 0.1;
          let cost = distances[route] || 50;
          return {
            city,
            probability: Math.pow(pheromone, 1) * Math.pow(1 / cost, 2),
          };
        });
        let chosenCity = probabilities.sort((a, b) => Math.random() - 0.5)[0]
          .city;
        path.push(chosenCity);
        totalCost += distances[`${lastCity}-${chosenCity}`] || 50;
      }
      routes.push({ path, totalCost });
      if (totalCost < bestCost) {
        bestCost = totalCost;
        bestRoute = path;
      }
    }
    // Update Pheromone Levels
    Object.keys(pheromoneLevels).forEach(
      (route) => (pheromoneLevels[route] *= 0.5)
    );
    routes.forEach(({ path, totalCost }) => {
      let deposit = 1 / totalCost;
      path.forEach((city, i) => {
        if (i < path.length - 1)
          pheromoneLevels[`${city}-${path[i + 1]}`] += deposit;
      });
    });
  }
  return { bestRoute, bestCost };
};
console.log("Best Delivery Route:", findBestDeliveryRoute());
