import Base from "./Base";
import Attachment from "./Attachment";
import User from "./User";
import type ThreadChannel from "./ThreadChannel";
import Channel from "./Channel";
import type Client from "../Client";
import type {
	AnyGuildTextChannel,
	AnyThreadChannel,
	ChannelMention,
	Embed,
	MessageActionRow,
	MessageActivity,
	MessageInteraction,
	MessageReaction,
	MessageReference,
	RawAttachment,
	RawMessage,
	StickerItem
} from "../routes/Channels";
import type { RawApplication } from "../routes/OAuth";
import Collection from "../util/Collection";
import type { MessageTypes } from "../Constants";
import type { RawMember } from "../routes/Guilds";
import type { Partial as PartialChannel } from "../util/shared";
import type { DeleteWebhookMessageOptions, EditWebhookMessageOptions } from "../routes/Webhooks";

export default class Message<T extends AnyGuildTextChannel = AnyGuildTextChannel> extends Base {
	/** The [activity](https://discord.com/developers/docs/resources/channel#message-object-message-activity-structure) associated with this message. */
	activity?: MessageActivity;
	application?: RawApplication; // @TODO specific properties sent
	applicationID?: string;
	/** The attachments on this message. */
	attachments: Collection<string, RawAttachment, Attachment>;
	/** The author of this message. */
	author: User; // this can be an invalid user if `webhook_id` is set
	/** The channel this message was created in. */
	channel: T | PartialChannel;
	/** The components on this message. */
	components?: Array<MessageActionRow>;
	/** The content of this message. */
	content: string;
	/** The timestamp at which this message was last edited. */
	editedTimestamp: Date | null;
	/** The embeds on this message. */
	embeds: Array<Embed>;
	/** The [flags](https://discord.com/developers/docs/resources/channel#message-object-message-flags) on this message. */
	flags?: number;
	/** The interaction info, if this message was the result of an interaction. */
	interaction?: MessageInteraction;
	/** Channels mentioned in a `CROSSPOSTED` channel follower message. See [Discord's docs](https://discord.com/developers/docs/resources/channel#channel-mention-object) for more information. */
	mentionChannels?: Array<ChannelMention>;
	/** The mentions in this message. */
	mentions: {
		/** The ids of the channels mentioned in this message. */
		channels: Array<string>;
		/** If @everyone/@here is mentioned in this message. */
		everyone: boolean;
		/** The ids of the roles mentioned in this message. */
		roles: Array<string>;
		/** The users mentioned in this message. */
		users: Array<User>;
	};
	/** If this message is a `REPLY` or `THREAD_STARTER_MESSAGE`, some info about the referenced message. */
	messageReference?: MessageReference;
	/** A nonce for ensuring a message was sent. */
	nonce?: number | string;
	/** If this message is pinned. */
	pinned: boolean;
	/** This message's relative position, if in a thread. */
	position?: number;
	/** The reactions on this message. */
	reactions?: Array<MessageReaction>;
	/** If this message is a `REPLY` or `THREAD_STARTER_MESSAGE`,  */
	referencedMessage?: Message | null;
	// stickers exists, but is deprecated
	/** The sticker items on this message. */
	stickerItems?: Array<StickerItem>;
	/** The thread associated with this message, if any. */
	thread?: ThreadChannel;
	/** The timestamp at which this message was sent. */
	timestamp: Date;
	/** If this message was read aloud. */
	tts: boolean;
	/** The [type](https://discord.com/developers/docs/resources/channel#message-object-message-types) of this message. */
	type: MessageTypes;
	/** The id of the webhook associated with this message, if sent via a webhook. */
	webhookID?: string;
	constructor(data: RawMessage, client: Client) {
		super(data.id, client);
		this.attachments = new Collection(Attachment, client);
		if (data.author.discriminator !== "0000") this.author = this._client.users.update(data.author);
		else this.author = new User(data.author, this._client);
		if (data.attachments) {
			for (const attachment of data.attachments) this.attachments.update(attachment);
		}
		this.channel = this._client.getChannel<AnyGuildTextChannel>(data.channel_id) || {
			id: data.channel_id
		};
		this.update(data);
	}

