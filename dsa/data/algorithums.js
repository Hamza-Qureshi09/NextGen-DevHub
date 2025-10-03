// 🔥
// 01 Swap Algorithum
// 1. understand problem => hmen 2 numbers ko swap krna hai

// 2. Break Down the Problem => 2 numbers ko swap krna hai num1 ki jgah num2 dikhy or num2 ki jgah num1.

// 3. Arrange => swapping kely aik temp variable declare kren gy jo refrence hold kre ga num1 ya num2 ka or phir num1 ko num2 se or num2 ko num1 se replace krden gy.

// 4. Find out possible solution =>👇(below code is possible solution)

function swap_numbers(num1, num2) {
  let temp;
  temp = num2;
  num2 = num1;
  num1 = temp;
  return {
    swapped_numbers: {
      num1,
      num2,
    },
  };
}
console.info(swap_numbers(2, 3));
// Time Complexity will be:
// fn=  O(1)

// 🔥
// 02 Bubble sort (for ascending order of sorting)
// Algorithum:

// 1. understand problem => hmen array ko sort krna hai ascending order me hr elem agly elem se chota ho ya oske brabr ho at least

// 2. Break Down the Problem => 2 numbers ko check kren gy loop me ke kia phla number dosre se bra hai agr hai to osko dosre se replace krdo or dosre ki jgah phla dal do means swap krdo. is process ko kro jb tk last elem tk sorting na hojy

// 3. Arrange => hmne swapping krni hai loop me. hm ne ye record bhi maintain krna hai ke akhri elment konsa sort hoa hai jo bhi hoa ho osse phly phly tk loop chly take sorted elem ko na chera jay. 2 loop chlao 1st loop ki condition (a<n-1) mtlb ke arr ki length mese -1 isse hme index shi milen gay ku ke indexes array me 0 se start hote hen,  2nd loop me condition (b<n-1-a) -a krne se ye maintain rhy ga ke akhri is elem pr filhal sorting hogai hai, or n-1 isly ke swap krty wqt hm 2 number len gay arr[b] or arr[b+1] to last elem to automatically ara hoga.

// 4. Find out possible solution =>👇(below code is possible solution)

// 💥 you can just reverse the condition from this arr[b] < arr[b + 1] to arr[b] > arr[b + 1] now it will be descending sort algorithum also you can use this for string sorting. the string sorting will happen based on ascii values

// Program of bubble sort
function bubble_sort(arr, arrLength) {
  // if arr length is 1 it is already sorted
  if (arr.length < 2) {
    console.info("Array less than 2 is already sorted array");
    return;
  }
  let a, b, temp;
  for (a = 0; a < arrLength - 1; a++) {
    // the last element will already be sorted
    for (b = 0; b < arrLength - 1 - a; b++) {
      //avoid unnecessary comparisons for the last sorted elements.
      if (arr[b] > arr[b + 1]) {
        temp = arr[b];
        arr[b] = arr[b + 1];
        arr[b + 1] = temp;
      }
    }
  }
  console.info(arr);
  return arr;
}
const arr1 = [1, 1, 34, 2, 4, 9, 6, 99, 6.4];
bubble_sort(arr1, arr1.length);

// Time Complexity will be:
// fn= (n or (n-1) for 1st loop) n-1-a) so O(n^2)

// Best Case: If the array is already sorted, the algorithm can stop early after one pass.
// Average Case:  In a random order, the algorithm completes a full set of passes.
// Worst Case:  In reverse order, the algorithm requires the maximum number of comparisons to sort the array completely.

// 🔥
// 03 Insertion sort (for ascending order of sorting)
// Algorithum:(isme hm start me ye smjh kr chlty hen ke phla elem sorted hai)

// 1. understand problem => hmen array ko sort krna hai ascending order me hr elem agly elem se chota ho ya oske brabr ho at least

// 2. Break Down the Problem => hmne smjho array ko 2 portion me tora aik side pr sorted array jisme initially asume krty hen phla elem phli iteration me sorted hai 2nd section unsorted array. unsorted array ka hr iteration pr unsorted elem sorted array se compare hoga or sorted array me shi jga pr jake place hoga isme right to leftward sortion hogi or after bachward looping is done hm unsorted array ke elem ko replace krden gy last sorted elem se

