import Base from "./Base";
import type TestEntitlement from "./TestEntitlement";
import type Entitlement from "./Entitlement";
import type Client from "../Client";
import type { EntitlementOwnerTypes, SKUAccessTypes, SKUTypes } from "../Constants";
import type { RawSKU, SearchEntitlementsOptions } from "../types/misc";

export default class SKU extends Base {
    accessType: SKUAccessTypes;
    applicationID: string;
    dependentSKUID: string | null;
    features: []; // undocumented
    /** The flags for this SKU. See {@link Constants~SKUFlags | SKUFlags}. */
    flags: number;
    manifestLabels: null; // undocumented
    name: string;
    releaseDate: null; // undocumented
    showAgeGate: boolean;
    slug: string;
    type: SKUTypes;
    constructor(data: RawSKU, client: Client) {
        super(data.id, client);
        this.accessType = data.access_type;
        this.applicationID = data.application_id;
        this.dependentSKUID = data.dependent_sku_id;
        this.features = data.features;
        this.flags = data.flags;
        this.manifestLabels = data.manifest_labels;
        this.name = data.name;
        this.releaseDate = data.release_date;
        this.showAgeGate = data.show_age_gate;
        this.slug = data.slug;
        this.type = data.type;
    }

    /**
     * Create a test entitlement for this SKU.
     * @param ownerType The type of the owner to create the entitlement for.
     * @param ownerID The ID of the owner to create the entitlement for.
     */
    async createTestEntitlement(ownerType: EntitlementOwnerTypes, ownerID: string): Promise<TestEntitlement> {
        return this.client.rest.misc.createTestEntitlement(this.applicationID, {
            ownerID,
            ownerType,
            skuID: this.id
        });
    }

    /**
     * Get the entitlements for this SKU.
     * @param options The options for getting the entitlements.
     */
    async getEntitlements(options?: Omit<SearchEntitlementsOptions, "skuIDs">): Promise<Array<Entitlement | TestEntitlement>> {
        return this.client.rest.misc.getEntitlements(this.applicationID, { skuIDs: [this.id], ...options });
    }
}
