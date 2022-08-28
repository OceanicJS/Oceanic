import Channel from "./Channel";
import type Guild from "./Guild";
import type CategoryChannel from "./CategoryChannel";
import type { GuildChannelTypes } from "../Constants";
import type Client from "../Client";
import type { AnyGuildChannel, EditGuildChannelOptions, RawGuildChannel } from "../types/channels";
import type { JSONGuildChannel } from "../types/json";
/** Represents a guild channel. */
export default class GuildChannel extends Channel {
    /** The guild associated with this channel. This can be a partial object with only an `id` property. */
    guild: Guild;
    /** The name of this channel. */
    name: string;
    /** The parent category of this channel. This can be a partial object with only an `id` property. */
    parent: CategoryChannel | null;
    type: GuildChannelTypes;
    constructor(data: RawGuildChannel, client: Client);
    protected update(data: Partial<RawGuildChannel>): void;
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
    edit(options: EditGuildChannelOptions): Promise<AnyGuildChannel>;
    toJSON(): JSONGuildChannel;
}
