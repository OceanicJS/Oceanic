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
    FollowAnnouncementChannelOptions,
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
    RawOverwrite,
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
import {
    ChannelTypes,
    InviteTargetTypes,
    OverwriteTypes,
    ThreadAutoArchiveDuration,
    ThreadChannelTypes,
    VideoQualityModes
} from "../Constants";
import * as Routes from "../util/Routes";
import Message from "../structures/Message";
import { File } from "../types/request-handler";
import type { CreateGroupChannelOptions, RawUser } from "../types/users";
import User from "../structures/User";
import Invite from "../structures/Invite";
import type AnnouncementThreadChannel from "../structures/AnnouncementThreadChannel";
import type PublicThreadChannel from "../structures/PublicThreadChannel";
import type PrivateThreadChannel from "../structures/PrivateThreadChannel";
import type AnnouncementChannel from "../structures/AnnouncementChannel";
import type { VoiceRegion } from "../types/voice";
import Channel from "../structures/Channel";
import PrivateChannel from "../structures/PrivateChannel";
import GroupChannel from "../structures/GroupChannel";

export default class Channels extends BaseRoute {
    /**
     * Add a user to a group channel.
     *
     * @param {String} groupID - The id of the group to add the user to.
     * @param {Object} options
     * @param {String} options.accessToken - The access token of the user to add.
     * @param {String} [options.nick] - The nickname of the user to add.
     * @param {String} options.userID - The id of the user to add.
     * @returns {Promise<void>}
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
     *
     * @param {String} id - The id of the thread to add them to.
     * @param {String} userID - The id of the user to add to the thread.
     * @returns {Promise<void>}
     */
    async addThreadMember(id: string, userID: string) {
        await this._manager.authRequest<null>({
            method: "PUT",
            path:   Routes.CHANNEL_THREAD_MEMBER(id, userID)
        });
    }
    /**
     * Create a direct message.
     *
     * @param {String} recipient - The id of the recipient of the direct message.
     * @returns {Promise<PrivateChannel>}
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
     *
     * @param {Object} options
     * @param {String[]} options.accessTokens - An array of access tokens with the `gdm.join` scope.
     * @param {Object} [options.nicks] - A dictionary of ids to nicknames, looks unused.
     * @returns {Promise<GroupChannel>}
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
     *
     * @param {String} id - The id of the channel to create an invite for.
     * @param {Object} options
     * @param {Number} [options.maxAge] - How long the invite should last.
     * @param {Number} [options.maxUses] - How many times the invite can be used.
     * @param {String} [options.reason] - The reason for creating the invite.
     * @param {String} [options.targetApplicationID] - The id of the embedded application to open for this invite.
     * @param {InviteTargetTypes} [options.targetType] - The [type of target](https://discord.com/developers/docs/resources/channel#invite-target-types) for the invite.
     * @param {String} [options.targetUserID] - The id of the user whose stream to display for this invite.
     * @param {Boolean} [options.temporary] - If the invite should be temporary.
     * @param {Boolean} [options.unique] - If the invite should be unique.
     * @returns {Promise<Invite>}
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
     *
     * @template {AnyTextChannel} T
     * @param {String} id - The id of the channel to create the message in.
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
     * @param {Number} [options.flags] - The [flags](https://discord.com/developers/docs/resources/channel#message-object-message-flags) to send with the message.
     * @param {String[]} [options.stickerIDs] - The IDs of up to 3 stickers from the current guild to send.
     * @param {Object} [options.messageReference] - Reply to a message.
     * @param {String} [options.messageReference.channelID] - The id of the channel the replied message is in.
     * @param {Boolean} [options.messageReference.failIfNotExists] - If creating the message should fail if the message to reply to does not exist.
     * @param {String} [options.messageReference.guildID] - The id of the guild the replied message is in.
     * @param {String} [options.messageReference.messageID] - The id of the message to reply to.
     * @param {Boolean} [options.tts] - If the message should be spoken aloud.
     * @returns {Promise<Message<T>>}
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
     *
     * @param {String} id - The id of the channel the message is in.
     * @param {String} messageID - The id of the message to add a reaction to.
     * @param {String} emoji - The reaction to add to the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @returns {Promise<void>}
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
     *
     * @param {String} id - The id of the channel to crosspost the message in.
     * @param {String} messageID - The id of the message to crosspost.
     * @returns {Promise<Message<AnnouncementChannel>>}
     */
    async crosspostMessage(id: string, messageID: string) {
        return this._manager.authRequest<RawMessage>({
            method: "POST",
            path:   Routes.CHANNEL_MESSAGES_CROSSPOST(id, messageID)
        }).then(data => new Message<AnnouncementChannel>(data, this._client));
    }

