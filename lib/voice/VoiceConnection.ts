import type { VoiceEvents } from "../types/client";
import TypedEmitter from "../util/TypedEmitter";

export default class VoiceConnection extends TypedEmitter<VoiceEvents> {
    id: string;
    constructor(id: string) {
        super();
        this.id = id;
    }
}
