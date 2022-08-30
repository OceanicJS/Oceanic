"use strict";
/**
 * Latency & ratelimit related things lovingly borrowed from eris
 * https://github.com/abalabahaha/eris/blob/dev/lib/util/SequentialBucket.js (eb403730855714eafa36c541dbe2cb84c9979158)
 */
Object.defineProperty(exports, "__esModule", { value: true });
/** A ratelimit bucket. */
class SequentialBucket {
    _queue = [];
    last;
    latencyRef;
    limit;
    processing = false;
    remaining;
    reset = 0;
    constructor(limit, latencyRef) {
        this.limit = this.remaining = limit;
        this.latencyRef = latencyRef;
    }
    check(force = false) {
        if (this._queue.length === 0) {
            if (this.processing) {
                if (typeof this.processing !== "boolean")
                    clearTimeout(this.processing);
                this.processing = false;
            }
            return;
        }
        if (this.processing && !force)
            return;
        const now = Date.now();
        const offset = this.latencyRef.latency;
        if (!this.reset || this.reset < now - offset) {
            this.reset = now - offset;
            this.remaining = this.limit;
        }
        this.last = now;
        if (this.remaining <= 0) {
            this.processing = setTimeout(() => {
                this.processing = false;
                this.check(true);
            }, Math.max(0, (this.reset || 0) - now + offset) + 1);
            return;
        }
        --this.remaining;
        this.processing = true;
        this._queue.shift()(() => {
            if (this._queue.length > 0)
                this.check(true);
            else
                this.processing = false;
        });
    }
    /**
     * Add an item to the queue.
     * @param func - The function to queue.
     * @param priority- If true, the item will be added to the front of the queue/
     */
    queue(func, priority = false) {
        if (priority)
            this._queue.unshift(func);
        else
            this._queue.push(func);
        this.check();
    }
}
exports.default = SequentialBucket;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VxdWVudGlhbEJ1Y2tldC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9yZXN0L1NlcXVlbnRpYWxCdWNrZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7R0FHRzs7QUFJSCwwQkFBMEI7QUFDMUIsTUFBcUIsZ0JBQWdCO0lBQ3pCLE1BQU0sR0FBb0MsRUFBRSxDQUFDO0lBQ3JELElBQUksQ0FBUztJQUNiLFVBQVUsQ0FBYTtJQUN2QixLQUFLLENBQVM7SUFDZCxVQUFVLEdBQTZCLEtBQUssQ0FBQztJQUM3QyxTQUFTLENBQVM7SUFDbEIsS0FBSyxHQUFHLENBQUMsQ0FBQztJQUNWLFlBQVksS0FBYSxFQUFFLFVBQXNCO1FBQzdDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDcEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7SUFDakMsQ0FBQztJQUVPLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSztRQUN2QixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUMxQixJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQ2pCLElBQUksT0FBTyxJQUFJLENBQUMsVUFBVSxLQUFLLFNBQVM7b0JBQUUsWUFBWSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDeEUsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7YUFDM0I7WUFDRCxPQUFPO1NBQ1Y7UUFDRCxJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxLQUFLO1lBQUUsT0FBTztRQUN0QyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDdkIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7UUFDdkMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLEdBQUcsTUFBTSxFQUFFO1lBQzFDLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxHQUFHLE1BQU0sQ0FBQztZQUMxQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7U0FDL0I7UUFDRCxJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUNoQixJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxFQUFFO1lBQ3JCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDOUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7Z0JBQ3hCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckIsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDdEQsT0FBTztTQUNWO1FBQ0QsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ2pCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFHLENBQUMsR0FBRyxFQUFFO1lBQ3RCLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQztnQkFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDOztnQkFDeEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFDakMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILEtBQUssQ0FBQyxJQUE4QixFQUFFLFFBQVEsR0FBRyxLQUFLO1FBQ2xELElBQUksUUFBUTtZQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDOztZQUNuQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDakIsQ0FBQztDQUNKO0FBdERELG1DQXNEQyJ9