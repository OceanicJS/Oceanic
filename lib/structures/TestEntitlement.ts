import BaseEntitlement from "./BaseEntitlement";
import type { RawTestEntitlement } from "../types/misc";
import type Client from "../Client";
import type { JSONTestEntitlement } from "../types";

/** Represents a test entitlement. */
export default class TestEntitlement extends BaseEntitlement {
    constructor(data: RawTestEntitlement, client: Client) {
        super(data, client);
    }

    /** Delete this entitlement. */
    async delete(): Promise<void> {
        return this.client.rest.misc.deleteEntitlement(this.applicationID, this.id);
    }

    override toJSON(): JSONTestEntitlement {
        return {
            ...super.toJSON()
        };
    }
}
