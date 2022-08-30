import GuildChannel from "./GuildChannel";
import PermissionOverwrite from "./PermissionOverwrite";
import Member from "./Member";
import type CategoryChannel from "./CategoryChannel";
import Permission from "./Permission";
import type { ChannelTypes } from "../Constants";
import type Client from "../Client";
import Collection from "../util/Collection";
import type { CreateInviteOptions, EditPermissionOptions, EditStageChannelOptions, RawOverwrite, RawStageChannel } from "../types/channels";
import type { JSONStageChannel } from "../types/json";
import type { RawMember } from "../types/guilds";
import type { UpdateVoiceStateOptions } from "../types/gateway";
/** Represents a guild stage channel. */
export default class StageChannel extends GuildChannel {
    /** The bitrate of the stage channel. */
    bitrate: number;
    parent: CategoryChannel | null;
    /** The permission overwrites of this channel. */
    permissionOverwrites: Collection<string, RawOverwrite, PermissionOverwrite>;
    /** The position of this channel on the sidebar. */
    position: number;
    /** The id of the voice region of the channel, `null` is automatic. */
    rtcRegion: string | null;
    /** The topic of the channel. */
    topic: string | null;
    type: ChannelTypes.GUILD_STAGE_VOICE;
    voiceMembers: Collection<string, RawMember, Member, [guildID: string]>;
    constructor(data: RawStageChannel, client: Client);
    protected update(data: Partial<RawStageChannel>): void;
    /**
     * Create an invite for this channel.
     * @param options The options to create an invite with.
     */
    createInvite(options: CreateInviteOptions): Promise<import("./Invite").default<import("../types/channels").InviteInfoTypes, import("../types/channels").InviteChannel>>;
    /**
     * Delete a permission overwrite on this channel.
     * @param overwriteID The ID of the permission overwrite to delete.
     * @param reason The reason for deleting the permission overwrite.
     */
    deletePermission(overwriteID: string, reason?: string): Promise<void>;
    /**
     * Edit this channel.
     * @param options The options for editing the channel.
     */
    edit(options: EditStageChannelOptions): Promise<this>;
    /**
     * Edit a permission overwrite on this channel.
     * @param overwriteID The ID of the permission overwrite to edit.
     * @param options The options for editing the permission overwrite.
     */
    editPermission(overwriteID: string, options: EditPermissionOptions): Promise<void>;
    /**
     * Join this stage channel.
     * @param options The options to join the channel with.
     */
    join(options?: UpdateVoiceStateOptions): Promise<void>;
    /**
     * Get the permissions of a member.  If providing an id, the member must be cached.
     * @param member The member to get the permissions of.
     */
    permissionsOf(member: string | Member): Permission;
    toJSON(): JSONStageChannel;
}
