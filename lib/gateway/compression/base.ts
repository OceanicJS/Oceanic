import type Shard from "../Shard";

export default abstract class Compressor {
    shard!: Shard;
    abstract decompress(data: Buffer): Promise<Buffer | null>;
    constructor(shard: Shard) {
        Object.defineProperty(this, "shard", {
            value:        shard,
            configurable: false,
            enumerable:   false,
            writable:     false
        });
    }
}
