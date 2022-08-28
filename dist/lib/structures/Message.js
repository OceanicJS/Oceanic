"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = __importDefault(require("./Base"));
const Attachment_1 = __importDefault(require("./Attachment"));
const User_1 = __importDefault(require("./User"));
const GuildChannel_1 = __importDefault(require("./GuildChannel"));
const Guild_1 = __importDefault(require("./Guild"));
const PartialApplication_1 = __importDefault(require("./PartialApplication"));
const Channel_1 = __importDefault(require("./Channel"));
const Collection_1 = __importDefault(require("../util/Collection"));
class Message extends Base_1.default {
    /** The [activity](https://discord.com/developers/docs/resources/channel#message-object-message-activity-structure) associated with this message. */
    activity;
    /**
     * This can be present in two scenarios:
     * * If the message was from an interaction or application owned webhook (`ClientApplication` if client, only `id` otherwise).
     * * If the message has a rich presence embed (`PartialApplication`)
     */
    application;
    /** The attachments on this message. */
    attachments;
    /** The author of this message. */
    author;
    /** The channel this message was created in. This can be a partial object with only an `id` property. */
    channel;
    /** The components on this message. */
    components;
    /** The content of this message. */
    content;
    /** The timestamp at which this message was last edited. */
    editedTimestamp;
    /** The embeds on this message. */
    embeds;
    /** The [flags](https://discord.com/developers/docs/resources/channel#message-object-message-flags) on this message. */
    flags;
    /** The ID of the guild this message is in. */
    guildID;
    /** The interaction info, if this message was the result of an interaction. */
    interaction;
    member;
    /** Channels mentioned in a `CROSSPOSTED` channel follower message. See [Discord's docs](https://discord.com/developers/docs/resources/channel#channel-mention-object) for more information. */
    mentionChannels;
    /** The mentions in this message. */
    mentions;
    /** If this message is a `REPLY` or `THREAD_STARTER_MESSAGE`, some info about the referenced message. */
    messageReference;
    /** A nonce for ensuring a message was sent. */
    nonce;
    /** If this message is pinned. */
    pinned;
    /** This message's relative position, if in a thread. */
    position;
    /** The reactions on this message. */
    reactions;
    /** If this message is a `REPLY` or `THREAD_STARTER_MESSAGE`, */
    referencedMessage;
    // stickers exists, but is deprecated
    /** The sticker items on this message. */
    stickerItems;
    /** The thread associated with this message, if any. */
    thread;
    /** The timestamp at which this message was sent. */
    timestamp;
    /** If this message was read aloud. */
    tts;
    /** The [type](https://discord.com/developers/docs/resources/channel#message-object-message-types) of this message. */
    type;
    /** The webhook associated with this message, if sent via a webhook. This only has an `id` property. */
    webhook;
    constructor(data, client) {
        super(data.id, client);
        this.attachments = new Collection_1.default(Attachment_1.default, client);
        this.channel = (this._client.getChannel(data.channel_id) || {
            id: data.channel_id
        });
        this.guildID = data.guild_id;
        this.mentions = {
            channels: [],
            everyone: false,
            members: [],
            roles: [],
            users: []
        };
        this.reactions = {};
        this.timestamp = new Date(data.timestamp);
        this.tts = data.tts;
        this.type = data.type;
        this.webhook = data.webhook_id === undefined ? undefined : { id: data.webhook_id };
        this.update(data);
        if (data.author.discriminator !== "0000")
            this.author = this._client.users.update(data.author);
        else
            this.author = new User_1.default(data.author, this._client);
        if (data.application !== undefined)
            this.application = new PartialApplication_1.default(data.application, this._client);
        else if (data.application_id !== undefined)
            this.application = { id: data.application_id };
        if (data.attachments) {
            for (const attachment of data.attachments)
                this.attachments.update(attachment);
        }
        if (data.member)
            this.member = "guild" in this.channel && this.channel.guild instanceof Guild_1.default ? this.channel.guild.members.update({ ...data.member, user: data.author, id: data.author.id }, this.channel.guild.id) : undefined;
    }
    update(data) {
        if (data.mention_everyone !== undefined)
            this.mentions.everyone = data.mention_everyone;
        if (data.mention_roles !== undefined)
            this.mentions.roles = data.mention_roles;
        if (data.mentions !== undefined) {
            const members = [];
            this.mentions.users = data.mentions.map(user => {
                if (user.member && "guild" in this.channel && this.channel.guild instanceof Guild_1.default)
                    members.push(this.channel.guild.members.update({ ...user.member, user, id: user.id }, this.channel.guild.id));
                return this._client.users.update(user);
            });
            this.mentions.members = members;
        }
        if (data.activity !== undefined)
            this.activity = data.activity;
        if (data.attachments !== undefined) {
            for (const id of this.attachments.keys()) {
                if (!data.attachments.some(attachment => attachment.id === id))
                    this.attachments.delete(id);
            }
            for (const attachment of data.attachments)
                this.attachments.update(attachment);
        }
        if (data.components !== undefined)
            this.components = data.components;
        if (data.content !== undefined) {
            this.content = data.content;
            this.mentions.channels = (data.content.match(/<#[\d]{17,21}>/g) || []).map(mention => mention.slice(2, -1));
        }
        if (data.edited_timestamp !== undefined)
            this.editedTimestamp = data.edited_timestamp ? new Date(data.edited_timestamp) : null;
        if (data.embeds !== undefined)
            this.embeds = data.embeds;
        if (data.flags !== undefined)
            this.flags = data.flags;
        if (data.interaction !== undefined) {
            let member;
            if (data.interaction.member)
                member = {
                    ...data.interaction.member,
                    id: data.interaction.user.id
                };
            this.interaction = {
                id: data.interaction.id,
                member: this.channel instanceof GuildChannel_1.default && this.channel.guild instanceof Guild_1.default && member ? this.channel.guild.members.update(member, this.channel.guild.id) : undefined,
                name: data.interaction.name,
                type: data.interaction.type,
                user: this._client.users.update(data.interaction.user)
            };
        }
        if (data.message_reference) {
            this.messageReference = {
                channelID: data.message_reference.channel_id,
                failIfNotExists: data.message_reference.fail_if_not_exists,
                guildID: data.message_reference.guild_id,
                messageID: data.message_reference.message_id
            };
        }
        if (data.nonce !== undefined)
            this.nonce = data.nonce;
        if (data.pinned !== undefined)
            this.pinned = data.pinned;
        if (data.position !== undefined)
            this.position = data.position;
        if (data.reactions) {
            data.reactions.forEach(reaction => {
                const name = reaction.emoji.id ? `${reaction.emoji.name}:${reaction.emoji.id}` : reaction.emoji.name;
                this.reactions[name] = {
                    count: reaction.count,
                    me: reaction.me
                };
            });
        }
        if (data.referenced_message !== undefined) {
            if (data.referenced_message === null)
                this.referencedMessage = null;
            else {
                if ("messages" in this.channel)
                    this.referencedMessage = this.channel.messages.update(data.referenced_message);
                else
                    this.referencedMessage = new Message(data.referenced_message, this._client);
            }
        }
        if (data.sticker_items !== undefined)
            this.stickerItems = data.sticker_items;
        if (data.thread !== undefined) {
            if ("threads" in this.channel)
                this.thread = this.channel.threads.add(Channel_1.default.from(data.thread, this._client));
            else
                this.thread = Channel_1.default.from(data.thread, this._client);
        }
    }
    /**
     * Add a reaction to this message.
     *
     * @param {String} emoji - The reaction to add to the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @returns {Promise<void>}
     */
    async createReaction(emoji) {
        return this._client.rest.channels.createReaction(this.channel.id, this.id, emoji);
    }
    /**
     * Crosspost this message in a announcement channel.
     *
     * @returns {Promise<Message<AnnouncementChannel>>}
     */
    async crosspost() {
        return this._client.rest.channels.crosspostMessage(this.channel.id, this.id);
    }
    /**
     * Delete this message.
     *
     * @param {String} [reason] - The reason for deleting the message.
     * @returns {Promise<void>}
     */
    async deleteMessage(reason) {
        return this._client.rest.channels.deleteMessage(this.channel.id, this.id, reason);
    }
    /**
     * Remove a reaction from this message.
     *
     * @param {String} emoji - The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param {String} [user="@me"] - The user to remove the reaction from, `@me` for the current user (default).
     * @returns {Promise<void>}
     */
    async deleteReaction(emoji, user = "@me") {
        return this._client.rest.channels.deleteReaction(this.channel.id, this.id, emoji, user);
    }
    /**
     * Remove all, or a specific emoji's reactions from this message.
     *
     * @param {String} [emoji] - The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis. Omit to remove all reactions.
     * @returns {Promise<void>}
     */
    async deleteReactions(emoji) {
        return this._client.rest.channels.deleteReactions(this.channel.id, this.id, emoji);
    }
    /**
     * Delete this message as a webhook.
     *
     * @param {String} token - The token of the webhook.
     * @param {Object} [options]
     * @param {String} [options.threadID] - The id of the thread the message is in.
     * @returns {Promise<void>}
     */
    async deleteWebhook(token, options) {
        if (!this.webhook?.id)
            throw new Error("This message is not a webhook message.");
        return this._client.rest.webhooks.deleteMessage(this.webhook.id, token, this.id, options);
    }
    /**
     * Edit this message.
     *
     * @template {AnyTextChannel} T
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
     * @returns {Promise<Message<T>>}
     */
    async edit(options) {
        return this._client.rest.channels.editMessage(this.channel.id, this.id, options);
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
     * @param {File[]} [options.files] - The files to send.
     * @param {String} [options.threadID] - The id of the thread to send the message to.
     * @returns {Promise<Message>}
     */
    async editWebhook(token, options) {
        if (!this.webhook?.id)
            throw new Error("This message is not a webhook message.");
        return this._client.rest.webhooks.editMessage(this.webhook.id, token, this.id, options);
    }
    /**
     * Get the users who reacted with a specific emoji on this message.
     *
     * @param {String} emoji - The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param {Object} [options] - Options for the request.
     * @param {String} [options.after] - Get users after this user id.
     * @param {Number} [options.limit] - The maximum amount of users to get.
     * @returns {Promise<User[]>}
     */
    async getReactions(emoji, options) {
        return this._client.rest.channels.getReactions(this.channel.id, this.id, emoji, options);
    }
    /**
     * Pin this message.
     *
     * @param {String} [reason] - The reason for pinning the message.
     * @returns {Promise<void>}
     */
    async pin(reason) {
        return this._client.rest.channels.pinMessage(this.channel.id, this.id, reason);
    }
    /**
     * Create a thread from this message.
     *
     * @template {(AnnouncementThreadChannel | PublicThreadChannel)} T
     * @param {Object} options
     * @param {ThreadAutoArchiveDuration} [options.autoArchiveDuration] - The duration of no activity after which this thread will be automatically archived.
     * @param {String} options.name - The name of the thread.
     * @param {Number?} [options.rateLimitPerUser] - The amount of seconds a user has to wait before sending another message.
     * @param {String} [options.reason] - The reason for creating the thread.
     * @returns {Promise<T>}
     */
    async startThread(options) {
        return this._client.rest.channels.startThreadFromMessage(this.channel.id, this.id, options);
    }
    toJSON() {
        return {
            ...super.toJSON(),
            activity: this.activity,
            application: this.application instanceof PartialApplication_1.default ? this.application.toJSON() : this.application?.id,
            attachments: this.attachments.map(attachment => attachment.toJSON()),
            author: this.author.toJSON(),
            channel: this.channel.id,
            components: this.components,
            content: this.content,
            editedTimestamp: this.editedTimestamp?.getTime() || null,
            embeds: this.embeds,
            flags: this.flags,
            guild: this.guildID,
            interaction: !this.interaction ? undefined : {
                id: this.interaction.id,
                member: this.interaction.member?.toJSON(),
                name: this.interaction.name,
                type: this.interaction.type,
                user: this.interaction.user.toJSON()
            },
            mentionChannels: this.mentionChannels,
            mentions: {
                channels: this.mentions.channels,
                everyone: this.mentions.everyone,
                members: this.mentions.members.map(member => member.toJSON()),
                roles: this.mentions.roles,
                users: this.mentions.users.map(user => user.toJSON())
            },
            messageReference: this.messageReference,
            nonce: this.nonce,
            pinned: this.pinned,
            position: this.position,
            reactions: this.reactions,
            referencedMessage: this.referencedMessage?.toJSON(),
            stickerItems: this.stickerItems,
            thread: this.thread?.toJSON(),
            timestamp: this.timestamp.getTime(),
            tts: this.tts,
            type: this.type,
            webhook: this.webhook?.id
        };
    }
    /**
     * Unpin this message.
     *
     * @param {String} [reason] - The reason for unpinning the message.
     * @returns {Promise<void>}
     */
    async unpin(reason) {
        return this._client.rest.channels.unpinMessage(this.channel.id, this.id, reason);
    }
}
exports.default = Message;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVzc2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9zdHJ1Y3R1cmVzL01lc3NhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBMEI7QUFDMUIsOERBQXNDO0FBQ3RDLGtEQUEwQjtBQUMxQixrRUFBMEM7QUFDMUMsb0RBQTRCO0FBRTVCLDhFQUFzRDtBQU10RCx3REFBZ0M7QUFFaEMsb0VBQTRDO0FBeUI1QyxNQUFxQixPQUF5RSxTQUFRLGNBQUk7SUFDekcsb0pBQW9KO0lBQ3BKLFFBQVEsQ0FBbUI7SUFDM0I7Ozs7T0FJRztJQUNILFdBQVcsQ0FBcUQ7SUFDaEUsdUNBQXVDO0lBQ3ZDLFdBQVcsQ0FBZ0Q7SUFDM0Qsa0NBQWtDO0lBQ2xDLE1BQU0sQ0FBTztJQUNiLHdHQUF3RztJQUN4RyxPQUFPLENBQUk7SUFDWCxzQ0FBc0M7SUFDdEMsVUFBVSxDQUEyQjtJQUNyQyxtQ0FBbUM7SUFDbkMsT0FBTyxDQUFTO0lBQ2hCLDJEQUEyRDtJQUMzRCxlQUFlLENBQWM7SUFDN0Isa0NBQWtDO0lBQ2xDLE1BQU0sQ0FBZTtJQUNyQix1SEFBdUg7SUFDdkgsS0FBSyxDQUFVO0lBQ2YsOENBQThDO0lBQzlDLE9BQU8sQ0FBVTtJQUNqQiw4RUFBOEU7SUFDOUUsV0FBVyxDQUFzQjtJQUNqQyxNQUFNLENBQVU7SUFDaEIsK0xBQStMO0lBQy9MLGVBQWUsQ0FBeUI7SUFDeEMsb0NBQW9DO0lBQ3BDLFFBQVEsQ0FXTjtJQUNGLHdHQUF3RztJQUN4RyxnQkFBZ0IsQ0FBb0I7SUFDcEMsK0NBQStDO0lBQy9DLEtBQUssQ0FBbUI7SUFDeEIsaUNBQWlDO0lBQ2pDLE1BQU0sQ0FBVTtJQUNoQix3REFBd0Q7SUFDeEQsUUFBUSxDQUFVO0lBQ2xCLHFDQUFxQztJQUNyQyxTQUFTLENBQWtDO0lBQzNDLGdFQUFnRTtJQUNoRSxpQkFBaUIsQ0FBa0I7SUFDbkMscUNBQXFDO0lBQ3JDLHlDQUF5QztJQUN6QyxZQUFZ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