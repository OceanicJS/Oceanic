"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Interaction_1 = __importDefault(require("./Interaction"));
const Message_1 = __importDefault(require("./Message"));
const Guild_1 = __importDefault(require("./Guild"));
const Member_1 = __importDefault(require("./Member"));
const Permission_1 = __importDefault(require("./Permission"));
const Constants_1 = require("../Constants");
class ComponentInteraction extends Interaction_1.default {
    /** The permissions the bot has in the channel this interaction was sent from. */
    appPermissions;
    /** The channel this interaction was sent from. */
    channel;
    /** The data associated with the interaction. */
    data;
    /** The guild this interaction was sent from, if applicable. */
    guild;
    /** The id of the guild this interaction was sent from, if applicable. */
    guildID;
    /** The preferred [locale](https://discord.com/developers/docs/reference#locales) of the guild this interaction was sent from, if applicable. */
    guildLocale;
    /** The [locale](https://discord.com/developers/docs/reference#locales) of the invoking user. */
    locale;
    /** The member associated with the invoking user. */
    member;
    /** The message the interaction is from. */
    message;
    /** The user that invoked this interaction. */
    user;
    constructor(data, client) {
        super(data, client);
        this.appPermissions = !data.app_permissions ? undefined : new Permission_1.default(data.app_permissions);
        this.channel = this._client.getChannel(data.channel_id);
        this.guild = !data.guild_id ? undefined : this._client.guilds.get(data.guild_id);
        this.guildID = data.guild_id;
        this.guildLocale = data.guild_locale;
        this.locale = data.locale;
        this.member = data.member ? this.guild instanceof Guild_1.default ? this.guild.members.update({ ...data.member, id: data.member.user.id }, this.guild.id) : new Member_1.default(data.member, this._client, this.guild.id) : undefined;
        this.message = "messages" in this.channel ? this.channel.messages.update(data.message) : new Message_1.default(data.message, this._client);
        this.user = this._client.users.update((data.user || data.member.user));
        switch (data.data.component_type) {
            case Constants_1.ComponentTypes.BUTTON: {
                this.data = {
                    componentType: data.data.component_type,
                    customID: data.data.custom_id
                };
                break;
            }
            case Constants_1.ComponentTypes.SELECT_MENU: {
                this.data = {
                    componentType: data.data.component_type,
                    customID: data.data.custom_id,
                    values: data.data.values
                };
            }
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
    async createFollowup(options) {
        return this._client.rest.interactions.createFollowupMessage(this.application.id, this.token, options);
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
    async createMessage(options) {
        if (this.acknowledged)
            throw new Error("Interactions cannot have more than one initial response.");
        this.acknowledged = true;
        return this._client.rest.interactions.createInteractionResponse(this.id, this.token, { type: Constants_1.InteractionResponseTypes.CHANNEL_MESSAGE_WITH_SOURCE, data: options });
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
    async createModal(options) {
        if (this.acknowledged)
            throw new Error("Interactions cannot have more than one initial response.");
        this.acknowledged = true;
        return this._client.rest.interactions.createInteractionResponse(this.id, this.token, { type: Constants_1.InteractionResponseTypes.MODAL, data: options });
    }
    /**
     * Defer this interaction with a `DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE` response. This is an initial response, and more than one initial response cannot be used.
     *
     * @param {Number} flags - The [flags](https://discord.com/developers/docs/resources/channel#message-object-message-flags) to respond with.
     * @returns {Promise<void>}
     */
    async defer(flags) {
        if (this.acknowledged)
            throw new Error("Interactions cannot have more than one initial response.");
        this.acknowledged = true;
        return this._client.rest.interactions.createInteractionResponse(this.id, this.token, { type: Constants_1.InteractionResponseTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE, data: flags });
    }
    /**
     * Defer this interaction with a `DEFERRED_UPDATE_MESAGE` response.. This is an initial response, and more than one initial response cannot be used.
     *
     * @param {Number} flags - The [flags](https://discord.com/developers/docs/resources/channel#message-object-message-flags) to respond with.
     * @returns {Promise<void>}
     */
    async deferUpdate(flags) {
        if (this.acknowledged)
            throw new Error("Interactions cannot have more than one initial response.");
        this.acknowledged = true;
        return this._client.rest.interactions.createInteractionResponse(this.id, this.token, { type: Constants_1.InteractionResponseTypes.DEFERRED_UPDATE_MESAGE, data: flags });
    }
    /**
     * Delete a follow up message.
     *
     * @param {String} messageID - The ID of the message.
     * @returns {Promise<void>}
     */
    async deleteFollowup(messageID) {
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
    async editFollowup(messageID, options) {
        return this._client.rest.interactions.editFollowupMessage(this.application.id, this.token, messageID, options);
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
    async editOriginal(options) {
        return this._client.rest.interactions.editOriginalMessage(this.application.id, this.token, options);
    }
    /**
     * Edit the message this interaction is from. If this interaction has already been acknowledged, use `createFollowup`.
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
    async editParent(options) {
        if (this.acknowledged)
            throw new Error("Interactions cannot have more than one initial response.");
        this.acknowledged = true;
        return this._client.rest.interactions.createInteractionResponse(this.id, this.token, { type: Constants_1.InteractionResponseTypes.UPDATE_MESSAGE, data: options });
    }
    /**
     * Get a followup message.
     *
     * @template {AnyGuildTextChannel} T
     * @param {String} messageID - The ID of the message.
     * @returns {Promise<Message<T>>}
     */
    async getFollowup(messageID) {
        return this._client.rest.interactions.getFollowupMessage(this.application.id, this.token, messageID);
    }
    /**
     * Get an original interaction response.
     *
     * @template {AnyGuildTextChannel} T
     * @returns {Promise<Message<T>>}
     */
    async getOriginal() {
        return this._client.rest.interactions.getOriginalMessage(this.application.id, this.token);
    }
    toJSON() {
        return {
            ...super.toJSON(),
            appPermissions: this.appPermissions?.toJSON(),
            channel: this.channel.id,
            data: this.data,
            guild: this.guildID,
            guildLocale: this.guildLocale,
            locale: this.locale,
            member: this.member?.toJSON(),
            type: this.type,
            user: this.user.toJSON()
        };
    }
}
exports.default = ComponentInteraction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tcG9uZW50SW50ZXJhY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvc3RydWN0dXJlcy9Db21wb25lbnRJbnRlcmFjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGdFQUF3QztBQUN4Qyx3REFBZ0M7QUFDaEMsb0RBQTRCO0FBQzVCLHNEQUE4QjtBQUU5Qiw4REFBc0M7QUFVdEMsNENBQXdFO0FBS3hFLE1BQXFCLG9CQUFxQixTQUFRLHFCQUFXO0lBQzVELGlGQUFpRjtJQUNqRixjQUFjLENBQWM7SUFDNUIsa0RBQWtEO0lBQ2xELE9BQU8sQ0FBaUI7SUFDeEIsZ0RBQWdEO0lBQ2hELElBQUksQ0FBb0Y7SUFDeEYsK0RBQStEO0lBQy9ELEtBQUssQ0FBUztJQUNkLHlFQUF5RTtJQUN6RSxPQUFPLENBQVU7SUFDakIsZ0pBQWdKO0lBQ2hKLFdBQVcsQ0FBVTtJQUNyQixnR0FBZ0c7SUFDaEcsTUFBTSxDQUFTO0lBQ2Ysb0RBQW9EO0lBQ3BELE1BQU0sQ0FBVTtJQUNoQiwyQ0FBMkM7SUFDM0MsT0FBTyxDQUFVO0lBRWpCLDhDQUE4QztJQUM5QyxJQUFJLENBQU87SUFDWCxZQUFZLElBQW9DLEVBQUUsTUFBYztRQUMvRCxLQUFLLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksb0JBQVUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDL0YsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBaUIsSUFBSSxDQUFDLFVBQVcsQ0FBRSxDQUFDO1FBQzFFLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFD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