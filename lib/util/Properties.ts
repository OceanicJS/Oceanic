/** @module Properties */
export default class Properties<C = unknown> {
    #object: unknown;
    constructor(obj: unknown) {
        this.#object = obj;
    }

    static define<T, K extends keyof T>(obj: T, property: K, value: T[K], writable = false, configurable = false, enumerable = false): Properties<T> {
        return new Properties<T>(obj).define(property, value, writable, configurable, enumerable);
    }

    static looseDefine<T>(obj: T, property: string, value: unknown, writable = false, configurable = false, enumerable = false): Properties<T> {
        return new Properties<T>(obj).looseDefine(property, value, writable, configurable, enumerable);
    }

    static new<T>(obj: T): Properties<T> {
        return new Properties<T>(obj);
    }

    define<K extends keyof C>(property: K, value: C[K], writable = false, configurable = false, enumerable = false): this {
        Object.defineProperty(this.#object, property, { value, writable, configurable, enumerable });
        return this;
    }

    looseDefine(property: string, value: unknown, writable = false, configurable = false, enumerable = false): this {
        Object.defineProperty(this.#object, property, { value, writable, configurable, enumerable });
        return this;
    }
}
