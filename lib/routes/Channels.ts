/** @module Routes/Channels */
import type {
    AddGroupRecipientOptions,
    AnyChannel,
    AnyTextChannelWithoutGroup,
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
import type GroupChannel from "../structures/GroupChannel";
import type User from "../structures/User";
import type { Uncached } from "../types/shared";
import type { CreateStageInstanceOptions, EditStageInstanceOptions, RawStageInstance } from "../types/guilds";
import StageInstance from "../structures/StageInstance";

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
     * @param channelID The ID of the thread to add them to.
     * @param userID The ID of the user to add to the thread.
     */
    async addThreadMember(channelID: string, userID: string): Promise<void> {
        await this.#manager.authRequest<null>({
            method: "PUT",
            path:   Routes.CHANNEL_THREAD_MEMBER(channelID, userID)
        });
    }
    /**
     * Create a direct message. This will not create a new channel if you have already started a dm with the user.
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
     * @param channelID The ID of the channel to create an invite for.
     * @param options The options for creating the invite.
     */
    async createInvite<T extends InviteInfoTypes, CH extends InviteChannel | PartialInviteChannel | Uncached = InviteChannel | PartialInviteChannel | Uncached>(channelID: string, options: CreateInviteOptions): Promise<Invite<T, CH>> {
        const reason = options.reason;
        if (options.reason) {
            delete options.reason;
        }
        return this.#manager.authRequest<RawInvite>({
            method: "POST",
            path:   Routes.CHANNEL_INVITES(channelID),
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
     * @param channelID The ID of the channel to create the message in.
     * @param options The options for creating the message.
     */
    async createMessage<T extends AnyTextChannelWithoutGroup | Uncached = AnyTextChannelWithoutGroup | Uncached>(channelID: string, options: CreateMessageOptions): Promise<Message<T>> {
        const files = options.files;
        if (options.files) {
            delete options.files;
        }
        return this.#manager.authRequest<RawMessage>({
            method: "POST",
            path:   Routes.CHANNEL_MESSAGES(channelID),
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
     * @param channelID The ID of the channel the message is in.
     * @param messageID The ID of the message to add a reaction to.
     * @param emoji The reaction to add to the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     */
    async createReaction(channelID: string, messageID: string, emoji: string): Promise<void> {
        if (emoji === decodeURIComponent(emoji)) {
            emoji = encodeURIComponent(emoji);
        }
        await this.#manager.authRequest<null>({
            method: "PUT",
            path:   Routes.CHANNEL_REACTION_USER(channelID, messageID, emoji, "@me")
        });
    }

    /**
     * Create a stage instance.
     * @param channelID The ID of the channel to create the stage instance on.
     * @param options The options for creating the stage instance.
     */
    async createStageInstance(channelID: string, options: CreateStageInstanceOptions): Promise<StageInstance> {
        const reason = options.reason;
        if (options.reason) {
            delete options.reason;
        }
        return this.#manager.authRequest<RawStageInstance>({
            method: "POST",
            path:   Routes.STAGE_INSTANCES,
            json:   {
                channel_id:              channelID,
                topic:                   options.topic,
                privacy_level:           options.privacyLevel,
                send_start_notification: options.sendStartNotification
            },
            reason
        }).then(data => new StageInstance(data, this.#manager.client));
    }

    /**
     * Crosspost a message in an announcement channel.
     * @param channelID The ID of the channel to crosspost the message in.
     * @param messageID The ID of the message to crosspost.
     */
    async crosspostMessage<T extends AnnouncementChannel | Uncached = AnnouncementChannel | Uncached>(channelID: string, messageID: string): Promise<Message<T>> {
        return this.#manager.authRequest<RawMessage>({
            method: "POST",
            path:   Routes.CHANNEL_MESSAGES_CROSSPOST(channelID, messageID)
        }).then(data => new Message<T>(data, this.#manager.client));
    }

    /**
     * Delete or close a channel.
     * @param channelID The ID of the channel to delete or close.
     * @param reason The reason to be displayed in the audit log.
     */
    async delete(channelID: string, reason?: string): Promise<void> {
        await this.#manager.authRequest<RawChannel>({
            method: "DELETE",
            path:   Routes.CHANNEL(channelID),
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
     * @param channelID The ID of the channel to delete the message in.
     * @param messageID The ID of the message to delete.
     * @param reason The reason for deleting the message.
     */
    async deleteMessage(channelID: string, messageID: string, reason?: string): Promise<void> {
        await this.#manager.authRequest<RawMessage>({
            method: "DELETE",
            path:   Routes.CHANNEL_MESSAGE(channelID, messageID),
            reason
        });
    }

    /**
     * Bulk delete messages.
     * @param channelID The ID of the channel to delete the messages in.
     * @param messageIDs The IDs of the messages to delete. Any duplicates or messages older than two weeks will cause an error.
     * @param reason The reason for deleting the messages.
     */
    async deleteMessages(channelID: string, messageIDs: Array<string>, reason?: string): Promise<number> {
        const chunks: Array<Array<string>> = [];
        messageIDs = [...messageIDs];
        const amountOfMessages = messageIDs.length;
        while (messageIDs.length !== 0) {
            chunks.push(messageIDs.splice(0, 100));
        }

        let done = 0;
        const deleteMessagesPromises: Array<Promise<unknown>> = [];
        for (const chunk of chunks.values()) {
            if (chunks.length > 1) {
                const left = amountOfMessages - done;
                this.#manager.client.emit("debug", `Deleting ${left} messages in ${channelID}`);
            }

            if (chunk.length === 1) {
                this.#manager.client.emit("debug", "deleteMessages created a chunk with only 1 element, using deleteMessage instead.");
                deleteMessagesPromises.push(this.deleteMessage(channelID, chunk[0], reason));
                continue;
            }

            deleteMessagesPromises.push(this.#manager.authRequest<null>({
                method: "POST",
                path:   Routes.CHANNEL_BULK_DELETE_MESSAGES(channelID),
                json:   { messages: chunk },
                reason
            }));
            done += chunk.length;
        }

        await Promise.all(deleteMessagesPromises);

        return amountOfMessages;
    }

    /**
     * Delete a permission overwrite.
     * @param channelID The ID of the channel to delete the permission overwrite in.
     * @param overwriteID The ID of the permission overwrite to delete.
     * @param reason The reason for deleting the permission overwrite.
     */
    async deletePermission(channelID: string, overwriteID: string, reason?: string): Promise<void> {
        await this.#manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.CHANNEL_PERMISSION(channelID, overwriteID),
            reason
        });
    }

    /**
     * Remove a reaction from a message.
     * @param channelID The ID of the channel the message is in.
     * @param messageID The ID of the message to remove a reaction from.
     * @param emoji The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param user The user to remove the reaction from, `@me` for the current user (default).
     */
    async deleteReaction(channelID: string, messageID: string, emoji: string, user = "@me"): Promise<void> {
        if (emoji === decodeURIComponent(emoji)) {
            emoji = encodeURIComponent(emoji);
        }
        await this.#manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.CHANNEL_REACTION_USER(channelID, messageID, emoji, user)
        });
    }

    /**
     * Remove all, or a specific emoji's reactions from a message.
     * @param channelID The ID of the channel the message is in.
     * @param messageID The ID of the message to remove reactions from.
     * @param emoji The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis. Omit to remove all reactions.
     */
    async deleteReactions(channelID: string, messageID: string, emoji?: string): Promise<void> {
        if (emoji && emoji === decodeURIComponent(emoji)) {
            emoji = encodeURIComponent(emoji);
        }
        await this.#manager.authRequest<null>({
            method: "DELETE",
            path:   !emoji ? Routes.CHANNEL_REACTIONS(channelID, messageID) : Routes.CHANNEL_REACTION(channelID, messageID, emoji)
        });
    }

    /**
     * Delete a stage instance.
     * @param channelID The ID of the channel to delete the stage instance on.
     * @param reason The reason for deleting the stage instance.
     */
    async deleteStageInstance(channelID: string, reason?: string): Promise<void> {
        await this.#manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.STAGE_INSTANCE(channelID),
            reason
        });
    }

    /**
     * Edit a channel.
     * @param channelID The ID of the channel to edit.
     * @param options The options for editing the channel.
     */
    async edit<T extends AnyEditableChannel = AnyEditableChannel>(channelID: string, options: EditChannelOptions): Promise<T> {
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
            path:   Routes.CHANNEL(channelID),
            json:   {
                applied_tags:          options.appliedTags,
                archived:              options.archived,
                auto_archive_duration: options.autoArchiveDuration,
                available_tags:        options.availableTags?.map(tag => ({
                    emoji_id:   tag.emoji?.id,
                    emoji_name: tag.emoji?.name,
                    moderated:  tag.moderated,
                    name:       tag.name,
                    id:         tag.id
                })),
                bitrate:                            options.bitrate,
                default_auto_archive_duration:      options.defaultAutoArchiveDuration,
                default_forum_layout:               options.defaultForumLayout,
                default_reaction_emoji:             options.defaultReactionEmoji ? { emoji_id: options.defaultReactionEmoji.id, emoji_name: options.defaultReactionEmoji.name } : options.defaultReactionEmoji,
                default_sort_order:                 options.defaultSortOrder,
                default_thread_rate_limit_per_user: options.defaultThreadRateLimitPerUser,
                flags:                              options.flags,
                icon:                               options.icon,
                invitable:                          options.invitable,
                locked:                             options.locked,
                name:                               options.name,
                nsfw:                               options.nsfw,
                parent_id:                          options.parentID,
                permission_overwrites:              options.permissionOverwrites,
                position:                           options.position,
                rate_limit_per_user:                options.rateLimitPerUser,
                rtc_region:                         options.rtcRegion,
                topic:                              options.topic,
                type:                               options.type,
                user_limit:                         options.userLimit,
                video_quality_mode:                 options.videoQualityMode
            },
            reason
        }).then(data => Channel.from<T>(data, this.#manager.client));
    }

    /**
     * Edit a message.
     * @param channelID The ID of the channel the message is in.
     * @param messageID The ID of the message to edit.
     * @param options The options for editing the message.
     */
    async editMessage<T extends AnyTextChannelWithoutGroup | Uncached = AnyTextChannelWithoutGroup | Uncached>(channelID: string, messageID: string, options: EditMessageOptions): Promise<Message<T>> {
        const files = options.files;
        if (options.files) {
            delete options.files;
        }
        return this.#manager.authRequest<RawMessage>({
            method: "PATCH",
            path:   Routes.CHANNEL_MESSAGE(channelID, messageID),
            json:   {
                allowed_mentions: options.allowedMentions ? this.#manager.client.util.formatAllowedMentions(options.allowedMentions) : undefined,
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
     * @param channelID The ID of the channel to edit the permission overwrite for.
     * @param overwriteID The ID of the permission overwrite to edit.
     * @param options The options for editing the permission overwrite.
     */
    async editPermission(channelID: string, overwriteID: string, options: EditPermissionOptions): Promise<void> {
        const reason = options.reason;
        if (options.reason) {
            delete options.reason;
        }
        await this.#manager.authRequest<null>({
            method: "PUT",
            path:   Routes.CHANNEL_PERMISSION(channelID, overwriteID),
            json:   {
                allow: options.allow,
                deny:  options.deny,
                type:  options.type
            },
            reason
        });
    }

    /**
     * Edit a stage instance.
     * @param channelID The ID of the channel to edit the stage instance on.
     * @param options The options for editing the stage instance.
     */
    async editStageInstance(channelID: string, options: EditStageInstanceOptions): Promise<StageInstance> {
        const reason = options.reason;
        if (options.reason) {
            delete options.reason;
        }
        return this.#manager.authRequest<RawStageInstance>({
            method: "PATCH",
            path:   Routes.STAGE_INSTANCE(channelID),
            json:   {
                channel_id:    channelID,
                topic:         options.topic,
                privacy_level: options.privacyLevel
            },
            reason
        }).then(data => new StageInstance(data, this.#manager.client));
    }

    /**
     * Follow an announcement channel.
     * @param channelID The ID of the channel to follow the announcement channel to.
     * @param webhookChannelID The ID of the channel to follow the announcement channel to.
     */
    async followAnnouncement(channelID: string, webhookChannelID: string): Promise<FollowedChannel> {
        return this.#manager.authRequest<RawFollowedChannel>({
            method: "POST",
            path:   Routes.CHANNEL_FOLLOWERS(channelID),
            json:   { webhook_channel_id: webhookChannelID }
        }).then(data => ({
            channelID: data.channel_id,
            webhookID: data.webhook_id
        }));
    }

    /**
     * Get a channel.
     * @param channelID The ID of the channel to get.
     */
    async get<T extends AnyChannel = AnyChannel>(channelID: string): Promise<T> {
        return this.#manager.authRequest<RawChannel>({
            method: "GET",
            path:   Routes.CHANNEL(channelID)
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
        if (options?.guildScheduledEventID !== undefined) {
            query.set("guild_scheduled_event_id", options.guildScheduledEventID);
        }
        if (options?.withCounts !== undefined) {
            query.set("with_counts", options.withCounts.toString());
        }
        if (options?.withExpiration !== undefined) {
            query.set("with_expiration", options.withExpiration.toString());
        }
        return this.#manager.authRequest<RawInvite>({
            method: "GET",
            path:   Routes.INVITE(code),
            query
        }).then(data => new Invite<never, T>(data, this.#manager.client));
    }

    /**
     * Get the invites of a channel.
     * @param channelID The ID of the channel to get the invites of.
     */
    async getInvites<T extends InviteChannel | PartialInviteChannel | Uncached = InviteChannel | PartialInviteChannel | Uncached>(channelID: string): Promise<Array<Invite<"withMetadata", T>>> {
        return this.#manager.authRequest<Array<RawInvite>>({
            method: "GET",
            path:   Routes.CHANNEL_INVITES(channelID)
        }).then(data => data.map(invite => new Invite<"withMetadata", T>(invite, this.#manager.client)));
    }

    /**
     * Get the private archived threads the current user has joined in a channel.
     * @param channelID The ID of the channel to get the archived threads from.
     * @param options The options for getting the archived threads.
     */
    async getJoinedPrivateArchivedThreads(channelID: string, options?: GetArchivedThreadsOptions): Promise<ArchivedThreads<PrivateThreadChannel>> {
        return this.#manager.authRequest<RawArchivedThreads<RawPrivateThreadChannel>>({
            method: "GET",
            path:   Routes.CHANNEL_PRIVATE_ARCHIVED_THREADS(channelID),
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
     * @param channelID The ID of the channel the message is in
     * @param messageID The ID of the message to get.
     */
    async getMessage<T extends AnyTextChannelWithoutGroup | Uncached = AnyTextChannelWithoutGroup | Uncached>(channelID: string, messageID: string): Promise<Message<T>> {
        return this.#manager.authRequest<RawMessage>({
            method: "GET",
            path:   Routes.CHANNEL_MESSAGE(channelID, messageID)
        }).then(data => new Message<T>(data, this.#manager.client));
    }

    /**
     * Get messages in a channel.
     * @param channelID The ID of the channel to get messages from.
     * @param options The options for getting messages. `before`, `after`, and `around `All are mutually exclusive.
     */
    async getMessages<T extends AnyTextChannelWithoutGroup | Uncached = AnyTextChannelWithoutGroup | Uncached>(channelID: string, options?: GetChannelMessagesOptions): Promise<Array<Message<T>>> {
        const _getMessages = async (_options?: GetChannelMessagesOptions): Promise<Array<Message<T>>> => {
            const query = new URLSearchParams();
            if (_options?.after !== undefined) {
                query.set("after", _options.after);
            }
            if (_options?.around !== undefined) {
                query.set("around", _options.around);
            }
            if (_options?.before !== undefined) {
                query.set("before", _options.before);
            }
            if (_options?.limit !== undefined) {
                query.set("limit", _options.limit.toString());
            }
            return this.#manager.authRequest<Array<RawMessage>>({
                method: "GET",
                path:   Routes.CHANNEL_MESSAGES(channelID),
                query
            }).then(data => data.map(d => new Message<T>(d, this.#manager.client)));
        };

        const limit = options?.limit ?? 100;
        let chosenOption: "after" | "around" | "before";
        if (options?.after) {
            chosenOption = "after";
        } else if (options?.around) {
            chosenOption = "around";
        } else if (options?.before) {
            chosenOption = "before";
        } else {
            chosenOption = "before";
        }
        let optionValue = options?.[chosenOption] ?? undefined;

        let messages: Array<Message<T>> = [];
        while (messages.length < limit) {
            const limitLeft = limit - messages.length;
            const limitToFetch = limitLeft <= 100 ? limitLeft : 100;
            if (options?.limit && options?.limit > 100) {
                this.#manager.client.emit("debug", `Getting ${limitLeft} more message${limitLeft === 1 ? "" : "s"} for ${channelID}: ${optionValue ?? ""}`);
            }
            const messagesChunk = await _getMessages({
                limit:          limitToFetch,
                [chosenOption]: optionValue
            });

            if (messagesChunk.length === 0) {
                break;
            }

            messages = messages.concat(messagesChunk);

            if (chosenOption === "around") {
                break;
            } else {
                optionValue = messages.at(-1)!.id;
            }

            if (messagesChunk.length < 100) {
                break;
            }
        }

        return messages;
    }

    /**
     * Get the pinned messages in a channel.
     * @param channelID The ID of the channel to get the pinned messages from.
     */
    async getPinnedMessages<T extends AnyTextChannelWithoutGroup | Uncached = AnyTextChannelWithoutGroup | Uncached>(channelID: string): Promise<Array<Message<T>>> {
        return this.#manager.authRequest<Array<RawMessage>>({
            method: "GET",
            path:   Routes.CHANNEL_PINS(channelID)
        }).then(data => data.map(d => new Message<T>(d, this.#manager.client)));
    }

    /**
     * Get the private archived threads in a channel.
     * @param channelID The ID of the channel to get the archived threads from.
     * @param options The options for getting the archived threads.
     */
    async getPrivateArchivedThreads(channelID: string, options?: GetArchivedThreadsOptions): Promise<ArchivedThreads<PrivateThreadChannel>> {
        return this.#manager.authRequest<RawArchivedThreads<RawPrivateThreadChannel>>({
            method: "GET",
            path:   Routes.CHANNEL_PRIVATE_ARCHIVED_THREADS(channelID),
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
     * @param channelID The ID of the channel to get the archived threads from.
     * @param options The options for getting the archived threads.
     */
    async getPublicArchivedThreads<T extends AnnouncementThreadChannel | PublicThreadChannel = AnnouncementThreadChannel | PublicThreadChannel>(channelID: string, options?: GetArchivedThreadsOptions): Promise<ArchivedThreads<T>> {
        return this.#manager.authRequest<RawArchivedThreads<RawAnnouncementThreadChannel | RawPublicThreadChannel>>({
            method: "GET",
            path:   Routes.CHANNEL_PUBLIC_ARCHIVED_THREADS(channelID),
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
     * @param channelID The ID of the channel the message is in.
     * @param messageID The ID of the message to get reactions from.
     * @param emoji The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param options The options for getting the reactions.
     */
    async getReactions(channelID: string, messageID: string, emoji: string, options?: GetReactionsOptions): Promise<Array<User>> {
        if (emoji === decodeURIComponent(emoji)) {
            emoji = encodeURIComponent(emoji);
        }

        const _getReactions = async (_options?: GetReactionsOptions): Promise<Array<User>> => {
            const query = new URLSearchParams();
            if (_options?.after !== undefined) {
                query.set("after", _options.after);
            }
            if (_options?.limit !== undefined) {
                query.set("limit", _options.limit.toString());
            }
            return this.#manager.authRequest<Array<RawUser>>({
                method: "GET",
                path:   Routes.CHANNEL_REACTION(channelID, messageID, emoji),
                query
            }).then(data => data.map(d => this.#manager.client.users.update(d)));
        };

        const limit = options?.limit ?? 100;
        let after = options?.after;

        let reactions: Array<User> = [];
        while (reactions.length < limit) {
            const limitLeft = limit - reactions.length;
            const limitToFetch = limitLeft <= 100 ? limitLeft : 100;
            this.#manager.client.emit("debug", `Getting ${limitLeft} more ${emoji} reactions for message ${messageID} on ${channelID}: ${after ?? ""}`);
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
     * Get the stage instance associated with a channel.
     * @param channelID The ID of the channel to get the stage instance on.
     */
    async getStageInstance(channelID: string): Promise<StageInstance> {
        return this.#manager.authRequest<RawStageInstance>({
            method: "GET",
            path:   Routes.STAGE_INSTANCE(channelID)
        }).then(data => new StageInstance(data, this.#manager.client));
    }

    /**
     * Get a thread member.
     * @param channelID The ID of the thread.
     * @param userID The ID of the user to get the thread member of.
     */
    async getThreadMember(channelID: string, userID: string): Promise<ThreadMember> {
        return this.#manager.authRequest<RawThreadMember>({
            method: "GET",
            path:   Routes.CHANNEL_THREAD_MEMBER(channelID, userID)
        }).then(data => ({
            flags:         data.flags,
            id:            data.id,
            joinTimestamp: new Date(data.join_timestamp),
            userID:        data.user_id
        }));
    }

    /**
     * Get the members of a thread.
     * @param channelID The ID of the thread.
     */
    async getThreadMembers(channelID: string): Promise<Array<ThreadMember>> {
        return this.#manager.authRequest<Array<RawThreadMember>>({
            method: "GET",
            path:   Routes.CHANNEL_THREAD_MEMBERS(channelID)
        }).then(data => data.map(d => ({
            flags:         d.flags,
            id:            d.id,
            joinTimestamp: new Date(d.join_timestamp),
            userID:        d.user_id
        })));
    }

    /** @deprecated Get the list of usable voice regions. Moved to `misc`. */
    async getVoiceRegions(): Promise<Array<VoiceRegion>> {
        return this.#manager.authRequest<Array<VoiceRegion>>({
            method: "GET",
            path:   Routes.VOICE_REGIONS
        });
    }

    /**
     * Join a thread.
     * @param channelID The ID of the thread to join.
     */
    async joinThread(channelID: string): Promise<void> {
        await this.#manager.authRequest<null>({
            method: "PUT",
            path:   Routes.CHANNEL_THREAD_MEMBER(channelID, "@me")
        });
    }

    /**
     * Leave a thread.
     * @param channelID The ID of the thread to leave.
     */
    async leaveThread(channelID: string): Promise<void> {
        await this.#manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.CHANNEL_THREAD_MEMBER(channelID, "@me")
        });
    }

    /**
     * Pin a message in a channel.
     * @param channelID The ID of the channel to pin the message in.
     * @param messageID The ID of the message to pin.
     * @param reason The reason for pinning the message.
     */
    async pinMessage(channelID: string, messageID: string, reason?: string): Promise<void> {
        await this.#manager.authRequest<null>({
            method: "PUT",
            path:   Routes.CHANNEL_PINNED_MESSAGE(channelID, messageID),
            reason
        });
    }

    /**
     * Purge an amount of messages from a channel.
     * @param channelID The ID of the channel to purge.
     * @param options The options to purge. `before`, `after`, and `around `All are mutually exclusive.
     */
    async purgeMessages<T extends AnyGuildTextChannel | Uncached = AnyGuildTextChannel | Uncached>(channelID: string, options: PurgeOptions<T>): Promise<number> {
        const filter = options.filter?.bind(this) ?? ((): true => true);

        const messageIDsToPurge: Array<string> = [];
        let chosenOption: "after" | "around" | "before";
        if (options.after) {
            chosenOption = "after";
        } else if (options.around) {
            chosenOption = "around";
        } else if (options.before) {
            chosenOption = "before";
        } else {
            chosenOption = "before";
        }
        let optionValue = options[chosenOption] ?? undefined;

        let finishedFetchingMessages = false;
        let limitWasReach = false;
        const addMessageIDsToPurgeBatch = async (): Promise<void> => {
            const messages = await this.getMessages(channelID, {
                limit:          100,
                [chosenOption]: optionValue
            });

            if (messages.length === 0) {
                finishedFetchingMessages = true;
                return;
            }

            if (chosenOption === "around") {
                finishedFetchingMessages = true;
            } else {
                optionValue = messages.at(-1)!.id;
            }

            const filterPromises: Array<Promise<unknown>> = [];
            const resolvers: Array<(() => void) | null> = [];
            for (const [index, message] of messages.entries()) {
                if (message.timestamp.getTime() < Date.now() - 1209600000) {
                    finishedFetchingMessages = true;
                    break;
                }

                filterPromises.push(new Promise<void>(resolve => {
                    resolvers.push(resolve);

                    void (async (): Promise<void> => {
                        let removedResolver: (() => void) | null = null;

                        if (await filter(message as Message<T>) && !limitWasReach) {
                            messageIDsToPurge.push(message.id);
                            if (messageIDsToPurge.length === options.limit) {
                                limitWasReach = true;
                            }
                        }

                        removedResolver = resolvers[index];
                        resolvers[index] = null;

                        if (removedResolver) {
                            removedResolver();
                        }

                        if (limitWasReach) {
                            for (const [resolverIndex, resolver] of resolvers.entries()) {
                                if (resolver) {
                                    resolver();
                                    resolvers[resolverIndex] = null;
                                }
                            }
                        }
                    })();
                }));
            }

            await Promise.all(filterPromises);

            if (!finishedFetchingMessages && !limitWasReach) {
                await addMessageIDsToPurgeBatch();
            }
        };
        await addMessageIDsToPurgeBatch();

        return this.deleteMessages(channelID, messageIDsToPurge, options.reason);
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
     * @param channelID The ID of the thread to remove them from.
     * @param userID The ID of the user to remove from the thread.
     */
    async removeThreadMember(channelID: string, userID: string): Promise<void> {
        await this.#manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.CHANNEL_THREAD_MEMBER(channelID, userID)
        });
    }

    /**
     * Show a typing indicator in a channel. How long users see this varies from client to client.
     * @param channelID The ID of the channel to show the typing indicator in.
     */
    async sendTyping(channelID: string): Promise<void> {
        await this.#manager.authRequest<null>({
            method: "POST",
            path:   Routes.CHANNEL_TYPING(channelID)
        });
    }

    /**
     * Create a thread from an existing message.
     * @param channelID The ID of the channel to create the thread in.
     * @param messageID The ID of the message to create the thread from.
     * @param options The options for starting the thread.
     */
    async startThreadFromMessage<T extends AnnouncementThreadChannel | PublicThreadChannel = AnnouncementThreadChannel | PublicThreadChannel>(channelID: string, messageID: string, options: StartThreadFromMessageOptions): Promise<T> {
        const reason = options.reason;
        if (options.reason) {
            delete options.reason;
        }
        return this.#manager.authRequest<RawThreadChannel>({
            method: "POST",
            path:   Routes.CHANNEL_MESSAGE_THREADS(channelID, messageID),
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
     * @param channelID The ID of the channel to start the thread in.
     * @param options The options for starting the thread.
     */
    async startThreadInForum(channelID: string, options: StartThreadInForumOptions): Promise<PublicThreadChannel> {
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
            path:   Routes.CHANNEL_THREADS(channelID),
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
     * @param channelID The ID of the channel to start the thread in.
     * @param options The options for starting the thread.
     */
    async startThreadWithoutMessage<T extends AnnouncementThreadChannel | PublicThreadChannel | PrivateThreadChannel = AnnouncementThreadChannel | PublicThreadChannel | PrivateThreadChannel>(channelID: string, options: StartThreadWithoutMessageOptions): Promise<T> {
        const reason = options.reason;
        if (options.reason) {
            delete options.reason;
        }
        return this.#manager.authRequest<RawThreadChannel>({
            method: "POST",
            path:   Routes.CHANNEL_THREADS(channelID),
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
     * @param channelID The ID of the channel to unpin the message in.
     * @param messageID The ID of the message to unpin.
     * @param reason The reason for unpinning the message.
     */
    async unpinMessage(channelID: string, messageID: string, reason?: string): Promise<void> {
        await this.#manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.CHANNEL_PINNED_MESSAGE(channelID, messageID),
            reason
        });
    }
}
