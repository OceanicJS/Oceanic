/** @module ModalSubmitInteractionComponentsWrapper */
import { WrapperError } from "../Errors";
import { ComponentTypes, type ModalComponentTypes } from "../../Constants";
import type { ModalSubmitComponents, ModalSubmitComponentsActionRow, ModalSubmitTextInputComponent } from "../../types/interactions";

/** A wrapper for interaction components. */
export default class ModalSubmitInteractionComponentsWrapper {
    /** The raw components from Discord.  */
    raw: Array<ModalSubmitComponentsActionRow>;
    constructor(data: Array<ModalSubmitComponentsActionRow>) {
        this.raw = data;
    }

    private _getComponent<T extends ModalSubmitComponents = ModalSubmitComponents>(customID: string, required = false, type: ModalComponentTypes): T | undefined {
        const opt = this.getComponents().find(o => o.customID === customID && o.type === type) as T | undefined;
        if (!opt && required) {
            throw new WrapperError(`Missing required component: ${customID}`);
        } else {
            return opt;
        }
    }

    /** Get the components in this interaction. */
    getComponents(): Array<ModalSubmitComponents> {
        return this.raw.reduce((a, b) => a.concat(...b.components), [] as Array<ModalSubmitComponents>);
    }

    /**
     * Get a string option value.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getTextInput<T extends string = string>(name: string, required?: false): T | undefined;
    getTextInput<T extends string = string>(name: string, required: true): T;
    getTextInput(name: string, required?: boolean): string | undefined {
        return this.getTextInputComponent(name, required as false)?.value;
    }

    /**
     * Get a string option.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getTextInputComponent(name: string, required?: false): ModalSubmitTextInputComponent | undefined;
    getTextInputComponent(name: string, required: true): ModalSubmitTextInputComponent;
    getTextInputComponent(name: string, required?: boolean): ModalSubmitTextInputComponent | undefined {
        return this._getComponent(name, required, ComponentTypes.TEXT_INPUT);
    }
}
