"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GuildChannel_1 = __importDefault(require("./GuildChannel"));
const PublicThreadChannel_1 = __importDefault(require("./PublicThreadChannel"));
const Permission_1 = __importDefault(require("./Permission"));
const Collection_1 = __importDefault(require("../util/Collection"));
const Constants_1 = require("../Constants");
/** Represents a forum channel. Documentation for these is currently scarce, so they may not work entirely correctly. */
class ForumChannel extends GuildChannel_1.default {
    /** The usable tags for threads. */
    availableTags;
    /** The default auto archive duration for threads. */
    defaultAutoArchiveDuration;
    /** The default reaction emoji for threads. */
    defaultReactionEmoji;
    /** The default amount of seconds between non-moderators sending messages in threads. */
    defaultThreadRateLimitPerUser;
    /** The flags for this channel, see {@link Constants.ChannelFlags}. */
    flags;
    /** The most recently created thread. */
    lastThread;
    /** The ID of the most ecently created thread. */
    lastThreadID;
    /** If this channel is age gated. */
    nsfw;
    /** The permission overwrites of this channel. */
    permissionOverwrites;
    /** The position of this channel on the sidebar. */
    position;
    /** The amount of seconds between non-moderators creating threads. */
    rateLimitPerUser;
    /** Undocumented property. */
    template;
    /** The threads in this channel. */
    threads;
    /** The `guidelines` of this forum channel. */
    topic;
    constructor(data, client) {
        super(data, client);
        this.threads = new Collection_1.default(PublicThreadChannel_1.default, client);
        this.update(data);
    }
    update(data) {
        super.update(data);
        if (data.available_tags !== undefined)
            this.availableTags = data.available_tags.map(tag => ({
                emoji: tag.emoji_id === null && tag.emoji_name === null ? null : { id: tag.emoji_id, name: tag.emoji_name },
                id: tag.id,
                moderated: tag.moderated,
                name: tag.name
            }));
        if (data.default_auto_archive_duration !== undefined)
            this.defaultAutoArchiveDuration = data.default_auto_archive_duration;
        if (data.default_reaction_emoji !== undefined)
            this.defaultReactionEmoji = data.default_reaction_emoji === null || (data.default_reaction_emoji.emoji_id === null && data.default_reaction_emoji.emoji_name === null) ? null : { id: data.default_reaction_emoji.emoji_id, name: data.default_reaction_emoji.emoji_name };
        if (data.default_thread_rate_limit_per_user !== undefined)
            this.defaultThreadRateLimitPerUser = data.default_thread_rate_limit_per_user;
        if (data.flags !== undefined)
            this.flags = data.flags;
        if (data.last_message_id !== undefined) {
            this.lastThread = this.threads.get(data.last_message_id);
            this.lastThreadID = data.last_message_id;
        }
        if (data.nsfw !== undefined)
            this.nsfw = data.nsfw;
        if (data.permission_overwrites !== undefined)
            data.permission_overwrites.map(overwrite => this.permissionOverwrites.update(overwrite));
        if (data.position !== undefined)
            this.position = data.position;
        if (data.rate_limit_per_user !== undefined)
            this.rateLimitPerUser = data.rate_limit_per_user;
        if (data.template !== undefined)
            this.template = data.template;
        if (data.topic !== undefined && data.topic !== null)
            this.topic = data.topic;
    }
    /**
     * Create an invite for this channel.
     * @param options The options for the invite.
     */
    async createInvite(options) {
        return this._client.rest.channels.createInvite(this.id, options);
    }
    /**
     * Delete a permission overwrite on this channel.
     * @param overwriteID The ID of the permission overwrite to delete.
     * @param reason The reason for deleting the permission overwrite.
     */
    async deletePermission(overwriteID, reason) {
        return this._client.rest.channels.deletePermission(this.id, overwriteID, reason);
    }
    /**
     * Edit this channel.
     * @param options The options for editing the channel
     */
    async edit(options) {
        return this._client.rest.channels.edit(this.id, options);
    }
    /**
     * Edit a permission overwrite on this channel.
     * @param overwriteID The ID of the permission overwrite to edit.
     * @param options The options for editing the permission overwrite.
     */
    async editPermission(overwriteID, options) {
        return this._client.rest.channels.editPermission(this.id, overwriteID, options);
    }
    /**
     * Get the invites of this channel.
     */
    async getInvites() {
        return this._client.rest.channels.getInvites(this.id);
    }
    /**
     * Get the public archived threads in this channel.
     * @param options The options for getting the public archived threads.
     */
    async getPublicArchivedThreads(options) {
        return this._client.rest.channels.getPublicArchivedThreads(this.id, options);
    }
    /**
     * Get the permissions of a member.  If providing an id, the member must be cached.
     * @param member The member to get the permissions of.
     */
    permissionsOf(member) {
        if (typeof member === "string")
            member = this.guild.members.get(member);
        if (!member)
            throw new Error("Member not found");
        let permission = this.guild.permissionsOf(member).allow;
        if (permission & Constants_1.Permissions.ADMINISTRATOR)
            return new Permission_1.default(Constants_1.AllPermissions);
        let overwrite = this.permissionOverwrites.get(this.guild.id);
        if (overwrite)
            permission = (permission & ~overwrite.deny) | overwrite.allow;
        let deny = 0n;
        let allow = 0n;
        for (const id of member.roles) {
            if ((overwrite = this.permissionOverwrites.get(id))) {
                deny |= overwrite.deny;
                allow |= overwrite.allow;
            }
        }
        permission = (permission & ~deny) | allow;
        overwrite = this.permissionOverwrites.get(member.id);
        if (overwrite)
            permission = (permission & ~overwrite.deny) | overwrite.allow;
        return new Permission_1.default(permission);
    }
    /**
     * Create a thread in a forum channel.
     * @param options The options for starting the thread.
     */
    async startThread(options) {
        return this._client.rest.channels.startThreadInForum(this.id, options);
    }
    toJSON() {
        return {
            ...super.toJSON(),
            availableTags: this.availableTags,
            defaultAutoArchiveDuration: this.defaultAutoArchiveDuration,
            defaultReactionEmoji: this.defaultReactionEmoji,
            defaultThreadRateLimitPerUser: this.defaultThreadRateLimitPerUser,
            flags: this.flags,
            lastThread: this.lastThreadID,
            permissionOverwrites: this.permissionOverwrites.map(overwrite => overwrite.toJSON()),
            position: this.position,
            rateLimitPerUser: this.rateLimitPerUser,
            template: this.template,
            threads: this.threads.map(thread => thread.id),
            topic: this.topic
        };
    }
}
exports.default = ForumChannel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9ydW1DaGFubmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3N0cnVjdHVyZXMvRm9ydW1DaGFubmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0VBQTBDO0FBRTFDLGdGQUF3RDtBQUd4RCw4REFBc0M7QUFldEMsb0VBQTRDO0FBRTVDLDRDQUEyRDtBQUUzRCx3SEFBd0g7QUFDeEgsTUFBcUIsWUFBYSxTQUFRLHNCQUFZO0lBQ2xELG1DQUFtQztJQUNuQyxhQUFhLENBQWtCO0lBQy9CLHFEQUFxRDtJQUNyRCwwQkFBMEIsQ0FBNEI7SUFDdEQsOENBQThDO0lBQzlDLG9CQUFvQixDQUFvQjtJQUN4Qyx3RkFBd0Y7SUFDeEYsNkJBQTZCLENBQVM7SUFDdEMsc0VBQXNFO0lBQ3RFLEtBQUssQ0FBUztJQUNkLHdDQUF3QztJQUN4QyxVQUFVLENBQTZCO0lBQ3ZDLGlEQUFpRDtJQUNqRCxZQUFZLENBQWdCO0lBQzVCLG9DQUFvQztJQUNwQyxJQUFJLENBQVU7SUFHZCxpREFBaUQ7SUFDakQsb0JBQW9CLENBQXdEO0lBQzVFLG1EQUFtRDtJQUNuRCxRQUFRLENBQVM7SUFDakIscUVBQXFFO0lBQ3JFLGdCQUFnQixDQUFTO0lBQ3pCLDZCQUE2QjtJQUM3QixRQUFRLENBQVM7SUFDakIsbUNBQW1DO0lBQ25DLE9BQU8sQ0FBa0U7SUFDekUsOENBQThDO0lBQzlDLEtBQUssQ0FBUztJQUVkLFlBQVksSUFBcUIsRUFBRSxNQUFjO1FBQzdDLEtBQUssQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDcEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLG9CQUFVLENBQXNELDZCQUFtQixFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2hILElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEIsQ0FBQztJQUVTLE1BQU0sQ0FBQyxJQUE4QjtRQUMzQyxLQUFLLENBQUMsTUFBTSxDQUFDLElB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