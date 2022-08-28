import { ButtonStyles, ComponentTypes } from "../Constants";
import type { MessageActionRow, ModalActionRow } from "../types";
export default class Util {
    static formatComponents(components: Array<ModalActionRow> | Array<MessageActionRow>): {
        type: ComponentTypes.ACTION_ROW;
        components: (import("../types").URLButton | {
            custom_id: string;
            disabled: boolean | undefined;
            emoji: import("../types").PartialEmoji | undefined;
            label: string | undefined;
            style: ButtonStyles.PRIMARY | ButtonStyles.SECONDARY | ButtonStyles.SUCCESS | ButtonStyles.DANGER;
            type: ComponentTypes.BUTTON;
            max_values?: undefined;
            min_values?: undefined;
            options?: undefined;
            placeholder?: undefined;
            max_length?: undefined;
            min_length?: undefined;
            required?: undefined;
            value?: undefined;
        } | {
            custom_id: string;
            disabled: boolean | undefined;
            max_values: number | undefined;
            min_values: number | undefined;
            options: import("../types").SelectOption[];
            placeholder: string | undefined;
            type: ComponentTypes.SELECT_MENU;
            emoji?: undefined;
            label?: undefined;
            style?: undefined;
            max_length?: undefined;
            min_length?: undefined;
            required?: undefined;
            value?: undefined;
        } | {
            custom_id: string;
            label: string;
            max_length: boolean | undefined;
            min_length: number | undefined;
            placeholder: string | undefined;
            required: boolean | undefined;
            style: import("../Constants").TextInputStyles;
            type: ComponentTypes.TEXT_INPUT;
            value: string | undefined;
            disabled?: undefined;
            emoji?: undefined;
            max_values?: undefined;
            min_values?: undefined;
            options?: undefined;
        } | undefined)[];
    }[];
}
