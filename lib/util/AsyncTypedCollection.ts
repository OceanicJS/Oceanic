/** @module TypedCollection */
import Collection from "./Collection";
import type * as Types from "../types/namespaced";
import type Client from "../Client";
import Base from "../structures/Base";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ExtraOptions<M extends Record<string, any>, C extends Base, E extends Array<unknown> = []> {
    construct?(this: void, data: M, client: Client, ...extra: E): Types.Shared.MaybePromise<C>;
    delete?(this: void, key: string, client: Client): Types.Shared.MaybePromise<void>;
}

/** This is an internal class, you should not use it in your projects. If you want a collection type for your own projects, look at {@link Collection}. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default class AsyncTypedCollection<M extends Record<string, any>, C extends Base, E extends Array<unknown> = []> extends Collection<string, C> {
    private _baseObject: Types.Shared.AnyClass<M, C, E>;
    client!: Client;
    extraOptions: Required<ExtraOptions<M, C, E>>;
    limit: number;
    constructor(baseObject: Types.Shared.AnyClass<M, C, E>, client: Client, limit = Infinity, extraOptions?: ExtraOptions<M, C, E>) {
        super();
        if (!(baseObject.prototype instanceof Base)) {
            throw new TypeError("baseObject must be a class that extends Base.");
        }
        this._baseObject = baseObject;
        this.limit = limit;
        this.extraOptions = {
            construct: extraOptions?.construct ?? ((data, collectionClient, ...extra): C => new baseObject(data, collectionClient, ...extra)),
            delete:    extraOptions?.delete ?? ((): void => {})
        };

        Object.defineProperty(this, "client", {
            value:        client,
            enumerable:   false,
            configurable: false,
            writable:     false
        });
    }

    /** @internal */
    async add<T extends C>(value: T): Promise<T> {
        if ("id" in value) {
            if (this.limit === 0) {
                return value;
            }
            this.set(value.id, value);

            if (this.limit && this.size > this.limit) {
                const iter = this.keys();
                while (this.size > this.limit) {
                    const val = iter.next().value as string | undefined;
                    if (val === undefined) {
                        break;
                    }
                    await this.delete(val);
                }

            }

            return value;
        } else {
            const err = new Error(`${this.constructor.name}#add: value must have an id property`);
            Object.defineProperty(err, "_object", { value });
            throw err;
        }
    }

    override async clear(): Promise<void> {
        for (const key of this.keys()) {
            await this.extraOptions.delete(key, this.client);
        }
        super.clear();
    }

    /** @internal */
    // @ts-expect-error -- Collection's delete is not async, so this override is technically not valid
    override async delete(key: string): Promise<boolean> {
        await this.extraOptions.delete(key, this.client);
        return super.delete(key);
    }

    /** @internal */
    async update(value: C | Partial<M> & { id?: string; }, ...extra: E): Promise<C> {
        if (value instanceof this._baseObject) {
            if ("update" in value) {
                value["update"].call(value, value);
            }
            return value;
        }
        // if the object does not have a direct id, we're forced to construct a whole new object
        let item = "id" in value && value.id ? this.get(value.id) : undefined;
        if (!item) {
            item = await this.add(await this.extraOptions.construct(value as M, this.client, ...extra));
        } else if ("update" in item) {
            item["update"].call(item, value);
        }
        return item;
    }

    /**
     * a sync version of the update function, which forces the caller to provide a syncronous constructor - useful when we are in a sync context and know the class type
     * @deprecated Avoid if possible
     * @internal
     */
    updateSync(construct: ((this: void, data: M, client: Client, ...extra: E) => C) | null, value: C | Partial<M> & { id?: string; }, ...extra: E): C {
        if (value instanceof this._baseObject) {
            if ("update" in value) {
                value["update"].call(value, value);
            }
            return value;
        }
        // if the object does not have a direct id, we're forced to construct a whole new object
        let item = "id" in value && value.id ? this.get(value.id) : undefined;
        if (!item) {
            let val: C;
            if (construct) {
                val = construct(value as M, this.client, ...extra);
            } else {
                const intr = this.extraOptions.construct(value as M, this.client, ...extra);
                if (intr instanceof Promise) {
                    throw new TypeError("AsyncTypedCollection#updateSync: construct function returned a Promise, but a synchronous result was expected");
                }
                val = intr;
            }
            item = this.add(val) as unknown as C;
        } else if ("update" in item) {
            item["update"].call(item, value);
        }
        return item;
    }
}
