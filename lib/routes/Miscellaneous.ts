/** @module REST/Miscellaneous */
import * as Routes from "../util/Routes";
import type RESTManager from "../rest/RESTManager";
import type { RawSticker, RawStickerPack, Sticker, StickerPack } from "../types/guilds";
import type { VoiceRegion } from "../types/voice";
import type { RESTApplication, RawClientApplication } from "../types";
import Application from "../structures/Application";
import ClientApplication from "../structures/ClientApplication";
import type {
    CreateTestEntitlementOptions,
    RawEntitlement,
    RawSKU,
    RawTestEntitlement,
    SKU,
    SearchEntitlementsOptions
} from "../types/misc";
import TestEntitlement from "../structures/TestEntitlement";
import Entitlement from "../structures/Entitlement";

/** Methods that don't fit anywhere else. Located at {@link Client#rest | Client#rest}{@link RESTManager#misc | .misc}. */
export default class Miscellaneous {
    #manager: RESTManager;
    constructor(manager: RESTManager) {
        this.#manager = manager;
    }

    /**
     * Create a test entitlement.
     * @param applicationID The ID of the application to create the entitlement for.
     * @param options The options for creating the test entitlement.
     */
    async createTestEntitlement(applicationID: string, options: CreateTestEntitlementOptions): Promise<TestEntitlement> {
        return this.#manager.authRequest<RawTestEntitlement>({
            method: "POST",
            path:   Routes.ENTITLEMENTS(applicationID),
            json:   {
                owner_id:   options.ownerID,
                owner_type: options.ownerType,
                sku_id:     options.skuID
            }
        }).then(data => new TestEntitlement(data, this.#manager.client));
    }

    /**
     * Delete an entitlement.
     * @param applicationID The ID of the application to delete the entitlement from.
     * @param entitlementID The ID of the entitlement to delete.
     */
    async deleteEntitlement(applicationID: string, entitlementID: string): Promise<void> {
        await this.#manager.authRequest<null>({
            method: "DELETE",
            path:   Routes.ENTITLEMENT(applicationID, entitlementID)
        });
    }

    /**
     * Get the currently authenticated bot's application info.
     * @caching This method **does not** cache its result.
     */
    async getApplication(): Promise<Application> {
        return this.#manager.authRequest<RESTApplication>({
            method: "GET",
            path:   Routes.APPLICATION
        }).then(data => new Application(data, this.#manager.client));
    }

    /**
     * Get the currently authenticated bot's application info as a bare {@link ClientApplication | ClientApplication}.
     * @caching This method **does not** cache its result.
     */
    async getClientApplication(): Promise<ClientApplication> {
        return this.#manager.authRequest<RawClientApplication>({
            method: "GET",
            path:   Routes.APPLICATION
        }).then(data => new ClientApplication(data, this.#manager.client));
    }

    /**
     * Get the entitlements for an application.
     * @param applicationID The ID of the application to get the entitlements of.
     * @param options The options for getting the entitlements.
     */
    async getEntitlements(applicationID: string, options: SearchEntitlementsOptions = {}): Promise<Array<Entitlement | TestEntitlement>> {
        const query = new URLSearchParams();
        if (options.after !== undefined) query.set("after", options.after);
        if (options.before !== undefined) query.set("before", options.before);
        if (options.excludeEnded !== undefined) query.set("exclude_ended", String(options.excludeEnded));
        if (options.guildID !== undefined) query.set("guild_id", options.guildID);
        if (options.limit !== undefined) query.set("limit", String(options.limit));
        if (options.skuIDs !== undefined) query.set("sku_ids", options.skuIDs.join(","));
        if (options.userID !== undefined) query.set("subscription_id", options.userID);
        return this.#manager.authRequest<Array<RawEntitlement | RawTestEntitlement>>({
            method: "GET",
            path:   Routes.ENTITLEMENTS(applicationID),
            query
        }).then(data => data.map(d => "subscription_id" in d && d.subscription_id ? new Entitlement(d, this.#manager.client) : new TestEntitlement(d, this.#manager.client)));
    }

    /**
     * Get the SKUs for an application.
     * @param applicationID The ID of the application to get the SKUs of.
     */
    async getSKUs(applicationID: string): Promise<Array<SKU>> {
        return this.#manager.authRequest<Array<RawSKU>>({
            method: "GET",
            path:   Routes.SKUS(applicationID)
        }).then(data => data.map(d => ({
            accessType:     d.access_type,
            applicationID:  d.application_id,
            dependentSKUID: d.dependent_sku_id,
            features:       d.features,
            flags:          d.flags,
            id:             d.id,
            manifestLabels: d.manifest_labels,
            name:           d.name,
            releaseDate:    d.release_date,
            showAgeGate:    d.show_age_gate,
            slug:           d.slug,
            type:           d.type
        })));
    }

    /**
     * Get a sticker.
     * @param stickerID The ID of the sticker to get.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached, or if the sticker is not a guild sticker.
     * @caches {@link Guild#stickers | Guild#stickers}
     */
    async getSticker(stickerID: string): Promise<Sticker> {
        return this.#manager.authRequest<RawSticker>({
            method: "GET",
            path:   Routes.STICKER(stickerID)
        }).then(data => data.guild_id === undefined ? this.#manager.client.util.convertSticker(data) : this.#manager.client.guilds.get(data.guild_id)?.stickers.update(data) ?? this.#manager.client.util.convertSticker(data));
    }

    /**
     * Get the default sticker packs.
     * @caching This method **does not** cache its result.
     */
    async getStickerPacks(): Promise<Array<StickerPack>> {
        return this.#manager.authRequest<{ sticker_packs: Array<RawStickerPack>; }>({
            method: "GET",
            path:   Routes.STICKER_PACKS
        }).then(data => data.sticker_packs.map(pack => ({
            bannerAssetID:  pack.banner_asset_id,
            coverStickerID: pack.cover_sticker_id,
            description:    pack.description,
            id:             pack.id,
            name:           pack.name,
            skuID:          pack.sku_id,
            stickers:       pack.stickers.map(sticker => this.#manager.client.util.convertSticker(sticker))
        })));
    }

    /**
     * Get the list of usable voice regions.
     * @caching This method **does not** cache its result.
     */
    async getVoiceRegions(): Promise<Array<VoiceRegion>> {
        return this.#manager.authRequest<Array<VoiceRegion>>({
            method: "GET",
            path:   Routes.VOICE_REGIONS
        });
    }
}
