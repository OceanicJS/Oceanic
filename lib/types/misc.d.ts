/* eslint-disable @typescript-eslint/no-explicit-any */
/** @module Types/Miscellaneous */

import type Client from "../Client";
import type { EntitlementOwnerTypes, EntitlementTypes, SKUAccessTypes, SKUTypes } from "../Constants";

export type StringMap<T extends Record<string, any>> = { [K in keyof T]: `${T[K]}` };
export type ReverseMap<T extends Record<keyof T, keyof any>> = {
    [P in T[keyof T]]: {
        [K in keyof T]: T[K] extends P ? K : never
    }[keyof T]
};
export type AnyClass<T, I, E extends Array<unknown>> = new(data: T, client: Client, ...extra: E) => I;

export interface CreateTestEntitlementOptions {
    /** The ID of the owner of the test entitlement, a user or guild.*/
    ownerID: string;
    /** The type of the owner of the entitlement. */
    ownerType: EntitlementOwnerTypes;
    /** The ID of the SKU to create an entitlement for. */
    skuID: string;
}

export interface RawBaseEntitlement {
    application_id: string;
    consumed: boolean;
    deleted: boolean;
    gift_code_flags: number;
    guild_id: string | null;
    id: string;
    promotion_id: string | null;
    sku_id: string;
    type: EntitlementTypes;
    user_id: string | null;
}

export interface RawEntitlement extends RawBaseEntitlement {
    ends_at: string;
    starts_at: string;
    subscription_id: string;
}

export interface RawTestEntitlement extends RawBaseEntitlement {}

export interface SearchEntitlementsOptions {
    after?: string;
    before?: string;
    excludeEnded?: boolean;
    guildID?: string;
    limit?: number;
    skuIDs?: Array<string>;
    userID?: string;
}

export interface RawSKU {
    access_type: SKUAccessTypes; // undocumented, guessed
    application_id: string;
    dependent_sku_id: string | null;
    features: []; // undocumented
    flags: number;
    id: string;
    manifest_labels: null; // undocumented
    name: string;
    release_date: null; // undocumented
    show_age_gate: boolean;
    slug: string;
    type: SKUTypes;
}

export interface SKU {
    accessType: SKUAccessTypes;
    applicationID: string;
    dependentSKUID: string | null;
    features: []; // undocumented
    /** The flags for this SKU. See {@link Constants~SKUFlags | SKUFlags}. */
    flags: number;
    id: string;
    manifestLabels: null; // undocumented
    name: string;
    releaseDate: null; // undocumented
    showAgeGate: boolean;
    slug: string;
    type: SKUTypes;
}
