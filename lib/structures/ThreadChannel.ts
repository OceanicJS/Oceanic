import GuildChannel from "./GuildChannel";
import Message from "./Message";
import type User from "./User";
import type { ThreadAutoArchiveDuration, ThreadChannelTypes } from "../Constants";
import { ChannelTypes } from "../Constants";
import type Client from "../Client";
import Collection from "../util/Collection";
import type {
	AnyThreadChannel,
	CreateMessageOptions,
	EditMessageOptions,
	EditThreadChannelOptions,
	GetChannelMessagesOptions,
	GetReactionsOptions,
	RawMessage,
	RawThreadChannel,
	RESTThreadMember
} from "../types/channels";
import { File } from "../types/request-handler";
import type { Uncached } from "../types/shared";

/** Represents a guild thread channel. */
export default class ThreadChannel<T extends AnyThreadChannel = AnyThreadChannel> extends GuildChannel {
	/** The [flags](https://discord.com/developers/docs/resources/channel#channel-object-channel-flags) for this thread channel. */
	flags: number;
	/** The last message sent in this channel. This can be a partial object with only an `id` property. */
	lastMessage: Message | Uncached | null;
	/** The approximate number of members in this thread. Stops counting after 50. */
	memberCount: number;
	/** The number of messages (not including the initial message or deleted messages) in the thread. Stops counting after 50. */
	messageCount: number;
	/** The cached messages in this channel. */
	messages: Collection<string, RawMessage, Message>;
	/** The creator of this thread. */
	owner: User | Uncached;
	/** The amount of seconds between non-moderators sending messages. */
	rateLimitPerUser: number;
	/** The [thread metadata](https://discord.com/developers/docs/resources/channel#thread-metadata-object-thread-metadata-structure) associated with this thread. */
	threadMetadata: ThreadMetadata | PrivateThreadmetadata;
	/** The total number of messages ever sent in the thread. Includes deleted messages. */
	totalMessageSent: number;
	declare type: ThreadChannelTypes;
	constructor(data: RawThreadChannel, client: Client) {
		super(data, client);
		this.messages = new Collection(Message, client);
		this.update(data);
	}

	protected update(data: Partial<RawThreadChannel>) {
		if (data.flags !== undefined) this.flags = data.flags;
		if (data.last_message_id !== undefined) this.lastMessage = data.last_message_id === null ? null : this.messages.get(data.last_message_id) || { id: data.last_message_id };
		if (data.member_count !== undefined) this.memberCount = data.member_count;
		if (data.message_count !== undefined) this.messageCount = data.message_count;
		if (data.owner_id !== undefined) this.owner = this._client.users.get(data.owner_id) || { id: data.owner_id };
		if (data.rate_limit_per_user !== undefined) this.rateLimitPerUser = data.rate_limit_per_user;
		if (data.thread_metadata !== undefined) {
			this.threadMetadata = {
				archiveTimestamp:    new Date(data.thread_metadata.archive_timestamp),
				archived:            !!data.thread_metadata.archived,
				autoArchiveDuration: data.thread_metadata.auto_archive_duration,
				createTimestamp:     !data.thread_metadata.create_timestamp ? null : new Date(data.thread_metadata.create_timestamp),
				locked:		            !!data.thread_metadata.locked
			};
			if (data.type === ChannelTypes.PRIVATE_THREAD && data.thread_metadata.invitable !== undefined) (this.threadMetadata as PrivateThreadmetadata).invitable = !!data.thread_metadata.invitable;

		}
		if (data.total_message_sent !== undefined) this.totalMessageSent = data.total_message_sent;
	}

	/**
	 * Add a member to this thread.
	 *
	 * @param {String} userID - The id of the user to add to the thread.
	 * @returns {Promise<void>}
	 */
	async addMember(userID: string) {
		return this._client.rest.channels.addThreadMember(this.id, userID);
	}