    /**
     * Delete or close a channel.
     *
     * @param {String} id - The ID of the channel to delete or close.
     * @param {String} [reason] - The reason to be displayed in the audit log.
     * @returns {Promise<void>}
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
     *
     * @param {String} code - The code of the invite to delete.
     * @param {String} [reason] - The reason for deleting the invite.
     * @returns {Promise<Invite>}
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
     *
     * @param {String} id - The id of the channel to delete the message in.
     * @param {String} messageID - The id of the message to delete.
     * @param {String} [reason] - The reason for deleting the message.
     * @returns {Promise<void>}
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
     *
     * @param {String} id - The id of the channel to delete the messages in.
     * @param {String[]} messageIDs - The ids of the messages to delete. Between 2 and 100 messages, any dupliates or messages older than two weeks will cause an error.
     * @param {String} [reason] - The reason for deleting the messages.
     * @returns {Promise<void>}
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
     *
     * @param {String} id - The id of the channel to delete the permission overwrite in.
     * @param {String} overwriteID - The id of the permission overwrite to delete.
     * @param {String} reason - The reason for deleting the permission overwrite.
     * @returns {Promise<void>}
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
     *
     * @param {String} id - The id of the channel the message is in.
     * @param {String} messageID - The id of the message to remove a reaction from.
     * @param {String} emoji - The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param {String} [user="@me"] - The user to remove the reaction from, `@me` for the current user (default).
     * @returns {Promise<void>}
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
     *
     * @param {String} id - The id of the channel the message is in.
     * @param {String} messageID - The id of the message to remove reactions from.
     * @param {String} [emoji] - The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis. Omit to remove all reactions.
     * @returns {Promise<void>}
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
     *
     * @param {String} id - The id of the channel to edit.
     * @param {Object} options
     * @param {Boolean} [options.archived] - [Thread] If the thread is archived.
     * @param {ThreadAutoArchiveDuration} [options.autoArchiveDuration] - [Thread] The duration after which the thread will be archived.
     * @param {?Number} [options.bitrate] - [Voice, Stage] The bitrate of the channel. Minimum 8000.
     * @param {?ThreadAutoArchiveDuration} [options.defaultAutoArchiveDuration] - [Text, Announcement] The default auto archive duration for threads made in this channel.
     * @param {Number} [options.flags] - [Thread] The [channel flags](https://discord.com/developers/docs/resources/channel#channel-object-channel-flags) to set on the channel.
     * @param {?String} [options.icon] - [Group DM] The icon of the channel.
     * @param {Boolean} [options.invitable] - [Private Thread] If non-moderators can add other non-moderators to the thread. Private threads only.
     * @param {Boolean} [options.locked] - [Thread] If the thread should be locked.
     * @param {String} [options.name] - [All] The name of the channel.
     * @param {?Boolean} [options.nsfw] -[Text, Voice, Announcement] - If the channel is age gated.
     * @param {?String} [options.parentID] - [Text, Voice, Announcement] The id of the parent category channel.
     * @param {?RawOverwrite[]} [options.permissionOverwrites] - [All Guild] Channel or category specific permissions
     * @param {?Number} [options.position] - [All Guild] The position of the channel in the channel list.
     * @param {?Number} [options.rateLimitPerUser] - [Thread, Text] The seconds between sending messages for users. Between 0 and 21600.
     * @param {String} [options.reason] - The reason to be displayed in the audit log.
     * @param {?String} [options.rtcRegion] - [Voice, Stage] The voice region id of the channel, null for automatic.
     * @param {?String} [options.topic] - [Text, Announcement] The topic of the channel.
     * @param {ChannelTypes.GUILD_TEXT | ChannelTypes.GUILD_ANNOUNCEMENT} [options.type] - [Text, Announcement] Provide the opposite type to convert the channel.
     * @param {?Number} [options.userLimit] - [Voice] The maximum amount of users in the channel. `0` is unlimited, values range 1-99.
     * @param {?VideoQualityModes} [options.videoQualityMode] - [Voice] The [video quality mode](https://discord.com/developers/docs/resources/channel#channel-object-video-quality-modes) of the channel.
     * @returns {Promise<AnyChannel>}
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
     *
     * @template {AnyTextChannel} T
     * @param {String} id - The id of the channel the message is in.
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
     * @returns {Promise<Message<T>>}
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
     *
     * @param {String} id - The id of the channel to edit the permission overwrite for.
     * @param {String} overwriteID - The id of the permission overwrite to edit.
     * @param {Object} options
     * @param {(BigInt | String)} [options.allow] - The permissions to allow.
     * @param {(BigInt | String)} [options.deny] - The permissions to deny.
     * @param {String} [options.reason] - The reason for editing the permission.
     * @param {OverwriteTypes} [options.type] - The type of the permission overwrite.
     * @returns {Promise<void>}
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
     *
     * @param {String} id - The id of the channel to follow the announcement channel to.
     * @param {Object} options
     * @param {String} [options.webhookChannelID] - The id of the channel to follow.
     * @returns {Promise<FollowedChannel>}
     */
    async followAnnouncement(id: string, options?: FollowAnnouncementChannelOptions) {
        return this._manager.authRequest<RawFollowedChannel>({
            method: "POST",
            path:   Routes.CHANNEL_FOLLOWERS(id),
            json:   options
        }).then(data => ({
            channelID: data.channel_id,
            webhookID: data.webhook_id
        }) as FollowedChannel);
    }

