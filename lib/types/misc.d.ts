/* eslint-disable @typescript-eslint/no-explicit-any */
/** @module Types/Miscellaneous */

import type Client from "../Client";

export type StringMap<T extends Record<string, any>> = { [K in keyof T]: `${T[K]}` };
export type ReverseMap<T extends Record<keyof T, keyof any>> = {
    [P in T[keyof T]]: {
        [K in keyof T]: T[K] extends P ? K : never
    }[keyof T]
};
export type AnyClass<T, I, E extends Array<unknown>> = new(data: T, client: Client, ...extra: E) => I;
