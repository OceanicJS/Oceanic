import type { ThreadMetadata } from "./ThreadChannel";
import ThreadChannel from "./ThreadChannel";
import type { ChannelTypes, ThreadAutoArchiveDuration } from "../Constants";
import type Client from "../Client";
import type { EditPublicThreadChannelOptions, RawAnnouncementThreadChannel } from "../types/channels";
import type { JSONAnnouncementThreadChannel } from "../types/json";

/** Represents a guild thread channel. */
export default class AnnouncementThreadChannel extends ThreadChannel<AnnouncementThreadChannel> {
	declare threadMetadata: ThreadMetadata;
	declare type: ChannelTypes.ANNOUNCEMENT_THREAD;
	constructor(data: RawAnnouncementThreadChannel, client: Client) {
		super(data, client);
	}


	/**
	 * Edit a channel.
	 *
	 * @param {String} id - The id of the channel to edit.
	 * @param {Object} options
	 * @param {Boolean} [options.archived] - If the thread is archived.
	 * @param {ThreadAutoArchiveDuration} [options.autoArchiveDuration] - The duration after which the thread will be archived.
	 * @param {Number} [options.flags] - The [channel flags](https://discord.com/developers/docs/resources/channel#channel-object-channel-flags) to set on the channel.
	 * @param {Boolean} [options.locked] - If the thread should be locked.
	 * @param {String} [options.name] - The name of the channel.
	 * @param {?Number} [options.rateLimitPerUser] - The seconds between sending messages for users. Between 0 and 21600.
	 * @param {String} [options.reason] - The reason to be displayed in the audit log.
	 * @returns {Promise<AnnouncementThreadChannel>}
	 */
	override async edit(options: EditPublicThreadChannelOptions) {
		return this._client.rest.channels.edit<this>(this.id, options);
	}

	override toJSON(): JSONAnnouncementThreadChannel {
		return {
			...super.toJSON(),
			threadMetadata: this.threadMetadata,
			type:           this.type
		};
	}
}
