// Genetic Algorithm Implementation
class GeneticAlgorithm {
  constructor(
    populationSize,
    mutationRate,
    fitnessFunction,
    generateIndividual
  ) {
    this.populationSize = populationSize; // Number of individuals in the population
    this.mutationRate = mutationRate; // Probability of mutation
    this.fitnessFunction = fitnessFunction; // Function to evaluate fitness of an individual
    this.generateIndividual = generateIndividual; // Function to generate a random individual
    this.population = []; // Current population
    this.generation = 0; // Track generations
  }

  // Initialize the population with random individuals
  initializePopulation() {
    for (let i = 0; i < this.populationSize; i++) {
      const individual = this.generateIndividual();
      this.population.push({
        genome: individual,
        fitness: this.fitnessFunction(individual),
      });
    }
  }

  // Evaluate the fitness of each individual
  evaluatePopulation() {
    for (const individual of this.population) {
      individual.fitness = this.fitnessFunction(individual.genome);
    }
    this.population.sort((a, b) => b.fitness - a.fitness); // Sort by fitness (descending)
  }

  // Select parents using roulette-wheel selection
  selectParents() {
    const totalFitness = this.population.reduce(
      (sum, ind) => sum + ind.fitness,
      0
    );
    const pick = Math.random() * totalFitness;
    let cumulative = 0;
    for (const individual of this.population) {
      cumulative += individual.fitness;
      if (cumulative >= pick) {
        return individual.genome;
      }
    }
    return this.population[0].genome; // Fallback
  }

  // Perform crossover between two parents
  crossover(parent1, parent2) {
    const midpoint = Math.floor(parent1.length / 2);
    return parent1.slice(0, midpoint).concat(parent2.slice(midpoint));
  }

  // Mutate an individual by introducing random changes
  mutate(individual) {
    return individual.map((gene) => {
      if (Math.random() < this.mutationRate) {
        return Math.random(); // Replace with a random value
      }
      return gene;
    });
  }

  // Generate the next generation
  generateNextGeneration() {
    const newPopulation = [];
    for (let i = 0; i < this.populationSize; i++) {
      // Fixed to generate entire population
      const parent1 = this.selectParents();
      const parent2 = this.selectParents();
      let offspring = this.crossover(parent1, parent2);
      offspring = this.mutate(offspring);
      newPopulation.push({
        genome: offspring,
        fitness: this.fitnessFunction(offspring),
      });
    }
    this.population = newPopulation;
    this.generation++;
  }

  // Run the genetic algorithm for a specified number of generations
  run(maxGenerations) {
    this.initializePopulation();
    // console.info(this.population, "population");
    for (let i = 0; i < maxGenerations; i++) {
      this.evaluatePopulation(); // sorted population
      // console.info(this.population, "evaluated/sorted populations");
      console.log(
        `Generation ${i + 1}: Best Fitness = ${this.population[0].fitness}`
      );
      if (this.population[0].fitness === 1) {
        console.log("Optimal solution found!");
        break;
      }
      this.generateNextGeneration();
    }
    return this.population[0]; // Return the best individual
  }
}

// Example: Solving a simple optimization problem
const ga = new GeneticAlgorithm(
  10, // Population size
  0.1, // Mutation rate
  (individual) => {
    // Fitness function: Aim to sum up to 5
    const target = 5;
    const sum = individual.reduce((acc, val) => acc + val, 0);
    return 1 / (1 + Math.abs(target - sum)); // Higher fitness for values closer to 5
  },
  () => Array.from({ length: 5 }, () => Math.random()) // Generate random individual
);

const bestSolution = ga.run(100);
console.log("Best Solution:", bestSolution);

// 1. Chromosomes and Individuals:
// Yes, you are correct in your understanding that the 5 random values generated for each individual represent the chromosomes (the genetic material).
// Each individual in the population consists of an array of these chromosomes. So, the 5 values in an individual are the genes of that individual.
// Chromosome = The full set of values (e.g., [0.5, 0.2, 0.7, 0.1, 0.9]).
// Genes = Each individual value in the array (e.g., 0.5, 0.2, 0.7, 0.1, 0.9).

// 2. Fitness Function Formula:
// The fitness function in this case is:
// Fitness =1/1+ ∣ target − sum of individual ∣

// Is this formula fixed?: The formula 1 / (1 + |target - sum|) is problem-specific. It's used here because you are trying to minimize the difference between the sum of the individual values and a target value (5). This formula is not universal—it's specifically designed for this optimization problem. Other optimization problems will use different formulas depending on their goals.

// 3. Iterations (Generations):
// The line const bestSolution = ga.run(50); means that you are running the GA for 50 generations (iterations). The algorithm will create new generations of individuals by selecting parents, performing crossover, and applying mutations to evolve the population over time.
// What if no value reaches 5?: If no individual exactly reaches the target (5), the algorithm will continue evolving the population, selecting individuals with the highest fitness (i.e., the closest sum). So, even if the target isn't exactly reached, the solution closest to the target will be selected as the best one.

// 4. Closing Criteria:
// The GA closes when either:
// An individual reaches the optimal solution (i.e., the sum of the 5 values is exactly 5, which gives a fitness of 1).
// The maximum number of generations is reached (50 in your case).

// 5. Parent Selection:
// In your current implementation, you're using roulette-wheel selection to choose parents. This means each individual’s probability of being selected is proportional to their fitness. This ensures that better individuals (those with higher fitness) have a higher chance of being selected as parents.

// 6. Crossover and Mutation:
// Crossover: Yes, you are correct—during crossover, the genes of two parent individuals are combined to form a new offspring (individual). The implementation takes the first half of parent1's genes and combines them with the second half of parent2's genes.
// Mutation: Yes, mutation introduces random changes. If a random value is less than the mutation rate, a new random value replaces one of the genes of the individual. This allows the algorithm to explore new areas of the solution space.
