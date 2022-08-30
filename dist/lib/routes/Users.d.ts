import BaseRoute from "./BaseRoute";
import type { EditSelfUserOptions } from "../types/users";
import ExtendedUser from "../structures/ExtendedUser";
export default class Users extends BaseRoute {
    /**
     * Edit the currently authenticated user.
     * @param options - The options to edit with.
     */
    editSelf(options: EditSelfUserOptions): Promise<ExtendedUser>;
    /**
     * Get a user.
     * @param id - the ID of the user
     */
    get(id: string): Promise<import("..").User>;
    /**
     * Get the currently authenticated user's information.
     */
    getCurrentUser(): Promise<ExtendedUser>;
    /**
     * Leave a guild.
     * @param id - The ID of the guild to leave.
     */
    leaveGuild(id: string): Promise<void>;
}
