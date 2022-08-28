export default class Properties<C = unknown> {
    private obj;
    constructor(obj: unknown);
    static define<T, K extends keyof T>(obj: T, property: K, value: T[K], writable?: boolean, configurable?: boolean, enumerable?: boolean): Properties<T>;
    static looseDefine<T>(obj: T, property: string, value: unknown, writable?: boolean, configurable?: boolean, enumerable?: boolean): Properties<T>;
    static new<T>(obj: T): Properties<T>;
    define<K extends keyof C>(property: K, value: C[K], writable?: boolean, configurable?: boolean, enumerable?: boolean): this;
    looseDefine(property: string, value: unknown, writable?: boolean, configurable?: boolean, enumerable?: boolean): this;
}
