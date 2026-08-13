import type { RawGuildChannel } from "./channels";
import type * as Types from "./namespaced";
import type LobbyMessageStructure from "../structures/LobbyMessage";
import type { MessageTypes } from "../Constants";

export interface RawLobby {
    application_id: string;
    flags?: number;
    id: string;
    linked_channel?: RawGuildChannel;
    members: Array<RawLobbyMember>;
    metadata?: Record<string, string> | null;
}

export interface RawLobbyMember {
    additional_name?: string | null;
    flags?: number;
    id: string;
    metadata?: Record<string, string> | null;
}

export interface CreateLobbyOptions {
    flags?: number;
    idleTimeoutSeconds?: number;
    members?: Array<LobbyMemberOptions>;
    metadata?: Record<string, string> | null;
}

export interface LobbyMemberOptions {
    additionalName?: string | null;
    flags?: number | null;
    id: string;
    metadata?: Record<string, string> | null;
}

export interface EditLobbyOptions extends CreateLobbyOptions {}

export interface AddLobbyMemberOptions extends Omit<LobbyMemberOptions, "id"> {}

export interface JoinLobbyOptions {
    /** An optional access token to use instead of the client's token. This overrides the client's auth. */
    accessToken?: string;
    /** The lobby flags. */
    flags?: number;
    /** How long to wait (in seconds) before shutting down a lobby after it becomes idle. */
    idleTimeoutSeconds?: number;
    /** The metadata of the lobby. */
    lobbyMetadata?: Record<string, string> | null;
    /** The metadata of the current lobby member. */
    memberMetadata?: Record<string, string> | null;
    /** The lobby secret. */
    secret: string;
}

export interface BulkUpdateLobbyMemberOptions extends LobbyMemberOptions {
    /** Whether to remove the member from the lobby. */
    removeMember?: boolean;
}

export interface RawLobbyInvite {
    code: string;
}

export interface LobbyInvite {
    code: string;
}

export interface GetLobbyMessagesOptions {
    /** The maximum number of messages to get. */
    limit?: number;
}

export interface RawLobbyMessage {
    application_id: string;
    author: Types.Users.RawUser;
    channel_id: string;
    content: string;
    flags: number;
    id: string;
    lobby_id: string;
    lobby_member?: Pick<RawLobbyMember, "additional_name">;
    metadata?: Record<string, string> | null;
    moderation_metadata?: Record<string, string> | null;
    type: MessageTypes;
}

export interface LobbyMessageMember {
    additionalName?: string | null;
}

export interface CreateLobbyMessageOptions {
    /** The message content. Must be non-empty. */
    content: string;
    /** The message flags. Only flags creatable by the Social SDK are accepted. */
    flags?: number;
    /** Custom metadata for the message. */
    metadata?: Record<string, string> | null;
}

export type LobbyMessage = LobbyMessageStructure;
