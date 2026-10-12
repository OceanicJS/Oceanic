import { Inflate, Z_SYNC_FLUSH } from "pako";

import { GatewayError } from "../../util/Errors";

import Compressor from "./base";

import type Shard from "../Shard";

export default class PakoCompression extends Compressor {
    _sharedZLib: Inflate;
    constructor(shard: Shard) {
        super(shard);
        this._sharedZLib = new Inflate({ chunkSize: 128 * 1024 });
    }

    async decompress(data: Buffer): Promise<Buffer | null> {
        if (data.length >= 4 && data.readUInt32BE(data.length - 4) === 0xFFFF) {
            // a sync flush moves everything decompressed so far into chunks
            this._sharedZLib.push(data, Z_SYNC_FLUSH);
            if (this._sharedZLib.err) {
                this.shard.client.emit("error", new GatewayError(`zlib error ${this._sharedZLib.err}: ${this._sharedZLib.msg}`, 0));
                return null;
            }

            data = Buffer.concat(this._sharedZLib.chunks);
            this._sharedZLib.chunks = [];

            return data;
        } else {
            this._sharedZLib.push(data, false);
            return null;
        }
    }
}
