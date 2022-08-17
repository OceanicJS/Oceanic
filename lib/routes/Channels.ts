import BaseRoute from "./BaseRoute";
import type { RawUser, RawUserWithMember } from "./Users";
import type { PartialEmoji, RawMember } from "./Guilds";
import type { RawApplication } from "./OAuth";
import type {
	ButtonStyles,
	ChannelTypes,
	ComponentTypes,
	GuildChannelTypes,
	InteractionTypes,
	MessageActivityTypes,
	MessageTypes,
	OverwriteTypes,
	StickerFormatTypes,
	TextInputStyles,
	ThreadAutoArchiveDuration,
	VideoQualityModes
} from "../Constants";
import * as Routes from "../util/Routes";
import Channel from "../structures/Channel";
import type User from "../structures/User";
import type Member from "../structures/Member";
import type TextChannel from "../structures/TextChannel";
import type PrivateChannel from "../structures/PrivateChannel";
import type VoiceChannel from "../structures/VoiceChannel";
import type GroupChannel from "../structures/GroupChannel";
import type CategoryChannel from "../structures/CategoryChannel";
import type NewsChannel from "../structures/NewsChannel";
import type NewsThreadChannel from "../structures/NewsThreadChannel";
import type PublicThreadChannel from "../structures/PublicThreadChannel";
import type PrivateThreadChannel from "../structures/PrivateThreadChannel";
import type StageChannel from "../structures/StageChannel";

export default class Channels extends BaseRoute {
	/**
	 * Add a user to a group channel.
	 *
	 * @param {String} groupID - The id of the group to add the user to.
	 * @param {Object} options
	 * @param {String} options.accessToken - The access token of the user to add.
	 * @param {String} [options.nick] - The nickname of the user to add.
	 * @param {String} options.userID - The id of the user to add.
	 * @returns {Promise<boolean>}
	 */
	async addGroupRecipient(groupID: string, options: AddGroupRecipientOptions) {
		return this._manager.authRequest<null>({
			method: "PUT",
			path:   Routes.GROUP_RECIPIENT(groupID, options.userID),
			json:   {
				access_token: options.accessToken,
				nick:         options.nick
			}
		}).then(res => res === null);
	}

	/**
	 * Delete or close a channel.
	 *
	 * @param {String} id - The ID of the channel to delete or close.
	 * @param {String} [reason] - The reason to be displayed in the audit log.
	 * @returns {Promise<void>}
	 */
	async delete(id: string, reason?: string) {
		await this._manager.authRequest<RawChannel>({
			method: "DELETE",
			path:   Routes.CHANNEL(id),
			reason
		});
	}

	/**
	 * Edit a channel.
	 *
	 * @template T
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
	 * @returns {Promise<T>}
	 */
	async edit<T extends Channel = Channel>(id: string, options: EditChannelOptions, reason?: string) {
		if (options.icon) {
			try {
				options.icon = this._client._convertImage(options.icon);
			} catch (err) {
				throw new Error("Invalid icon provided. Ensure you are providing a valid, fully-qualified base64 url.", { cause: err as Error });
			}
		}

		return this._manager.authRequest<RawChannel>({
			method: "PATCH",
			path:   Routes.CHANNEL(id),
			json:   {
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
			},
			reason
		}).then(data => Channel.from(data, this._client));
	}

	async get(id: string) {
		return this._manager.authRequest<RawChannel>({
			method: "GET",
			path:   Routes.CHANNEL(id)
		}).then(data => Channel.from(data, this._client));
	}

