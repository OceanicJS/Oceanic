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
        this.lastThread = data.last_message_id === null ? null : { id: data.last_message_id };
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
            this.lastThread = this.threads.get(data.last_message_id) || { id: data.last_message_id };
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
            lastThread: this.lastThread === null ? null : this.lastThread.id,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9ydW1DaGFubmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3N0cnVjdHVyZXMvRm9ydW1DaGFubmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0VBQTBDO0FBQzFDLGdGQUF3RDtBQUN4RCxnRkFBd0Q7QUFHeEQsOERBQXNDO0FBZ0J0QyxvRUFBNEM7QUFFNUMsNENBQTJEO0FBRTNELHdIQUF3SDtBQUN4SCxNQUFxQixZQUFhLFNBQVEsc0JBQVk7SUFDbEQsbUNBQW1DO0lBQ25DLGFBQWEsQ0FBa0I7SUFDL0IscURBQXFEO0lBQ3JELDBCQUEwQixDQUE0QjtJQUN0RCw4Q0FBOEM7SUFDOUMsb0JBQW9CLENBQW9CO0lBQ3hDLHdGQUF3RjtJQUN4Riw2QkFBNkIsQ0FBUztJQUN0QyxzRUFBc0U7SUFDdEUsS0FBSyxDQUFTO0lBQ2Qsd0NBQXdDO0lBQ3hDLFVBQVUsQ0FBd0M7SUFDbEQsb0NBQW9DO0lBQ3BDLElBQUksQ0FBVTtJQUdkLGlEQUFpRDtJQUNqRCxvQkFBb0IsQ0FBd0Q7SUFDNUUsbURBQW1EO0lBQ25ELFFBQVEsQ0FBUztJQUNqQixxRUFBcUU7SUFDckUsZ0JBQWdCLENBQVM7SUFDekIsNkJBQTZCO0lBQzdCLFFBQVEsQ0FBUztJQUNqQixtQ0FBbUM7SUFDbkMsT0FBTyxDQUFrRTtJQUN6RSw4Q0FBOEM7SUFDOUMsS0FBSyxDQUFnQjtJQUVyQixZQUFZLElBQXFCLEVBQUUsTUFBYztRQUM3QyxLQUFLLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQywwQkFBMEIsR0FBRyxJQUFJLENBQUMsNkJBQTZCLENBQUM7UUFDckUsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQztRQUNqQyxJQUFJLENBQUMsNkJBQTZCLEdBQUcsSUFBSSxDQUFDLGtDQUFrQyxDQUFDO1FBQzdFLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN4QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxlQUFlLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN0RixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDdEIsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksb0JBQVUsQ0FBQyw2QkFBbUIsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN4RSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDOUIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLENBQUMsQ0FBQztRQUMxQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDOUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLG9CQUFVLENBQXNELDZCQUFtQixFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2hILElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RCLENBQUM7SUFFUyxNQUFNLENBQUMsSUFBOEI7UUFDM0MsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNuQixJQUFJLElBQUksQ0FBQyxjQUFjLEtBQUssU0FBUztZQUFFLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUN4RixLQUFLLEVBQU0sR0FBRyxDQUFDLFFBQVEsS0FBSyxJQUFJLElBQUksR0FBRyxDQUFDLFVBQVUsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLFVBQVUsRUFBRTtnQkFDL0csRUFBRSxFQUFTLEdBQUcsQ0FBQyxFQUFFO2dCQUNqQixTQUFTLEVBQUUsR0FBRyxDQUFDLFNBQVM7Z0JBQ3hCLElBQUksRUFBTyxHQUFHLENBQUMsSUFBSTthQUN0QixDQUFDLENBQUMsQ0FBQztRQUNKLElBQUksSUFBSSxDQUFDLDZCQUE2QixLQUFLLFNBQVM7WUFBRSxJQUFJLENBQUMsMEJBQTBCLEdBQUcsSUFBSSxDQUFDLDZCQUE2QixDQUFDO1FBQzNILElBQUksSUFBSSxDQUFDLHNCQUFzQixLQUFLLFNBQVM7WUFBRSxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixLQUFLLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxRQUFRLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxVQUFVLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLHNCQUFzQixDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLHNCQUFzQixDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQzFULElBQUksSUFBSSxDQUFDLGtDQUFrQyxLQUFLLFNBQVM7WUFBRSxJQUFJLENBQUMsNkJBQTZCLEdBQUcsSUFBSSxDQUFDLGtDQUFrQyxDQUFDO1FBQ3hJLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxTQUFTO1lBQUUsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3RELElBQUksSUFBSSxDQUFDLGVBQWUsS0FBSyxTQUFTLEVBQUU7WUFDcEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZ0IsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxlQUFnQixFQUFFLENBQUM7U0FDOUY7UUFDRCxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUztZQUFFLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUNuRCxJQUFJLElBQUksQ0FBQyxxQkFBcUIsS0FBSyxTQUFTLEVBQUU7WUFDMUMsS0FBSyxNQUFNLEVBQUUsSUFBSSxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxFQUFFLEVBQUU7Z0JBQy9DLElBQUksQ0FBQyxJQUFJLENBQUMscUJBQXNCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUM7b0JBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQzthQUNqSDtZQUNELEtBQUssTUFBTSxTQUFTLElBQUksSUFBSSxDQUFDLHFCQUFxQjtnQkFBRSxJQUFJLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ25HO1FBQ0QsSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLFNBQVM7WUFBRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDL0QsSUFBSSxJQUFJLENBQUMsbUJBQW1CLEtBQUssU0FBUztZQUFFLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUM7UUFDN0YsSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLFNBQVM7WUFBRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDL0QsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUk7WUFBRSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDakYsQ0FBQztJQUVEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBNEI7UUFDM0MsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUF1QixJQUFJLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzFGLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFdBQW1CLEVBQUUsTUFBZTtRQUN2RCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNwRixDQUFDO0lBRUQ7OztPQUdHO0lBQ00sS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFnQztRQUNoRCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQU8sSUFBSSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILEtBQUssQ0FBQyxjQUFjLENBQUMsV0FBbUIsRUFBRSxPQUE4QjtRQUNwRSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbkYsQ0FBQztJQUVEOztPQUVHO0lBQ0gsS0FBSyxDQUFDLFVBQVU7UUFDWixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMsd0JBQXdCLENBQUMsT0FBbUM7UUFDOUQsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsd0JBQXdCLENBQXNCLElBQUksQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDckcsQ0FBQztJQUVEOzs7T0FHRztJQUNILGFBQWEsQ0FBQyxNQUF1QjtRQUNqQyxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVE7WUFBRSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBRSxDQUFDO1FBQ3pFLElBQUksQ0FBQyxNQUFNO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ2pELElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUN4RCxJQUFJLFVBQVUsR0FBRyx1QkFBVyxDQUFDLGFBQWE7WUFBRSxPQUFPLElBQUksb0JBQVUsQ0FBQywwQkFBYyxDQUFDLENBQUM7UUFDbEYsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDNUQsSUFBSSxTQUFTO1lBQUUsVUFBVSxHQUFHLENBQUMsVUFBVSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUM7UUFDN0UsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ2QsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ2YsS0FBSyxNQUFNLEVBQUUsSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFO1lBQzNCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO2dCQUNqRCxJQUFJLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQztnQkFDdkIsS0FBSyxJQUFJLFNBQVMsQ0FBQyxLQUFLLENBQUM7YUFDNUI7U0FDSjtRQUNELFVBQVUsR0FBRyxDQUFDLFVBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUMxQyxTQUFTLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDckQsSUFBSSxTQUFTO1lBQUUsVUFBVSxHQUFHLENBQUMsVUFBVSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUM7UUFDN0UsT0FBTyxJQUFJLG9CQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUdEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxXQUFXLENBQUMsT0FBa0M7UUFDaEQsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMxRSxDQUFDO0lBRUQsTUFBTTtRQUNGLE9BQU87WUFDSCxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDakIsYUFBYSxFQUFrQixJQUFJLENBQUMsYUFBYTtZQUNqRCwwQkFBMEIsRUFBSyxJQUFJLENBQUMsMEJBQTBCO1lBQzlELG9CQUFvQixFQUFXLElBQUksQ0FBQyxvQkFBb0I7WUFDeEQsNkJBQTZCLEVBQUUsSUFBSSxDQUFDLDZCQUE2QjtZQUNqRSxLQUFLLEVBQTBCLElBQUksQ0FBQyxLQUFLO1lBQ3pDLFVBQVUsRUFBcUIsSUFBSSxDQUFDLFVBQVUsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ25GLG9CQUFvQixFQUFXLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDN0YsUUFBUSxFQUF1QixJQUFJLENBQUMsUUFBUTtZQUM1QyxnQkFBZ0IsRUFBZSxJQUFJLENBQUMsZ0JBQWdCO1lBQ3BELFFBQVEsRUFBdUIsSUFBSSxDQUFDLFFBQVE7WUFDNUMsT0FBTyxFQUF3QixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDcEUsS0FBSyxFQUEwQixJQUFJLENBQUMsS0FBSztTQUM1QyxDQUFDO0lBQ04sQ0FBQztDQUNKO0FBaExELCtCQWdMQyJ9