import BaseRoute from "./BaseRoute";
import type { RawPartialUser } from "./Users";
import type {
	ChannelTypes,
	GuildChannelTypes,
	OverwriteTypes,
	ThreadAutoArchiveDuration,
	VideoQualityModes
} from "../Constants";
import * as Routes from "../util/Routes";
import RESTChannel from "../structures/rest/RESTChannel";

export default class Channels extends BaseRoute {
	/**
	 * Delete or close a channel.
	 *
	 * @param {String} id - The ID of the channel to delete or close.
	 * @param {String} [reason] - The reason to be displayed in the audit log.
	 * @returns {Promise<void>}
	 */
	async delete(id: string, reason?: string) {
		await this._client.authRequest<RawChannel>("DELETE", Routes.CHANNEL(id), undefined, undefined, reason);
	}

	/**
	 * Edit a channel.
	 *
	 * @param {String} id - The id of the channel to edit.
	 * @param {Object} options
	 * @param {Boolean} [options.archived] - [Thread] If the thread is archived.
	 * @param {ThreadAutoArchiveDuration} [options.autoArchiveDuration] - [Thread] The duration after which the thread will be archived.
	 * @param {?Number} [options.bitrate] - [Voice, Stage] The bitrate of the channel. Minimum 8000.
	 * @param {?ThreadAutoArchiveDuration} [options.defaultAutoArchiveDuration] - [Text, News] The default auto archive duration for threads made in this channel.
	 * @param {Number} [options.flags] - [Thread] The [channel flags](https://discord.com/developers/docs/resources/channel#channel-object-channel-flags) to set on the channel.
	 * @param {?String} [options.icon] - [Group DM] The icon of the channel.
	 * @param {Boolean} [options.invitable] - [Private Thread] If non-moderators can add other non-moderators to the thread. Private threads only.
	 * @param {Boolean} [options.locked] - [Thread] If the thread should be locked.
	 * @param {String} [options.name] - [All] The name of the channel.
	 * @param {?Boolean} [options.nsfw] -[Text, Voice, News] - If the channel is age gated.
	 * @param {?String} [options.parentID] - [Text, Voice, News] The id of the parent category channel.
	 * @param {?RawOverwrite[]} [options.permissionOverwrites] - [All Guild] Channel or category specific permissions
	 * @param {?Number} [options.position] - [All Guild] The position of the channel in the channel list.
	 * @param {?Number} [options.rateLimitPerUser] - [Thread, Text, News] The seconds between sending messages for users. Between 0 and 21600.
	 * @param {?String} [options.rtcRegion] - [Voice, Stage] The voice region id of the channel, null for automatic.
	 * @param {?String} [options.topic] - [Text, News] The topic of the channel.
	 * @param {ChannelTypes.GUILD_TEXT | ChannelTypes.GUILD_NEWS} [options.type] - [Text, News] Provide the opposite type to convert the channel.
	 * @param {?Number} [options.userLimit] - [Voice] The maximum amount of users in the channel. `0` is unlimited, values range 1-99.
	 * @param {?VideoQualityModes} [options.videoQualityMode] - [Voice] The [video quality mode](https://discord.com/developers/docs/resources/channel#channel-object-video-quality-modes) of the channel.
	 * @param {String} [reason] - The reason to be displayed in the audit log.
	 * @returns {Promise<RESTChannel>}
	 */
	async edit<T extends RESTChannel = RESTChannel>(id: string, options: EditChannelOptions, reason?: string) {
		if (options.icon) {
			try {
				options.icon = this._client._convertImage(options.icon);
			} catch (err) {
				throw new Error("Invalid icon provided. Ensure you are providing a valid, fully-qualified base64 url.", { cause: err });
			}
		}
		return this._client.authRequest<RawChannel>("PATCH", Routes.CHANNEL(id), {
			archived:                      options.archived,
			auto_archive_duration:         options.autoArchiveDuration,
			bitrate:                       options.bitrate,
			default_auto_archive_duration: options.defaultAutoArchiveDuration,
			flags:                         options.flags,
			icon:                          options.icon,
			invitable:                     options.invitable,
			locked:                        options.locked,
			name:                          options.name,
			nsfw:                          options.nsfw,
			parent_id:                     options.parentID,
			permission_overwrites:         options.permissionOverwrites,
			position:                      options.position,
			rate_limit_per_user:           options.rateLimitPerUser,
			rtc_region:                    options.rtcRegion,
			topic:                         options.topic,
			type:                          options.type,
			user_limit:                    options.userLimit,
			video_quality_mode:            options.videoQualityMode
		}, undefined, reason).then(data => RESTChannel.from(data, this._client) as T);
	}

	async get(id: string) {
		return this._client.authRequest<RawChannel>("GET", Routes.CHANNEL(id)).then(data => RESTChannel.from(data, this._client));
	}
}

