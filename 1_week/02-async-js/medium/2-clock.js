// Using `1-counter.md` or `2-counter.md` from the easy section, can you create a
// clock that shows you the current machine time?

// Can you make it so that it updates every second, and shows time in the following formats - 

//  - HH:MM::SS (Eg. 13:45:23)

//  - HH:MM::SS AM/PM (Eg 01:45:23 PM)

let counter1 = () => {
    // let count = new Date().toISOString();
    let count = new Date(SECONDS * 1000).toISOString().substring(11, 16);
    // console.log(`${count.getHours()}:${count.getMinutes()}:${count.getSeconds()}`);
    console.log(count);
    // setInterval(()=>{

    //     console.clear();
    //     console.log(count);
    //     count++;
    // }, 1000)
}

counter1();