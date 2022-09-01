import type Client from "../Client";
import Base from "../structures/Base";
import { Collection as PolarCollection } from "@augu/collections";

export type AnyClass<T, I, E extends Array<unknown>> = new(data: T, client: Client, ...extra: E) => I;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default class Collection<K extends string | number, M extends Record<string, any>, C extends Base, E extends Array<unknown> = []> extends PolarCollection<K, C> {
    #baseObject: AnyClass<M, C, E>;
    #client: Client;
    constructor(baseObject: AnyClass<M, C, E>, client: Client) {
        super();
        if (!(baseObject.prototype instanceof Base)) throw new Error("baseObject must be a class that extends Base");
        this.#baseObject = baseObject;
        this.#client = client;
    }

    add<T extends C>(value: T) {
        if ("id" in value) {
            this.set(value.id as K, value);
            return value;
        } else {
            const err = new Error("Collection.add: value must have an id property");
            Object.defineProperty(err, "_object", { value });
            throw err;
        }
    }

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
