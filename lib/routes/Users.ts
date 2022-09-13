/** @module Routes/Users */
import type { EditSelfUserOptions, RawOAuthUser, RawUser } from "../types/users";
import * as Routes from "../util/Routes";
import ExtendedUser from "../structures/ExtendedUser";
import type RESTManager from "../rest/RESTManager";
import User from "../structures/User";

/** Various methods for interacting with users. */
export default class Users {
    #manager: RESTManager;
    constructor(manager: RESTManager) {
        this.#manager = manager;
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
     * @param id the ID of the user
     */
    async get(id: string): Promise<User> {
        return this.#manager.authRequest<RawUser>({
            method: "GET",
            path:   Routes.USER(id)
        }).then(data => this.#manager.client.users.update(data));
    }

    /**
     * Get the currently authenticated user's information.
     *
     * Note: This does not touch the client's cache in any way.
     */
    async getCurrentUser(): Promise<ExtendedUser> {
        return this.#manager.authRequest<RawOAuthUser>({
            method: "GET",
            path:   Routes.OAUTH_CURRENT_USER
        }).then(data => new ExtendedUser(data, this.#manager.client));
    }

    /**
     * Leave a guild.
     * @param id The ID of the guild to leave.
     */
    async leaveGuild(id: string): Promise<void> {
        await this.#manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.OAUTH_GUILD(id)
        });
    }
}
