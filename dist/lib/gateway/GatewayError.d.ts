export default class GatewayError extends Error {
    code: number;
    constructor(message: string, code: number);
}