// 3. Arrange => hmne shifting or insertion krni hai loop me. hr element ko compare kren gy sorted section se or from right to left hi move hoga or tb tk shift kren gy jb tk large elem sorted array me shi jgah pr nhi chla jata

// 4. Find out possible solution => 👇(below code is possible solution)

// program of insertion sort
function insertion_sort(arr, arrLength) {
  if (arrLength < 2) {
    console.info("Array with fewer than two elements is already sorted.");
    return;
  }

  for (let a = 1; a < arrLength; a++) {
    let num = arr[a]; // current unsorted elem to be checked / inserted into sorted array (1)
    let b = a - 1; // index of last sorted array elem (7)

    // loop will run backward in sorted array untill akhri index na ajy sorted array me b>=0 and jb tk current unsorted elem ko sorted array me shi jgah pr place na krde
    while (b >= 0 && arr[b] > num) {
      arr[b + 1] = arr[b]; // unsorted array me shifting hori hai yha means (unsorted array me sorted array ka elem replce hora hai tb tk jb tk arr[b] > num)
      b--;
    }

    // Inserting num at the Correct Position here
    arr[b + 1] = num;
  }
}
const arr2 = [7, 1, 34, 2, 4, 9, 6, 99, 6.4, 3];
insertion_sort(arr2, arr2.length);

// Time Complexity will be:
// fn=  O(n^2)

// 🔥
// 04 Tokenization (text analysis to break down a text into smaller units called tokens(words, phrases, symbols))
// Algorithum: Convert Paragraphs into Sentences

// 1. understand problem => Convert Paragraphs into Sentences paragraph me .,!?... is trah ke letters ko dhondna hai

// 2. Break Down the Problem => paragraph to sentence conversion kely paragraph me .,!?... is trah ke letters ko dhondna hai jaha milen whi aik refrence array me push krdo wha tk ka sentence or sath hi helperSentence variable ki value "" krdo take agle sentece ko store krsko shi treeqy se.

// 3. Arrange => paragraph bnao aik osko function me pass kro aik static endcharacters ki list bnao or aik loop chlao jo paragraph ke hr letter pr chly ga match krwao letter ko end characters ki array se ke paragraph khi pr .,;: is trah ke letter hold krra hai aik new array me push krdo or baqi bchy hoy paragraph ko bhi add krdo

// 4. Find out possible solution => 👇(below code is possible solution)

// program of paragraph to sentences
function simpleTokenization(paragraph) {
  const endCharacters = [".", "!", "?", ",", ";", ":", "..."];
  let sentences = [];
  let sentence = "";

  for (const char of paragraph) {
    sentence = sentence + char;

    if (endCharacters.includes(char)) {
      sentences.push(sentence.trim().slice(0, -1));
      sentence = "";
    }
  }
  if (sentence) {
    sentences.push(sentence.trim());
  }
  return sentences;
}
const paragraph =
  "Hello! This is a simple example. Let's see how it works. Have fun! ok got it";
const sentences = simpleTokenization(paragraph);
console.log("Sentences:", sentences);

// Time Complexity will be:
// fn=  O(n)

// 🔥
// 05 Tokenization (text analysis to break down a text into smaller units called tokens(words, phrases, symbols))
// Algorithum: Convert Sentences into Words

// 1. understand problem => hmen sentence ko words me convert krna hai

// 2. Break Down the Problem => hr word ke akhir me kuch na kuch asa hota hai jo btata hai ke yha word end hora hai e.g:- " " ,".","...","'" hmne inhi letters ko dhondna hai or sentence to words conversion krni hai.

// 3. Arrange => sentences ki array pr 1st loop chlao 2nd loop is sentence ke hr character ko get krne kely chly ga hr letter se murad " ", "'", '"", "" special letters or words hen jha is trah ke letters milen whi ref currentword ko aik refrence array of words me dal do or agr na mile to else me  ref currentword me concat krwaty jao.

