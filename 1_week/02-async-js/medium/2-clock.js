// Using `1-counter.md` or `2-counter.md` from the easy section, can you create a
// clock that shows you the current machine time?

// Can you make it so that it updates every second, and shows time in the following formats - 

//  - HH:MM::SS (Eg. 13:45:23)

//  - HH:MM::SS AM/PM (Eg 01:45:23 PM)

let getTime = ()=>{
    console.clear();
    let currDate = new Date()
    let hours = currDate.getHours();
    hours = hours%12
    let minutes = currDate.getMinutes();
    let seconds = currDate.getSeconds();
    let ampm =   hours >= 12 ? 'pm' : 'am';
    console.log(hours, minutes, seconds, ampm);
    setInterval(getTime, 1000)
}

getTime()


