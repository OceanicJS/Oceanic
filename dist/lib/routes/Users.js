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
     * Edit the currently authenticated user.
     * @param options - The options to edit with.
     */
    async editSelf(options) {
        if (options.avatar)
            options.avatar = this._client.util._convertImage(options.avatar, "avatar");
        return this._manager.authRequest({
            method: "PATCH",
            path: Routes.USER("@me"),
            json: options
        }).then(data => new ExtendedUser_1.default(data, this._client));
    }
    /**
     * Get a user.
     * @param id - the ID of the user
     */
    async get(id) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.USER(id)
        }).then(data => this._client.users.update(data));
    }
    /**
     * Get the currently authenticated user's information.
     */
    async getCurrentUser() {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.OAUTH_CURRENT_USER
        }).then(data => new ExtendedUser_1.default(data, this._client));
    }
    /**
     * Leave a guild.
     * @param id - The ID of the guild to leave.
     */
    async leaveGuild(id) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.OAUTH_GUILD(id)
        });
    }
}
exports.default = Users;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvcm91dGVzL1VzZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw0REFBb0M7QUFFcEMsdURBQXlDO0FBQ3pDLDhFQUFzRDtBQUV0RCxNQUFxQixLQUFNLFNBQVEsbUJBQVM7SUFDeEM7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUE0QjtRQUN2QyxJQUFJLE9BQU8sQ0FBQyxNQUFNO1lBQUUsT0FBTyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUMvRixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFlO1lBQzNDLE1BQU0sRUFBRSxPQUFPO1lBQ2YsSUFBSSxFQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQzFCLElBQUksRUFBSSxPQUFPO1NBQ2xCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLHNCQUFZLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQVU7UUFDaEIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBVTtZQUN0QyxNQUFNLEVBQUUsS0FBSztZQUNiLElBQUksRUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztTQUMxQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVEOztPQUVHO0lBQ0gsS0FBSyxDQUFDLGNBQWM7UUFDaEIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBZTtZQUMzQyxNQUFNLEVBQUUsS0FBSztZQUNiLElBQUksRUFBSSxNQUFNLENBQUMsa0JBQWtCO1NBQ3BDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLHNCQUFZLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMsVUFBVSxDQUFDLEVBQVU7UUFDdkIsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBTztZQUNsQyxNQUFNLEVBQUUsUUFBUTtZQUNoQixJQUFJLEVBQUksTUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUM7U0FDakMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKO0FBN0NELHdCQTZDQyJ9