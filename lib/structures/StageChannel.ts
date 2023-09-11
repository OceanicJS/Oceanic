/** @module StageChannel */
import type StageInstance from "./StageInstance.js";
import TextableVoiceChannel from "./TextableVoiceChannel.js";
import type { ChannelTypes } from "../Constants.js";
import type Client from "../Client.js";
import type { RawStageChannel } from "../types/channels.js";
import type { JSONStageChannel } from "../types/json.js";
import type { CreateStageInstanceOptions, EditStageInstanceOptions } from "../types/guilds.js";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

/** Represents a guild stage channel. */
export default class StageChannel extends TextableVoiceChannel<StageChannel> {
    declare type: ChannelTypes.GUILD_STAGE_VOICE;
    constructor(data: RawStageChannel, client: Client) {
        super(data, client);
    }

    /**
     * Create a stage instance on this channel.
     * @param options The options for creating the stage instance.
     */
    async createStageInstance(options: CreateStageInstanceOptions): Promise<StageInstance> {
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
    async editStageInstance(options: EditStageInstanceOptions): Promise<StageInstance> {
        return this.client.rest.channels.editStageInstance(this.id, options);
    }

    /**
     * Get the stage instance associated with this channel.
     */
    async getStageInstance(): Promise<StageInstance> {
        return this.client.rest.channels.getStageInstance(this.id);
    }

    override toJSON(): JSONStageChannel {
        return super.toJSON() as JSONStageChannel;
    }
}
