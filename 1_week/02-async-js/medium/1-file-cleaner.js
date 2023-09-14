// ## File cleaner
// Read a file, remove all the extra spaces and write it back to the same file.

// For example, if the file input was
// ```
// hello     world    my    name   is       raman
// ```

// After the program runs, the output should be

// ```
// hello world my name is raman
// ```


const fs = require('fs')

fs.readFile("medium/clean-file.txt", "utf-8", (err, data) => {
    if(err) throw err;
    let readData = data.replace(/\s{2,}/g, ' ').trim();
    fs.writeFile("medium/clean-file.txt", readData, "utf-8", (err) => {
        if(err) throw err;
    })
});

