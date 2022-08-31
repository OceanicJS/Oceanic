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