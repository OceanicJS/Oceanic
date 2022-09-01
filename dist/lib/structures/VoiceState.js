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
        this.user = this._client.users.get(this.id);
        this.update(data);
    }
    update(data) {
        if (data.channel_id !== undefined) {
            if (data.channel_id === null)
                this.channel = null;
            else {
                const ch = this._client.getChannel(data.channel_id);
                if (!ch)
                    this._client.emit("warn", `Missing channel for VoiceState ${this.id}`);
                else
                    this.channel = ch;
            }
        }
        if (data.deaf !== undefined)
            this.deaf = data.deaf;
        if (data.guild_id !== undefined) {
            const guild = this._client.guilds.get(data.guild_id);
            if (!guild)
                this._client.emit("warn", `Missing guild for VoiceState ${this.id}`);
            else
                this.guild = guild;
        }
        if (data.member !== undefined)
            this.member = this.guild ? this.guild.members.update({ ...data.member, id: this.id }, this.guildID) : new Member_1.default(data.member, this._client, this.guildID);
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
            this.user = this._client.users.get(data.user_id);
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