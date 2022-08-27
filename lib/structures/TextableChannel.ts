import GuildChannel from "./GuildChannel";
import type AnnouncementChannel from "./AnnouncementChannel";
import type TextChannel from "./TextChannel";
import PermissionOverwrite from "./PermissionOverwrite";
import Message from "./Message";
import ThreadChannel from "./ThreadChannel";
import type Invite from "./Invite";
import type PrivateThreadChannel from "./PrivateThreadChannel";
import type PublicThreadChannel from "./PublicThreadChannel";
import type AnnouncementThreadChannel from "./AnnouncementThreadChannel";
import User from "./User";
import type {
	InviteTargetTypes,
	OverwriteTypes,
	PrivateChannelTypes,
	TextChannelTypes,
	ThreadAutoArchiveDuration,
	ThreadChannelTypes
} from "../Constants";
import { ChannelTypes } from "../Constants";
import type Client from "../Client";
import Collection from "../util/Collection";
import type {
	AnyThreadChannel,
	ArchivedThreads,
	CreateInviteOptions,
	CreateMessageOptions,
	EditGuildChannelOptions,
	EditMessageOptions,
	EditPermissionOptions,
	GetArchivedThreadsOptions,
	GetChannelMessagesOptions,
	GetReactionsOptions,
	RawMessage,
	RawAnnouncementChannel,
	RawOverwrite,
	RawTextChannel,
	RawThreadChannel,
	StartThreadFromMessageOptions,
	StartThreadWithoutMessageOptions
} from "../types/channels";
import { File } from "../types/request-handler";
import type { Uncached } from "../types/shared";
import type { JSONTextableChannel } from "../types/json";

/** Represents a guild text channel. */
export default class TextableChannel<T extends TextChannel | AnnouncementChannel = TextChannel | AnnouncementChannel> extends GuildChannel {
	/** The default auto archive duration for threads created in this channel. */
	defaultAutoArchiveDuration: ThreadAutoArchiveDuration;
	/** The last message sent in this channel. This can be a partial object with only an `id` property. */
	lastMessage: Message | Uncached | null;
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
	/** The threads in this channel. */
	threads: Collection<string, RawThreadChannel, AnyThreadChannel>;
	/** The topic of the channel. */
	topic: string | null;
	declare type: Exclude<TextChannelTypes, PrivateChannelTypes>;
	constructor(data: RawTextChannel | RawAnnouncementChannel, client: Client) {
		super(data, client);
		this.messages = new Collection(Message, client);
		this.threads = new Collection(ThreadChannel, client) as Collection<string, RawThreadChannel, AnyThreadChannel>;
		this.permissionOverwrites = new Collection(PermissionOverwrite, client);
		this.update(data);
	}

	protected update(data: Partial<RawTextChannel> | Partial<RawAnnouncementChannel>) {
		super.update(data);
		if (data.default_auto_archive_duration !== undefined) this.defaultAutoArchiveDuration = data.default_auto_archive_duration;
		if (data.last_message_id !== undefined) this.lastMessage = data.last_message_id === null ? null : this.messages.get(data.last_message_id) || { id: data.last_message_id };
		if (data.nsfw !== undefined) this.nsfw = data.nsfw;
		if (data.position !== undefined) this.position = data.position;
		if (data.rate_limit_per_user !== undefined) this.rateLimitPerUser = data.rate_limit_per_user;
		if (data.topic !== undefined) this.topic = data.topic;
		if (data.permission_overwrites !== undefined) data.permission_overwrites.map(overwrite => this.permissionOverwrites.update(overwrite));
	}

	/**
	 * [Text] Convert this text channel to a announcement channel.
	 *
	 * [Announcement] Convert this announcement channel to a text channel.
	 *
	 * @returns {Promise<TextChannel | AnnouncementChannel>}
	 */
	async convert() {
		return this.edit({ type: this.type === ChannelTypes.GUILD_TEXT ? ChannelTypes.GUILD_ANNOUNCEMENT : ChannelTypes.GUILD_TEXT });
	}

	/**
	 * Create an invite for this channel.
	 *
	 * @param {Object} options
	 * @param {Number} [options.maxAge] - How long the invite should last.
	 * @param {Number} [options.maxUses] - How many times the invite can be used.
	 * @param {String} [options.reason] - The reason for creating the invite.
	 * @param {String} [options.targetApplicationID] - The id of the embedded application to open for this invite.
	 * @param {InviteTargetTypes} [options.targetType] - The [type of target](https://discord.com/developers/docs/resources/channel#invite-target-types) for the invite.
	 * @param {String} [options.targetUserID] - The id of the user whose stream to display for this invite.
	 * @param {Boolean} [options.temporary] - If the invite should be temporary.
	 * @param {Boolean} [options.unique] - If the invite should be unique.
	 * @returns {Promise<Invite>}
	 */
	async createInvite(options: CreateInviteOptions): Promise<Invite<"withMetadata", T>> {
		return this._client.rest.channels.createInvite<"withMetadata", T>(this.id, options);
	}

