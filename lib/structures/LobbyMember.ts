/** @module LobbyMember */
import Base from "./Base";
import type Client from "../Client";
import type { RawLobbyMember } from "../types/lobbies";
import type { JSONLobbyMember } from "../types/json";

export default class LobbyMember extends Base {
    flags?: number;
    lobbyID: string;
    metadata?: Record<string, string> | null;
    constructor(data: RawLobbyMember, client: Client, lobbyID: string) {
        super(data.id, client);
        this.flags = data.flags;
        this.lobbyID = lobbyID;
        this.metadata = data.metadata;
    }

    /**
     * Remove this member from the lobby.
     */
    async remove(): Promise<void> {
        return this.client.rest.lobbies.removeMember(this.lobbyID, this.id);
    }

    override toJSON(): JSONLobbyMember {
        return {
            ...super.toJSON(),
            flags:    this.flags,
            lobbyID:  this.lobbyID,
            metadata: this.metadata
        };
    }
}
