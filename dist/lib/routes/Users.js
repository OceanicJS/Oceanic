"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRoute_1 = __importDefault(require("./BaseRoute"));
const Routes = __importStar(require("../util/Routes"));
const ExtendedUser_1 = __importDefault(require("../structures/ExtendedUser"));
class Users extends BaseRoute_1.default {
    /**
     * Create a direct message.
     *
     * @param {String} recipient - The id of the recipient of the direct message.
     * @returns {Promise<PrivateChannel>}
     */
    async createDM(recipient) {
        return this._manager.authRequest({
            method: "POST",
            path: Routes.OAUTH_CHANNELS,
            json: {
                recipient_id: recipient
            }
        }).then(data => this._client.privateChannels.update(data));
    }
    /**
     * Create a group dm.
     *
     * @param {Object} options
     * @param {String[]} options.accessTokens - An array of access tokens with the `gdm.join` scope.
     * @param {Object} [options.nicks] - A dictionary of ids to nicknames, looks unused.
     * @returns {Promise<GroupChannel>}
     */
    async createGroupDM(options) {
        return this._manager.authRequest({
            method: "POST",
            path: Routes.OAUTH_CHANNELS,
            json: {
                access_tokens: options.accessTokens,
                nicks: options.nicks
            }
        }).then(data => this._client.groupChannels.update(data));
    }
    /**
     * Get a user by their id
     *
     * @param {String} id - the id of the user
     * @returns {Promise<User>}
     */
    async get(id) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.USER(id)
        }).then(data => this._client.users.update(data));
    }
    /**
     * Get the currently authenticated user's information.
     *
     * @returns {Promise<ExtendedUser>}
     */
    async getCurrentUser() {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.OAUTH_CURRENT_USER
        }).then(data => new ExtendedUser_1.default(data, this._client));
    }
    /**
     * Leave a guild.
     *
     * @param {String} id - The id of the guild to leave.
     * @returns {Promise<void>}
     */
    async leaveGuild(id) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.OAUTH_GUILD(id)
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
    async modifySelf(options) {
        if (options.avatar)
            options.avatar = this._manager._convertImage(options.avatar, "avatar");
        return this._manager.authRequest({
            method: "PATCH",
            path: Routes.USER("@me"),
            json: options
        }).then(data => new ExtendedUser_1.default(data, this._client));
    }
}
exports.default = Users;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvcm91dGVzL1VzZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw0REFBb0M7QUFHcEMsdURBQXlDO0FBSXpDLDhFQUFzRDtBQUV0RCxNQUFxQixLQUFNLFNBQVEsbUJBQVM7SUFDM0M7Ozs7O09BS0c7SUFDSCxLQUFLLENBQUMsUUFBUSxDQUFDLFNBQWlCO1FBQy9CLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQW9CO1lBQ25ELE1BQU0sRUFBRSxNQUFNO1lBQ2QsSUFBSSxFQUFJLE1BQU0sQ0FBQyxjQUFjO1lBQzdCLElBQUksRUFBSTtnQkFDUCxZQUFZLEVBQUUsU0FBUzthQUN2QjtTQUFFLENBQ0gsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNILEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBa0M7UUFDckQsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBa0I7WUFDakQsTUFBTSxFQUFFLE1BQU07WUFDZCxJQUFJLEVBQUksTUFBTSxDQUFDLGNBQWM7WUFDN0IsSUFBSSxFQUFJO2dCQUNQLGFBQWEsRUFBRSxPQUFPLENBQUMsWUFBWTtnQkFDbkMsS0FBSyxFQUFVLE9BQU8sQ0FBQyxLQUFLO2FBQzVCO1NBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBVTtRQUNuQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFVO1lBQ3pDLE1BQU0sRUFBRSxLQUFLO1lBQ2IsSUFBSSxFQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1NBQ3ZCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILEtBQUssQ0FBQyxjQUFjO1FBQ25CLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQWU7WUFDOUMsTUFBTSxFQUFFLEtBQUs7WUFDYixJQUFJLEVBQUksTUFBTSxDQUFDLGtCQUFrQjtTQUNqQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxzQkFBWSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxLQUFLLENBQUMsVUFBVSxDQUFDLEVBQVU7UUFDMUIsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBTztZQUNyQyxNQUFNLEVBQUUsUUFBUTtZQUNoQixJQUFJLEVBQUksTUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUM7U0FDOUIsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCxLQUFLLENBQUMsVUFBVSxDQUFDLE9BQTRCO1FBQzVDLElBQUksT0FBTyxDQUFDLE1BQU07WUFBRSxPQUFPLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDM0YsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBZTtZQUM5QyxNQUFNLEVBQUUsT0FBTztZQUNmLElBQUksRUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUMxQixJQUFJLEVBQUksT0FBTztTQUNmLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLHNCQUFZLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7Q0FDRDtBQXpGRCx3QkF5RkMifQ==