import Compression from "./base";
import type Shard from "../Shard";
import { GatewayError } from "../../util/Errors";
import { createInflate, type Inflate } from "node:zlib";

export default class ZlibNativeCompression extends Compression {
    _chunks: Array<Buffer>;
    _decompressQueue: Promise<void>;
    stream: Inflate;
    constructor(shard: Shard) {
        super(shard);
        this._chunks = [];
        this._decompressQueue = Promise.resolve();
        this.stream = createInflate();
        this.stream.on("error", err => {
            this.shard.client.emit("error", new GatewayError(`zlib error: ${String(err)}`, 0));
        });
    }

    async decompress(data: Buffer): Promise<Buffer | null> {
        const isComplete = data.length >= 4 && data.readUInt32BE(data.length - 4) === 0xFFFF;
        let result: Buffer | null = null;
        this._decompressQueue = this._decompressQueue.then(async() => new Promise<void>(resolve => {
            // eslint-disable-next-line unicorn/consistent-function-scoping
            const onData = (chunk: Buffer): void => {
                this._chunks.push(chunk);
            };
            this.stream.on("data", onData);
            this.stream.write(data, error => {
                this.stream.off("data", onData);
                if (error) {
                    this.shard.client.emit("error", new GatewayError(`Failed to decompress zlib: ${String(error)}`, 0));
                    result = null;
                    resolve();
                    return;
                }
                if (isComplete) {
                    result = this._chunks.length === 0 ? null : Buffer.concat(this._chunks);
                    this._chunks = [];
                }
                resolve();
            });
        }));
        await this._decompressQueue;
        return result;
    }
}
