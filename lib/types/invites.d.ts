import type * as Types from "./namespaced";
import type { InviteTargetTypes, InviteTargetUsersJobStatus, InviteTypes } from "../Constants";
import type Member from "../structures/Member";

export interface RawInvite {
    approximate_member_count?: number;
    approximate_presence_count?: number;
    // the gateway only gets an id
    channel?: Types.Channels.PartialChannel;
    // gateway
    channel_id?: string;
    code: string;
    created_at?: string;
    expires_at?: string;
    flags?: number;
    guild?: Types.Guilds.RawInviteGuild;
    guild_id?: string;
    guild_scheduled_event?: Types.ScheduledEvents.RawScheduledEvent;
    inviter?: Types.Users.RawUser;
    max_age?: number;
    max_uses?: number;
    roles?: Array<Types.Guilds.RawInviteRole>;
    /** @deprecated */
    stage_instance?: RawInviteStageInstance;
    target_application?: Types.Applications.RawPartialApplication;
    target_type?: InviteTargetTypes;
    target_user?: Types.Users.RawUser;
    temporary?: boolean;
    type: InviteTypes;
    uses?: number;
}


export interface RawInviteStageInstance {
    members: Array<Types.Guilds.RawMember>;
    participant_count: number;
    speaker_count: number;
    topic: string;
}


export interface InviteStageInstance {
    members: Array<Member>;
    participantCount: number;
    speakerCount: number;
    topic: string;
}

export interface CreateInviteOptions {
    /** How long the invite should last. */
    maxAge?: number;
    /** How many times the invite can be used. */
    maxUses?: number;
    /** The reason for creating the invite. */
    reason?: string;
    /** The IDs of roles to add to the users using the invite. Requires the `MANAGE_ROLES` permission. */
    roleIDs?: Array<string>;
    /** The id of the embedded application to open for this invite. */
    targetApplicationID?: string;
    /** The [type of target](https://discord.com/developers/docs/resources/channel#invite-target-types) for the invite. */
    targetType?: InviteTargetTypes;
    /** The ID of the user whose stream to display for this invite. */
    targetUserID?: string;
    /** The IDs of users able to accept this invite. */
    targetUsers?: Array<string>;
    /** If the invite should be temporary. */
    temporary?: boolean;
    /** If the invite should be unique. */
    unique?: boolean;
}

export interface RawInviteTargetUsersJobStatusResponse {
    completed_at: string | null;
    created_at: string;
    error_message: string | null;
    processed_users: number;
    status: InviteTargetUsersJobStatus;
    total_users: number;
}

export interface InviteTargetUsersJobStatusResponse {
    completedAt: Date | null;
    createdAt: Date;
    errorMessage: string | null;
    processedUsers: number;
    status: InviteTargetUsersJobStatus;
    totalUsers: number;
}


export interface GetInviteOptions {
    /** The id of the guild scheduled event to include with the invite. */
    guildScheduledEventID?: string;
    /** If the invite should contain approximate member counts. */
    withCounts?: boolean;
}

export interface GetInviteWithCountsOptions extends Omit<GetInviteOptions, "withCounts" | "guildScheduledEventID"> {
    /** The id of the guild scheduled event to include with the invite. */
    guildScheduledEventID?: undefined;
    /** If the invite should contain approximate member counts. */
    withCounts: true;
}

export interface GetInviteWithScheduledEventOptions extends Omit<GetInviteOptions, "withCounts" | "guildScheduledEventID"> {
    /** The id of the guild scheduled event to include with the invite. */
    guildScheduledEventID: string;
    /** If the invite should contain approximate member counts. */
    withCounts?: false;
}

export interface GetInviteWithCountsAndScheduledEventOptions extends Omit<GetInviteOptions, "withCounts" | "guildScheduledEventID"> {
    /** The id of the guild scheduled event to include with the invite. */
    guildScheduledEventID: string;
    /** If the invite should contain approximate member counts. */
    withCounts: true;
}

export interface GetInviteWithNoneOptions extends Omit<GetInviteOptions, "withCounts" | "guildScheduledEventID"> {
    /** The id of the guild scheduled event to include with the invite. */
    guildScheduledEventID?: undefined;
    /** If the invite should contain approximate member counts. */
    withCounts?: false;
}
export type InviteChannel = Types.Channels.AnyInviteChannel | Types.Channels.PartialInviteChannel | Types.Shared.Uncached;
export type DMInviteChannel = Types.Channels.AnyDMInviteChannel | Types.Channels.PartialDMInviteChannel | Types.Shared.Uncached;
export type GuildInviteChannel = Types.Channels.AnyGuildInviteChannel | Types.Channels.PartialGuildInviteChannel | Types.Shared.Uncached;
