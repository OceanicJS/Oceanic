/** @module Routes/Channels */
import type {
    AddGroupRecipientOptions,
    AnyChannel,
    AnyTextChannel,
    ArchivedThreads,
    CreateInviteOptions,
    CreateMessageOptions,
    EditChannelOptions,
    EditMessageOptions,
    EditPermissionOptions,
    FollowedChannel,
    GetChannelMessagesOptions,
    GetArchivedThreadsOptions,
    GetReactionsOptions,
    InviteChannel,
    RawArchivedThreads,
    RawChannel,
    RawFollowedChannel,
    RawInvite,
    RawMessage,
    RawAnnouncementThreadChannel,
    RawPrivateThreadChannel,
    RawPublicThreadChannel,
    ThreadMember,
    StartThreadFromMessageOptions,
    StartThreadInForumOptions,
    StartThreadWithoutMessageOptions,
    GetInviteOptions,
    GetInviteWithCountsAndExpirationOptions,
    GetInviteWithCountsOptions,
    GetInviteWithExpirationOptions,
    GetInviteWithNoneOptions,
    RawThreadMember,
    InviteInfoTypes,
    RawPrivateChannel,
    RawGroupChannel,
    AnyEditableChannel,
    PartialInviteChannel,
    RawThreadChannel,
    PurgeOptions,
    AnyGuildTextChannel
} from "../types/channels";
import * as Routes from "../util/Routes";
import Message from "../structures/Message";
import type { CreateGroupChannelOptions, RawUser } from "../types/users";
import Invite from "../structures/Invite";
import type AnnouncementThreadChannel from "../structures/AnnouncementThreadChannel";
import type PublicThreadChannel from "../structures/PublicThreadChannel";
import type PrivateThreadChannel from "../structures/PrivateThreadChannel";
import type AnnouncementChannel from "../structures/AnnouncementChannel";
import type { VoiceRegion } from "../types/voice";
import Channel from "../structures/Channel";
import type RESTManager from "../rest/RESTManager";
import type PrivateChannel from "../structures/PrivateChannel";
import GroupChannel from "../structures/GroupChannel";
import User from "../structures/User";
import type { Uncached } from "../types/shared";

/** Various methods for interacting with channels. */
export default class Channels {
    #manager: RESTManager;
    constructor(manager: RESTManager) {
        this.#manager = manager;
    }

