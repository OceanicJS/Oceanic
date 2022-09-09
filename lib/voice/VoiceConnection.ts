import { VoiceEvents } from "../types/events";
import TypedEmitter from "../util/TypedEmitter";

/** Represents a voice connection. See {@link types/events~VoiceEvents | Voice Events} for a list of events. */
export default class VoiceConnection extends TypedEmitter<VoiceEvents> {
    id: string;
    constructor(id: string) {
        super();
        this.id = id;
    }
}