	/**
	 * Create a message in this thread.
	 *
	 * @param {Object} options
	 * @param {Object} [options.allowedMentions] - An object that specifies the allowed mentions in this message.
	 * @param {Boolean} [options.allowedMentions.everyone] - If `@everyone`/`@here` mentions should be allowed.
	 * @param {Boolean} [options.allowedMentions.repliedUser] - If the replied user (`messageReference`) should be mentioned.
	 * @param {(Boolean | String[])} [options.allowedMentions.roles] - An array of role ids that are allowed to be mentioned, or a boolean value to allow all or none.
	 * @param {(Boolean | String[])} [options.allowedMentions.users] - An array of user ids that are allowed to be mentioned, or a boolean value to allow all or none.
	 * @param {Object[]} [options.attachments] - An array of [attachment information](https://discord.com/developers/docs/resources/channel#attachment-object) related to the sent files.
	 * @param {Object[]} [options.components] - An array of [components](https://discord.com/developers/docs/interactions/message-components) to send.
	 * @param {String} [options.content] - The content of the message.
	 * @param {Object[]} [options.embeds] - An array of [embeds](https://discord.com/developers/docs/resources/channel#embed-object) to send.
	 * @param {File[]} [options.files] - The files to send.
	 * @param {Number} [options.flags] - The [flags](https://discord.com/developers/docs/resources/channel#message-object-message-flags) to send with the message.
	 * @param {String[]} [options.stickerIDs] - The IDs of up to 3 stickers from the current guild to send.
	 * @param {Object} [options.messageReference] - Reply to a message.
	 * @param {String} [options.messageReference.channelID] - The id of the channel the replied message is in.
	 * @param {Boolean} [options.messageReference.failIfNotExists] - If creating the message should fail if the message to reply to does not exist.
	 * @param {String} [options.messageReference.guildID] - The id of the guild the replied message is in.
	 * @param {String} [options.messageReference.messageID] - The id of the message to reply to.
	 * @param {Boolean} [options.tts] - If the message should be spoken aloud.
	 * @returns {Promise<Message>}
	 */
	async createMessage(options: CreateMessageOptions) {
		return this._client.rest.channels.createMessage<T>(this.id, options);
	}

	/**
	 * Add a reaction to a message in this thread.
	 *
	 * @param {String} messageID - The id of the message to add a reaction to.
	 * @param {String} emoji - The reaction to add to the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
	 * @returns {Promise<void>}
	 */
	async createReaction(messageID: string, emoji: string) {
		return this._client.rest.channels.createReaction(this.id, messageID, emoji);
	}

	/**
	 * Delete a message in this thread.
	 *
	 * @param {String} messageID - The id of the message to delete.
	 * @param {String} [reason] - The reason for deleting the message.
	 * @returns {Promise<void>}
	 */
	async deleteMessage(messageID: string, reason?: string) {
		return this._client.rest.channels.deleteMessage(this.id, messageID, reason);
	}

	/**
	 * Bulk delete messages in this thread.
	 *
	 * @param {String[]} messageIDs - The ids of the messages to delete. Between 2 and 100 messages, any dupliates or messages older than two weeks will cause an error.
	 * @param {String} [reason] - The reason for deleting the messages.
	 * @returns {Promise<void>}
	 */
	async deleteMessages(messageIDs: Array<string>, reason?: string) {
		return this._client.rest.channels.deleteMessages(this.id, messageIDs, reason);
	}

	/**
	 * Remove a reaction from a message in this thread.
	 *
	 * @param {String} messageID - The id of the message to remove a reaction from.
	 * @param {String} emoji - The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
	 * @param {String} [user="@me"] - The user to remove the reaction from, `@me` for the current user (default).
	 * @returns {Promise<void>}
	 */
	async deleteReaction(messageID: string, emoji: string, user = "@me") {
		return this._client.rest.channels.deleteReaction(this.id, messageID, emoji, user);
	}

	/**
	 * Remove all, or a specific emoji's reactions from a message.
	 *
	 * @param {String} messageID - The id of the message to remove reactions from.
	 * @param {String} [emoji] - The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis. Omit to remove all reactions.
	 * @returns {Promise<void>}
	 */
	async deleteReactions(messageID: string, emoji?: string) {
		return this._client.rest.channels.deleteReactions(this.id, messageID, emoji);
	}

	/**
	 * Edit this thread.
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
	 * @param {String} [options.reason] - The reason to be displayed in the audit log.
	 * @returns {Promise<AnyThreadChannel>}
	 */
	override async edit(options: EditThreadChannelOptions) {
		return this._client.rest.channels.edit<AnyThreadChannel>(this.id, options);
	}

	/**
	 * Edit a message in this thread.
	 *
	 * @param {String} messageID - The id of the message to edit.
	 * @param {Object} options
	 * @param {Object} [options.allowedMentions] - An object that specifies the allowed mentions in this message.
	 * @param {Boolean} [options.allowedMentions.everyone] - If `@everyone`/`@here` mentions should be allowed.
	 * @param {Boolean} [options.allowedMentions.repliedUser] - If the replied user (`messageReference`) should be mentioned.
	 * @param {(Boolean | String[])} [options.allowedMentions.roles] - An array of role ids that are allowed to be mentioned, or a boolean value to allow all or none.
	 * @param {(Boolean | String[])} [options.allowedMentions.users] - An array of user ids that are allowed to be mentioned, or a boolean value to allow all or none.
	 * @param {Object[]} [options.attachments] - An array of [attachment information](https://discord.com/developers/docs/resources/channel#attachment-object) related to the sent files.
	 * @param {Object[]} [options.components] - An array of [components](https://discord.com/developers/docs/interactions/message-components) to send.
	 * @param {String} [options.content] - The content of the message.
	 * @param {Object[]} [options.embeds] - An array of [embeds](https://discord.com/developers/docs/resources/channel#embed-object) to send.
	 * @param {File[]} [options.files] - The files to send.
	 * @returns {Promise<Message>}
	 */
	async editMessage(messageID: string, options: EditMessageOptions) {
		return this._client.rest.channels.editMessage(this.id, messageID, options);
	}

