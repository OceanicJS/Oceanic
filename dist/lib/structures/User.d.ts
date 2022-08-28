import Base from "./Base";
import PrivateChannel from "./PrivateChannel";
import type { ImageFormat } from "../Constants";
import type Client from "../Client";
import type { RawUser } from "../types/users";
import type { JSONUser } from "../types/json";
/** Represents a user. */
export default class User extends Base {
    /** The user's banner color. If this member was received via the gateway, this will never be present. */
    accentColor?: number | null;
    /** The user's avatar hash. */
    avatar: string | null;
    /** The user's banner hash. If this member was received via the gateway, this will never be present. */
    banner?: string | null;
    /** If this user is a bot. */
    bot: boolean;
    /** The 4 digits after the user's username. */
    discriminator: string;
    /** The user's public [flags](https://discord.com/developers/docs/resources/user#user-object-user-flags). */
    publicFlags: number;
    /** If this user is an official discord system user. */
    system: boolean;
    /** The user's username. */
    username: string;
    constructor(data: RawUser, client: Client);
    protected update(data: Partial<RawUser>): void;
    /** The default avatar value of this user (discriminator modulo 5). */
    get defaultAvatar(): number;
    /** A string that will mention this user. */
    get mention(): string;
    /** a combination of this user's username and discriminator. */
    get tag(): string;
    /**
     * The url of this user's avatar (or default avatar, if they have not set an avatar).
     *
     * @param {ImageFormat} format - The format the url should be.
     * @param {Number} size - The dimensions of the image.
     * @returns {String}
     */
    avatarURL(format?: ImageFormat, size?: number): string;
    /**
     * Create a direct message with this user.
     *
     * @returns {Promise<PrivateChannel>}
     */
    createDM(): Promise<PrivateChannel>;
    /**
     * The url of this user's default avatar.
     *
     * @returns {String}
     */
    defaultAvatarURL(): string;
    toJSON(): JSONUser;
}
