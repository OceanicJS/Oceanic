import type Client from "../Client";
import Base from "../structures/Base";

export type AnyClass<T, I, E extends Array<unknown>> = new(data: T, client: Client, ...extra: E) => I;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default class Collection<K extends string | number, M extends Record<string, any>, C extends Base, E extends Array<unknown> = []> extends Map<K, C> {
    #baseObject: AnyClass<M, C, E>;
    #client: Client;
    limit: number;
    constructor(baseObject: AnyClass<M, C, E>, client: Client, limit = Infinity) {
        super();
        if (!(baseObject.prototype instanceof Base)) throw new Error("baseObject must be a class that extends Base");
        this.#baseObject = baseObject;
        this.#client = client;
        this.limit = limit;
    }

    get empty() {
        return this.size === 0;
    }

    /** @hidden */
    add<T extends C>(value: T) {
        if ("id" in value) {
            if (this.limit === 0) return value;
            this.set(value.id as K, value);

            if (this.limit && this.size > this.limit) {
                const iter = this.keys();
                while (this.size > this.limit) {
                    this.delete((iter.next().value as C).id as K);
                }
            }

            return value;
        } else {
            const err = new Error("Collection.add: value must have an id property");
            Object.defineProperty(err, "_object", { value });
            throw err;
        }
    }

    /** {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every | Array#every } */
    every<T extends C, ThisArg = Collection<K, M, C, E>>(predicate: (value: C, index: number, array: Array<C>) => value is T, thisArg?: ThisArg): this is Array<T>;
    every<ThisArg = Collection<K, M, C, E>>(predicate: (value: C, index: number, array: Array<C>) => unknown, thisArg?: ThisArg): boolean;
    every(predicate: (value: C, index: number, array: Array<C>) => unknown, thisArg?: unknown) {
        return this.toArray().every(predicate, thisArg);

    }


    /** {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter | Array#filter } */
    filter<S extends C, ThisArg = Collection<K, M, C, E>>(predicate: (this: ThisArg, value: C, index: number, array: Array<C>) => value is S, thisArg?: ThisArg): Array<S>;
    filter<ThisArg = Collection<K, M, C, E>>(predicate: (this: ThisArg, value: C, index: number, array: Array<C>) => unknown, thisArg?: ThisArg): Array<C>;
    filter(predicate: (value: C, index: number, array: Array<C>) => unknown, thisArg?: unknown) {
        return this.toArray().filter(predicate, thisArg) as Array<C>;
    }

    /** {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find | Array#find } */
    find<S extends C, ThisArg = Collection<K, M, C, E>>(predicate: (this: ThisArg, value: C, index: number, obj: Array<C>) => value is S, thisArg?: ThisArg): S | undefined;
    find<ThisArg = Collection<K, M, C, E>>(predicate: (this: ThisArg, value: C, index: number, obj: Array<C>) => unknown, thisArg?: ThisArg): C | undefined;
    find(predicate: (value: C, index: number, obj: Array<C>) => unknown, thisArg?: unknown) {
        return this.toArray().find(predicate, thisArg);
    }

    /** {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex | Array#findIndex } */
    findIndex(predicate: (value: C, index: number, obj: Array<C>) => unknown, thisArg?: unknown) {
        return this.toArray().findIndex(predicate, thisArg);
    }

    /**
     * Get the first element, or first X elements if a number is provided.
     * @param amount The amount of elements to get.
     */
    first(): C | undefined;
    first(amount: number): Array<C>;
    first(amount?: number): C | Array<C> | undefined {
        if (typeof amount === "undefined") {
            const iterable = this.values();
            return iterable.next().value as C;
        }

        if (amount < 0) return this.last(amount! * -1);
        amount = Math.min(amount, this.size);

        const iterable = this.values();
        return Array.from({ length: amount }, () => iterable.next().value as C);
    }

    /**
     * Get the last element, or kast X elements if a number is provided.
     * @param amount The amount of elements to get.
     */
    last(): C | undefined;
    last(amount: number): Array<C>;
    last(amount?: number): C | Array<C> | undefined {
        const iterator = Array.from(this.values());
        if (typeof amount === "undefined") return iterator[iterator.length - 1];
        if (amount < 0) return this.first(amount! * -1);
        if (!amount) return [];

        return iterator.slice(-amount);
    }

    /** {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map | Array#map } */
    map<T>(predicate: (value: C, index: number, obj: Array<C>) => T, thisArg?: unknown) {
        return this.toArray().map(predicate, thisArg);
    }

    /**
     * Pick a random element from the collection, or undefined if the collection is empty.
     */
    random() {
        if (this.empty) return undefined;
        const iterable = Array.from(this.values());

        return iterable[Math.floor(Math.random() * iterable.length)];
    }

    /** {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce | Array#reduce } */
    reduce(predicate: (previousValue: C, currentValue: C, currentIndex: number, array: Array<C>) => C): C;
    reduce(predicate: (previousValue: C, currentValue: C, currentIndex: number, array: Array<C>) => C, initialValue: C): C;
    reduce<T>(predicate: (previousValue: T, currentValue: C, currentIndex: number, array: Array<C>) => T, initialValue: T): T;
    reduce<T>(predicate: (previousValue: T, currentValue: C, currentIndex: number, array: Array<C>) => T, initialValue?: T) {
        return this.toArray().reduce(predicate, initialValue!);
    }

    /** {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight | Array#reduceRight } */
    reduceRight(predicate: (previousValue: C, currentValue: C, currentIndex: number, array: Array<C>) => C): C;
    reduceRight(predicate: (previousValue: C, currentValue: C, currentIndex: number, array: Array<C>) => C, initialValue: C): C;
    reduceRight<T>(predicate: (previousValue: T, currentValue: C, currentIndex: number, array: Array<C>) => T, initialValue: T): T;
    reduceRight<T>(predicate: (previousValue: T, currentValue: C, currentIndex: number, array: Array<C>) => T, initialValue?: T) {
        return this.toArray().reduceRight(predicate, initialValue!);
    }

    /** {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some | Array#some } */
    some<ThisArg = Collection<K, M, C, E>>(predicate: (value: C, index: number, array: Array<C>) => unknown, thisArg?: ThisArg) {
        return this.toArray().some(predicate, thisArg);
    }

    /** Get the values of this collection as an array. */
    toArray() {
        return Array.from(this.values());
    }

    /** @hidden */
    update(value: C | Partial<M> & { id?: K; }, ...extra: E) {
        if (value instanceof this.#baseObject) {
            if ("update" in value) value["update"].call(value, value);
            return value;
        }
        // if the object does not have a direct id, we're forced to construct a whole new object
        let item = "id" in value && value.id ? this.get(value.id as K) : undefined;
        if (!item) item = this.add(new this.#baseObject(value as M, this.#client, ...extra));
        else if ("update" in item) item["update"].call(item, value);
        return item;
    }
}
