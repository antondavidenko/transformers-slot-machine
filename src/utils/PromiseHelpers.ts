export function promiseDelay(delay):Promise<void> {
    return new Promise(function(resolve) {
        setTimeout(resolve, delay);
    });
}