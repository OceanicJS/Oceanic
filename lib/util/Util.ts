import { ButtonStyles, ComponentTypes } from "../Constants";
import type { MessageActionRow, ModalActionRow } from "../types";

export default class Util {
    static formatComponents(components: Array<ModalActionRow> | Array<MessageActionRow>) {
        return components.map(row => ({
            type:       row.type,
            components: row.components.map(component => {
                if (component.type === ComponentTypes.BUTTON) {
                    if (component.style === ButtonStyles.LINK) return component;
                    else return {
                        custom_id: component.customID,
                        disabled:  component.disabled,
                        emoji:     component.emoji,
                        label:     component.label,
                        style:     component.style,
                        type:      component.type
                    };
                } else if (component.type === ComponentTypes.SELECT_MENU) {
                    return {
                        custom_id:   component.customID,
                        disabled:    component.disabled,
                        max_values:  component.maxValues,
                        min_values:  component.minValues,
                        options:     component.options,
                        placeholder: component.placeholder,
                        type:        component.type
                    };
                } else if (component.type === ComponentTypes.TEXT_INPUT) {
                    return {
                        custom_id:   component.customID,
                        label:       component.label,
                        max_length:  component.maxLength,
                        min_length:  component.minLength,
                        placeholder: component.placeholder,
                        required:    component.required,
                        style:       component.style,
                        type:        component.type,
                        value:       component.value
                    };
                }
            })
        }));
    }
}
