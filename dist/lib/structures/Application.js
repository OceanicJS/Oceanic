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
const Team_1 = __importDefault(require("./Team"));
const ClientApplication_1 = __importDefault(require("./ClientApplication"));
const Routes = __importStar(require("../util/Routes"));
/** Represents an oauth application. */
class Application extends ClientApplication_1.default {
    /** When false, only the application's owners can invite the bot to guilds. */
    botPublic;
    /** When true, the applications bot will only join upon the completion of the full oauth2 code grant flow. */
    botRequireCodeGrant;
    /** This application's rich presence invite cover image hash, if any. */
    coverImage;
    /** This application's default custom authorization link, if any. */
    customInstallURL;
    /** The description of the application. */
    description;
    /** If this application is a game sold on Discord, the guild to which it has been linked.*/
    guild;
    /** The ID of the guild associated with this application, if any. */
    guildID;
    /** The icon hash of the application. */
    icon;
    /** Settings for this application's in-app authorization link, if enabled. */
    installParams;
    /** The name of the application. */
    name;
    /** The owner of this application. */
    owner;
    /** If this application is a game sold on Discord, the id of the Game's SKU. */
    primarySKUID;
    /** A url to this application's privacy policy. */
    privacyPolicyURL;
    /** A list of rpc origin urls, if rpc is enabled. */
    rpcOrigins;
    /** If this application is a game sold on Discord, the slug that links to its store page. */
    slug;
    /** The tags for this application. */
    tags;
    /** The team that owns this application, if any. */
    team;
    /** A url to this application's terms of service. */
    termsOfServiceURL;
    /** The bot's hex encoded public key. */
    verifyKey;
    constructor(data, client) {
        super(data, client);
        this.update(data);
    }
    update(data) {
        super.update(data);
        if (data.bot_public !== undefined)
            this.botPublic = data.bot_public;
        if (data.bot_require_code_grant !== undefined)
            this.botRequireCodeGrant = data.bot_require_code_grant;
        if (data.cover_image !== undefined)
            this.coverImage = data.cover_image;
        if (data.custom_install_url !== undefined)
            this.customInstallURL = data.custom_install_url;
        if (data.description !== undefined)
            this.description = data.description;
        if (data.guild_id !== undefined) {
            this.guild = this._client.guilds.get(data.guild_id);
            this.guildID = data.guild_id;
        }
        if (data.icon !== undefined)
            this.icon = data.icon;
        if (data.install_params !== undefined)
            this.installParams = data.install_params;
        if (data.name !== undefined)
            this.name = data.name;
        if (data.owner !== undefined)
            this.owner = this._client.users.update(data.owner);
        if (data.primary_sku_id !== undefined)
            this.primarySKUID = data.primary_sku_id;
        if (data.privacy_policy_url !== undefined)
            this.privacyPolicyURL = data.privacy_policy_url;
        if (data.rpc_origins !== undefined)
            this.rpcOrigins = data.rpc_origins;
        if (data.slug !== undefined)
            this.slug = data.slug;
        if (data.tags !== undefined)
            this.tags = data.tags;
        if (data.team !== undefined)
            this.team = data.team ? new Team_1.default(data.team, this._client) : null;
        if (data.terms_of_service_url !== undefined)
            this.termsOfServiceURL = data.terms_of_service_url;
        if (data.verify_key !== undefined)
            this.verifyKey = data.verify_key;
    }
    /**
     * The url of this application's cover image.
     *
     * @param {ImageFormat} format - The format the url should be.
     * @param {Number} size - The dimensions of the image.
     * @returns {?String}
     */
    coverImageURL(format, size) {
        return this.coverImage === null ? null : this._client._formatImage(Routes.APPLICATION_COVER(this.id, this.coverImage), format, size);
    }
    toJSON() {
        return {
            ...super.toJSON(),
            botPublic: this.botPublic,
            botRequireCodeGrant: this.botRequireCodeGrant,
            coverImage: this.coverImage,
            customInstallURL: this.customInstallURL,
            description: this.description,
            guild: this.guild?.id,
            icon: this.icon,
            installParams: this.installParams,
            name: this.name,
            owner: this.owner.id,
            primarySKUID: this.primarySKUID,
            privacyPolicyURL: this.privacyPolicyURL,
            rpcOrigins: this.rpcOrigins,
            slug: this.slug,
            tags: this.tags,
            team: this.team?.toJSON() || null,
            termsOfServiceURL: this.termsOfServiceURL,
            verifyKey: this.verifyKey
        };
    }
}
exports.default = Application;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwbGljYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvc3RydWN0dXJlcy9BcHBsaWNhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0Esa0RBQTBCO0FBQzFCLDRFQUFvRDtBQUtwRCx1REFBeUM7QUFHekMsdUNBQXVDO0FBQ3ZDLE1BQXFCLFdBQVksU0FBUSwyQkFBaUI7SUFDekQsOEVBQThFO0lBQzlFLFNBQVMsQ0FBVTtJQUNuQiw2R0FBNkc7SUFDN0csbUJBQW1CLENBQVU7SUFDN0Isd0VBQXdFO0lBQ3hFLFVBQVUsQ0FBZ0I7SUFDMUIsb0VBQW9FO0lBQ3BFLGdCQUFnQixDQUFVO0lBQzFCLDBDQUEwQztJQUMxQyxXQUFXLENBQVM7SUFDcEIsMkZBQTJGO0lBQzNGLEtBQUssQ0FBUztJQUNkLG9FQUFvRTtJQUNwRSxPQUFPLENBQVU7SUFDakIsd0NBQXdDO0lBQ3hDLElBQUksQ0FBZ0I7SUFDcEIsNkVBQTZFO0lBQzdFLGFBQWEsQ0FBaUI7SUFDOUIsbUNBQW1DO0lBQ25DLElBQUksQ0FBUztJQUNiLHFDQUFxQztJQUNyQyxLQUFLLENBQU87SUFDWiwrRUFBK0U7SUFDL0UsWUFBWSxDQUFVO0lBQ3RCLGtEQUFrRDtJQUNsRCxnQkFBZ0IsQ0FBVTtJQUMxQixvREFBb0Q7SUFDcEQsVUFBVSxDQUFnQjtJQUMxQiw0RkFBNEY7SUFDNUYsSUFBSSxDQUFVO0lBQ2QscUNBQXFDO0lBQ3JDLElBQUksQ0FBaUI7SUFDckIsbURBQW1EO0lBQ25ELElBQUksQ0FBYztJQUNsQixvREFBb0Q7SUFDcEQsaUJBQWlCLENBQVU7SUFDM0Isd0NBQXdDO0lBQ3hDLFNBQVMsQ0FBUztJQUNsQixZQUFZLElBQXFCLEVBQUUsTUFBYztRQUNoRCxLQUFLLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFD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