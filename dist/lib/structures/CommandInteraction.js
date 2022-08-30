"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Interaction_1 = __importDefault(require("./Interaction"));
const Attachment_1 = __importDefault(require("./Attachment"));
const Channel_1 = __importDefault(require("./Channel"));
const Member_1 = __importDefault(require("./Member"));
const Message_1 = __importDefault(require("./Message"));
const Role_1 = __importDefault(require("./Role"));
const User_1 = __importDefault(require("./User"));
const Guild_1 = __importDefault(require("./Guild"));
const Permission_1 = __importDefault(require("./Permission"));
const Collection_1 = __importDefault(require("../util/Collection"));
const Constants_1 = require("../Constants");
const InteractionOptionsWrapper_1 = __importDefault(require("../util/InteractionOptionsWrapper"));
class CommandInteraction extends Interaction_1.default {
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
    /** The permissions of the member associated with the invoking user */
    memberPermissions;
    /** The user that invoked this interaction. */
    user;
    constructor(data, client) {
        super(data, client);
        this.appPermissions = !data.app_permissions ? undefined : new Permission_1.default(data.app_permissions);
        this.channel = this._client.getChannel(data.channel_id);
        this.data = {
            guildID: data.data.guild_id,
            id: data.data.id,
            name: data.data.name,
            options: new InteractionOptionsWrapper_1.default([], null),
            resolved: {
                attachments: new Collection_1.default(Attachment_1.default, this._client),
                channels: new Collection_1.default(Channel_1.default, this._client),
                members: new Collection_1.default(Member_1.default, this._client),
                messages: new Collection_1.default(Message_1.default, this._client),
                roles: new Collection_1.default(Role_1.default, this._client),
                users: new Collection_1.default(User_1.default, this._client)
            },
            target: undefined,
            targetID: data.data.target_id,
            type: data.data.type
        };
        this.guild = !data.guild_id ? undefined : this._client.guilds.get(data.guild_id);
        this.guildID = data.guild_id;
        this.guildLocale = data.guild_locale;
        this.locale = data.locale;
        this.member = data.member ? this.guild instanceof Guild_1.default ? this.guild.members.update({ ...data.member, id: data.member.user.id }, this.guildID) : new Member_1.default(data.member, this._client, this.guildID) : undefined;
        this.memberPermissions = data.member ? new Permission_1.default(data.member.permissions) : undefined;
        this.user = this._client.users.update((data.user || data.member.user));
        if (data.data.resolved) {
            if (data.data.resolved.attachments)
                Object.values(data.data.resolved.attachments).forEach(attachment => this.data.resolved.attachments.update(attachment));
            if (data.data.resolved.channels)
                Object.values(data.data.resolved.channels).forEach(channel => {
                    const ch = this._client.getChannel(channel.id);
                    if (ch && "update" in ch)
                        ch["update"](channel);
                    this.data.resolved.channels.add(ch || Channel_1.default.from(channel, this._client));
                });
            if (data.data.resolved.members)
                Object.entries(data.data.resolved.members).forEach(([id, member]) => {
                    const m = member;
                    m.id = id;
                    m.user = data.data.resolved.users[id];
                    this.data.resolved.members.add(this.guild instanceof Guild_1.default ? this.guild.members.update(m, this.guildID) : new Member_1.default(m, this._client, this.guildID));
                });
            if (data.data.resolved.messages)
                Object.values(data.data.resolved.messages).forEach(message => this.data.resolved.messages.update(message));
            if (data.data.resolved.roles)
                Object.values(data.data.resolved.roles).forEach(role => this.data.resolved.roles.add(this.guild instanceof Guild_1.default ? this.guild.roles.update(role, this.guildID) : new Role_1.default(role, this._client, this.guild.id)));
            if (data.data.resolved.users)
                Object.values(data.data.resolved.users).forEach(user => this.data.resolved.users.update(user));
        }
        if (this.data.targetID) {
            if (this.data.type === Constants_1.ApplicationCommandTypes.USER)
                this.data.target = this.data.resolved.users.get(this.data.targetID);
            else if (this.data.type === Constants_1.ApplicationCommandTypes.MESSAGE)
                this.data.target = this.data.resolved.messages.get(this.data.targetID);
        }
        if (data.data.options)
            this.data.options = new InteractionOptionsWrapper_1.default(data.data.options, this.data.resolved);
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
     * @param {Object[]} [options.components] - An array of [components](https://discord.com/developers/docs/interactions/message-components) to send. Convert `snake_case` keys to `camelCase`.
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
     * @param {Object[]} [options.components] - An array of [components](https://discord.com/developers/docs/interactions/message-components) to send. Convert `snake_case` keys to `camelCase`.
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
     * @param {Object[]} options.components - An array of [components](https://discord.com/developers/docs/interactions/message-components) to send. Convert `snake_case` keys to `camelCase`.
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
     * Defer this interaction. This is an initial response, and more than one initial response cannot be used.
     *
     * @param {Number} flags - The [flags](https://discord.com/developers/docs/resources/channel#message-object-message-flags) to respond with.
     * @returns {Promise<void>}
     */
    async defer(flags) {
        if (this.acknowledged)
            throw new Error("Interactions cannot have more than one initial response.");
        this.acknowledged = true;
        return this._client.rest.interactions.createInteractionResponse(this.id, this.token, { type: Constants_1.InteractionResponseTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE, data: { flags } });
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
     * @param {Object[]} [options.components] - An array of [components](https://discord.com/developers/docs/interactions/message-components) to send. Convert `snake_case` keys to `camelCase`.
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
     * @param {Object[]} [options.components] - An array of [components](https://discord.com/developers/docs/interactions/message-components) to send. Convert `snake_case` keys to `camelCase`.
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
exports.default = CommandInteraction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWFuZEludGVyYWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3N0cnVjdHVyZXMvQ29tbWFuZEludGVyYWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsZ0VBQXdDO0FBQ3hDLDhEQUFzQztBQUN0Qyx3REFBZ0M7QUFDaEMsc0RBQThCO0FBQzlCLHdEQUFnQztBQUNoQyxrREFBMEI7QUFDMUIsa0RBQTBCO0FBQzFCLG9EQUE0QjtBQUM1Qiw4REFBc0M7QUFDdEMsb0VBQTRDO0FBRTVDLDRDQUFpRjtBQVFqRixrR0FBMEU7QUFFMUUsTUFBcUIsa0JBQW1CLFNBQVEscUJBQVc7SUFDdkQsaUZBQWlGO0lBQ2pGLGNBQWMsQ0FBYztJQUM1QixrREFBa0Q7SUFDbEQsT0FBTyxDQUFpQjtJQUN4QixnREFBZ0Q7SUFDaEQsSUFBSSxDQUFvQztJQUN4QywrREFBK0Q7SUFDL0QsS0FBSyxDQUFTO0lBQ2QseUVBQXlFO0lBQ3pFLE9BQU8sQ0FBVTtJQUNqQixnSkFBZ0o7SUFDaEosV0FBVyxDQUFVO0lBQ3JCLGdHQUFnRztJQUNoRyxNQUFNLENBQVM7SUFDZixvREFBb0Q7SUFDcEQsTUFBTSxDQUFVO0lBQ2hCLHNFQUFzRTtJQUN0RSxpQkFBaUIsQ0FBYztJQUUvQiw4Q0FBOEM7SUFDOUMsSUFBSSxDQUFPO0lBQ1gsWUFBWSxJQUFzQyxFQUFFLE1BQWM7UUFDOUQsS0FBSyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNwQixJQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLG9CQUFVLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQy9GLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQWlCLElBQUksQ0FBQyxVQUFXLENBQUUsQ0FBQztRQUMx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QUksQ0FBQyxLQUFLLFlBQVksZUFBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxnQkFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUMzSixDQUFDLENBQUMsQ0FBQztZQUVILElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUTtnQkFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUU1SSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUs7Z0JBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLFlBQVksZUFBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxjQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFL08sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLO2dCQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQ2hJO1FBRUQsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNwQixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLG1DQUF1QixDQUFDLElBQUk7Z0JBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2lCQUNwSCxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLG1DQUF1QixDQUFDLE9BQU87Z0JBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3ZJO1FBRUQsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU87WUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLG1DQUF5QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDcEgsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FrQkc7SUFDSCxLQUFLLENBQUMsY0FBYyxDQUFnQyxPQUEyQjtRQUMzRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxxQkFBcUIsQ0FBSSxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzdHLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FpQkc7SUFDSCxLQUFLLENBQUMsYUFBYSxDQUFDLE9BQTJCO1FBQzNDLElBQUksSUFBSSxDQUFDLFlBQVk7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDBEQUEwRCxDQUFDLENBQUM7UUFDbkcsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7UUFDekIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLG9DQUF3QixDQUFDLDJCQUEyQixFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQ3hLLENBQUM7SUFFRDs7Ozs7Ozs7T0FRRztJQUNILEtBQUssQ0FBQyxXQUFXLENBQUMsT0FBa0I7UUFDaEMsSUFBSSxJQUFJLENBQUMsWUFBWTtZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsMERBQTBELENBQUMsQ0FBQztRQUNuRyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztRQUN6QixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsb0NBQXdCLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQ2xKLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBYztRQUN0QixJQUFJLElBQUksQ0FBQyxZQUFZO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQywwREFBMEQsQ0FBQyxDQUFDO1FBQ25HLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxvQ0FBd0IsQ0FBQyxvQ0FBb0MsRUFBRSxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDbkwsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsS0FBSyxDQUFDLGNBQWMsQ0FBQyxTQUFpQjtRQUNsQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzVHLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsS0FBSyxDQUFDLGNBQWM7UUFDaEIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pHLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQW1CRztJQUNILEtBQUssQ0FBQyxZQUFZLENBQWdDLFNBQWlCLEVBQUUsT0FBMkI7UUFDNUYsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsbUJBQW1CLENBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDdEgsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FrQkc7SUFDSCxLQUFLLENBQUMsWUFBWSxDQUFnQyxPQUEyQjtRQUN6RSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxtQkFBbUIsQ0FBSSxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzNHLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxLQUFLLENBQUMsV0FBVyxDQUFnQyxTQUFpQjtRQUM5RCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsQ0FBSSxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzVHLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILEtBQUssQ0FBQyxXQUFXO1FBQ2IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsa0JBQWtCLENBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pHLENBQUM7SUFFUSxNQUFNO1FBQ1gsT0FBTztZQUNILEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUNqQixjQUFjLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxNQUFNLEVBQUU7WUFDN0MsT0FBTyxFQUFTLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUMvQixJQUFJLEVBQVksSUFBSSxDQUFDLElBQUk7WUFDekIsS0FBSyxFQUFXLElBQUksQ0FBQyxPQUFPO1lBQzVCLFdBQVcsRUFBSyxJQUFJLENBQUMsV0FBVztZQUNoQyxNQUFNLEVBQVUsSUFBSSxDQUFDLE1BQU07WUFDM0IsTUFBTSxFQUFVLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFO1lBQ3JDLElBQUksRUFBWSxJQUFJLENBQUMsSUFBSTtZQUN6QixJQUFJLEVBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7U0FDckMsQ0FBQztJQUNOLENBQUM7Q0FDSjtBQWpRRCxxQ0FpUUMifQ==