import Interaction from "./Interaction";
import Attachment from "./Attachment";
import Channel from "./Channel";
import Member from "./Member";
import Message from "./Message";
import Role from "./Role";
import User from "./User";
import Guild from "./Guild";
import Permission from "./Permission";
import Collection from "../util/Collection";
import type { InteractionTypes } from "../Constants";
import { InteractionResponseTypes } from "../Constants";
import type { ApplicationCommandInteractionData, InteractionContent, ModalData, RawApplicationCommandInteraction } from "../types/interactions";
import type Client from "../Client";
import type { RawMember } from "../types/guilds";
import type { AnyChannel, AnyGuildTextChannel, AnyTextChannel, RawChannel } from "../types/channels";
import type { RawUser } from "../types/users";
import { File } from "../types/request-handler";
import type { JSONCommandInteraction } from "../types/json";

export default class CommandInteraction extends Interaction {
	/** The permissions the bot has in the channel this interaction was sent from. */
	appPermissions?: Permission;
	/** The channel this interaction was sent from. */
	channel: AnyTextChannel;
	/** The data associated with the interaction. */
	data: ApplicationCommandInteractionData;
	/** The guild this interaction was sent from, if applicable. */
	guild?: Guild;
	/** The preferred [locale](https://discord.com/developers/docs/reference#locales) of the guild this interaction was sent from, if applicable. */
	guildLocale?: string;
	/** The [locale](https://discord.com/developers/docs/reference#locales) of the invoking user. */
	locale: string;
	/** The member associated with the invoking user. */
	member?: Member;
	declare type: InteractionTypes.APPLICATION_COMMAND;
	/** The user that invoked this interaction. */
	user: User;
	constructor(data: RawApplicationCommandInteraction, client: Client) {
		super(data, client);
		this.appPermissions = !data.app_permissions ? undefined : new Permission(data.app_permissions);
		this.channel = this._client.getChannel<AnyTextChannel>(data.channel_id!)!;
		this.data = {
			guildID:  data.data.guild_id,
			id:       data.data.id,
			name:     data.data.name,
			options:  data.data.options || [],
			resolved: {
				attachments: new Collection(Attachment, this._client),
				channels:	   new Collection(Channel, this._client) as Collection<string, RawChannel, AnyChannel>,
				members:	    new Collection(Member, this._client),
				messages:	   new Collection(Message, this._client),
				roles: 	     new Collection(Role, this._client),
				users:		     new Collection(User, this._client)
			},
			targetID: data.data.target_id,
			type:     data.data.type
		};
		this.guild = !data.guild_id ? undefined : this._client.guilds.get(data.guild_id);
		this.guildLocale = data.guild_locale;
		this.locale = data.locale!;
		this.member = data.member ? this.guild instanceof Guild ? this.guild.members.update({ ...data.member, id: data.member.user.id }, this.guild.id) : new Member(data.member, this._client, this.guild!.id) : undefined;
		this.user = this._client.users.update((data.user || data.member!.user)!);

		if (data.data.resolved) {
			if (data.data.resolved.attachments) Object.values(data.data.resolved.attachments).forEach(attachment => this.data.resolved.attachments.update(attachment));

			if (data.data.resolved.channels) Object.values(data.data.resolved.channels).forEach(channel => {
				const ch = this._client.getChannel(channel.id);
				if (ch && "update" in ch) (ch as Channel)["update"](channel);
				this.data.resolved.channels.add(ch || Channel.from(channel, this._client));
			});

			if (data.data.resolved.members) Object.entries(data.data.resolved.members).forEach(([id, member]) => {
				const m = member as unknown as RawMember & { id: string; user: RawUser; };
				m.id = id;
				m.user = data.data.resolved!.users![id]!;
				this.data.resolved.members.add(this.guild instanceof Guild ? this.guild.members.update(m, this.guild.id) : new Member(m, this._client, this.guild!.id));
			});

			if (data.data.resolved.messages) Object.values(data.data.resolved.messages).forEach(message => this.data.resolved.messages.update(message));

			if (data.data.resolved.roles) Object.values(data.data.resolved.roles).forEach(role => this.guild instanceof Guild ? this.guild.roles.update(role, this.guild.id) : new Role(role, this._client, this.guild!.id));

			if (data.data.resolved.users) Object.values(data.data.resolved.users).forEach(user => this.data.resolved.users.update(user));
		}
	}

	/**
	 * Create a followup message.
	 *
	 * @template {AnyGuildTextChannel} T
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
	 * @param {Boolean} [options.tts] - If the message should be spoken aloud.
	 * @returns {Promise<Message<T>>}
	 */
	async createFollowup<T extends AnyGuildTextChannel>(options: InteractionContent) {
		return this._client.rest.interactions.createFollowupMessage<T>(this.application.id, this.token, options);
	}

