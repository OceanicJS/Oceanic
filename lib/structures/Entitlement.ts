import BaseEntitlement from "./BaseEntitlement";
import type * as Types from "../types/namespaced";
import type Client from "../Client";

/** Represents an entitlement. */
export default class Entitlement extends BaseEntitlement {
    endsAt: Date | null;
    startsAt: Date | null;
    subscriptionID: string;
    constructor(data: Types.Applications.RawEntitlement, client: Client) {
        super(data, client);
        this.endsAt = data.ends_at ? new Date(data.ends_at) : null;
        this.startsAt = data.starts_at ? new Date(data.starts_at) : null;
        this.subscriptionID = data.subscription_id;
    }

    override toJSON(): Types.JSON.JSONEntitlement {
        return {
            ...super.toJSON(),
            endsAt:         this.endsAt?.getTime() || null,
            startsAt:       this.startsAt?.getTime() || null,
            subscriptionID: this.subscriptionID
        };
    }
}
