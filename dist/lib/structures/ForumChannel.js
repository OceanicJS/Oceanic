"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GuildChannel_1 = __importDefault(require("./GuildChannel"));
const PermissionOverwrite_1 = __importDefault(require("./PermissionOverwrite"));
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
        this.availableTags = [];
        this.defaultAutoArchiveDuration = data.default_auto_archive_duration;
        this.defaultReactionEmoji = null;
        this.defaultThreadRateLimitPerUser = data.default_thread_rate_limit_per_user;
        this.flags = data.flags;
        this.lastThread = null;
        this.lastThreadID = data.last_message_id;
        this.nsfw = data.nsfw;
        this.permissionOverwrites = new Collection_1.default(PermissionOverwrite_1.default, client);
        this.position = data.position;
        this.rateLimitPerUser = 0;
        this.template = data.template;
        this.threads = new Collection_1.default(PublicThreadChannel_1.default, client);
        this.topic = data.topic;
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
        if (data.permission_overwrites !== undefined) {
            for (const id of this.permissionOverwrites.keys()) {
                if (!data.permission_overwrites.some(overwrite => overwrite.id === id))
                    this.permissionOverwrites.delete(id);
            }
            for (const overwrite of data.permission_overwrites)
                this.permissionOverwrites.update(overwrite);
        }
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
        return this.client.rest.channels.createInvite(this.id, options);
    }
    /**
     * Delete a permission overwrite on this channel.
     * @param overwriteID The ID of the permission overwrite to delete.
     * @param reason The reason for deleting the permission overwrite.
     */
    async deletePermission(overwriteID, reason) {
        return this.client.rest.channels.deletePermission(this.id, overwriteID, reason);
    }
    /**
     * Edit this channel.
     * @param options The options for editing the channel
     */
    async edit(options) {
        return this.client.rest.channels.edit(this.id, options);
    }
    /**
     * Edit a permission overwrite on this channel.
     * @param overwriteID The ID of the permission overwrite to edit.
     * @param options The options for editing the permission overwrite.
     */
    async editPermission(overwriteID, options) {
        return this.client.rest.channels.editPermission(this.id, overwriteID, options);
    }
    /**
     * Get the invites of this channel.
     */
    async getInvites() {
        return this.client.rest.channels.getInvites(this.id);
    }
    /**
     * Get the public archived threads in this channel.
     * @param options The options for getting the public archived threads.
     */
    async getPublicArchivedThreads(options) {
        return this.client.rest.channels.getPublicArchivedThreads(this.id, options);
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
        let overwrite = this.permissionOverwrites.get(this.guildID);
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
        return this.client.rest.channels.startThreadInForum(this.id, options);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9ydW1DaGFubmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3N0cnVjdHVyZXMvRm9ydW1DaGFubmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0VBQTBDO0FBQzFDLGdGQUF3RDtBQUN4RCxnRkFBd0Q7QUFHeEQsOERBQXNDO0FBZXRDLG9FQUE0QztBQUU1Qyw0Q0FBMkQ7QUFFM0Qsd0hBQXdIO0FBQ3hILE1BQXFCLFlBQWEsU0FBUSxzQkFBWTtJQUNsRCxtQ0FBbUM7SUFDbkMsYUFBYSxDQUFrQjtJQUMvQixxREFBcUQ7SUFDckQsMEJBQTBCLENBQTRCO0lBQ3RELDhDQUE4QztJQUM5QyxvQkFBb0IsQ0FBb0I7SUFDeEMsd0ZBQXdGO0lBQ3hGLDZCQUE2QixDQUFTO0lBQ3RDLHNFQUFzRTtJQUN0RSxLQUFLLENBQVM7SUFDZCx3Q0FBd0M7SUFDeEMsVUFBVSxDQUE2QjtJQUN2QyxpREFBaUQ7SUFDakQsWUFBWSxDQUFnQjtJQUM1QixvQ0FBb0M7SUFDcEMsSUFBSSxDQUFVO0lBR2QsaURBQWlEO0lBQ2pELG9CQUFvQixDQUF3RDtJQUM1RSxtREFBbUQ7SUFDbkQsUUFBUSxDQUFTO0lBQ2pCLHFFQUFxRTtJQUNyRSxnQkFBZ0IsQ0FBUztJQUN6Qiw2QkFBNkI7SUFDN0IsUUFBUSxDQUFTO0lBQ2pCLG1DQUFtQztJQUNuQyxPQUFPLENBQWtFO0lBQ3pFLDhDQUE4QztJQUM5QyxLQUFLLENBQWdCO0lBRXJCLFlBQVksSUFBcUIsRUFBRSxNQUFjO1FBQzdDLEtBQUssQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDcEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLDBCQUEwQixHQUFHLElBQUksQ0FBQyw2QkFBNkIsQ0FBQztRQUNyRSxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDO1FBQ2pDLElBQUksQ0FBQyw2QkFBNkIsR0FBRyxJQUFJ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