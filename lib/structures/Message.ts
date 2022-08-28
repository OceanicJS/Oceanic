import Base from "./Base";
import Attachment from "./Attachment";
import User from "./User";
import GuildChannel from "./GuildChannel";
import Guild from "./Guild";
import type Member from "./Member";
import PartialApplication from "./PartialApplication";
import type ClientApplication from "./ClientApplication";
import type AnnouncementChannel from "./AnnouncementChannel";
import type AnnouncementThreadChannel from "./AnnouncementThreadChannel";
import type PublicThreadChannel from "./PublicThreadChannel";
import type TextChannel from "./TextChannel";
import Channel from "./Channel";
import type Client from "../Client";
import Collection from "../util/Collection";
import type { MessageTypes, ThreadAutoArchiveDuration } from "../Constants";
import type { Uncached } from "../types/shared";
import type {
    AnyGuildTextChannel,
    AnyTextChannel,
    ChannelMention,
    EditMessageOptions,
    Embed,
    GetReactionsOptions,
    MessageActionRow,
    MessageActivity,
    MessageInteraction,
    MessageReference,
    RawAttachment,
    RawMessage,
    StartThreadFromMessageOptions,
    StickerItem,
    MessageReaction
} from "../types/channels";
import type { RawMember } from "../types/guilds";
import type { DeleteWebhookMessageOptions, EditWebhookMessageOptions } from "../types/webhooks";
import { File } from "../types/request-handler";
import type { JSONMessage } from "../types/json";

