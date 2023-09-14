/*
  Implement a function `calculateTotalSpentByCategory` which takes a list of transactions as parameter
  and return a list of objects where each object is unique category-wise and has total price spent as its value.
  Transaction - an object like { itemName, category, price, timestamp }.
  Output - [{ category1 - total_amount_spent_on_category1 }, { category2 - total_amount_spent_on_category2 }]

  Once you've implemented the logic, test your code by running
  - `npx jest ./tests/expenditure-analysis`
*/

function calculateTotalSpentByCategory(transactions) {
  const res = [];
  // let mp = new Map();
  let mp = {};
  // for(trans of transactions){
  //   if(mp.has(trans.category)){
  //     let temp = mp.get(trans.category) + trans.price;
  //     mp.set(trans.category, temp);
      
  //   }else{
  //     mp.set(trans.category, trans.price)
  //   }
  // }
  for(let i = 0; i<transactions.length; i++){
    let t = transactions[i];
    if(mp[t.category]){
      mp[t.category] = mp[t.category] + t.price;
    }else{
      mp[t.category] = t.price;
    }
  }
  console.log(mp);

  // for(const [key, value] of mp){
  //   res.push({category: key, totalSpent: value});
  // }
  for(const key of Object.keys(mp)){
    res.push({category: key, totalSpent: mp[key]});
  }
  return res;
}

module.exports = calculateTotalSpentByCategory;
