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
const Routes = __importStar(require("../util/Routes"));
const Webhook_1 = __importDefault(require("../structures/Webhook"));
const Message_1 = __importDefault(require("../structures/Message"));
class Webhooks {
    #manager;
    constructor(manager) {
        this.#manager = manager;
    }
    /**
     * Creat a channel webhook.
     * @param channelID The ID of the channel to create the webhook in.
     * @param options The options to create the webhook with.
     */
    async create(channelID, options) {
        const reason = options.reason;
        if (options.reason)
            delete options.reason;
        if (options.avatar)
            options.avatar = this.#manager.client.util._convertImage(options.avatar, "avatar");
        return this.#manager.authRequest({
            method: "POST",
            path: Routes.CHANNEL_WEBHOOKS(channelID),
            json: {
                avatar: options.avatar,
                name: options.name
            },
            reason
        }).then(data => new Webhook_1.default(data, this.#manager.client));
    }
    /**
     * Delete a webhook.
     * @param id The ID of the webhook.
     * @param reason The reason for deleting the webhook.
     */
    async delete(id, reason) {
        await this.#manager.authRequest({
            method: "DELETE",
            path: Routes.WEBHOOK(id),
            reason
        });
    }
    /**
     * Delete a webhook message.
     * @param id The ID of the webhook.
     * @param token The token of the webhook.
     * @param messageID The ID of the message.
     * @param options The options for deleting the message.
     */
    async deleteMessage(id, token, messageID, options) {
        const query = new URLSearchParams();
        if (options?.threadID)
            query.set("thread_id", options.threadID);
        await this.#manager.authRequest({
            method: "DELETE",
            path: Routes.WEBHOOK_MESSAGE(id, token, messageID)
        });
    }
    /**
     * Delete a webhook via its token.
     * @param id The ID of the webhook.
     * @param token The token of the webhook.
     */
    async deleteToken(id, token) {
        await this.#manager.authRequest({
            method: "DELETE",
            path: Routes.WEBHOOK(id, token)
        });
    }
    /**
     * Edit a webhook.
     * @param id The ID of the webhook.
     * @param options The options tofor editing the webhook.
     */
    async edit(id, options) {
        const reason = options.reason;
        if (options.reason)
            delete options.reason;
        if (options.avatar)
            options.avatar = this.#manager.client.util._convertImage(options.avatar, "avatar");
        return this.#manager.authRequest({
            method: "PATCH",
            path: Routes.WEBHOOK(id),
            json: {
                avatar: options.avatar,
                channel_id: options.channelID,
                name: options.name
            },
            reason
        }).then(data => new Webhook_1.default(data, this.#manager.client));
    }
    /**
     * Edit a webhook message.
     * @param id The ID of the webhook.
     * @param token The token of the webhook.
     * @param messageID The ID of the message to edit.
     * @param options The options for editing the message.
     */
    async editMessage(id, token, messageID, options) {
        const files = options.files;
        if (options.files)
            delete options.files;
        const query = new URLSearchParams();
        if (options.threadID)
            query.set("thread_id", options.threadID);
        return this.#manager.authRequest({
            method: "PATCH",
            path: Routes.WEBHOOK_MESSAGE(id, token, messageID),
            json: {
                allowed_mentions: this.#manager.client.util.formatAllowedMentions(options.allowedMentions),
                attachments: options.attachments,
                components: options.components ? this.#manager.client.util.componentsToRaw(options.components) : [],
                content: options.content,
                embeds: options.embeds
            },
            query,
            files
        }).then(data => new Message_1.default(data, this.#manager.client));
    }
    /**
     * Edit a webhook via its token.
     * @param id The ID of the webhook.
     * @param options The options for editing the webhook.
     */
    async editToken(id, token, options) {
        if (options.avatar)
            options.avatar = this.#manager.client.util._convertImage(options.avatar, "avatar");
        return this.#manager.authRequest({
            method: "PATCH",
            path: Routes.WEBHOOK(id, token),
            json: {
                avatar: options.avatar,
                name: options.name
            }
        }).then(data => new Webhook_1.default(data, this.#manager.client));
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
        return this.#manager.authRequest({
            method: "POST",
            path: Routes.WEBHOOK(id, token),
            query,
            json: {
                allowed_mentions: this.#manager.client.util.formatAllowedMentions(options.allowedMentions),
                attachments: options.attachments,
                avatar_url: options.avatarURL,
                components: options.components ? this.#manager.client.util.componentsToRaw(options.components) : [],
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
                return new Message_1.default(res, this.#manager.client);
        });
    }
    async executeGithub(id, token, options) {
        const query = new URLSearchParams();
        if (options.wait)
            query.set("wait", "true");
        return this.#manager.authRequest({
            method: "POST",
            path: Routes.WEBHOOK_PLATFORM(id, token, "github"),
            query,
            json: options
        }).then(res => {
            if (options.wait && res !== null)
                return new Message_1.default(res, this.#manager.client);
        });
    }
    async executeSlack(id, token, options) {
        const query = new URLSearchParams();
        if (options.wait)
            query.set("wait", "true");
        return this.#manager.authRequest({
            method: "POST",
            path: Routes.WEBHOOK_PLATFORM(id, token, "slack"),
            query,
            json: options
        }).then(res => {
            if (options.wait && res !== null)
                return new Message_1.default(res, this.#manager.client);
        });
    }
    /**
     * Get a webhook by ID (and optionally token).
     * @param id The ID of the webhook.
     * @param token The token of the webhook.
     */
    async get(id, token) {
        return this.#manager.authRequest({
            method: "GET",
            path: Routes.WEBHOOK(id, token)
        }).then(data => new Webhook_1.default(data, this.#manager.client));
    }
    /**
     * Get the webhooks in the specified channel.
     * @param channelID The ID of the channel to get the webhooks of.
     */
    async getChannel(channelID) {
        return this.#manager.authRequest({
            method: "GET",
            path: Routes.CHANNEL_WEBHOOKS(channelID)
        });
    }
    /**
     * Get the webhooks in the specified guild.
     * @param guildID The ID of the guild to get the webhooks of.
     */
    async getGuild(guildID) {
        return this.#manager.authRequest({
            method: "GET",
            path: Routes.GUILD_WEBHOOKS(guildID)
        });
    }
    /**
     * Get a webhook message.
     * @param id The ID of the webhook.
     * @param token The token of the webhook.
     * @param messageID The ID of the message.
     * @param threadID The ID of the thread the message is in.
     */
    async getMessage(id, token, messageID, threadID) {
        const query = new URLSearchParams();
        if (threadID)
            query.set("thread_id", threadID);
        return this.#manager.authRequest({
            method: "GET",
            path: Routes.WEBHOOK_MESSAGE(id, token, messageID)
        }).then(data => new Message_1.default(data, this.#manager.client));
    }
}
exports.default = Webhooks;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV2ViaG9va3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvcm91dGVzL1dlYmhvb2tzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFXQSx1REFBeUM7QUFDekMsb0VBQTRDO0FBQzVDLG9FQUE0QztBQUc1QyxNQUFxQixRQUFRO0lBQ3pCLFFBQVEsQ0FBYztJQUN0QixZQUFZLE9BQW9CO1FBQzVCLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO0lBQzVCLENBQUM7SUFDRDs7OztPQUlHO0lBQ0gsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFpQixFQUFFLE9BQTZCO1FBQ3pELE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFDOUIsSUFBSSxPQUFPLENBQUMsTUFBTTtZQUFFLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUMxQyxJQUFJLE9BQU8sQ0FBQyxNQUFNO1lBQUUsT0FBTyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDdkcsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBYTtZQUN6QyxNQUFNLEVBQUUsTUFBTTtZQUNkLElBQUksRUFBSSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDO1lBQzFDLElBQUksRUFBSTtnQkFDSixNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU07Z0JBQ3RCLElBQUksRUFBSSxPQUFPLENBQUMsSUFBSTthQUN2QjtZQUNELE1BQU07U0FDVCxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxpQkFBTyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVE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