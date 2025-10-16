/** @module ModalSubmitInteractionComponentsWrapper */
import { mapRawToResolved } from "./shared";
import { WrapperError } from "../Errors";
import { ComponentTypes, type ModalComponentTypes } from "../../Constants";
import type {
    MessageComponentInteractionResolvedData,
    ModalSubmitChannelSelectComponent,
    ModalSubmitComponents,
    ModalSubmitComponentsActionRow,
    ModalSubmitComponentsLabel,
    ModalSubmitFileUploadComponent,
    ModalSubmitMentionableSelectComponent,
    ModalSubmitRoleSelectComponent,
    ModalSubmitStringSelectComponent,
    ModalSubmitTextInputComponent,
    ModalSubmitUserSelectComponent
} from "../../types/interactions";
import type Role from "../../structures/Role";
import type User from "../../structures/User";
import Collection from "../Collection";
import type InteractionResolvedChannel from "../../structures/InteractionResolvedChannel";
import type Attachment from "../../structures/Attachment";

/** A wrapper for interaction components. */
export default class ModalSubmitInteractionComponentsWrapper {
    /** The raw components from Discord.  */
    raw: Array<ModalSubmitComponentsActionRow | ModalSubmitComponentsLabel>;
    resolved: MessageComponentInteractionResolvedData;
    constructor(resolved: MessageComponentInteractionResolvedData, data: Array<ModalSubmitComponentsActionRow | ModalSubmitComponentsLabel>) {
        this.raw = data;
        this.resolved = resolved;
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
     * Get a channel select option.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getChannelSelectComponent(name: string, required?: false): ModalSubmitChannelSelectComponent | undefined;
    getChannelSelectComponent(name: string, required: true): ModalSubmitChannelSelectComponent;
    getChannelSelectComponent(name: string, required?: boolean): ModalSubmitChannelSelectComponent | undefined {
        return this._getComponent(name, required, ComponentTypes.CHANNEL_SELECT);
    }

    /**
     * Get the values of a channel select option. This always returns an array, since selects can be multi-choice.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getChannelSelectValues(name: string, required?: false): Array<InteractionResolvedChannel> | undefined;
    getChannelSelectValues(name: string, required: true): Array<InteractionResolvedChannel>;
    getChannelSelectValues(name: string, required?: boolean): Array<InteractionResolvedChannel> | undefined {
        const component = this.getChannelSelectComponent(name, required as false);
        return component?.values && mapRawToResolved("channel", component.values, this.resolved.channels, false);
    }

    /** Get the components in this interaction. */
    getComponents(): Array<ModalSubmitComponents> {
        return this.raw.flatMap(r => r.type === ComponentTypes.ACTION_ROW ? r.components : r.component).filter(Boolean);
    }

    getFileUploadComponent(name: string, required?: false): ModalSubmitFileUploadComponent | undefined;
    getFileUploadComponent(name: string, required: true): ModalSubmitFileUploadComponent;
    getFileUploadComponent(name: string, required?: boolean): ModalSubmitFileUploadComponent | undefined {
        return this._getComponent(name, required, ComponentTypes.FILE_UPLOAD);
    }

    getFileUploadValues(name: string, required?: false): Array<Attachment> | undefined;
    getFileUploadValues(name: string, required: true): Array<Attachment>;
    getFileUploadValues(name: string, required?: boolean): Array<Attachment> | undefined {
        const component = this.getFileUploadComponent(name, required as false);
        return component?.values && mapRawToResolved("attachment", component.values, this.resolved.attachments, false);
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
     * Get the values of a mentionable select option. This always returns an array, since selects can be multi-choice.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getMentionableSelectValues(name: string, required?: false): Array<User | Role> | undefined;
    getMentionableSelectValues(name: string, required: true): Array<User | Role>;
    getMentionableSelectValues(name: string, required?: boolean): Array<User | Role> | undefined {
        const component = this.getMentionableSelectComponent(name, required as false);
        return component?.values && mapRawToResolved("mentionable", component.values, new Collection<string, User | Role>([...this.resolved.users, ...this.resolved.roles]), false);
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
     * Get the values of a role select option. This always returns an array, since selects can be multi-choice.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getRoleSelectValues(name: string, required?: false): Array<Role> | undefined;
    getRoleSelectValues(name: string, required: true): Array<Role>;
    getRoleSelectValues(name: string, required?: boolean): Array<Role> | undefined {
        const component = this.getRoleSelectComponent(name, required as false);
        return component?.values && mapRawToResolved("role", component.values, this.resolved.roles, false);
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
     * Get the values of a string select option. This always returns an array, since selects can be multi-choice.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getStringSelectValues<T extends Array<string> = Array<string>>(name: string, required?: false): T | undefined;
    getStringSelectValues<T extends Array<string> = Array<string>>(name: string, required: true): T;
    getStringSelectValues(name: string, required?: boolean): Array<string> | undefined {
        return this.getStringSelectComponent(name, required as false)?.values;
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
     * Get a user select option.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getUserSelectComponent(name: string, required?: false): ModalSubmitUserSelectComponent | undefined;
    getUserSelectComponent(name: string, required: true): ModalSubmitUserSelectComponent;
    getUserSelectComponent(name: string, required?: boolean): ModalSubmitUserSelectComponent | undefined {
        return this._getComponent(name, required, ComponentTypes.USER_SELECT);
    }

    /**
     * Get the values of a user select option. This always returns an array, since selects can be multi-choice.
     * @param name The name of the option.
     * @param required If true, an error will be thrown if the option is not present.
     */
    getUserSelectValues(name: string, required?: false): Array<User> | undefined;
    getUserSelectValues(name: string, required: true): Array<User>;
    getUserSelectValues(name: string, required?: boolean): Array<User> | undefined {
        const component = this.getUserSelectComponent(name, required as false);
        return component?.values && mapRawToResolved("user", component.values, this.resolved.users, false);
    }
}
