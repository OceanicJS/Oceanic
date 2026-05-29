import Compression from "./base";
import type Shard from "../Shard";
import { GatewayError } from "../../util/Errors";
import * as zstd from "zstd-napi";

export default class ZstdCompression extends Compression {
    _decompressQueue: Promise<void>;
    stream: zstd.DecompressStream;
    constructor(shard: Shard) {
        super(shard);
        this._decompressQueue = Promise.resolve();
        this.stream = new zstd.DecompressStream();
    }

    async decompress(data: Buffer): Promise<Buffer | null> {
        let result: Buffer | null = null;
        this._decompressQueue = this._decompressQueue.then(async() => await new Promise<void>(resolve => {
            const chunks: Array<Buffer> = [];
            const onData = (chunk: Buffer): void => {
                chunks.push(chunk);
            };

            this.stream.on("data", onData);
            this.stream.write(data, "binary", error => {
                this.stream.off("data", onData);
                if (error) {
                    this.shard.client.emit("error", new GatewayError(`Failed to decompress zstd: ${String(error)}`, 0));
                    result = null;
                    resolve();
                    return;
                }

                result = chunks.length === 0 ? null : Buffer.concat(chunks);
                resolve();
            });
        }));

        await this._decompressQueue;
        return result;
    }
}
