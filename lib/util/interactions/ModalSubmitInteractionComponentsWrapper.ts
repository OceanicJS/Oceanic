/** @module ModalSubmitInteractionComponentsWrapper */
import { WrapperError } from "../Errors";
import { ComponentTypes, type ModalComponentTypes } from "../../Constants";
import type {
    ModalSubmitChannelSelectComponent,
    ModalSubmitComponents,
    ModalSubmitComponentsActionRow,
    ModalSubmitComponentsLabel,
    ModalSubmitMentionableSelectComponent,
    ModalSubmitRoleSelectComponent,
    ModalSubmitStringSelectComponent,
    ModalSubmitTextInputComponent,
    ModalSubmitUserSelectComponent
} from "../../types/interactions";

/** A wrapper for interaction components. */
export default class ModalSubmitInteractionComponentsWrapper {
    /** The raw components from Discord.  */
    raw: Array<ModalSubmitComponentsActionRow | ModalSubmitComponentsLabel>;
    constructor(data: Array<ModalSubmitComponentsActionRow | ModalSubmitComponentsLabel>) {
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

    /**
     * Get the values of a channel select option. This always returns an array, since selects can be multi-choice.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getChannelSelect<T extends Array<string> = Array<string>>(name: string, required?: false): T | undefined;
    getChannelSelect<T extends Array<string> = Array<string>>(name: string, required: true): T;
    getChannelSelect(name: string, required?: boolean): Array<string> | undefined {
        return this.getChannelSelectComponent(name, required as false)?.values;
    }

    /**
     * Get a channel select option.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getChannelSelectComponent(name: string, required?: false): ModalSubmitChannelSelectComponent | undefined;
    getChannelSelectComponent(name: string, required: true): ModalSubmitChannelSelectComponent;
    getChannelSelectComponent(name: string, required?: boolean): ModalSubmitChannelSelectComponent | undefined {
        return this._getComponent(name, required, ComponentTypes.CHANNEL_SELECT);
    }

    /** Get the components in this interaction. */
    getComponents(): Array<ModalSubmitComponents> {
        return this.raw.reduce((a, b) => a.concat(...(b.type === ComponentTypes.ACTION_ROW ? b.components : [b.component])), [] as Array<ModalSubmitComponents>).filter(Boolean);
    }

    /**
     * Get the values of a mentionable select option. This always returns an array, since selects can be multi-choice.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getMentionableSelect<T extends Array<string> = Array<string>>(name: string, required?: false): T | undefined;
    getMentionableSelect<T extends Array<string> = Array<string>>(name: string, required: true): T;
    getMentionableSelect(name: string, required?: boolean): Array<string> | undefined {
        return this.getMentionableSelectComponent(name, required as false)?.values;
    }

    /**
     * Get a mentionable select option.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getMentionableSelectComponent(name: string, required?: false): ModalSubmitMentionableSelectComponent | undefined;
    getMentionableSelectComponent(name: string, required: true): ModalSubmitMentionableSelectComponent;
    getMentionableSelectComponent(name: string, required?: boolean): ModalSubmitMentionableSelectComponent | undefined {
        return this._getComponent(name, required, ComponentTypes.MENTIONABLE_SELECT);
    }

    /**
     * Get the values of a role select option. This always returns an array, since selects can be multi-choice.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getRoleSelect<T extends Array<string> = Array<string>>(name: string, required?: false): T | undefined;
    getRoleSelect<T extends Array<string> = Array<string>>(name: string, required: true): T;
    getRoleSelect(name: string, required?: boolean): Array<string> | undefined {
        return this.getRoleSelectComponent(name, required as false)?.values;
    }

    /**
     * Get a role select option.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getRoleSelectComponent(name: string, required?: false): ModalSubmitRoleSelectComponent | undefined;
    getRoleSelectComponent(name: string, required: true): ModalSubmitRoleSelectComponent;
    getRoleSelectComponent(name: string, required?: boolean): ModalSubmitRoleSelectComponent | undefined {
        return this._getComponent(name, required, ComponentTypes.ROLE_SELECT);
    }

    /**
     * Get the values of a string select option. This always returns an array, since selects can be multi-choice.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getStringSelect<T extends Array<string> = Array<string>>(name: string, required?: false): T | undefined;
    getStringSelect<T extends Array<string> = Array<string>>(name: string, required: true): T;
    getStringSelect(name: string, required?: boolean): Array<string> | undefined {
        return this.getStringSelectComponent(name, required as false)?.values;
    }

    /**
     * Get a string select option.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getStringSelectComponent(name: string, required?: false): ModalSubmitStringSelectComponent | undefined;
    getStringSelectComponent(name: string, required: true): ModalSubmitStringSelectComponent;
    getStringSelectComponent(name: string, required?: boolean): ModalSubmitStringSelectComponent | undefined {
        return this._getComponent(name, required, ComponentTypes.STRING_SELECT);
    }

    /**
     * Get a text input option value.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getTextInput<T extends string = string>(name: string, required?: false): T | undefined;
    getTextInput<T extends string = string>(name: string, required: true): T;
    getTextInput(name: string, required?: boolean): string | undefined {
        return this.getTextInputComponent(name, required as false)?.value;
    }

    /**
     * Get a text input option.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getTextInputComponent(name: string, required?: false): ModalSubmitTextInputComponent | undefined;
    getTextInputComponent(name: string, required: true): ModalSubmitTextInputComponent;
    getTextInputComponent(name: string, required?: boolean): ModalSubmitTextInputComponent | undefined {
        return this._getComponent(name, required, ComponentTypes.TEXT_INPUT);
    }

    /**
     * Get the values of a user select option. This always returns an array, since selects can be multi-choice.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getUserSelect<T extends Array<string> = Array<string>>(name: string, required?: false): T | undefined;
    getUserSelect<T extends Array<string> = Array<string>>(name: string, required: true): T;
    getUserSelect(name: string, required?: boolean): Array<string> | undefined {
        return this.getUserSelectComponent(name, required as false)?.values;
    }

    /**
     * Get a user select option.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getUserSelectComponent(name: string, required?: false): ModalSubmitUserSelectComponent | undefined;
    getUserSelectComponent(name: string, required: true): ModalSubmitUserSelectComponent;
    getUserSelectComponent(name: string, required?: boolean): ModalSubmitUserSelectComponent | undefined {
        return this._getComponent(name, required, ComponentTypes.USER_SELECT);
    }
}
