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
const Constants_1 = require("../Constants");
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
            this.components = data.components.map(row => ({
                type: row.type,
                components: row.components.map(component => {
                    if (component.type === Constants_1.ComponentTypes.BUTTON) {
                        if (component.style === Constants_1.ButtonStyles.LINK)
                            return component;
                        else
                            return {
                                customID: component.custom_id,
                                disabled: component.disabled,
                                emoji: component.emoji,
                                label: component.label,
                                style: component.style,
                                type: component.type
                            };
                    }
                    else
                        return {
                            customID: component.custom_id,
                            disabled: component.disabled,
                            maxValues: component.max_values,
                            minValues: component.min_values,
                            options: component.options,
                            placeholder: component.placeholder,
                            type: component.type
                        };
                })
            }));
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
     * @param {Object[]} [options.components] - An array of [components](https://discord.com/developers/docs/interactions/message-components) to send. Convert `snake_case` keys to `camelCase`
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
     * @param {Object[]} [options.components] - An array of [components](https://discord.com/developers/docs/interactions/message-components) to send. Convert `snake_case` keys to `camelCase`
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVzc2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9zdHJ1Y3R1cmVzL01lc3NhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBMEI7QUFDMUIsOERBQXNDO0FBQ3RDLGtEQUEwQjtBQUMxQixrRUFBMEM7QUFDMUMsb0RBQTRCO0FBRTVCLDhFQUFzRDtBQU10RCx3REFBZ0M7QUFFaEMsb0VBQTRDO0FBRTVDLDRDQUF1RjtBQXdCdkYsTUFBcUIsT0FBeUUsU0FBUSxjQUFJO0lBQ3RHLG9KQUFvSjtJQUNwSixRQUFRLENBQW1CO0lBQzNCOzs7O09BSUc7SUFDSCxXQUFXLENBQXFEO0lBQ2hFLHVDQUF1QztJQUN2QyxXQUFXLENBQWdEO0lBQzNELGtDQUFrQztJQUNsQyxNQUFNLENBQU87SUFDYix3R0FBd0c7SUFDeEcsT0FBTyxDQUFJO0lBQ1gsc0NBQXNDO0lBQ3RDLFVBQVUsQ0FBMkI7SUFDckMsbUNBQW1DO0lBQ25DLE9BQU8sQ0FBUztJQUNoQiwyREFBMkQ7SUFDM0QsZUFBZSxDQUFjO0lBQzdCLGtDQUFrQztJQUNsQyxNQUFNLENBQWU7SUFDckIsdUhBQXVIO0lBQ3ZILEtBQUssQ0FBVTtJQUNmLDhDQUE4QztJQUM5QyxPQUFPLENBQVU7SUFDakIsOEVBQThFO0lBQzlFLFdBQVcsQ0FBc0I7SUFDakMsTUFBTSxDQUFVO0lBQ2hCLCtMQUErTDtJQUMvTCxlQUFlLENBQXlCO0lBQ3hDLG9DQUFvQztJQUNwQyxRQUFRLENBV047SUFDRix3R0FBd0c7SUFDeEcsZ0JBQWdCLENBQW9CO0lBQ3BDLCtDQUErQztJQUMvQyxLQUFLLENBQW1CO0lBQ3hCLGlDQUFpQztJQUNqQyxNQUFNLENBQVU7SUFDaEIsd0RBQXdEO0lBQ3hELFFBQVEsQ0FBVTtJQUNsQixxQ0FBcUM7SUFDckMsU0FBUyxDQUFrQztJQUMzQyxnRUFBZ0U7SUFDaEUsaUJBQWlCLENBQWtCO0lBQ25DLHFDQUFxQztJQUNyQyx5Q0FB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