    /**
     * Get a channel.
     *
     * @param {String} id - The id of the channel to get.
     * @returns {Promise<AnyChannel>}
     */
    async get<T extends AnyChannel = AnyChannel>(id: string) {
        return this._manager.authRequest<RawChannel>({
            method: "GET",
            path:   Routes.CHANNEL(id)
        }).then(data => Channel.from<T>(data, this._client));
    }

    /**
     * Get an invite.
     *
     * @param {String} code - The code of the invite to get.
     * @param {Object} [options]
     * @param {String} [options.guildScheduledEventID] - The id of the guild scheduled event to include with the invite.
     * @param {Boolean} [options.withCounts] - If the invite should contain approximate member counts.
     * @param {Boolean} [options.withExpiration] - If the invite should contain expiration data.
     * @returns {Promise<Invite>}
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
     *
     * @param {String} id - The id of the channel to get the invites of.
     * @returns {Promise<Invite[]>} - An array of invites with metadata.
     */
    async getInvites<T extends InviteChannel = InviteChannel>(id: string) {
        return this._manager.authRequest<Array<RawInvite>>({
            method: "GET",
            path:   Routes.CHANNEL_INVITES(id)
        }).then(data => data.map(invite => new Invite<"withMetadata", T>(invite, this._client)));
    }

    /**
     * Get the private archived threads the current user has joined in a channel.
     *
     * @param {String} id - The id of the channel to get the archived threads from.
     * @param {Object} [options]
     * @param {String} [options.before] - A **timestamp** to get threads before.
     * @param {Number} [options.limit] - The maximum amount of threads to get.
     * @returns {Promise<ArchivedThreads<PrivateThreadChannel>>}
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
     *
     * @template {AnyTextChannel} T
     * @param {String} id - The id of the channel the message is in
     * @param {String} messageID - The id of the message to get.
     * @returns {Promise<Message<T>>}
     */
    async getMessage<T extends AnyTextChannel = AnyTextChannel>(id: string, messageID: string) {
        return this._manager.authRequest<RawMessage>({
            method: "GET",
            path:   Routes.CHANNEL_MESSAGE(id, messageID)
        }).then(data => new Message<T>(data, this._client));
    }

