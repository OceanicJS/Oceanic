/**
 * lovingly borrowed from eris
 * https://github.com/abalabahaha/eris/blob/dev/lib/util/Bucket.js (eb403730855714eafa36c541dbe2cb84c9979158)
 */
/// <reference types="node" />
/** A bucket. */
export default class Bucket {
    #private;
    interval: number;
    lastReset: number;
    lastSend: number;
    latencyRef: {
        latency: number;
    };
    reservedTokens: number;
    timeout: NodeJS.Timeout | null;
    tokenLimit: number;
    tokens: number;
    constructor(tokenLimit: number, interval: number, options?: {
        latencyRef?: {
            latency: number;
        };
        reservedTokens?: number;
    });
    private check;
    /**
     * Add an item to the queue.
     * @param func The function to queue.
     * @param priority If true, the item will be added to the front of the queue.
     */
    queue(func: () => void, priority?: boolean): void;
}
