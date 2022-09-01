"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = __importDefault(require("./Base"));
const Guild_1 = __importDefault(require("./Guild"));
const GuildScheduledEvent_1 = __importDefault(require("./GuildScheduledEvent"));
class StageInstance extends Base_1.default {
    /** The associated stage channel. */
    channel;
    /** @deprecated If the stage channel is discoverable */
    discoverableDisabled;
    /** The guild of the associated stage channel. */
    guild;
    /** The id of the guild associated with this stage instance's stage channel. */
    guildID;
    /** The [privacy level](https://discord.com/developers/docs/resources/stage-instance#stage-instance-object-privacy-level) of this stage instance. */
    privacyLevel;
    /** The scheduled event for this stage instance. */
    scheduledEvent;
    /** The topic of this stage instance. */
    topic;
    constructor(data, client) {
        super(data.id, client);
        this.discoverableDisabled = !!data.discoverable_disabled;
        this.guild = client.guilds.get(data.guild_id);
        this.guildID = data.guild_id;
        this.privacyLevel = data.privacy_level;
        this.topic = data.topic;
        this.update(data);
    }
    update(data) {
        if (data.channel_id !== undefined)
            this.channel = this.client.getChannel(data.channel_id);
        if (data.discoverable_disabled !== undefined)
            this.discoverableDisabled = data.discoverable_disabled;
        if (data.guild_scheduled_event_id !== undefined)
            this.scheduledEvent = (this.guild instanceof Guild_1.default ? this.guild.scheduledEvents.get(data.guild_scheduled_event_id) : undefined) || { id: data.guild_scheduled_event_id };
        if (data.privacy_level !== undefined)
            this.privacyLevel = data.privacy_level;
        if (data.topic !== undefined)
            this.topic = data.topic;
    }
    toJSON() {
        return {
            ...super.toJSON(),
            channel: this.channel.id,
            discoverableDisabled: this.discoverableDisabled,
            guild: this.guildID,
            scheduledEvent: this.scheduledEvent instanceof GuildScheduledEvent_1.default ? this.scheduledEvent.toJSON() : this.scheduledEvent?.id,
            topic: this.topic
        };
    }
}
exports.default = StageInstance;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RhZ2VJbnN0YW5jZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9zdHJ1Y3R1cmVzL1N0YWdlSW5zdGFuY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBMEI7QUFFMUIsb0RBQTRCO0FBQzVCLGdGQUF3RDtBQU94RCxNQUFxQixhQUFjLFNBQVEsY0FBSTtJQUMzQyxvQ0FBb0M7SUFDcEMsT0FBTyxDQUFnQjtJQUN2Qix1REFBdUQ7SUFDdkQsb0JBQW9CLENBQVU7SUFDOUIsaURBQWlEO0lBQ2pELEtBQUssQ0FBUTtJQUNiLCtFQUErRTtJQUMvRSxPQUFPLENBQVM7SUFDaEIsb0pBQW9KO0lBQ3BKLFlBQVksQ0FBNkI7SUFDekMsbURBQW1EO0lBQ25ELGNBQWMsQ0FBa0M7SUFDaEQsd0NBQXdDO0lBQ3hDLEtBQUssQ0FBUztJQUNkLFlBQVksSUFBc0IsRUFBRSxNQUFjO1FBQzlDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDO1FBQ3pELElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBRSxDQUFDO1FBQy9DLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUM3QixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDdkMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEIsQ0FBQztJQUVTLE1BQU0sQ0FBQyxJQUErQjtRQUM1QyxJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssU0FBUztZQUFFLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBRSxDQUFDO1FBQzNGLElBQUksSUFBSSxDQUFDLHFCQUFxQixLQUFLLFNBQVM7WUFBRSxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDO1FBQ3JHLElBQUksSUFBSSxDQUFDLHdCQUF3QixLQUFLLFNBQVM7WUFBRSxJQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssWUFBWSxlQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLHdCQUF3QixFQUFFLENBQUM7UUFDMU4sSUFBSSxJQUFJLENBQUMsYUFBYSxLQUFLLFNBQVM7WUFBRSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDN0UsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVM7WUFBRSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDMUQsQ0FBQztJQUVRLE1BQU07UUFDWCxPQUFPO1lBQ0gsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFO1lBQ2pCLE9BQU8sRUFBZSxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDckMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLG9CQUFvQjtZQUMvQyxLQUFLLEVBQWlCLElBQUksQ0FBQyxPQUFPO1lBQ2xDLGNBQWMsRUFBUSxJQUFJLENBQUMsY0FBYyxZQUFZLDZCQUFtQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLEVBQUU7WUFDakksS0FBSyxFQUFpQixJQUFJLENBQUMsS0FBSztTQUNuQyxDQUFDO0lBQ04sQ0FBQztDQUNKO0FBM0NELGdDQTJDQyJ9