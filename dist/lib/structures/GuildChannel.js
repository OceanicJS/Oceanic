"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Channel_1 = __importDefault(require("./Channel"));
/** Represents a guild channel. */
class GuildChannel extends Channel_1.default {
    /** The guild associated with this channel. This can be a partial object with only an `id` property. */
    guild;
    /** The name of this channel. */
    name;
    /** The parent category of this channel. This can be a partial object with only an `id` property. */
    parent;
    constructor(data, client) {
        super(data, client);
        this.parent = null;
    }
    update(data) {
        super.update(data);
        if (data.guild_id !== undefined)
            this.guild = this._client.guilds.get(data.guild_id);
        if (data.name !== undefined)
            this.name = data.name;
        if (data.parent_id !== undefined)
            this.parent = data.parent_id === null ? null : this._client.getChannel(data.parent_id);
    }
    /**
     * Edit this channel.
     *
     * @param {Object} options
     * @param {Boolean} [options.archived] - [Thread] If the thread is archived.
     * @param {ThreadAutoArchiveDuration} [options.autoArchiveDuration] - [Thread] The duration after which the thread will be archived.
     * @param {?Number} [options.bitrate] - [Voice, Stage] The bitrate of the channel. Minimum 8000.
     * @param {?ThreadAutoArchiveDuration} [options.defaultAutoArchiveDuration] - [Text, Announcement] The default auto archive duration for threads made in this channel.
     * @param {Number} [options.flags] - [Thread] The [channel flags](https://discord.com/developers/docs/resources/channel#channel-object-channel-flags) to set on the channel.
     * @param {Boolean} [options.invitable] - [Private Thread] If non-moderators can add other non-moderators to the thread. Private threads only.
     * @param {Boolean} [options.locked] - [Thread] If the thread should be locked.
     * @param {String} [options.name] - [All] The name of the channel.
     * @param {?Boolean} [options.nsfw] - [Text, Voice, Announcement] If the channel is age gated.
     * @param {?String} [options.parentID] - [Text, Voice, Announcement] The id of the parent category channel.
     * @param {?RawOverwrite[]} [options.permissionOverwrites] - [All Guild] Channel or category specific permissions
     * @param {?Number} [options.position] - [All] The position of the channel in the channel list.
     * @param {?Number} [options.rateLimitPerUser] - [Thread, Text] The seconds between sending messages for users. Between 0 and 21600.
     * @param {String} [options.reason] - The reason to be displayed in the audit log.
     * @param {?String} [options.rtcRegion] - [Voice, Stage] The voice region id of the channel, null for automatic.
     * @param {?String} [options.topic] - [Text, Announcement] The topic of the channel.
     * @param {ChannelTypes.GUILD_TEXT | ChannelTypes.GUILD_ANNOUNCEMENT} [options.type] - [Text, Announcement] Provide the opposite type to convert the channel.
     * @param {?Number} [options.userLimit] - [Voice] The maximum amount of users in the channel. `0` is unlimited, values range 1-99.
     * @param {?VideoQualityModes} [options.videoQualityMode] - [Voice] The [video quality mode](https://discord.com/developers/docs/resources/channel#channel-object-video-quality-modes) of the channel.
     * @returns {Promise<GuildChannel>}
     */
    async edit(options) {
        return this._client.rest.channels.edit(this.id, options);
    }
    toJSON() {
        return {
            ...super.toJSON(),
            guild: this.guild.id,
            name: this.name,
            parent: this.parent ? this.parent.id : null,
            type: this.type
        };
    }
}
exports.default = GuildChannel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3VpbGRDaGFubmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3N0cnVjdHVyZXMvR3VpbGRDaGFubmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsd0RBQWdDO0FBU2hDLGtDQUFrQztBQUNsQyxNQUFxQixZQUFhLFNBQVEsaUJBQU87SUFDaEQsdUdBQXVHO0lBQ3ZHLEtBQUssQ0FBUTtJQUNiLGdDQUFnQztJQUNoQyxJQUFJLENBQVM7SUFDYixvR0FBb0c7SUFDcEcsTUFBTSxDQUF5QjtJQUUvQixZQUFZLElBQXFCLEVBQUUsTUFBYztRQUNoRCxLQUFLLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0lBQ3BCLENBQUM7SUFFUyxNQUFNLENBQUMsSUFBOEI7UUFDOUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNuQixJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssU0FBUztZQUFFLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUUsQ0FBQztRQUN0RixJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUztZQUFFLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUNuRCxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssU0FBUztZQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQWtCLElBQUksQ0FBQyxTQUFTLENBQUUsQ0FBQztJQUM1SSxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQXdCRztJQUNILEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBZ0M7UUFDMUMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFrQixJQUFJLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzNFLENBQUM7SUFFUSxNQUFNO1FBQ2QsT0FBTztZQUNOLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUNqQixLQUFLLEVBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3JCLElBQUksRUFBSSxJQUFJLENBQUMsSUFBSTtZQUNqQixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUk7WUFDM0MsSUFBSSxFQUFJLElBQUksQ0FBQyxJQUFJO1NBQ2pCLENBQUM7SUFDSCxDQUFDO0NBQ0Q7QUExREQsK0JBMERDIn0=