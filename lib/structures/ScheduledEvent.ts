import Base from "./Base";
import type User from "./User";
import type Client from "../Client";
import type { ImageFormat, ScheduledEventEntityTypes, ScheduledEventPrivacyLevels, ScheduledEventStatuses } from "../Constants";
import * as Routes from "../util/Routes";
import type { RawScheduledEvent, ScheduledEventEntityMetadata } from "../types/scheduled-events";

export default class ScheduledEvent extends Base {
	channelID: string | null;
	creator?: User;
	creatorID?: string | null;
	description?: string | null;
	entityID: string | null;
	entityMetadata: ScheduledEventEntityMetadata | null;
	entityType: ScheduledEventEntityTypes;
	guildID: string;
	image?: string | null;
	name: string;
	privacyLevel: ScheduledEventPrivacyLevels;
	scheduledEndTime: Date | null;
	scheduledStartTime: Date;
	status: ScheduledEventStatuses;
	userCount?: number;
	constructor(data: RawScheduledEvent, client: Client) {
		super(data.id, client);
		this.update(data);
	}

	protected update(data: RawScheduledEvent) {
		this.channelID          = data.channel_id;
		this.creatorID          = data.creator_id;
		this.description        = data.description;
		this.entityID           = data.entity_id;
		this.entityMetadata     = data.entity_metadata;
		this.entityType         = data.entity_type;
		this.guildID            = data.guild_id;
		this.image              = data.image;
		this.name               = data.name;
		this.privacyLevel       = data.privacy_level;
		this.scheduledEndTime   = data.scheduled_end_time ? new Date(data.scheduled_end_time) : null;
		this.scheduledStartTime = new Date(data.scheduled_start_time);
		this.status             = data.status;
		this.userCount          = data.user_count;
		if (data.creator) this.creator = this._client.users.update(data.creator);
	}

	/**
	 * The url of this event's cover image.
	 *
	 * @param {ImageFormat} format The format of the image.
	 * @param {number} size The size of the image.
	 * @returns {string}
	 */
	imageURL(format?: ImageFormat, size?: number) {
		return !this.image ? null : this._client._formatImage(Routes.GUILD_SCHEDULED_EVENT_COVER(this.id, this.image), format, size);
	}
}
