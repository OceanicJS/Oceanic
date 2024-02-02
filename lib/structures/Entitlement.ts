import BaseEntitlement from "./BaseEntitlement";
import type { RawEntitlement } from "../types/applications";
import type Client from "../Client";
import type { JSONEntitlement } from "../types";

/** Represents an entitlement. */
export default class Entitlement extends BaseEntitlement {
    endsAt: Date;
    startsAt: Date;
    subscriptionID: string;
    constructor(data: RawEntitlement, client: Client) {
        super(data, client);
        this.endsAt = new Date(data.ends_at);
        this.startsAt = new Date(data.starts_at);
        this.subscriptionID = data.subscription_id;
    }

    override toJSON(): JSONEntitlement {
        return {
            ...super.toJSON(),
            endsAt:         this.endsAt.getTime(),
            startsAt:       this.startsAt.getTime(),
            subscriptionID: this.subscriptionID
        };
    }
}
