"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = __importDefault(require("./Base"));
const Member_1 = __importDefault(require("./Member"));
/** Represents a guild member's voice state. */
class VoiceState extends Base_1.default {
    /** The channel the user is connected to. */
    channel;
    /** If the associated member is deafened. */
    deaf;
    /** The guild this voice state is a part of. */
    guild;
    /** The ID of the guild this voice state is a part of. */
    guildID;
    /** The member associated with this voice state. */
    member;
    /** If the associated member is muted. */
    mute;
    /** The time at which the associated member requested to speak. */
    requestToSpeakTimestamp;
    /** If the associated member is self deafened. */
    selfDeaf;
    /** If the associated member is self muted. */
    selfMute;
    /** If the associated member is streaming. */
    selfStream;
    /** If the associated member is has their camera on. */
    selfVideo;
    /** The id of the associated member's voice session. */
    sessionID;
    /** If the associated member is suppressed. */
    suppress;
    /** The user associated with this voice state. */
    user;
    constructor(data, client) {
        super(data.user_id, client);
        this.channel = null;
        this.deaf = false;
        this.mute = false;
        this.requestToSpeakTimestamp = null;
        this.selfDeaf = false;
        this.selfMute = false;
        this.selfStream = false;
        this.selfVideo = false;
        this.suppress = false;
        this.user = client.users.get(this.id);
        this.update(data);
    }
    update(data) {
        if (data.channel_id !== undefined) {
            if (data.channel_id === null)
                this.channel = null;
            else {
                const ch = this.client.getChannel(data.channel_id);
                if (!ch)
                    this.client.emit("warn", `Missing channel for VoiceState ${this.id}`);
                else
                    this.channel = ch;
            }
        }
        if (data.deaf !== undefined)
            this.deaf = data.deaf;
        if (data.guild_id !== undefined) {
            const guild = this.client.guilds.get(data.guild_id);
            if (!guild)
                this.client.emit("warn", `Missing guild for VoiceState ${this.id}`);
            else
                this.guild = guild;
        }
        if (data.member !== undefined)
            this.member = this.guild ? this.guild.members.update({ ...data.member, id: this.id }, this.guildID) : new Member_1.default(data.member, this.client, this.guildID);
        if (data.mute !== undefined)
            this.mute = data.mute;
        if (data.request_to_speak_timestamp !== undefined)
            this.requestToSpeakTimestamp = data.request_to_speak_timestamp === null ? null : new Date(data.request_to_speak_timestamp);
        if (data.self_deaf !== undefined)
            this.selfDeaf = data.self_deaf;
        if (data.self_mute !== undefined)
            this.selfMute = data.self_mute;
        if (data.self_stream !== undefined)
            this.selfStream = data.self_stream;
        if (data.self_video !== undefined)
            this.selfVideo = data.self_video;
        if (data.suppress !== undefined)
            this.suppress = data.suppress;
        if (data.user_id !== undefined)
            this.user = this.client.users.get(data.user_id);
    }
    toJSON() {
        return {
            ...super.toJSON(),
            channel: this.channel?.id || null,
            deaf: this.deaf,
            guild: this.guildID,
            member: this.member?.toJSON(),
            mute: this.mute,
            requestToSpeakTimestamp: this.requestToSpeakTimestamp ? this.requestToSpeakTimestamp.getTime() : null,
            selfDeaf: this.selfDeaf,
            selfMute: this.selfMute,
            selfStream: this.selfStream,
            selfVideo: this.selfVideo,
            sessionID: this.sessionID,
            suppress: this.suppress,
            user: this.user.toJSON()
        };
    }
}
exports.default = VoiceState;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVm9pY2VTdGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9zdHJ1Y3R1cmVzL1ZvaWNlU3RhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBMEI7QUFHMUIsc0RBQThCO0FBTzlCLCtDQUErQztBQUMvQyxNQUFxQixVQUFXLFNBQVEsY0FBSTtJQUN4Qyw0Q0FBNEM7SUFDNUMsT0FBTyxDQUFxQztJQUM1Qyw0Q0FBNEM7SUFDNUMsSUFBSSxDQUFVO0lBQ2QsK0NBQStDO0lBQy9DLEtBQUssQ0FBUztJQUNkLHlEQUF5RDtJQUN6RCxPQUFPLENBQVU7SUFDakIsbURBQW1EO0lBQ25ELE1BQU0sQ0FBVTtJQUNoQix5Q0FBeUM7SUFDekMsSUFBSSxDQUFVO0lBQ2Qsa0VBQWtFO0lBQ2xFLHVCQUF1QixDQUFjO0lBQ3JDLGlEQUFpRDtJQUNqRCxRQUFRLENBQVU7SUFDbEIsOENBQThDO0lBQzlDLFFBQVEsQ0FBVTtJQUNsQiw2Q0FBNkM7SUFDN0MsVUFBVSxDQUFVO0lBQ3BCLHVEQUF1RDtJQUN2RCxTQUFTLENBQVU7SUFDbkIsdURBQXVEO0lBQ3ZELFNBQVMsQ0FBVTtJQUNuQiw4Q0FBOEM7SUFDOUMsUUFBUSxDQUFVO0lBQ2xCLGlEQUFpRDtJQUNqRCxJQUFJLENBQU87SUFDWCxZQUFZLElBQW1CLEVBQUUsTUFBYztRQUMzQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM1QixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztRQUNwQixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztRQUNsQixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztRQUNsQixJQUFJLENBQUMsdUJBQXVCLEdBQUcsSUFBSSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1FB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