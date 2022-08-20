import Base from "./Base";
import type User from "./User";
import type Client from "../Client";
import type { ImageFormat, ScheduledEventEntityTypes, ScheduledEventPrivacyLevels, ScheduledEventStatuses } from "../Constants";
import * as Routes from "../util/Routes";
import type { RawScheduledEvent, ScheduledEventEntityMetadata } from "../types/scheduled-events";

export default class ScheduledEvent extends Base {
	/** The id of the channel in which the event will be hosted. `null` if entityType is `EXTERNAL` */
	channelID: string | null;
	/** The creator of the event. Not present on events created before October 25th, 2021. */
	creator?: User;
	/** The id of the creator of the event. Not present on events created before October 25th, 2021. */
	creatorID?: string | null;
	/** The description of the event. */
	description?: string | null;
	/** The id of the entity associated with the event. */
	entityID: string | null;
	/** The [metadata](https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object-field-requirements-by-entity-type) associated with the event. */
	entityMetadata: ScheduledEventEntityMetadata | null;
	/** The [entity type](https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object-guild-scheduled-event-entity-types) of the event */
	entityType: ScheduledEventEntityTypes;
	/** The id of the guild that the scheduled event belongs to. */
	guildID: string;
	/** The cover */
	image?: string | null;
	/** The name of the event. */
	name: string;
	/** The [privacy level](https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object-guild-scheduled-event-privacy-level) of the event. */
	privacyLevel: ScheduledEventPrivacyLevels;
	/** The time at which the event will end. Required if entityType is `EXTERNAL`. */
	scheduledEndTime: Date | null;
	/** The time at which the event will start. */
	scheduledStartTime: Date;
	/** The [status](https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object-guild-scheduled-event-status) of the event. */
	status: ScheduledEventStatuses;
	/** The number of users subscribed to the event. */
	userCount?: number;
	/** @hideconstructor */
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
