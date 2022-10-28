/** @module ShardManager */
import Shard from "./Shard";
import type Client from "../Client";
import { AllIntents, AllNonPrivilegedIntents, Intents } from "../Constants";
import type { GatewayOptions, ShardManagerInstanceOptions } from "../types/gateway";
import Collection from "../util/Collection";

/** A manager for all the client's shards. */
export default class ShardManager extends Collection<number, Shard> {
    #buckets: Record<number, number>;
    #client: Client;
    #connectQueue: Array<Shard>;
    #connectTimeout: NodeJS.Timeout | null;
    options: ShardManagerInstanceOptions;
    constructor(client: Client, options: GatewayOptions = {}) {
        super();
        this.#buckets = {};
        this.#client = client;
        this.#connectQueue = [];
        this.#connectTimeout = null;
        this.options = {
            autoReconnect:        options.autoReconnect ?? true,
            compress:             options.compress ?? false,
            connectionProperties: {
                browser: options.connectionProperties?.browser ?? "Oceanic",
                device:  options.connectionProperties?.device ?? "Oceanic",
                os:      options.connectionProperties?.os ?? process.platform
            },
            concurrency:          options.concurrency === "auto" || options.concurrency && options.concurrency < 1 ? -1 : options.concurrency ?? -1,
            connectionTimeout:    options.connectionTimeout ?? 30000,
            firstShardID:         options.firstShardID && options.firstShardID < 0 ? 0 : options.firstShardID ?? 0,
            getAllUsers:          options.getAllUsers ?? false,
            guildCreateTimeout:   options.guildCreateTimeout ?? 2000,
            intents:              typeof options.intents === "number" ? options.intents : 0,
            largeThreshold:       options.largeThreshold ?? 250,
            lastShardID:          options.lastShardID ?? -1,
            maxReconnectAttempts: options.maxReconnectAttempts ?? Infinity,
            maxResumeAttempts:    options.maxResumeAttempts ?? 10,
            maxShards:            options.maxShards === "auto" || options.maxShards && options.maxShards < 1 ? -1 : options.maxShards ?? -1,
            presence:			          {
                activities: options.presence?.activities ?? [],
                afk:		      options.presence?.afk ?? false,
                status:		   options.presence?.status ?? "online"
            },
            reconnectDelay:       options.reconnectDelay ?? ((lastDelay, attempts): number => Math.pow(attempts + 1, 0.7) * 20000),
            seedVoiceConnections: options.seedVoiceConnections ?? false,
            shardIDs:             options.shardIDs ?? [],
            ws:                   options.ws ?? {}
        };

        if (this.options.lastShardID === -1 && this.options.maxShards !== -1) {
            this.options.lastShardID = this.options.maxShards - 1;
        }


        if (Object.hasOwn(options, "intents")) {
            if (Array.isArray(options.intents)) {
                let bitmask = 0;
                for (const intent of options.intents) {
                    if (typeof intent === "number") {
                        bitmask |= intent;
                    } else if (Intents[intent as keyof typeof Intents]) {
                        bitmask |= Intents[intent as keyof typeof Intents];
                    } else {
                        if (intent === "ALL") {
                            bitmask = AllIntents;
                            break;
                        }
                        this.#client.emit("warn", `Unknown intent: ${intent}`);
                    }
                }

                this.options.intents = bitmask;
            }
        } else {
            this.options.intents = AllNonPrivilegedIntents;
        }

        if (this.options.getAllUsers && !(this.options.intents & Intents.GUILD_MEMBERS)) {
            throw new Error("Guild members cannot be requested without the GUILD_MEMBERS intent");
        }

    }

    private _ready(id: number): void {
        const rateLimitKey = (id % this.options.concurrency) ?? 0;
        this.#buckets[rateLimitKey] = Date.now();

        this.tryConnect();
    }

    private _resetConnectQueue(): void {
        this.#connectQueue = [];
    }

    connect(shard: Shard): void {
        this.#connectQueue.push(shard);
        this.tryConnect();
    }

    spawn(id: number): void {
        let shard = this.get(id);
        if (!shard) {
            shard = new Shard(id, this.#client);
            this.set(id, shard);
            shard
                .on("ready", () => {
                    this.#client.emit("shardReady", id);
                    if (this.#client.ready) {
                        return;
                    }
                    for (const other of this.values()) {
                        if (!other.ready) {
                            return;
                        }
                    }

                    this.#client.ready = true;
                    this.#client.startTime = Date.now();
                    this.#client.emit("ready");
                })
                .on("resume", () => {
                    this.#client.emit("shardResume", id);
                    if (this.#client.ready) {
                        return;
                    }
                    for (const other of this.values()) {
                        if (!other.ready) {
                            return;
                        }
                    }

                    this.#client.ready = true;
                    this.#client.startTime = Date.now();
                    this.#client.emit("ready");
                })
                .on("disconnect", error => {
                    this.#client.emit("shardDisconnect", error, id);
                    for (const other of this.values()) {
                        if (other.ready) {
                            return;
                        }
                    }

                    this.#client.ready = false;
                    this.#client.startTime = 0;
                    this.#client.emit("disconnect");
                })
                .on("preReady", () => {
                    this.#client.emit("shardPreReady", id);
                });
        }

        if (shard.status === "disconnected") {
            return this.connect(shard);
        }
    }

    tryConnect(): void {
        if (this.#connectQueue.length === 0) {
            return;
        }

        for (const shard of this.#connectQueue) {
            const rateLimitKey = (shard.id % this.options.concurrency) ?? 0;
            const lastConnect = this.#buckets[rateLimitKey] ?? 0;
            if (!shard.sessionID && Date.now() - lastConnect < 5000) {
                continue;
            }

            if (this.some(s => s.connecting && ((s.id % this.options.concurrency) || 0) === rateLimitKey)) {
                continue;
            }
            shard.connect();
            this.#buckets[rateLimitKey] = Date.now();
            this.#connectQueue.splice(this.#connectQueue.findIndex(s => s.id === shard.id), 1);
        }
        if (!this.#connectTimeout && this.#connectQueue.length !== 0) {
            this.#connectTimeout = setTimeout(() => {
                this.#connectTimeout = null;
                this.tryConnect();
            }, 500);
        }

    }
}
