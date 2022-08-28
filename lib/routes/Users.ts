import BaseRoute from "./BaseRoute";
import type { EditSelfUserOptions, RawOAuthUser, RawUser } from "../types/users";
import * as Routes from "../util/Routes";
import User from "../structures/User";
import ExtendedUser from "../structures/ExtendedUser";

export default class Users extends BaseRoute {
    /**
     * Get a user by their id
     *
     * @param {String} id - the id of the user
     * @returns {Promise<User>}
     */
    async get(id: string) {
        return this._manager.authRequest<RawUser>({
            method: "GET",
            path:   Routes.USER(id)
        }).then(data => this._client.users.update(data));
    }

    /**
     * Get the currently authenticated user's information.
     *
     * @returns {Promise<ExtendedUser>}
     */
    async getCurrentUser() {
        return this._manager.authRequest<RawOAuthUser>({
            method: "GET",
            path:   Routes.OAUTH_CURRENT_USER
        }).then(data => new ExtendedUser(data, this._client));
    }

    /**
     * Leave a guild.
     *
     * @param {String} id - The id of the guild to leave.
     * @returns {Promise<void>}
     */
    async leaveGuild(id: string) {
        await this._manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.OAUTH_GUILD(id)
        });
    }

    /**
     * Modify the currently authenticated user.
     *
     * @param {Object} options
     * @param {?(String | Buffer)} [options.avatar] - The new avatar (buffer, or full data url). `null` to remove the current avatar.
     * @param {String} [options.username] - The new username
     * @returns {Promise<ExtendedUser>}
     */
    async modifySelf(options: EditSelfUserOptions) {
        if (options.avatar) options.avatar = this._client.util._convertImage(options.avatar, "avatar");
        return this._manager.authRequest<RawOAuthUser>({
            method: "PATCH",
            path:   Routes.USER("@me"),
            json:   options
        }).then(data => new ExtendedUser(data, this._client));
    }
}
