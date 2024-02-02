/** @module REST/Miscellaneous */
import type Applications from "./Applications";
import * as Routes from "../util/Routes";
import type RESTManager from "../rest/RESTManager";
import type { RawSticker, RawStickerPack, Sticker, StickerPack } from "../types/guilds";
import type { VoiceRegion } from "../types/voice";

/** Methods that don't fit anywhere else. Located at {@link Client#rest | Client#rest}{@link RESTManager#misc | .misc}. */
export default class Miscellaneous {
    #manager: RESTManager;
    constructor(manager: RESTManager) {
        this.#manager = manager;
    }

    /** @deprecated Use {@link REST/Applications#createTestEntitlement | Application#createTestEntitlement} instead. This will be removed in `1.10.0`. */
    get createTestEntitlement(): Applications["createTestEntitlement"] {
        return this.#manager.applications.createTestEntitlement.bind(this.#manager.applications);
    }

    /** @deprecated Use {@link REST/Applications#deleteTestEntitlement | Application#deleteTestEntitlement} instead. This will be removed in `1.10.0`. */
    get deleteEntitlement(): Applications["deleteTestEntitlement"] {
        return this.#manager.applications.deleteTestEntitlement.bind(this.#manager.applications);
    }

    /** @deprecated Use {@link REST/Applications#getCurrent | Application#getCurrent} instead. This will be removed in `1.10.0`. */
    get getApplication(): Applications["getCurrent"] {
        return this.#manager.applications.getCurrent.bind(this.#manager.applications);
    }

    /** @deprecated Use {@link REST/Applications#getClient | Application#getClient} instead. This will be removed in `1.10.0`. */
    get getClientApplication(): Applications["getClient"] {
        return this.#manager.applications.getClient.bind(this.#manager.applications);
    }

    /** @deprecated Use {@link REST/Applications#getEntitlements | Application#getEntitlements} instead. This will be removed in `1.10.0`. */
    get getEntitlements(): Applications["getEntitlements"] {
        return this.#manager.applications.getEntitlements.bind(this.#manager.applications);
    }

    /** @deprecated Use {@link REST/Applications#getSKUs | Application#getSKUs} instead. This will be removed in `1.10.0`. */
    get getSKUs(): Applications["getSKUs"] {
        return this.#manager.applications.getSKUs.bind(this.#manager.applications);
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
