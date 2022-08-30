import BaseRoute from "./BaseRoute";
import type { EditSelfUserOptions } from "../types/users";
import User from "../structures/User";
import ExtendedUser from "../structures/ExtendedUser";
export default class Users extends BaseRoute {
    /**
     * Get a user by their id
     *
     * @param {String} id - the id of the user
     * @returns {Promise<User>}
     */
    get(id: string): Promise<User>;
    /**
     * Get the currently authenticated user's information.
     *
     * @returns {Promise<ExtendedUser>}
     */
    getCurrentUser(): Promise<ExtendedUser>;
    /**
     * Leave a guild.
     *
     * @param {String} id - The id of the guild to leave.
     * @returns {Promise<void>}
     */
    leaveGuild(id: string): Promise<void>;
    /**
     * Modify the currently authenticated user.
     *
     * @param {Object} options
     * @param {?(String | Buffer)} [options.avatar] - The new avatar (buffer, or full data url). `null` to remove the current avatar.
     * @param {String} [options.username] - The new username
     * @returns {Promise<ExtendedUser>}
     */
    modifySelf(options: EditSelfUserOptions): Promise<ExtendedUser>;
}
