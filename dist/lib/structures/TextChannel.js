"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TextableChannel_1 = __importDefault(require("./TextableChannel"));
const ThreadChannel_1 = __importDefault(require("./ThreadChannel"));
const Constants_1 = require("../Constants");
const Collection_1 = __importDefault(require("../util/Collection"));
/** Represents a guild text channel. */
class TextChannel extends TextableChannel_1.default {
    /** The threads in this channel. */
    threads;
    constructor(data, client) {
        super(data, client);
        this.threads = new Collection_1.default(ThreadChannel_1.default, client);
    }
    /**
     * Convert this text channel to a announcement channel.
     */
    async convert() {
        return this.edit({ type: Constants_1.ChannelTypes.GUILD_ANNOUNCEMENT });
    }
    /**
     * Edit this channel.
     * @param options The options for editing the channel
     */
    async edit(options) {
        return this._client.rest.channels.edit(this.id, options);
    }
    /**
     * Follow an announcement channel to this channel.
     * @param webhookChannelID The ID of the channel to follow the announcement channel to.
     */
    async followAnnouncement(webhookChannelID) {
        return this._client.rest.channels.followAnnouncement(this.id, webhookChannelID);
    }
    toJSON() {
        return {
            ...super.toJSON(),
            threads: this.threads.map(thread => thread.id),
            type: this.type
        };
    }
}
exports.default = TextChannel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGV4dENoYW5uZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvc3RydWN0dXJlcy9UZXh0Q2hhbm5lbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHdFQUFnRDtBQUloRCxvRUFBNEM7QUFDNUMsNENBQTRDO0FBSTVDLG9FQUE0QztBQUU1Qyx1Q0FBdUM7QUFDdkMsTUFBcUIsV0FBWSxTQUFRLHlCQUE0QjtJQUNqRSxtQ0FBbUM7SUFDbkMsT0FBTyxDQUFtSDtJQUUxSCxZQUFZLElBQW9CLEVBQUUsTUFBYztRQUM1QyxLQUFLLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxvQkFBVSxDQUFDLHVCQUFhLEVBQUUsTUFBTSxDQUFxSCxDQUFDO0lBQzdLLENBQUM7SUFFRDs7T0FFRztJQUNILEtBQUssQ0FBQyxPQUFPO1FBQ1QsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLHdCQUFZLENBQUMsa0JBQWtCLEVBQUUsQ0FBb0MsQ0FBQztJQUNuRyxDQUFDO0lBRUQ7OztPQUdHO0lBQ00sS0FBSyxDQUFDLElBQUksQ0FBQyxPQUErQjtRQUMvQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQU8sSUFBSSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLGtCQUFrQixDQUFDLGdCQUF3QjtRQUM3QyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDcEYsQ0FBQztJQUVELE1BQU07UUFDRixPQUFPO1lBQ0gsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFO1lBQ2pCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDOUMsSUFBSSxFQUFLLElBQUksQ0FBQyxJQUFJO1NBQ3JCLENBQUM7SUFDTixDQUFDO0NBQ0o7QUF2Q0QsOEJBdUNDIn0=