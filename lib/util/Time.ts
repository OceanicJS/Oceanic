import type Client from "../Client";

export default class Time {
    private client: Client;
    /** When the first shard connect happened, reset if all shards disconnect. */
    connect: number | null = null;
    /** When all shards disconnected, reset on any shard connect. */
    disconnect: number | null = null;
    /** When the first shard ready happened, reset if all shards disconnect. */
    ready: number | null = null;
    /** When the most recent shard connect happened. */
    shardConnect: number | null = null;
    /** When the most recent shard disconnect happened. */
    shardDisconnect: number | null = null;
    /** When the most recent shard pre-ready happened. */
    shardPreReady: number | null = null;
    /** When the most recent shard ready happened. */
    shardReady: number | null = null;
    /** When the most recent shard resume happened. */
    shardResume: number | null = null;
    /** When the client started. */
    start: number | null = null;
    constructor(client: Client) {
        this.client = client;
    }

    /** @internal */
    private _setConnect(value: number) {
        this.shardConnect = value;
        this.disconnect = null;
        if (!this.connect) {
            this.connect = value;
        }
    }

    /** @internal */
    private _setDisconnect(value: number) {
        this.shardDisconnect = value;
        const noneReady = this.client.shards.every(shard => !shard.ready);
        if (noneReady) {
            this.connect = null;
            this.disconnect = value;
            this.ready = null;
            this.start = null;
        }
    }

    /** @internal */
    private _setPreReady(value: number) {
        this.shardPreReady = value;
    }

    /** @internal */
    private _setReady(value: number) {
        this.shardReady = value;
        if (!this.ready) this.ready = value;
    }

    /** @internal */
    private _setResume(value: number) {
        this.shardResume = value;
    }

    /** @internal */
    private _setStart(value: number) {
        if (!this.start) {
            this.start = value;
        }
    }

    reset() {
        this.connect = null;
        this.disconnect = null;
        this.ready = null;
        this.start = null;
        this.shardConnect = null;
        this.shardDisconnect = null;
        this.shardPreReady = null;
        this.shardReady = null;
        this.shardResume = null;
    }

    /** @internal */
    set(type: "connect" | "disconnect" | "preReady" | "ready" | "resume" | "start", value: number): void {
        switch(type) {
            case "connect": return this._setConnect(value);
            case "disconnect": return this._setDisconnect(value);
            case "preReady": return this._setPreReady(value);
            case "ready": return this._setReady(value);
            case "resume": return this._setResume(value);
            case "start": return this._setStart(value);
        }
    }
}
