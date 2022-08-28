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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2hhcmRNYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL2dhdGV3YXkvU2hhcmRNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0RBQTRCO0FBRTVCLG9FQUE0QztBQUM1Qyw0Q0FBZ0U7QUFFaEUsbURBQStDO0FBRS9DLE1BQXFCLFlBQWEsU0FBUSx3QkFBeUI7SUFDdkQsUUFBUSxDQUF5QjtJQUNqQyxPQUFPLENBQVM7SUFDaEIsYUFBYSxDQUFlO0lBQzVCLGVBQWUsQ0FBd0I7SUFDL0MsT0FBTyxDQUE4QjtJQUNyQyxZQUFZLE1BQWMsRUFBRSxVQUEwQixFQUFFO1FBQ3BELEtBQUssRUFBRSxDQUFDO1FBQ1Isb0JBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDO2FBQ2YsV0FBVyxDQUFDLFVBQVUsRUFBRSxJQUFJLEdBQUcsRUFBRSxDQUFDO2FBQ2xDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDO2FBQzlCLFdBQVcsQ0FBQyxlQUFlLEVBQUUsRUFBRSxDQUFDO2FBQ2hDLFdBQVcsQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLE9BQU8sR0FBRztZQUNYLGFBQWEsRUFBUyxPQUFPLENBQUMsYUFBYSxJQUFJLElBQUk7WUFDbkQsUUFBUSxFQUFjLE9BQU8sQ0FBQyxRQUFRLElBQUksS0FBSztZQUMvQyxvQkFBb0IsRUFBRTtnQkFDbEIsT0FBTyxFQUFFLE9BQU8sQ0FBQyxvQkFBb0IsRUFBRSxPQUFPLElBQUksU0FBUztnQkFDM0QsTUFBTSxFQUFHLE9BQU8sQ0FBQyxvQkFBb0IsRUFBRSxNQUFNLElBQUksU0FBUztnQkFDMUQsRUFBRSxFQUFPLE9BQU8sQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLElBQUksT0FBTyxDQUFDLFFBQVE7YUFDaEU7WUFDRCxXQUFXLEVBQVcsT0FBTyxDQUFDLFdBQVcsS0FBSyxNQUFNLElB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