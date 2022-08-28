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
class ScheduledEvent extends Base_1.default {
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
    /** The cover */
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
        if (data.creator)
            this.creator = this._client.users.update(data.creator);
        this.guild = this._client.guilds.get(data.guild_id);
        this.guildID = data.guild_id;
        this.userCount = 0;
        this.update(data);
    }
    update(data) {
        if (data.channel_id !== undefined)
            this.channel = data.channel_id === null ? null : this._client.getChannel(data.channel_id);
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
     *
     * @param {String} reason - The reason for deleting the scheduled event. Discord's docs do not explicitly state a reason can be provided, so it may not be used.
     * @returns {Promise<void>}
     */
    async deleteScheduledEvent(reason) {
        return this._client.rest.guilds.deleteScheduledEvent(this.guildID, this.id, reason);
    }
    /**
     * The url of this event's cover image.
     *
     * @param {ImageFormat} format The format of the image.
     * @param {number} size The size of the image.
     * @returns {string}
     */
    imageURL(format, size) {
        return !this.image ? null : this._client.util.formatImage(Routes.GUILD_SCHEDULED_EVENT_COVER(this.id, this.image), format, size);
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
exports.default = ScheduledEvent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2NoZWR1bGVkRXZlbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvc3RydWN0dXJlcy9TY2hlZHVsZWRFdmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsa0RBQTBCO0FBTTFCLHVEQUF5QztBQUl6QyxNQUFxQixjQUFlLFNBQVEsY0FBSTtJQUM1QyxrR0FBa0c7SUFDbEcsT0FBTyxDQUFzQjtJQUM3Qix5RkFBeUY7SUFDekYsT0FBTyxDQUFRO0lBQ2Ysb0NBQW9DO0lBQ3BDLFdBQVcsQ0FBaUI7SUFDNUIsc0RBQXNEO0lBQ3RELFFBQVEsQ0FBZ0I7SUFDeEIsb0xBQW9MO0lBQ3BMLGNBQWMsQ0FBc0M7SUFDcEQsMEtBQTBLO0lBQzFLLFVBQVUsQ0FBNEI7SUFDdEMsaURBQWlEO0lBQ2pELEtBQUssQ0FBUTtJQUNiLDJEQUEyRDtJQUMzRCxPQUFPLENBQVM7SUFDaEIsZ0JBQWdCO0lBQ2hCLEtBQUssQ0FBaUI7SUFDdEIsNkJBQTZCO0lBQzdCLElBQUksQ0FBUztJQUNiLDhLQUE4SztJQUM5SyxZQUFZLENBQThCO0lBQzFDLGtGQUFrRjtJQUNsRixnQkFBZ0IsQ0FBYztJQUM5Qiw4Q0FBOEM7SUFDOUMsa0JBQWtCLENBQU87SUFDekIsZ0tBQWdLO0lBQ2hLLE1BQU0sQ0FBeUI7SUFDL0IsbURBQW1EO0lBQ25ELFNBQVMsQ0FBUztJQUNsQixZQUFZLElBQXVCLEVBQUUsTUFBYztRQUMvQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN2QixJQUFJLElBQUksQ0FBQyxPQUFPO1lBQUUsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3pFLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUUsQ0FBQztRQUNyRCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDN0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7UUFDbkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN0QixDQUFDO0lBRVMsTUFBTSxDQUFDLElBQWdDO1FBQzdDLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxTQUFTO1lBQUUsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBZSxJQUFJLENBQUMsVUFBVSxDQUFFLENBQUM7UUFDNUksSUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLFNBQVM7WUFBRSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDeEUsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLFNBQVM7WUFBRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDakUsSUFBSSxJQUFJLENBQUMsZUFBZSxLQUFLLFNBQVM7WUFBRSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7UUFDbkYsSUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLFNBQVM7WUFBRSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDdkUsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVM7WUFBRSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDdEQsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLFNBQVM7WUFBRSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDbkQsSUFBSSxJQUFJLENBQUMsYUFBYSxLQUFLLFNBQVM7WUFB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