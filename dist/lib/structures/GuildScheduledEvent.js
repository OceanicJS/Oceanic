"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = __importDefault(require("./Base"));
const Routes = __importStar(require("../util/Routes"));
class GuildScheduledEvent extends Base_1.default {
    /** The id of the channel in which the event will be hosted. `null` if entityType is `EXTERNAL` */
    channel;
    /** The creator of the event. Not present on events created before October 25th, 2021. */
    creator;
    /** The description of the event. */
    description;
    /** The id of the entity associated with the event. */
    entityID;
    /** The [metadata](https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object-field-requirements-by-entity-type) associated with the event. */
    entityMetadata;
    /** The [entity type](https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object-guild-scheduled-event-entity-types) of the event */
    entityType;
    /** The guild this scheduled event belongs to. */
    guild;
    /** The id of the guild this scheduled event belongs to. */
    guildID;
    /** The cover image of this event. */
    image;
    /** The name of the event. */
    name;
    /** The [privacy level](https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object-guild-scheduled-event-privacy-level) of the event. */
    privacyLevel;
    /** The time at which the event will end. Required if entityType is `EXTERNAL`. */
    scheduledEndTime;
    /** The time at which the event will start. */
    scheduledStartTime;
    /** The [status](https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object-guild-scheduled-event-status) of the event. */
    status;
    /** The number of users subscribed to the event. */
    userCount;
    constructor(data, client) {
        super(data.id, client);
        this.channel = null;
        this.entityID = null;
        this.entityMetadata = null;
        this.entityType = data.entity_type;
        this.guild = client.guilds.get(data.guild_id);
        this.guildID = data.guild_id;
        this.image = null;
        this.name = data.name;
        this.privacyLevel = data.privacy_level;
        this.scheduledEndTime = data.scheduled_end_time ? new Date(data.scheduled_end_time) : null;
        this.scheduledStartTime = new Date(data.scheduled_start_time);
        this.status = data.status;
        this.userCount = 0;
        if (data.creator)
            this.creator = client.users.update(data.creator);
        this.update(data);
    }
    update(data) {
        if (data.channel_id !== undefined)
            this.channel = data.channel_id === null ? null : this.client.getChannel(data.channel_id);
        if (data.description !== undefined)
            this.description = data.description;
        if (data.entity_id !== undefined)
            this.entityID = data.entity_id;
        if (data.entity_metadata !== undefined)
            this.entityMetadata = data.entity_metadata;
        if (data.entity_type !== undefined)
            this.entityType = data.entity_type;
        if (data.image !== undefined)
            this.image = data.image;
        if (data.name !== undefined)
            this.name = data.name;
        if (data.privacy_level !== undefined)
            this.privacyLevel = data.privacy_level;
        if (data.scheduled_end_time !== undefined)
            this.scheduledEndTime = data.scheduled_end_time ? new Date(data.scheduled_end_time) : null;
        if (data.scheduled_start_time !== undefined)
            this.scheduledStartTime = new Date(data.scheduled_start_time);
        if (data.status !== undefined)
            this.status = data.status;
        if (data.user_count !== undefined)
            this.userCount = data.user_count;
    }
    /**
     * Delete this scheduled event.
     * @param reason The reason for deleting the scheduled event. Discord's docs do not explicitly state a reason can be provided, so it may not be used.
     */
    async deleteScheduledEvent(reason) {
        return this.client.rest.guilds.deleteScheduledEvent(this.guildID, this.id, reason);
    }
    /**
     * The url of this event's cover image.
     * @param format The format of the image.
     * @param size The size of the image.
     */
    imageURL(format, size) {
        return !this.image ? null : this.client.util.formatImage(Routes.GUILD_SCHEDULED_EVENT_COVER(this.id, this.image), format, size);
    }
    toJSON() {
        return {
            ...super.toJSON(),
            channel: this.channel?.id || null,
            creator: this.creator?.toJSON(),
            description: this.description,
            entityID: this.entityID,
            entityMetadata: this.entityMetadata,
            entityType: this.entityType,
            guild: this.guildID,
            image: this.image,
            name: this.name,
            privacyLevel: this.privacyLevel,
            scheduledEndTime: this.scheduledEndTime?.getTime() || null,
            scheduledStartTime: this.scheduledStartTime.getTime(),
            status: this.status,
            userCount: this.userCount
        };
    }
}
exports.default = GuildScheduledEvent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3VpbGRTY2hlZHVsZWRFdmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9zdHJ1Y3R1cmVzL0d1aWxkU2NoZWR1bGVkRXZlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGtEQUEwQjtBQU0xQix1REFBeUM7QUFJekMsTUFBcUIsbUJBQW9CLFNBQVEsY0FBSTtJQUNqRCxrR0FBa0c7SUFDbEcsT0FBTyxDQUFzQjtJQUM3Qix5RkFBeUY7SUFDekYsT0FBTyxDQUFRO0lBQ2Ysb0NBQW9DO0lBQ3BDLFdBQVcsQ0FBaUI7SUFDNUIsc0RBQXNEO0lBQ3RELFFBQVEsQ0FBZ0I7SUFDeEIsb0xBQW9MO0lBQ3BMLGNBQWMsQ0FBc0M7SUFDcEQsMEtBQTBLO0lBQzFLLFVBQVUsQ0FBaUM7SUFDM0MsaURBQWlEO0lBQ2pELEtBQUssQ0FBUTtJQUNiLDJEQUEyRDtJQUMzRCxPQUFPLENBQVM7SUFDaEIscUNBQXFDO0lBQ3JDLEtBQUssQ0FBZ0I7SUFDckIsNkJBQTZCO0lBQzdCLElBQUksQ0FBUztJQUNiLDhLQUE4SztJQUM5SyxZQUFZLENBQW1DO0lBQy9DLGtGQUFrRjtJQUNsRixnQkFBZ0IsQ0FBYztJQUM5Qiw4Q0FBOEM7SUFDOUMsa0JBQWtCLENBQU87SUFDekIsZ0tBQWdLO0lBQ2hLLE1BQU0sQ0FBOEI7SUFDcEMsbURBQW1EO0lBQ25ELFNBQVMsQ0FBUztJQUNsQixZQUFZLElBQXVCLEVBQUUsTUFBYztRQUMvQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztRQUNwQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUNyQixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztRQUMzQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENB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