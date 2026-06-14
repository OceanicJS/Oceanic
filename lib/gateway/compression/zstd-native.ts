/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import Compressor from "./base";
import type Shard from "../Shard";
import { GatewayError } from "../../util/Errors";
// @ts-ignore only in node >=22.15.0
import { createZstdDecompress, type ZstdDecompress } from "node:zlib";

export default class ZstdNativeCompressor extends Compressor {
    _decompressQueue: Promise<void>;
    stream: ZstdDecompress;
    constructor(shard: Shard) {
        super(shard);
        this._decompressQueue = Promise.resolve();
        this.stream = createZstdDecompress({ chunkSize: 65535 });
        // @ts-ignore only in node >=22.15.0
        this.stream.on("error", err => {
            this.shard.client.emit("error", new GatewayError(`zstd error: ${String(err)}`, 0));
        });
    }

    async decompress(data: Buffer): Promise<Buffer | null> {
        let result: Buffer | null = null;
        this._decompressQueue = this._decompressQueue.then(async() => await new Promise<void>(resolve => {
            const chunks: Array<Buffer> = [];
            const onData = (chunk: Buffer): void => {
                chunks.push(chunk);
            };

            this.stream.on("data", onData);
            // @ts-ignore only in node >=22.15.0
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