	/**
	 * Create a message in this channel.
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
	async createMessage(options: CreateMessageOptions): Promise<Message<T>> {
		return this._client.rest.channels.createMessage<T>(this.id, options);
	}

	/**
	 * Add a reaction to a message in this channel.
	 *
	 * @param {String} messageID - The id of the message to add a reaction to.
	 * @param {String} emoji - The reaction to add to the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
	 * @returns {Promise<void>}
	 */
	async createReaction(messageID: string, emoji: string) {
		return this._client.rest.channels.createReaction(this.id, messageID, emoji);
	}

	/**
	 * Delete a message in this channel.
	 *
	 * @param {String} messageID - The id of the message to delete.
	 * @param {String} [reason] - The reason for deleting the message.
	 * @returns {Promise<void>}
	 */
	async deleteMessage(idmessageID: string, reason?: string) {
		return this._client.rest.channels.deleteMessage(this.id, idmessageID, reason);
	}

	/**
	 * Delete a permission overwrite on this channel.
	 *
	 * @param {String} overwriteID - The id of the permission overwrite to delete.
	 * @param {String} reason - The reason for deleting the permission overwrite.
	 * @returns {Promise<void>}
	 */
	async deletePermission(overwriteID: string, reason?: string) {
		return this._client.rest.channels.deletePermission(this.id, overwriteID, reason);
	}

