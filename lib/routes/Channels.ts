import BaseRoute from "./BaseRoute";
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
    RawGroupChannel
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

export default class Channels extends BaseRoute {
    /**
     * Add a user to a group channel.
     * @param groupID The ID of the group to add the user to.
     * @param options The options for adding the recipient.
     */
    async addGroupRecipient(groupID: string, options: AddGroupRecipientOptions) {
        await this._manager.authRequest<null>({
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
    async addThreadMember(id: string, userID: string) {
        await this._manager.authRequest<null>({
            method: "PUT",
            path:   Routes.CHANNEL_THREAD_MEMBER(id, userID)
        });
    }
    /**
     * Create a direct message.
     * @param recipient The ID of the recipient of the direct message.
     */
    async createDM(recipient: string) {
        return this._manager.authRequest<RawPrivateChannel>({
            method: "POST",
            path:   Routes.OAUTH_CHANNELS,
            json:   {
                recipient_id: recipient
            } }
        ).then(data => this._client.privateChannels.update(data));
    }

    /**
     * Create a group dm.
     * @param options The options for creating the group dm.
     */
    async createGroupDM(options: CreateGroupChannelOptions) {
        return this._manager.authRequest<RawGroupChannel>({
            method: "POST",
            path:   Routes.OAUTH_CHANNELS,
            json:   {
                access_tokens: options.accessTokens,
                nicks:         options.nicks
            } }).then(data => this._client.groupChannels.update(data));
    }

    /**
     * Create an invite for a channel.
     * @param id The ID of the channel to create an invite for.
     * @param options The options for creating the invite.
     */
    async createInvite<T extends InviteInfoTypes, CH extends InviteChannel = InviteChannel>(id: string, options: CreateInviteOptions) {
        const reason = options.reason;
        if (options.reason) delete options.reason;
        return this._manager.authRequest<RawInvite>({
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
        }).then(data => new Invite<T, CH>(data, this._client));
    }

    /**
     * Create a message in a channel.
     * @param id The ID of the channel to create the message in.
     * @param options The options for creating the message.
     */
    async createMessage<T extends AnyTextChannel = AnyTextChannel>(id: string, options: CreateMessageOptions) {
        const files = options.files;
        if (options.files) delete options.files;
        return this._manager.authRequest<RawMessage>({
            method: "POST",
            path:   Routes.CHANNEL_MESSAGES(id),
            json:   {
                allowed_mentions:  this._client.util.formatAllowedMentions(options.allowedMentions),
                attachments:       options.attachments,
                components:        options.components ? this._client.util.componentsToRaw(options.components) : [],
                content:           options.content,
                embeds:            options.embeds,
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
        }).then(data => new Message<T>(data, this._client));
    }

    /**
     * Add a reaction to a message.
     * @param id The ID of the channel the message is in.
     * @param messageID The ID of the message to add a reaction to.
     * @param emoji The reaction to add to the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     */
    async createReaction(id: string, messageID: string, emoji: string) {
        if (emoji === decodeURIComponent(emoji)) emoji = encodeURIComponent(emoji);
        await this._manager.authRequest<null>({
            method: "PUT",
            path:   Routes.CHANNEL_REACTION_USER(id, messageID, emoji, "@me")
        });
    }

    /**
     * Crosspost a message in an announcement channel.
     * @param id The ID of the channel to crosspost the message in.
     * @param messageID The ID of the message to crosspost.
     */
    async crosspostMessage(id: string, messageID: string) {
        return this._manager.authRequest<RawMessage>({
            method: "POST",
            path:   Routes.CHANNEL_MESSAGES_CROSSPOST(id, messageID)
        }).then(data => new Message<AnnouncementChannel>(data, this._client));
    }

    /**
     * Delete or close a channel.
     * @param id The ID of the channel to delete or close.
     * @param reason The reason to be displayed in the audit log.
     */
    async delete(id: string, reason?: string) {
        await this._manager.authRequest<RawChannel>({
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
    async deleteInvite<T extends InviteChannel = InviteChannel>(code: string, reason?: string) {
        return this._manager.authRequest<RawInvite>({
            method: "DELETE",
            path:   Routes.INVITE(code),
            reason
        }).then(data => new Invite<"withMetadata", T>(data, this._client));
    }

    /**
     * Delete a message.
     * @param id The ID of the channel to delete the message in.
     * @param messageID The ID of the message to delete.
     * @param reason The reason for deleting the message.
     */
    async deleteMessage(id: string, messageID: string, reason?: string) {
        await this._manager.authRequest<RawMessage>({
            method: "DELETE",
            path:   Routes.CHANNEL_MESSAGE(id, messageID),
            reason
        });
    }

    /**
     * Bulk delete messages.
     * @param id The ID of the channel to delete the messages in.
     * @param messageIDs The IDs of the messages to delete. Between 2 and 100 messages, any dupliates or messages older than two weeks will cause an error.
     * @param reason The reason for deleting the messages.
     */
    async deleteMessages(id: string, messageIDs: Array<string>, reason?: string) {
        await this._manager.authRequest<null>({
            method: "POST",
            path:   Routes.CHANNEL_BULK_DELETE_MESSAGES(id),
            json:   {
                messages: messageIDs
            },
            reason
        });
    }

    /**
     * Delete a permission overwrite.
     * @param id The ID of the channel to delete the permission overwrite in.
     * @param overwriteID The ID of the permission overwrite to delete.
     * @param reason The reason for deleting the permission overwrite.
     */
    async deletePermission(id: string, overwriteID: string, reason?: string) {
        await this._manager.authRequest<null>({
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
    async deleteReaction(id: string, messageID: string, emoji: string, user = "@me") {
        if (emoji === decodeURIComponent(emoji)) emoji = encodeURIComponent(emoji);
        await this._manager.authRequest<null>({
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
    async deleteReactions(id: string, messageID: string, emoji?: string) {
        if (emoji && emoji === decodeURIComponent(emoji)) emoji = encodeURIComponent(emoji);
        await this._manager.authRequest<null>({
            method: "DELETE",
            path:   !emoji ? Routes.CHANNEL_REACTIONS(id, messageID) : Routes.CHANNEL_REACTION(id, messageID, emoji)
        });
    }

    /**
     * Edit a channel.
     * @param id The ID of the channel to edit.
     * @param options The options for editing the channel.
     */
    async edit<T extends AnyChannel = AnyChannel>(id: string, options: EditChannelOptions) {
        const reason = options.reason;
        if (options.reason) delete options.reason;
        if (options.icon) {
            try {
                options.icon = this._client.util.convertImage(options.icon);
            } catch (err) {
                throw new Error("Invalid icon provided. Ensure you are providing a valid, fully-qualified base64 url.", { cause: err as Error });
            }
        }

        return this._manager.authRequest<RawChannel>({
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
        }).then(data => Channel.from<T>(data, this._client));
    }

    /**
     * Edit a message.
     * @param id The ID of the channel the message is in.
     * @param messageID The ID of the message to edit.
     * @param options The options for editing the message.
     */
    async editMessage<T extends AnyTextChannel = AnyTextChannel>(id: string, messageID: string, options: EditMessageOptions) {
        const files = options.files;
        if (options.files) delete options.files;
        return this._manager.authRequest<RawMessage>({
            method: "PATCH",
            path:   Routes.CHANNEL_MESSAGE(id, messageID),
            json:   {
                allowed_mentions: this._client.util.formatAllowedMentions(options.allowedMentions),
                attachments:      options.attachments,
                components:       options.components ? this._client.util.componentsToRaw(options.components) : [],
                content:          options.content,
                embeds:           options.embeds,
                flags:            options.flags
            },
            files
        }).then(data => new Message<T>(data, this._client));
    }

    /**
     * Edit a permission overwrite.
     * @param id The ID of the channel to edit the permission overwrite for.
     * @param overwriteID The ID of the permission overwrite to edit.
     * @param options The options for editing the permission overwrite.
     */
    async editPermission(id: string, overwriteID: string, options: EditPermissionOptions) {
        const reason = options.reason;
        if (options.reason) delete options.reason;
        await this._manager.authRequest<null>({
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
    async followAnnouncement(id: string, webhookChannelID: string) {
        return this._manager.authRequest<RawFollowedChannel>({
            method: "POST",
            path:   Routes.CHANNEL_FOLLOWERS(id),
            json:   {
                webhook_channel_id: webhookChannelID
            }
        }).then(data => ({
            channelID: data.channel_id,
            webhookID: data.webhook_id
        }) as FollowedChannel);
    }

    /**
     * Get a channel.
     * @param id The ID of the channel to get.
     */
    async get<T extends AnyChannel = AnyChannel>(id: string) {
        return this._manager.authRequest<RawChannel>({
            method: "GET",
            path:   Routes.CHANNEL(id)
        }).then(data => Channel.from<T>(data, this._client));
    }

    /**
     * Get an invite.
     * @param code The code of the invite to get.
     * @param options The options for getting the invite.
     */
    async getInvite<T extends InviteChannel = InviteChannel>(code: string, options: GetInviteWithNoneOptions): Promise<Invite<"withMetadata", T>>;
    async getInvite<T extends InviteChannel = InviteChannel>(code: string, options: GetInviteWithCountsAndExpirationOptions): Promise<Invite<"withMetadata" | "withCounts" | "withExpiration", T>>;
    async getInvite<T extends InviteChannel = InviteChannel>(code: string, options: GetInviteWithCountsOptions): Promise<Invite<"withMetadata" | "withCounts", T>>;
    async getInvite<T extends InviteChannel = InviteChannel>(code: string, options: GetInviteWithExpirationOptions): Promise<Invite<"withMetadata" | "withExpiration", T>>;
    async getInvite<T extends InviteChannel = InviteChannel>(code: string, options?: GetInviteOptions) {
        const query = new URLSearchParams();
        if (options?.guildScheduledEventID) query.set("guild_scheduled_event_id", options.guildScheduledEventID);
        if (options?.withCounts) query.set("with_counts", "true");
        if (options?.withExpiration) query.set("with_expiration", "true");
        return this._manager.authRequest<RawInvite>({
            method: "GET",
            path:   Routes.INVITE(code),
            query
        }).then(data => new Invite<never, T>(data, this._client));
    }

    /**
     * Get the invites of a channel.
     * @param id The ID of the channel to get the invites of.
     */
    async getInvites<T extends InviteChannel = InviteChannel>(id: string) {
        return this._manager.authRequest<Array<RawInvite>>({
            method: "GET",
            path:   Routes.CHANNEL_INVITES(id)
        }).then(data => data.map(invite => new Invite<"withMetadata", T>(invite, this._client)));
    }

    /**
     * Get the private archived threads the current user has joined in a channel.
     * @param id The ID of the channel to get the archived threads from.
     * @param options The options for getting the archived threads.
     */
    async getJoinedPrivateArchivedThreads(id: string, options?: GetArchivedThreadsOptions) {
        return this._manager.authRequest<RawArchivedThreads<RawPrivateThreadChannel>>({
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
            threads: data.threads.map(d => Channel.from<PrivateThreadChannel>(d, this._client))
        }) as ArchivedThreads<PrivateThreadChannel>);
    }

    /**
     * Get a message in a channel.
     * @param id The ID of the channel the message is in
     * @param messageID The ID of the message to get.
     */
    async getMessage<T extends AnyTextChannel = AnyTextChannel>(id: string, messageID: string) {
        return this._manager.authRequest<RawMessage>({
            method: "GET",
            path:   Routes.CHANNEL_MESSAGE(id, messageID)
        }).then(data => new Message<T>(data, this._client));
    }

    /**
     * Get messages in a channel.
     * @param id The ID of the channel to get messages from.
     * @param options The options for getting messages. All are mutually exclusive.
     */
    async getMessages<T extends AnyTextChannel = AnyTextChannel>(id: string, options?: GetChannelMessagesOptions) {
        return this._manager.authRequest<Array<RawMessage>>({
            method: "GET",
            path:   Routes.CHANNEL_MESSAGES(id),
            json:   {
                after:  options?.after,
                around: options?.around,
                before: options?.before,
                limit:  options?.limit
            }
        }).then(data => data.map(d => new Message<T>(d, this._client)));
    }

    /**
     * Get the pinned messages in a channel.
     * @param id The ID of the channel to get the pinned messages from.
     */
    async getPinnedMessages<T extends AnyTextChannel = AnyTextChannel>(id: string) {
        return this._manager.authRequest<Array<RawMessage>>({
            method: "GET",
            path:   Routes.CHANNEL_PINS(id)
        }).then(data => data.map(d => new Message<T>(d, this._client)));
    }

    /**
     * Get the private archived threads in a channel.
     * @param id The ID of the channel to get the archived threads from.
     * @param options The options for getting the archived threads.
     */
    async getPrivateArchivedThreads(id: string, options?: GetArchivedThreadsOptions) {
        return this._manager.authRequest<RawArchivedThreads<RawPrivateThreadChannel>>({
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
            threads: data.threads.map(d => Channel.from<PrivateThreadChannel>(d, this._client))
        }) as ArchivedThreads<PrivateThreadChannel>);
    }

    /**
     * Get the public archived threads in a channel.
     * @param id The ID of the channel to get the archived threads from.
     * @param options The options for getting the archived threads.
     */
    async getPublicArchivedThreads<T extends AnnouncementThreadChannel | PublicThreadChannel = AnnouncementThreadChannel | PublicThreadChannel>(id: string, options?: GetArchivedThreadsOptions) {
        return this._manager.authRequest<RawArchivedThreads<RawAnnouncementThreadChannel | RawPublicThreadChannel>>({
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
            threads: data.threads.map(d => Channel.from<T>(d, this._client))
        }) as ArchivedThreads<T>);
    }

    /**
     * Get the users who reacted with a specific emoji on a message.
     * @param id The ID of the channel the message is in.
     * @param messageID The ID of the message to get reactions from.
     * @param emoji The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param options The options for getting the reactions.
     */
    async getReactions(id: string, messageID: string, emoji: string, options?: GetReactionsOptions) {
        if (emoji === decodeURIComponent(emoji)) emoji = encodeURIComponent(emoji);
        return this._manager.authRequest<Array<RawUser>>({
            method: "GET",
            path:   Routes.CHANNEL_REACTION(id, messageID, emoji),
            json:   {
                after: options?.after,
                limit: options?.limit
            }
        }).then(data => data.map(d => this._client.users.update(d)));
    }

    /**
     * Get a thread member.
     * @param id The ID of the thread.
     * @param userID The ID of the user to get the thread member of.
     */
    async getThreadMember(id: string, userID: string) {
        return this._manager.authRequest<RawThreadMember>({
            method: "GET",
            path:   Routes.CHANNEL_THREAD_MEMBER(id, userID)
        }).then(data => ({
            flags:         data.flags,
            id:            data.id,
            joinTimestamp: new Date(data.join_timestamp),
            userID:        data.user_id
        }) as ThreadMember);
    }

    /**
     * Get the members of a thread.
     * @param id The ID of the thread.
     */
    async getThreadMembers(id: string) {
        return this._manager.authRequest<Array<RawThreadMember>>({
            method: "GET",
            path:   Routes.CHANNEL_THREAD_MEMBERS(id)
        }).then(data => data.map(d => ({
            flags:         d.flags,
            id:            d.id,
            joinTimestamp: new Date(d.join_timestamp),
            userID:        d.user_id
        }) as ThreadMember));
    }

    /**
     * Get the list of usable voice regions.
     */
    async getVoiceRegions() {
        return this._manager.authRequest<Array<VoiceRegion>>({
            method: "GET",
            path:   Routes.VOICE_REGIONS
        });
    }

    /**
     * Join a thread.
     * @param id The ID of the thread to join.
     */
    async joinThread(id: string) {
        await this._manager.authRequest<null>({
            method: "PUT",
            path:   Routes.CHANNEL_THREAD_MEMBER(id, "@me")
        });
    }

    /**
     * Leave a thread.
     * @param id The ID of the thread to leave.
     */
    async leaveThread(id: string) {
        await this._manager.authRequest<null>({
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
    async pinMessage(id: string, messageID: string, reason?: string) {
        await this._manager.authRequest<null>({
            method: "PUT",
            path:   Routes.CHANNEL_PINNED_MESSAGE(id, messageID),
            reason
        });
    }

    /**
     * Remove a user from the group channel.
     * @param groupID The ID of the group to remove the user from.
     * @param userID The ID of the user to remove.
     */
    async removeGroupRecipient(groupID: string, userID: string) {
        await this._manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.GROUP_RECIPIENT(groupID, userID)
        });
    }

    /**
     * Remove a member from a thread.
     * @param id The ID of the thread to remove them from.
     * @param userID The ID of the user to remove from the thread.
     */
    async removeThreadMember(id: string, userID: string) {
        await this._manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.CHANNEL_THREAD_MEMBER(id, userID)
        });
    }

    /**
     * Show a typing indicator in a channel. How long users see this varies from client to client.
     * @param id The ID of the channel to show the typing indicator in.
     */
    async sendTyping(id: string) {
        await this._manager.authRequest<null>({
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
    async startThreadFromMessage<T extends AnnouncementThreadChannel | PublicThreadChannel = AnnouncementThreadChannel | PublicThreadChannel>(id: string, messageID: string, options: StartThreadFromMessageOptions) {
        const reason = options.reason;
        if (options.reason) delete options.reason;
        return this._manager.authRequest<RawChannel>({
            method: "POST",
            path:   Routes.CHANNEL_MESSAGE_THREADS(id, messageID),
            json:   {
                auto_archive_duration: options.autoArchiveDuration,
                name:                  options.name,
                rate_limit_per_user:   options.rateLimitPerUser
            },
            reason
        }).then(data => Channel.from<T>(data, this._client));
    }

    /**
     * Create a thread in a forum channel.
     * @param id The ID of the channel to start the thread in.
     * @param options The options for starting the thread
     */
    async startThreadInForum(id: string, options: StartThreadInForumOptions) {
        const reason = options.reason;
        if (options.reason) delete options.reason;
        const files = options.message.files;
        if (options.message.files) delete options.message.files;
        return this._manager.authRequest<RawChannel>({
            method: "POST",
            path:   Routes.CHANNEL_THREADS(id),
            json:   {
                auto_archive_duration: options.autoArchiveDuration,
                message:               {
                    allowed_mentions: this._client.util.formatAllowedMentions(options.message.allowedMentions),
                    attachments:      options.message.attachments,
                    components:       options.message.components ? this._client.util.componentsToRaw(options.message.components) : [],
                    content:          options.message.content,
                    embeds:           options.message.embeds,
                    flags:            options.message.flags,
                    sticker_ids:      options.message.stickerIDs
                },
                name:                options.name,
                rate_limit_per_user: options.rateLimitPerUser
            },
            reason,
            files
        }).then(data => Channel.from<PublicThreadChannel>(data, this._client));
    }

    /**
     * Create a thread without an existing message.
     * @param id The ID of the channel to start the thread in.
     * @param options The options for starting the thread.
     */
    async startThreadWithoutMessage<T extends AnnouncementThreadChannel | PublicThreadChannel | PrivateThreadChannel = AnnouncementThreadChannel | PublicThreadChannel | PrivateThreadChannel>(id: string, options: StartThreadWithoutMessageOptions) {
        const reason = options.reason;
        if (options.reason) delete options.reason;
        return this._manager.authRequest<RawChannel>({
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
        }).then(data => Channel.from<T>(data, this._client));
    }

    /**
     * Unpin a message in a channel.
     * @param id The ID of the channel to unpin the message in.
     * @param messageID The ID of the message to unpin.
     * @param reason The reason for unpinning the message.
     */
    async unpinMessage(id: string, messageID: string, reason?: string) {
        await this._manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.CHANNEL_PINNED_MESSAGE(id, messageID),
            reason
        });
    }
}
