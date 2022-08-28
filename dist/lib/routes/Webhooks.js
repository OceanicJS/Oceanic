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
            options.avatar = this._client.util._convertImage(options.avatar, "avatar");
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
            options.avatar = this._client.util._convertImage(options.avatar, "avatar");
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
                allowed_mentions: this._client.util.formatAllowedMentions(options.allowedMentions),
                attachments: options.attachments,
                components: options.components ? this._client.util.componentsToRaw(options.components) : [],
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
            options.avatar = this._client.util._convertImage(options.avatar, "avatar");
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
                allowed_mentions: this._client.util.formatAllowedMentions(options.allowedMentions),
                attachments: options.attachments,
                avatar_url: options.avatarURL,
                components: options.components ? this._client.util.componentsToRaw(options.components) : [],
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV2ViaG9va3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvcm91dGVzL1dlYmhvb2tzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw0REFBb0M7QUFZcEMsdURBQXlDO0FBQ3pDLG9FQUE0QztBQUM1QyxvRUFBNEM7QUFHNUMsTUFBcUIsUUFBUyxTQUFRLG1CQUFTO0lBQzNDOzs7Ozs7Ozs7T0FTRztJQUNILEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBaUIsRUFBRSxPQUE2QjtRQUN6RCxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO1FBQzlCLElBQUksT0FBTyxDQUFDLE1BQU07WUFBRSxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFDMUMsSUFBSSxPQUFPLENBQUMsTUFBTTtZQUFFLE9BQU8sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDL0YsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBYTtZQUN6QyxNQUFNLEVBQUUsTUFBTTtZQUNkLElBQUksRUFBSSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDO1lBQzFDLElBQUksRUFBSTtnQkFDSixNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU07Z0JBQ3RCLElBQUksRUFBSSxPQUFPLENBQUMsSUFBSTthQUN2QjtZQUNELE1BQU07U0FDVCxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxpQkFBTyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFVLEVBQUUsTUFBZTtRQUNwQyxNQUFNLElBQUksQ0FB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