	/**
	 * Remove a user from the group channel.
	 *
	 * @param {String} groupID - The id of the group to remove the user from.
	 * @param {String} userID - The id of the user to remove.
	 * @returns {Promise<void>}
	 */
	async removeGroupRecipient(groupID: string, userID: string) {
		return this._manager.authRequest<null>({
			method: "DELETE",
			path:   Routes.GROUP_RECIPIENT(groupID, userID)
		}).then(res => res === null);
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
	recipients?: Array<RawUser>;
	rtc_region?: string | null;
	thread_metadata?: RawThreadMetadata;
	topic?: string | null;
	total_message_sent?: number;
	type: ChannelTypes;
	user_limit?: number;
	video_quality_mode?: VideoQualityModes;
}
export type RawGuildChannel = Required<Pick<RawChannel, "id" | "guild_id" | "parent_id">> & { name: string; type: GuildChannelTypes; };
export type RawPrivateChannel = Required<Pick<RawChannel, "id" | "last_message_id" | "recipients">> & { type: ChannelTypes.DM; };
// managed and nicks are undocumented, creating a group dm DOES work, and they show in the client, so we're supporting them
export type RawGroupChannel = Required<Pick<RawChannel, "id" | "recipients" | "application_id" | "icon" | "owner_id" | "nsfw">> & { managed: boolean; name: string; nicks?: Record<"id" | "nick", string>; type: ChannelTypes.GROUP_DM; };
export type RawTextChannel = Omit<RawGuildChannel, "type"> & Required<Pick<RawChannel, "default_auto_archive_duration" | "last_message_id" | "last_pin_timestamp" | "rate_limit_per_user" | "topic" | "nsfw" | "permission_overwrites" | "position">> & { type: ChannelTypes.GUILD_TEXT; };
export type RawCategoryChannel = Omit<RawGuildChannel, "type"> & Required<Pick<RawChannel,  "permission_overwrites" | "position">> & { type: ChannelTypes.GUILD_CATEGORY; };
export type RawNewsChannel = Omit<RawTextChannel, "type"> & { type: ChannelTypes.GUILD_NEWS; };
export type RawVoiceChannel = Omit<RawGuildChannel, "type"> & Required<Pick<RawChannel, "bitrate" | "user_limit" | "video_quality_mode" | "rtc_region" | "nsfw" | "topic" | "permission_overwrites" | "position">> & { type: ChannelTypes.GUILD_VOICE; };
export type RawStageChannel = Omit<RawGuildChannel, "type"> & Required<Pick<RawChannel, "bitrate" | "rtc_region" | "topic" | "permission_overwrites" | "position">> & { type: ChannelTypes.GUILD_STAGE_VOICE; };
export type RawThreadChannel = RawNewsThreadChannel | RawPublicThreadChannel | RawPrivateThreadChannel;
export type RawNewsThreadChannel = Required<Pick<RawChannel, "id" | "guild_id" | "parent_id" | "owner_id" | "last_message_id" | "thread_metadata" | "message_count" | "member_count" | "rate_limit_per_user" | "flags" | "total_message_sent">> & { member?: RawChannel["member"]; name: string; type: ChannelTypes.GUILD_NEWS_THREAD; };
export type RawPublicThreadChannel = Omit<RawNewsThreadChannel, "type"> & { type: ChannelTypes.GUILD_PUBLIC_THREAD; };
export type RawPrivateThreadChannel = Omit<RawNewsThreadChannel, "type"> & { type: ChannelTypes.GUILD_PRIVATE_THREAD; };

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

export interface AddGroupRecipientOptions {
	accessToken: string;
	nick?: string;
	userID: string;
}

export interface CreateMessageOptions {
	allowedMentions?: AllowedMentions;
	attachments?: Array<MessageAttachment>;
	components?: Array<MessageActionRow>;
	content?: string;
	embeds?: Array<EmbedOptions>;
	flags?: number;
	messageReference?: MessageReference;
	stickerIDs?: Array<string>;
	tts?: boolean;
}

export interface EmbedOptions {
	author?: EmbedAuthorOptions;
	color?: number;
	description?: string;
	fields?: Array<EmbedField>;
	footer?: EmbedFooterOptions;
	image?: EmbedImageOptions;
	thumbnail?: EmbedThumbnailOptions;
	timestamp?: string;
	title?: string;
	url?: string;
}
export interface Embed {
	author?: EmbedAuthor;
	color?: number;
	description?: string;
	fields?: Array<EmbedField>;
	footer?: EmbedFooter;
	image?: EmbedImage;
	provider?: EmbedProvider;
	thumbnail?: EmbedThumbnail;
	timestamp?: string;
	title?: string;
	type?: EmbedType;
	url?: string;
	video?: EmbedVideo;
}
export type EmbedType = "rich" | "image" | "video" | "gifv" | "article" | "link";

export interface EmbedFooterOptions {
	icon_url?: string;
	text: string;
}
export interface EmbedImageOptions {
	url: string;
}

export interface EmbedThumbnailOptions {
	url: string;
}

export interface EmbedAuthorOptions {
	icon_url?: string;
	name: string;
	url?: string;
}

export interface EmbedField {
	inline?: boolean;
	name: string;
	value: string;
}
export interface EmbedFooter extends EmbedFooterOptions {
	proxy_icon_url?: string;
}
export interface EmbedImage extends EmbedImageOptions {
	height?: number;
	proxy_url?: string;
	width?: number;
}

export interface EmbedThumbnail extends EmbedThumbnailOptions {
	height?: number;
	proxy_url?: string;
	width?: number;
}

export interface EmbedVideo {
	height?: number;
	proxy_url?: string;
	url?: string;
	width?: number;
}

export interface EmbedProvider {
	name?: string;
	url?: string;
}
export interface EmbedAuthor extends EmbedAuthorOptions {
	proxy_icon_url?: string;
}

export interface AllowedMentions {
	everyone?: boolean;
	repliedUser?: boolean;
	roles?: boolean | Array<string>;
	users?: boolean | Array<string>;
}

export interface MessageReference {
	channelID?: string;
	failIfNotExists?: boolean;
	guildID?: string;
	messageID?: string;
}

export type Component = MessageComponent | ModalComponent;
export type MessageComponent = ButtonComponent | SelectMenu;
export type ModalComponent = TextInput;
export type ButtonComponent = TextButton | URLButton;
export interface ActionRowBase {
	components: Array<Component>;
	type: ComponentTypes.ACTION_ROW;
}

export interface MessageActionRow extends ActionRowBase {
	components: Array<MessageComponent>;
}

export interface ModalActionRow extends ActionRowBase {
	components: Array<ModalComponent>;
}

export interface ButtonBase {
	disabled?: boolean;
	emoji?: PartialEmoji;
	label?: string;
	style: ButtonStyles;
	type: ComponentTypes.BUTTON;
}

export interface TextButton extends ButtonBase {
	custom_id: string;
	style: ButtonStyles.PRIMARY | ButtonStyles.SECONDARY | ButtonStyles.SUCCESS | ButtonStyles.DANGER;
}

export interface URLButton extends ButtonBase {
	style: ButtonStyles.LINK;
	url: string;
}

export interface SelectMenu {
	custom_id: string;
	disabled?: boolean;
	max_values?: number;
	min_values?: number;
	options: Array<SelectOption>;
	placeholder?: string;
	type: ComponentTypes.SELECT_MENU;
}

export interface SelectOption {
	default?: boolean;
	description?: string;
	emoji?: PartialEmoji;
	label: string;
	value: string;
}

export interface TextInput {
	custom_id: string;
	label: string;
	max_length?: boolean;
	min_length?: number;
	placeholder?: string;
	required?: boolean;
	style: TextInputStyles;
	type: ComponentTypes.TEXT_INPUT;
	value?: string;
}

export interface RawAttachment {
	content_type?: string;
	description?: string;
	ephemeral?: boolean;
	filename: string;
	height?: number;
	id: string;
	proxy_url: string;
	size: number;
	url: string;
	width?: number;
}
// @TODO verify what can be sent with `attachments` in message creation/deletion, this is an assumption
export type MessageAttachment = Pick<RawAttachment, "id"> & Partial<Pick<RawAttachment, "description" | "filename">>;

export interface RawAllowedMentions {
	parse: Array<"everyone" | "roles" | "users">;
	replied_user?: boolean;
	roles?: Array<string>;
	users?: Array<string>;
}

export interface RawMessage {
	activity?: MessageActivity;
	application?: RawApplication; // @TODO specific properties sent
	application_id?: string;
	attachments: Array<RawAttachment>;
	author: RawUser; // this can be an invalid user if `webhook_id` is set
	channel_id: string;
	components?: Array<MessageActionRow>;
	content: string;
	edited_timestamp: string | null;
	embeds: Array<Embed>;
	flags?: number;
	id: string;
	interaction?: RawMessageInteraction;
	mention_channels?: Array<ChannelMention>;
	mention_everyone: boolean;
	mention_roles: Array<string>;
	mentions: Array<RawUserWithMember>;
	message_reference?: RawMessageReference;
	nonce?: number | string;
	pinned: boolean;
	position?: number;
	reactions?: Array<MessageReaction>;
	referenced_message?: RawMessage | null;
	// stickers exists, but is deprecated
	sticker_items?: Array<StickerItem>;
	thread?: RawChannel;
	timestamp: string;
	tts: boolean;
	type: MessageTypes;
	webhook_id?: string;
}

export interface ChannelMention {
	guild_id: string;
	id: string;
	name: string;
	type: ChannelTypes;
}

export interface MessageReaction {
	count: number;
	emoji: PartialEmoji;
	me: boolean;
}

export interface MessageActivity {
	party_id?: string;
	type: MessageActivityTypes;
}


export interface RawMessageReference {
	channel_id: string;
	fail_if_not_exists: boolean;
	guild_id: string;
	message_id: string;
}

export interface RawMessageInteraction {
	id: string;
	member?: RawMember;
	name: string;
	type: InteractionTypes;
	user: RawUser;
}

export interface MessageInteraction {
	id: string;
	member?: Member;
	name: string;
	type: InteractionTypes;
	user: User;
}


export interface StickerItem {
	format_type: StickerFormatTypes;
	id: string;
	name: string;
}


// @TODO directory & forum
export type AnyChannel = TextChannel | PrivateChannel | VoiceChannel | GroupChannel | CategoryChannel | NewsChannel | NewsThreadChannel | PublicThreadChannel | PrivateThreadChannel | StageChannel;
export type AnyPrivateChannel = PrivateChannel | GroupChannel;
export type AnyGuildChannel = Exclude<AnyChannel, AnyPrivateChannel>;
export type AnyTextChannel = TextChannel | PrivateChannel | VoiceChannel | GroupChannel | NewsChannel | NewsThreadChannel | PublicThreadChannel | PrivateThreadChannel;
export type AnyGuildTextChannel = Exclude<AnyTextChannel, AnyPrivateChannel>;
export type AnyThreadChannel = NewsThreadChannel | PublicThreadChannel | PrivateThreadChannel;
export type AnyVoiceChannel = VoiceChannel | StageChannel;
