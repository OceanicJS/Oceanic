/** @module Dispatcher */
import * as DefaultDispatchEvents from "./events";

import type Shard from "./Shard";
import type ShardManager from "./ShardManager";
import type * as Types from "../types/namespaced";

export type DispatchEvent = Types.GatewayRaw.AnyDispatchPacket["t"];
export type DispatchEventMap = {
    [K in Types.GatewayRaw.AnyDispatchPacket as K["t"]]: K["d"];
};
export type DispatchFunction<K extends DispatchEvent = DispatchEvent> = (data: DispatchEventMap[K], shard: Shard) => void;
export default class Dispatcher {
    private manager!: ShardManager;
    events = new Map<DispatchEvent, Array<DispatchFunction>>();
    constructor(manager: ShardManager) {
        Object.defineProperty(this, "manager", {
            value: manager,
            writable: false,
            enumerable: false,
            configurable: false,
        });

        const options = this.manager.options.dispatcher;
        const type = options.blacklist !== null ? "blacklist" : (options.whitelist !== null ? "whitelist" : "none");

        for (const [event, fn] of Object.entries(DefaultDispatchEvents) as Array<[DispatchEvent, DispatchFunction]>) {
            if (type === "none"
                || (type === "whitelist" && options.whitelist?.includes(event))
                || (type === "blacklist" && !options.blacklist?.includes(event))) {
                this.register(event, fn);
            }
        }
    }

    private handle(data: Types.GatewayRaw.AnyDispatchPacket, shard: Shard): void {
        const event = data.t;
        if (!this.events.has(event)) return;
        const arr = this.events.get(event)!;
        for (const fn of arr) fn(data.d, shard);
    }

    register<K extends DispatchEvent>(event: K, fn: DispatchFunction<K>, replace = false): void {
        if (!this.events.has(event)) this.events.set(event, []);
        const arr = this.events.get(event)!;
        if (replace && arr.length !== 0) arr.splice(0, arr.length);
        arr.push(fn as never);
    }

    unregister<K extends DispatchEvent>(event: K, fn?: DispatchFunction<K>): void {
        if (!this.events.has(event)) return;
        const arr = this.events.get(event)!;
        if (fn) {
            const index = arr.indexOf(fn as never);
            if (index !== -1) arr.splice(index, 1);
        } else arr.splice(0, arr.length);
    }
}
