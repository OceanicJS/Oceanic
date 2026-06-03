/** @module Interaction */
import Base from "./Base";
import type ClientApplication from "./ClientApplication";
import type ICommandInteraction from "./CommandInteraction";
import type IModalSubmitInteraction from "./ModalSubmitInteraction";
import type IPingInteraction from "./PingInteraction";
import type IComponentInteraction from "./ComponentInteraction";
import type IAutocompleteInteraction from "./AutocompleteInteraction";
import type * as Types from "../types/namespaced";
import type Client from "../Client";
import { InteractionTypes } from "../Constants";

let PingInteraction: typeof import("./PingInteraction").default,
    CommandInteraction: typeof import("./CommandInteraction").default,
    ComponentInteraction: typeof import("./ComponentInteraction").default,
    AutocompleteInteraction: typeof import("./AutocompleteInteraction").default,
    ModalSubmitInteraction: typeof import("./ModalSubmitInteraction").default;

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
    constructor(data: Types.Interactions.AnyRawInteraction, client: Client) {
        super(data.id, client);
        this.acknowledged = false;
        this.application = client["_application"] && client.application.id === data.application_id ? client.application : undefined;
        this.applicationID = data.application_id;
        Object.defineProperty(this, "token", { value: data.token, enumerable: false });
        this.type = data.type;
        this.version = data.version;
    }


    static async from<T extends Types.Interactions.AnyInteraction = Types.Interactions.AnyInteraction>(data: Types.Interactions.RawInteraction, client: Client): Promise<T> {
        switch (data.type) {
            case InteractionTypes.PING: {
                PingInteraction ??= await import("./PingInteraction").then(m => m.default);
                return new PingInteraction(data, client) as T;
            }

            case InteractionTypes.APPLICATION_COMMAND: {
                CommandInteraction ??= await import("./CommandInteraction").then(m => m.default);
                return new CommandInteraction(data as Types.Interactions.RawApplicationCommandInteraction, client) as T;
            }

            case InteractionTypes.MESSAGE_COMPONENT: {
                ComponentInteraction ??= await import("./ComponentInteraction").then(m => m.default);
                return new ComponentInteraction(data as Types.Interactions.RawMessageComponentInteraction, client) as T;
            }

            case InteractionTypes.APPLICATION_COMMAND_AUTOCOMPLETE: {
                AutocompleteInteraction ??= await import("./AutocompleteInteraction").then(m => m.default);
                return new AutocompleteInteraction(data as Types.Interactions.RawAutocompleteInteraction, client) as T;
            }

            case InteractionTypes.MODAL_SUBMIT: {
                ModalSubmitInteraction ??= await import("./ModalSubmitInteraction").then(m => m.default);
                return new ModalSubmitInteraction(data as Types.Interactions.RawModalSubmitInteraction, client) as T;
            }

            default: return new Interaction(data, client) as never;
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

    override toJSON(): Types.JSON.JSONInteraction {
        return {
            ...super.toJSON(),
            applicationID: this.applicationID,
            type:          this.type,
            version:       this.version
        };
    }
}
