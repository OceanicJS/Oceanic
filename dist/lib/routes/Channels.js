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
const Constants_1 = require("../Constants");
const Routes = __importStar(require("../util/Routes"));
const Message_1 = __importDefault(require("../structures/Message"));
const Invite_1 = __importDefault(require("../structures/Invite"));
const Channel_1 = __importDefault(require("../structures/Channel"));
class Channels extends BaseRoute_1.default {
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
    async addGroupRecipient(groupID, options) {
        await this._manager.authRequest({
            method: "PUT",
            path: Routes.GROUP_RECIPIENT(groupID, options.userID),
            json: {
                access_token: options.accessToken,
                nick: options.nick
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
    async addThreadMember(id, userID) {
        await this._manager.authRequest({
            method: "PUT",
            path: Routes.CHANNEL_THREAD_MEMBER(id, userID)
        });
    }
    /**
     * Create a direct message.
     *
     * @param {String} recipient - The id of the recipient of the direct message.
     * @returns {Promise<PrivateChannel>}
     */
    async createDM(recipient) {
        return this._manager.authRequest({
            method: "POST",
            path: Routes.OAUTH_CHANNELS,
            json: {
                recipient_id: recipient
            }
        }).then(data => this._client.privateChannels.update(data));
    }
    /**
     * Create a group dm.
     *
     * @param {Object} options
     * @param {String[]} options.accessTokens - An array of access tokens with the `gdm.join` scope.
     * @param {Object} [options.nicks] - A dictionary of ids to nicknames, looks unused.
     * @returns {Promise<GroupChannel>}
     */
    async createGroupDM(options) {
        return this._manager.authRequest({
            method: "POST",
            path: Routes.OAUTH_CHANNELS,
            json: {
                access_tokens: options.accessTokens,
                nicks: options.nicks
            }
        }).then(data => this._client.groupChannels.update(data));
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
    async createInvite(id, options) {
        const reason = options.reason;
        if (options.reason)
            delete options.reason;
        return this._manager.authRequest({
            method: "POST",
            path: Routes.CHANNEL_INVITES(id),
            json: {
                max_age: options.maxAge,
                max_uses: options.maxUses,
                target_application_id: options.targetApplicationID,
                target_type: options.targetType,
                target_user_id: options.targetUserID,
                temporary: options.temporary,
                unique: options.unique
            },
            reason
        }).then(data => new Invite_1.default(data, this._client));
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
    async createMessage(id, options) {
        const files = options.files;
        if (options.files)
            delete options.files;
        return this._manager.authRequest({
            method: "POST",
            path: Routes.CHANNEL_MESSAGES(id),
            json: {
                allowed_mentions: this._client._formatAllowedMentions(options.allowedMentions),
                attachments: options.attachments,
                components: options.components?.map(row => ({
                    type: row.type,
                    components: row.components.map(component => {
                        if (component.type === Constants_1.ComponentTypes.BUTTON) {
                            if (component.style === Constants_1.ButtonStyles.LINK)
                                return component;
                            else
                                return {
                                    custom_id: component.customID,
                                    disabled: component.disabled,
                                    emoji: component.emoji,
                                    label: component.label,
                                    style: component.style,
                                    type: component.type
                                };
                        }
                        else
                            return {
                                custom_id: component.customID,
                                disabled: component.disabled,
                                max_values: component.maxValues,
                                min_values: component.minValues,
                                options: component.options,
                                placeholder: component.placeholder,
                                type: component.type
                            };
                    })
                })),
                content: options.content,
                embeds: options.embeds,
                flags: options.flags,
                sticker_ids: options.stickerIDs,
                message_reference: !options.messageReference ? undefined : {
                    channel_id: options.messageReference.channelID,
                    fail_if_not_exists: options.messageReference.failIfNotExists,
                    guild_id: options.messageReference.guildID,
                    message_id: options.messageReference.messageID
                },
                tts: options.tts
            },
            files
        }).then(data => new Message_1.default(data, this._client));
    }
    /**
     * Add a reaction to a message.
     *
     * @param {String} id - The id of the channel the message is in.
     * @param {String} messageID - The id of the message to add a reaction to.
     * @param {String} emoji - The reaction to add to the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @returns {Promise<void>}
     */
    async createReaction(id, messageID, emoji) {
        if (emoji === decodeURIComponent(emoji))
            emoji = encodeURIComponent(emoji);
        await this._manager.authRequest({
            method: "PUT",
            path: Routes.CHANNEL_REACTION_USER(id, messageID, emoji, "@me")
        });
    }
    /**
     * Crosspost a message in an announcement channel.
     *
     * @param {String} id - The id of the channel to crosspost the message in.
     * @param {String} messageID - The id of the message to crosspost.
     * @returns {Promise<Message<AnnouncementChannel>>}
     */
    async crosspostMessage(id, messageID) {
        return this._manager.authRequest({
            method: "POST",
            path: Routes.CHANNEL_MESSAGES_CROSSPOST(id, messageID)
        }).then(data => new Message_1.default(data, this._client));
    }
    /**
     * Delete or close a channel.
     *
     * @param {String} id - The ID of the channel to delete or close.
     * @param {String} [reason] - The reason to be displayed in the audit log.
     * @returns {Promise<void>}
     */
    async delete(id, reason) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.CHANNEL(id),
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
    async deleteInvite(code, reason) {
        return this._manager.authRequest({
            method: "DELETE",
            path: Routes.INVITE(code),
            reason
        }).then(data => new Invite_1.default(data, this._client));
    }
    /**
     * Delete a message.
     *
     * @param {String} id - The id of the channel to delete the message in.
     * @param {String} messageID - The id of the message to delete.
     * @param {String} [reason] - The reason for deleting the message.
     * @returns {Promise<void>}
     */
    async deleteMessage(id, messageID, reason) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.CHANNEL_MESSAGE(id, messageID),
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
    async deleteMessages(id, messageIDs, reason) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.CHANNEL_BULK_DELETE_MESSAGES(id),
            json: {
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
    async deletePermission(id, overwriteID, reason) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.CHANNEL_PERMISSION(id, overwriteID),
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
    async deleteReaction(id, messageID, emoji, user = "@me") {
        if (emoji === decodeURIComponent(emoji))
            emoji = encodeURIComponent(emoji);
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.CHANNEL_REACTION_USER(id, messageID, emoji, user)
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
    async deleteReactions(id, messageID, emoji) {
        if (emoji && emoji === decodeURIComponent(emoji))
            emoji = encodeURIComponent(emoji);
        await this._manager.authRequest({
            method: "DELETE",
            path: !emoji ? Routes.CHANNEL_REACTIONS(id, messageID) : Routes.CHANNEL_REACTION(id, messageID, emoji)
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
    async edit(id, options) {
        const reason = options.reason;
        if (options.reason)
            delete options.reason;
        if (options.icon) {
            try {
                options.icon = this._client._convertImage(options.icon);
            }
            catch (err) {
                throw new Error("Invalid icon provided. Ensure you are providing a valid, fully-qualified base64 url.", { cause: err });
            }
        }
        return this._manager.authRequest({
            method: "PATCH",
            path: Routes.CHANNEL(id),
            json: {
                archived: options.archived,
                auto_archive_duration: options.autoArchiveDuration,
                bitrate: options.bitrate,
                default_auto_archive_duration: options.defaultAutoArchiveDuration,
                flags: options.flags,
                icon: options.icon,
                invitable: options.invitable,
                locked: options.locked,
                name: options.name,
                nsfw: options.nsfw,
                parent_id: options.parentID,
                permission_overwrites: options.permissionOverwrites,
                position: options.position,
                rate_limit_per_user: options.rateLimitPerUser,
                rtc_region: options.rtcRegion,
                topic: options.topic,
                type: options.type,
                user_limit: options.userLimit,
                video_quality_mode: options.videoQualityMode
            },
            reason
        }).then(data => Channel_1.default.from(data, this._client));
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
    async editMessage(id, messageID, options) {
        const files = options.files;
        if (options.files)
            delete options.files;
        return this._manager.authRequest({
            method: "PATCH",
            path: Routes.CHANNEL_MESSAGE(id, messageID),
            json: {
                allowed_mentions: this._client._formatAllowedMentions(options.allowedMentions),
                attachments: options.attachments,
                components: options.components,
                content: options.content,
                embeds: options.embeds,
                flags: options.flags
            },
            files
        }).then(data => new Message_1.default(data, this._client));
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
    async editPermission(id, overwriteID, options) {
        const reason = options.reason;
        if (options.reason)
            delete options.reason;
        await this._manager.authRequest({
            method: "PUT",
            path: Routes.CHANNEL_PERMISSION(id, overwriteID),
            json: {
                allow: options.allow,
                deny: options.deny,
                type: options.type
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
    async followAnnouncement(id, options) {
        return this._manager.authRequest({
            method: "POST",
            path: Routes.CHANNEL_FOLLOWERS(id),
            json: options
        }).then(data => ({
            channelID: data.channel_id,
            webhookID: data.webhook_id
        }));
    }
    /**
     * Get a channel.
     *
     * @param {String} id - The id of the channel to get.
     * @returns {Promise<AnyChannel>}
     */
    async get(id) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.CHANNEL(id)
        }).then(data => Channel_1.default.from(data, this._client));
    }
    async getInvite(code, options) {
        const query = new URLSearchParams();
        if (options?.guildScheduledEventID)
            query.set("guild_scheduled_event_id", options.guildScheduledEventID);
        if (options?.withCounts)
            query.set("with_counts", "true");
        if (options?.withExpiration)
            query.set("with_expiration", "true");
        return this._manager.authRequest({
            method: "GET",
            path: Routes.INVITE(code),
            query
        }).then(data => new Invite_1.default(data, this._client));
    }
    /**
     * Get the invites of a channel.
     *
     * @param {String} id - The id of the channel to get the invites of.
     * @returns {Promise<Invite[]>} - An array of invites with metadata.
     */
    async getInvites(id) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.CHANNEL_INVITES(id)
        }).then(data => data.map(invite => new Invite_1.default(invite, this._client)));
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
    async getJoinedPrivateArchivedThreads(id, options) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.CHANNEL_PRIVATE_ARCHIVED_THREADS(id),
            json: {
                before: options?.before,
                limit: options?.limit
            }
        }).then(data => ({
            hasMore: data.has_more,
            members: data.members.map(m => ({
                flags: m.flags,
                id: m.id,
                joinTimestamp: new Date(m.join_timestamp),
                userID: m.user_id
            })),
            threads: data.threads.map(d => Channel_1.default.from(d, this._client))
        }));
    }
    /**
     * Get a message in a channel.
     *
     * @template {AnyTextChannel} T
     * @param {String} id - The id of the channel the message is in
     * @param {String} messageID - The id of the message to get.
     * @returns {Promise<Message<T>>}
     */
    async getMessage(id, messageID) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.CHANNEL_MESSAGE(id, messageID)
        }).then(data => new Message_1.default(data, this._client));
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
    async getMessages(id, options) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.CHANNEL_MESSAGES(id),
            json: {
                after: options?.after,
                around: options?.around,
                before: options?.before,
                limit: options?.limit
            }
        }).then(data => data.map(d => new Message_1.default(d, this._client)));
    }
    /**
     * Get the pinned messages in a channel.
     *
     * @template {AnyTextChannel} T
     * @param {String} id - The id of the channel to get the pinned messages from.
     * @returns {Promise<Message<T>[]>}
     */
    async getPinnedMessages(id) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.CHANNEL_PINS(id)
        }).then(data => data.map(d => new Message_1.default(d, this._client)));
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
    async getPrivateArchivedThreads(id, options) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.CHANNEL_PRIVATE_ARCHIVED_THREADS(id),
            json: {
                before: options?.before,
                limit: options?.limit
            }
        }).then(data => ({
            hasMore: data.has_more,
            members: data.members.map(m => ({
                flags: m.flags,
                id: m.id,
                joinTimestamp: new Date(m.join_timestamp),
                userID: m.user_id
            })),
            threads: data.threads.map(d => Channel_1.default.from(d, this._client))
        }));
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
    async getPublicArchivedThreads(id, options) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.CHANNEL_PUBLIC_ARCHIVED_THREADS(id),
            json: {
                before: options?.before,
                limit: options?.limit
            }
        }).then(data => ({
            hasMore: data.has_more,
            members: data.members.map(m => ({
                flags: m.flags,
                id: m.id,
                joinTimestamp: new Date(m.join_timestamp),
                userID: m.user_id
            })),
            threads: data.threads.map(d => Channel_1.default.from(d, this._client))
        }));
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
    async getReactions(id, messageID, emoji, options) {
        if (emoji === decodeURIComponent(emoji))
            emoji = encodeURIComponent(emoji);
        return this._manager.authRequest({
            method: "GET",
            path: Routes.CHANNEL_REACTION(id, messageID, emoji),
            json: {
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
    async getThreadMember(id, userID) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.CHANNEL_THREAD_MEMBER(id, userID)
        }).then(data => ({
            flags: data.flags,
            id: data.id,
            joinTimestamp: new Date(data.join_timestamp),
            userID: data.user_id
        }));
    }
    /**
     * Get the members of a thread.
     *
     * @param {String} id - The id of the thread.
     * @returns {Promise<ThreadMember[]>}
     */
    async getThreadMembers(id) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.CHANNEL_THREAD_MEMBERS(id)
        }).then(data => data.map(d => ({
            flags: d.flags,
            id: d.id,
            joinTimestamp: new Date(d.join_timestamp),
            userID: d.user_id
        })));
    }
    /**
     * Get the list of usable voice regions.
     *
     * @returns {Promise<VoiceRegion[]>}
     */
    async getVoiceRegions() {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.VOICE_REGIONS
        });
    }
    /**
     * Join a thread.
     *
     * @param {String} id - The id of the thread to join.
     * @returns {Promise<void>}
     */
    async joinThread(id) {
        await this._manager.authRequest({
            method: "PUT",
            path: Routes.CHANNEL_THREAD_MEMBER(id, "@me")
        });
    }
    /**
     * Leave a thread.
     *
     * @param {String} id - The id of the thread to leave.
     * @returns {Promise<void>}
     */
    async leaveThread(id) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.CHANNEL_THREAD_MEMBER(id, "@me")
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
    async pinMessage(id, messageID, reason) {
        await this._manager.authRequest({
            method: "PUT",
            path: Routes.CHANNEL_PINNED_MESSAGE(id, messageID),
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
    async removeGroupRecipient(groupID, userID) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.GROUP_RECIPIENT(groupID, userID)
        });
    }
    /**
     * Remove a member from a thread.
     *
     * @param {String} id - The id of the thread to remove them from.
     * @param {String} userID - The id of the user to remove from the thread.
     * @returns {Promise<void>}
     */
    async removeThreadMember(id, userID) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.CHANNEL_THREAD_MEMBER(id, userID)
        });
    }
    /**
     * Show a typing indicator in a channel. How long users see this varies from client to client.
     *
     * @param {String} id - The id of the channel to show the typing indicator in.
     * @returns {Promise<void>}
     */
    async sendTyping(id) {
        await this._manager.authRequest({
            method: "POST",
            path: Routes.CHANNEL_TYPING(id)
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
    async startThreadFromMessage(id, messageID, options) {
        const reason = options.reason;
        if (options.reason)
            delete options.reason;
        return this._manager.authRequest({
            method: "POST",
            path: Routes.CHANNEL_MESSAGE_THREADS(id, messageID),
            json: {
                auto_archive_duration: options.autoArchiveDuration,
                name: options.name,
                rate_limit_per_user: options.rateLimitPerUser
            },
            reason
        }).then(data => Channel_1.default.from(data, this._client));
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
    async startThreadInForum(id, options) {
        const reason = options.reason;
        if (options.reason)
            delete options.reason;
        const files = options.message.files;
        if (options.message.files)
            delete options.message.files;
        return this._manager.authRequest({
            method: "POST",
            path: Routes.CHANNEL_THREADS(id),
            json: {
                auto_archive_duration: options.autoArchiveDuration,
                message: {
                    allowed_mentions: this._client._formatAllowedMentions(options.message.allowedMentions),
                    attachments: options.message.attachments,
                    components: options.message.components,
                    content: options.message.content,
                    embeds: options.message.embeds,
                    flags: options.message.flags,
                    sticker_ids: options.message.stickerIDs
                },
                name: options.name,
                rate_limit_per_user: options.rateLimitPerUser
            },
            reason,
            files
        }).then(data => Channel_1.default.from(data, this._client));
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
    async startThreadWithoutMessage(id, options) {
        const reason = options.reason;
        if (options.reason)
            delete options.reason;
        return this._manager.authRequest({
            method: "POST",
            path: Routes.CHANNEL_THREADS(id),
            json: {
                auto_archive_duration: options.autoArchiveDuration,
                invitable: options.invitable,
                name: options.name,
                rate_limit_per_user: options.rateLimitPerUser,
                type: options.type
            },
            reason
        }).then(data => Channel_1.default.from(data, this._client));
    }
    /**
     * Unpin a message in a channel.
     *
     * @param {String} id - The id of the channel to unpin the message in.
     * @param {String} messageID - The id of the message to unpin.
     * @param {String} [reason] - The reason for unpinning the message.
     * @returns {Promise<void>}
     */
    async unpinMessage(id, messageID, reason) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.CHANNEL_PINNED_MESSAGE(id, messageID),
            reason
        });
    }
}
exports.default = Channels;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hhbm5lbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvcm91dGVzL0NoYW5uZWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw0REFBb0M7QUF3Q3BDLDRDQVNzQjtBQUN0Qix1REFBeUM7QUFDekMsb0VBQTRDO0FBSTVDLGtFQUEwQztBQU0xQyxvRUFBNEM7QUFJNUMsTUFBcUIsUUFBUyxTQUFRLG1CQUFTO0lBQzNDOzs7Ozs7Ozs7T0FTRztJQUNILEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxPQUFlLEVBQUUsT0FBaUM7UUFDdEUsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBTztZQUNsQyxNQUFNLEVBQUUsS0FBSztZQUNiLElBQUksRUFBSSxNQUFNLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDO1lBQ3ZELElBQUksRUFBSTtnQkFDSixZQUFZLEVBQUUsT0FBTyxDQUFDLFdBQVc7Z0JBQ2pDLElBQUksRUFBVSxPQUFPLENBQUMsSUFBSTthQUM3QjtTQUNKLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxLQUFLLENBQUMsZUFBZSxDQUFDLEVBQVUsRUFBRSxNQUFjO1FBQzVDLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQU87WUFDbEMsTUFBTSxFQUFFLEtBQUs7WUFDYixJQUFJLEVBQUksTUFBTSxDQUFDLHFCQUFxQixDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUM7U0FDbkQsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUNEOzs7OztPQUtHO0lBQ0gsS0FBSyxDQUFDLFFBQVEsQ0FBQyxTQUFpQjtRQUM1QixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFvQjtZQUNoRCxNQUFNLEVBQUUsTUFBTTtZQUNkLElBQUksRUFBSSxNQUFNLENBQUMsY0FBYztZQUM3QixJQUFJ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