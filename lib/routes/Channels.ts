import BaseRoute from "./BaseRoute";
import type { RawPartialUser } from "./Users";
import type { ChannelTypes, OverwriteTypes, ThreadAutoArchiveDuration, VideoQualityModes } from "../Constants";

export default class Channels extends BaseRoute {}

export interface RawChannel {
	application_id?: string;
	bitrate?: number;
	default_auto_archive_duration?: number;
	flags?: number;
	guild_id?: string;
	icon?: string | null;
	id: string;
	last_message_id?: string | null;
	last_pin_timestamp?: string | null;
	member?: RawRESTThreadMember;
	member_count?: number;
	message_count?: number;
	name?: string | null;
	nsfw?: boolean;
	owner_id?: string;
	parent_id?: string | null;
	permission_overwrites?: Array<RawOverwrite>;
	permissions?: string;
	position?: number;
	rate_limit_per_user?: number;
	recipients?: Array<RawPartialUser>;
	rtc_region?: string | null;
	thread_metadata?: RawThreadMetadata;
	topic?: string | null;
	total_message_sent?: number;
	type: ChannelTypes;
	user_limit?: number;
	video_quality_mode?: VideoQualityModes;
}
export type RawRESTDMChannel = Required<Pick<RawChannel, "id" | "last_message_id" | "recipients">> & { type: ChannelTypes.DM; };
// managed and nicks are undocumented, creating a group dm DOES work, and they show in the client, so we're supporting them
export type RawRESTGroupChannel = Required<Pick<RawChannel, "id" | "recipients" | "application_id" | "name" | "icon" | "owner_id">> & { managed: boolean; nicks?: Record<"id" | "nick", string>; type: ChannelTypes.GROUP_DM; };

export interface RawOverwrite {
	allow: string;
	deny: string;
	id: string;
	type: OverwriteTypes;
}

export interface RawThreadMetadata {
	archive_timestamp: string;
	archived: boolean;
	auto_archive_duration: ThreadAutoArchiveDuration;
	create_timestamp?: string | null;
	invitable?: boolean;
	locked: boolean;
}

export interface RawThreadMember {
	flags: number;
	id?: string;
	join_timestamp: string;
	user_id?: string;
}
export type RawRESTThreadMember = Required<RawThreadMember>;
