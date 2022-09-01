"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DiscordRESTError extends Error {
    code;
    method;
    name = "DiscordRESTError";
    resBody;
    response;
    constructor(res, resBody, method, stack) {
        super();
        this.code = Number(resBody.code);
        this.method = method;
        this.response = res;
        this.resBody = resBody;
        let message = "message" in resBody ? `${resBody.message} on ${this.method} ${this.path}` : `Unknown Error on ${this.method} ${this.path}`;
        if ("errors" in resBody)
            message += `\n ${DiscordRESTError.flattenErrors(resBody.errors).join("\n ")}`;
        else {
            const errors = DiscordRESTError.flattenErrors(resBody);
            if (errors.length > 0)
                message += `\n ${errors.join("\n ")}`;
        }
        Object.defineProperty(this, "message", {
            enumerable: false,
            value: message
        });
        if (stack)
            this.stack = `${this.name}: ${this.message}\n${stack}`;
        else
            Error.captureStackTrace(this, DiscordRESTError);
    }
    static flattenErrors(errors, keyPrefix = "") {
        let messages = [];
        for (const fieldName in errors) {
            if (!Object.hasOwn(errors, fieldName) || fieldName === "message" || fieldName === "code")
                continue;
            if ("_errors" in errors[fieldName])
                messages = messages.concat(errors[fieldName]._errors.map((err) => `${`${keyPrefix}${fieldName}`}: ${err.message}`));
            else if (Array.isArray(errors[fieldName]))
                messages = messages.concat(errors[fieldName].map((str) => `${`${keyPrefix}${fieldName}`}: ${str}`));
            else if (typeof errors[fieldName] === "object")
                messages = messages.concat(DiscordRESTError.flattenErrors(errors[fieldName], `${keyPrefix}${fieldName}.`));
        }
        return messages;
    }
    get headers() { return this.response.headers; }
    get path() { return new URL(this.response.url).pathname; }
    get status() { return this.response.status; }
    get statusText() { return this.response.statusText; }
    toJSON() {
        return {
            message: this.message,
            method: this.method,
            name: this.name,
            resBody: this.resBody,
            stack: this.stack || ""
        };
    }
}
exports.default = DiscordRESTError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGlzY29yZFJFU1RFcnJvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9yZXN0L0Rpc2NvcmRSRVNURXJyb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFJQSxNQUFxQixnQkFBaUIsU0FBUSxLQUFLO0lBQy9DLElBQUksQ0FBUztJQUNiLE1BQU0sQ0FBYTtJQUNuQixJQUFJLEdBQUcsa0JBQWtCLENBQUM7SUFDMUIsT0FBTyxDQUFpQztJQUN4QyxRQUFRLENBQVc7SUFDbkIsWUFBWSxHQUFhLEVBQUUsT0FBZ0MsRUFBRSxNQUFrQixFQUFFLEtBQWM7UUFDM0YsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7UUFDcEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFzQyxDQUFDO1FBRXRELElBQUksT0FBTyxHQUFHLFNBQVMsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUksT0FBK0IsQ0FBQyxPQUFPLE9BQU8sSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNuSyxJQUFJLFFBQVEsSUFBSSxPQUFPO1lBQUUsT0FBTyxJQUFJLE1BQU0sZ0JBQWdCLENBQUMsYUFBYSxDQUFFLE9BQStDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7YUFDM0k7WUFDRCxNQUFNLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDdkQsSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUM7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