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
const Message_1 = __importDefault(require("../structures/Message"));
const Invite_1 = __importDefault(require("../structures/Invite"));
const Channel_1 = __importDefault(require("../structures/Channel"));
class Channels {
    #manager;
    constructor(manager) {
        this.#manager = manager;
    }
    /**
     * Add a user to a group channel.
     * @param groupID The ID of the group to add the user to.
     * @param options The options for adding the recipient.
     */
    async addGroupRecipient(groupID, options) {
        await this.#manager.authRequest({
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
     * @param id The ID of the thread to add them to.
     * @param userID The ID of the user to add to the thread.
     */
    async addThreadMember(id, userID) {
        await this.#manager.authRequest({
            method: "PUT",
            path: Routes.CHANNEL_THREAD_MEMBER(id, userID)
        });
    }
    /**
     * Create a direct message.
     * @param recipient The ID of the recipient of the direct message.
     */
    async createDM(recipient) {
        return this.#manager.authRequest({
            method: "POST",
            path: Routes.OAUTH_CHANNELS,
            json: {
                recipient_id: recipient
            }
        }).then(data => this.#manager.client.privateChannels.update(data));
    }
    /**
     * Create a group dm.
     * @param options The options for creating the group dm.
     */
    async createGroupDM(options) {
        return this.#manager.authRequest({
            method: "POST",
            path: Routes.OAUTH_CHANNELS,
            json: {
                access_tokens: options.accessTokens,
                nicks: options.nicks
            }
        }).then(data => this.#manager.client.groupChannels.update(data));
    }
    /**
     * Create an invite for a channel.
     * @param id The ID of the channel to create an invite for.
     * @param options The options for creating the invite.
     */
    async createInvite(id, options) {
        const reason = options.reason;
        if (options.reason)
            delete options.reason;
        return this.#manager.authRequest({
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
        }).then(data => new Invite_1.default(data, this.#manager.client));
    }
    /**
     * Create a message in a channel.
     * @param id The ID of the channel to create the message in.
     * @param options The options for creating the message.
     */
    async createMessage(id, options) {
        const files = options.files;
        if (options.files)
            delete options.files;
        return this.#manager.authRequest({
            method: "POST",
            path: Routes.CHANNEL_MESSAGES(id),
            json: {
                allowed_mentions: this.#manager.client.util.formatAllowedMentions(options.allowedMentions),
                attachments: options.attachments,
                components: options.components ? this.#manager.client.util.componentsToRaw(options.components) : [],
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
        }).then(data => new Message_1.default(data, this.#manager.client));
    }
    /**
     * Add a reaction to a message.
     * @param id The ID of the channel the message is in.
     * @param messageID The ID of the message to add a reaction to.
     * @param emoji The reaction to add to the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     */
    async createReaction(id, messageID, emoji) {
        if (emoji === decodeURIComponent(emoji))
            emoji = encodeURIComponent(emoji);
        await this.#manager.authRequest({
            method: "PUT",
            path: Routes.CHANNEL_REACTION_USER(id, messageID, emoji, "@me")
        });
    }
    /**
     * Crosspost a message in an announcement channel.
     * @param id The ID of the channel to crosspost the message in.
     * @param messageID The ID of the message to crosspost.
     */
    async crosspostMessage(id, messageID) {
        return this.#manager.authRequest({
            method: "POST",
            path: Routes.CHANNEL_MESSAGES_CROSSPOST(id, messageID)
        }).then(data => new Message_1.default(data, this.#manager.client));
    }
    /**
     * Delete or close a channel.
     * @param id The ID of the channel to delete or close.
     * @param reason The reason to be displayed in the audit log.
     */
    async delete(id, reason) {
        await this.#manager.authRequest({
            method: "DELETE",
            path: Routes.CHANNEL(id),
            reason
        });
    }
    /**
     * Delete an invite.
     * @param code The code of the invite to delete.
     * @param reason The reason for deleting the invite.
     */
    async deleteInvite(code, reason) {
        return this.#manager.authRequest({
            method: "DELETE",
            path: Routes.INVITE(code),
            reason
        }).then(data => new Invite_1.default(data, this.#manager.client));
    }
    /**
     * Delete a message.
     * @param id The ID of the channel to delete the message in.
     * @param messageID The ID of the message to delete.
     * @param reason The reason for deleting the message.
     */
    async deleteMessage(id, messageID, reason) {
        await this.#manager.authRequest({
            method: "DELETE",
            path: Routes.CHANNEL_MESSAGE(id, messageID),
            reason
        });
    }
    /**
     * Bulk delete messages.
     * @param id The ID of the channel to delete the messages in.
     * @param messageIDs The IDs of the messages to delete. Between 2 and 100 messages, any dupliates or messages older than two weeks will cause an error.
     * @param reason The reason for deleting the messages.
     */
    async deleteMessages(id, messageIDs, reason) {
        await this.#manager.authRequest({
            method: "POST",
            path: Routes.CHANNEL_BULK_DELETE_MESSAGES(id),
            json: {
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
    async deletePermission(id, overwriteID, reason) {
        await this.#manager.authRequest({
            method: "DELETE",
            path: Routes.CHANNEL_PERMISSION(id, overwriteID),
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
    async deleteReaction(id, messageID, emoji, user = "@me") {
        if (emoji === decodeURIComponent(emoji))
            emoji = encodeURIComponent(emoji);
        await this.#manager.authRequest({
            method: "DELETE",
            path: Routes.CHANNEL_REACTION_USER(id, messageID, emoji, user)
        });
    }
    /**
     * Remove all, or a specific emoji's reactions from a message.
     * @param id The ID of the channel the message is in.
     * @param messageID The ID of the message to remove reactions from.
     * @param emoji The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis. Omit to remove all reactions.
     */
    async deleteReactions(id, messageID, emoji) {
        if (emoji && emoji === decodeURIComponent(emoji))
            emoji = encodeURIComponent(emoji);
        await this.#manager.authRequest({
            method: "DELETE",
            path: !emoji ? Routes.CHANNEL_REACTIONS(id, messageID) : Routes.CHANNEL_REACTION(id, messageID, emoji)
        });
    }
    /**
     * Edit a channel.
     * @param id The ID of the channel to edit.
     * @param options The options for editing the channel.
     */
    async edit(id, options) {
        const reason = options.reason;
        if (options.reason)
            delete options.reason;
        if (options.icon) {
            try {
                options.icon = this.#manager.client.util.convertImage(options.icon);
            }
            catch (err) {
                throw new Error("Invalid icon provided. Ensure you are providing a valid, fully-qualified base64 url.", { cause: err });
            }
        }
        return this.#manager.authRequest({
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
        }).then(data => Channel_1.default.from(data, this.#manager.client));
    }
    /**
     * Edit a message.
     * @param id The ID of the channel the message is in.
     * @param messageID The ID of the message to edit.
     * @param options The options for editing the message.
     */
    async editMessage(id, messageID, options) {
        const files = options.files;
        if (options.files)
            delete options.files;
        return this.#manager.authRequest({
            method: "PATCH",
            path: Routes.CHANNEL_MESSAGE(id, messageID),
            json: {
                allowed_mentions: this.#manager.client.util.formatAllowedMentions(options.allowedMentions),
                attachments: options.attachments,
                components: options.components ? this.#manager.client.util.componentsToRaw(options.components) : [],
                content: options.content,
                embeds: options.embeds,
                flags: options.flags
            },
            files
        }).then(data => new Message_1.default(data, this.#manager.client));
    }
    /**
     * Edit a permission overwrite.
     * @param id The ID of the channel to edit the permission overwrite for.
     * @param overwriteID The ID of the permission overwrite to edit.
     * @param options The options for editing the permission overwrite.
     */
    async editPermission(id, overwriteID, options) {
        const reason = options.reason;
        if (options.reason)
            delete options.reason;
        await this.#manager.authRequest({
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
     * @param id The ID of the channel to follow the announcement channel to.
     * @param webhookChannelID The ID of the channel to follow the announcement channel to.
     */
    async followAnnouncement(id, webhookChannelID) {
        return this.#manager.authRequest({
            method: "POST",
            path: Routes.CHANNEL_FOLLOWERS(id),
            json: {
                webhook_channel_id: webhookChannelID
            }
        }).then(data => ({
            channelID: data.channel_id,
            webhookID: data.webhook_id
        }));
    }
    /**
     * Get a channel.
     * @param id The ID of the channel to get.
     */
    async get(id) {
        return this.#manager.authRequest({
            method: "GET",
            path: Routes.CHANNEL(id)
        }).then(data => Channel_1.default.from(data, this.#manager.client));
    }
    async getInvite(code, options) {
        const query = new URLSearchParams();
        if (options?.guildScheduledEventID)
            query.set("guild_scheduled_event_id", options.guildScheduledEventID);
        if (options?.withCounts)
            query.set("with_counts", "true");
        if (options?.withExpiration)
            query.set("with_expiration", "true");
        return this.#manager.authRequest({
            method: "GET",
            path: Routes.INVITE(code),
            query
        }).then(data => new Invite_1.default(data, this.#manager.client));
    }
    /**
     * Get the invites of a channel.
     * @param id The ID of the channel to get the invites of.
     */
    async getInvites(id) {
        return this.#manager.authRequest({
            method: "GET",
            path: Routes.CHANNEL_INVITES(id)
        }).then(data => data.map(invite => new Invite_1.default(invite, this.#manager.client)));
    }
    /**
     * Get the private archived threads the current user has joined in a channel.
     * @param id The ID of the channel to get the archived threads from.
     * @param options The options for getting the archived threads.
     */
    async getJoinedPrivateArchivedThreads(id, options) {
        return this.#manager.authRequest({
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
            threads: data.threads.map(d => Channel_1.default.from(d, this.#manager.client))
        }));
    }
    /**
     * Get a message in a channel.
     * @param id The ID of the channel the message is in
     * @param messageID The ID of the message to get.
     */
    async getMessage(id, messageID) {
        return this.#manager.authRequest({
            method: "GET",
            path: Routes.CHANNEL_MESSAGE(id, messageID)
        }).then(data => new Message_1.default(data, this.#manager.client));
    }
    /**
     * Get messages in a channel.
     * @param id The ID of the channel to get messages from.
     * @param options The options for getting messages. All are mutually exclusive.
     */
    async getMessages(id, options) {
        return this.#manager.authRequest({
            method: "GET",
            path: Routes.CHANNEL_MESSAGES(id),
            json: {
                after: options?.after,
                around: options?.around,
                before: options?.before,
                limit: options?.limit
            }
        }).then(data => data.map(d => new Message_1.default(d, this.#manager.client)));
    }
    /**
     * Get the pinned messages in a channel.
     * @param id The ID of the channel to get the pinned messages from.
     */
    async getPinnedMessages(id) {
        return this.#manager.authRequest({
            method: "GET",
            path: Routes.CHANNEL_PINS(id)
        }).then(data => data.map(d => new Message_1.default(d, this.#manager.client)));
    }
    /**
     * Get the private archived threads in a channel.
     * @param id The ID of the channel to get the archived threads from.
     * @param options The options for getting the archived threads.
     */
    async getPrivateArchivedThreads(id, options) {
        return this.#manager.authRequest({
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
            threads: data.threads.map(d => Channel_1.default.from(d, this.#manager.client))
        }));
    }
    /**
     * Get the public archived threads in a channel.
     * @param id The ID of the channel to get the archived threads from.
     * @param options The options for getting the archived threads.
     */
    async getPublicArchivedThreads(id, options) {
        return this.#manager.authRequest({
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
            threads: data.threads.map(d => Channel_1.default.from(d, this.#manager.client))
        }));
    }
    /**
     * Get the users who reacted with a specific emoji on a message.
     * @param id The ID of the channel the message is in.
     * @param messageID The ID of the message to get reactions from.
     * @param emoji The reaction to remove from the message. `name:id` for custom emojis, and the unicode codepoint for default emojis.
     * @param options The options for getting the reactions.
     */
    async getReactions(id, messageID, emoji, options) {
        if (emoji === decodeURIComponent(emoji))
            emoji = encodeURIComponent(emoji);
        return this.#manager.authRequest({
            method: "GET",
            path: Routes.CHANNEL_REACTION(id, messageID, emoji),
            json: {
                after: options?.after,
                limit: options?.limit
            }
        }).then(data => data.map(d => this.#manager.client.users.update(d)));
    }
    /**
     * Get a thread member.
     * @param id The ID of the thread.
     * @param userID The ID of the user to get the thread member of.
     */
    async getThreadMember(id, userID) {
        return this.#manager.authRequest({
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
     * @param id The ID of the thread.
     */
    async getThreadMembers(id) {
        return this.#manager.authRequest({
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
     */
    async getVoiceRegions() {
        return this.#manager.authRequest({
            method: "GET",
            path: Routes.VOICE_REGIONS
        });
    }
    /**
     * Join a thread.
     * @param id The ID of the thread to join.
     */
    async joinThread(id) {
        await this.#manager.authRequest({
            method: "PUT",
            path: Routes.CHANNEL_THREAD_MEMBER(id, "@me")
        });
    }
    /**
     * Leave a thread.
     * @param id The ID of the thread to leave.
     */
    async leaveThread(id) {
        await this.#manager.authRequest({
            method: "DELETE",
            path: Routes.CHANNEL_THREAD_MEMBER(id, "@me")
        });
    }
    /**
     * Pin a message in a channel.
     * @param id The ID of the channel to pin the message in.
     * @param messageID The ID of the message to pin.
     * @param reason The reason for pinning the message.
     */
    async pinMessage(id, messageID, reason) {
        await this.#manager.authRequest({
            method: "PUT",
            path: Routes.CHANNEL_PINNED_MESSAGE(id, messageID),
            reason
        });
    }
    /**
     * Remove a user from the group channel.
     * @param groupID The ID of the group to remove the user from.
     * @param userID The ID of the user to remove.
     */
    async removeGroupRecipient(groupID, userID) {
        await this.#manager.authRequest({
            method: "DELETE",
            path: Routes.GROUP_RECIPIENT(groupID, userID)
        });
    }
    /**
     * Remove a member from a thread.
     * @param id The ID of the thread to remove them from.
     * @param userID The ID of the user to remove from the thread.
     */
    async removeThreadMember(id, userID) {
        await this.#manager.authRequest({
            method: "DELETE",
            path: Routes.CHANNEL_THREAD_MEMBER(id, userID)
        });
    }
    /**
     * Show a typing indicator in a channel. How long users see this varies from client to client.
     * @param id The ID of the channel to show the typing indicator in.
     */
    async sendTyping(id) {
        await this.#manager.authRequest({
            method: "POST",
            path: Routes.CHANNEL_TYPING(id)
        });
    }
    /**
     * Create a thread from an existing message.
     * @param id The ID of the channel to create the thread in.
     * @param messageID The ID of the message to create the thread from.
     * @param {options The options for starting the thread.
     */
    async startThreadFromMessage(id, messageID, options) {
        const reason = options.reason;
        if (options.reason)
            delete options.reason;
        return this.#manager.authRequest({
            method: "POST",
            path: Routes.CHANNEL_MESSAGE_THREADS(id, messageID),
            json: {
                auto_archive_duration: options.autoArchiveDuration,
                name: options.name,
                rate_limit_per_user: options.rateLimitPerUser
            },
            reason
        }).then(data => Channel_1.default.from(data, this.#manager.client));
    }
    /**
     * Create a thread in a forum channel.
     * @param id The ID of the channel to start the thread in.
     * @param options The options for starting the thread.
     */
    async startThreadInForum(id, options) {
        const reason = options.reason;
        if (options.reason)
            delete options.reason;
        const files = options.message.files;
        if (options.message.files)
            delete options.message.files;
        return this.#manager.authRequest({
            method: "POST",
            path: Routes.CHANNEL_THREADS(id),
            json: {
                auto_archive_duration: options.autoArchiveDuration,
                message: {
                    allowed_mentions: this.#manager.client.util.formatAllowedMentions(options.message.allowedMentions),
                    attachments: options.message.attachments,
                    components: options.message.components ? this.#manager.client.util.componentsToRaw(options.message.components) : [],
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
        }).then(data => Channel_1.default.from(data, this.#manager.client));
    }
    /**
     * Create a thread without an existing message.
     * @param id The ID of the channel to start the thread in.
     * @param options The options for starting the thread.
     */
    async startThreadWithoutMessage(id, options) {
        const reason = options.reason;
        if (options.reason)
            delete options.reason;
        return this.#manager.authRequest({
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
        }).then(data => Channel_1.default.from(data, this.#manager.client));
    }
    /**
     * Unpin a message in a channel.
     * @param id The ID of the channel to unpin the message in.
     * @param messageID The ID of the message to unpin.
     * @param reason The reason for unpinning the message.
     */
    async unpinMessage(id, messageID, reason) {
        await this.#manager.authRequest({
            method: "DELETE",
            path: Routes.CHANNEL_PINNED_MESSAGE(id, messageID),
            reason
        });
    }
}
exports.default = Channels;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hhbm5lbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvcm91dGVzL0NoYW5uZWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQ0EsdURBQXlDO0FBQ3pDLG9FQUE0QztBQUU1QyxrRUFBMEM7QUFNMUMsb0VBQTRDO0FBRzVDLE1BQXFCLFFBQVE7SUFDekIsUUFBUSxDQUFjO0lBQ3RCLFlBQVksT0FBb0I7UUFDNUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7SUFDNUIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxLQUFLLENBQUMsaUJBQWlCLENBQUMsT0FBZSxFQUFFLE9BQWlDO1FBQ3RFLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQU87WUFDbEMsTUFBTSxFQUFFLEtBQUs7WUFDYixJQUFJLEVBQUksTUFBTSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQztZQUN2RCxJQUFJLEVBQUk7Z0JBQ0osWUFBWSxFQUFFLE9BQU8sQ0FBQyxXQUFXO2dCQUNqQyxJQUFJLEVBQVUsT0FBTyxDQUFDLElBQUk7YUFDN0I7U0FDSixDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILEtBQUssQ0FBQyxlQUFlLENBQUMsRUFBVSxFQUFFLE1BQWM7UUFDNUMsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBTztZQUNsQyxNQUFNLEVBQUUsS0FBSztZQUNiLElBQUksRUFBSSxNQUFNLENBQUMscUJBQXFCLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQztTQUNuRCxDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0Q7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLFFBQVEsQ0FBQyxTQUFpQjtRQUM1QixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFvQjtZQUNoRCxNQUFNLEVBQUUsTUFBTTtZQUNkLElB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