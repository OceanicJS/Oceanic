import Base from "./Base";
import type User from "./User";
import type Guild from "./Guild";
import type StageChannel from "./StageChannel";
import type Client from "../Client";
import type { ImageFormat, ScheduledEventEntityTypes, ScheduledEventPrivacyLevels, ScheduledEventStatuses } from "../Constants";
import * as Routes from "../util/Routes";
import type { RawScheduledEvent, ScheduledEventEntityMetadata } from "../types/scheduled-events";
import type { JSONScheduledEvent } from "../types/json";

export default class ScheduledEvent extends Base {
	/** The id of the channel in which the event will be hosted. `null` if entityType is `EXTERNAL` */
	channel: StageChannel | null;
	/** The creator of the event. Not present on events created before October 25th, 2021. */
	creator?: User;
	/** The description of the event. */
	description?: string | null;
	/** The id of the entity associated with the event. */
	entityID: string | null;
	/** The [metadata](https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object-field-requirements-by-entity-type) associated with the event. */
	entityMetadata: ScheduledEventEntityMetadata | null;
	/** The [entity type](https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object-guild-scheduled-event-entity-types) of the event */
	entityType: ScheduledEventEntityTypes;
	/** The guild this scheduled event belongs to. */
	guild: Guild;
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
	userCount: number;
	constructor(data: RawScheduledEvent, client: Client) {
		super(data.id, client);
		if (data.creator) this.creator = this._client.users.update(data.creator);
		this.userCount = 0;
		this.update(data);
	}

	protected update(data: Partial<RawScheduledEvent>) {
		if (data.channel_id !== undefined) this.channel = data.channel_id === null ? null : this._client.getChannel<StageChannel>(data.channel_id)!;
		if (data.description !== undefined) this.description = data.description;
		if (data.entity_id !== undefined) this.entityID = data.entity_id;
		if (data.entity_metadata !== undefined) this.entityMetadata = data.entity_metadata;
		if (data.entity_type !== undefined) this.entityType = data.entity_type;
		if (data.guild_id !== undefined) this.guild = this._client.guilds.get(data.guild_id)!;
		if (data.image !== undefined) this.image = data.image;
		if (data.name !== undefined) this.name = data.name;
		if (data.privacy_level !== undefined) this.privacyLevel = data.privacy_level;
		if (data.scheduled_end_time !== undefined) this.scheduledEndTime = data.scheduled_end_time ? new Date(data.scheduled_end_time) : null;
		if (data.scheduled_start_time !== undefined) this.scheduledStartTime = new Date(data.scheduled_start_time);
		if (data.status !== undefined) this.status = data.status;
		if (data.user_count !== undefined) this.userCount = data.user_count;
	}

	/**
	 * Delete this scheduled event.
	 *
	 * @param {String} reason - The reason for deleting the scheduled event. Discord's docs do not explicitly state a reason can be provided, so it may not be used.
	 * @returns {Promise<void>}
	 */
	async deleteScheduledEvent(reason?: string) {
		return this._client.rest.guilds.deleteScheduledEvent(this.guild.id, this.id, reason);
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

	override toJSON(): JSONScheduledEvent {
		return {
			...super.toJSON(),
			channel:            this.channel?.id || null,
			creator:            this.creator?.toJSON(),
			description:        this.description,
			entityID:           this.entityID,
			entityMetadata:     this.entityMetadata,
			entityType:         this.entityType,
			guild:              this.guild.id,
			image:              this.image,
			name:               this.name,
			privacyLevel:       this.privacyLevel,
			scheduledEndTime:   this.scheduledEndTime?.getTime() || null,
			scheduledStartTime: this.scheduledStartTime.getTime(),
			status:             this.status,
			userCount:          this.userCount
		};
	}
}
