"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Shard_1 = __importDefault(require("./Shard"));
const Properties_1 = __importDefault(require("../util/Properties"));
const Constants_1 = require("../Constants");
const collections_1 = require("@augu/collections");
class ShardManager extends collections_1.Collection {
    _buckets;
    _client;
    _connectQueue;
    _connectTimeout;
    options;
    constructor(client, options = {}) {
        super();
        Properties_1.default.new(this)
            .looseDefine("_buckets", new Map())
            .looseDefine("_client", client)
            .looseDefine("_connectQueue", [])
            .looseDefine("_connectTimeout", null, true);
        this.options = {
            autoReconnect: options.autoReconnect ?? true,
            compress: options.compress ?? false,
            connectionProperties: {
                browser: options.connectionProperties?.browser ?? "Oceanic",
                device: options.connectionProperties?.device ?? "Oceanic",
                os: options.connectionProperties?.os ?? process.platform
            },
            concurrency: options.concurrency === "auto" || options.concurrency && options.concurrency < 1 ? -1 : options.concurrency ?? -1,
            connectionTimeout: options.connectionTimeout ?? 30000,
            firstShardID: options.firstShardID && options.firstShardID < 0 ? 0 : options.firstShardID ?? 0,
            getAllUsers: options.getAllUsers ?? false,
            guildCreateTimeout: options.guildCreateTimeout ?? 2000,
            intents: typeof options.intents === "number" ? options.intents : 0,
            largeThreshold: options.largeThreshold ?? 250,
            lastShardID: options.lastShardID ?? -1,
            maxReconnectAttempts: options.maxReconnectAttempts ?? Infinity,
            maxResumeAttempts: options.maxResumeAttempts ?? 10,
            maxShards: options.maxShards === "auto" || options.maxShards && options.maxShards < 1 ? -1 : options.maxShards ?? -1,
            presence: {
                activities: options.presence?.activities ?? [],
                afk: options.presence?.afk ?? false,
                status: options.presence?.status ?? "online"
            },
            reconnectDelay: options.reconnectDelay ?? ((lastDelay, attempts) => Math.pow(attempts + 1, 0.7) * 20000),
            seedVoiceConnections: options.seedVoiceConnections ?? false,
            shardIDs: options.shardIDs ?? [],
            ws: options.ws ?? {}
        };
        if (this.options.lastShardID === -1 && this.options.maxShards !== -1) {
            this.options.lastShardID = this.options.maxShards - 1;
        }
        if (Object.hasOwn(options, "intents")) {
            if (Array.isArray(options.intents)) {
                let bitmask = 0;
                for (const intent of options.intents) {
                    if (typeof intent === "number")
                        bitmask |= intent;
                    else if (Constants_1.Intents[intent])
                        bitmask |= Constants_1.Intents[intent];
                    else {
                        if (intent === "ALL") {
                            bitmask = Constants_1.AllIntents;
                            break;
                        }
                        this._client.emit("warn", `Unknown intent: ${intent}`);
                    }
                }
                this.options.intents = bitmask;
            }
        }
        else
            this.options.intents = Constants_1.AllNonPrivilegedIntents;
        if (this.options.getAllUsers && !(this.options.intents & Constants_1.Intents.GUILD_MEMBERS)) {
            throw new Error("Guild members cannot be requested without the GUILD_MEMBERS intent");
        }
    }
    _ready(id) {
        const rateLimitKey = (id % this.options.concurrency) || 0;
        this._buckets[rateLimitKey] = Date.now();
        this.tryConnect();
    }
    connect(shard) {
        this._connectQueue.push(shard);
        this.tryConnect();
    }
    spawn(id) {
        let shard = this.get(id);
        if (!shard) {
            shard = new Shard_1.default(id, this._client);
            this.set(id, shard);
            shard
                .on("ready", () => {
                this._client.emit("shardReady", id);
                if (this._client.ready)
                    return;
                for (const other of this.values()) {
                    if (!other.ready)
                        return;
                }
                this._client.ready = true;
                this._client.startTime = Date.now();
                this._client.emit("ready");
            })
                .on("resume", () => {
                this._client.emit("shardResume", id);
                if (this._client.ready)
                    return;
                for (const other of this.values()) {
                    if (!other.ready)
                        return;
                }
                this._client.ready = true;
                this._client.startTime = Date.now();
                this._client.emit("ready");
            })
                .on("disconnect", (error) => {
                this._client.emit("shardDisconnect", error, id);
                for (const other of this.values()) {
                    if (other.ready)
                        return;
                }
                this._client.ready = false;
                this._client.startTime = 0;
                this._client.emit("disconnect");
            });
        }
        if (shard.status === "disconnected")
            return this.connect(shard);
    }
    tryConnect() {
        if (this._connectQueue.length === 0)
            return;
        for (const shard of this._connectQueue) {
            const rateLimitKey = (shard.id % this.options.concurrency) || 0;
            const lastConnect = this._buckets[rateLimitKey] || 0;
            if (!shard.sessionID && Date.now() - lastConnect < 5000)
                continue;
            if (this.some(s => s.connecting && ((s.id % this.options.concurrency) || 0) === rateLimitKey))
                continue;
            shard.connect();
            this._buckets[rateLimitKey] = Date.now();
            this._connectQueue.splice(this._connectQueue.findIndex(s => s.id === shard.id), 1);
        }
        if (!this._connectTimeout && this._connectQueue.length > 0) {
            this._connectTimeout = setTimeout(() => {
                this._connectTimeout = null;
                this.tryConnect();
            }, 500);
        }
    }
}
exports.default = ShardManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2hhcmRNYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL2dhdGV3YXkvU2hhcmRNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0RBQTRCO0FBRTVCLG9FQUE0QztBQUM1Qyw0Q0FBNEU7QUFFNUUsbURBQStDO0FBRS9DLE1BQXFCLFlBQWEsU0FBUSx3QkFBeUI7SUFDdkQsUUFBUSxDQUEwQjtJQUNsQyxPQUFPLENBQVU7SUFDakIsYUFBYSxDQUFnQjtJQUM3QixlQUFlLENBQXlCO0lBQ2hELE9BQU8sQ0FBOEI7SUFDckMsWUFBWSxNQUFjLEVBQUUsVUFBMEIsRUFBRTtRQUNwRCxLQUFLLEVBQUUsQ0FBQztRQUNSLG9CQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQzthQUNmLFdBQVcsQ0FBQyxVQUFVLEVBQUUsSUFBSSxHQUFHLEVBQUUsQ0FBQzthQUNsQyxXQUFXLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQzthQUM5QixXQUFXLENBQUMsZUFBZSxFQUFFLEVBQUUsQ0FBQzthQUNoQyxXQUFXLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2hELElBQUksQ0FBQyxPQUFPLEdBQUc7WUFDWCxhQUFhLEVBQVMsT0FBTyxDQUFDLGFBQWEsSUFBSSxJQUFJO1lBQ25ELFFBQVEsRUFBYyxPQUFPLENBQUMsUUFBUSxJQUFJLEtBQUs7WUFDL0Msb0JBQW9CLEVBQUU7Z0JBQ2xCLE9BQU8sRUFBRSxPQUFPLENBQUMsb0JBQW9CLEVBQUUsT0FBTyxJQUFJLFNBQVM7Z0JBQzNELE1BQU0sRUFBRyxPQUFPLENBQUMsb0JBQW9CLEVBQUUsTUFBTSxJQUFJLFNBQVM7Z0JBQzFELEVBQUUsRUFBTyxPQUFPLENBQUMsb0JBQW9CLEVBQUUsRUFBRSxJQUFJLE9BQU8sQ0FBQyxRQUFRO2FBQ2hFO1lBQ0QsV0FBVyxFQUFXLE9BQU8sQ0FBQyxXQUFXLEtBQUssTUFBTSxJ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