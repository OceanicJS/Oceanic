"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = __importDefault(require("./Base"));
const Guild_1 = __importDefault(require("./Guild"));
const tsafe_1 = require("tsafe");
/** Represents a member of a guild. */
class Member extends Base_1.default {
    /** The member's avatar hash, if they have set a guild avatar. */
    avatar;
    /** When the member's [timeout](https://support.discord.com/hc/en-us/articles/4413305239191-Time-Out-FAQ) will expire, if active. */
    communicationDisabledUntil;
    /** If this member is server deafened. */
    deaf;
    /** Undocumented. */
    flags;
    /** The guild this member is for. */
    guild;
    /** The id of the guild this member is for. */
    guildID;
    /** Undocumented. */
    isPending;
    /** The date at which this member joined the guild. */
    joinedAt;
    /** If this member is server muted. */
    mute;
    /** This member's nickname, if any. */
    nick;
    /** If this member has not passed the guild's [membership screening](https://discord.com/developers/docs/resources/guild#membership-screening-object) requirements. */
    pending;
    /** The date at which this member started boosting the guild, if applicable. */
    premiumSince;
    /** The presence of this member. */
    presence;
    /** The roles this member has. */
    roles;
    /** The user associated with this member. */
    user;
    constructor(data, client, guildID) {
        (0, tsafe_1.assert)(data.user, "Member recieved without accompanying user.");
        super(data.user.id, client);
        this.avatar = null;
        this.communicationDisabledUntil = null;
        this.nick = null;
        this.pending = false;
        this.premiumSince = null;
        this.guild = this._client.guilds.get(guildID);
        this.guildID = guildID;
        this.update(data);
    }
    update(data) {
        if (data.avatar !== undefined)
            this.avatar = data.avatar;
        if (data.communication_disabled_until !== undefined)
            this.communicationDisabledUntil = data.communication_disabled_until === null ? null : new Date(data.communication_disabled_until);
        if (data.deaf !== undefined)
            this.deaf = data.deaf;
        if (data.flags !== undefined)
            this.flags = data.flags;
        if (data.is_pending !== undefined)
            this.isPending = data.is_pending;
        if (data.joined_at !== undefined)
            this.joinedAt = data.joined_at === null ? null : new Date(data.joined_at);
        if (data.mute !== undefined)
            this.mute = data.mute;
        if (data.nick !== undefined)
            this.nick = data.nick;
        if (data.pending !== undefined)
            this.pending = data.pending;
        if (data.premium_since !== undefined)
            this.premiumSince = data.premium_since === null ? null : new Date(data.premium_since);
        if (data.roles !== undefined)
            this.roles = data.roles;
        if (data.user !== undefined)
            this.user = this._client.users.update(data.user);
    }
    /** If the member associated with the user is a bot. */
    get bot() { return this.user.bot; }
    /** The 4 digits after the username of the user associated with this member. */
    get discriminator() { return this.user.discriminator; }
    /** A string that will mention this member. */
    get mention() { return this.user.mention; }
    get permissions() { return this.guild.permissionsOf(this); }
    /** The user associated with this member's public [flags](https://discord.com/developers/docs/resources/user#user-object-user-flags). */
    get publicUsers() { return this.user.publicFlags; }
    /** If this user associated with this member is an official discord system user. */
    get system() { return this.user.system; }
    /** a combination of the user associated with this member's username and discriminator. */
    get tag() { return this.user.tag; }
    /** The user associated ith this member's username. */
    get username() { return this.user.username; }
    /** The voice state of this member. */
    get voiceState() { return this.guild instanceof Guild_1.default ? this.guild.voiceStates.get(this.id) || null : null; }
    /**
     * Add a role to this member.
     * @param roleID - The ID of the role to add.
     */
    async addRole(roleID, reason) {
        await this._client.rest.guilds.addMemberRole(this.guildID, this.id, roleID, reason);
    }
    /**
     * The url of this user's guild avatar (or their user avatar if no guild avatar is set, or their default avatar if none apply).
     * @param format - The format the url should be.
     * @param size - The dimensions of the image.
     */
    avatarURL(format, size) {
        return this.avatar === null ? this.user.avatarURL(format, size) : this._client.util.formatImage(this.avatar, format, size);
    }
    /**
     * Create a bon for this member.
     * @param options - The options for the ban.
     */
    async ban(options) {
        await this._client.rest.guilds.createBan(this.guildID, this.id, options);
    }
    /**
     * Edit this member.
     * @param options - The options for editing the member.
     */
    async edit(options) {
        return this._client.rest.guilds.editMember(this.guildID, this.id, options);
    }
    /**
     * Edit this guild member's voice state. `channelID` is required, and the user must already be in that channel. See [Discord's docs](https://discord.com/developers/docs/resources/guild#modify-user-voice-state) for more information.
     * @param options - The options for editing the voice state.
     */
    async editVoiceState(options) {
        return this._client.rest.guilds.editUserVoiceState(this.guildID, this.id, options);
    }
    /**
     * Remove a member from the guild.
     * @param reason - The reason for the kick.
     */
    async kick(reason) {
        await this._client.rest.guilds.removeMember(this.guildID, this.id, reason);
    }
    /**
     * remove a role from this member.
     * @param roleID - The ID of the role to remove.
     * @param reason - The reason for removing the role.
     */
    async removeRole(roleID, reason) {
        await this._client.rest.guilds.removeMemberRole(this.guildID, this.id, roleID, reason);
    }
    toJSON() {
        return {
            ...super.toJSON(),
            avatar: this.avatar,
            communicationDisabledUntil: this.communicationDisabledUntil?.getTime() || null,
            deaf: this.deaf,
            flags: this.flags,
            guild: this.guildID,
            isPending: this.isPending,
            joinedAt: this.joinedAt?.getTime() || null,
            mute: this.mute,
            nick: this.nick,
            pending: this.pending,
            premiumSince: this.premiumSince?.getTime() || null,
            presence: this.presence,
            roles: this.roles,
            user: this.user.toJSON()
        };
    }
    /**
     * Remove a ban for this member.
     * @param reason - The reason for removing the ban.
     */
    async unban(reason) {
        await this._client.rest.guilds.removeBan(this.guildID, this.id, reason);
    }
}
exports.default = Member;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVtYmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3N0cnVjdHVyZXMvTWVtYmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0RBQTBCO0FBRTFCLG9EQUE0QjtBQU01QixpQ0FBK0I7QUFFL0Isc0NBQXNDO0FBQ3RDLE1BQXFCLE1BQU8sU0FBUSxjQUFJO0lBQ3BDLGlFQUFpRTtJQUNqRSxNQUFNLENBQWdCO0lBQ3RCLG9JQUFvSTtJQUNwSSwwQkFBMEIsQ0FBYztJQUN4Qyx5Q0FBeUM7SUFDekMsSUFBSSxDQUFVO0lBQ2Qsb0JBQW9CO0lBQ3BCLEtBQUssQ0FBVTtJQUNmLG9DQUFvQztJQUNwQyxLQUFLLENBQVE7SUFDYiw4Q0FBOEM7SUFDOUMsT0FBTyxDQUFTO0lBQ2hCLG9CQUFvQjtJQUNwQixTQUFTLENBQVc7SUFDcEIsc0RBQXNEO0lBQ3RELFFBQVEsQ0FBYztJQUN0QixzQ0FBc0M7SUFDdEMsSUFBSSxDQUFVO0lBQ2Qsc0NBQXNDO0lBQ3RDLElBQUksQ0FBZ0I7SUFDcEIsc0tBQXNLO0lBQ3RLLE9BQU8sQ0FBVTtJQUNqQiwrRUFBK0U7SUFDL0UsWUFBWSxDQUFjO0lBQzFCLG1DQUFtQztJQUNuQyxRQUFRLENBQVk7SUFDcEIsaUNBQWlDO0lBQ2pDLEtBQUssQ0FBZ0I7SUFDckIsNENBQTRDO0lBQzVDLElBQUksQ0FBTztJQUNYLFlBQVksSUFBZSxFQUFFLE1BQWMsRUFBRSxPQUFlO1FBQ3hELElBQUEsY0FBTSxFQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsNENBQTRDLENBQUMsQ0FBQztRQUNoRSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDNUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDbkIsSUFBSSxDQUFDLDBCQUEwQixHQUFHLElBQUksQ0FBQztRQUN2QyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FB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