// 4. Find out possible solution =>👇(below code is possible solution)

// program of sentences to words
function sentenceToWords(sentences) {
  const words = [];
  const seprationCharacters = [" ", "'", '"', "!", "?", ",", ";", ":", "..."];
  for (const sentence of sentences) {
    let currentWord = "";
    for (const char of sentence) {
      if (seprationCharacters.includes(char)) {
        if (currentWord) {
          words.push(currentWord);
          currentWord = "";
        }
      } else {
        currentWord += char;
      }
    }
    if (currentWord) {
      words.push(currentWord);
    }
  }
  return words;
}
const allWords = sentenceToWords(sentences);
//   sentences.map(sentence => sentenceToWords(sentence));
console.log("Words in each sentence:", allWords);

// Time Complexity will be:
// fn=  O(n) despite having two loops, lkn each character in the sentences array process hoga aik hi bar phly sentence me 2nd loop sirf phly sentence pr hi chly ga hn agr again sentences ki array pr chlaty to phir yha n^2 ho jati time complexity.

// 🔥
// 06 Fibonacci sequence (Creation)
// Algorithum: Fibonacci sequence [0,1,1,2,3,5,8] (Creation)

// 1. understand problem => isme hmne fibonacci sequence nkalna hai. mtlb each number is the sum of previous two numbers except of first 2 numbers ku ke phly 2 se hi to sequence bnna start hoga

// 2. Break Down the Problem => hmne ye track krna hai ke last 2 elements konse hen onka sum krna hai or wo sum new index pr push krna hai lkn sbse phly atleast 2 numbers ki array chahy

// 3. Arrange => aik empty array create kren gy or loop chla kr phly 2 numbers ko just push kren gy phir baqi numbers kely hm array ke last mese (first or second numbers) means last two numbers ko sum krke new element push kren gy

// 4. Find out possible solution => 👇(below code is possible solution) 1 loop chly ga or fibonaci series generate kre ga

// Program of fibonaci sequence (Creation)
function fibonacii_sequence() {
  let arr = [];
  for (let a = 0; a < 10; a++) {
    // for first 2 numbers
    if (a < 2) {
      arr.push(a);
    } else {
      const firstElem = arr[arr.length - 2];
      const secondElem = arr[arr.length - 1];
      arr.push(firstElem + secondElem);
    }
  }
  console.info(arr, "fibonaci");
}
fibonacii_sequence();

// Time Complexity will be:
// fn= (n) so O(n)

// Best Case: O(1) (for N=0 or N=1)
// Average Case: O(N)
// Worst Case: O(N)

// 🔥
// 07 Factorial of numbers
// Algorithum: Factorial of number 5! is 120

// 1. understand problem => isme hmne aik number ka factorial nkalna hai for example 5 ka factorial 120 bnta hai. 5!=5*4*3*2*2*1=120

// 2. Break Down the Problem => agr number 5 hai for example to loop chlay jo hr iteration pr last store element se multiple kre

// 3. Arrange => loop chlao or pichly store value se multiply krty jao or last store value ko newly multiplied value se replace krty jao

// 4. Find out possible solution => 👇(below code is possible solution)

// Program of factorial
function factorial(num) {
  if (num < 0) {
    console.info("Factorial is not defined for negative numbers.");
    return;
  }
  let result = 1;
  for (let a = 1; a <= num; a++) {
    result = result * a;
  }
  console.info(result);
}
factorial(5);

// Time Complexity will be:
// fn= (n) so O(n)

// Best Case: O(1) (for N=0 or N=1)
// Average Case: O(N)
// Worst Case: O(N)

// 🔥
// 08 Binary Search
// Algorithum: Binary Search

// 1. understand problem => aik number find krna hai e.g:- 12 or array hai 5000 ya 50000 numbers ki [1,2,3,....5000] to kese kro gy efficiently ? Binary search is efficient for large arrays.

// 2. Break Down the Problem => 12 number find krna hai array bht bri hai agr sequence me jayen gy means left to right or right to left time zyada lgy ga to hm divide and conqure ka principle use kren gy or hme array ko sort bhi krna hai phly