	/**
	 * Remove a reaction from a message in this channel.
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
	 * Remove all, or a specific emoji's reactions from a message in this channel.
	 *
	 * @param {String} messageID - The id of the message to remove reactions from.
	 * @param {String} [emoji] - The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis. Omit to remove all reactions.
	 * @returns {Promise<void>}
	 */
	async deleteReactions(messageID: string, emoji?: string) {
		return this._client.rest.channels.deleteReactions(this.id, messageID, emoji);
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
	 * @param {String} [options.reason] - The reason to be displayed in the audit log.
	 * @param {?String} [options.topic] - The topic of the channel.
	 * @param {ChannelTypes.GUILD_ANNOUNCEMENT} [options.type] - Provide the opposite type to convert the channel.
	 * @returns {Promise<GuildChannel>}
	 */
	async edit(options: EditGuildChannelOptions) {
		return this._client.rest.channels.edit<TextChannel | AnnouncementChannel>(this.id, options);
	}

	/**
	 * Edit a message in this channel.
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
	 * Edit a permission overwrite on this channel.
	 *
	 * @param {String} overwriteID - The id of the permission overwrite to edit.
	 * @param {Object} options
	 * @param {(BigInt | String)} [options.allow] - The permissions to allow.
	 * @param {(BigInt | String)} [options.deny] - The permissions to deny.
	 * @param {String} [options.reason] - The reason for editing the permission.
	 * @param {OverwriteTypes} [options.type] - The type of the permission overwrite.
	 * @returns {Promise<void>}
	 */
	async editPermission(overwriteID: string, options: EditPermissionOptions) {
		return this._client.rest.channels.editPermission(this.id, overwriteID, options);
	}

	/**
	 * Get the invites of this channel.
	 *
	 * @returns {Promise<Invite[]>} - An array of invites with metadata.
	 */
	async getInvites(): Promise<Array<Invite<"withMetadata", T>>> {
		return this._client.rest.channels.getInvites<T>(this.id);
	}

	/**
	 * Get the private archived threads the current user has joined in this channel.
	 *
	 * @param {Object} [options]
	 * @param {String} [options.before] - A **timestamp** to get threads before.
	 * @param {Number} [options.limit] - The maximum amount of threads to get.
	 * @returns {Promise<ArchivedThreads<PrivateThreadChannel>>}
	 */
	async getJoinedPrivateArchivedThreads(options?: GetArchivedThreadsOptions) {
		return this._client.rest.channels.getJoinedPrivateArchivedThreads(this.id, options);
	}

	/**
	 * Get a message in this channel.
	 *
	 * @param {String} messageID - The id of the message to get.
	 * @returns {Promise<Message>}
	 */
	async getMessage(messageID: string): Promise<Message<T>> {
		return this._client.rest.channels.getMessage<T>(this.id, messageID);
	}

	/**
	 * Get messages in this channel.
	 *
	 * @param {Object} options - All options are mutually exclusive.
	 * @param {String} [options.after] - Get messages after this message id.
	 * @param {String} [options.around] - Get messages around this message id.
	 * @param {String} [options.before] - Get messages before this message id.
	 * @param {Number} [options.limit] - The maximum amount of messages to get.
	 * @returns {Promise<Message[]>}
	 */
	async getMessages(options?: GetChannelMessagesOptions): Promise<Array<Message<T>>> {
		return this._client.rest.channels.getMessages<T>(this.id, options);
	}

	/**
	 * Get the pinned messages in this channel.
	 *
	 * @returns {Promise<Message[]>}
	 */
	async getPinnedMessages(): Promise<Array<Message<T>>> {
		return this._client.rest.channels.getPinnedMessages<T>(this.id);
	}

	/**
	 * Get the private archived threads in this channel.
	 *
	 * @param {Object} [options]
	 * @param {String} [options.before] - A **timestamp** to get threads before.
	 * @param {Number} [options.limit] - The maximum amount of threads to get.
	 * @returns {Promise<ArchivedThreads<PrivateThreadChannel>>}
	 */
	async getPrivateArchivedThreads(options?: GetArchivedThreadsOptions) {
		return this._client.rest.channels.getPrivateArchivedThreads(this.id, options);
	}

	/**
	 * Get the public archived threads in this channel.
	 *
	 * @param {Object} [options]
	 * @param {String} [options.before] - A **timestamp** to get threads before.
	 * @param {Number} [options.limit] - The maximum amount of threads to get.
	 * @returns {Promise<ArchivedThreads>}
	 */
	async getPublicArchivedThreads(options?: GetArchivedThreadsOptions) {
		return this._client.rest.channels.getPublicArchivedThreads<T extends TextChannel ? PublicThreadChannel : AnnouncementThreadChannel>(this.id, options);
	}

	/**
	 * Get the users who reacted with a specific emoji on a message in this channel.
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
	 * Pin a message in this channel.
	 *
	 * @param {String} messageID - The id of the message to pin.
	 * @param {String} [reason] - The reason for pinning the message.
	 * @returns {Promise<void>}
	 */
	async pinMessage(messageID: string, reason?: string) {
		return this._client.rest.channels.pinMessage(this.id, messageID, reason);
	}

	/**
	 * Show a typing indicator in this channel. How long users see this varies from client to client.
	 *
	 * @returns {Promise<void>}
	 */
	async sendTyping() {
		return this._client.rest.channels.sendTyping(this.id);
	}

	/**
	 * Create a thread from an existing message in this channel.
	 *
	 * @template {(AnnouncementThreadChannel | PublicThreadChannel)} T
	 * @param {String} messageID
	 * @param {Object} options
	 * @param {ThreadAutoArchiveDuration} [options.autoArchiveDuration] - The duration of no activity after which this thread will be automatically archived.
	 * @param {String} options.name - The name of the thread.
	 * @param {Number?} [options.rateLimitPerUser] - The amount of seconds a user has to wait before sending another message.
	 * @param {String} [options.reason] - The reason for creating the thread.
	 * @returns {Promise<T>}
	 */
	async startThreadFromMessage(messageID: string, options: StartThreadFromMessageOptions) {
		return this._client.rest.channels.startThreadFromMessage<T extends TextChannel ? AnnouncementThreadChannel : PublicThreadChannel>(this.id, messageID, options);
	}

	/**
	 * Create a thread without an existing message in this channel.
	 *
	 * @template {(AnnouncementThreadChannel | PublicThreadChannel)} T
	 * @param {Object} options
	 * @param {ThreadAutoArchiveDuration} [options.autoArchiveDuration] - The duration of no activity after which this thread will be automatically archived.
	 * @param {Boolean} [options.invitable] - [Private] If non-moderators can add other non-moderators to the thread.
	 * @param {String} options.name - The name of the thread.
	 * @param {Number?} [options.rateLimitPerUser] - The amount of seconds a user has to wait before sending another message.
	 * @param {String} [options.reason] - The reason for creating the thread.
	 * @param {ThreadChannelTypes} [options.type] - The type of thread to create.
	 * @returns {Promise<T>}
	 */
	async startThreadWithoutMessage(options: StartThreadWithoutMessageOptions) {
		return this._client.rest.channels.startThreadWithoutMessage<T extends TextChannel ? AnnouncementThreadChannel : PublicThreadChannel>(this.id, options);
	}

	override toJSON(): JSONTextableChannel {
		return {
			...super.toJSON(),
			defaultAutoArchiveDuration: this.defaultAutoArchiveDuration,
			lastMessage:                this.lastMessage?.id || null,
			messages:                   this.messages.map(message => message.id),
			nsfw:                       this.nsfw,
			permissionOverwrites:       this.permissionOverwrites.map(overwrite => overwrite.toJSON()),
			position:                   this.position,
			rateLimitPerUser:           this.rateLimitPerUser,
			threads:                    this.threads.map(thread => thread.id),
			topic:                      this.topic,
			type: 					                 this.type
		};
	}

	/**
	 * Unpin a message in this channel.
	 *
	 * @param {String} messageID - The id of the message to unpin.
	 * @param {String} [reason] - The reason for unpinning the message.
	 * @returns {Promise<void>}
	 */
	async unpinMessage(messageID: string, reason?: string) {
		return this._client.rest.channels.unpinMessage(this.id, messageID, reason);
	}
}
