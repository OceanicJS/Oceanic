import Shard from "./Shard";
import type Client from "../Client";
import Properties from "../util/Properties";
import { AllNonPrivilegedIntents, Intents } from "../Constants";
import type { GatewayOptions, ShardManagerInstanceOptions } from "../types/gateway";
import { Collection } from "@augu/collections";

export default class ShardManager extends Collection<number, Shard> {
	private _buckets: Record<number, number>;
	private _client: Client;
	private _connectQueue: Array<Shard>;
	private _connectTimeout: NodeJS.Timeout | null;
	options: ShardManagerInstanceOptions;
	constructor(client: Client, options: GatewayOptions = {}) {
		super();
		Properties.new(this)
			.looseDefine("_buckets", new Map())
			.looseDefine("_client", client)
			.looseDefine("_connectQueue", [])
			.looseDefine("_connectTimeout", null, true);
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
			reconnectDelay:       options.reconnectDelay ?? ((lastDelay, attempts) => Math.pow(attempts + 1, 0.7) * 20000),
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
					if (typeof intent === "number") bitmask |= intent;
					else if (Intents[intent as keyof typeof Intents]) bitmask |= Intents[intent as keyof typeof Intents];
					else this._client.emit("warn", `Unknown intent: ${intent}`);
				}
				this.options.intents = bitmask;
			}
		} else this.options.intents = AllNonPrivilegedIntents;

		if (this.options.getAllUsers && !(this.options.intents & Intents.GUILD_MEMBERS)) {
			throw new Error("Guild members cannot be requested without the GUILD_MEMBERS intent");
		}
	}

	private _ready(id: number) {
		const rateLimitKey = (id % this.options.concurrency) || 0;
		this._buckets[rateLimitKey] = Date.now();

		this.tryConnect();
	}

	connect(shard: Shard) {
		this._connectQueue.push(shard);
		this.tryConnect();
	}

	spawn(id: number) {
		let shard = this.get(id);
		if (!shard) {
			shard = new Shard(id, this._client);
			this.set(id, shard);
			shard
				.on("ready", () => {
					this._client.emit("shardReady", id);
					if (this._client.ready) return;
					for (const other of this.values()) {
						if (!other.ready) return;
					}
					this._client.ready = true;
					this._client.startTime = Date.now();
					this._client.emit("ready");
				})
				.on("resume", () => {
					this._client.emit("shardResume", id);
					if (this._client.ready) return;
					for (const other of this.values()) {
						if (!other.ready) return;
					}
					this._client.ready = true;
					this._client.startTime = Date.now();
					this._client.emit("ready");
				})
				.on("disconnect", (error) => {
					this._client.emit("shardDisconnect", error, id);
					for (const other of this.values()) {
						if (other.ready) return;
					}
					this._client.ready = false;
					this._client.startTime = 0;
					this._client.emit("disconnect");
				});
		}

		if (shard.status === "disconnected") return this.connect(shard);
	}

	tryConnect() {
		if (this._connectQueue.length === 0) return;

		for (const shard of this._connectQueue) {
			const rateLimitKey = (shard.id % this.options.concurrency) || 0;
			const lastConnect = this._buckets[rateLimitKey] || 0;
			if (!shard.sessionID && Date.now() - lastConnect < 5000) continue;

			if (this.some(s => s.connecting && ((s.id % this.options.concurrency) || 0) === rateLimitKey)) continue;
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