// 3. Arrange => array ko sort krlo , sorted array ka mid point find krlo, ab check kro ke jo number find krre ho wo mid elem ki left side pr hai ya right pr agr right hai to left side including mid point ignore krdo or recursivly is function ko again call kro ye procedure hota rhy ga due to recursive function lkn aik point pr midElem===lookupNum ke whi stop krke true return krdo

// 4. Find out possible solution => 👇(below code is possible solution)

// Program of Binary Search
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
const lookingUpThisNumber = -2;
const arr7 = [1, 1, 34, 2, 4, 9, 6, 99, 6.4];
const sorted_arr = bubble_sort(arr7, arr7.length);
binary_search(sorted_arr, 0, sorted_arr.length - 1, lookingUpThisNumber);

// Time Complexity will be:
// fn= O(log n)

// Best Case: O(1) when the middle element is the target number.
// Average Case: O(log n)
// Worst Case: O(log n)

// 🔥
// 09 Merge Sort
// Algorithum: Merge Sort

// 1. understand problem => aik array ko efficiently sort krna hai maybe array bri ho, it may contain a large number of elements (e.g., 5000 or 50000).

// 2. Break Down the Problem =>  array bht bri hai, sorting it sequentially (left to right) would be inefficient. to hm divide and conqure ka principle use kren gy, splitting the array into smaller parts, sorting them, and then merging them back together.

// 3. Arrange => array ko sort krlo, recursively sub arrays sort hoti rhen gi untill aik elem na rh jay ro wo sorted hoga, sorted/sub sorted array ka mid point find krlo, or oski base pr further array ko divide krlo 2 parts me hr sub array ki sorting ke time aik sub array ka element rh jay ga wo hm merge kren gy result array me.

// 4. Find out possible solution => 👇(below code is possible solution)

// Program of Merge Sort (Divide & conqure approch)
function merge_sort(arr) {
  if (arr.length < 2) {
    // console.info("Array less than 2 is already sorted array");
    return arr;
  }

  const MidIndex = Math.floor(arr.length / 2); //slice array into half
  const leftArr = arr.slice(0, MidIndex);
  const rightArr = arr.slice(MidIndex, arr.length);

  return merge(merge_sort(leftArr), merge_sort(rightArr)); // merge is O(n) and merge_sort is   // O(log n)
}
// compare elements of leftArr with righArr
function merge(leftArr, rightArr) {
  let resultArr = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < leftArr.length && rightIndex < rightArr.length) {
    if (leftArr[leftIndex] < rightArr[rightIndex]) {
      resultArr.push(leftArr[leftIndex]);
      leftIndex += 1;
    } else {
      resultArr.push(rightArr[rightIndex]);
      rightIndex += 1;
    }
  }
  return resultArr
    .concat(leftArr.slice(leftIndex))
    .concat(rightArr.slice(rightIndex));
}

const arr8 = [1, 1, 34, 2, 4, 9, 6, 99, 6.4];
console.info(merge_sort(arr8));

// Time Complexity will be:
// fn= O(n log n)

// Best Case: O(n log n)
// Average Case: O(n log n)
// Worst Case: O(n log n)

// 🔥
// 10 palindorm algorithum
// Algorithum: palindorm algorithum

// 1. understand problem => palindorm means wo words jinko sedha prhen ya olta wo same hi prhy jate hen e.g: madam or racecar hmne find krna hai ke given string is palindorm hai ya nhi.

// 2. Break Down the Problem =>  To check if a string is a palindrome, you need to compare the original string with its reversed version of that string. if both are same means it is palindorm otherwise not

// 3. Arrange => string ka ref save krlo aik variable me or aik loop chla kr is string ka reverse nkal kr save krlo, last me actual string or reverse string ko compare krlo agr same hen to palindorm hai otherwise nhi

// 4. Find out possible solution => 👇(below code is possible solution)

