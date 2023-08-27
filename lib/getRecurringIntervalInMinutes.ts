/**
 * Gets the recurring interval in minutes based on the provided array of minutes.
 *
 * @param {number[]} minutes - An array of minutes.
 * @param {boolean} isOnlyNumber - Whether to return only numbers
 * @returns {string} - The recurring interval description.
 */
function getRecurringIntervalInMinutes(minutes: number[],isOnlyNumber:boolean): string {
    if (!Array.isArray(minutes) || minutes.length === 0) {
        return "No minutes specified";
    }

    if (minutes.length === 1 && minutes[0] === -1) {
        return "Special response for -1";
    }

    // Find the greatest common divisor (GCD) of the given minutes
    function gcd(a: number, b: number): number {
        return b === 0 ? a : gcd(b, a % b);
    }

    const sortedMinutes = minutes.slice().sort((a, b) => a - b);
    const intervalGCD = sortedMinutes.reduce(gcd);

    if (intervalGCD >=1) {
        if(isOnlyNumber){
            return intervalGCD.toString();
        }else{
            return `every ${intervalGCD} minutes`;
        }
    }else if(intervalGCD===0){
        return "0"
    }
     else {
        return "No recurring interval";
    }
}


export default getRecurringIntervalInMinutes

