/**
 * Gets the recurring interval in hours based on the provided array of hours.
 *
 * @param {number[]} hours - An array of hours.
 * @returns {string} - The recurring interval description.
 */
function getRecurringIntervalInHours(hours: number[],isOnlyNumber: boolean): string {
    if (!Array.isArray(hours) || hours.length === 0) {
        return "No hours specified";
    }

    if (hours.length === 1 && hours[0] === -1) {
        return "Special response for -1";
    }

    // Find the greatest common divisor (GCD) of the given hours
    function gcd(a: number, b: number): number {
        return b === 0 ? a : gcd(b, a % b);
    }

    const sortedHours = hours.slice().sort((a, b) => a - b);
    const intervalGCD = sortedHours.reduce(gcd);

    if (intervalGCD >= 1) {
        if(isOnlyNumber){
            return intervalGCD.toString();
        }else{
            return `every ${intervalGCD} hours`;
        }
    }else if(intervalGCD===0){
        return "0"
    } 
    else {
        return "No recurring interval";
    }
}

export default getRecurringIntervalInHours;