function palindorm(str) {
  const actualStr = str.toLowerCase();
  let reverseStr = "";
  for (let i = str.length - 1; i >= 0; i--) {
    reverseStr += str[i].toLowerCase();
  }
  return reverseStr === actualStr;
}
console.info(palindorm("Racecar"));
// so time complexity is O(n).

// 🔥
// 11 Max Char Algorithum
// Algorithum: Max Char Algorithum

// 1. understand problem => hmne wo character find krne hen jo zyada bar string me are hon e.g: hello world me (l) 3 bar aya hai.

// 2. Break Down the Problem =>  loop chlao or spaces ko ignore kro or wo character jo zyada bar ara hai osko find kro

// 3. Arrange => hm object (key-value) datastructure use kren gy isme keys unique hoti hai to easily help hogi hme character count krne me loop me object ki key character  hoga or value 1 hogi agr key exist krti hai phly se to 1 me +1 krdo or sath hi 2 or variables leke ye track krlo ke konsa word zyada bar ara hai , or kitni bar wo aya hai

// 4. Find out possible solution => 👇(below code is possible solution)

function found_max_char(str) {
  let maxCharObj = {},
    maxCount = 0,
    maxChar = "";
  const unwantedWordsList = [" ", ""];

  for (let i = 0; i < str.length; i++) {
    const char = str[i].trim();
    if (!unwantedWordsList.includes(char)) {
      maxCharObj[char] = maxCharObj[char] ? maxCharObj[char] + 1 : 1;

      if (maxCharObj[char] > maxCount) {
        maxChar = char;
        maxCount = maxCharObj[char];
      }
    }
  }
  console.info(`The Word (${maxChar}) arrive ${maxCount} times.`);
}
found_max_char("my name is hamza qureshi. okay!");
// so time complexity is O(n).

// 🔥
// 12 Chunk Array Algo / sub array algo
// Algorithum: Chunk Array Algo / sub array algo

// 1. understand problem => hmne array ko sub arrays me convert krna hai (chunks) me, diye gay size ke mtabiq

// 2. Break Down the Problem =>  loop chlao origin array pr or track kro ke last sub array konsi insert hoi hai initially it will be empty to aik ref array bna kr osme subarray with that iterated element dal do jb sub array size se match na kre to last elem which is sub array osme push krdo

// 3. Arrange => Initialize an empty array newArr to hold the resulting chunks. loop chlao, check kro ke last subarray hai or kia os last subarray ka size given specified size ke brabr hai? agr hai means ya to full hai ya phir exist hi ni krti abhi to newArr me subarray bna kr push krdo otherwise Otherwise, add the current element to the existing last subarray.

// 4. Find out possible solution => 👇(below code is possible solution)

function chunk_array(arr, size) {
  let newArr = [];
  for (let i = 0; i < arr.length; i++) {
    const last = newArr[newArr.length - 1]; // holding ref of actual array last element which is sub array

    if (!last || last.length === size) {
      newArr.push([arr[i]]);
    } else {
      last.push(arr[i]);
    }
  }
  return newArr;
}
console.info(chunk_array([1, 2, 3, 4, 5], 2));
// so time complexity is O(n).

// 🔥
// 13 Anagram Algorithum
// Algorithum: Anagram Algorithum

// 1. understand problem => hmne ye dekhna hai ke 2 strings anagram hen ya nhi. anagram mtlb ke 2 different words lkn andr characters same hen

// 2. Break Down the Problem => Normalize both strings by removing spaces and converting all characters to lowercase. length check kro agr 2no ki brabry nhi to phly hi return krdo ke ye anagram nhi. phly loop me str1 pr kam kro or (frequency count ) mtlb ye letter string me kitni bar ara hai 2nd loop me so (frequency count) ko decrease krty jao agr end pr zero ho mtlb sare hogay to ye anagram hai otherwise nhi hai.

// 3. Arrange => Create a frequency count using an object (or map) to store how many times each character appears in the first string and adjust this count with characters from the second string.

// 4. Find out possible solution => 👇(below code is possible solution)

