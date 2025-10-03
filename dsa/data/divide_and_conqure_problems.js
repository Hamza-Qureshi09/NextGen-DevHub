// find max no. from the given array using normal method so TC is O(n)
function findMax(arr) {
  let maxNumber = 0;

  for (let i = 0; i < arr.length; i++) {
    const element = arr[i];
    if (element > maxNumber) {
      maxNumber = element;
    }
  }
  return maxNumber;
}

const sampleArr1 = [1, 22, 2, 4, 6, 8, 33, 22];
console.info(findMax(sampleArr1));

// now using divide & conqure
function findMaxUsingDivideAndConqure(arr) {
  if (arr.length === 1) {
    return arr[0];
  }
  const mid = arr.length / 2;
  const leftArr = arr.slice(0, mid);
  const rightArr = arr.slice(mid, arr.length);
  const maxLeft = findMaxUsingDivideAndConqure(leftArr);
  const maxRight = findMaxUsingDivideAndConqure(rightArr);
  return maxLeft > maxRight ? maxLeft : maxRight;
}
console.info(findMaxUsingDivideAndConqure(sampleArr1));

function findMax2(arr, left = 0, right = arr.length - 1) {
  if (left === right) {
    return arr[left];
  }
  const mid = Math.floor((left + right) / 2);
  const maxLeft = findMax2(arr, left, mid);
  const maxRight = findMax2(arr, mid + 1, right);

  return Math.max(maxLeft, maxRight);
}

// Example usage
console.log("The maximum number is:", findMax2(sampleArr1));

function binary_search(arr, start, end, lookUpNum) {
  if (start > end) {
    console.info("Number not found.");
    return false;
  }

  const MidIndex = Math.floor((start + end) / 2); // 0+8/2=>4 1st time (slice array into half)
  const MidElem = arr[MidIndex];

  if (lookUpNum === MidElem) {
    console.info(`Found the number: ${MidElem}`);
    return true;
  }

  // Recursively search in the right half
  if (lookUpNum > MidElem) {
    console.info("right side", MidElem);
    return binary_search(arr, MidIndex + 1, end, lookUpNum);
  }

  // Recursively search in the left half
  if (lookUpNum < MidElem) {
    console.info("left side", MidElem);
    return binary_search(arr, start, MidIndex - 1, lookUpNum);
  }
}
const lookingUpThisNumber = 99;
const arr7 = [1, 1, 34, 2, 4, 9, 6, 99, 6.4];
binary_search(arr7, 0, arr7.length - 1, lookingUpThisNumber);

// Karatsuba multiplication function
function karatsuba(x, y) {
  // If either number is a single digit, return the direct multiplication
  if (x < 10 || y < 10) {
    return x * y;
  }

  // Convert numbers to strings for easier manipulation
  let xStr = x.toString();
  let yStr = y.toString();

  // Find the length of the numbers
  let n = Math.max(xStr.length, yStr.length);
  console.info(n, "max");

  // Split the numbers into two halves
  let half = Math.floor(n / 2);
  console.info(half, "half");

  // First half and second half of x and y
  let x1 = parseInt(xStr.slice(0, xStr.length - half)); // First half of x
  let x0 = parseInt(xStr.slice(xStr.length - half)); // Second half of x
  let y1 = parseInt(yStr.slice(0, yStr.length - half)); // First half of y
  let y0 = parseInt(yStr.slice(yStr.length - half)); // Second half of y

  // Recursively calculate the three products
  let z2 = karatsuba(x1, y1); // z2 = x1 * y1
  let z0 = karatsuba(x0, y0); // z0 = x0 * y0
  let z1 = karatsuba(x1 + x0, y1 + y0) - z2 - z0; // z1 = (x1 + x0) * (y1 + y0) - z2 - z0
  console.info(z1);

  // Combine the three products using the Karatsuba formula
  return z2 * Math.pow(10, 2 * half) + z1 * Math.pow(10, half) + z0;
}

// Example usage:
let x = 1234;
let y = 5678;

console.log(
  `Karatsuba multiplication result of ${x} and ${y}:`,
  karatsuba(x, y)
);