export default class Message<T extends AnyTextChannel = AnyTextChannel> extends Base {
    /** The [activity](https://discord.com/developers/docs/resources/channel#message-object-message-activity-structure) associated with this message. */
    activity?: MessageActivity;
    /**
     * This can be present in two scenarios:
     * * If the message was from an interaction or application owned webhook (`ClientApplication` if client, only `id` otherwise).
     * * If the message has a rich presence embed (`PartialApplication`)
     */
    application?: PartialApplication | ClientApplication | Uncached;
    /** The attachments on this message. */
    attachments: Collection<string, RawAttachment, Attachment>;
    /** The author of this message. */
    author: User;
    /** The channel this message was created in. This can be a partial object with only an `id` property. */
    channel: T | Uncached;
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
    member?: Member;
    /** Channels mentioned in a `CROSSPOSTED` channel follower message. See [Discord's docs](https://discord.com/developers/docs/resources/channel#channel-mention-object) for more information. */
    mentionChannels?: Array<ChannelMention>;
    /** The mentions in this message. */
    mentions: {
        /** The ids of the channels mentioned in this message. */
        channels: Array<string>;
        /** If @everyone/@here is mentioned in this message. */
        everyone: boolean;
        /** The members mentioned in this message. */
        members: Array<Member>;
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
    reactions: Record<string, MessageReaction>;
    /** If this message is a `REPLY` or `THREAD_STARTER_MESSAGE`, */
    referencedMessage?: Message | null;
    // stickers exists, but is deprecated
    /** The sticker items on this message. */
    stickerItems?: Array<StickerItem>;
    /** The thread associated with this message, if any. */
    thread?: AnnouncementThreadChannel | PublicThreadChannel;
    /** The timestamp at which this message was sent. */
    timestamp: Date;
    /** If this message was read aloud. */
    tts: boolean;
    /** The [type](https://discord.com/developers/docs/resources/channel#message-object-message-types) of this message. */
    type: MessageTypes;
    /** The webhook associated with this message, if sent via a webhook. This only has an `id` property. */
    webhook?: Uncached;
    constructor(data: RawMessage, client: Client) {
        super(data.id, client);
        this.attachments = new Collection(Attachment, client);
        this.channel = this._client.getChannel<AnyGuildTextChannel>(data.channel_id) || {
            id: data.channel_id
        };
        this.mentions = {
            channels: [],
            everyone: false,
            members:  [],
            roles:    [],
            users:    []
        };
        this.reactions = {};
        this.timestamp = new Date(data.timestamp);
        this.tts = data.tts;
        this.type = data.type;
        this.webhook = data.webhook_id === undefined ? undefined : { id: data.webhook_id };
        this.update(data);
        if (data.author.discriminator !== "0000") this.author = this._client.users.update(data.author);
        else this.author = new User(data.author, this._client);
        if (data.application !== undefined) this.application = new PartialApplication(data.application, this._client);
        else if (data.application_id !== undefined) this.application = { id: data.application_id };
        if (data.attachments) {
            for (const attachment of data.attachments) this.attachments.update(attachment);
        }
        if (data.member) this.member = "guild" in this.channel && this.channel.guild instanceof Guild ? this.channel.guild.members.update({ ...data.member, id: data.member.user!.id }, this.channel.guild.id) : undefined;
    }

    protected update(data: Partial<RawMessage>) {
        if (data.mention_everyone !== undefined) this.mentions.everyone = data.mention_everyone;
        if (data.mention_roles !== undefined) this.mentions.roles = data.mention_roles;
        if (data.mentions !== undefined) {
            const members: Array<Member> = [];
            this.mentions.users = data.mentions.map(user => {
                if (user.member && "guild" in this.channel && this.channel.guild instanceof Guild) members.push(this.channel.guild.members.update({ ...user.member, id: user.id }, this.channel.guild.id));
                return this._client.users.update(user);
            });
            this.mentions.members = members;
        }
        if (data.activity !== undefined) this.activity = data.activity;
        if (data.attachments !== undefined) {
            for (const id of this.attachments.keys()) {
                if (!data.attachments.some(attachment => attachment.id === id)) this.attachments.delete(id);
            }
            for (const attachment of data.attachments) this.attachments.update(attachment);
        }
        if (data.components !== undefined) this.components = data.components;
        if (data.content !== undefined) {
            this.content = data.content;
            this.mentions.channels = (data.content.match(/<#[\d]{17,21}>/g) || []).map(mention => mention.slice(2, -1));
        }
        if (data.edited_timestamp !== undefined) this.editedTimestamp = data.edited_timestamp ? new Date(data.edited_timestamp) : null;
        if (data.embeds !== undefined) this.embeds = data.embeds;
        if (data.flags !== undefined) this.flags = data.flags;
        if (data.interaction !== undefined) {
            let member: RawMember & { id: string; } | undefined;
            if (data.interaction.member) member = {
                ...data.interaction.member,
                id: data.interaction.user.id
            };
            this.interaction = {
                id:     data.interaction.id,
                member: this.channel instanceof GuildChannel && this.channel.guild instanceof Guild && member ? this.channel.guild.members.update(member, this.channel.guild.id) : undefined,
                name:   data.interaction.name,
                type:   data.interaction.type,
                user:   this._client.users.update(data.interaction.user)
            };
        }
        if (data.message_reference) {
            this.messageReference = {
                channelID:       data.message_reference.channel_id,
                failIfNotExists: data.message_reference.fail_if_not_exists,
                guildID:         data.message_reference.guild_id,
                messageID:       data.message_reference.message_id
            };
        }
        if (data.nonce !== undefined) this.nonce = data.nonce;
        if (data.pinned !== undefined) this.pinned = data.pinned;
        if (data.position !== undefined) this.position = data.position;
        if (data.reactions) {
            data.reactions.forEach(reaction => {
                const name = reaction.emoji.id ? `${reaction.emoji.name}:${reaction.emoji.id}` : reaction.emoji.name;
                this.reactions[name] = {
                    count: reaction.count,
                    me:    reaction.me
                };
            });
        }
        if (data.referenced_message !== undefined) {
            if (data.referenced_message === null) this.referencedMessage = null;
            else {
                if ("messages" in this.channel) this.referencedMessage = this.channel.messages.update(data.referenced_message);
                else this.referencedMessage = new Message(data.referenced_message, this._client);
            }
        }
        if (data.sticker_items !== undefined) this.stickerItems = data.sticker_items;
        if (data.thread !== undefined) {
            if ("threads" in this.channel) this.thread = this.channel.threads.add(Channel.from<AnnouncementThreadChannel | PublicThreadChannel>(data.thread, this._client));
            else this.thread = Channel.from<AnnouncementThreadChannel | PublicThreadChannel>(data.thread, this._client);
        }
    }

    /**
     * Add a reaction to this message.
     *
     * @param {String} emoji - The reaction to add to the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @returns {Promise<void>}
     */
    async createReaction(emoji: string) {
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
    async deleteMessage(reason?: string) {
        return this._client.rest.channels.deleteMessage(this.channel.id, this.id, reason);
    }

    /**
     * Remove a reaction from this message.
     *
     * @param {String} emoji - The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param {String} [user="@me"] - The user to remove the reaction from, `@me` for the current user (default).
     * @returns {Promise<void>}
     */
    async deleteReaction(emoji: string, user = "@me") {
        return this._client.rest.channels.deleteReaction(this.channel.id, this.id, emoji, user);
    }

    /**
     * Remove all, or a specific emoji's reactions from this message.
     *
     * @param {String} [emoji] - The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis. Omit to remove all reactions.
     * @returns {Promise<void>}
     */
    async deleteReactions(emoji?: string) {
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
    async deleteWebhook(token: string, options: DeleteWebhookMessageOptions) {
        if (!this.webhook?.id) throw new Error("This message is not a webhook message.");
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
    async edit(options: EditMessageOptions) {
        return this._client.rest.channels.editMessage<T>(this.channel.id, this.id, options);
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
    async editWebhook(token: string, options: EditWebhookMessageOptions) {
        if (!this.webhook?.id) throw new Error("This message is not a webhook message.");
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
    async getReactions(emoji: string, options?: GetReactionsOptions) {
        return this._client.rest.channels.getReactions(this.channel.id, this.id, emoji, options);
    }

    /**
     * Pin this message.
     *
     * @param {String} [reason] - The reason for pinning the message.
     * @returns {Promise<void>}
     */
    async pin(reason?: string) {
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
    async startThread(options: StartThreadFromMessageOptions) {
        return this._client.rest.channels.startThreadFromMessage<T extends AnnouncementChannel ? AnnouncementThreadChannel : T extends TextChannel ? PublicThreadChannel : never>(this.channel.id, this.id, options);
    }

    override toJSON(): JSONMessage {
        return {
            ...super.toJSON(),
            activity:        this.activity,
            application:     this.application instanceof PartialApplication ? this.application.toJSON() : this.application?.id,
            attachments:     this.attachments.map(attachment => attachment.toJSON()),
            author:          this.author.toJSON(),
            channel:         this.channel.id,
            components:      this.components,
            content:         this.content,
            editedTimestamp: this.editedTimestamp?.getTime() || null,
            embeds:          this.embeds,
            flags:           this.flags,
            interaction:     !this.interaction ? undefined : {
                id:     this.interaction.id,
                member: this.interaction.member?.toJSON(),
                name:   this.interaction.name,
                type:   this.interaction.type,
                user:   this.interaction.user.toJSON()
            },
            mentionChannels: this.mentionChannels,
            mentions:        {
                channels: this.mentions.channels,
                everyone: this.mentions.everyone,
                members:  this.mentions.members.map(member => member.toJSON()),
                roles:    this.mentions.roles,
                users:    this.mentions.users.map(user => user.toJSON())
            },
            messageReference:  this.messageReference,
            nonce:             this.nonce,
            pinned:            this.pinned,
            position:          this.position,
            reactions:         this.reactions,
            referencedMessage: this.referencedMessage?.toJSON(),
            stickerItems:      this.stickerItems,
            thread:		          this.thread?.toJSON(),
            timestamp:         this.timestamp.getTime(),
            tts:               this.tts,
            type:              this.type,
            webhook:           this.webhook?.id
        };
    }

    /**
     * Unpin this message.
     *
     * @param {String} [reason] - The reason for unpinning the message.
     * @returns {Promise<void>}
     */
    async unpin(reason?: string) {
        return this._client.rest.channels.unpinMessage(this.channel.id, this.id, reason);
    }
}
