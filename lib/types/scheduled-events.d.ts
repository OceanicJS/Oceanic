import type { RawUser } from "./users";
import type { RawMember } from "./guilds";
import type { Uncached } from "./shared";
import type { ScheduledEventEntityTypes, ScheduledEventPrivacyLevels, ScheduledEventStatuses } from "../Constants";
import type Member from "../structures/Member";
import type User from "../structures/User";
import type ScheduledEvent from "../structures/ScheduledEvent";

export interface RawScheduledEvent {
	channel_id: string | null;
	creator?: RawUser;
	creator_id?: string | null;
	description?: string | null;
	entity_id: string | null;
	entity_metadata: ScheduledEventEntityMetadata | null;
	entity_type: ScheduledEventEntityTypes;
	guild_id: string;
	id: string;
	image?: string | null;
	name: string;
	privacy_level: ScheduledEventPrivacyLevels;
	scheduled_end_time: string | null;
	scheduled_start_time: string;
	status: ScheduledEventStatuses;
	user_count?: number;
}

export interface ScheduledEventEntityMetadata {
	location?: string;
}

export interface CreateScheduledEventOptions {
	channelID?: string;
	description?: string;
	entityMetadata?: {
		location?: string;
	};
	entityType: ScheduledEventEntityTypes;
	image?: Buffer | string;
	name: string;
	privacyLevel: ScheduledEventPrivacyLevels;
	reason?: string;
	scheduledEndTime?: string;
	scheduledStartTime: string;
}


export interface EditScheduledEventOptions extends Omit<Partial<CreateScheduledEventOptions>, "channelID"> {
	channelID?: string | null;
	status?: ScheduledEventStatuses;
}

export interface GetScheduledEventUsersOptions {
	after?: string;
	before?: string;
	limit?: number;
	withMember?: boolean;
}

export interface RawScheduledEventUser {
	guild_scheduled_event_id: string;
	member?: RawMember;
	user: RawUser;
}

export interface ScheduledEventUser {
	guildScheduledEvent: ScheduledEvent | Uncached;
	member?: Member;
	user: User;
}
