/** @module Types/Shared */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type Client from "../Client";

export interface Uncached {
    id: string;
}

type AllKeys<T> = T extends unknown ? keyof T : never;
type Id<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;
type _ExclusifyUnion<T, K extends PropertyKey> = T extends unknown ? Id<T & Partial<Record<Exclude<K, keyof T>, never>>> : never;
export type ExclusifyUnion<T> = _ExclusifyUnion<T, AllKeys<T>>;

export type StringMap<T extends Record<string, any>> = { [K in keyof T]: `${T[K]}` };
export type ReverseMap<T extends Record<keyof T, keyof any>> = {
    [P in T[keyof T]]: {
        [K in keyof T]: T[K] extends P ? K : never
    }[keyof T]
};
export type AnyClass<T, I, E extends Array<unknown>> = new(data: T, client: Client, ...extra: E) => I;
export type WithRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
export type Nullable<T> = {
    [K in keyof T]: T[K] | null;
};
export type PartialUndefined<T> = {
    [P in keyof T]?: T[P] | undefined;
};
export type PartialUndefinedNull<T> = {
    [P in keyof T]?: T[P] | undefined | null;
};
export type KeysExist<T, K extends AllKeys<T> = never> = {
    [P in Exclude<AllKeys<T>, K>]-?: any;
} & Pick<T, K>;
