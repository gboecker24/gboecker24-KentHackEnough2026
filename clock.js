function startTime() {
    const today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('clock').innerHTML = h + ":" + m + ":" + s;
    setTimeout(startTime, 1000); // Update the time every 1000 milliseconds (1 second)
}

function checkTime(i) {
    if (i < 10) {i = "0" + i}; // Add zero in front of numbers < 10 (e.g. 5 -> 05)
    return i;
}