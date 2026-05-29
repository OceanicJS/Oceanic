import Compressor from "./base";
import type Shard from "../Shard";
import { GatewayError } from "../../util/Errors";
import ZlibSync from "zlib-sync";

export default class ZlibSyncCompressor extends Compressor {
    _sharedZLib: ZlibSync.Inflate;
    constructor(shard: Shard) {
        super(shard);
        this._sharedZLib = new ZlibSync.Inflate({ chunkSize: 128 * 1024 });
    }

    async decompress(data: Buffer): Promise<Buffer | null> {
        if (data.length >= 4 && data.readUInt32BE(data.length - 4) === 0xFFFF) {
            // store the current pointer for slicing buffers after pushing.
            this._sharedZLib.push(data, ZlibSync.Z_SYNC_FLUSH);
            if (this._sharedZLib.err) {
                this.shard.client.emit("error", new GatewayError(`zlib error ${this._sharedZLib.err}: ${this._sharedZLib.msg ?? ""}`, 0));
                return null;
            }

            data = Buffer.isBuffer(this._sharedZLib.result) ? this._sharedZLib.result : Buffer.from(this._sharedZLib.result ?? "");

            return data;
        } else {
            this._sharedZLib.push(data, false);
            return null;
        }
    }
}
