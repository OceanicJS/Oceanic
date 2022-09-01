import Shard from "./Shard";
import type Client from "../Client";
import type { GatewayOptions, ShardManagerInstanceOptions } from "../types/gateway";
import { Collection } from "@augu/collections";
export default class ShardManager extends Collection<number, Shard> {
    #private;
    options: ShardManagerInstanceOptions;
    constructor(client: Client, options?: GatewayOptions);
    private _ready;
    connect(shard: Shard): void;
    spawn(id: number): void;
    tryConnect(): void;
}
