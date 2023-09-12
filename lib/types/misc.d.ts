/* eslint-disable @typescript-eslint/no-explicit-any */
/** @module Types/Miscellaneous */

import type Client from "../Client.js";
import type * as undici from "undici";

export type StringMap<T extends Record<string, any>> = { [K in keyof T]: `${T[K]}` };
export type ReverseMap<T extends Record<keyof T, keyof any>> = {
    [P in T[keyof T]]: {
        [K in keyof T]: T[K] extends P ? K : never
    }[keyof T]
};
export type AnyClass<T, I, E extends Array<unknown>> = new(data: T, client: Client, ...extra: E) => I;

// workaround until these types are added to @types/node
declare global {
    export const {
        fetch,
        FormData,
        Headers,
        Request,
        Response
    }: typeof import("undici");

    type FormData = undici.FormData;
    type Headers = undici.Headers;
    type Response = undici.Response;
}
