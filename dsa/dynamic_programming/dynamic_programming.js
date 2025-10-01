// // knapsack 0/1 problem
// // find max profit with limited capcity of knapsack/bag

// function knapsackRecursive(values, weights, capacity, n) {
//   if (n === 0 || capacity === 0) return 0;

//   // choice either add or not
//   if (weights[n - 1] <= capacity) {
//     return Math.max(
//       values[n - 1] +
//         knapsackRecursive(values, weights, capacity - weights[n - 1], n - 1),
//       knapsackRecursive(values, weights, capacity, n - 1)
//     );
//   } else {
//     return knapsackRecursive(values, weights, capacity, n - 1);
//   }
// }
const values = [60, 20, 30, 100];
const weights = [10, 2, 6, 6];
const capacity = 15; // capacity of bag/knapsack (itna weight is bag me askta hai)
// console.info(knapsackRecursive(values, weights, capacity, values.length));

// // memoize the knapsack 0/1 problem
// // find max profit with limited capcity of knapsack/bag
// function memoizeKnapsackRecursive(values, weights, capacity, n, memo = {}) {
//   if (n === 0 || capacity === 0) return 0;
//   let key = `${n}-${capacity}`;

//   if (memo[key] !== undefined) return memo[key];

//   // choice either add or not
//   if (weights[n - 1] <= capacity) {
//     memo[key] = Math.max(
//       values[n - 1] +
//         memoizeKnapsackRecursive(
//           values,
//           weights,
//           capacity - weights[n - 1],
//           n - 1
//         ),
//       memoizeKnapsackRecursive(values, weights, capacity, n - 1)
//     );
//   } else {
//     memo[key] = memoizeKnapsackRecursive(values, weights, capacity, n - 1);
//   }
//   return memo[key];
// }

// // values , weights opr wali example se hi lelo
// console.info(
//   memoizeKnapsackRecursive(values, weights, capacity, values.length)
// );

// tabulaize / using dynamic programming the knapsack 0/1 problem
// find max profit with limited capcity of knapsack/bag
function using_DP_KnapsackRecursive(values, weights, capacity) {
  const n = values.length;
  // 1. table matrix bna kr osme 0 row or 0 colum ko fill kren gy phly zero se, 0 se isly ke n=0 , Cap=0 to max_profit bhi zero hoga agr n=1 , Cap=0 hai to item to hai array me lkn bag me space hini, agr n=0 or Cap=1 hai to to ab bag me space hai lkn weight hi nhi hai dalny kely
  // 2. left side table ki n+1 hoga or top side table ki capacity+1 hoga
  // 3. or n+1 or Cap+1 isly ke 0 row,0 col to 0 se fill hojayen gy process 1,1 se start hoga

  // START: 01) => initialize 2D matrix for DP
  const dynamic_P = Array(n + 1)
    .fill(0)
    .map(() => Array(capacity + 1).fill(0));
  // 🔥 Table shape at start
  // 0	1	2	3	4	5	6	7	8	9	10	11	12	13	14	15
  // 0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0
  // 1	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0
  // 2	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0
  // 3	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0
  // 4	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0

  // 02)=> i= values ke or j= capacity ke each iteration pr
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= capacity; j++) {
      // Capacity j	1	2	3	4	5	6	7	8	9	10	11	12	13	14	15
      // Item 1	0	0	0	0	0	0	0	0	0	60	60	60	60	60	60

      if (weights[i - 1] <= j) {
        console.log("comming j value:", j, "and is is:", i);
        dynamic_P[i][j] = Math.max(
          values[i - 1] + dynamic_P[i - 1][capacity - weights[i - 1]],
          dynamic_P[i - 1][j]
        );
      } else {
        dynamic_P[i][j] = dynamic_P[i - 1][j];
      }
    }
  }
  return dynamic_P;
}

// values , weights opr wali example se hi lelo
console.info(using_DP_KnapsackRecursive(values, weights, capacity));

// 15-11-2024:

// Memoization
// function fibSequence(n, memo = {}) {
//   if (n <= 2) return 1;

//   if (n in memo) return memo[n];
//   memo[n] = fibSequence(n - 1, memo) + fibSequence(n - 2, memo);
//   return memo[n];
// }

// console.info(fibSequence(5));

// 👇 Explanation:
// Without Memoization:
// fib(5)
// ├── fib(4)
// │   ├── fib(3)
// │   │   ├── fib(2)
// │   │   └── fib(1)
// │   └── fib(2)
// └── fib(3)
//     ├── fib(2)
//     └── fib(1)

// With Memoization:
// fib(5)
// ├── fib(4)
// │   ├── fib(3)  → memoized
// │   └── fib(2)  → memoized
// └── fib(3)  → memoized