	/**
	 * Get a thread member in this thread.
	 *
	 * @param {String} userID - The id of the user to get the thread member of.
	 * @returns {Promise<RESTThreadMember>}
	 */
	async getMember(userID: string) {
		return this._client.rest.channels.getThreadMember(this.id, userID);
	}

	/**
	 * Get the members of this thread.
	 *
	 * @returns {Promise<RESTThreadMember[]>}
	 */
	async getMembers() {
		return this._client.rest.channels.getThreadMembers(this.id);
	}

	/**
	 * Get a message in this thread.
	 *
	 * @param {String} messageID - The id of the message to get.
	 * @returns {Promise<Message>}
	 */
	async getMessage(messageID: string) {
		return this._client.rest.channels.getMessage<T>(this.id, messageID);
	}

	/**
	 * Get messages in this thread.
	 *
	 * @param {Object} options - All options are mutually exclusive.
	 * @param {String} [options.after] - Get messages after this message id.
	 * @param {String} [options.around] - Get messages around this message id.
	 * @param {String} [options.before] - Get messages before this message id.
	 * @param {Number} [options.limit] - The maximum amount of messages to get.
	 * @returns {Promise<Message[]>}
	 */
	async getMessages(options?: GetChannelMessagesOptions) {
		return this._client.rest.channels.getMessages<T>(this.id, options);
	}

	/**
	 * Get the pinned messages in this thread.
	 *
	 * @returns {Promise<Message[]>}
	 */
	async getPinnedMessages() {
		return this._client.rest.channels.getPinnedMessages<T>(this.id);
	}

	/**
	 * Get the users who reacted with a specific emoji on a message.
	 *
	 * @param {String} messageID - The id of the message to get reactions from.
	 * @param {String} emoji - The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
	 * @param {Object} [options] - Options for the request.
	 * @param {String} [options.after] - Get users after this user id.
	 * @param {Number} [options.limit] - The maximum amount of users to get.
	 * @returns {Promise<User[]>}
	 */
	async getReactions(messageID: string, emoji: string, options?: GetReactionsOptions) {
		return this._client.rest.channels.getReactions(this.id, messageID, emoji, options);
	}

	/**
	 * Join this thread.
	 *
	 * @returns {Promise<void>}
	 */
	async join() {
		return this._client.rest.channels.joinThread(this.id);
	}

	/**
	 * Leave this thread.
	 *
	 * @returns {Promise<void>}
	 */
	async leave() {
		return this._client.rest.channels.leaveThread(this.id);
	}

	/**
	 * Pin a message in this thread.
	 *
	 * @param {String} messageID - The id of the message to pin.
	 * @param {String} [reason] - The reason for pinning the message.
	 * @returns {Promise<void>}
	 */
	async pinMessage(messageID: string, reason?: string) {
		return this._client.rest.channels.pinMessage(this.id, messageID, reason);
	}

	/**
	 * Remove a member from this thread.
	 *
	 * @param {String} userID - The id of the user to remove from the thread.
	 * @returns {Promise<void>}
	 */
	async removeMember(userID: string) {
		return this._client.rest.channels.removeThreadMember(this.id, userID);
	}

	/**
	 * Show a typing indicator in this thread.
	 *
	 * @returns {Promise<void>}
	 */
	async sendTyping() {
		return this._client.rest.channels.sendTyping(this.id);
	}

	override toJSON(props: Array<string> = []) {
		return super.toJSON([
			"flags",
			"lastMessage",
			"memberCount",
			"messageCount",
			"messages",
			"owner",
			"rateLimitPerUser",
			"threadMetadata",
			"totalMessageSent",
			...props
		]);
	}

	/**
	 * Unpin a message in this thread.
	 *
	 * @param {String} messageID - The id of the message to unpin.
	 * @param {String} [reason] - The reason for unpinning the message.
	 * @returns {Promise<void>}
	 */
	async unpinMessage(messageID: string, reason?: string) {
		return this._client.rest.channels.unpinMessage(this.id, messageID, reason);
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
