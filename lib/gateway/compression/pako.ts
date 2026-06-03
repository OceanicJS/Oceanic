import Compressor from "./base";
import type Shard from "../Shard";
import { GatewayError } from "../../util/Errors";
import { Inflate, constants } from "pako";

interface PakoExtra {
    chunks: Array<Buffer>;
    strm: {
        next_out: number;
        output: Buffer;
    };
}

export default class PakoCompression extends Compressor {
    protected _sharedZLib: Inflate & PakoExtra;
    constructor(shard: Shard) {
        super(shard);
        this._sharedZLib = new Inflate({ chunkSize: 128 * 1024 }) as Inflate & PakoExtra;
    }

    async decompress(data: Buffer): Promise<Buffer | null> {
        if (data.length >= 4 && data.readUInt32BE(data.length - 4) === 0xFFFF) {
            // store the current pointer for slicing buffers after pushing.
            const currentPointer: number | undefined = this._sharedZLib.strm?.next_out;
            this._sharedZLib.push(data, constants.Z_SYNC_FLUSH);
            if (this._sharedZLib.err) {
                this.shard.client.emit("error", new GatewayError(`zlib error ${this._sharedZLib.err}: ${this._sharedZLib.msg ?? ""}`, 0));
                return null;
            }

            if (this._sharedZLib.chunks.length === 0) {
                // The current buffer hasn't been flushed
                data = Buffer.from(this._sharedZLib.strm!.output.slice(currentPointer));
            } else {
                // Buffers have been flushed one or more times
                data = Buffer.concat([
                    this._sharedZLib.chunks[0].slice(currentPointer),
                    ...this._sharedZLib.chunks.slice(1),
                    this._sharedZLib.strm.output
                ]);
                this._sharedZLib.chunks = [];
            }

            return data;
        } else {
            this._sharedZLib.push(data, false);
            return null;
        }
    }
}