    /**
     * Get messages in a channel.
     *
     * @template {AnyTextChannel} T
     * @param {String} id - The id of the channel to get messages from.
     * @param {Object} options - All options are mutually exclusive.
     * @param {String} [options.after] - Get messages after this message id.
     * @param {String} [options.around] - Get messages around this message id.
     * @param {String} [options.before] - Get messages before this message id.
     * @param {Number} [options.limit] - The maximum amount of messages to get.
     * @returns {Promise<Message<T>[]>}
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
     *
     * @template {AnyTextChannel} T
     * @param {String} id - The id of the channel to get the pinned messages from.
     * @returns {Promise<Message<T>[]>}
     */
    async getPinnedMessages<T extends AnyTextChannel = AnyTextChannel>(id: string) {
        return this._manager.authRequest<Array<RawMessage>>({
            method: "GET",
            path:   Routes.CHANNEL_PINS(id)
        }).then(data => data.map(d => new Message<T>(d, this._client)));
    }

    /**
     * Get the private archived threads in a channel.
     *
     * @param {String} id - The id of the channel to get the archived threads from.
     * @param {Object} [options]
     * @param {String} [options.before] - A **timestamp** to get threads before.
     * @param {Number} [options.limit] - The maximum amount of threads to get.
     * @returns {Promise<ArchivedThreads<PrivateThreadChannel>>}
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
     *
     * @template {(AnnouncementThreadChannel | PublicThreadChannel)} T
     * @param {String} id - The id of the channel to get the archived threads from.
     * @param {Object} [options]
     * @param {String} [options.before] - A **timestamp** to get threads before.
     * @param {Number} [options.limit] - The maximum amount of threads to get.
     * @returns {Promise<ArchivedThreads<T>>}
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
     *
     * @param {String} id - The id of the channel the message is in.
     * @param {String} messageID - The id of the message to get reactions from.
     * @param {String} emoji - The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param {Object} [options] - Options for the request.
     * @param {String} [options.after] - Get users after this user id.
     * @param {Number} [options.limit] - The maximum amount of users to get.
     * @returns {Promise<User[]>}
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
     *
     * @param {String} id - The id of the thread.
     * @param {String} userID - The id of the user to get the thread member of.
     * @returns {Promise<ThreadMember>}
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
     *
     * @param {String} id - The id of the thread.
     * @returns {Promise<ThreadMember[]>}
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
     *
     * @returns {Promise<VoiceRegion[]>}
     */
    async getVoiceRegions() {
        return this._manager.authRequest<Array<VoiceRegion>>({
            method: "GET",
            path:   Routes.VOICE_REGIONS
        });
    }

    /**
     * Join a thread.
     *
     * @param {String} id - The id of the thread to join.
     * @returns {Promise<void>}
     */
    async joinThread(id: string) {
        await this._manager.authRequest<null>({
            method: "PUT",
            path:   Routes.CHANNEL_THREAD_MEMBER(id, "@me")
        });
    }