function areAnagramsUsingCount(str1, str2) {
  // Normalize the strings
  const normalizedStr1 = str1.replace(/\s+/g, "").toLowerCase();
  const normalizedStr2 = str2.replace(/\s+/g, "").toLowerCase();

  // Check if the lengths are different
  if (normalizedStr1.length !== normalizedStr2.length) {
    return false;
  }

  // Create frequency count for the first string
  const charCount = {};

  for (const char of normalizedStr1) {
    charCount[char] = (charCount[char] || 0) + 1;
  }

  // Decrease the count for the second string
  for (const char of normalizedStr2) {
    if (!charCount[char]) {
      return false;
    }
    charCount[char] -= 1;
  }

  return true; // If all counts are zero, they are anagrams
}

// Test the function
console.log(areAnagramsUsingCount("listen", "silent")); // Output: true
console.log(areAnagramsUsingCount("hello", "world")); // Output: false
// so time complexity is O(n) because of loop

// 🔥
// 14 Fabonacii Sequence (nth sum)
// Algorithum: Fabonacii Sequence (nth sum)

// 1. understand problem => hmne fibonacii sequence me nth number ko return krwana hai means jo number hm pass kren gy os point pr fibonacii sequence me kia value aygi?

// 2. Break Down the Problem => hmne nth number pr dekhna hai ke fibonacii sequence ki kia value hai . fibonacii me last 2 numbers se 3rd number bnta hai or ye chlta rhta hai agy tk

// 3. Arrange => hmne 0 or 1 pr respectively 0 or 1 return krna hi then recursive call krty rhen gy n-1 + n-2 to get nth fibonaci number.

// 4. Find out possible solution => 👇(below code is possible solution)

function fibonacii_sequence2(n) {
  if (n <= 1) {
    return n;
  }
  return fibonacii_sequence2(n - 1) + fibonacii_sequence2(n - 2);
}

console.info("fibo ganza", fibonacii_sequence2(7));
// so fn=O(2^n)

// 🔥
// 15 Reverse String (Addition)
// Algorithum: Reverse String (Addition)

// 1. understand problem => aik string input hai hmne iska reverse return krna hai

// 2. Break Down the Problem => normal string ka reverse nkalna hai

// 3. Arrange => aik loop chlao from end to the begining of string. reverse string mil jay gi

// 4. Find out possible solution => 👇(below code is possible solution)

function reverse_string(str) {
  let revStr = "";
  for (let i = str.length - 1; i >= 0; i--) {
    revStr += str[i];
  }
  return revStr;
}
console.info(reverse_string("hamza"));
// so fn=O(n)

// 🔥
// 16 Count Unique Numbers (Addition)
// Algorithum: Count Unique Numbers (Addition)

// 1. understand problem => aik string input hai hmne iska reverse return krna hai

// 2. Break Down the Problem => normal string ka reverse nkalna hai

// 3. Arrange => aik loop chlao from end to the begining of string. reverse string mil jay gi

// 4. Find out possible solution => 👇(below code is possible solution)

function count_unique_numbers(arr) {
  let elemCount = {};
  for (let i = 0; i < arr.length; i++) {
    const element = arr[i];
    elemCount[element] = elemCount[element] ? elemCount[element] + 1 : 1;
  }
  return elemCount;
}
console.info(count_unique_numbers([1, 2, 3, 4, 5, 1, 3, 2, 3, 45, 5, 5, 4, 1]));
// so fn=O(n)

// 🔥
// 17 Capitalize String
// Algorithum: Capitalize String

// 1. understand problem => Capitalize the first letter of each word in a input string. e.g:- "hello hamza how are you? i hope you are fine."

// 2. Break Down the Problem => hmne ye track krna hai ke kis letter ko capitalize kren, hmne wo words define krne hen jinki base pr seperate hoty hen words paragraph me.

// 3. Arrange => seperate_words ki array iski base pr paragraph ko seperate krna hai. aik variable hint/flag ka bna lo jaha pr seperate_words milen is hint ko true krdo means next iteration pr agla word start hora hai osko pkr kr uppercase bna do or else me normal treat kro baqio ko.

// 4. Find out possible solution => 👇(below code is possible solution)

