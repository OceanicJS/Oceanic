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
                    else
                        this._client.emit("warn", `Unknown intent: ${intent}`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2hhcmRNYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL2dhdGV3YXkvU2hhcmRNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0RBQTRCO0FBRTVCLG9FQUE0QztBQUM1Qyw0Q0FBZ0U7QUFFaEUsbURBQStDO0FBRS9DLE1BQXFCLFlBQWEsU0FBUSx3QkFBeUI7SUFDMUQsUUFBUSxDQUF5QjtJQUNqQyxPQUFPLENBQVM7SUFDaEIsYUFBYSxDQUFlO0lBQzVCLGVBQWUsQ0FBd0I7SUFDL0MsT0FBTyxDQUE4QjtJQUNyQyxZQUFZLE1BQWMsRUFBRSxVQUEwQixFQUFFO1FBQ3ZELEtBQUssRUFBRSxDQUFDO1FBQ1Isb0JBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDO2FBQ2xCLFdBQVcsQ0FBQyxVQUFVLEVBQUUsSUFBSSxHQUFHLEVBQUUsQ0FBQzthQUNsQyxXQUFXLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQzthQUM5QixXQUFXLENBQUMsZUFBZSxFQUFFLEVBQUUsQ0FBQzthQUNoQyxXQUFXLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzdDLElBQUksQ0FBQyxPQUFPLEdBQUc7WUFDZCxhQUFhLEVBQVMsT0FBTyxDQUFDLGFBQWEsSUFBSSxJQUFJO1lBQ25ELFFBQVEsRUFBYyxPQUFPLENBQUMsUUFBUSxJQUFJLEtBQUs7WUFDL0Msb0JBQW9CLEVBQUU7Z0JBQ3JCLE9BQU8sRUFBRSxPQUFPLENBQUMsb0JBQW9CLEVBQUUsT0FBTyxJQUFJLFNBQVM7Z0JBQzNELE1BQU0sRUFBRyxPQUFPLENBQUMsb0JBQW9CLEVBQUUsTUFBTSxJQUFJLFNBQVM7Z0JBQzFELEVBQUUsRUFBTyxPQUFPLENBQUMsb0JBQW9CLEVBQUUsRUFBRSxJQUFJLE9BQU8sQ0FBQyxRQUFRO2FBQzdEO1lBQ0QsV0FBVyxFQUFXLE9BQU8sQ0FBQyxXQUFXLEtBQUssTUFBTSxJ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