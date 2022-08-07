import RESTGuildChannel from "./RESTGuildChannel";
import type RESTClient from "../../RESTClient";
import type { EditStageChannelOptions, RawOverwrite, RawRESTStageChannel } from "../../routes/Channels";
import type { ChannelTypes } from "../../Constants";
import PermissionOverwrite from "../PermissionOverwrite";

/** Represents a guild stage channel. */
export default class RESTStageChannel extends RESTGuildChannel {
	/** The bitrate of the stage channel. */
	bitrate: number;
	/** The permission overwrites of this channel. */
	permissionOverwrites: Array<PermissionOverwrite>;
	/** The position of this channel on the sidebar. */
	position: number;
	/** The id of the voice region of the channel, `null` is automatic. */
	rtcRegion: string | null;
	/** The topic of the channel. */
	topic: string | null;
	declare type: ChannelTypes.GUILD_STAGE_VOICE;
	constructor(data: RawRESTStageChannel, client: RESTClient) {
		super(data, client);
		this.bitrate              = data.bitrate;
		this.permissionOverwrites = data.permission_overwrites.map(overwrite => new PermissionOverwrite(overwrite));
		this.position             = data.position;
		this.rtcRegion            = data.rtc_region;
		this.topic                = data.topic;
	}

	/**
	 * Edit this channel.
	 *
	 * @param {Object} options
	 * @param {String} [options.name] - [All] The name of the channel.
	 * @param {?RawOverwrite[]} [options.permissionOverwrites] - [All Guild] Channel or category specific permissions
	 * @param {?Number} [options.position] - [All Guild] The position of the channel in the channel list.
	 * @param {?String} [options.rtcRegion] - [Voice, Stage] The voice region id of the channel, null for automatic.
	 * @param {String} [reason] - The reason to be displayed in the audit log.
	 * @returns {Promise<RESTStageChannel>}
	 */
	async edit(options: EditStageChannelOptions, reason?: string) {
		return this._client.channels.edit<RESTStageChannel>(this.id, options, reason);
	}
}
