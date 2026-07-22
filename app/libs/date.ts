function padString(str: string) {
    if (str.length <= 1) {
        return `0${str}`
    } else {
        return str;
    }
}

function formatTime(date: Date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();

    let finalHours: string;
    let timeOfDay: string;

    // Checks if the hours need to be adapted to 12-hour format
    if (hours > 12) {
        finalHours = `${hours - 12}`;
        timeOfDay = "PM"
    } else {
        finalHours = `${hours}`;
        timeOfDay = "AM"
    }

    // Calls the method to append a '0' to the minutes if needed
    const finalMinutes = padString(`${minutes}`);

    // Returns the final formatted string
    return `${finalHours}:${finalMinutes} ${timeOfDay}`;
}

function formatDate(date: Date) {
    const month = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();
    
    // Month is offset by 1
    const finalMonth = padString(`${month + 1}`);
    const finalDay = padString(`${day}`);
    
    return `${finalMonth}/${finalDay}/${year}`;
}

export function getDisplayDate(date: Date) {
    const finalTime = formatTime(date);
    const finalDate = formatDate(date);
    
    return `${finalTime} ${finalDate}`;
}