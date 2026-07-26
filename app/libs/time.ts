/**
   * Calculates the number of milliseconds for the number of minutes passed in.
   *
   * @param {number} minutes The number of minutes that will be converted to milliseconds
   * @returns {number} The calculated number of milliseconds, if the passed in value is less than 1 0 is returned
   */
export function minutesToMilliseconds(minutes: number): number {
    if (minutes > 0) {
        // Times the minutes by 60000, 1 minute = 60000
        const milliseconds = minutes * 60000 
        return milliseconds
    } else {
        // Returns 0 if the value is less than 1
        return 0;
    }
}