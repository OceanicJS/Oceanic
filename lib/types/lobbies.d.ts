import type { RawGuildChannel } from "./channels";
import type * as Types from "./namespaced";
import type Message from "../structures/Message";

export interface RawLobby {
    application_id: string;
    flags?: number;
    id: string;
    linked_channel?: RawGuildChannel;
    members: Array<RawLobbyMember>;
    metadata?: Record<string, string> | null;
}

export interface RawLobbyMember {
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

export interface CreateLobbyMessageOptions extends Types.Channels.CreateMessageOptions {
    /** Custom metadata for the message. */
    metadata?: Record<string, string>;
}

export type LobbyMessage = Message<Types.Shared.Uncached>;
