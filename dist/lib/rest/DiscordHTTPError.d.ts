import type { RESTMethod } from "../Constants";
import type { JSONDiscordHTTPError } from "../types/json";
import type { Response } from "undici";
export default class DiscordHTTPError extends Error {
    method: RESTMethod;
    name: string;
    resBody: Record<string, unknown> | null;
    response: Response;
    constructor(res: Response, resBody: unknown | null, method: string, stack?: string);
    static flattenErrors(errors: Record<string, unknown>, keyPrefix?: string): string[];
    get headers(): import("undici").Headers;
    get path(): string;
    get status(): number;
    get statusText(): string;
    toJSON(): JSONDiscordHTTPError;
}
