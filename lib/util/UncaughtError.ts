/** @module UncaughtError */

/** An error that is thrown when we encounter an error, and no `error` listeners are present. */
export default class UncaughtError extends Error {
    override name = "UncaughtError";
    constructor(error: Error | string) {
        super("Uncaught 'error' event", { cause: error });
    }
}
