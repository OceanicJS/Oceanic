/** @module SimpleCollection */
import Collection from "./Collection";

/** This is an internal class, you should not use it in your projects. If you want a collection type for your own projects, look at {@link Collection}. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default class SimpleCollection<K extends string | number, M extends Record<string, any>, C extends Record<string, any> & Record<Key, K>, Key extends string = "id"> extends Collection<K, C> {
    private conversionFunc!: (data: M) => C;
    protected key!: Key;
    protected onDuplicate!: "merge" | "throw" | "replace" | "update";
    limit: number;
    constructor(conversionFunc: (data: M) => C, limit = Infinity, onDuplicate: "merge" | "throw" | "replace" | "update" = "throw", key?: Key) {
        super();
        this.limit = limit;
        Object.defineProperties(this, {
            conversionFunc: { value: conversionFunc, enumerable: false },
            key:            { value: key ?? "id", enumerable: false },
            onDuplicate:    { value: onDuplicate, enumerable: false }
        });
    }

    add<T extends C>(value: T): T {
        if (this.key in value) {
            if (this.limit === 0) {
                return value;
            }
            if (this.has(value[this.key])) {
                switch (this.onDuplicate) {
                    case "merge": {
                        value = { ...this.get(value[this.key]), ...value };
                        break;
                    }

                    // we don't have the raw data, so we can't update
                    case "update":
                    case "throw": {
                        const err = new Error(`${this.constructor.name}#add: duplicate ${this.key} ${value[this.key] as string}`);
                        Object.defineProperty(err, "_object", { value });
                        throw err;
                    }
                }
            }
            this.set(value[this.key], value);

            if (this.limit && this.size > this.limit) {
                const iter = this.keys();
                while (this.size > this.limit) {
                    this.delete(iter.next().value as K);
                }

            }

            return value;
        } else {
            const err = new Error(`${this.constructor.name}#add: value must have a ${this.key} property`);
            Object.defineProperty(err, "_object", { value });
            throw err;
        }
    }

    update(value: M): C {
        if (this.key in value) {
            if (this.has(value[this.key]) && this.onDuplicate === "update") {
                const obj = this.get(value[this.key])!;
                if ("update" in obj && typeof obj.update === "function") {
                    (obj.update as (data: M) => void)(value);
                    return obj;
                } else {
                    const err = new Error(`${this.constructor.name}#update: existing object for ${value[this.key] as string} does not have an update method`);
                    Object.defineProperty(err, "_object", { value });
                    throw err;
                }
            }

            return this.add(this.conversionFunc(value));
        } else {
            const err = new Error(`${this.constructor.name}#update: value must have a ${this.key} property`);
            Object.defineProperty(err, "_object", { value });
            throw err;
        }
    }
}
