/**
 * lovingly borrowed from eris
 * https://github.com/abalabahaha/eris/blob/dev/lib/util/Bucket.js (eb403730855714eafa36c541dbe2cb84c9979158)
 */

/** A bucket. */
export default class Bucket {
    private _queue: Array<{ priority: boolean; func(): void;}> = [];
    interval: number;
    lastReset: number;
    lastSend: number;
    latencyRef: { latency: number; };
    reservedTokens: number;
    timeout: NodeJS.Timeout | null;
    tokenLimit: number;
    tokens: number;
    constructor(tokenLimit: number, interval: number, options?: { latencyRef?: { latency: number; }; reservedTokens?: number; }) {
        this.tokenLimit = tokenLimit;
        this.interval = interval;
        this.latencyRef = options?.latencyRef || { latency: 0 };
        this.lastReset = this.tokens = this.lastSend = 0;
        this.reservedTokens = options?.reservedTokens || 0;
    }

    private check() {
        if (this.timeout || this._queue.length === 0) return;
        if (this.lastReset + this.interval + this.tokenLimit * this.latencyRef.latency < Date.now()) {
            this.lastReset = Date.now();
            this.tokens = Math.max(0, this.tokens - this.tokenLimit);
        }

        let val: number;
        let tokensAvailable = this.tokens < this.tokenLimit;
        let unreservedTokensAvailable = this.tokens < (this.tokenLimit - this.reservedTokens);
        while (this._queue.length > 0 && (unreservedTokensAvailable || (tokensAvailable && this._queue[0].priority))) {
            this.tokens++;
            tokensAvailable = this.tokens < this.tokenLimit;
            unreservedTokensAvailable = this.tokens < (this.tokenLimit - this.reservedTokens);
            const item = this._queue.shift();
            val = this.latencyRef.latency - Date.now() + this.lastSend;
            if (this.latencyRef.latency === 0 || val <= 0) {
                item!.func();
                this.lastSend = Date.now();
            } else {
                setTimeout(() => {
                    item!.func();
                }, val);
                this.lastSend = Date.now() + val;
            }
        }

        if (this._queue.length > 0 && !this.timeout) {
            this.timeout = setTimeout(() => {
                this.timeout = null;
                this.check();
            }, this.tokens < this.tokenLimit ? this.latencyRef.latency : Math.max(0, this.lastReset + this.interval + this.tokenLimit * this.latencyRef.latency - Date.now()));

        }
    }

    /**
     * add an item to the queue
     *
     * @param {Function} func - the function to queue
     * @param {Boolean} [priority=false] - if true, the item will be added to the front of the queue
     * @returns {void}
     */
    queue(func: () => void, priority = false): void {
        if (priority) this._queue.unshift({ func, priority });
        else this._queue.push({ func, priority });
        this.check();
    }
}
