/** @module DiscordHTTPError */
import DiscordRESTError from "./DiscordRESTError";
import type { RESTMethod } from "../Constants";
import type { JSONDiscordHTTPError } from "../types/json";
import type { Headers, Response } from "undici";

/** An HTTP error received from Discord. */
export default class DiscordHTTPError extends Error {
    method: RESTMethod;
    override name = "DiscordHTTPError";
    resBody: Record<string, unknown> | null;
    response: Response;
    constructor(res: Response, resBody: unknown | null, method: RESTMethod, stack?: string) {
        super();
        this.method = method;
        this.response = res;
        this.resBody = resBody as DiscordHTTPError["resBody"];

        let message = `${res.status} ${res.statusText} on ${this.method} ${this.path}`;
        const errors = DiscordRESTError.flattenErrors(resBody as Record<string, unknown>);
        if (errors.length !== 0) {
            message += `\n  ${errors.join("\n  ")}`;
        }
        Object.defineProperty(this, "message", {
            enumerable: false,
            value:      message
        });
        if (stack) {
            this.stack = this.name + ": " + this.message + "\n" + stack;
        } else {
            Error.captureStackTrace(this, DiscordHTTPError);
        }
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

    toJSON(): JSONDiscordHTTPError {
        return {
            message: this.message,
            method:  this.method,
            name:    this.name,
            resBody: this.resBody,
            stack:   this.stack ?? ""
        };
    }
}
