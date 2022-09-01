"use strict";
/**
 * Latency & ratelimit related things lovingly borrowed from eris
 * https://github.com/abalabahaha/eris/blob/dev/lib/util/SequentialBucket.js (eb403730855714eafa36c541dbe2cb84c9979158)
 */
Object.defineProperty(exports, "__esModule", { value: true });
/** A ratelimit bucket. */
class SequentialBucket {
    last;
    latencyRef;
    limit;
    processing = false;
    #queue = [];
    remaining;
    reset;
    constructor(limit, latencyRef) {
        this.limit = this.remaining = limit;
        this.latencyRef = latencyRef;
        this.last = this.reset = 0;
    }
    check(force = false) {
        if (this.#queue.length === 0) {
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
        this.#queue.shift()(() => {
            if (this.#queue.length > 0)
                this.check(true);
            else
                this.processing = false;
        });
    }
    /**
     * Add an item to the queue.
     * @param func The function to queue.
     * @param priority- If true, the item will be added to the front of the queue/
     */
    queue(func, priority = false) {
        if (priority)
            this.#queue.unshift(func);
        else
            this.#queue.push(func);
        this.check();
    }
}
exports.default = SequentialBucket;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VxdWVudGlhbEJ1Y2tldC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9yZXN0L1NlcXVlbnRpYWxCdWNrZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7R0FHRzs7QUFJSCwwQkFBMEI7QUFDMUIsTUFBcUIsZ0JBQWdCO0lBQ2pDLElBQUksQ0FBUztJQUNiLFVBQVUsQ0FBYTtJQUN2QixLQUFLLENBQVM7SUFDZCxVQUFVLEdBQTZCLEtBQUssQ0FBQztJQUM3QyxNQUFNLEdBQW9DLEVBQUUsQ0FBQztJQUM3QyxTQUFTLENBQVM7SUFDbEIsS0FBSyxDQUFTO0lBQ2QsWUFBWSxLQUFhLEVBQUUsVUFBc0I7UUFDN0MsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztRQUNwQyxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUM3QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFTyxLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUs7UUFDdkIsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDMUIsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUNqQixJQUFJLE9BQU8sSUFBSSxDQUFDLFVBQVUsS0FBSyxTQUFTO29CQUFFLFlBQVksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQ3hFLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO2FBQzNCO1lBQ0QsT0FBTztTQUNWO1FBQ0QsSUFBSSxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsS0FBSztZQUFFLE9BQU87UUFDdEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3ZCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxHQUFHLE1BQU0sRUFBRTtZQUMxQyxJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUM7WUFDMUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1NBQy9CO1FBQ0QsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7UUFDaEIsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsRUFBRTtZQUNyQixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxHQUFHLEVBQUU7Z0JBQzlCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO2dCQUN4QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3JCLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3RELE9BQU87U0FDVjtRQUNELEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUNqQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRyxDQUFDLEdBQUcsRUFBRTtZQUN0QixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUM7Z0JBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQzs7Z0JBQ3hDLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1FBQ2pDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxLQUFLLENBQUMsSUFBOEIsRUFBRSxRQUFRLEdBQUcsS0FBSztRQUNsRCxJQUFJLFFBQVE7WUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQzs7WUFDbkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2pCLENBQUM7Q0FDSjtBQXZERCxtQ0F1REMifQ==