	protected update(data: RawMessage) {
		this.activity = data.activity;
		this.application = data.application;
		this.applicationID = data.application_id;
		if (data.attachments) {
			for (const id of this.attachments.keys()) {
				if (!data.attachments.some(attachment => attachment.id === id)) this.attachments.delete(id);
			}
			for (const attachment of data.attachments) this.attachments.update(attachment);
		}
		this.components = data.components;
		this.content = data.content;
		this.editedTimestamp = data.edited_timestamp ? new Date(data.edited_timestamp) : null;
		this.embeds = data.embeds;
		this.flags = data.flags;
		if (data.interaction) {
			let member: RawMember & { id: string; } | undefined;
			if (data.interaction.member) member = {
				...data.interaction.member,
				id: data.interaction.user.id
			};
			this.interaction = {
				id:     data.interaction.id,
				member: this.channel instanceof Channel && this.channel.guild && member ? this.channel.guild.members.update(member, this.channel.guild.id) : undefined,
				name:   data.interaction.name,
				type:   data.interaction.type,
				user:   this._client.users.update(data.interaction.user)
			};
		}
		this.mentions = {
			channels: (this.content.match(/<#[\d]{17,21}>/g) || []).map(mention => mention.slice(2, -1)),
			everyone: data.mention_everyone,
			roles:    data.mention_roles,
			users:    data.mentions.map(user => {
				if (user.member && "guild" in this.channel && this.channel.guild) this.channel.guild.members.update({ ...user.member, id: user.id }, this.channel.guild.id);
				return this._client.users.update(user);
			})
		};
		if (data.message_reference) {
			this.messageReference = {
				channelID:       data.message_reference.channel_id,
				failIfNotExists: data.message_reference.fail_if_not_exists,
				guildID:         data.message_reference.guild_id,
				messageID:       data.message_reference.message_id
			};
		}
		this.nonce = data.nonce;
		this.pinned = data.pinned;
		this.position = data.position;
		if (data.referenced_message) {
			if (this.channel instanceof Channel) this.referencedMessage = this.channel.messages.update(data.referenced_message);
			else this.referencedMessage = new Message(data.referenced_message, this._client);
		}
		this.stickerItems = data.sticker_items;
		if (data.thread) {
			if (this.channel && "threads" in this.channel) this.thread = this.channel.threads.add(Channel.from<AnyThreadChannel>(data.thread, this._client));
			else this.thread = Channel.from<AnyThreadChannel>(data.thread, this._client);
		}
		this.timestamp = new Date(data.timestamp);
		this.tts = data.tts;
		this.type = data.type;
		this.webhookID = data.webhook_id;
	}
	/**
	 * Delete this message as a webhook.
	 *
	 * @param {String} token - The token of the webhook.
	 * @param {Object} [options]
	 * @param {String} [options.threadID] - The id of the thread the message is in.
	 * @returns {Promise<Boolean>}
	 */
	async deleteWebhook(token: string, options: DeleteWebhookMessageOptions) {
		if (!this.webhookID) throw new Error("This message is not a webhook message.");
		return this._client.rest.webhooks.deleteMessage(this.webhookID, token, this.id, options);
	}

	/**
	 * Edit this message as a webhook.
	 *
	 * @param {String} token - The token of the webhook.
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
	 * @param {String} [options.threadID] - The id of the thread to send the message to.
	 * @returns {Promise<Message>}
	 */
	async editWebhook(token: string, options: EditWebhookMessageOptions) {
		if (!this.webhookID) throw new Error("This message is not a webhook message.");
		return this._client.rest.webhooks.editMessage(this.webhookID, token, this.id, options);
	}
}