	/**
	 * Create a message through this interaction. This is an initial response, and more than one initial response cannot be used. Use `createFollowup`.
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
	 * @param {Boolean} [options.tts] - If the message should be spoken aloud.
	 * @returns {Promise<Promise<void>>}
	 */
	async createMessage(options: InteractionContent) {
		if (this.acknowledged) throw new Error("Interactions cannot have more than one initial response.");
		this.acknowledged = true;
		return this._client.rest.interactions.createInteractionResponse(this.id, this.token, { type: InteractionResponseTypes.CHANNEL_MESSAGE_WITH_SOURCE, data: options });
	}

	/**
	 * Respond to this interaction with a modal. This is an initial response, and more than one initial response cannot be used.
	 *
	 * @param {Object} options
	 * @param {String} options.customID - The custom ID of the modal.
	 * @param {String} options.components - The components to send.
	 * @param {String} options.title - The title of the modal.
	 * @returns {Promise<void>}
	 */
	async createModal(options: ModalData) {
		if (this.acknowledged) throw new Error("Interactions cannot have more than one initial response.");
		this.acknowledged = true;
		return this._client.rest.interactions.createInteractionResponse(this.id, this.token, { type: InteractionResponseTypes.MODAL, data: options });
	}

	/**
	 * Defer this interaction. This is an initial response, and more than one initial response cannot be used.
	 *
	 * @param {Number} flags - The [flags](https://discord.com/developers/docs/resources/channel#message-object-message-flags) to respond with.
	 * @returns {Promise<void>}
	 */
	async defer(flags?: number) {
		if (this.acknowledged) throw new Error("Interactions cannot have more than one initial response.");
		this.acknowledged = true;
		return this._client.rest.interactions.createInteractionResponse(this.id, this.token, { type: InteractionResponseTypes.DEFERRED_UPDATE_MESAGE, data: flags });
	}

	/**
	 * Delete a follow up message.
	 *
	 * @param {String} messageID - The ID of the message.
	 * @returns {Promise<void>}
	 */
	async deleteFollowup(messageID: string) {
		return this._client.rest.interactions.deleteFollowupMessage(this.application.id, this.token, messageID);
	}

	/**
	 * Delete the original interaction response. Does not work with ephemeral messages.
	 *
	 * @returns {Promise<void>}
	 */
	async deleteOriginal() {
		return this._client.rest.interactions.deleteOriginalMessage(this.application.id, this.token);
	}

	/**
	 * Edit a followup message.
	 *
	 * @template {AnyGuildTextChannel} T
	 * @param {String} messageID - The ID of the message.
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
	 * @param {Boolean} [options.tts] - If the message should be spoken aloud.
	 * @returns {Promise<Message<T>>}
	 */
	async editFollowup<T extends AnyGuildTextChannel>(messageID: string, options: InteractionContent) {
		return this._client.rest.interactions.editFollowupMessage<T>(this.application.id, this.token, messageID, options);
	}

	/**
	 * Edit the original interaction response.
	 *
	 * @template {AnyGuildTextChannel} T
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
	 * @param {Boolean} [options.tts] - If the message should be spoken aloud.
	 * @returns {Promise<Message<T>>}
	 */
	async editOriginal<T extends AnyGuildTextChannel>(options: InteractionContent) {
		return this._client.rest.interactions.editOriginalMessage<T>(this.application.id, this.token, options);
	}

	/**
	 * Get a followup message.
	 *
	 * @template {AnyGuildTextChannel} T
	 * @param {String} messageID - The ID of the message.
	 * @returns {Promise<Message<T>>}
	 */
	async getFollowup<T extends AnyGuildTextChannel>(messageID: string) {
		return this._client.rest.interactions.getFollowupMessage<T>(this.application.id, this.token, messageID);
	}

	/**
	 * Get an original interaction response.
	 *
	 * @template {AnyGuildTextChannel} T
	 * @returns {Promise<Message<T>>}
	 */
	async getOriginal<T extends AnyGuildTextChannel>() {
		return this._client.rest.interactions.getOriginalMessage<T>(this.application.id, this.token);
	}

	override toJSON(): JSONCommandInteraction {
		return {
			...super.toJSON(),
			appPermissions: this.appPermissions?.toJSON(),
			channel:        this.channel.id,
			data:           this.data,
			guild:          this.guild?.id,
			guildLocale:    this.guildLocale,
			locale:         this.locale,
			member:         this.member?.toJSON(),
			type:           this.type,
			user:           this.user.toJSON()
		};
	}
}
