import RESTGuildChannel from "./RESTGuildChannel";
import type RESTNewsChannel from "./RESTNewsChannel";
import type RESTTextChannel from "./RESTTextChannel";
import type { EditGuildChannelOptions, RawOverwrite, RawRESTNewsChannel, RawRESTTextChannel } from "../../routes/Channels";
import type RESTClient from "../../RESTClient";
import type { TextChannelTypes, ThreadAutoArchiveDuration } from "../../Constants";
import { ChannelTypes } from "../../Constants";
import PermissionOverwrite from "../PermissionOverwrite";

/** Represents a guild text channel. */
export default class RESTTextableChannel extends RESTGuildChannel {
	/** The default auto archive duration for threads created in this channel. */
	defaultAutoArchiveDuration: ThreadAutoArchiveDuration;
	/** The id of the last message sent in this channel. */
	lastMessageID: string | null;
	/** If this channel is age gated. */
	nsfw: boolean;
	/** The permission overwrites of this channel. */
	permissionOverwrites: Array<PermissionOverwrite>;
	/** The position of this channel on the sidebar. */
	position: number;
	/** The amount of seconds between non-moderators sending messages. */
	rateLimitPerUser: number;
	/** The topic of the channel. */
	topic: string | null;
	declare type: TextChannelTypes;
	constructor(data: RawRESTTextChannel | RawRESTNewsChannel, client: RESTClient) {
		super(data, client);
		this.defaultAutoArchiveDuration = data.default_auto_archive_duration;
		this.lastMessageID              = data.last_message_id;
		this.nsfw                       = data.nsfw;
		this.permissionOverwrites       = data.permission_overwrites.map(overwrite => new PermissionOverwrite(overwrite));
		this.position                   = data.position;
		this.rateLimitPerUser           = data.rate_limit_per_user;
		this.topic                      = data.topic;
	}

	/**
	 * [Text] Convert this text channel to a news channel.
	 *
	 * [News] Convert this news channel to a text channel.
	 *
	 * @returns {Promise<RESTTextChannel | RESTNewsChannel>}
	 */
	async convert() {
		return this.edit({ type: this.type === ChannelTypes.GUILD_TEXT ? ChannelTypes.GUILD_NEWS : ChannelTypes.GUILD_TEXT });
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
	 * @param {?String} [options.topic] - The topic of the channel.
	 * @param {ChannelTypes.GUILD_NEWS} [options.type] - Provide the opposite type to convert the channel.
	 * @param {String} [reason] - The reason to be displayed in the audit log.
	 * @returns {Promise<RESTGuildChannel>}
	 */
	async edit(options: EditGuildChannelOptions, reason?: string) {
		return this._client.channels.edit<RESTTextChannel | RESTNewsChannel>(this.id, options, reason);
	}
}