    /**
     * Leave a thread.
     *
     * @param {String} id - The id of the thread to leave.
     * @returns {Promise<void>}
     */
    async leaveThread(id: string) {
        await this._manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.CHANNEL_THREAD_MEMBER(id, "@me")
        });
    }

    /**
     * Pin a message in a channel.
     *
     * @param {String} id - The id of the channel to pin the message in.
     * @param {String} messageID - The id of the message to pin.
     * @param {String} [reason] - The reason for pinning the message.
     * @returns {Promise<void>}
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
     *
     * @param {String} groupID - The id of the group to remove the user from.
     * @param {String} userID - The id of the user to remove.
     * @returns {Promise<void>}
     */
    async removeGroupRecipient(groupID: string, userID: string) {
        await this._manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.GROUP_RECIPIENT(groupID, userID)
        });
    }

    /**
     * Remove a member from a thread.
     *
     * @param {String} id - The id of the thread to remove them from.
     * @param {String} userID - The id of the user to remove from the thread.
     * @returns {Promise<void>}
     */
    async removeThreadMember(id: string, userID: string) {
        await this._manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.CHANNEL_THREAD_MEMBER(id, userID)
        });
    }

    /**
     * Show a typing indicator in a channel. How long users see this varies from client to client.
     *
     * @param {String} id - The id of the channel to show the typing indicator in.
     * @returns {Promise<void>}
     */
    async sendTyping(id: string) {
        await this._manager.authRequest<null>({
            method: "POST",
            path:   Routes.CHANNEL_TYPING(id)
        });
    }

    /**
     * Create a thread from an existing message.
     *
     * @template {(AnnouncementThreadChannel | PublicThreadChannel)} T
     * @param {String} id - The id of the channel to create the thread in.
     * @param {String} messageID - The id of the message to create the thread from.
     * @param {Object} options
     * @param {ThreadAutoArchiveDuration} [options.autoArchiveDuration] - The duration of no activity after which this thread will be automatically archived.
     * @param {String} options.name - The name of the thread.
     * @param {Number?} [options.rateLimitPerUser] - The amount of seconds a user has to wait before sending another message.
     * @param {String} [options.reason] - The reason for creating the thread.
     * @returns {Promise<T>}
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
     *
     * @param {String} id
     * @param {Object} options
     * @param {ThreadAutoArchiveDuration} [options.autoArchiveDuration] - The duration of no activity after which this thread will be automatically archived.
     * @param {String} options.name - The name of the thread.
     * @param {Number?} [options.rateLimitPerUser] - The amount of seconds a user has to wait before sending another message.
     * @param {String} [options.reason] - The reason for creating the thread.
     * @param {Object} options.message - The message to start the thread with.
     * @param {Object} [options.message.allowedMentions] - An object that specifies the allowed mentions in this message.
     * @param {Boolean} [options.message.allowedMentions.everyone] - If `@everyone`/`@here` mentions should be allowed.
     * @param {Boolean} [options.message.allowedMentions.repliedUser] - If the replied user (`messageReference`) should be mentioned.
     * @param {(Boolean | String[])} [options.message.allowedMentions.roles] - An array of role ids that are allowed to be mentioned, or a boolean value to allow all or none.
     * @param {(Boolean | String[])} [options.message.allowedMentions.users] - An array of user ids that are allowed to be mentioned, or a boolean value to allow all or none.
     * @param {Object[]} [options.message.attachments] - An array of [attachment information](https://discord.com/developers/docs/resources/channel#attachment-object) related to the sent files.
     * @param {Object[]} [options.message.components] - An array of [components](https://discord.com/developers/docs/interactions/message-components) to send.
     * @param {String} [options.message.content] - The content of the message.
     * @param {Object[]} [options.message.embeds] - An array of [embeds](https://discord.com/developers/docs/resources/channel#embed-object) to send.
     * @param {File[]} [options.message.files] - The files to send.
     * @param {Number} [options.message.flags] - The [flags](https://discord.com/developers/docs/resources/channel#message-object-message-flags) to send with the message.
     * @param {String[]} [options.message.stickerIDs] - The IDs of up to 3 stickers from the current guild to send.
     * @returns {Promise<PublicThreadChannel>}
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
     *
     * @template {(AnnouncementThreadChannel | PublicThreadChannel | PrivateThreadChannel)} T
     * @param {String} id
     * @param {Object} options
     * @param {ThreadAutoArchiveDuration} [options.autoArchiveDuration] - The duration of no activity after which this thread will be automatically archived.
     * @param {Boolean} [options.invitable] - [Private] If non-moderators can add other non-moderators to the thread.
     * @param {String} options.name - The name of the thread.
     * @param {Number?} [options.rateLimitPerUser] - The amount of seconds a user has to wait before sending another message.
     * @param {String} [options.reason] - The reason for creating the thread.
     * @param {ThreadChannelTypes} [options.type] - The type of thread to create.
     * @returns {Promise<T>}
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
     *
     * @param {String} id - The id of the channel to unpin the message in.
     * @param {String} messageID - The id of the message to unpin.
     * @param {String} [reason] - The reason for unpinning the message.
     * @returns {Promise<void>}
     */
    async unpinMessage(id: string, messageID: string, reason?: string) {
        await this._manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.CHANNEL_PINNED_MESSAGE(id, messageID),
            reason
        });
    }
}
