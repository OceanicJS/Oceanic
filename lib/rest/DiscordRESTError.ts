/** @module DiscordRESTError */
import type { RESTMethod } from "../Constants";
import type { JSONDiscordRESTError } from "../types/json";

/** A REST error received from Discord. */
export default class DiscordRESTError extends Error {
    code: number;
    method!: RESTMethod;
    override name = "DiscordRESTError";
    resBody!: Record<string, unknown> | null;
    response!: Response;
    constructor(res: Response, resBody: Record<string, unknown>, method: RESTMethod, stack?: string) {
        // eslint-disable-next-line unicorn/custom-error-definition
        super();
        this.code = Number(resBody.code);
        Object.defineProperties(this, {
            method: {
                value:      method,
                enumerable: false
            },
            response: {
                value:      res,
                enumerable: false
            },
            resBody: {
                value:      resBody,
                enumerable: false
            }
        });

        let message = "message" in resBody ? `${(resBody as {message: string; }).message} on ${this.method} ${this.path}` : `Unknown Error on ${this.method} ${this.path}`;
        if ("errors" in resBody) {
            message += `\n ${DiscordRESTError.flattenErrors((resBody as { errors: Record<string, unknown>;}).errors).join("\n ")}`;
        } else {
            const errors = DiscordRESTError.flattenErrors(resBody);
            if (errors.length !== 0) {
                message += `\n ${errors.join("\n ")}`;
            }
        }
        this.message = message;

        if (stack) {
            this.stack = `${this.name}: ${this.message}\n${stack}`;
        } else {
            Error.captureStackTrace(this, DiscordRESTError);
        }
    }

    static flattenErrors(errors: Record<string, unknown>, keyPrefix = ""): Array<string> {
        let messages: Array<string> = [];
        for (const fieldName in errors) {
            if (!Object.hasOwn(errors, fieldName) || fieldName === "message" || fieldName === "code") {
                continue;
            }
            if (typeof errors[fieldName] === "object" && errors[fieldName] !== null) {
                if ("_errors" in (errors[fieldName] as object)) {
                    messages = messages.concat((errors[fieldName] as { _errors: Array<{ message: string; }>; })._errors.map((err: { message: string; }) => `${`${keyPrefix}${fieldName}`}: ${err.message}`));
                } else if (Array.isArray(errors[fieldName])) {
                    messages = messages.concat((errors[fieldName] as Array<string>).map(str => `${`${keyPrefix}${fieldName}`}: ${typeof str === "object" && "message" in str ? (str as { message: string; }).message : str}`));
                } else {
                    messages = messages.concat(DiscordRESTError.flattenErrors(errors[fieldName] as Record<string, unknown>, `${keyPrefix}${fieldName}.`));
                }
            }
        }
        return messages;
    }

    get headers(): Headers {
        return this.response.headers;
    }
    get path(): string {
        return new URL(this.response.url).pathname;
    }
    get status(): number {
        return this.response.status;
    }
    get statusText(): string {
        return this.response.statusText;
    }

    toJSON(): JSONDiscordRESTError {
        return {
            message: this.message,
            method:  this.method,
            name:    this.name,
            resBody: this.resBody,
            stack:   this.stack ?? ""
        };
    }
}
