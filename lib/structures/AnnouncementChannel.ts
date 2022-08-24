import TextableChannel from "./TextableChannel";
import type TextChannel from "./TextChannel";
import Message from "./Message";
import type { ThreadAutoArchiveDuration, ChannelTypes } from "../Constants";
import type Client from "../Client";
import type { EditGuildChannelOptions, RawAnnouncementChannel, RawOverwrite } from "../types/channels";

/** Represents a guild news channel. */
export default class NewsChannel extends TextableChannel<NewsChannel> {
	/** The amount of seconds between non-moderators sending messages. Always zero in news channels. */
	declare rateLimitPerUser: 0;
	declare type: ChannelTypes.GUILD_ANNOUNCEMENT;
	constructor(data: RawAnnouncementChannel, client: Client) {
		super(data, client);
	}

	/**
	 * Convert this news channel to a text channel.
	 *
	 * @returns {Promise<TextChannel>}
	 */
	async convert() {
		return super.convert() as unknown as TextChannel;
	}

	/**
	 * Crosspost a message in this channel.
	 *
	 * @param {String} messageID - The id of the message to crosspost.
	 * @returns {Promise<Message<NewsChannel>>}
	 */
	async crosspostMessage(messageID: string) {
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
	 * @returns {Promise<NewsChannel>}
	 */
	override async edit(options: EditGuildChannelOptions) {
		return this._client.rest.channels.edit<this>(this.id, options);
	}

	override toJSON(props: Array<string> = []) {
		return super.toJSON([
			"rateLimitPerUser",
			...props
		]);
	}
}