    /**
     * Add a user to a group channel.
     * @param groupID The ID of the group to add the user to.
     * @param options The options for adding the recipient.
     */
    async addGroupRecipient(groupID: string, options: AddGroupRecipientOptions): Promise<void> {
        await this.#manager.authRequest<null>({
            method: "PUT",
            path:   Routes.GROUP_RECIPIENT(groupID, options.userID),
            json:   {
                access_token: options.accessToken,
                nick:         options.nick
            }
        });
    }

    /**
     * Add a member to a thread.
     * @param id The ID of the thread to add them to.
     * @param userID The ID of the user to add to the thread.
     */
    async addThreadMember(id: string, userID: string): Promise<void> {
        await this.#manager.authRequest<null>({
            method: "PUT",
            path:   Routes.CHANNEL_THREAD_MEMBER(id, userID)
        });
    }
    /**
     * Create a direct message.
     * @param recipient The ID of the recipient of the direct message.
     */
    async createDM(recipient: string): Promise<PrivateChannel> {
        let cache: PrivateChannel | undefined;
        if ((cache = this.#manager.client.privateChannels.find(ch => ch.recipient.id === recipient))) {
            return cache;
        }
        return this.#manager.authRequest<RawPrivateChannel>({
            method: "POST",
            path:   Routes.OAUTH_CHANNELS,
            json:   { recipient_id: recipient }
        }
        ).then(data => this.#manager.client.privateChannels.update(data));
    }

    /**
     * Create a group dm.
     * @param options The options for creating the group dm.
     */
    async createGroupDM(options: CreateGroupChannelOptions): Promise<GroupChannel> {
        return this.#manager.authRequest<RawGroupChannel>({
            method: "POST",
            path:   Routes.OAUTH_CHANNELS,
            json:   {
                access_tokens: options.accessTokens,
                nicks:         options.nicks
            }
        }).then(data => this.#manager.client.groupChannels.update(data));
    }

    /**
     * Create an invite for a channel.
     * @param id The ID of the channel to create an invite for.
     * @param options The options for creating the invite.
     */
    async createInvite<T extends InviteInfoTypes, CH extends InviteChannel | PartialInviteChannel | Uncached = InviteChannel | PartialInviteChannel | Uncached>(id: string, options: CreateInviteOptions): Promise<Invite<T, CH>> {
        const reason = options.reason;
        if (options.reason) {
            delete options.reason;
        }
        return this.#manager.authRequest<RawInvite>({
            method: "POST",
            path:   Routes.CHANNEL_INVITES(id),
            json:   {
                max_age:               options.maxAge,
                max_uses:              options.maxUses,
                target_application_id: options.targetApplicationID,
                target_type:           options.targetType,
                target_user_id:        options.targetUserID,
                temporary:             options.temporary,
                unique:                options.unique
            },
            reason
        }).then(data => new Invite<T, CH>(data, this.#manager.client));
    }

    /**
     * Create a message in a channel.
     * @param id The ID of the channel to create the message in.
     * @param options The options for creating the message.
     */
    async createMessage<T extends AnyTextChannel | Uncached = AnyTextChannel | Uncached>(id: string, options: CreateMessageOptions): Promise<Message<T>> {
        const files = options.files;
        if (options.files) {
            delete options.files;
        }
        return this.#manager.authRequest<RawMessage>({
            method: "POST",
            path:   Routes.CHANNEL_MESSAGES(id),
            json:   {
                allowed_mentions:  this.#manager.client.util.formatAllowedMentions(options.allowedMentions),
                attachments:       options.attachments,
                components:        options.components ? this.#manager.client.util.componentsToRaw(options.components) : undefined,
                content:           options.content,
                embeds:            options.embeds ? this.#manager.client.util.embedsToRaw(options.embeds) : undefined,
                flags:             options.flags,
                sticker_ids:       options.stickerIDs,
                message_reference: !options.messageReference ? undefined : {
                    channel_id:         options.messageReference.channelID,
                    fail_if_not_exists: options.messageReference.failIfNotExists,
                    guild_id:           options.messageReference.guildID,
                    message_id:         options.messageReference.messageID
                },
                tts: options.tts
            },
            files
        }).then(data => new Message<T>(data, this.#manager.client));
    }

    /**
     * Add a reaction to a message.
     * @param id The ID of the channel the message is in.
     * @param messageID The ID of the message to add a reaction to.
     * @param emoji The reaction to add to the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     */
    async createReaction(id: string, messageID: string, emoji: string): Promise<void> {
        if (emoji === decodeURIComponent(emoji)) {
            emoji = encodeURIComponent(emoji);
        }
        await this.#manager.authRequest<null>({
            method: "PUT",
            path:   Routes.CHANNEL_REACTION_USER(id, messageID, emoji, "@me")
        });
    }

    /**
     * Crosspost a message in an announcement channel.
     * @param id The ID of the channel to crosspost the message in.
     * @param messageID The ID of the message to crosspost.
     */
    async crosspostMessage<T extends AnnouncementChannel | Uncached = AnnouncementChannel | Uncached>(id: string, messageID: string): Promise<Message<T>> {
        return this.#manager.authRequest<RawMessage>({
            method: "POST",
            path:   Routes.CHANNEL_MESSAGES_CROSSPOST(id, messageID)
        }).then(data => new Message<T>(data, this.#manager.client));
    }

    /**
     * Delete or close a channel.
     * @param id The ID of the channel to delete or close.
     * @param reason The reason to be displayed in the audit log.
     */
    async delete(id: string, reason?: string): Promise<void> {
        await this.#manager.authRequest<RawChannel>({
            method: "DELETE",
            path:   Routes.CHANNEL(id),
            reason
        });
    }

    /**
     * Delete an invite.
     * @param code The code of the invite to delete.
     * @param reason The reason for deleting the invite.
     */
    async deleteInvite<T extends InviteChannel | PartialInviteChannel | Uncached = InviteChannel | PartialInviteChannel | Uncached>(code: string, reason?: string): Promise<Invite<"withMetadata", T>> {
        return this.#manager.authRequest<RawInvite>({
            method: "DELETE",
            path:   Routes.INVITE(code),
            reason
        }).then(data => new Invite<"withMetadata", T>(data, this.#manager.client));
    }

    /**
     * Delete a message.
     * @param id The ID of the channel to delete the message in.
     * @param messageID The ID of the message to delete.
     * @param reason The reason for deleting the message.
     */
    async deleteMessage(id: string, messageID: string, reason?: string): Promise<void> {
        await this.#manager.authRequest<RawMessage>({
            method: "DELETE",
            path:   Routes.CHANNEL_MESSAGE(id, messageID),
            reason
        });
    }

    /**
     * Bulk delete messages.
     * @param id The ID of the channel to delete the messages in.
     * @param messageIDs The IDs of the messages to delete. Any dupliates or messages older than two weeks will cause an error.
     * @param reason The reason for deleting the messages.
     */
    async deleteMessages(id: string, messageIDs: Array<string>, reason?: string): Promise<number> {
        let chunks: Array<string> = [];
        messageIDs = [...messageIDs];
        while (messageIDs.length) {
            chunks = chunks.concat(messageIDs.splice(0, 100));
        }

        const deleteMessagesPromises: Array<Promise<unknown>> = [];
        for (const [index, chunk] of chunks.entries()) {
            this.#manager.client.emit("debug", `Deleting ${chunk.length} messages on ${id}. ${chunks.length - index} chunks left.`);

            if (chunk.length === 1) {
                this.#manager.client.emit("debug", "deleteMessages created a chunk with only 1 element, using deleteMessage instead.");
                deleteMessagesPromises.push(this.deleteMessage(id, chunk[0], reason));
                continue;
            }

            deleteMessagesPromises.push(this.#manager.authRequest<null>({
                method: "POST",
                path:   Routes.CHANNEL_BULK_DELETE_MESSAGES(id),
                json:   { messages: chunk },
                reason
            }));
        }

        await Promise.all(deleteMessagesPromises);

        return chunks.reduce((amountOfMessages, chunk) => amountOfMessages + chunk.length, 0);
    }

    /**
     * Delete a permission overwrite.
     * @param id The ID of the channel to delete the permission overwrite in.
     * @param overwriteID The ID of the permission overwrite to delete.
     * @param reason The reason for deleting the permission overwrite.
     */
    async deletePermission(id: string, overwriteID: string, reason?: string): Promise<void> {
        await this.#manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.CHANNEL_PERMISSION(id, overwriteID),
            reason
        });
    }

    /**
     * Remove a reaction from a message.
     * @param id The ID of the channel the message is in.
     * @param messageID The ID of the message to remove a reaction from.
     * @param emoji The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param user The user to remove the reaction from, `@me` for the current user (default).
     */
    async deleteReaction(id: string, messageID: string, emoji: string, user = "@me"): Promise<void> {
        if (emoji === decodeURIComponent(emoji)) {
            emoji = encodeURIComponent(emoji);
        }
        await this.#manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.CHANNEL_REACTION_USER(id, messageID, emoji, user)
        });
    }

    /**
     * Remove all, or a specific emoji's reactions from a message.
     * @param id The ID of the channel the message is in.
     * @param messageID The ID of the message to remove reactions from.
     * @param emoji The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis. Omit to remove all reactions.
     */
    async deleteReactions(id: string, messageID: string, emoji?: string): Promise<void> {
        if (emoji && emoji === decodeURIComponent(emoji)) {
            emoji = encodeURIComponent(emoji);
        }
        await this.#manager.authRequest<null>({
            method: "DELETE",
            path:   !emoji ? Routes.CHANNEL_REACTIONS(id, messageID) : Routes.CHANNEL_REACTION(id, messageID, emoji)
        });
    }

    /**
     * Edit a channel.
     * @param id The ID of the channel to edit.
     * @param options The options for editing the channel.
     */
    async edit<T extends AnyEditableChannel = AnyEditableChannel>(id: string, options: EditChannelOptions): Promise<T> {
        const reason = options.reason;
        if (options.reason) {
            delete options.reason;
        }
        if (options.icon) {
            try {
                options.icon = this.#manager.client.util.convertImage(options.icon);
            } catch (err) {
                throw new Error("Invalid icon provided. Ensure you are providing a valid, fully-qualified base64 url.", { cause: err as Error });
            }
        }


        return this.#manager.authRequest<RawChannel>({
            method: "PATCH",
            path:   Routes.CHANNEL(id),
            json:   {
                archived:                      options.archived,
                auto_archive_duration:         options.autoArchiveDuration,
                bitrate:                       options.bitrate,
                default_auto_archive_duration: options.defaultAutoArchiveDuration,
                flags:                         options.flags,
                icon:                          options.icon,
                invitable:                     options.invitable,
                locked:                        options.locked,
                name:                          options.name,
                nsfw:                          options.nsfw,
                parent_id:                     options.parentID,
                permission_overwrites:         options.permissionOverwrites,
                position:                      options.position,
                rate_limit_per_user:           options.rateLimitPerUser,
                rtc_region:                    options.rtcRegion,
                topic:                         options.topic,
                type:                          options.type,
                user_limit:                    options.userLimit,
                video_quality_mode:            options.videoQualityMode
            },
            reason
        }).then(data => Channel.from<T>(data, this.#manager.client));
    }

    /**
     * Edit a message.
     * @param id The ID of the channel the message is in.
     * @param messageID The ID of the message to edit.
     * @param options The options for editing the message.
     */
    async editMessage<T extends AnyTextChannel | Uncached = AnyTextChannel | Uncached>(id: string, messageID: string, options: EditMessageOptions): Promise<Message<T>> {
        const files = options.files;
        if (options.files) {
            delete options.files;
        }
        return this.#manager.authRequest<RawMessage>({
            method: "PATCH",
            path:   Routes.CHANNEL_MESSAGE(id, messageID),
            json:   {
                allowed_mentions: this.#manager.client.util.formatAllowedMentions(options.allowedMentions),
                attachments:      options.attachments,
                components:       options.components ? this.#manager.client.util.componentsToRaw(options.components) : undefined,
                content:          options.content,
                embeds:           options.embeds ? this.#manager.client.util.embedsToRaw(options.embeds) : undefined,
                flags:            options.flags
            },
            files
        }).then(data => new Message<T>(data, this.#manager.client));
    }

    /**
     * Edit a permission overwrite.
     * @param id The ID of the channel to edit the permission overwrite for.
     * @param overwriteID The ID of the permission overwrite to edit.
     * @param options The options for editing the permission overwrite.
     */
    async editPermission(id: string, overwriteID: string, options: EditPermissionOptions): Promise<void> {
        const reason = options.reason;
        if (options.reason) {
            delete options.reason;
        }
        await this.#manager.authRequest<null>({
            method: "PUT",
            path:   Routes.CHANNEL_PERMISSION(id, overwriteID),
            json:   {
                allow: options.allow,
                deny:  options.deny,
                type:  options.type
            },
            reason
        });
    }

    /**
     * Follow an announcement channel.
     * @param id The ID of the channel to follow the announcement channel to.
     * @param webhookChannelID The ID of the channel to follow the announcement channel to.
     */
    async followAnnouncement(id: string, webhookChannelID: string): Promise<FollowedChannel> {
        return this.#manager.authRequest<RawFollowedChannel>({
            method: "POST",
            path:   Routes.CHANNEL_FOLLOWERS(id),
            json:   { webhook_channel_id: webhookChannelID }
        }).then(data => ({
            channelID: data.channel_id,
            webhookID: data.webhook_id
        }));
    }

    /**
     * Get a channel.
     * @param id The ID of the channel to get.
     */
    async get<T extends AnyChannel = AnyChannel>(id: string): Promise<T> {
        return this.#manager.authRequest<RawChannel>({
            method: "GET",
            path:   Routes.CHANNEL(id)
        }).then(data => this.#manager.client.util.updateChannel<T>(data));
    }

    /**
     * Get an invite.
     * @param code The code of the invite to get.
     * @param options The options for getting the invite.
     */
    async getInvite<T extends InviteChannel | PartialInviteChannel | Uncached = InviteChannel | PartialInviteChannel | Uncached>(code: string, options: GetInviteWithNoneOptions): Promise<Invite<"withMetadata", T>>;
    async getInvite<T extends InviteChannel | PartialInviteChannel | Uncached = InviteChannel | PartialInviteChannel | Uncached>(code: string, options: GetInviteWithCountsAndExpirationOptions): Promise<Invite<"withMetadata" | "withCounts" | "withExpiration", T>>;
    async getInvite<T extends InviteChannel | PartialInviteChannel | Uncached = InviteChannel | PartialInviteChannel | Uncached>(code: string, options: GetInviteWithCountsOptions): Promise<Invite<"withMetadata" | "withCounts", T>>;
    async getInvite<T extends InviteChannel | PartialInviteChannel | Uncached = InviteChannel | PartialInviteChannel | Uncached>(code: string, options: GetInviteWithExpirationOptions): Promise<Invite<"withMetadata" | "withExpiration", T>>;
    async getInvite<T extends InviteChannel | PartialInviteChannel | Uncached = InviteChannel | PartialInviteChannel | Uncached>(code: string, options?: GetInviteOptions): Promise<Invite<never, T>> {
        const query = new URLSearchParams();
        if (options?.guildScheduledEventID) {
            query.set("guild_scheduled_event_id", options.guildScheduledEventID);
        }
        if (options?.withCounts) {
            query.set("with_counts", "true");
        }
        if (options?.withExpiration) {
            query.set("with_expiration", "true");
        }
        return this.#manager.authRequest<RawInvite>({
            method: "GET",
            path:   Routes.INVITE(code),
            query
        }).then(data => new Invite<never, T>(data, this.#manager.client));
    }

    /**
     * Get the invites of a channel.
     * @param id The ID of the channel to get the invites of.
     */
    async getInvites<T extends InviteChannel | PartialInviteChannel | Uncached = InviteChannel | PartialInviteChannel | Uncached>(id: string): Promise<Array<Invite<"withMetadata", T>>> {
        return this.#manager.authRequest<Array<RawInvite>>({
            method: "GET",
            path:   Routes.CHANNEL_INVITES(id)
        }).then(data => data.map(invite => new Invite<"withMetadata", T>(invite, this.#manager.client)));
    }

    /**
     * Get the private archived threads the current user has joined in a channel.
     * @param id The ID of the channel to get the archived threads from.
     * @param options The options for getting the archived threads.
     */
    async getJoinedPrivateArchivedThreads(id: string, options?: GetArchivedThreadsOptions): Promise<ArchivedThreads<PrivateThreadChannel>> {
        return this.#manager.authRequest<RawArchivedThreads<RawPrivateThreadChannel>>({
            method: "GET",
            path:   Routes.CHANNEL_PRIVATE_ARCHIVED_THREADS(id),
            json:   {
                before: options?.before,
                limit:  options?.limit
            }
        }).then(data => ({
            hasMore: data.has_more,
            members: data.members.map(m => ({
                flags:         m.flags,
                id:            m.id,
                joinTimestamp: new Date(m.join_timestamp),
                userID:        m.user_id
            }) as ThreadMember),
            threads: data.threads.map(d => this.#manager.client.util.updateThread(d))
        }));
    }

    /**
     * Get a message in a channel.
     * @param id The ID of the channel the message is in
     * @param messageID The ID of the message to get.
     */
    async getMessage<T extends AnyTextChannel | Uncached = AnyTextChannel | Uncached>(id: string, messageID: string): Promise<Message<T>> {
        return this.#manager.authRequest<RawMessage>({
            method: "GET",
            path:   Routes.CHANNEL_MESSAGE(id, messageID)
        }).then(data => new Message<T>(data, this.#manager.client));
    }

    /**
     * Get messages in a channel.
     * @param id The ID of the channel to get messages from.
     * @param options The options for getting messages. `before`, `after`, and `around `All are mutually exclusive.
     */
    async getMessages<T extends AnyTextChannel | Uncached = AnyTextChannel | Uncached>(id: string, options?: GetChannelMessagesOptions): Promise<Array<Message<T>>> {
        const _getMessages = async (_options?: GetChannelMessagesOptions): Promise<Array<Message<T>>> => {
            const query = new URLSearchParams();
            if (_options?.after) {
                query.set("after", _options.after);
            }
            if (_options?.around) {
                query.set("around", _options.around);
            }
            if (_options?.before) {
                query.set("before", _options.before);
            }
            if (_options?.limit) {
                query.set("limit", _options.limit.toString());
            }
            return this.#manager.authRequest<Array<RawMessage>>({
                method: "GET",
                path:   Routes.CHANNEL_MESSAGES(id),
                query
            }).then(data => data.map(d => new Message<T>(d, this.#manager.client)));
        };

        const limit = options?.limit ?? 100;
        let before = options?.before;

        let messages: Array<Message<T>> = [];
        while (messages.length < limit) {
            const limitLeft = limit - messages.length;
            const limitToFetch = limitLeft <= 100 ? limitLeft : 100;
            this.#manager.client.emit("debug", `Getting ${limitToFetch} more messages for ${id}. ${limitLeft} left to get.`);
            const messagesChunk = await _getMessages({
                after:  options?.after,
                around: options?.around,
                before,
                limit:  limitToFetch
            });

            if (messagesChunk.length === 0) {
                break;
            }

            messages = messages.concat(messagesChunk);
            before = messagesChunk.at(-1)!.id;

            if (messagesChunk.length < 100) {
                break;
            }
        }

        return messages;
    }

    /**
     * Get the pinned messages in a channel.
     * @param id The ID of the channel to get the pinned messages from.
     */
    async getPinnedMessages<T extends AnyTextChannel | Uncached = AnyTextChannel | Uncached>(id: string): Promise<Array<Message<T>>> {
        return this.#manager.authRequest<Array<RawMessage>>({
            method: "GET",
            path:   Routes.CHANNEL_PINS(id)
        }).then(data => data.map(d => new Message<T>(d, this.#manager.client)));
    }

    /**
     * Get the private archived threads in a channel.
     * @param id The ID of the channel to get the archived threads from.
     * @param options The options for getting the archived threads.
     */
    async getPrivateArchivedThreads(id: string, options?: GetArchivedThreadsOptions): Promise<ArchivedThreads<PrivateThreadChannel>> {
        return this.#manager.authRequest<RawArchivedThreads<RawPrivateThreadChannel>>({
            method: "GET",
            path:   Routes.CHANNEL_PRIVATE_ARCHIVED_THREADS(id),
            json:   {
                before: options?.before,
                limit:  options?.limit
            }
        }).then(data => ({
            hasMore: data.has_more,
            members: data.members.map(m => ({
                flags:         m.flags,
                id:            m.id,
                joinTimestamp: new Date(m.join_timestamp),
                userID:        m.user_id
            }) as ThreadMember),
            threads: data.threads.map(d => this.#manager.client.util.updateThread(d))
        }));
    }

    /**
     * Get the public archived threads in a channel.
     * @param id The ID of the channel to get the archived threads from.
     * @param options The options for getting the archived threads.
     */
    async getPublicArchivedThreads<T extends AnnouncementThreadChannel | PublicThreadChannel = AnnouncementThreadChannel | PublicThreadChannel>(id: string, options?: GetArchivedThreadsOptions): Promise<ArchivedThreads<T>> {
        return this.#manager.authRequest<RawArchivedThreads<RawAnnouncementThreadChannel | RawPublicThreadChannel>>({
            method: "GET",
            path:   Routes.CHANNEL_PUBLIC_ARCHIVED_THREADS(id),
            json:   {
                before: options?.before,
                limit:  options?.limit
            }
        }).then(data => ({
            hasMore: data.has_more,
            members: data.members.map(m => ({
                flags:         m.flags,
                id:            m.id,
                joinTimestamp: new Date(m.join_timestamp),
                userID:        m.user_id
            }) as ThreadMember),
            threads: data.threads.map(d => this.#manager.client.util.updateThread(d))
        }));
    }

    /**
     * Get the users who reacted with a specific emoji on a message.
     * @param id The ID of the channel the message is in.
     * @param messageID The ID of the message to get reactions from.
     * @param emoji The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param options The options for getting the reactions.
     */
    async getReactions(id: string, messageID: string, emoji: string, options?: GetReactionsOptions): Promise<Array<User>> {
        if (emoji === decodeURIComponent(emoji)) {
            emoji = encodeURIComponent(emoji);
        }

        const _getReactions = async (_options?: GetReactionsOptions): Promise<Array<User>> => {
            const query = new URLSearchParams();
            if (_options?.after) {
                query.set("after", _options.after);
            }
            if (_options?.limit) {
                query.set("limit", _options.limit.toString());
            }
            return this.#manager.authRequest<Array<RawUser>>({
                method: "GET",
                path:   Routes.CHANNEL_REACTION(id, messageID, emoji),
                query
            }).then(data => data.map(d => this.#manager.client.users.update(d)));
        };

        const limit = options?.limit ?? 100;
        let after = options?.after;

        let reactions: Array<User> = [];
        while (reactions.length < limit) {
            const limitLeft = limit - reactions.length;
            const limitToFetch = limitLeft <= 100 ? limitLeft : 100;
            this.#manager.client.emit("debug", `Getting ${limitToFetch} more ${emoji} reactions for message ${messageID} on ${id}. ${limitLeft} left to get.`);
            const reactionsChunk = await _getReactions({
                after,
                limit: limitToFetch
            });

            if (reactionsChunk.length === 0) {
                break;
            }

            reactions = reactions.concat(reactionsChunk);
            after = reactionsChunk.at(-1)!.id;

            if (reactionsChunk.length < 100) {
                break;
            }
        }

        return reactions;
    }

    /**
     * Get a thread member.
     * @param id The ID of the thread.
     * @param userID The ID of the user to get the thread member of.
     */
    async getThreadMember(id: string, userID: string): Promise<ThreadMember> {
        return this.#manager.authRequest<RawThreadMember>({
            method: "GET",
            path:   Routes.CHANNEL_THREAD_MEMBER(id, userID)
        }).then(data => ({
            flags:         data.flags,
            id:            data.id,
            joinTimestamp: new Date(data.join_timestamp),
            userID:        data.user_id
        }));
    }

    /**
     * Get the members of a thread.
     * @param id The ID of the thread.
     */
    async getThreadMembers(id: string): Promise<Array<ThreadMember>> {
        return this.#manager.authRequest<Array<RawThreadMember>>({
            method: "GET",
            path:   Routes.CHANNEL_THREAD_MEMBERS(id)
        }).then(data => data.map(d => ({
            flags:         d.flags,
            id:            d.id,
            joinTimestamp: new Date(d.join_timestamp),
            userID:        d.user_id
        })));
    }

    /**
     * Get the list of usable voice regions.
     */
    async getVoiceRegions(): Promise<Array<VoiceRegion>> {
        return this.#manager.authRequest<Array<VoiceRegion>>({
            method: "GET",
            path:   Routes.VOICE_REGIONS
        });
    }

    /**
     * Join a thread.
     * @param id The ID of the thread to join.
     */
    async joinThread(id: string): Promise<void> {
        await this.#manager.authRequest<null>({
            method: "PUT",
            path:   Routes.CHANNEL_THREAD_MEMBER(id, "@me")
        });
    }

    /**
     * Leave a thread.
     * @param id The ID of the thread to leave.
     */
    async leaveThread(id: string): Promise<void> {
        await this.#manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.CHANNEL_THREAD_MEMBER(id, "@me")
        });
    }

    /**
     * Pin a message in a channel.
     * @param id The ID of the channel to pin the message in.
     * @param messageID The ID of the message to pin.
     * @param reason The reason for pinning the message.
     */
    async pinMessage(id: string, messageID: string, reason?: string): Promise<void> {
        await this.#manager.authRequest<null>({
            method: "PUT",
            path:   Routes.CHANNEL_PINNED_MESSAGE(id, messageID),
            reason
        });
    }

    /**
     * Purge an amount of messages from a channel.
     * @param id The ID of the channel to purge.
     * @param options The options to purge.
     */
    async purgeMessages<T extends AnyGuildTextChannel | Uncached = AnyGuildTextChannel | Uncached>(id: string, options: PurgeOptions<T>): Promise<number> {
        const filter = options.filter?.bind(this) ?? ((): true => true);

        const messageIDsToPurge: Array<string> = [];
        let finishedFetchingMessages = false;
        const addMessageIDsToPurgeBatch = async (): Promise<void> => {
            let limit = options.limit - messageIDsToPurge.length;
            if (limit > 100) {
                limit = 100;
            }
            const messages = await this.getMessages(id, {
                limit,
                after:  options.after,
                around: options.around,
                before: options.before
            });

            if (messages.length === 0) {
                finishedFetchingMessages = true;
                return;
            }

            const filterPromises: Array<Promise<unknown>> = [];
            for (const message of messages) {
                if (message.timestamp.getTime() < Date.now() - 1209600000) {
                    finishedFetchingMessages = true;
                    break;
                }

                filterPromises.push((async (): Promise<void> => {
                    if (await filter(message as Message<T>)) {
                        if (finishedFetchingMessages) {
                            return;
                        }

                        messageIDsToPurge.push(message.id);
                        if (messageIDsToPurge.length === options.limit) {
                            finishedFetchingMessages = true;
                        }
                    }
                })());
            }

            await Promise.all(filterPromises);

            if (!finishedFetchingMessages) {
                await addMessageIDsToPurgeBatch();
            }
        };
        await addMessageIDsToPurgeBatch();

        return this.deleteMessages(id, messageIDsToPurge, options.reason);
    }

    /**
     * Remove a user from the group channel.
     * @param groupID The ID of the group to remove the user from.
     * @param userID The ID of the user to remove.
     */
    async removeGroupRecipient(groupID: string, userID: string): Promise<void> {
        await this.#manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.GROUP_RECIPIENT(groupID, userID)
        });
    }

    /**
     * Remove a member from a thread.
     * @param id The ID of the thread to remove them from.
     * @param userID The ID of the user to remove from the thread.
     */
    async removeThreadMember(id: string, userID: string): Promise<void> {
        await this.#manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.CHANNEL_THREAD_MEMBER(id, userID)
        });
    }

    /**
     * Show a typing indicator in a channel. How long users see this varies from client to client.
     * @param id The ID of the channel to show the typing indicator in.
     */
    async sendTyping(id: string): Promise<void> {
        await this.#manager.authRequest<null>({
            method: "POST",
            path:   Routes.CHANNEL_TYPING(id)
        });
    }

    /**
     * Create a thread from an existing message.
     * @param id The ID of the channel to create the thread in.
     * @param messageID The ID of the message to create the thread from.
     * @param {options The options for starting the thread.
     */
    async startThreadFromMessage<T extends AnnouncementThreadChannel | PublicThreadChannel = AnnouncementThreadChannel | PublicThreadChannel>(id: string, messageID: string, options: StartThreadFromMessageOptions): Promise<T> {
        const reason = options.reason;
        if (options.reason) {
            delete options.reason;
        }
        return this.#manager.authRequest<RawThreadChannel>({
            method: "POST",
            path:   Routes.CHANNEL_MESSAGE_THREADS(id, messageID),
            json:   {
                auto_archive_duration: options.autoArchiveDuration,
                name:                  options.name,
                rate_limit_per_user:   options.rateLimitPerUser
            },
            reason
        }).then(data => this.#manager.client.util.updateThread<T>(data));
    }

    /**
     * Create a thread in a forum channel.
     * @param id The ID of the channel to start the thread in.
     * @param options The options for starting the thread.
     */
    async startThreadInForum(id: string, options: StartThreadInForumOptions): Promise<PublicThreadChannel> {
        const reason = options.reason;
        if (options.reason) {
            delete options.reason;
        }
        const files = options.message.files;
        if (options.message.files) {
            delete options.message.files;
        }
        return this.#manager.authRequest<RawThreadChannel>({
            method: "POST",
            path:   Routes.CHANNEL_THREADS(id),
            json:   {
                auto_archive_duration: options.autoArchiveDuration,
                message:               {
                    allowed_mentions: this.#manager.client.util.formatAllowedMentions(options.message.allowedMentions),
                    attachments:      options.message.attachments,
                    components:       options.message.components ? this.#manager.client.util.componentsToRaw(options.message.components) : undefined,
                    content:          options.message.content,
                    embeds:           options.message.embeds ? this.#manager.client.util.embedsToRaw(options.message.embeds) : undefined,
                    flags:            options.message.flags,
                    sticker_ids:      options.message.stickerIDs
                },
                name:                options.name,
                rate_limit_per_user: options.rateLimitPerUser
            },
            reason,
            files
        }).then(data => this.#manager.client.util.updateThread<PublicThreadChannel>(data));
    }

    /**
     * Create a thread without an existing message.
     * @param id The ID of the channel to start the thread in.
     * @param options The options for starting the thread.
     */
    async startThreadWithoutMessage<T extends AnnouncementThreadChannel | PublicThreadChannel | PrivateThreadChannel = AnnouncementThreadChannel | PublicThreadChannel | PrivateThreadChannel>(id: string, options: StartThreadWithoutMessageOptions): Promise<T> {
        const reason = options.reason;
        if (options.reason) {
            delete options.reason;
        }
        return this.#manager.authRequest<RawThreadChannel>({
            method: "POST",
            path:   Routes.CHANNEL_THREADS(id),
            json:   {
                auto_archive_duration: options.autoArchiveDuration,
                invitable:             options.invitable,
                name:                  options.name,
                rate_limit_per_user:   options.rateLimitPerUser,
                type:                  options.type
            },
            reason
        }).then(data => this.#manager.client.util.updateThread<T>(data));
    }

    /**
     * Unpin a message in a channel.
     * @param id The ID of the channel to unpin the message in.
     * @param messageID The ID of the message to unpin.
     * @param reason The reason for unpinning the message.
     */
    async unpinMessage(id: string, messageID: string, reason?: string): Promise<void> {
        await this.#manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.CHANNEL_PINNED_MESSAGE(id, messageID),
            reason
        });
    }
}
