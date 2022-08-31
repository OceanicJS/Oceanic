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
            case Constants_1.ChannelTypes.GUILD_FORUM: return new ForumChannel(data, client);
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
const ForumChannel = require("./ForumChannel").default;
/* eslint-enable */
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hhbm5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9zdHJ1Y3R1cmVzL0NoYW5uZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxpQ0FBaUM7QUFDakMsa0RBQTBCO0FBQzFCLDRDQUE0QztBQW1CNUMsNEJBQTRCO0FBQzVCLE1BQXFCLE9BQVEsU0FBUSxjQUFJO0lBQ3JDLHNIQUFzSDtJQUN0SCxJQUFJLENBQWU7SUFDbkIsWUFBWSxJQUFnQixFQUFFLE1BQWM7UUFDeEMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDdkIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQzFCLENBQUM7SUFFRCxNQUFNLENBQUMsSUFBSSxDQUFvQyxJQUFnQixFQUFFLE1BQWM7UUFDM0UsUUFBUSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2YsS0FBSyx3QkFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxXQUFXLENBQUMsSUFBc0IsRUFBRSxNQUFNLENBQU0sQ0FBQztZQUMxRixLQUFLLHdCQUFZLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLGNBQWMsQ0FBQyxJQUF5QixFQUFFLE1BQU0sQ0FBTSxDQUFDO1lBQ3hGLEtBQUssd0JBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLElBQUksWUFBWSxDQUFDLElBQXVCLEVBQUUsTUFBTSxDQUFNLENBQUM7WUFDN0YsS0FBSyx3QkFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sSUFBSSxZQUFZLENBQUMsSUFBdUIsRUFBRSxNQUFNLENBQU0sQ0FBQztZQUMxRixLQUFLLHdCQUFZLENBQUMsY0FBYyxDQUFDLENBQUMsT0FBTyxJQUFJLGVBQWUsQ0FBQyxJQUEwQixFQUFFLE1BQU0sQ0FBTSxDQUFDO1lBQ3RHLEtBQUssd0JBQVksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLE9BQU8s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