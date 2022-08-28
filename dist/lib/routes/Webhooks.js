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
const BaseRoute_1 = __importDefault(require("./BaseRoute"));
const Routes = __importStar(require("../util/Routes"));
const Webhook_1 = __importDefault(require("../structures/Webhook"));
const Message_1 = __importDefault(require("../structures/Message"));
class Webhooks extends BaseRoute_1.default {
    /**
     * Creat a channel webhook.
     *
     * @param {String} channelID - The id of the channel to create the webhook in.
     * @param {Object} options
     * @param {?(String | Buffer)} [options.avatar] - The new avatar (buffer, or full data url). `null` to remove the current avatar.
     * @param {String} options.name - The name of the webhook.
     * @param {String} [options.reason] - The reason for creating this webhook.
     * @returns {Promise<Webhook>}
     */
    async create(channelID, options) {
        const reason = options.reason;
        if (options.reason)
            delete options.reason;
        if (options.avatar)
            options.avatar = this._manager._convertImage(options.avatar, "avatar");
        return this._manager.authRequest({
            method: "POST",
            path: Routes.CHANNEL_WEBHOOKS(channelID),
            json: {
                avatar: options.avatar,
                name: options.name
            },
            reason
        }).then(data => new Webhook_1.default(data, this._client));
    }
    /**
     * Delete a webhook.
     *
     * @param {String} id - The id of the webhook.
     * @param {String} [reason] - The reason for deleting the webhook.
     * @returns {Promise<void>}
     */
    async delete(id, reason) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.WEBHOOK(id),
            reason
        });
    }
    /**
     * Delete a webhook message.
     *
     * @param {String} id - The id of the webhook.
     * @param {String} token - The token of the webhook.
     * @param {String} messageID - The id of the message.
     * @param {Object} [options]
     * @param {String} [options.threadID] - The id of the thread the message is in.
     * @returns {Promise<void>}
     */
    async deleteMessage(id, token, messageID, options) {
        const query = new URLSearchParams();
        if (options?.threadID)
            query.set("thread_id", options.threadID);
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.WEBHOOK_MESSAGE(id, token, messageID)
        });
    }
    /**
     * Delete a webhook via its token.
     *
     * @param {String} id - The id of the webhook.
     * @param {String} token - The token of the webhook.
     * @returns {Promise<void>}
     */
    async deleteToken(id, token) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.WEBHOOK(id, token)
        });
    }
    /**
     * Edit a webhook.
     *
     * @param {String} id - The id of the webhook.
     * @param {Object} options
     * @param {?(String | Buffer)} [options.avatar] - The new avatar (buffer, or full data url). `null` to remove the current avatar.
     * @param {String} [options.channelID] - The id of the channel to move this webhook to.
     * @param {String} [options.name] - The name of the webhook.
     * @param {String} [options.reason] - The reason for editing this webhook.
     * @returns {Promise<Webhook>}
     */
    async edit(id, options) {
        const reason = options.reason;
        if (options.reason)
            delete options.reason;
        if (options.avatar)
            options.avatar = this._manager._convertImage(options.avatar, "avatar");
        return this._manager.authRequest({
            method: "PATCH",
            path: Routes.WEBHOOK(id),
            json: {
                avatar: options.avatar,
                channel_id: options.channelID,
                name: options.name
            },
            reason
        }).then(data => new Webhook_1.default(data, this._client));
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
     * @param {Object[]} [options.components] - An array of [components](https://discord.com/developers/docs/interactions/message-components) to send.
     * @param {String} [options.content] - The content of the message.
     * @param {Object[]} [options.embeds] - An array of [embeds](https://discord.com/developers/docs/resources/channel#embed-object) to send.
     * @param {File[]} [options.files] - The files to send.
     * @param {String} [options.threadID] - The id of the thread to send the message to.
     * @returns {Promise<Message<T>>}
     */
    async editMessage(id, token, messageID, options) {
        const files = options.files;
        if (options.files)
            delete options.files;
        const query = new URLSearchParams();
        if (options.threadID)
            query.set("thread_id", options.threadID);
        return this._manager.authRequest({
            method: "PATCH",
            path: Routes.WEBHOOK_MESSAGE(id, token, messageID),
            json: {
                allowed_mentions: this._client._formatAllowedMentions(options.allowedMentions),
                attachments: options.attachments,
                components: options.components,
                content: options.content,
                embeds: options.embeds
            },
            query,
            files
        }).then(data => new Message_1.default(data, this._client));
    }
    /**
     * Edit a webhook via its token.
     *
     * @param {String} id - The id of the webhook.
     * @param {Object} options
     * @param {?(String | Buffer)} [options.avatar] - The new avatar (buffer, or full data url). `null` to remove the current avatar.
     * @param {String} [options.name] - The name of the webhook.
     * @returns {Promise<Webhook>}
     */
    async editToken(id, token, options) {
        if (options.avatar)
            options.avatar = this._manager._convertImage(options.avatar, "avatar");
        return this._manager.authRequest({
            method: "PATCH",
            path: Routes.WEBHOOK(id, token),
            json: {
                avatar: options.avatar,
                name: options.name
            }
        }).then(data => new Webhook_1.default(data, this._client));
    }
    async execute(id, token, options) {
        const files = options.files;
        if (options.files)
            delete options.files;
        const query = new URLSearchParams();
        if (options.wait)
            query.set("wait", "true");
        if (options.threadID)
            query.set("thread_id", options.threadID);
        return this._manager.authRequest({
            method: "POST",
            path: Routes.WEBHOOK(id, token),
            query,
            json: {
                allowed_mentions: this._client._formatAllowedMentions(options.allowedMentions),
                attachments: options.attachments,
                avatar_url: options.avatarURL,
                components: options.components,
                content: options.content,
                embeds: options.embeds,
                flags: options.flags,
                thread_name: options.threadName,
                tts: options.tts,
                username: options.username
            },
            files
        }).then(res => {
            if (options.wait && res !== null)
                return new Message_1.default(res, this._client);
        });
    }
    async executeGithub(id, token, options) {
        const query = new URLSearchParams();
        if (options.wait)
            query.set("wait", "true");
        return this._manager.authRequest({
            method: "POST",
            path: Routes.WEBHOOK_PLATFORM(id, token, "github"),
            query,
            json: options
        }).then(res => {
            if (options.wait && res !== null)
                return new Message_1.default(res, this._client);
        });
    }
    async executeSlack(id, token, options) {
        const query = new URLSearchParams();
        if (options.wait)
            query.set("wait", "true");
        return this._manager.authRequest({
            method: "POST",
            path: Routes.WEBHOOK_PLATFORM(id, token, "slack"),
            query,
            json: options
        }).then(res => {
            if (options.wait && res !== null)
                return new Message_1.default(res, this._client);
        });
    }
    /**
     * Get a webhook by id (and optionally token).
     *
     * @param {String} id - The id of the webhook.
     * @param {String} [token] - The token of the webhook.
     * @returns {Promise<Webhook>}
     */
    async get(id, token) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.WEBHOOK(id, token)
        }).then(data => new Webhook_1.default(data, this._client));
    }
    /**
     * Get the webhooks in the specified channel.
     *
     * @param {String} channelID - The id of the channel to get the webhooks of.
     * @returns {Promise<Array<Webhook>>}
     */
    async getChannel(channelID) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.CHANNEL_WEBHOOKS(channelID)
        });
    }
    /**
     * Get the webhooks in the specified guild.
     *
     * @param {String} guildID - The id of the guild to get the webhooks of.
     * @returns {Promise<Array<Webhook>>}
     */
    async getGuild(guildID) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_WEBHOOKS(guildID)
        });
    }
    /**
     * Get a webhook message.
     *
     * @template {AnyGuildTextChannel} T
     * @param {String} id - The ID of the webhook.
     * @param {String} token - The token of the webhook.
     * @param {String} messageID - The ID of the message.
     * @param {String} [threadID] - The ID of the thread the message is in.
     * @returns {Promise<Message<T>>}
     */
    async getMessage(id, token, messageID, threadID) {
        const query = new URLSearchParams();
        if (threadID)
            query.set("thread_id", threadID);
        return this._manager.authRequest({
            method: "GET",
            path: Routes.WEBHOOK_MESSAGE(id, token, messageID)
        }).then(data => new Message_1.default(data, this._client));
    }
}
exports.default = Webhooks;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV2ViaG9va3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvcm91dGVzL1dlYmhvb2tzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw0REFBb0M7QUFZcEMsdURBQXlDO0FBQ3pDLG9FQUE0QztBQUM1QyxvRUFBNEM7QUFHNUMsTUFBcUIsUUFBUyxTQUFRLG1CQUFTO0lBQzlDOzs7Ozs7Ozs7T0FTRztJQUNILEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBaUIsRUFBRSxPQUE2QjtRQUM1RCxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO1FBQzlCLElBQUksT0FBTyxDQUFDLE1BQU07WUFBRSxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFDMUMsSUFBSSxPQUFPLENBQUMsTUFBTTtZQUFFLE9BQU8sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUMzRixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFhO1lBQzVDLE1BQU0sRUFBRSxNQUFNO1lBQ2QsSUFBSSxFQUFJLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUM7WUFDMUMsSUFBSSxFQUFJO2dCQUNQLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTTtnQkFDdEIsSUFBSSxFQUFJLE9BQU8sQ0FBQyxJQUFJO2FBQ3BCO1lBQ0QsTUFBTTtTQUNOLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLGlCQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQVUsRUFBRSxNQUFlO1FBQ3ZDLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FB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