// Tabulation (SalesMan Problem)
// how many paths to reach to the point?
// gridTraveler(2,3) => 3
// Paths:
// 1. right , right , down
// 2. right , down , right
// 1. down , right , right
// and base cases : 💥💥💥 👇
// gridTraveler(1,1)=>1 e.g:- aik bnda aik hi path =1
// gridTraveler(0,1)=>0 e.g:- zero bnda aik path =0
// gridTraveler(1,0)=>0 e.g:- aik bnda zero path =0
// gridTraveler(0,0)=>0 e.g:- zero bnda zero path =0
// gridTraveler(8,0)=>0 e.g:- 8 bnde zero path =0

// gridTraveler(3,3) => 4
// 💥 hr bar aik step move krne se ap table ko shrink krty jaty hen e.g:- pla step osne down move kia ab gridTraveler(2,3) => 3 phir osne right move krdia to ab gridTraveler(2,2) => 2 is trah ... Basically we are shrinking the effective size of playboy area the table/grid is getting smaller
// Paths:
// r,r,d,d
// d,d,r,r
// r,d,d,r
// d,r,d,r

// understanding programatically
// e.g:- gridTraveler(2,3)
// 2,3 => Left_side: Down (1,3) , Right_Side: Right (2,2)
// 1,3 => Left_side: Down (0,3) , Right_Side: Right (1,2)
// 2,2 => Left_side: Down (1,2) , Right_Side: Right (2,1)

// function gridTraveler(m, n) {
//   // m = no. of rows
//   // n = no. of cols
//   // so  if you want to move downward then decrease rows like 👉 gridTraveler(m-1, n)
//   // and  if you want to move right then decrease cols like 👉 gridTraveler(m, n-1)

//   if (m === 1 && n === 1) return 1;
//   if (m === 0 || n === 0) return 0;
//   return gridTraveler(m - 1, n) + gridTraveler(m, n - 1);
// }
// console.info(gridTraveler(3, 3)); // 6

// // Without Memoization
// function canSum(targetNum, arr) {
//   if (targetNum === 0) {
//     return true;
//   }
//   if (targetNum < 0) {
//     return false;
//   }

//   for (let num of arr) {
//     const remainder = targetNum - num;
//     if (canSum(remainder, arr) === true) {
//       // console.info([num, remainder]);
//       return true;
//     }
//   }
//   return false;
// }
// TC is n^m

// // With Memoization
// function canSum(targetNum, arr, memo = {}) {
//   if (targetNum in memo) return memo[targetNum];
//   if (targetNum === 0) {
//     return true;
//   }
//   if (targetNum < 0) {
//     return false;
//   }

//   for (let num of arr) {
//     const remainder = targetNum - num;
//     if (canSum(remainder, arr, memo) === true) {
//       // console.info([num, remainder]);
//       memo[targetNum] = true;
//       return true;
//     }
//   }
//   memo[targetNum] = false;
//   return false;
// }
// TC is now m*n
// console.info("res", canSum(7, [7, 14]));

// // Without Memoization
// function howSum(targetNum, arr) {
//   if (targetNum === 0) {
//     return [];
//   }
//   if (targetNum < 0) {
//     return null;
//   }

//   for (let num of arr) {
//     const remainder = targetNum - num;
//     const remainderResult = howSum(remainder, arr);
//     if (remainderResult !== null) {
//       return [...remainderResult, num]; // first iteration pr reminderResult [] array return kre ga.
//     }
//   }
//   return null;
// }
// TC is now n^m * m

// // With Memoization
// function howSum(targetNum, arr, memo = {}) {
//   if (targetNum in memo) return memo[targetNum];
//   if (targetNum === 0) {
//     return [];
//   }
//   if (targetNum < 0) {
//     return null;
//   }

//   for (let num of arr) {
//     const remainder = targetNum - num;
//     const remainderResult = howSum(remainder, arr, memo);
//     if (remainderResult !== null) {
//       memo[targetNum] = [...remainderResult, num];
//       return memo[targetNum]; // first iteration pr reminderResult [] array return kre ga.
//     }
//   }

//   memo[targetNum] = null;
//   return null;
// }

// console.info("res", howSum(7, [5, 3, 4, 7]));

// fib series (bottom-up approch)
function fibSeries(n) {
  const table = Array(n + 1).fill(0);
  table[1] = 1; // kind of base case
  // console.info(table);

  for (let i = 0; i <= n; i++) {
    table[i + 1] += table[i];
    table[i + 2] += table[i];
  }
  return table[n];
}
console.info(fibSeries(6));

// grid traveler problem
// function gridTraveler(m, n) {
//   const table = Array(m + 1)
//     .fill()
//     .map(() => Array(n + 1).fill(0));
//   table[1][1] = 1; //
//   // console.info(table);
//   for (let i = 0; i <= m; i++) {
//     for (let j = 0; j <= n; j++) {
//       const current = table[i][j];
//       // logic: right and bottom me current position ko fill krna hai

//       if (j + 1 <= n) table[i][j + 1] += current; // right side me add krdo
//       if (i + 1 <= m) table[i + 1][j] += current; // bottom side me add krdo
//       // console.info(table);
//     }
//   }
//   return table;
//   // console.info(table);
// }

// console.info(gridTraveler(3, 3));
