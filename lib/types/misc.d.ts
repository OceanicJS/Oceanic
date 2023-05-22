/** @module Types/Miscellaneous */

export type UndefinedPartial<T> = {
    [P in keyof T]: T[P] | undefined;
};
