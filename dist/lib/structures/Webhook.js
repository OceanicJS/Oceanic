"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = __importDefault(require("./Base"));
const Constants_1 = require("../Constants");
const Routes = __importStar(require("../util/Routes"));
class Webhook extends Base_1.default {
    /** The application associatd with this webhook. */
    application;
    /** The hash of this webhook's avatar. */
    avatar;
    /** The channel this webhook is for, if applicable. */
    channel;
    /** The guild this webhook is for, if applicable. */
    guild;
    /** The id of the guild this webhook is in, if applicable. */
    guildID;
    /** The username of this webhook, if any. */
    name;
    /** The source channel for this webhook (channel follower only). */
    sourceChannel;
    /** The source guild for this webhook (channel follower only). */
    sourceGuild;
    /** The token for this webhook (not present for webhooks created by other applications) */
    token;
    /** The [type](https://discord.com/developers/docs/resources/webhook#webhook-object-webhook-types) of this webhook. */
    type;
    /** The user that created this webhook. */
    user;
    constructor(data, client) {
        super(data.id, client);
        if (data.application_id !== undefined)
            this.application = data.application_id === null ? null : this._client.application?.id === data.application_id ? this._client.application : { id: data.application_id };
        this.avatar = data.avatar ?? null;
        this.channel = data.channel_id === null ? null : this._client.getChannel(data.channel_id) || { id: data.channel_id };
        this.guild = !data.guild_id ? null : this._client.guilds.get(data.guild_id);
        this.guildID = data.guild_id ?? null;
        this.name = data.name;
        this.sourceChannel = data.source_channel;
        this.sourceGuild = data.source_guild;
        this.token = data.token;
        this.type = data.type;
        this.user = !data.user ? null : this._client.users.update(data.user);
    }
    get url() { return `${Constants_1.BASE_URL}${Routes.WEBHOOK(this.id, this.token)}`; }
    /**
     * The url of this webhook's avatar.
     *
     * @param {ImageFormat} format - The format the url should be.
     * @param {Number} size - The dimensions of the image.
     * @returns {(String | null)}
     */
    avatarURL(format, size) {
        return this.avatar === null ? null : this._client.util.formatImage(Routes.USER_AVATAR(this.id, this.avatar), format, size);
    }
    /**
     * Delete this webhook (requires a bot user, see `deleteToken`).
     *
     * @param {String} [reason] - The reason for deleting this webhook.
     * @returns {Promise<void>}
     */
    async delete(reason) {
        return this._client.rest.webhooks.delete(this.id, reason);
    }
    /**
     * Delete a message from this webhook.
     *
     * @param {String} messageID - The id of the message.
     * @param {Object} [options]
     * @param {String} [options.threadID] - The id of the thread the message is in.
     * @param {String} [token] - The token for the webhook, if not already present.
     * @returns {Promise<void>}
     */
    async deleteMessage(messageID, options, token) {
        const t = this.token || token;
        if (!t)
            throw new Error("Token is not present on webhook, and was not provided in options.");
        return this._client.rest.webhooks.deleteMessage(this.id, t, messageID, options);
    }
    /**
     * Delete this webhook via its token.
     *
     * @param {String} [token] - The token for the webhook, if not already present.
     * @returns {Promise<void>}
     */
    async deleteToken(token) {
        const t = this.token || token;
        if (!t)
            throw new Error("Token is not present on webhook, and was not provided in options.");
        return this._client.rest.webhooks.deleteToken(this.id, t);
    }
    /**
     * Edit this webhook (requires a bot user, see `editToken`).
     *
     * @param {Object} options
     * @param {?(String | Buffer)} [options.avatar] - The new avatar (buffer, or full data url). `null` to remove the current avatar.
     * @param {String} [options.channelID] - The id of the channel to move this webhook to.
     * @param {String} [options.name] - The name of the webhook.
     * @param {String} [options.reason] - The reason for editing this webhook.
     * @returns {Promise<Webhook>}
     */
    async edit(options) {
        return this._client.rest.webhooks.edit(this.id, options);
    }
    /**
     * Edit a webhook message.
     *
     * @template {AnyGuildTextChannel} T
     * @param {String} id - The id of the webhook.
     * @param {String} token - The token of the webhook.
     * @param {String} messageID - The id of the message to edit.
     * @param {Object} options
     * @param {Object} [options.allowedMentions] - An object that specifies the allowed mentions in this message.
     * @param {Boolean} [options.allowedMentions.everyone] - If `@everyone`/`@here` mentions should be allowed.
     * @param {Boolean} [options.allowedMentions.repliedUser] - If the replied user (`messageReference`) should be mentioned.
     * @param {(Boolean | String[])} [options.allowedMentions.roles] - An array of role ids that are allowed to be mentioned, or a boolean value to allow all or none.
     * @param {(Boolean | String[])} [options.allowedMentions.users] - An array of user ids that are allowed to be mentioned, or a boolean value to allow all or none.
     * @param {Object[]} [options.attachments] - An array of [attachment information](https://discord.com/developers/docs/resources/channel#attachment-object) related to the sent files.
     * @param {Object[]} [options.components] - An array of [components](https://discord.com/developers/docs/interactions/message-components) to send. Convert `snake_case` keys to `camelCase`
     * @param {String} [options.content] - The content of the message.
     * @param {Object[]} [options.embeds] - An array of [embeds](https://discord.com/developers/docs/resources/channel#embed-object) to send.
     * @param {File[]} [options.files] - The files to send.
     * @param {String} [options.threadID] - The id of the thread to send the message to.
     * @returns {Promise<Message<T>>}
     */
    async editMessage(messageID, options, token) {
        const t = this.token || token;
        if (!t)
            throw new Error("Token is not present on webhook, and was not provided in options.");
        return this._client.rest.webhooks.editMessage(this.id, t, messageID, options);
    }
    /**
     * Edit a webhook via its token.
     *
     * @param {Object} options
     * @param {?(String | Buffer)} [options.avatar] - The new avatar (buffer, or full data url). `null` to remove the current avatar.
     * @param {String} [options.name] - The name of the webhook.
     * @param {String} [token] - The token for the webhook, if not already present.
     * @returns {Promise<Webhook>}
     */
    async editToken(options, token) {
        const t = this.token || token;
        if (!t)
            throw new Error("Token is not present on webhook, and was not provided in options.");
        return this._client.rest.webhooks.editToken(this.id, t, options);
    }
    async execute(options, token) {
        const t = this.token || token;
        if (!t)
            throw new Error("Token is not present on webhook, and was not provided in options.");
        return this._client.rest.webhooks.execute(this.id, t, options);
    }
    async executeGithub(options, token) {
        const t = this.token || token;
        if (!t)
            throw new Error("Token is not present on webhook, and was not provided in options.");
        return this._client.rest.webhooks.executeGithub(this.id, t, options);
    }
    async executeSlack(options, token) {
        const t = this.token || token;
        if (!t)
            throw new Error("Token is not present on webhook, and was not provided in options.");
        return this._client.rest.webhooks.executeSlack(this.id, t, options);
    }
    /**
     * Get a webhook message.
     *
     * @template {AnyGuildTextChannel} T
     * @param {String} messageID - The id of the message.
     * @param {String} [threadID] - The id of the thread the message is in.
     * @param {String} [token] - The token for the webhook, if not already present.
     * @returns {Promise<Message<T>>}
     */
    async getMessage(messageID, threadID, token) {
        const t = this.token || token;
        if (!t)
            throw new Error("Token is not present on webhook, and was not provided in options.");
        return this._client.rest.webhooks.getMessage(this.id, t, messageID, threadID);
    }
    /**
     * The url of this webhook's `sourceGuild` icon (only present on channel follower webhooks).
     *
     * @param {ImageFormat} format - The format the url should be.
     * @param {Number} size - The dimensions of the image.
     * @returns {(String | null)}
     */
    sourceGuildIconURL(format, size) {
        return !this.sourceGuild?.icon ? null : this._client.util.formatImage(Routes.GUILD_ICON(this.id, this.sourceGuild?.icon), format, size);
    }
    toJSON() {
        return {
            ...super.toJSON(),
            application: this.application?.id || null,
            avatar: this.avatar,
            channel: this.channel?.id || null,
            guild: this.guildID,
            name: this.name,
            sourceChannel: this.sourceChannel,
            sourceGuild: this.sourceGuild,
            token: this.token,
            type: this.type,
            user: this.user?.toJSON()
        };
    }
}
exports.default = Webhook;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV2ViaG9vay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9zdHJ1Y3R1cmVzL1dlYmhvb2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGtEQUEwQjtBQU8xQiw0Q0FBd0M7QUFDeEMsdURBQXlDO0FBZXpDLE1BQXFCLE9BQVEsU0FBUSxjQUFJO0lBQ3JDLG1EQUFtRDtJQUNuRCxXQUFXLENBQXNDO0lBQ2pELHlDQUF5QztJQUN6QyxNQUFNLENBQWdCO0lBQ3RCLHNEQUFzRDtJQUN0RCxPQUFPLENBQXdDO0lBQy9DLG9EQUFvRDtJQUNwRCxLQUFLLENBQWU7SUFDcEIsNkRBQTZEO0lBQzdELE9BQU8sQ0FBZ0I7SUFDdkIsNENBQTRDO0lBQzVDLElBQUksQ0FBZ0I7SUFDcEIsbUVBQW1FO0lBQ25FLGFBQWEsQ0FBbUM7SUFDaEQsaUVBQWlFO0lBQ2pFLFdBQVcsQ0FBMEM7SUFDckQsMEZBQTBGO0lBQzFGLEtBQUssQ0FBVTtJQUNmLHNIQUFzSDtJQUN0SCxJQUFJLENBQWU7SUFDbkIsMENBQTBDO0lBQzFDLElBQUksQ0FBYztJQUNsQixZQUFZLElBQWdCLEVBQUUsTUFBYztRQUN4QyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN2QixJQUFJLElBQUksQ0FBQyxjQUFjLEtBQUssU0FBUztZQUFFLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGNBQWMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFBRSxLQUFLLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDOU0sSUFBSSxD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