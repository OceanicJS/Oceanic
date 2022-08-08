import GuildChannel from "./GuildChannel";
import type { EditThreadChannelOptions, RawThreadChannel } from "../routes/Channels";
import type { ThreadAutoArchiveDuration, ThreadChannelTypes } from "../Constants";
import { ChannelTypes } from "../Constants";
import type Client from "../Client";

/** Represents a guild thread channel. */
export default class ThreadChannel extends GuildChannel {
	/** The [flags](https://discord.com/developers/docs/resources/channel#channel-object-channel-flags) for this thread channel. */
	flags: number;
	/** The id of the last message sent in this channel. */
	lastMessageID: string | null;
	/** The approximate number of members in this thread. Stops counting after 50. */
	memberCount: number;
	/** The number of messages (not including the initial message or deleted messages) in the thread. Stops counting after 50. */
	messageCount: number;
	/** The creator of this thread. */
	ownerID: string;
	/** The amount of seconds between non-moderators sending messages. */
	rateLimitPerUser: number;
	/** The [thread metadata](https://discord.com/developers/docs/resources/channel#thread-metadata-object-thread-metadata-structure) associated with this thread. */
	threadMetadata: ThreadMetadata | PrivateThreadmetadata;
	/** The total number of messages ever sent in the thread. Includes deleted messages. */
	totalMessageSent: number;
	declare type: ThreadChannelTypes;
	constructor(data: RawThreadChannel, client: Client) {
		super(data, client);
		this.update(data);
	}

	protected update(data: RawThreadChannel) {
		this.flags            = data.flags;
		this.lastMessageID    = data.last_message_id;
		this.memberCount      = data.member_count;
		this.messageCount     = data.message_count;
		this.ownerID          = data.owner_id;
		this.rateLimitPerUser = data.rate_limit_per_user;
		this.threadMetadata   = {
			archiveTimestamp:    new Date(data.thread_metadata.archive_timestamp),
			archived:            !!data.thread_metadata.archived,
			autoArchiveDuration: data.thread_metadata.auto_archive_duration,
			createTimestamp:     !data.thread_metadata.create_timestamp ? null : new Date(data.thread_metadata.create_timestamp),
			locked:		            !!data.thread_metadata.locked
		};
		if (data.type === ChannelTypes.GUILD_PRIVATE_THREAD && data.thread_metadata.invitable !== undefined) (this.threadMetadata as PrivateThreadmetadata).invitable = !!data.thread_metadata.invitable;
		this.totalMessageSent  = data.total_message_sent;
	}

	/**
	 * Edit a channel.
	 *
	 * @param {String} id - The id of the channel to edit.
	 * @param {Object} options
	 * @param {Boolean} [options.archived] - If the thread is archived.
	 * @param {ThreadAutoArchiveDuration} [options.autoArchiveDuration] - The duration after which the thread will be archived.
	 * @param {Number} [options.flags] - The [channel flags](https://discord.com/developers/docs/resources/channel#channel-object-channel-flags) to set on the channel.
	 * @param {Boolean} [options.invitable] - [Private] If non-moderators can add other non-moderators to the thread.
	 * @param {Boolean} [options.locked] - If the thread should be locked.
	 * @param {String} [options.name] - The name of the channel.
	 * @param {?Number} [options.rateLimitPerUser] - The seconds between sending messages for users. Between 0 and 21600.
	 * @param {String} [reason] - The reason to be displayed in the audit log.
	 * @returns {Promise<ThreadChannel>}
	 */
	override async edit(options: EditThreadChannelOptions, reason?: string) {
		return this._client.rest.channels.edit<ThreadChannel>(this.id, options, reason);
	}
}

export interface ThreadMetadata {
	archiveTimestamp: Date;
	archived: boolean;
	autoArchiveDuration: ThreadAutoArchiveDuration;
	createTimestamp: Date | null;
	locked: boolean;
}

export interface PrivateThreadmetadata extends ThreadMetadata {
	invitable: boolean;
}