function Capitalize_String(str) {
  const seperate_words = [" ", ".", ";", ":", "...", '"'];
  let CapitalizeString = "";
  let CapitalizeNext = true;
  for (let i = 0; i < str.length; i++) {
    const element = str[i];

    if (CapitalizeNext && element >= "a" && element <= "z") {
      CapitalizeString += element.toUpperCase();
      CapitalizeNext = false;
    } else {
      CapitalizeString += element;
    }
    if (seperate_words.includes(element)) {
      CapitalizeNext = true;
    }
  }
  return CapitalizeString;
}
console.info(
  Capitalize_String("hello hamza how are you? i hope you are fine.")
);
// so fn=O(n)

// 🔥
// 18 Ceaser Cipher
// Algorithum: Ceaser Cipher

// 1. understand problem => hmne caeser cipher ko implement krna hai mtlb ye ke e.g:- (Hamza) string hai or apne sth hi iska shift/key pass krdi hai mtlb 5 to (H) se agy 5 word (M) ata hai to ye H ko M me convert krke return kre

// 2. Break Down the Problem => hmne shifting a-z krni hai dosre letters including ' ' ko bhi as-it-is add krdo, baqi normal letters pr shifting krni hai.

// 3. Arrange => aik static a-z array required hai. loop me curent elem or shifted elem ko get krnai hai or static array se iska modular nkal lena hai

// 4. Find out possible solution => 👇(below code is possible solution)

function ceaser_cipher(str, shift) {
  const atoz = "abcdefghijklmnopqrstuvwxyz";
  str = str.toLowerCase();
  let response = "";

  for (let i = 0; i < str.length; i++) {
    const element = str[i];
    if (atoz.includes(element)) {
      const idx = atoz.indexOf(element);
      const shiftedElemIndex = (idx + shift) % 26;
      response += atoz.charAt(shiftedElemIndex);
    } else {
      response += element; //non alphabet characters as-it-is
    }
  }
  return response;
}
console.info(ceaser_cipher("Hamza", 4));
// so fn=O(n)

// 🔥
// 19 Count Vowels
// Algorithum: Count Vowels

// 1. understand problem => hmne given string me se ye check krna hai ke kitny vowels hen is string me

// 2. Break Down the Problem => vowels define kro small or upper letters me or aik counter bhi define kro which is initialzed with 0

// 3. Arrange => aik loop chlao or incomming string ko vowels me check krlo agr str ka koi letter available hai to count increase krdo simple

// 4. Find out possible solution => 👇(below code is possible solution)

function countVowels(str) {
  const vowels = "aeiouAEIOU";
  let vowelCount = 0;

  for (let i = 0; i < str.length; i++) {
    const element = str[i];
    if (vowels.includes(element)) {
      vowelCount++;
    }
  }
  return vowelCount;
}
console.info(countVowels("hamza")); // Expected output: 2
console.info(countVowels("World")); // Expected output: 1
console.info(countVowels("Programming")); // Expected output: 3
// so fn=O(n)
// 🔥
// 20 sum two numbers
// Algorithum: sum two numbers

// 1. understand problem => 2 numbers ko sum krna hai

// 2. Break Down the Problem => 2 numbers chachy, or inka sum nkalna hai.

// 3. Arrange => plus krdo 2 numbers ko.

// 4. Find out possible solution => 👇(below code is possible solution)

function sum(num1, num2) {
  return num1 + num2;
}
console.info(sum(2, 5));
// so fn=O(1)

// just for understanding above function which is merge sort
// function nLogNFunc(n) {
//   let y = n;
//   while (n > 1) {
//     n = Math.floor(n / 2);
//     for (let i = 1; i <= y; i++) {
//       console.info(i, n);
//     }
//   }
// }

// nLogNFunc(10);

// O(n*m)
// function words(arr, arr2) {
//   for (let i = 0; i < arr.length; i++) {
//     for (let j = 0; j < arr2.length; j++) {
//       console.info(arr[i], "   ", arr2[j]);
//     }
//   }
// }
// words(["a", "b"], ["c", "d", "e"]);
