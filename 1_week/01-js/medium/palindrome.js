/*
  Implement a function `isPalindrome` which takes a string as argument and returns true/false as its result.
  Note: the input string is case-insensitive which means 'Nan' is a palindrom as 'N' and 'n' are considered case-insensitive.

  Once you've implemented the logic, test your code by running
  - `npx jest ./tests/palindrome`
*/

function isPalindrome(str) {
  let temp = str.toLowerCase().replace(/[\s?,.!]/g, '');
  let i = 0, j = temp.length - 1;

  console.log(temp);
  while(i<j){
    if(temp[i++] != temp[j--]) return false;
  }
  return true;
}
 module.exports = isPalindrome;
