import BaseRoute from "./BaseRoute";
import type { EditSelfUserOptions, RawOAuthUser, RawUser } from "../types/users";
import * as Routes from "../util/Routes";
import ExtendedUser from "../structures/ExtendedUser";

export default class Users extends BaseRoute {
    /**
     * Edit the currently authenticated user.
     * @param options The options to edit with.
     */
    async editSelf(options: EditSelfUserOptions) {
        if (options.avatar) options.avatar = this._client.util._convertImage(options.avatar, "avatar");
        return this._manager.authRequest<RawOAuthUser>({
            method: "PATCH",
            path:   Routes.USER("@me"),
            json:   options
        }).then(data => new ExtendedUser(data, this._client));
    }

    /**
     * Get a user.
     * @param id the ID of the user
     */
    async get(id: string) {
        return this._manager.authRequest<RawUser>({
            method: "GET",
            path:   Routes.USER(id)
        }).then(data => this._client.users.update(data));
    }

    /**
     * Get the currently authenticated user's information.
     */
    async getCurrentUser() {
        return this._manager.authRequest<RawOAuthUser>({
            method: "GET",
            path:   Routes.OAUTH_CURRENT_USER
        }).then(data => new ExtendedUser(data, this._client));
    }

    /**
     * Leave a guild.
     * @param id The ID of the guild to leave.
     */
    async leaveGuild(id: string) {
        await this._manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.OAUTH_GUILD(id)
        });
    }
}
