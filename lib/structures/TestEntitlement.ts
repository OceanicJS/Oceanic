import BaseEntitlement from "./BaseEntitlement";
import type * as Types from "../types/namespaced";
import type Client from "../Client";

/** Represents a test entitlement. */
export default class TestEntitlement extends BaseEntitlement {
    constructor(data: Types.Applications.RawTestEntitlement, client: Client) {
        super(data, client);
    }

    /** Delete this entitlement. */
    async delete(): Promise<void> {
        return this.client.rest.applications.deleteTestEntitlement(this.applicationID, this.id);
    }

    override toJSON(): Types.JSON.JSONTestEntitlement {
        return {
            ...super.toJSON()
        };
    }
}
