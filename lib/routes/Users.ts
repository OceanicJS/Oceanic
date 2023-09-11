/** @module REST/Users */
import type Channels from "./Channels.js";
import type { EditSelfUserOptions, RawOAuthUser, RawUser } from "../types/users.js";
import * as Routes from "../util/Routes.js";
import ExtendedUser from "../structures/ExtendedUser.js";
import type RESTManager from "../rest/RESTManager.js";
import type User from "../structures/User.js";

/** Various methods for interacting with users. Located at {@link Client#rest | Client#rest}{@link RESTManager#users | .users}. */
export default class Users {
    #manager: RESTManager;
    constructor(manager: RESTManager) {
        this.#manager = manager;
    }

    /** Alias for {@link REST/Channels#createDM | Channels#createDM}. */
    get createDM(): typeof Channels.prototype.createDM {
        return this.#manager.channels.createDM.bind(this.#manager.channels);
    }

    /**
     * Edit the currently authenticated user.
     * @param options The options to edit with.
     * @caching This method **does not** cache its result.
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
     * @caching This method **does** cache its result.
     * @caches {@link Client#users | Client#users}
     */
    async get(userID: string): Promise<User> {
        return this.#manager.authRequest<RawUser>({
            method: "GET",
            path:   Routes.USER(userID)
        }).then(data => this.#manager.client.users.update(data));
    }

    /**
     * Leave a guild.
     * @param guildID The ID of the guild to leave.
     * @caching This method **does not** cache its result.
     */
    async leaveGuild(guildID: string): Promise<void> {
        await this.#manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.OAUTH_GUILD(guildID)
        });
    }
}
