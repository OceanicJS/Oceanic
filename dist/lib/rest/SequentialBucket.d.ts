/**
 * Latency & ratelimit related things lovingly borrowed from eris
 * https://github.com/abalabahaha/eris/blob/dev/lib/util/SequentialBucket.js (eb403730855714eafa36c541dbe2cb84c9979158)
 */
/// <reference types="node" />
import type { LatencyRef } from "../types/request-handler";
/** A ratelimit bucket. */
export default class SequentialBucket {
    #private;
    last: number;
    latencyRef: LatencyRef;
    limit: number;
    processing: NodeJS.Timeout | boolean;
    remaining: number;
    reset: number;
    constructor(limit: number, latencyRef: LatencyRef);
    private check;
    /**
     * Add an item to the queue.
     * @param func The function to queue.
     * @param priority- If true, the item will be added to the front of the queue/
     */
    queue(func: (cb: () => void) => void, priority?: boolean): void;
}
