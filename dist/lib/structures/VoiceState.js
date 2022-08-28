"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = __importDefault(require("./Base"));
/** Represents a guild member's voice state. */
class VoiceState extends Base_1.default {
    /** The channel the user is connected to. */
    channel;
    /** If the associated member is deafened. */
    deaf;
    /** The guild this voice state is a part of. */
    guild;
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
        this.selfDeaf = false;
        this.selfMute = false;
        this.selfStream = false;
        this.selfVideo = false;
        this.suppress = false;
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
            this.member = this.guild.members.update({ ...data.member, id: this.id }, this.guild.id);
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
            guild: this.guild.id,
            member: this.member.toJSON(),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVm9pY2VTdGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9zdHJ1Y3R1cmVzL1ZvaWNlU3RhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBMEI7QUFVMUIsK0NBQStDO0FBQy9DLE1BQXFCLFVBQVcsU0FBUSxjQUFJO0lBQ3hDLDRDQUE0QztJQUM1QyxPQUFPLENBQXFDO0lBQzVDLDRDQUE0QztJQUM1QyxJQUFJLENBQVU7SUFDZCwrQ0FBK0M7SUFDL0MsS0FBSyxDQUFRO0lBQ2IsbURBQW1EO0lBQ25ELE1BQU0sQ0FBUztJQUNmLHlDQUF5QztJQUN6QyxJQUFJLENBQVU7SUFDZCxrRUFBa0U7SUFDbEUsdUJBQXVCLENBQWM7SUFDckMsaURBQWlEO0lBQ2pELFFBQVEsQ0FBVTtJQUNsQiw4Q0FBOEM7SUFDOUMsUUFBUSxDQUFVO0lBQ2xCLDZDQUE2QztJQUM3QyxVQUFVLENBQVU7SUFDcEIsdURBQXVEO0lBQ3ZELFNBQVMsQ0FBVTtJQUNuQix1REFBdUQ7SUFDdkQsU0FBUyxDQUFTO0lBQ2xCLDhDQUE4QztJQUM5QyxRQUFRLENBQVU7SUFDbEIsaURBQWlEO0lBQ2pELElBQUksQ0FBTztJQUNYLFlBQVksSUFBbUIsRUFBRSxNQUFjO1FBQzNDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzVCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ2xCLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLElBQUks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