/** @module Routes/Users */
import type Channels from "./Channels";
import type { EditSelfUserOptions, RawOAuthUser, RawUser } from "../types/users";
import * as Routes from "../util/Routes";
import ExtendedUser from "../structures/ExtendedUser";
import type RESTManager from "../rest/RESTManager";
import type User from "../structures/User";

/** Various methods for interacting with users. */
export default class Users {
    #manager: RESTManager;
    constructor(manager: RESTManager) {
        this.#manager = manager;
    }

    /** Alias for {@link Routes/Channels~Channels#createDM | Channels#createDM}. */
    get createDM(): typeof Channels.prototype.createDM {
        return this.#manager.channels.createDM.bind(this.#manager.channels);
    }

    /**
     * Edit the currently authenticated user.
     *
     * Note: This does not touch the client's cache in any way.
     * @param options The options to edit with.
     */
    async editSelf(options: EditSelfUserOptions): Promise<ExtendedUser> {
        if (options.avatar) {
            options.avatar = this.#manager.client.util._convertImage(options.avatar, "avatar");
        }
        return this.#manager.authRequest<RawOAuthUser>({
            method: "PATCH",
            path:   Routes.USER("@me"),
            json:   options
        }).then(data => new ExtendedUser(data, this.#manager.client));
    }

    /**
     * Get a user.
     * @param userID the ID of the user
     */
    async get(userID: string): Promise<User> {
        return this.#manager.authRequest<RawUser>({
            method: "GET",
            path:   Routes.USER(userID)
        }).then(data => this.#manager.client.users.update(data));
    }

    /**
     * Get the currently authenticated user's information.
     *
     * Note: This does not touch the client's cache in any way.
     * @deprecated Moved to {@link Routes/OAuth~OAuth#getCurrentUser | OAuth#getCurrentUser}. This will be removed in `1.5.0`.
     */
    async getCurrentUser(): Promise<ExtendedUser> {
        return this.#manager.oauth.getCurrentUser();
    }

    /**
     * Leave a guild.
     * @param guildID The ID of the guild to leave.
     */
    async leaveGuild(guildID: string): Promise<void> {
        await this.#manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.OAUTH_GUILD(guildID)
        });
    }
}
