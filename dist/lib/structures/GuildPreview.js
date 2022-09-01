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
        this.approximateMemberCount = 0;
        this.approximatePresenceCount = 0;
        this.description = null;
        this.discoverySplash = null;
        this.emojis = [];
        this.features = [];
        this.icon = null;
        this.name = data.name;
        this.splash = null;
        this.stickers = [];
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
                user: !emoji.user ? undefined : this.client.users.update(emoji.user)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3VpbGRQcmV2aWV3LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3N0cnVjdHVyZXMvR3VpbGRQcmV2aWV3LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0RBQTBCO0FBTTFCLDRCQUE0QjtBQUM1QixNQUFxQixZQUFhLFNBQVEsY0FBSTtJQUMxQyx1REFBdUQ7SUFDdkQsc0JBQXNCLENBQVM7SUFDL0IsOERBQThEO0lBQzlELHdCQUF3QixDQUFTO0lBQ2pDLHFDQUFxQztJQUNyQyxXQUFXLENBQWdCO0lBQzNCLCtDQUErQztJQUMvQyxlQUFlLENBQWdCO0lBQy9CLGdDQUFnQztJQUNoQyxNQUFNLENBQW9CO0lBQzFCLHFIQUFxSDtJQUNySCxRQUFRLENBQXNCO0lBQzlCLG1DQUFtQztJQUNuQyxJQUFJLENBQWdCO0lBQ3BCLDhCQUE4QjtJQUM5QixJQUFJLENBQVM7SUFDYix1Q0FBdUM7SUFDdkMsTUFBTSxDQUFnQjtJQUN0QixrQ0FBa0M7SUFDbEMsUUFBUSxDQUFpQjtJQUN6QixZQUFZLElBQXFCLEVBQUUsTUFBYztRQUM3QyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsc0JBQXNCLEdBQUcsQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDeEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7UUFDNUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDakIsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxD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