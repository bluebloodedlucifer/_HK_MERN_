// ## Write to a file
// Using the fs library again, try to write to the contents of a file.
// You can use the fs library to as a black box, the goal is to understand async tasks.

const fs = require('fs')

fs.writeFile("easy/write.txt", "Hardwork Beats Talent \nWhen Talent Doesn't Work Hard", "utf-8", err => {
    if(err) throw err;
})
