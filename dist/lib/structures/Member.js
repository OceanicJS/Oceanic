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
     *
     * @param {String} roleID - The ID of the role to add.
     * @param {String} [reason] - The reason for adding the role.
     * @returns {Promise<void>}
     */
    async addRole(roleID, reason) {
        await this._client.rest.guilds.addMemberRole(this.guild.id, this.id, roleID, reason);
    }
    /**
     * The url of this user's guild avatar (or their user avatar if no guild avatar is set, or their default avatar if none apply).
     *
     * @param {ImageFormat} format - The format the url should be.
     * @param {Number} size - The dimensions of the image.
     * @returns {String}
     */
    avatarURL(format, size) {
        return this.avatar === null ? this.user.avatarURL(format, size) : this._client._formatImage(this.avatar, format, size);
    }
    /**
     * Create a bon for this member.
     *
     * @param {Object} [options]
     * @param {Number} [options.deleteMessageDays] - The number of days to delete messages from. Technically DEPRECTED. This is internally converted in to `deleteMessageSeconds`.
     * @param {Number} [options.deleteMessageSeconds] - The number of seconds to delete messages from. Takes precedence over `deleteMessageDays`.
     * @param {String} [options.reason] - The reason for creating the bon.
     * @returns {Promise<void>}
     */
    async ban(options) {
        await this._client.rest.guilds.createBan(this.guild.id, this.id, options);
    }
    /**
     * Edit this member.
     *
     * @param {Object} options
     * @param {String?} [options.channelID] - The ID of the channel to move the member to. `null` to disconnect.
     * @param {String?} [options.communicationDisabledUntil] - An ISO8601 timestamp to disable communication until. `null` to reset.
     * @param {Boolean} [options.deaf] - If the member should be deafened.
     * @param {Boolean} [options.mute] - If the member should be muted.
     * @param {String} [options.nick] - The new nickname of the member. `null` to reset.
     * @param {String} [options.reason] - The reason for editing the member.
     * @param {String[]} [options.roles] - The new roles of the member.
     * @returns {Promise<Member>}
     */
    async edit(options) {
        return this._client.rest.guilds.editMember(this.guild.id, this.id, options);
    }
    /**
     * Edit this guild member's voice state. `channelID` is required, and the user must already be in that channel. See [Discord's docs](https://discord.com/developers/docs/resources/guild#modify-user-voice-state) for more information.
     *
     * @param {Object} options
     * @param {String} options.channelID - The ID of the stage channel the member is in.
     * @param {Boolean} [options.suppress] - If the user should be suppressed.
     * @returns {Promise<void>}
     */
    async editVoiceState(options) {
        return this._client.rest.guilds.editUserVoiceState(this.guild.id, this.id, options);
    }
    /**
     * Remove a member from the guild.
     *
     * @param {String} reason - The reason for the removal.
     * @returns {Promise<void>}
     */
    async kick(reason) {
        await this._client.rest.guilds.removeMember(this.guild.id, this.id, reason);
    }
    /**
     * remove a role from this member.
     *
     * @param {String} roleID - The ID of the role to remove.
     * @param {String} [reason] - The reason for removing the role.
     * @returns {Promise<void>}
     */
    async removeRole(roleID, reason) {
        await this._client.rest.guilds.removeMemberRole(this.guild.id, this.id, roleID, reason);
    }
    toJSON() {
        return {
            ...super.toJSON(),
            avatar: this.avatar,
            communicationDisabledUntil: this.communicationDisabledUntil?.getTime() || null,
            deaf: this.deaf,
            flags: this.flags,
            guild: this.guild.id,
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
     *
     * @param {String} [reason] - The reason for removing the ban.
     */
    async unban(reason) {
        await this._client.rest.guilds.removeBan(this.guild.id, this.id, reason);
    }
}
exports.default = Member;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVtYmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3N0cnVjdHVyZXMvTWVtYmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0RBQTBCO0FBRTFCLG9EQUE0QjtBQU01QixpQ0FBK0I7QUFFL0Isc0NBQXNDO0FBQ3RDLE1BQXFCLE1BQU8sU0FBUSxjQUFJO0lBQ3ZDLGlFQUFpRTtJQUNqRSxNQUFNLENBQWdCO0lBQ3RCLG9JQUFvSTtJQUNwSSwwQkFBMEIsQ0FBYztJQUN4Qyx5Q0FBeUM7SUFDekMsSUFBSSxDQUFVO0lBQ2Qsb0JBQW9CO0lBQ3BCLEtBQUssQ0FBVTtJQUNmLG9DQUFvQztJQUNwQyxLQUFLLENBQVE7SUFDYixvQkFBb0I7SUFDcEIsU0FBUyxDQUFXO0lBQ3BCLHNEQUFzRDtJQUN0RCxRQUFRLENBQWM7SUFDdEIsc0NBQXNDO0lBQ3RDLElBQUksQ0FBVTtJQUNkLHNDQUFzQztJQUN0QyxJQUFJLENBQWdCO0lBQ3BCLHNLQUFzSztJQUN0SyxPQUFPLENBQVU7SUFDakIsK0VBQStFO0lBQy9FLFlBQVksQ0FBYztJQUMxQixtQ0FBbUM7SUFDbkMsUUFBUSxDQUFZO0lBQ3BCLGlDQUFpQztJQUNqQyxLQUFLLENBQWdCO0lBQ3JCLDRDQUE0QztJQUM1QyxJQUFJLENBQU87SUFDWCxZQUFZLElBQWUsRUFBRSxNQUFjLEVBQUUsT0FBZTtRQUMzRCxJQUFBLGNBQU0sRUFBQyxJQUFJLENBQUMsSUFBSSxFQUFFLDRDQUE0QyxDQUFDLENBQUM7UUFDaEUsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzVCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ25CLElBQUksQ0FBQywwQkFBMEIsR0FBRyxJQUFJLENBQUM7UUFDdkMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLE9BQU8sR0FBRyxL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