import Base from "./Base";
import type User from "./User";
import Guild from "./Guild";
import type { ImageFormat } from "../Constants";
import type Client from "../Client";
import type { CreateBanOptions, EditMemberOptions, EditUserVoiceStateOptions, RawMember } from "../types/guilds";
import type { JSONMember } from "../types/json";
import type { Presence } from "../types/gateway";
import { assert } from "tsafe";

/** Represents a member of a guild. */
export default class Member extends Base {
    /** The member's avatar hash, if they have set a guild avatar. */
    avatar: string | null;
    /** When the member's [timeout](https://support.discord.com/hc/en-us/articles/4413305239191-Time-Out-FAQ) will expire, if active. */
    communicationDisabledUntil: Date | null;
    /** If this member is server deafened. */
    deaf: boolean;
    /** Undocumented. */
    flags?: number;
    /** The guild this member is for. */
    guild: Guild;
    /** The id of the guild this member is for. */
    guildID: string;
    /** Undocumented. */
    isPending?: boolean;
    /** The date at which this member joined the guild. */
    joinedAt: Date | null;
    /** If this member is server muted. */
    mute: boolean;
    /** This member's nickname, if any. */
    nick: string | null;
    /** If this member has not passed the guild's [membership screening](https://discord.com/developers/docs/resources/guild#membership-screening-object) requirements. */
    pending: boolean;
    /** The date at which this member started boosting the guild, if applicable. */
    premiumSince: Date | null;
    /** The presence of this member. */
    presence?: Presence;
    /** The roles this member has. */
    roles: Array<string>;
    /** The user associated with this member. */
    user: User;
    constructor(data: RawMember, client: Client, guildID: string) {
        assert(data.user, "Member recieved without accompanying user.");
        super(data.user.id, client);
        this.avatar = null;
        this.communicationDisabledUntil = null;
        this.nick = null;
        this.pending = false;
        this.premiumSince = null;
        this.guild = this._client.guilds.get(guildID)!;
        this.guildID = guildID;
        this.update(data);
    }

    protected update(data: Partial<RawMember>) {
        if (data.avatar !== undefined) this.avatar = data.avatar;
        if (data.communication_disabled_until !== undefined) this.communicationDisabledUntil = data.communication_disabled_until === null ? null : new Date(data.communication_disabled_until);
        if (data.deaf !== undefined) this.deaf = data.deaf;
        if (data.flags !== undefined) this.flags = data.flags;
        if (data.is_pending !== undefined) this.isPending = data.is_pending;
        if (data.joined_at !== undefined) this.joinedAt = data.joined_at === null ? null : new Date(data.joined_at);
        if (data.mute !== undefined) this.mute = data.mute;
        if (data.nick !== undefined) this.nick = data.nick;
        if (data.pending !== undefined) this.pending = data.pending;
        if (data.premium_since !== undefined) this.premiumSince = data.premium_since === null ? null : new Date(data.premium_since);
        if (data.roles !== undefined) this.roles = data.roles;
        if (data.user !== undefined) this.user = this._client.users.update(data.user);
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
    get voiceState() { return this.guild instanceof Guild ? this.guild.voiceStates.get(this.id) || null : null; }

    /**
     * Add a role to this member.
     *
     * @param {String} roleID - The ID of the role to add.
     * @param {String} [reason] - The reason for adding the role.
     * @returns {Promise<void>}
     */
    async addRole(roleID: string, reason?: string) {
        await this._client.rest.guilds.addMemberRole(this.guild.id, this.id, roleID, reason);
    }

    /**
     * The url of this user's guild avatar (or their user avatar if no guild avatar is set, or their default avatar if none apply).
     *
     * @param {ImageFormat} format - The format the url should be.
     * @param {Number} size - The dimensions of the image.
     * @returns {String}
     */
    avatarURL(format?: ImageFormat, size?: number) {
        return this.avatar === null ? this.user.avatarURL(format, size) : this._client.util.formatImage(this.avatar, format, size);
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
    async ban(options?: CreateBanOptions) {
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
    async edit(options: EditMemberOptions) {
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
    async editVoiceState(options: EditUserVoiceStateOptions) {
        return this._client.rest.guilds.editUserVoiceState(this.guild.id, this.id, options);
    }

    /**
     * Remove a member from the guild.
     *
     * @param {String} reason - The reason for the removal.
     * @returns {Promise<void>}
     */
    async kick(reason?: string) {
        await this._client.rest.guilds.removeMember(this.guild.id, this.id, reason);
    }

    /**
     * remove a role from this member.
     *
     * @param {String} roleID - The ID of the role to remove.
     * @param {String} [reason] - The reason for removing the role.
     * @returns {Promise<void>}
     */
    async removeRole(roleID: string, reason?: string) {
        await this._client.rest.guilds.removeMemberRole(this.guild.id, this.id, roleID, reason);
    }

    override toJSON(): JSONMember {
        return {
            ...super.toJSON(),
            avatar:                     this.avatar,
            communicationDisabledUntil: this.communicationDisabledUntil?.getTime() || null,
            deaf:                       this.deaf,
            flags:                      this.flags,
            guild:                      this.guildID,
            isPending:                  this.isPending,
            joinedAt:                   this.joinedAt?.getTime() || null,
            mute:                       this.mute,
            nick:                       this.nick,
            pending:                    this.pending,
            premiumSince:               this.premiumSince?.getTime() || null,
            presence:                   this.presence,
            roles:                      this.roles,
            user:                       this.user.toJSON()
        };
    }

    /**
     * Remove a ban for this member.
     *
     * @param {String} [reason] - The reason for removing the ban.
     */
    async unban(reason?: string) {
        await this._client.rest.guilds.removeBan(this.guild.id, this.id, reason);
    }
}
