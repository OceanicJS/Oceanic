/** @module LobbyMessage */
import Base from "./Base";
import type User from "./User";
import type Client from "../Client";
import type * as Types from "../types/namespaced";
import type { MessageTypes } from "../Constants";

export default class LobbyMessage extends Base {
    applicationID: string;
    author: User;
    channelID: string;
    content: string;
    flags: number;
    lobbyID: string;
    lobbyMember?: Types.Lobbies.LobbyMessageMember;
    metadata?: Record<string, string> | null;
    moderationMetadata?: Record<string, string> | null;
    type: MessageTypes;
    constructor(data: Types.Lobbies.RawLobbyMessage, client: Client) {
        super(data.id, client);
        this.applicationID = data.application_id;
        this.author = client.users.update(data.author);
        this.channelID = data.channel_id;
        this.content = data.content;
        this.flags = data.flags;
        this.lobbyID = data.lobby_id;
        this.lobbyMember = data.lobby_member ? {
            additionalName: data.lobby_member.additional_name
        } : undefined;
        this.metadata = data.metadata;
        this.moderationMetadata = data.moderation_metadata;
        this.type = data.type;
    }

    override toJSON(): Types.JSON.JSONLobbyMessage {
        return {
            ...super.toJSON(),
            applicationID:      this.applicationID,
            author:             this.author.toJSON(),
            channelID:          this.channelID,
            content:            this.content,
            flags:              this.flags,
            lobbyID:            this.lobbyID,
            lobbyMember:        this.lobbyMember,
            metadata:           this.metadata,
            moderationMetadata: this.moderationMetadata,
            type:               this.type
        };
    }
}
