/** @module Base */
import type Client from "../Client";
import type { JSONBase } from "../types/json";
import { inspect } from "node:util";

/** A base class which most other classes extend. */
export default abstract class Base {
    client!: Client;
    id: string;
    constructor(id: string, client: Client) {
        this.id = id;
        Object.defineProperty(this, "client", {
            value:        client,
            enumerable:   false,
            writable:     false,
            configurable: false
        });
    }

    static getCreatedAt(id: string): Date {
        return new Date(Base.getDiscordEpoch(id) + 1420070400000);
    }

    static getDiscordEpoch(id: string): number {
        return Number(BigInt(id) / 4194304n);
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
    protected update(data: unknown): void {}

    get createdAt(): Date {
        return Base.getCreatedAt(this.id);
    }

    /** @hidden */
    [inspect.custom](): this {
        // https://stackoverflow.com/questions/5905492/dynamic-function-name-in-javascript
        const copy = new { [this.constructor.name]: class {} }[this.constructor.name]() as this;
        for (const key in this) {
            if (Object.hasOwn(this, key) && !key.startsWith("_") && this[key] !== undefined) {
                copy[key] = this[key];
            }
        }


        return copy;
    }

    toJSON(): JSONBase{
        return {
            createdAt: this.createdAt.getTime(),
            id:        this.id
        };
    }

    toString(): string {
        return `[${this.constructor.name} ${this.id}]`;
    }
}
