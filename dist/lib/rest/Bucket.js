"use strict";
/**
 * lovingly borrowed from eris
 * https://github.com/abalabahaha/eris/blob/dev/lib/util/Bucket.js (eb403730855714eafa36c541dbe2cb84c9979158)
 */
Object.defineProperty(exports, "__esModule", { value: true });
/** A bucket. */
class Bucket {
    _queue = [];
    interval;
    lastReset;
    lastSend;
    latencyRef;
    reservedTokens;
    timeout;
    tokenLimit;
    tokens;
    constructor(tokenLimit, interval, options) {
        this.tokenLimit = tokenLimit;
        this.interval = interval;
        this.latencyRef = options?.latencyRef || { latency: 0 };
        this.lastReset = this.tokens = this.lastSend = 0;
        this.reservedTokens = options?.reservedTokens || 0;
    }
    check() {
        if (this.timeout || this._queue.length === 0)
            return;
        if (this.lastReset + this.interval + this.tokenLimit * this.latencyRef.latency < Date.now()) {
            this.lastReset = Date.now();
            this.tokens = Math.max(0, this.tokens - this.tokenLimit);
        }
        let val;
        let tokensAvailable = this.tokens < this.tokenLimit;
        let unreservedTokensAvailable = this.tokens < (this.tokenLimit - this.reservedTokens);
        while (this._queue.length > 0 && (unreservedTokensAvailable || (tokensAvailable && this._queue[0].priority))) {
            this.tokens++;
            tokensAvailable = this.tokens < this.tokenLimit;
            unreservedTokensAvailable = this.tokens < (this.tokenLimit - this.reservedTokens);
            const item = this._queue.shift();
            val = this.latencyRef.latency - Date.now() + this.lastSend;
            if (this.latencyRef.latency === 0 || val <= 0) {
                item.func();
                this.lastSend = Date.now();
            }
            else {
                setTimeout(() => {
                    item.func();
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
    queue(func, priority = false) {
        if (priority)
            this._queue.unshift({ func, priority });
        else
            this._queue.push({ func, priority });
        this.check();
    }
}
exports.default = Bucket;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQnVja2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3Jlc3QvQnVja2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7O0dBR0c7O0FBRUgsZ0JBQWdCO0FBQ2hCLE1BQXFCLE1BQU07SUFDZixNQUFNLEdBQStDLEVBQUUsQ0FBQztJQUNoRSxRQUFRLENBQVM7SUFDakIsU0FBUyxDQUFTO0lBQ2xCLFFBQVEsQ0FBUztJQUNqQixVQUFVLENBQXVCO0lBQ2pDLGNBQWMsQ0FBUztJQUN2QixPQUFPLENBQXdCO0lBQy9CLFVBQVUsQ0FBUztJQUNuQixNQUFNLENBQVM7SUFDZixZQUFZLFVBQWtCLEVBQUUsUUFBZ0IsRUFBRSxPQUF5RTtRQUN2SCxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUM3QixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sRUFBRSxVQUFVLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUM7UUFDeEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxjQUFjLEdBQUcsT0FBTyxFQUFFLGNBQWMsSUFBSSxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVPLEtBQUs7UUFDVCxJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQztZQUFFLE9BQU87UUFDckQsSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDekYsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENB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