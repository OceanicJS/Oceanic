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
        this.guild = this._client.guilds.get(guildID);
        this.guildID = guildID;
        this.managed = data.managed;
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
     * @param reason - The reason for deleting the role.
     */
    async delete(reason) {
        return this._client.rest.guilds.deleteRole(this.guildID, this.id, reason);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUm9sZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9zdHJ1Y3R1cmVzL1JvbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBMEI7QUFDMUIsOERBQXNDO0FBTXRDLG9DQUFvQztBQUNwQyxNQUFxQixJQUFLLFNBQVEsY0FBSTtJQUNsQyw4QkFBOEI7SUFDOUIsS0FBSyxDQUFTO0lBQ2QsaUNBQWlDO0lBQ2pDLEtBQUssQ0FBUTtJQUNiLDJDQUEyQztJQUMzQyxPQUFPLENBQVM7SUFDaEIsK0JBQStCO0lBQy9CLEtBQUssQ0FBVTtJQUNmLGlDQUFpQztJQUNqQyxJQUFJLENBQWdCO0lBQ3BCLGlEQUFpRDtJQUNqRCxPQUFPLENBQVU7SUFDakIsZ0RBQWdEO0lBQ2hELFdBQVcsQ0FBVTtJQUNyQiw2QkFBNkI7SUFDN0IsSUFBSSxDQUFTO0lBQ2Isb0NBQW9DO0lBQ3BDLFdBQVcsQ0FBYTtJQUN4QixpQ0FBaUM7SUFDakMsUUFBUSxDQUFTO0lBQ2pCLHVIQUF1SDtJQUN2SCxJQUFJLENBQVc7SUFDZixzQ0FBc0M7SUFDdEMsWUFBWSxDQUFnQjtJQUM1QixZQUFZLElBQWEsRUFBRSxNQUFjLEVBQUUsT0FBZTtRQUN0RCxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUUsQ0FBQztRQUMvQyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN0QixDQUFDO0lBRVMsTUFBTSxDQUFDLElBQXNCO1FBQ25DLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxTQUFTO1lBQUUsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3RELElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxTQUFTO1lBQUUsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3RELElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxTQUFTO1lBQUUsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQztRQUMzRCxJQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssU0FBUztZQUFFLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUN4RSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUztZQUFFLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUNuRCxJQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssU0FBUztZQUFFLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxvQkFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN4RixJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssU0FBUztZQUFFLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUMvRCxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUztZQUFFLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7UUFDekQsSUFBSSxJQUFJLENBQUMsYUFBYSxLQUFLLFNBQVM7WUFBRSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDO0lBQ3pGLENBQUM7SUFFRCw0Q0FBNEM7SUFDNUMsSUFBSSxPQUFPO1FBQ1AsT0FBTyxNQUFNLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQztJQUM1QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFlO1FBQ3hCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDOUUsQ0FBQztJQUVRLE1BQU07UUFDWCxPQUFPO1lBQ0gsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFO1lBQ2pCLEtBQUssRUFBUyxJQUFJLENBQUMsS0FBSztZQUN4QixLQUFLLEVBQVMsSUFBSSxDQUFDLE9BQU87WUFDMUIsS0FBSyxFQUFTLElBQUksQ0FBQyxLQUFLO1lBQ3hCLElBQUksRUFBVSxJQUFJLENBQUMsSUFBSTtZQUN2QixPQUFPLEVBQU8sSUFBSSxDQUFDLE9BQU87WUFDMUIsV0FBVyxFQUFHLElBQUksQ0FBQyxXQUFXO1lBQzlCLElBQUksRUFBVSxJQUFJLENBQUMsSUFBSTtZQUN2QixXQUFXLEVBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUU7WUFDdkMsUUFBUSxFQUFNLElBQUksQ0FBQyxRQUFRO1lBQzNCLElBQUksRUFBVSxJQUFJLENBQUMsSUFBSTtZQUN2QixZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVk7U0FDbEMsQ0FBQztJQUNOLENBQUM7Q0FDSjtBQTFFRCx1QkEwRUMifQ==