/* eslint-disable @typescript-eslint/no-explicit-any */
/** @module Types/Miscellaneous */

export type StringMap<T extends Record<string, any>> = { [K in keyof T]: `${T[K]}` };
export type ReverseMap<T extends Record<keyof T, keyof any>> = {
    [P in T[keyof T]]: {
        [K in keyof T]: T[K] extends P ? K : never
    }[keyof T]
};
