/** @module StageChannel */
import type StageInstance from "./StageInstance";
import TextableVoiceChannel from "./TextableVoiceChannel";
import type * as Types from "../types/namespaced";
import type { ChannelTypes } from "../Constants";
import type Client from "../Client";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

/** Represents a guild stage channel. */
export default class StageChannel extends TextableVoiceChannel<StageChannel> {
    declare type: ChannelTypes.GUILD_STAGE_VOICE;
    constructor(data: Types.Channels.RawStageChannel, client: Client) {
        super(data, client);
    }

    /**
     * Create a stage instance on this channel.
     * @param options The options for creating the stage instance.
     */
    async createStageInstance(options: Types.Guilds.CreateStageInstanceOptions): Promise<StageInstance> {
        return this.client.rest.channels.createStageInstance(this.id, options);
    }

    /**
     * Delete the stage instance on this channel.
     * @param reason The reason for deleting the stage instance.
     */
    async deleteStageInstance(reason?: string): Promise<void> {
        return this.client.rest.channels.deleteStageInstance(this.id, reason);
    }

    /**
     * Edit the stage instance on this channel.
     * @param options The options for editing the stage instance.
     */
    async editStageInstance(options: Types.Guilds.EditStageInstanceOptions): Promise<StageInstance> {
        return this.client.rest.channels.editStageInstance(this.id, options);
    }

    /**
     * Get the stage instance associated with this channel.
     */
    async getStageInstance(): Promise<StageInstance> {
        return this.client.rest.channels.getStageInstance(this.id);
    }

    override toJSON(): Types.JSON.JSONStageChannel {
        return super.toJSON() as Types.JSON.JSONStageChannel;
    }
}
