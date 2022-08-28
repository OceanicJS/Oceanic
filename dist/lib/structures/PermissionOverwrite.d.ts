import Base from "./Base";
import Permission from "./Permission";
import type { OverwriteTypes, Permission as PermissionNames } from "../Constants";
import type Client from "../Client";
import type { RawOverwrite } from "../types/channels";
import type { JSONPermissionOverwrite } from "../types/json";
export default class PermissionOverwrite extends Base {
    /** The permissions of this overwrite. */
    permission: Permission;
    /** The type of this overwrite. `0` for role, `1` for user. */
    type: OverwriteTypes;
    constructor(data: RawOverwrite, client: Client);
    /** A key-value map of permission to if it's been allowed or denied (not present if neither) */
    get json(): Record<"CREATE_INSTANT_INVITE" | "KICK_MEMBERS" | "BAN_MEMBERS" | "ADMINISTRATOR" | "MANAGE_CHANNELS" | "MANAGE_GUILD" | "ADD_REACTIONS" | "VIEW_AUDIT_LOG" | "PRIORITY_SPEAKER" | "STREAM" | "VIEW_CHANNEL" | "SEND_MESSAGES" | "SEND_TTS_MESSAGES" | "MANAGE_MESSAGES" | "EMBED_LINKS" | "ATTACH_FILES" | "READ_MESSAGE_HISTORY" | "MENTION_EVERYONE" | "USE_EXTERNAL_EMOJIS" | "VIEW_GUILD_INSIGHTS" | "CONNECT" | "SPEAK" | "MUTE_MEMBERS" | "DEAFEN_MEMBERS" | "MOVE_MEMBERS" | "USE_VAD" | "CHANGE_NICKNAME" | "MANAGE_NICKNAMES" | "MANAGE_ROLES" | "MANAGE_WEBHOOKS" | "MANAGE_EMOJIS_AND_STICKERS" | "USE_APPLICATION_COMMANDS" | "REQUEST_TO_SPEAK" | "MANAGE_EVENTS" | "MANAGE_THREADS" | "CREATE_PUBLIC_THREADS" | "CREATE_PRIVATE_THREADS" | "USE_EXTERNAL_STICKERS" | "SEND_MESSAGES_IN_THREADS" | "USE_EMBEDDED_ACTIVITIES" | "MODERATE_MEMBERS" | "VIEW_CREATOR_MONETIZATION_ANALYTICS", boolean>;
    /**
     *Check if this permissions instance has the given permissions allowed
     *
     * @param {...PermissionNames} permissions - The permissions to check for.
     * @returns {Boolean}
     */
    has(...permissions: Array<PermissionNames>): boolean;
    toJSON(): JSONPermissionOverwrite;
}
