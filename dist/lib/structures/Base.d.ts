/// <reference types="node" />
import type Client from "../Client";
import type { JSONBase } from "../types/json";
import { inspect } from "util";
/** A base class which most other classes extend. */
export default abstract class Base {
    protected _client: Client;
    id: string;
    constructor(id: string, client: Client);
    static getCreatedAt(id: string): Date;
    static getDiscordEpoch(id: string): number;
    protected update(data: unknown): void;
    get createdAt(): Date;
    [inspect.custom](): this;
    toJSON(): JSONBase;
    toString(): string;
}
