"use client"
/**
 * Appends a 0 to the front of the passed in string if its length is less than or equal to 1
 * @param {string} str The string that will be checked
 */
function padString(str: string) {
  if (str.length <= 1) {
    return `0${str}`;
  } else {
    return str;
  }
}

/**
 * Gathers the hour and minutes data from the passed in date and formats it.
 * Format: HH:MM AM/PM
 *
 * @param {Date} date The date to be formatted
 */
function formatTime(date: Date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  let finalHours: string;
  let timeOfDay: string;

  // Checks if the hours need to be adapted to 12-hour format
  if (hours > 12) {
    finalHours = `${hours - 12}`;
    timeOfDay = "PM";
  } else {
    finalHours = `${hours}`;
    timeOfDay = "AM";
  }

  // Calls the method to append a '0' to the minutes if needed
  const finalMinutes = padString(`${minutes}`);

  // Returns the final formatted string
  return `${finalHours}:${finalMinutes} ${timeOfDay}`;
}

/**
 * Gathers the year, day, and month data from the passed in date and formats it.
 * Format: MM/DD/YYYY
 *
 * @param {Date} date The date to be formatted
 */
function formatDate(date: Date) {
  const month = date.getMonth();
  const day = date.getDate();
  const year = date.getFullYear();

  // Month is offset by 1
  const finalMonth = padString(`${month + 1}`);
  const finalDay = padString(`${day}`);

  return `${finalMonth}/${finalDay}/${year}`;
}

/**
 * Parses the passed in date string and formats its date values for display
 * Format: HH:MM AM/PM MM/DD/YYYY
 *
 * @param {string} dateString The date string to be formatted
 */
export function getDisplayDate(dateString: string) {
  const date = new Date(dateString);
  const finalTime = formatTime(date);
  const finalDate = formatDate(date);

  return `${finalTime} ${finalDate}`;
}

/**
 * Formats the date to match the necessary pattern for an input value.
 * Format: YYYY-MM-DDTHH:MM
 *
 * @param date The date that will be formatted
 */
export function getDataTimeString(dateString: string) {
  // Parses the date string
  const date = new Date(dateString);

  // Gets the various date values
  const month = date.getMonth();
  const day = date.getDate();
  const year = date.getFullYear();

  // Month is offset by 1
  const finalMonth = padString(`${month + 1}`);
  const finalDay = padString(`${day}`);

  // Gets the various time values
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Calls the method to append a '0' to the minutes and hours if needed
  const finalMinutes = padString(`${minutes}`);
  const finalHours = padString(`${hours}`);

  return `${year}-${finalMonth}-${finalDay}T${finalHours}:${finalMinutes}`;
}
