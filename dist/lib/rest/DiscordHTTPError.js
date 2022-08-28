"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DiscordHTTPError extends Error {
    method;
    name = "DiscordHTTPError";
    resBody;
    response;
    constructor(res, resBody, method, stack) {
        super();
        Object.defineProperties(this, {
            response: { value: res, enumerable: false },
            resBody: { value: resBody, enumerable: false },
            method: { value: method, enumerable: false }
        });
        let message = `${res.status} ${res.statusText} on ${this.method} ${this.path}`;
        const errors = DiscordHTTPError.flattenErrors(resBody);
        if (errors.length > 0)
            message += `\n  ${errors.join("\n  ")}`;
        Object.defineProperty(this, "message", {
            enumerable: false,
            value: message
        });
        if (stack)
            this.stack = this.name + ": " + this.message + "\n" + stack;
        else
            Error.captureStackTrace(this, DiscordHTTPError);
    }
    static flattenErrors(errors, keyPrefix = "") {
        let messages = [];
        for (const fieldName in errors) {
            if (!Object.hasOwn(errors, fieldName) || fieldName === "message" || fieldName === "code")
                continue;
            if (Array.isArray(errors[fieldName]))
                messages = messages.concat(errors[fieldName].map((str) => `${`${keyPrefix}${fieldName}`}: ${str}`));
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
exports.default = DiscordHTTPError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGlzY29yZEhUVFBFcnJvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9yZXN0L0Rpc2NvcmRIVFRQRXJyb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFJQSxNQUFxQixnQkFBaUIsU0FBUSxLQUFLO0lBQ2xELE1BQU0sQ0FBYTtJQUNuQixJQUFJLEdBQUcsa0JBQWtCLENBQUM7SUFDMUIsT0FBTyxDQUFpQztJQUN4QyxRQUFRLENBQVc7SUFDbkIsWUFBWSxHQUFhLEVBQUUsT0FBdUIsRUFBRSxNQUFjLEVBQUUsS0FBYztRQUNqRixLQUFLLEVBQUUsQ0FBQztRQUVSLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUU7WUFDN0IsUUFBUSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFO1lBQzNDLE9BQU8sRUFBRyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRTtZQUMvQyxNQUFNLEVBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUU7U0FDOUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxPQUFPLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxVQUFVLE9BQU8sSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDL0UsTUFBTSxNQUFNLEdBQUcsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE9BQWtDLENBQUMsQ0FBQztRQUNsRixJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQztZQUFFLE9BQU8sSUFBSSxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUMvRCxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDdEMsVUFBVSxFQUFFLEtBQUs7WUFDakIsS0FBSyxFQUFPLE9BQU87U0FDbkIsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxLQUFLO1lBQUUsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksR0FBRyxLQUFLLENBQUM7O1lBQ2xFLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRUQsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUErQixFQUFFLFNBQVMsR0FBRyxFQUFFO1FBQ25FLElBQUksUUFBUSxHQUFrQixFQUFFLENBQUM7UUFDakMsS0FBSyxNQUFNLFNBQVMsSUFBSSxNQUFNLEVBQUU7WUFDL0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxJQUFJLFNBQVMsS0FBSyxTQUFTLElBQUksU0FBUyxLQUFLLE1BQU07Z0JBQUUsU0FBUztZQUNuRyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUFFLFFBQVEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFFLE1BQU0sQ0FBQyxTQUFTLENBQW1CLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEdBQUcsU0FBUyxHQUFHLFNBQVMsRUFBRSxLQUFLLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUM3SjtRQUNELE9BQU8sUUFBUSxDQUFDO0lBQ2pCLENBQUM7SUFFRCxJQUFJLE9BQU8sS0FBSyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUMvQyxJQUFJLElBQUksS0FBSyxPQUFPLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUMxRCxJQUFJLE1BQU0sS0FBSyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUM3QyxJQUFJLFVBQVUsS0FBSyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUVyRCxNQUFNO1FBQ0wsT0FBTztZQUNOLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztZQUNyQixNQUFNLEVBQUcsSUFBSSxDQUFDLE1BQU07WUFDcEIsSUFBSSxFQUFLLElBQUksQ0FBQyxJQUFJO1lBQ2xCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztZQUNyQixLQUFLLEVBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFO1NBQ3pCLENBQUM7SUFDSCxDQUFDO0NBQ0Q7QUFoREQsbUNBZ0RDIn0=