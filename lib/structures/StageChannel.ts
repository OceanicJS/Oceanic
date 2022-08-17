import GuildChannel from "./GuildChannel";
import PermissionOverwrite from "./PermissionOverwrite";
import type { ChannelTypes } from "../Constants";
import type Client from "../Client";
import Collection from "../util/Collection";
import type { EditStageChannelOptions, RawOverwrite, RawStageChannel } from "../types/channels";

/** Represents a guild stage channel. */
export default class StageChannel extends GuildChannel {
	/** The bitrate of the stage channel. */
	bitrate: number;
	/** The permission overwrites of this channel. */
	permissionOverwrites: Collection<string, RawOverwrite, PermissionOverwrite>;
	/** The position of this channel on the sidebar. */
	position: number;
	/** The id of the voice region of the channel, `null` is automatic. */
	rtcRegion: string | null;
	/** The topic of the channel. */
	topic: string | null;
	declare type: ChannelTypes.GUILD_STAGE_VOICE;
	constructor(data: RawStageChannel, client: Client) {
		super(data, client);
		this.permissionOverwrites = new Collection(PermissionOverwrite, client);
	}

	protected update(data: RawStageChannel): void {
		super.update(data);
		this.bitrate   = data.bitrate;
		this.position  = data.position;
		this.rtcRegion = data.rtc_region;
		this.topic     = data.topic;
		data.permission_overwrites.map(overwrite => this.permissionOverwrites.update(overwrite));
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
	 * @returns {Promise<StageChannel>}
	 */
	async edit(options: EditStageChannelOptions, reason?: string) {
		return this._client.rest.channels.edit<StageChannel>(this.id, options, reason);
	}
}
