import Base from "./Base";
import type User from "./User";
import type Guild from "./Guild";
import type StageChannel from "./StageChannel";
import type Client from "../Client";
import type { ImageFormat, GuildScheduledEventEntityTypes, GuildScheduledEventPrivacyLevels, GuildScheduledEventStatuses } from "../Constants";
import type { RawScheduledEvent, ScheduledEventEntityMetadata } from "../types/scheduled-events";
import type { JSONScheduledEvent } from "../types/json";
export default class GuildScheduledEvent extends Base {
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
    entityType: GuildScheduledEventEntityTypes;
    /** The guild this scheduled event belongs to. */
    guild: Guild;
    /** The id of the guild this scheduled event belongs to. */
    guildID: string;
    /** The cover */
    image?: string | null;
    /** The name of the event. */
    name: string;
    /** The [privacy level](https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object-guild-scheduled-event-privacy-level) of the event. */
    privacyLevel: GuildScheduledEventPrivacyLevels;
    /** The time at which the event will end. Required if entityType is `EXTERNAL`. */
    scheduledEndTime: Date | null;
    /** The time at which the event will start. */
    scheduledStartTime: Date;
    /** The [status](https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object-guild-scheduled-event-status) of the event. */
    status: GuildScheduledEventStatuses;
    /** The number of users subscribed to the event. */
    userCount: number;
    constructor(data: RawScheduledEvent, client: Client);
    protected update(data: Partial<RawScheduledEvent>): void;
    /**
     * Delete this scheduled event.
     * @param reason - The reason for deleting the scheduled event. Discord's docs do not explicitly state a reason can be provided, so it may not be used.
     */
    deleteScheduledEvent(reason?: string): Promise<void>;
    /**
     * The url of this event's cover image.
     * @param format The format of the image.
     * @param size The size of the image.
     */
    imageURL(format?: ImageFormat, size?: number): string | null;
    toJSON(): JSONScheduledEvent;
}
