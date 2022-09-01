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
        Object.defineProperties(this, {
            response: { value: res, enumerable: false },
            resBody: { value: resBody, enumerable: false },
            method: { value: method, enumerable: false },
            code: { value: Number(resBody.code), enumerable: true }
        });
        let message = "message" in resBody ? `${resBody.message} on ${this.method} ${this.path}` : `Unknown Error on ${this.method} ${this.path}`;
        if ("errors" in resBody)
            message += `\n  ${DiscordRESTError.flattenErrors(resBody.errors).join("\n  ")}`;
        else {
            const errors = DiscordRESTError.flattenErrors(resBody);
            if (errors.length > 0)
                message += `\n  ${errors.join("\n  ")}`;
        }
        Object.defineProperty(this, "message", {
            enumerable: false,
            value: message
        });
        if (stack)
            this.stack = this.name + ": " + this.message + "\n" + stack;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGlzY29yZFJFU1RFcnJvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9yZXN0L0Rpc2NvcmRSRVNURXJyb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFJQSxNQUFxQixnQkFBaUIsU0FBUSxLQUFLO0lBQy9DLElBQUksQ0FBVTtJQUNkLE1BQU0sQ0FBYztJQUNwQixJQUFJLEdBQUcsa0JBQWtCLENBQUM7SUFDMUIsT0FBTyxDQUFrQztJQUN6QyxRQUFRLENBQVk7SUFDcEIsWUFBWSxHQUFhLEVBQUUsT0FBZ0MsRUFBRSxNQUFjLEVBQUUsS0FBYztRQUN2RixLQUFLLEVBQUUsQ0FBQztRQUVSLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUU7WUFDMUIsUUFBUSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFO1lBQzNDLE9BQU8sRUFBRyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRTtZQUMvQyxNQUFNLEVBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUU7WUFDOUMsSUFBSSxFQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRTtTQUM5RCxDQUFDLENBQUM7UUFFSCxJQUFJLE9BQU8sR0FBRyxTQUFTLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFJLE9BQStCLENBQUMsT0FBTyxPQUFPLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbkssSUFBSSxRQUFRLElBQUksT0FBTztZQUFFLE9BQU8sSUFBSSxPQUFPLGdCQUFnQixDQUFDLGFBQWEsQ0FBRSxPQUEr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