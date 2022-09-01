import Guild from "./Guild";
import type GuildScheduledEvent from "./GuildScheduledEvent";
import type User from "./User";
import PartialApplication from "./PartialApplication";
import type { InviteChannel, InviteInfoTypes, InviteStageInstance, PartialInviteChannel, RawInvite, RawInviteWithMetadata } from "../types/channels";
import type Client from "../Client";
import type { InviteTargetTypes } from "../Constants";
import type { JSONInvite } from "../types/json";
/** Represents an invite. */
export default class Invite<T extends InviteInfoTypes = "withMetadata", CH extends InviteChannel = InviteChannel> {
    /** The approximate number of total members in the guild this invite leads to. */
    approximateMemberCount?: number;
    /** The approximate number of online members in the guild this invite leads to. */
    approximatePresenceCount?: number;
    /** The channel this invite leads to. */
    channel?: CH | PartialInviteChannel;
    client: Client;
    /** The code of this invite. */
    code: string;
    /** When this invite was created. */
    createdAt: T extends "withMetadata" ? Date : undefined;
    /** The date at which this invite expires. */
    expiresAt?: T extends "withMetadata" | "withoutExpiration" ? never : Date;
    /** The guild this invite leads to. */
    guild?: Guild;
    /** The scheduled event associated with this invite. */
    guildScheduledEvent?: GuildScheduledEvent;
    /** The user that created this invite. */
    inviter?: User;
    /** The time after which this invite expires. */
    maxAge: T extends "withMetadata" ? number : never;
    /** The maximum number of times this invite can be used, */
    maxUses: T extends "withMetadata" ? number : never;
    /** @deprecated The stage instance in the invite this channel is for (deprecated). */
    stageInstance?: InviteStageInstance;
    /** The embedded application this invite will open. */
    targetApplication?: PartialApplication;
    /** The [target type](https://discord.com/developers/docs/resources/invite#invite-object-invite-target-types) of this invite. */
    targetType?: InviteTargetTypes;
    /** The user whose stream to display for this voice channel stream invite. */
    targetUser?: User;
    /** If this invite only grants temporary membership. */
    temporary: T extends "withMetadata" ? boolean : never;
    /** The number of times this invite has been used. */
    uses: T extends "withMetadata" ? number : never;
    constructor(data: RawInvite | RawInviteWithMetadata, client: Client);
    protected update(data: Partial<RawInvite> | Partial<RawInviteWithMetadata>): void;
    /**
     * Delete this invite.
     * @param reason The reason for deleting this invite.
     */
    deleteInvite(reason?: string): Promise<Invite<"withMetadata", CH>>;
    toJSON(): JSONInvite;
}
