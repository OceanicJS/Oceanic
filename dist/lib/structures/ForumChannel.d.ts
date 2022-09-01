import GuildChannel from "./GuildChannel";
import PermissionOverwrite from "./PermissionOverwrite";
import PublicThreadChannel from "./PublicThreadChannel";
import type Invite from "./Invite";
import type Member from "./Member";
import Permission from "./Permission";
import type Client from "../Client";
import type { CreateInviteOptions, EditForumChannelOptions, EditPermissionOptions, ForumEmoji, ForumTag, GetArchivedThreadsOptions, JSONForumChannel, RawForumChannel, RawOverwrite, RawPublicThreadChannel, StartThreadInForumOptions, Uncached } from "../types";
import Collection from "../util/Collection";
import type { ChannelTypes, ThreadAutoArchiveDuration } from "../Constants";
/** Represents a forum channel. Documentation for these is currently scarce, so they may not work entirely correctly. */
export default class ForumChannel extends GuildChannel {
    /** The usable tags for threads. */
    availableTags: Array<ForumTag>;
    /** The default auto archive duration for threads. */
    defaultAutoArchiveDuration: ThreadAutoArchiveDuration;
    /** The default reaction emoji for threads. */
    defaultReactionEmoji: ForumEmoji | null;
    /** The default amount of seconds between non-moderators sending messages in threads. */
    defaultThreadRateLimitPerUser: number;
    /** The flags for this channel, see {@link Constants.ChannelFlags}. */
    flags: number;
    /** The most recently created thread. */
    lastThread: PublicThreadChannel | Uncached | null;
    /** If this channel is age gated. */
    nsfw: boolean;
    parent: ForumChannel;
    parentID: string;
    /** The permission overwrites of this channel. */
    permissionOverwrites: Collection<string, RawOverwrite, PermissionOverwrite>;
    /** The position of this channel on the sidebar. */
    position: number;
    /** The amount of seconds between non-moderators creating threads. */
    rateLimitPerUser: number;
    /** Undocumented property. */
    template: string;
    /** The threads in this channel. */
    threads: Collection<string, RawPublicThreadChannel, PublicThreadChannel>;
    /** The `guidelines` of this forum channel. */
    topic: string | null;
    type: ChannelTypes.GUILD_FORUM;
    constructor(data: RawForumChannel, client: Client);
    protected update(data: Partial<RawForumChannel>): void;
    /**
     * Create an invite for this channel.
     * @param options The options for the invite.
     */
    createInvite(options: CreateInviteOptions): Promise<Invite<"withMetadata", this>>;
    /**
     * Delete a permission overwrite on this channel.
     * @param overwriteID The ID of the permission overwrite to delete.
     * @param reason The reason for deleting the permission overwrite.
     */
    deletePermission(overwriteID: string, reason?: string): Promise<void>;
    /**
     * Edit this channel.
     * @param options The options for editing the channel
     */
    edit(options: EditForumChannelOptions): Promise<this>;
    /**
     * Edit a permission overwrite on this channel.
     * @param overwriteID The ID of the permission overwrite to edit.
     * @param options The options for editing the permission overwrite.
     */
    editPermission(overwriteID: string, options: EditPermissionOptions): Promise<void>;
    /**
     * Get the invites of this channel.
     */
    getInvites(): Promise<Array<Invite<"withMetadata", this>>>;
    /**
     * Get the public archived threads in this channel.
     * @param options The options for getting the public archived threads.
     */
    getPublicArchivedThreads(options?: GetArchivedThreadsOptions): Promise<import("../types").ArchivedThreads<PublicThreadChannel>>;
    /**
     * Get the permissions of a member.  If providing an id, the member must be cached.
     * @param member The member to get the permissions of.
     */
    permissionsOf(member: string | Member): Permission;
    /**
     * Create a thread in a forum channel.
     * @param options The options for starting the thread.
     */
    startThread(options: StartThreadInForumOptions): Promise<PublicThreadChannel>;
    toJSON(): JSONForumChannel;
}
