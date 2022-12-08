/** @module User */
import Base from "./Base";
import type PrivateChannel from "./PrivateChannel";
import type { ImageFormat } from "../Constants";
import * as Routes from "../util/Routes";
import type Client from "../Client";
import type { RawUser } from "../types/users";
import type { JSONUser } from "../types/json";

/** Represents a user. */
export default class User extends Base {
    /** The user's banner color. If this member was received via the gateway, this will never be present. */
    accentColor?: number | null;
    /** The user's avatar hash. */
    avatar: string | null;
    /** The hash of this user's avatar decoration. This will always resolve to a png. */
    avatarDecoration?: string | null;
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
    constructor(data: RawUser, client: Client) {
        super(data.id, client);
        this.avatar = null;
        this.bot = !!data.bot;
        this.discriminator = data.discriminator;
        this.publicFlags = 0;
        this.system = !!data.system;
        this.username = data.username;
        this.update(data);
    }

    protected override update(data: Partial<RawUser>): void {
        if (data.accent_color !== undefined) {
            this.accentColor = data.accent_color;
        }
        if (data.avatar !== undefined) {
            this.avatar = data.avatar;
        }
        if (data.avatar_decoration !== undefined) {
            this.avatarDecoration = data.avatar_decoration;
        }
        if (data.banner !== undefined) {
            this.banner = data.banner;
        }
        if (data.discriminator !== undefined) {
            this.discriminator = data.discriminator;
        }
        if (data.public_flags !== undefined) {
            this.publicFlags = data.public_flags;
        }
        if (data.username !== undefined) {
            this.username = data.username;
        }
    }

    /** The default avatar value of this user (discriminator modulo 5). */
    get defaultAvatar(): number {
        return Number(this.discriminator) % 5;
    }

    /** A string that will mention this user. */
    get mention(): string {
        return `<@${this.id}>`;
    }

    /** a combination of this user's username and discriminator. */
    get tag(): string {
        return `${this.username}#${this.discriminator}`;
    }

    /**
     * The url of this user's avatar decoration. This will always be a png.
     * Discord does not combine the decoration and their current avatar for you. This is ONLY the decoration.
     * @note As of 12/8/2022 (Dec 8) `avatar_decoration` is only visible to bots if they set an `X-Super-Properties` header with a `client_build_number` ~162992. You can do this via the {@link Types/Client~RESTOptions#superProperties | rest.superProperties} option.
     * @param size The dimensions of the image.
     */
    avatarDecorationURL(size?: number): string | null {
        return !this.avatarDecoration ? null : this.client.util.formatImage(Routes.USER_AVATAR_DECORATION(this.id, this.avatarDecoration), "png", size);
    }

    /**
     * The url of this user's avatar (or default avatar, if they have not set an avatar).
     * @param format The format the url should be.
     * @param size The dimensions of the image.
     */
    avatarURL(format?: ImageFormat, size?: number): string {
        return this.avatar === null ? this.defaultAvatarURL() : this.client.util.formatImage(Routes.USER_AVATAR(this.id, this.avatar), format, size);
    }

    /**
     * Create a direct message with this user.
     */
    async createDM(): Promise<PrivateChannel> {
        return this.client.rest.channels.createDM(this.id);
    }

    /**
     * The url of this user's default avatar.
     */
    defaultAvatarURL(): string {
        return this.client.util.formatImage(Routes.EMBED_AVATAR(this.defaultAvatar), "png");
    }

    override toJSON(): JSONUser {
        return {
            ...super.toJSON(),
            accentColor:   this.accentColor,
            avatar:        this.avatar,
            banner:        this.banner,
            bot:           this.bot,
            discriminator: this.discriminator,
            publicFlags:   this.publicFlags,
            system:        this.system,
            username:      this.username
        };
    }
}
