"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TextableChannel_1 = __importDefault(require("./TextableChannel"));
const AnnouncementThreadChannel_1 = __importDefault(require("./AnnouncementThreadChannel"));
const Collection_1 = __importDefault(require("../util/Collection"));
/** Represents a guild news channel. */
class AnnouncementChannel extends TextableChannel_1.default {
    /** The threads in this channel. */
    threads;
    constructor(data, client) {
        super(data, client);
        this.threads = new Collection_1.default(AnnouncementThreadChannel_1.default, client);
    }
    /**
     * Convert this news channel to a text channel.
     */
    async convert() {
        return super.convert();
    }
    /**
     * Crosspost a message in this channel.
     * @param messageID The ID of the message to crosspost.
     */
    async crosspostMessage(messageID) {
        return this._client.rest.channels.crosspostMessage(this.id, messageID);
    }
    /**
     * Edit this channel.
     * @param options The options for editing the channel.
     */
    async edit(options) {
        return this._client.rest.channels.edit(this.id, options);
    }
    toJSON() {
        return {
            ...super.toJSON(),
            rateLimitPerUser: 0,
            threads: this.threads.map(thread => thread.id),
            type: this.type
        };
    }
}
exports.default = AnnouncementChannel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQW5ub3VuY2VtZW50Q2hhbm5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9zdHJ1Y3R1cmVzL0Fubm91bmNlbWVudENoYW5uZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx3RUFBZ0Q7QUFHaEQsNEZBQW9FO0FBS3BFLG9FQUE0QztBQUU1Qyx1Q0FBdUM7QUFDdkMsTUFBcUIsbUJBQW9CLFNBQVEseUJBQW9DO0lBSWpGLG1DQUFtQztJQUNuQyxPQUFPLENBQThFO0lBRXJGLFlBQVksSUFBNEIsRUFBRSxNQUFjO1FBQ3BELEtBQUssQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDcEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLG9CQUFVLENBQUMsbUNBQXlCLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDckUsQ0FBQztJQUVEOztPQUVHO0lBQ0gsS0FBSyxDQUFDLE9BQU87UUFDVCxPQUFPLEtBQUssQ0FBQyxPQUFPLEVBQTRCLENBQUM7SUFDckQsQ0FBQztJQUVEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFpQjtRQUNwQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzNFLENBQUM7SUFFRDs7O09BR0c7SUFDTSxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQWdDO1FBQ2hELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBTyxJQUFJLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFFUSxNQUFNO1FBQ1gsT0FBTztZQUNILEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUNqQixnQkFBZ0IsRUFBRSxDQUFDO1lBQ25CLE9BQU8sRUFBVyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDdkQsSUFBSSxFQUFjLElBQUksQ0FBQyxJQUFJO1NBQzlCLENBQUM7SUFDTixDQUFDO0NBQ0o7QUEzQ0Qsc0NBMkNDIn0=