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
        this.guild = this._client.guilds.get(data.guild_id);
        this.guildID = data.guild_id;
        this.update(data);
    }
    update(data) {
        if (data.channel_id !== undefined)
            this.channel = this._client.getChannel(data.channel_id);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RhZ2VJbnN0YW5jZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9zdHJ1Y3R1cmVzL1N0YWdlSW5zdGFuY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBMEI7QUFFMUIsb0RBQTRCO0FBQzVCLGdGQUF3RDtBQU94RCxNQUFxQixhQUFjLFNBQVEsY0FBSTtJQUMzQyxvQ0FBb0M7SUFDcEMsT0FBTyxDQUFlO0lBQ3RCLHVEQUF1RDtJQUN2RCxvQkFBb0IsQ0FBVTtJQUM5QixpREFBaUQ7SUFDakQsS0FBSyxDQUFRO0lBQ2IsK0VBQStFO0lBQy9FLE9BQU8sQ0FBUztJQUNoQixvSkFBb0o7SUFDcEosWUFBWSxDQUE2QjtJQUN6QyxtREFBbUQ7SUFDbkQsY0FBYyxDQUFrQztJQUNoRCx3Q0FBd0M7SUFDeEMsS0FBSyxDQUFTO0lBQ2QsWUFBWSxJQUFzQixFQUFFLE1BQWM7UUFDOUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDdkIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBRSxDQUFDO1FBQ3JELElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUM3QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RCLENBQUM7SUFFUyxNQUFNLENBQUMsSUFBK0I7UUFDNUMsSUFBSSxJQUFJLENBQUMsVUFBVSxLQUFLLFNBQVM7WUFBRSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUUsQ0FBQztRQUM1RixJQUFJLElBQUksQ0FBQyxxQkFBcUIsS0FBSyxTQUFTO1lBQUUsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQztRQUNyRyxJQUFJLElBQUksQ0FBQyx3QkFBd0IsS0FBSyxTQUFTO1lBQUUsSUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLFlBQVksZUFBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO1FBQzFOLElBQUksSUFBSSxDQUFDLGFBQWEsS0FBSyxTQUFTO1lBQUUsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO1FBQzdFLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxTQUFTO1lBQUUsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQzFELENBQUM7SUFFUSxNQUFNO1FBQ1gsT0FBTztZQUNILEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUNqQixPQUFPLEVBQWUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ3JDLG9CQUFvQixFQUFFLElBQUksQ0FBQyxvQkFBb0I7WUFDL0MsS0FBSyxFQUFpQixJQUFJLENBQUMsT0FBTztZQUNsQyxjQUFjLEVBQVEsSUFBSSxDQUFDLGNBQWMsWUFBWSw2QkFBbUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxFQUFFO1lBQ2pJLEtBQUssRUFBaUIsSUFBSSxDQUFDLEtBQUs7U0FDbkMsQ0FBQztJQUNOLENBQUM7Q0FDSjtBQXhDRCxnQ0F3Q0MifQ==