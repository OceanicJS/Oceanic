"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = __importDefault(require("./Base"));
const Permission_1 = __importDefault(require("./Permission"));
/** Represents a role in a guild. */
class Role extends Base_1.default {
    /** The color of this role. */
    color;
    /** The guild this role is in. */
    guild;
    /** The id of the guild this role is in. */
    guildID;
    /** If this role is hoisted. */
    hoist;
    /** The icon has of this role. */
    icon;
    /** If this role is managed by an integration. */
    managed;
    /** If this role can be mentioned by anybody. */
    mentionable;
    /** The name of this role. */
    name;
    /** The permissions of this role. */
    permissions;
    /** The position of this role. */
    position;
    /** The [tags](https://discord.com/developers/docs/topics/permissions#role-object-role-tags-structure) of this role. */
    tags;
    /** The unicode emoji of this role. */
    unicodeEmoji;
    constructor(data, client, guildID) {
        super(data.id, client);
        this.color = data.color;
        this.guild = client.guilds.get(guildID);
        this.guildID = guildID;
        this.hoist = !!data.hoist;
        this.icon = null;
        this.managed = !!data.managed;
        this.mentionable = !!data.mentionable;
        this.name = data.name;
        this.permissions = new Permission_1.default(data.permissions);
        this.position = data.position;
        this.tags = {};
        this.unicodeEmoji = null;
        this.update(data);
    }
    update(data) {
        if (data.color !== undefined)
            this.color = data.color;
        if (data.hoist !== undefined)
            this.hoist = data.hoist;
        if (data.icon !== undefined)
            this.icon = data.icon || null;
        if (data.mentionable !== undefined)
            this.mentionable = data.mentionable;
        if (data.name !== undefined)
            this.name = data.name;
        if (data.permissions !== undefined)
            this.permissions = new Permission_1.default(data.permissions);
        if (data.position !== undefined)
            this.position = data.position;
        if (data.tags !== undefined)
            this.tags = data.tags || {};
        if (data.unicode_emoji !== undefined)
            this.unicodeEmoji = data.unicode_emoji || null;
    }
    /** A string that will mention this role. */
    get mention() {
        return `<@&${this.id}>`;
    }
    /**
     * Delete this role.
     * @param reason The reason for deleting the role.
     */
    async delete(reason) {
        return this.client.rest.guilds.deleteRole(this.guildID, this.id, reason);
    }
    toJSON() {
        return {
            ...super.toJSON(),
            color: this.color,
            guild: this.guildID,
            hoist: this.hoist,
            icon: this.icon,
            managed: this.managed,
            mentionable: this.mentionable,
            name: this.name,
            permissions: this.permissions.toJSON(),
            position: this.position,
            tags: this.tags,
            unicodeEmoji: this.unicodeEmoji
        };
    }
}
exports.default = Role;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUm9sZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9zdHJ1Y3R1cmVzL1JvbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBMEI7QUFDMUIsOERBQXNDO0FBTXRDLG9DQUFvQztBQUNwQyxNQUFxQixJQUFLLFNBQVEsY0FBSTtJQUNsQyw4QkFBOEI7SUFDOUIsS0FBSyxDQUFTO0lBQ2QsaUNBQWlDO0lBQ2pDLEtBQUssQ0FBUTtJQUNiLDJDQUEyQztJQUMzQyxPQUFPLENBQVM7SUFDaEIsK0JBQStCO0lBQy9CLEtBQUssQ0FBVTtJQUNmLGlDQUFpQztJQUNqQyxJQUFJLENBQWdCO0lBQ3BCLGlEQUFpRDtJQUNqRCxPQUFPLENBQVU7SUFDakIsZ0RBQWdEO0lBQ2hELFdBQVcsQ0FBVTtJQUNyQiw2QkFBNkI7SUFDN0IsSUFBSSxDQUFTO0lBQ2Isb0NBQW9DO0lBQ3BDLFdBQVcsQ0FBYTtJQUN4QixpQ0FBaUM7SUFDakMsUUFBUSxDQUFTO0lBQ2pCLHVIQUF1SDtJQUN2SCxJQUFJLENBQVc7SUFDZixzQ0FBc0M7SUFDdEMsWUFBWSxDQUFnQjtJQUM1QixZQUFZLElBQWEsRUFBRSxNQUFjLEVBQUUsT0FBZTtRQUN0RCxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDeEIsSUFBSSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUUsQ0FBQztRQUN6QyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQzFCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLElB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