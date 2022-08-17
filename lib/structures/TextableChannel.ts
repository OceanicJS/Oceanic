import GuildChannel from "./GuildChannel";
import type NewsChannel from "./NewsChannel";
import type TextChannel from "./TextChannel";
import type PermissionOverwrite from "./PermissionOverwrite";
import Message from "./Message";
import ThreadChannel from "./ThreadChannel";
import type { TextChannelTypes, ThreadAutoArchiveDuration } from "../Constants";
import { ChannelTypes } from "../Constants";
import type Client from "../Client";
import Collection from "../util/Collection";
import type {
	AnyThreadChannel,
	EditGuildChannelOptions,
	RawMessage,
	RawNewsChannel,
	RawOverwrite,
	RawTextChannel,
	RawThreadChannel
} from "../types/channels";

/** Represents a guild text channel. */
export default class RESTTextableChannel extends GuildChannel {
	/** The default auto archive duration for threads created in this channel. */
	defaultAutoArchiveDuration: ThreadAutoArchiveDuration;
	/** The id of the last message sent in this channel. */
	lastMessageID: string | null;
	/** The cached messages in this channel. */
	messages: Collection<string, RawMessage, Message>;
	/** If this channel is age gated. */
	nsfw: boolean;
	/** The permission overwrites of this channel. */
	permissionOverwrites: Collection<string, RawOverwrite, PermissionOverwrite>;
	/** The position of this channel on the sidebar. */
	position: number;
	/** The amount of seconds between non-moderators sending messages. */
	rateLimitPerUser: number;
	threads: Collection<string, RawThreadChannel, AnyThreadChannel>;
	/** The topic of the channel. */
	topic: string | null;
	declare type: TextChannelTypes;
	constructor(data: RawTextChannel | RawNewsChannel, client: Client) {
		super(data, client);
		this.messages = new Collection(Message, client);
		this.threads = new Collection(ThreadChannel, client) as Collection<string, RawThreadChannel, AnyThreadChannel>;
		this.update(data);
	}

	protected update(data: RawTextChannel | RawNewsChannel) {
		super.update(data);
		this.defaultAutoArchiveDuration = data.default_auto_archive_duration;
		this.lastMessageID              = data.last_message_id;
		this.nsfw                       = data.nsfw;
		this.position                   = data.position;
		this.rateLimitPerUser           = data.rate_limit_per_user;
		this.topic                      = data.topic;
		data.permission_overwrites.map(overwrite => this.permissionOverwrites.update(overwrite));
	}

	/**
	 * [Text] Convert this text channel to a news channel.
	 *
	 * [News] Convert this news channel to a text channel.
	 *
	 * @returns {Promise<TextChannel | NewsChannel>}
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
	 * @returns {Promise<GuildChannel>}
	 */
	async edit(options: EditGuildChannelOptions, reason?: string) {
		return this._client.rest.channels.edit<TextChannel | NewsChannel>(this.id, options, reason);
	}
}
