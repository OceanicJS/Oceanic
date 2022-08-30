"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = __importDefault(require("./Base"));
/** A preview of a guild. */
class GuildPreview extends Base_1.default {
    /** The approximate number of members in this guild. */
    approximateMemberCount;
    /** The approximate number of online members in this guild. */
    approximatePresenceCount;
    /** The description of this guild. */
    description;
    /** The discovery splash hash of this guild. */
    discoverySplash;
    /** The emojis of this guild. */
    emojis;
    /** The [features](https://discord.com/developers/docs/resources/guild#guild-object-guild-features) of this guild. */
    features;
    /** The icon hash of this guild. */
    icon;
    /** The name of this guild. */
    name;
    /** The invite splash of this guild. */
    splash;
    /** The stickers in this guild. */
    stickers;
    constructor(data, client) {
        super(data.id, client);
        this.update(data);
    }
    update(data) {
        if (data.approximate_member_count !== undefined)
            this.approximateMemberCount = data.approximate_member_count;
        if (data.approximate_presence_count !== undefined)
            this.approximatePresenceCount = data.approximate_presence_count;
        if (data.description !== undefined)
            this.description = data.description;
        if (data.discovery_splash !== undefined)
            this.discoverySplash = data.discovery_splash;
        if (data.emojis !== undefined)
            this.emojis = data.emojis.map(emoji => ({
                ...emoji,
                user: !emoji.user ? undefined : this._client.users.update(emoji.user)
            }));
        if (data.features !== undefined)
            this.features = data.features;
        if (data.icon !== undefined)
            this.icon = data.icon;
        if (data.name !== undefined)
            this.name = data.name;
        if (data.splash !== undefined)
            this.splash = data.splash;
        if (data.stickers !== undefined)
            this.stickers = data.stickers;
    }
    toJSON() {
        return {
            ...super.toJSON(),
            approximateMemberCount: this.approximateMemberCount,
            approximatePresenceCount: this.approximatePresenceCount,
            description: this.description,
            discoverySplash: this.discoverySplash,
            emojis: this.emojis,
            features: this.features,
            icon: this.icon,
            name: this.name,
            splash: this.splash,
            stickers: this.stickers
        };
    }
}
exports.default = GuildPreview;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3VpbGRQcmV2aWV3LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3N0cnVjdHVyZXMvR3VpbGRQcmV2aWV3LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0RBQTBCO0FBTTFCLDRCQUE0QjtBQUM1QixNQUFxQixZQUFhLFNBQVEsY0FBSTtJQUMxQyx1REFBdUQ7SUFDdkQsc0JBQXNCLENBQVM7SUFDL0IsOERBQThEO0lBQzlELHdCQUF3QixDQUFTO0lBQ2pDLHFDQUFxQztJQUNyQyxXQUFXLENBQWdCO0lBQzNCLCtDQUErQztJQUMvQyxlQUFlLENBQWdCO0lBQy9CLGdDQUFnQztJQUNoQyxNQUFNLENBQW9CO0lBQzFCLHFIQUFxSDtJQUNySCxRQUFRLENBQXNCO0lBQzlCLG1DQUFtQztJQUNuQyxJQUFJLENBQWdCO0lBQ3BCLDhCQUE4QjtJQUM5QixJQUFJLENBQVM7SUFDYix1Q0FBdUM7SUFDdkMsTUFBTSxDQUFnQjtJQUN0QixrQ0FBa0M7SUFDbEMsUUFBUSxDQUFpQjtJQUN6QixZQUFZLElBQXFCLEVBQUUsTUFBYztRQUM3QyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RCLENBQUM7SUFFUyxNQUFNLENBQUMsSUFBcUI7UUFDbEMsSUFBSSxJQUFJLENBQUMsd0JBQXdCLEtBQUssU0FBUztZQUFFLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUMsd0JBQXdCLENBQUM7UUFDN0csSUFBSSxJQUFJLENBQUMsMEJBQTBCLEtBQUssU0FBUztZQUFFLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLENBQUMsMEJBQTBCLENBQUM7UUFDbkgsSUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLFNBQVM7WUFBRSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDeEUsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEtBQUssU0FBUztZQUFFLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDO1FBQ3RGLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxTQUFTO1lBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ25FLEdBQUcsS0FBSztnQkFDUixJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO2FBQ3hFLENBQUMsQ0FBQyxDQUFDO1FBQ0osSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLFNBQVM7WUFBRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDL0QsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLFNBQVM7WUFBRSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDbkQsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLFNBQVM7WUFBRSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDbkQsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLFNBQVM7WUFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDekQsSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLFNBQVM7WUFBRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDbkUsQ0FBQztJQUVRLE1BQU07UUFDWCxPQUFPO1lBQ0gsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFO1lBQ2pCLHNCQUFzQixFQUFJLElBQUksQ0FBQyxzQkFBc0I7WUFDckQsd0JBQXdCLEVBQUUsSUFBSSxDQUFDLHdCQUF3QjtZQUN2RCxXQUFXLEVBQWUsSUFBSSxDQUFDLFdBQVc7WUFDMUMsZUFBZSxFQUFXLElBQUksQ0FBQyxlQUFlO1lBQzlDLE1BQU0sRUFBb0IsSUFBSSxDQUFDLE1BQU07WUFDckMsUUFBUSxFQUFrQixJQUFJLENBQUMsUUFBUTtZQUN2QyxJQUFJLEVBQXNCLElBQUksQ0FBQyxJQUFJO1lBQ25DLElBQUksRUFBc0IsSUFBSSxDQUFDLElBQUk7WUFDbkMsTUFBTSxFQUFvQixJQUFJLENBQUMsTUFBTTtZQUNyQyxRQUFRLEVBQWtCLElBQUksQ0FBQyxRQUFRO1NBQzFDLENBQUM7SUFDTixDQUFDO0NBQ0o7QUF6REQsK0JBeURDIn0=