/** @module Types/ScheduledEvents */
import type { RawUser } from "./users";
import type { RawMember } from "./guilds";
import type { GuildScheduledEventEntityTypes, GuildScheduledEventPrivacyLevels, GuildScheduledEventStatuses } from "../Constants";
import type Member from "../structures/Member";
import type User from "../structures/User";
import type GuildScheduledEvent from "../structures/GuildScheduledEvent";

export interface RawScheduledEvent {
    channel_id: string | null;
    creator?: RawUser;
    creator_id?: string | null;
    description?: string | null;
    entity_id: string | null;
    entity_metadata: ScheduledEventEntityMetadata | null;
    entity_type: GuildScheduledEventEntityTypes;
    guild_id: string;
    id: string;
    image?: string | null;
    name: string;
    privacy_level: GuildScheduledEventPrivacyLevels;
    scheduled_end_time: string | null;
    scheduled_start_time: string;
    status: GuildScheduledEventStatuses;
    user_count?: number;
}

export interface ScheduledEventEntityMetadata {
    location?: string;
}

export interface CreateScheduledEventOptions {
    /** The ID of the stage channel the event is taking place in. Optional if `entityType` is `EXTERNAL`. */
    channelID?: string;
    /** The description of the event. */
    description?: string;
    /** The metadata for the entity. */
    entityMetadata?: {
        /** The location of the event. Required if `entityType` is `EXTERNAL`. */
        location?: string;
    };
    /** The type of the event. */
    entityType: GuildScheduledEventEntityTypes;
    /** The cover image of the event (buffer, or full data url). */
    image?: Buffer | string;
    /** The name of the scheduled event. */
    name: string;
    /** The privacy level of the event. */
    privacyLevel: GuildScheduledEventPrivacyLevels;
    /** The reason for creating the scheduled event. */
    reason?: string;
    /** The time the event ends. ISO8601 Timestamp. Required if `entityType` is `EXTERNAL`. */
    scheduledEndTime?: string;
    /** The time the event starts. ISO8601 Timestamp. */
    scheduledStartTime: string;
}


export interface EditScheduledEventOptions extends Omit<Partial<CreateScheduledEventOptions>, "channelID"> {
    /** The ID of the stage channel the event is taking place in. Required to be `null` if changing `entityType` to `EXTERNAL`. */
    channelID?: string | null;
    /** The status of the event. */
    status?: GuildScheduledEventStatuses;
}

export interface GetScheduledEventUsersOptions {
    /** The ID of the entry to get users after. */
    after?: string;
    /** The ID of the entry to get users before. */
    before?: string;
    /** The maximum number of users to get. */
    limit?: number;
    /** If the member object should be included. */
    withMember?: boolean;
}

export interface RawScheduledEventUser {
    guild_scheduled_event_id: string;
    member?: RawMember;
    user: RawUser;
}

export interface ScheduledEventUser {
    guildScheduledEvent?: GuildScheduledEvent;
    guildScheduledEventID: string;
    member?: Member;
    user: User;
}
