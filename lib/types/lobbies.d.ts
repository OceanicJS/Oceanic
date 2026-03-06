import type { RawGuildChannel } from "./channels";

export interface RawLobby {
    application_id: string;
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
    idleTimeoutSeconds?: number;
    members?: Array<LobbyMemberOptions>;
    metadata?: Record<string, string>;
}

export interface LobbyMemberOptions {
    flags?: number;
    id: string;
    metadata?: Record<string, string>;
}

export interface EditLobbyOptions extends CreateLobbyOptions {}

export interface AddLobbyMemberOptions extends Omit<LobbyMemberOptions, "id"> {}
