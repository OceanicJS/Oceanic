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
     *
     * @returns {Promise<void>}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hhbm5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9zdHJ1Y3R1cmVzL0NoYW5uZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxpQ0FBaUM7QUFDakMsa0RBQTBCO0FBQzFCLDRDQUE0QztBQWtCNUMsNEJBQTRCO0FBQzVCLE1BQXFCLE9BQVEsU0FBUSxjQUFJO0lBQ3hDLHNIQUFzSDtJQUN0SCxJQUFJLENBQWU7SUFDbkIsWUFBWSxJQUFnQixFQUFFLE1BQWM7UUFDM0MsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDdkIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxNQUFNLENBQUMsSUFBSSxDQUFvQyxJQUFnQixFQUFFLE1BQWM7UUFDOUUsUUFBUSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2xCLEtBQUssd0JBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLElBQUksV0FBVyxDQUFDLElBQXNCLEVBQUUsTUFBTSxDQUFNLENBQUM7WUFDMUYsS0FBSyx3QkFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxjQUFjLENBQUMsSUFBeUIsRUFBRSxNQUFNLENBQU0sQ0FBQztZQUN4RixLQUFLLHdCQUFZLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxJQUFJLFlBQVksQ0FBQyxJQUF1QixFQUFFLE1BQU0sQ0FBTSxDQUFDO1lBQzdGLEtBQUssd0JBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLElBQUksWUFBWSxDQUFDLElBQXVCLEVBQUUsTUFBTSxDQUFNLENBQUM7WUFDMUYsS0FBSyx3QkFBWSxDQUFDLGNBQWMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxlQUFlLENBQUMsSUFBMEIsRUFBRSxNQUFNLENBQU0sQ0FBQztZQUN0RyxLQUFLLHdCQUFZLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxPQUFPLElBQUksbUJBQW1CLENBQUMsSUFBOEIsRUFBRSxNQUFNLENBQU0sQ0FBQztZQUNsSCxLQUFLLHdCQUFZLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPLElBQUkseUJBQXlCLENBQUMsSUFBb0MsRUFBRSxNQUFNLENBQU0sQ0FBQztZQUMvSCxLQUFLLHdCQUFZLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxJQUFJLG1CQUFtQixDQUFDLElBQThCLEVBQUUsTUFBTSxDQUFNLENBQUM7WUFDN0csS0FBSyx3QkFBWSxDQUFDLGNBQWMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxvQkFBb0IsQ0FBQyxJQUErQixFQUFFLE1BQU0sQ0FBTSxDQUFDO1lBQ2hILEtBQUssd0JBQVksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLE9BQU8sSUFBSSxZQUFZLENBQUMsSUFBdUIsRUFBRSxNQUFNLENBQU0sQ0FBQztZQUNuRyxPQUFPLENBQUMsQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLElBQUksRUFBRSxNQUFNLENBQU0sQ0FBQztTQUMvQztJQUNGLENBQUM7SUFFRCwrQ0FBK0M7SUFDL0MsSUFBSSxPQUFPO1FBQ1YsT0FBTyxLQUFLLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQztJQUN4QixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILEtBQUssQ0FBQyxNQUFNO1FBQ1gsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRVEsTUFBTTtRQUNkLE9BQU87WUFDTixHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDakIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1NBQ2YsQ0FBQztJQUNILENBQUM7Q0FDRDtBQTVDRCwwQkE0Q0M7QUFFRCxzRkFBc0Y7QUFDdEYsb0JBQW9CO0FBQ3BCLE1BQU0sV0FBVyxHQUFJLE9BQU8sQ0FBQyxlQUFlLENBQW9DLENBQUMsT0FBTyxDQUFDO0FBQ3pGLE1BQU0sY0FBYyxHQUFJLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBdUMsQ0FBQyxPQUFPLENBQUM7QUFDbEcsTUFBTSxZQUFZLEdBQUksT0FBTyxDQUFDLGdCQUFnQixDQUFxQyxDQUFDLE9BQU8sQ0FBQztBQUM1RixNQUFNLGVBQWUsR0FBSSxPQUFPLENBQUMsbUJBQW1CLENBQXdDLENBQUMsT0FBTyxDQUFDO0FBQ3JHLE1BQU0sWUFBWSxHQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBcUMsQ0FBQyxPQUFPLENBQUM7QUFDNUYsTUFBTSxtQkFBbUIsR0FBSSxPQUFPLENBQUMsdUJBQXVCLENBQTRDLENBQUMsT0FBTyxDQUFDO0FBQ2pILE1BQU0sbUJBQW1CLEdBQUksT0FBTyxDQUFDLHVCQUF1QixDQUE0QyxDQUFDLE9BQU8sQ0FBQztBQUNqSCxNQUFNLG9CQUFvQixHQUFJLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBNkMsQ0FBQyxPQUFPLENBQUM7QUFDcEgsTUFBTSx5QkFBeUIsR0FBSSxPQUFPLENBQUMsNkJBQTZCLENBQWtELENBQUMsT0FBTyxDQUFDO0FBQ25JLE1BQU0sWUFBWSxHQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBcUMsQ0FBQyxPQUFPLENBQUM7QUFDNUYsbUJBQW1CIn0=