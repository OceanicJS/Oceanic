import Base from "./Base";
import type User from "./User";
import Guild from "./Guild";
import type { ImageFormat } from "../Constants";
import type Client from "../Client";
import type { CreateBanOptions, EditMemberOptions, EditUserVoiceStateOptions, RawMember } from "../types/guilds";
import type { JSONMember } from "../types/json";
import type { Presence } from "../types/gateway";
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
    constructor(data: RawMember, client: Client, guildID: string);
    protected update(data: Partial<RawMember>): void;
    /** If the member associated with the user is a bot. */
    get bot(): boolean;
    /** The 4 digits after the username of the user associated with this member. */
    get discriminator(): string;
    /** A string that will mention this member. */
    get mention(): string;
    get permissions(): import("./Permission").default;
    /** The user associated with this member's public [flags](https://discord.com/developers/docs/resources/user#user-object-user-flags). */
    get publicUsers(): number;
    /** If this user associated with this member is an official discord system user. */
    get system(): boolean;
    /** a combination of the user associated with this member's username and discriminator. */
    get tag(): string;
    /** The user associated ith this member's username. */
    get username(): string;
    /** The voice state of this member. */
    get voiceState(): import("./VoiceState").default | null;
    /**
     * Add a role to this member.
     * @param roleID The ID of the role to add.
     */
    addRole(roleID: string, reason?: string): Promise<void>;
    /**
     * The url of this user's guild avatar (or their user avatar if no guild avatar is set, or their default avatar if none apply).
     * @param format The format the url should be.
     * @param size The dimensions of the image.
     */
    avatarURL(format?: ImageFormat, size?: number): string;
    /**
     * Create a bon for this member.
     * @param options The options for the ban.
     */
    ban(options?: CreateBanOptions): Promise<void>;
    /**
     * Edit this member.
     * @param options The options for editing the member.
     */
    edit(options: EditMemberOptions): Promise<Member>;
    /**
     * Edit this guild member's voice state. `channelID` is required, and the user must already be in that channel. See [Discord's docs](https://discord.com/developers/docs/resources/guild#modify-user-voice-state) for more information.
     * @param options The options for editing the voice state.
     */
    editVoiceState(options: EditUserVoiceStateOptions): Promise<void>;
    /**
     * Remove a member from the guild.
     * @param reason The reason for the kick.
     */
    kick(reason?: string): Promise<void>;
    /**
     * remove a role from this member.
     * @param roleID The ID of the role to remove.
     * @param reason The reason for removing the role.
     */
    removeRole(roleID: string, reason?: string): Promise<void>;
    toJSON(): JSONMember;
    /**
     * Remove a ban for this member.
     * @param reason The reason for removing the ban.
     */
    unban(reason?: string): Promise<void>;
}
