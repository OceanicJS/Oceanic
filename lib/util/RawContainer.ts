/** @module RawContainer */
import type { RawModalActionRow, RawMessageActionRow, RawEmbedOptions } from "../types/channels";

export type RawContainerData = RawEmbedOptions | RawModalActionRow | RawMessageActionRow;
export type RawEmbedsContainer = RawContainer<RawEmbedOptions>;
export type RawComponentsContainer<T extends RawMessageActionRow | RawModalActionRow = RawMessageActionRow | RawModalActionRow> = RawContainer<T>;
/** A container for raw data, such as {@link Types/Channels~RawEmbedOptions | embeds}, {@link Types/Channels~RawMessageActionRow | components}, or {@link Types/Channels~RawModalActionRow | modals}. */
export default class RawContainer<D extends RawContainerData> {
    private data: D;
    constructor(data: D) {
        this.data = data;
    }

    get(): D {
        return this.data;
    }
}
