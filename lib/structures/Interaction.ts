/** @module Interaction */
import Base from "./Base";
import type ClientApplication from "./ClientApplication";
import type ICommandInteraction from "./CommandInteraction";
import type IModalSubmitInteraction from "./ModalSubmitInteraction";
import type IPingInteraction from "./PingInteraction";
import type IComponentInteraction from "./ComponentInteraction";
import type IAutocompleteInteraction from "./AutocompleteInteraction";
import type Client from "../Client";
import type {
    AnyInteraction,
    AnyRawInteraction,
    RawApplicationCommandInteraction,
    RawAutocompleteInteraction,
    RawInteraction,
    RawMessageComponentInteraction,
    RawModalSubmitInteraction
} from "../types/interactions";
import { InteractionTypes } from "../Constants";
import type { JSONInteraction } from "../types/json";


/** Represents an interaction. */
export default class Interaction extends Base {
    /** If this interaction has been acknowledged. */
    acknowledged: boolean;
    /** The application this interaction is for. */
    application?: ClientApplication;
    /** The ID of the application this interaction is for. */
    applicationID: string;
    /** The token of this interaction. */
    token!: string;
    /** The [type](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-type) of this interaction. */
    type: InteractionTypes;
    /** Read-only property, always `1` */
    version: 1;
    constructor(data: AnyRawInteraction, client: Client) {
        super(data.id, client);
        this.acknowledged = false;
        this.application = client["_application"] && client.application.id === data.application_id ? client.application : undefined;
        this.applicationID = data.application_id;
        Object.defineProperty(this, "token", { value: data.token, enumerable: false });
        this.type = data.type;
        this.version = data.version;
    }


    static from<T extends AnyInteraction = AnyInteraction>(data: RawInteraction, client: Client): T {
        switch (data.type) {
            case InteractionTypes.PING: {
                return new PingInteraction(data, client) as T;
            }
            case InteractionTypes.APPLICATION_COMMAND: {
                return new CommandInteraction(data as RawApplicationCommandInteraction, client) as T;
            }
            case InteractionTypes.MESSAGE_COMPONENT: {
                return new ComponentInteraction(data as RawMessageComponentInteraction, client) as T;
            }
            case InteractionTypes.APPLICATION_COMMAND_AUTOCOMPLETE: {
                return new AutocompleteInteraction(data as RawAutocompleteInteraction, client) as T;
            }
            case InteractionTypes.MODAL_SUBMIT: {
                return new ModalSubmitInteraction(data as RawModalSubmitInteraction, client) as T;
            }
            default: {
                return new Interaction(data, client) as never;
            }
        }
    }

    /** A type guard, checking if this interaction is an {@link AutocompleteInteraction | Autocomplete Interaction}. */
    isAutocompleteInteraction(): this is IAutocompleteInteraction {
        return this.type === InteractionTypes.APPLICATION_COMMAND_AUTOCOMPLETE;
    }

    /** A type guard, checking if this interaction is a {@link CommandInteraction | Command Interaction}. */
    isCommandInteraction(): this is ICommandInteraction {
        return this.type === InteractionTypes.APPLICATION_COMMAND;
    }

    /** A type guard, checking if this interaction is a {@link ComponentInteraction | Component Interaction}. */
    isComponentInteraction(): this is IComponentInteraction {
        return this.type === InteractionTypes.MESSAGE_COMPONENT;
    }

    /** A type guard, checking if this interaction is a {@link ModalSubmitInteraction | Modal Submit Interaction}. */
    isModalSubmitInteraction(): this is IModalSubmitInteraction {
        return this.type === InteractionTypes.MODAL_SUBMIT;
    }

    /** A type guard, checking if this interaction is a {@link PingInteraction | Ping Interaction}. */
    isPingInteraction(): this is IPingInteraction {
        return this.type === InteractionTypes.PING;
    }

    override toJSON(): JSONInteraction {
        return {
            ...super.toJSON(),
            applicationID: this.applicationID,
            type:          this.type,
            version:       this.version
        };
    }
}


// Yes this sucks, but it works. That's the important part. Circular imports are hell.
/* eslint-disable @typescript-eslint/no-var-requires, unicorn/prefer-module */
const AutocompleteInteraction = (require("./AutocompleteInteraction") as typeof import("./AutocompleteInteraction")).default;
const CommandInteraction = (require("./CommandInteraction") as typeof import("./CommandInteraction")).default;
const ComponentInteraction = (require("./ComponentInteraction") as typeof import("./ComponentInteraction")).default;
const ModalSubmitInteraction = (require("./ModalSubmitInteraction") as typeof import("./ModalSubmitInteraction")).default;
const PingInteraction = (require("./PingInteraction") as typeof import("./PingInteraction")).default;
/* eslint-enable @typescript-eslint/no-var-requires, unicorn/prefer-module */
