/*
  Write a function `isAnagram` which takes 2 parameters and returns true/false if those are anagrams or not.
  What's Anagram?
  - A word, phrase, or name formed by rearranging the letters of another, such as spar, formed from rasp.

  Once you've implemented the logic, test your code by running
  - `npx jest ./tests/anagram`
*/

// Time O(n^2)
// Space O(n)
function isAnagram(str1, str2) {
  return str1.toLowerCase().split("").sort().join() === str2.toLowerCase().split("").sort().join();
}

// Another Approaches possible

/**
1. another one liner (assuming case senstivity)
return [...str1].sort().join('') === [...str2].sort().join('')
 
2. The standard solution using a map:

var isAnagram = function(s, t) {
    if (t.length !== s.length) return false;
    const counts = {};
    for (let c of s) {
        counts[c] = (counts[c] || 0) + 1;
    }
    for (let c of t) {
        if (!counts[c]) return false;
        counts[c]--;
    }
    return true;
};
 
*/


// .toLowerCase(): Time: O(n), Space: O(n)
// .split(): Time: O(n), Space: O(n)
// .sort(): Time: O(nlogn), Space: O(1)
// .join(): Time: O(n), Space: O(n)
module.exports = isAnagram;
