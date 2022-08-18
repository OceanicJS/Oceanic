import type { RawUser } from "./users";
import type { ScheduledEventEntityTypes, ScheduledEventPrivacyLevels, ScheduledEventStatuses } from "../Constants";

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