export interface RawChannel {
	application_id?: string;
	bitrate?: number;
	default_auto_archive_duration?: ThreadAutoArchiveDuration;
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
export type RawRESTGuildChannel = Required<Pick<RawChannel, "id" | "guild_id" | "parent_id">> & { name: string; type: GuildChannelTypes; };
export type RawRESTDMChannel = Required<Pick<RawChannel, "id" | "last_message_id" | "recipients">> & { type: ChannelTypes.DM; };
// managed and nicks are undocumented, creating a group dm DOES work, and they show in the client, so we're supporting them
export type RawRESTGroupChannel = Required<Pick<RawChannel, "id" | "recipients" | "application_id" | "icon" | "owner_id" | "nsfw">> & { managed: boolean; name: string; nicks?: Record<"id" | "nick", string>; type: ChannelTypes.GROUP_DM; };
export type RawRESTTextChannel = Omit<RawRESTGuildChannel, "type"> & Required<Pick<RawChannel, "default_auto_archive_duration" | "last_message_id" | "last_pin_timestamp" | "rate_limit_per_user" | "topic" | "nsfw" | "permission_overwrites" | "position">> & { type: ChannelTypes.GUILD_TEXT; };
export type RawRESTCategoryChannel = Omit<RawRESTGuildChannel, "type"> & Required<Pick<RawChannel,  "permission_overwrites" | "position">> & { type: ChannelTypes.GUILD_CATEGORY; };
export type RawRESTNewsChannel = Omit<RawRESTTextChannel, "type"> & { type: ChannelTypes.GUILD_NEWS; };
export type RawRESTVoiceChannel = Omit<RawRESTGuildChannel, "type"> & Required<Pick<RawChannel, "bitrate" | "user_limit" | "video_quality_mode" | "rtc_region" | "nsfw" | "topic" | "permission_overwrites" | "position">> & { type: ChannelTypes.GUILD_VOICE; };
export type RawRESTStageChannel = Omit<RawRESTGuildChannel, "type"> & Required<Pick<RawChannel, "bitrate" | "rtc_region" | "topic" | "permission_overwrites" | "position">> & { type: ChannelTypes.GUILD_STAGE_VOICE; };
export type RawRESTThreadChannel = RawRESTNewsThreadChannel | RawRESTPublicThreadChannel | RawRESTPrivateThreadChannel;
export type RawRESTNewsThreadChannel = Required<Pick<RawChannel, "id" | "guild_id" | "parent_id" | "owner_id" | "last_message_id" | "thread_metadata" | "message_count" | "member_count" | "rate_limit_per_user" | "flags" | "total_message_sent">> & { member?: RawChannel["member"]; name: string; type: ChannelTypes.GUILD_NEWS_THREAD; };
export type RawRESTPublicThreadChannel = Omit<RawRESTNewsThreadChannel, "type"> & { type: ChannelTypes.GUILD_PUBLIC_THREAD; };
export type RawRESTPrivateThreadChannel = Omit<RawRESTNewsThreadChannel, "type"> & { type: ChannelTypes.GUILD_PRIVATE_THREAD; };

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
export interface EditGroupDMOptions {
	icon?: string | Buffer;
	name?: string;
}

export interface EditGuildChannelOptions {
	archived?: boolean;
	autoArchiveDuration?: ThreadAutoArchiveDuration;
	bitrate?: number | null;
	defaultAutoArchiveDuration?: ThreadAutoArchiveDuration | null;
	flags?: number;
	invitable?: boolean;
	locked?: boolean;
	name?: string;
	nsfw?: string | null;
	parentID?: string | null;
	permissionOverwrites?: Array<RawOverwrite> | null;
	position?: number | null;
	rateLimitPerUser?: number | null;
	rtcRegion?: string | null;
	topic?: string | null;
	type?: ChannelTypes.GUILD_TEXT | ChannelTypes.GUILD_NEWS;
	userLimit?: number | null;
	videoQualityMode?: VideoQualityModes | null;
}

export type EditChannelOptions = EditGroupDMOptions & EditGuildChannelOptions;
export type EditAnyGuildChannelOptions = Pick<EditGuildChannelOptions, "name" | "position" | "permissionOverwrites">;
export type EditTextChannelOptions = EditAnyGuildChannelOptions & Pick<EditGuildChannelOptions, "topic" | "nsfw" | "rateLimitPerUser" | "parentID" | "defaultAutoArchiveDuration"> & { type?: ChannelTypes.GUILD_NEWS; };
export type EditNewsChannelOptions = Omit<EditTextChannelOptions, "rateLimitPerUser"> & { type?: ChannelTypes.GUILD_TEXT; };
export type EditVoiceChannelOptions = EditAnyGuildChannelOptions & Pick<EditGuildChannelOptions, "nsfw" | "bitrate" | "userLimit" | "parentID" | "rtcRegion" | "videoQualityMode">;
export type EditStageChannelOptions = EditAnyGuildChannelOptions & Pick<EditGuildChannelOptions, "bitrate" | "rtcRegion">;
export type EditThreadChannelOptions = EditPublicThreadChannelOptions | EditPrivateThreadChannelOptions;
export type EditPublicThreadChannelOptions = Pick<EditGuildChannelOptions, "name" | "archived" | "autoArchiveDuration" | "locked" | "rateLimitPerUser" | "flags">;
export type EditPrivateThreadChannelOptions = EditPublicThreadChannelOptions & Pick<EditGuildChannelOptions, "invitable">;
