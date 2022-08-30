"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TextableChannel_1 = __importDefault(require("./TextableChannel"));
/** Represents a guild news channel. */
class AnnouncementChannel extends TextableChannel_1.default {
    constructor(data, client) {
        super(data, client);
    }
    /**
     * Convert this news channel to a text channel.
     *
     * @returns {Promise<TextChannel>}
     */
    async convert() {
        return super.convert();
    }
    /**
     * Crosspost a message in this channel.
     *
     * @param {String} messageID - The id of the message to crosspost.
     * @returns {Promise<Message<AnnouncementChannel>>}
     */
    async crosspostMessage(messageID) {
        return this._client.rest.channels.crosspostMessage(this.id, messageID);
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
     * @param {String} [options.reason] - The reason to be displayed in the audit log.
     * @param {?String} [options.topic] - The topic of the channel.
     * @param {ChannelTypes.GUILD_ANNOUNCEMENT} [options.type] - Provide the opposite type to convert the channel.
     * @returns {Promise<AnnouncementChannel>}
     */
    async edit(options) {
        return this._client.rest.channels.edit(this.id, options);
    }
    toJSON() {
        return {
            ...super.toJSON(),
            rateLimitPerUser: 0,
            type: this.type
        };
    }
}
exports.default = AnnouncementChannel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQW5ub3VuY2VtZW50Q2hhbm5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9zdHJ1Y3R1cmVzL0Fubm91bmNlbWVudENoYW5uZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx3RUFBZ0Q7QUFTaEQsdUNBQXVDO0FBQ3ZDLE1BQXFCLG1CQUFvQixTQUFRLHlCQUFvQztJQUtqRixZQUFZLElBQTRCLEVBQUUsTUFBYztRQUNwRCxLQUFLLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsS0FBSyxDQUFDLE9BQU87UUFDVCxPQUFPLEtBQUssQ0FBQyxPQUFPLEVBQTRCLENBQUM7SUFDckQsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFNBQWlCO1FBQ3BDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDM0UsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7OztPQWNHO0lBQ00sS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFnQztRQUNoRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQU8sSUFBSSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBRVEsTUFBTTtRQUNYLE9BQU87WUFDSCxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDakIsZ0JBQWdCLEVBQUUsQ0FBQztZQUNuQixJQUFJLEVBQWMsSUFBSSxDQUFDLElBQUk7U0FDOUIsQ0FBQztJQUNOLENBQUM7Q0FDSjtBQXRERCxzQ0FzREMifQ==