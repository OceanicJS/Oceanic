import RESTChannel from "./RESTChannel";
import type { EditGuildChannelOptions, RawOverwrite, RawRESTGuildChannel } from "../../routes/Channels";
import type RESTClient from "../../RESTClient";
import { ChannelTypes, ThreadAutoArchiveDuration, VideoQualityModes } from "../../Constants";

/** Represents a guild channel. */
export default class RESTGuildChannel extends RESTChannel {
	guildID: string;
	name: string;
	parentID: string | null;
	constructor(data: RawRESTGuildChannel, client: RESTClient) {
		super(data, client);
		this.guildID  = data.guild_id;
		this.name     = data.name;
		this.parentID = data.parent_id;
	}

	/**
	 * Edit this channel.
	 *
	 * @param {Object} options
	 * @param {Boolean} [options.archived] - [Thread] If the thread is archived.
	 * @param {ThreadAutoArchiveDuration} [options.autoArchiveDuration] - [Thread] The duration after which the thread will be archived.
	 * @param {?Number} [options.bitrate] - [Voice, Stage] The bitrate of the channel. Minimum 8000.
	 * @param {?ThreadAutoArchiveDuration} [options.defaultAutoArchiveDuration] - [Text, News] The default auto archive duration for threads made in this channel.
	 * @param {Number} [options.flags] - [Thread] The [channel flags](https://discord.com/developers/docs/resources/channel#channel-object-channel-flags) to set on the channel.
	 * @param {Boolean} [options.invitable] - [Private Thread] If non-moderators can add other non-moderators to the thread. Private threads only.
	 * @param {Boolean} [options.locked] - [Thread] If the thread should be locked.
	 * @param {String} [options.name] - [All] The name of the channel.
	 * @param {?Boolean} [options.nsfw] - [Text, Voice, News] If the channel is age gated.
	 * @param {?String} [options.parentID] - [Text, Voice, News] The id of the parent category channel.
	 * @param {?RawOverwrite[]} [options.permissionOverwrites] - [All Guild] Channel or category specific permissions
	 * @param {?Number} [options.position] - [All] The position of the channel in the channel list.
	 * @param {?Number} [options.rateLimitPerUser] - [Thread, Text, News] The seconds between sending messages for users. Between 0 and 21600.
	 * @param {?String} [options.rtcRegion] - [Voice, Stage] The voice region id of the channel, null for automatic.
	 * @param {?String} [options.topic] - [Text, News] The topic of the channel.
	 * @param {ChannelTypes.GUILD_TEXT | ChannelTypes.GUILD_NEWS} [options.type] - [Text, News] Provide the opposite type to convert the channel.
	 * @param {?Number} [options.userLimit] - [Voice] The maximum amount of users in the channel. `0` is unlimited, values range 1-99.
	 * @param {?VideoQualityModes} [options.videoQualityMode] - [Voice] The [video quality mode](https://discord.com/developers/docs/resources/channel#channel-object-video-quality-modes) of the channel.
	 * @param {String} [reason] - The reason to be displayed in the audit log.
	 * @returns {Promise<RESTGuildChannel>}
	 */
	async edit(options: EditGuildChannelOptions, reason?: string) {
		return this._client.channels.edit<RESTGuildChannel>(this.id, options, reason);
	}
}
