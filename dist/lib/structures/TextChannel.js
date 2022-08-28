"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TextableChannel_1 = __importDefault(require("./TextableChannel"));
const Constants_1 = require("../Constants");
/** Represents a guild text channel. */
class TextChannel extends TextableChannel_1.default {
    constructor(data, client) {
        super(data, client);
    }
    /**
     * Convert this text channel to a announcement channel.
     *
     * @returns {Promise<AnnouncementChannel>}
     */
    async convert() {
        return this.edit({ type: Constants_1.ChannelTypes.GUILD_ANNOUNCEMENT });
    }
    /**
     * Edit this channel.
     *
     * @param {Object} options
     * @param {?ThreadAutoArchiveDuration} [options.defaultAutoArchiveDuration] - The default auto archive duration for threads made in this channel.
     * @param {String} [options.name] - The name of the channel.
     * @param {?Boolean} [options.nsfw] - If the channel is age gated.
     * @param {?String} [options.parentID] - The id of the parent category channel.
     * @param {?RawOverwrite[]} [options.permissionOverwrites] - Channel or category specific permissions
     * @param {?Number} [options.position] - The position of the channel in the channel list.
     * @param {?Number} [options.rateLimitPerUser] - The seconds between sending messages for users. Between 0 and 21600.
     * @param {String} [options.reason] - The reason to be displayed in the audit log.
     * @param {?String} [options.topic] - The topic of the channel.
     * @param {ChannelTypes.GUILD_ANNOUNCEMENT} [options.type] - Provide the opposite type to convert the channel.
     * @returns {Promise<TextChannel>}
     */
    async edit(options) {
        return this._client.rest.channels.edit(this.id, options);
    }
    /**
     * Follow an announcement channel to this channel.
     *
     * @param {Object} options
     * @param {String} [options.webhookChannelID] - The id of the channel to follow.
     * @returns {Promise<FollowedChannel>}
     */
    async followAnnouncement(options) {
        return this._client.rest.channels.followAnnouncement(this.id, options);
    }
    toJSON() {
        return {
            ...super.toJSON(),
            type: this.type
        };
    }
}
exports.default = TextChannel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGV4dENoYW5uZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvc3RydWN0dXJlcy9UZXh0Q2hhbm5lbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHdFQUFnRDtBQUdoRCw0Q0FBNEM7QUFNNUMsdUNBQXVDO0FBQ3ZDLE1BQXFCLFdBQVksU0FBUSx5QkFBNEI7SUFFcEUsWUFBWSxJQUFvQixFQUFFLE1BQWM7UUFDL0MsS0FBSyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNyQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILEtBQUssQ0FBQyxPQUFPO1FBQ1osT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLHdCQUFZLENBQUMsa0JBQWtCLEVBQUUsQ0FBb0MsQ0FBQztJQUNoRyxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7OztPQWVHO0lBQ00sS0FBSyxDQUFDLElBQUksQ0FBQyxPQUErQjtRQUNsRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQU8sSUFBSSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsS0FBSyxDQUFDLGtCQUFrQixDQUFDLE9BQTBDO1FBQ2xFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDeEUsQ0FBQztJQUVELE1BQU07UUFDTCxPQUFPO1lBQ04sR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFO1lBQ2pCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtTQUNmLENBQUM7SUFDSCxDQUFDO0NBQ0Q7QUFwREQsOEJBb0RDIn0=