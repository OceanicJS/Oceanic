import Channel from "./Channel";
import User from "./User";
import Invite from "./Invite";
import Message from "./Message";
import type { ChannelTypes, ImageFormat, InviteTargetTypes } from "../Constants";
import type Client from "../Client";
import * as Routes from "../util/Routes";
import type {
	AddGroupRecipientOptions,
	CreateInviteOptions,
	CreateMessageOptions,
	EditGroupDMOptions,
	EditMessageOptions,
	GetChannelMessagesOptions,
	GetReactionsOptions,
	RawGroupChannel
} from "../types/channels";
import type { RawUser } from "../types/users";
import Collection from "../util/Collection";
import type { Uncached } from "../types/shared";
import { File } from "undici";

/** Represents a group direct message. */
export default class GroupChannel extends Channel {
	/** The application that made this group channel. This will only have an `id` property. */
	application: Uncached;
	/** The icon hash of this group, if any. */
	icon: string | null;
	/** If this group channel is managed by an application. */
	managed: boolean;
	/** The name of this group channel. */
	name: string | null;
	/** The nicknames used when creating this group channel. */
	nicks?: Record<"id" | "nick", string>;
	/** The id of the owner of this group channel. */
	ownerID: string;
	/** The other recipients in this group channel. */
	recipients: Collection<string, RawUser, User>;
	declare type: ChannelTypes.GROUP_DM;
	/** @hideconstructor */
	constructor(data: RawGroupChannel, client: Client) {
		super(data, client);
		this.recipients = new Collection(User, client);
		data.recipients.forEach(r => this.recipients.add(this._client.users.update(r)));
		this.update(data);
	}

	protected update(data: Partial<RawGroupChannel>) {
		super.update(data);
		if (data.application_id !== undefined) this.application = { id: data.application_id } ;
		if (data.icon !== undefined) this.icon = data.icon;
		if (data.managed !== undefined) this.managed = data.managed;
		if (data.name !== undefined) this.name = data.name;
		if (data.nicks !== undefined) this.nicks = data.nicks;
		if (data.owner_id !== undefined) this.ownerID = data.owner_id;
		if (data.type !== undefined) this.type = data.type;
		if (data.recipients !== undefined) {
			for (const id of this.recipients.keys()) {
				if (!data.recipients.find(r => r.id === id)) this.recipients.delete(id);
			}

			for (const r of data.recipients) {
				if (!this.recipients.has(r.id)) this.recipients.add(this._client.users.update(r));
			}
		}
	}

	/**
	 * Add a user to this channel.
	 *
	 * @param {Object} options
	 * @param {String} options.accessToken - The access token of the user to add.
	 * @param {String} [options.nick] - The nickname of the user to add.
	 * @param {String} options.userID - The id of the user to add.
	 * @returns {Promise<void>}
	 */
	async addRecipient(options: AddGroupRecipientOptions) {
		return this._client.rest.channels.addGroupRecipient(this.id, options);
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
	async createInvite(options: CreateInviteOptions) {
		return this._client.rest.channels.createInvite(this.id, options);
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
	 * @returns {Promise<Message<GroupChannel>>}
	 */
	async createMessage(options: CreateMessageOptions) {
		return this._client.rest.channels.createMessage<GroupChannel>(this.id, options);
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
	async deleteMessage(messageID: string, reason?: string) {
		return this._client.rest.channels.deleteMessage(this.id, messageID, reason);
	}

	/**
	 * Remove a reaction from a message in this channel.
	 *
	 * @param {String} messageID - The id of the message to remove a reaction from.
	 * @param {String} emoji - The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
	 * @returns {Promise<void>}
	 */
	async deleteReaction(messageID: string, emoji: string) {
		return this._client.rest.channels.deleteReaction(this.id, messageID, emoji);
	}

	/**
	 * Edit this channel.
	 *
	 * @param {?String} [options.icon] - The icon of the channel.
	 * @param {String} [options.name] - The name of the channel.
	 * @returns {Promise<GroupChannel>}
	 */
	async edit(options: EditGroupDMOptions) {
		return this._client.rest.channels.edit<GroupChannel>(this.id, options);
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
	 * @returns {Promise<Message<GroupChannel>>}
	 */
	async editMessage(messageID: string, options: EditMessageOptions) {
		return this._client.rest.channels.editMessage<this>(this.id, messageID, options);
	}

	/**
	 * Get a message in this channel.
	 *
	 * @param {String} messageID - The id of the message to get.
	 * @returns {Promise<Message<GroupChannel>>}
	 */
	async getMessage(messageID: string) {
		return this._client.rest.channels.getMessage<this>(this.id, messageID);
	}

	/**
	 * Get messages in this channel.
	 *
	 * @param {Object} options - All options are mutually exclusive.
	 * @param {String} [options.after] - Get messages after this message id.
	 * @param {String} [options.around] - Get messages around this message id.
	 * @param {String} [options.before] - Get messages before this message id.
	 * @param {Number} [options.limit] - The maximum amount of messages to get.
	 * @returns {Promise<Message<GroupChannel>[]>}
	 */
	async getMessages(options?: GetChannelMessagesOptions) {
		return this._client.rest.channels.getMessages<this>(this.id, options);
	}

	/**
	 * Get the pinned messages in this channel.
	 *
	 * @returns {Promise<Message<GroupChannel>[]>}
	 */
	async getPinnedMessages() {
		return this._client.rest.channels.getPinnedMessages<this>(this.id);
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

	iconURL(format?: ImageFormat, size?: number) {
		return this.icon === null ? null : this._client._formatImage(Routes.APPLICATION_ICON(this.application.id, this.icon), format, size);
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
	 * Remove a user from this channel.
	 *
	 * @param {String} userID - The id of the user to remove.
	 * @returns {Promise<void>}
	 */
	async removeRecipient(userID: string) {
		return this._client.rest.channels.removeGroupRecipient(this.id, userID);
	}

	/**
	 * Show a typing indicator in this channel.
	 *
	 * @returns {Promise<void>}
	 */
	async sendTyping() {
		return this._client.rest.channels.sendTyping(this.id);
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
