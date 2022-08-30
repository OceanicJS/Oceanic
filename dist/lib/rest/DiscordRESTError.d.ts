import type { RESTMethod } from "../Constants";
import type { JSONDiscordRESTError } from "../types/json";
import type { Response } from "undici";
export default class DiscordRESTError extends Error {
    code: number;
    method: RESTMethod;
    name: string;
    resBody: Record<string, unknown> | null;
    response: Response;
    constructor(res: Response, resBody: Record<string, unknown>, method: string, stack?: string);
    static flattenErrors(errors: Record<string, unknown>, keyPrefix?: string): string[];
    get headers(): import("undici").Headers;
    get path(): string;
    get status(): number;
    get statusText(): string;
    toJSON(): JSONDiscordRESTError;
}
