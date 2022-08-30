"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/order */
const Base_1 = __importDefault(require("./Base"));
const Constants_1 = require("../Constants");
/** Represents a channel. */
class Channel extends Base_1.default {
    /** The [type](https://discord.com/developers/docs/resources/channel#channel-object-channel-types) of this channel. */
    type;
    constructor(data, client) {
        super(data.id, client);
        this.type = data.type;
    }
    static from(data, client) {
        switch (data.type) {
            case Constants_1.ChannelTypes.GUILD_TEXT: return new TextChannel(data, client);
            case Constants_1.ChannelTypes.DM: return new PrivateChannel(data, client);
            case Constants_1.ChannelTypes.GUILD_VOICE: return new VoiceChannel(data, client);
            case Constants_1.ChannelTypes.GROUP_DM: return new GroupChannel(data, client);
            case Constants_1.ChannelTypes.GUILD_CATEGORY: return new CategoryChannel(data, client);
            case Constants_1.ChannelTypes.GUILD_ANNOUNCEMENT: return new AnnouncementChannel(data, client);
            case Constants_1.ChannelTypes.ANNOUNCEMENT_THREAD: return new AnnouncementThreadChannel(data, client);
            case Constants_1.ChannelTypes.PUBLIC_THREAD: return new PublicThreadChannel(data, client);
            case Constants_1.ChannelTypes.PRIVATE_THREAD: return new PrivateThreadChannel(data, client);
            case Constants_1.ChannelTypes.GUILD_STAGE_VOICE: return new StageChannel(data, client);
            default: return new Channel(data, client);
        }
    }
    /** A string that will mention this channel. */
    get mention() {
        return `<#${this.id}>`;
    }
    /**
     * Close a direct message, leave a group channel, or delete a guild channel.
     */
    async delete() {
        await this._client.rest.channels.delete(this.id);
    }
    toJSON() {
        return {
            ...super.toJSON(),
            type: this.type
        };
    }
}
exports.default = Channel;
// Yes this sucks, but it works. That's the important part. Circular imports are hell.
/* eslint-disable */
const TextChannel = require("./TextChannel").default;
const PrivateChannel = require("./PrivateChannel").default;
const VoiceChannel = require("./VoiceChannel").default;
const CategoryChannel = require("./CategoryChannel").default;
const GroupChannel = require("./GroupChannel").default;
const AnnouncementChannel = require("./AnnouncementChannel").default;
const PublicThreadChannel = require("./PublicThreadChannel").default;
const PrivateThreadChannel = require("./PrivateThreadChannel").default;
const AnnouncementThreadChannel = require("./AnnouncementThreadChannel").default;
const StageChannel = require("./StageChannel").default;
/* eslint-enable */
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hhbm5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9zdHJ1Y3R1cmVzL0NoYW5uZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxpQ0FBaUM7QUFDakMsa0RBQTBCO0FBQzFCLDRDQUE0QztBQWtCNUMsNEJBQTRCO0FBQzVCLE1BQXFCLE9BQVEsU0FBUSxjQUFJO0lBQ3JDLHNIQUFzSDtJQUN0SCxJQUFJLENBQWU7SUFDbkIsWUFBWSxJQUFnQixFQUFFLE1BQWM7UUFDeEMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDdkIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQzFCLENBQUM7SUFFRCxNQUFNLENBQUMsSUFBSSxDQUFvQyxJQUFnQixFQUFFLE1BQWM7UUFDM0UsUUFBUSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2YsS0FBSyx3QkFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxXQUFXLENBQUMsSUFBc0IsRUFBRSxNQUFNLENBQU0sQ0FBQztZQUMxRixLQUFLLHdCQUFZLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLGNBQWMsQ0FBQyxJQUF5QixFQUFFLE1BQU0sQ0FBTSxDQUFDO1lBQ3hGLEtBQUssd0JBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLElBQUksWUFBWSxDQUFDLElBQXVCLEVBQUUsTUFBTSxDQUFNLENBQUM7WUFDN0YsS0FBSyx3QkFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sSUFBSSxZQUFZLENBQUMsSUFBdUIsRUFBRSxNQUFNLENBQU0sQ0FBQztZQUMxRixLQUFLLHdCQUFZLENBQUMsY0FBYyxDQUFDLENBQUMsT0FBTyxJQUFJLGVBQWUsQ0FBQyxJQUEwQixFQUFFLE1BQU0sQ0FBTSxDQUFDO1lBQ3RHLEtBQUssd0JBQVksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLE9BQU8sSUFBSSxtQkFBbUIsQ0FBQyxJQUE4QixFQUFFLE1BQU0sQ0FBTSxDQUFDO1lBQ2xILEtBQUssd0JBQVksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE9BQU8sSUFBSSx5QkFBeUIsQ0FBQyxJQUFvQyxFQUFFLE1BQU0sQ0FBTSxDQUFDO1lBQy9ILEtBQUssd0JBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQyxPQUFPLElBQUksbUJBQW1CLENBQUMsSUFBOEIsRUFBRSxNQUFNLENBQU0sQ0FBQztZQUM3RyxLQUFLLHdCQUFZLENBQUMsY0FBYyxDQUFDLENBQUMsT0FBTyxJQUFJLG9CQUFvQixDQUFDLElBQStCLEVBQUUsTUFBTSxDQUFNLENBQUM7WUFDaEgsS0FBSyx3QkFBWSxDQUFDLGlCQUFpQixDQUFDLENBQUMsT0FBTyxJQUFJLFlBQVksQ0FBQyxJQUF1QixFQUFFLE1BQU0sQ0FBTSxDQUFDO1lBQ25HLE9BQU8sQ0FBQyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBTSxDQUFDO1NBQ2xEO0lBQ0wsQ0FBQztJQUVELCtDQUErQztJQUMvQyxJQUFJLE9BQU87UUFDUCxPQUFPLEtBQUssSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDO0lBQzNCLENBQUM7SUFFRDs7T0FFRztJQUNILEtBQUssQ0FBQyxNQUFNO1FBQ1IsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRVEsTUFBTTtRQUNYLE9BQU87WUFDSCxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDakIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1NBQ2xCLENBQUM7SUFDTixDQUFDO0NBQ0o7QUExQ0QsMEJBMENDO0FBRUQsc0ZBQXNGO0FBQ3RGLG9CQUFvQjtBQUNwQixNQUFNLFdBQVcsR0FBSSxPQUFPLENBQUMsZUFBZSxDQUFvQyxDQUFDLE9BQU8sQ0FBQztBQUN6RixNQUFNLGNBQWMsR0FBSSxPQUFPLENBQUMsa0JBQWtCLENBQXVDLENBQUMsT0FBTyxDQUFDO0FBQ2xHLE1BQU0sWUFBWSxHQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBcUMsQ0FBQyxPQUFPLENBQUM7QUFDNUYsTUFBTSxlQUFlLEdBQUksT0FBTyxDQUFDLG1CQUFtQixDQUF3QyxDQUFDLE9BQU8sQ0FBQztBQUNyRyxNQUFNLFlBQVksR0FBSSxPQUFPLENBQUMsZ0JBQWdCLENBQXFDLENBQUMsT0FBTyxDQUFDO0FBQzVGLE1BQU0sbUJBQW1CLEdBQUksT0FBTyxDQUFDLHVCQUF1QixDQUE0QyxDQUFDLE9BQU8sQ0FBQztBQUNqSCxNQUFNLG1CQUFtQixHQUFJLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBNEMsQ0FBQyxPQUFPLENBQUM7QUFDakgsTUFBTSxvQkFBb0IsR0FBSSxPQUFPLENBQUMsd0JBQXdCLENBQTZDLENBQUMsT0FBTyxDQUFDO0FBQ3BILE1BQU0seUJBQXlCLEdBQUksT0FBTyxDQUFDLDZCQUE2QixDQUFrRCxDQUFDLE9BQU8sQ0FBQztBQUNuSSxNQUFNLFlBQVksR0FBSSxPQUFPLENBQUMsZ0JBQWdCLENBQXFDLENBQUMsT0FBTyxDQUFDO0FBQzVGLG1CQUFtQiJ9