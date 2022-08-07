import RESTGuildChannel from "./RESTGuildChannel";
import RESTTextableChannel from "./RESTTextableChannel";
import type RESTTextChannel from "./RESTTextChannel";
import type { EditGuildChannelOptions, RawOverwrite, RawRESTNewsChannel } from "../../routes/Channels";
import type RESTClient from "../../RESTClient";
import type { ThreadAutoArchiveDuration, ChannelTypes } from "../../Constants";

/** Represents a guild news channel. */
export default class RESTNewsChannel extends RESTTextableChannel {
	/** The amount of seconds between non-moderators sending messages. Always zero in news channels. */
	declare rateLimitPerUser: 0;
	declare type: ChannelTypes.GUILD_NEWS;
	constructor(data: RawRESTNewsChannel, client: RESTClient) {
		super(data, client);
	}

	/**
	 * Convert this news channel to a text channel.
	 *
	 * @returns {Promise<RESTTextChannel>}
	 */
	async convert() {
		return super.convert() as unknown as RESTTextChannel;
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
	 * @param {?String} [options.topic] - The topic of the channel.
	 * @param {ChannelTypes.GUILD_NEWS} [options.type] - Provide the opposite type to convert the channel.
	 * @param {String} [reason] - The reason to be displayed in the audit log.
	 * @returns {Promise<RESTGuildChannel>}
	 */
	override async edit(options: EditGuildChannelOptions, reason?: string) {
		return this._client.channels.edit<RESTNewsChannel>(this.id, options, reason);
	}
}
