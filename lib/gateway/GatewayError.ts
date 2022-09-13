/** @module GatewayError */

/** A gateway error. */
export default class GatewayError extends Error {
    code: number;
    constructor(message: string, code: number) {
        super(message);
        this.code = code;
    }
}
