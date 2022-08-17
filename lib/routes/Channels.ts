import BaseRoute from "./BaseRoute";
import type {
	AddGroupRecipientOptions,
	AnyChannel,
	EditChannelOptions,
	RawChannel,
	RawOverwrite
} from "../types/channels";
import type { ChannelTypes, ThreadAutoArchiveDuration, VideoQualityModes } from "../Constants";
import * as Routes from "../util/Routes";
import Channel from "../structures/Channel";

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
	async edit<T extends Channel = AnyChannel>(id: string, options: EditChannelOptions, reason?: string) {
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
		}).then(data => Channel.from<T>(data, this._client));
	}

	async get<T extends Channel = AnyChannel>(id: string) {
		return this._manager.authRequest<RawChannel>({
			method: "GET",
			path:   Routes.CHANNEL(id)
		}).then(data => Channel.from<T>(data, this._client));
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
