/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ComponentTypes, type ModalComponentTypes } from "../../Constants";
import type * as Types from "../../types/namespaced";

const FROM_RAW: { [K in ComponentTypes.ACTION_ROW | ComponentTypes.LABEL | ModalComponentTypes]: (input: Types.Interactions.RawModalSubmitComponentTypeMap[K]) => Types.Interactions.ModalSubmitComponentTypeMap[K] } = {
    [ComponentTypes.ACTION_ROW]: component => ({
        components: component.components.map(c => fromRaw(c) as never),
        id:         component.id,
        type:       component.type
    }),
    [ComponentTypes.STRING_SELECT]: component => ({
        customID: component.custom_id,
        id:       component.id,
        type:     component.type,
        values:   component.values
    }),
    [ComponentTypes.TEXT_INPUT]: component => ({
        customID: component.custom_id,
        id:       component.id,
        type:     component.type,
        value:    component.value
    }),
    [ComponentTypes.USER_SELECT]: component => ({
        customID: component.custom_id,
        id:       component.id,
        type:     component.type,
        values:   component.values
    }),
    [ComponentTypes.ROLE_SELECT]: component => ({
        customID: component.custom_id,
        id:       component.id,
        type:     component.type,
        values:   component.values
    }),
    [ComponentTypes.MENTIONABLE_SELECT]: component => ({
        customID: component.custom_id,
        id:       component.id,
        type:     component.type,
        values:   component.values
    }),
    [ComponentTypes.CHANNEL_SELECT]: component => ({
        customID: component.custom_id,
        id:       component.id,
        type:     component.type,
        values:   component.values
    }),
    [ComponentTypes.LABEL]: component => ({
        component: fromRaw(component.component),
        id:        component.id,
        type:      component.type
    }),
    [ComponentTypes.FILE_UPLOAD]: component => ({
        customID: component.custom_id,
        id:       component.id,
        type:     component.type,
        values:   component.values
    }),
    [ComponentTypes.RADIO_GROUP]: component => ({
        customID: component.custom_id,
        id:       component.id,
        type:     component.type,
        value:    component.value
    }),
    [ComponentTypes.CHECKBOX]: component => ({
        customID: component.custom_id,
        id:       component.id,
        type:     component.type,
        value:    component.value
    }),
    [ComponentTypes.CHECKBOX_GROUP]: component => ({
        customID: component.custom_id,
        id:       component.id,
        type:     component.type,
        values:   component.values
    })
};

export function fromRaw<T extends Types.Interactions.RawModalSubmitComponentsActionRow | Types.Interactions.RawModalSubmitComponentsLabel | Types.Interactions.RawModalSubmitComponents>(component: T): Types.Interactions.ToModalSubmitComponentFromRaw<T> {
    return FROM_RAW[component.type](component as never) as never;
}

const TO_RAW: { [K in ComponentTypes.ACTION_ROW | ComponentTypes.LABEL | ModalComponentTypes]: (input: Types.Interactions.ModalSubmitComponentTypeMap[K]) => Types.Interactions.RawModalSubmitComponentTypeMap[K] } = {
    [ComponentTypes.ACTION_ROW]: component => ({
        type:       component.type,
        components: component.components.map(c => toRaw(c) as never),
        id:         component.id
    }),
    [ComponentTypes.STRING_SELECT]: component => ({
        custom_id: component.customID,
        values:    component.values,
        id:        component.id,
        type:      component.type
    }),
    [ComponentTypes.TEXT_INPUT]: component => ({
        custom_id: component.customID,
        value:     component.value,
        id:        component.id,
        type:      component.type
    }),
    [ComponentTypes.USER_SELECT]: component => ({
        custom_id: component.customID,
        values:    component.values,
        id:        component.id,
        type:      component.type
    }),
    [ComponentTypes.ROLE_SELECT]: component => ({
        custom_id: component.customID,
        values:    component.values,
        id:        component.id,
        type:      component.type
    }),
    [ComponentTypes.MENTIONABLE_SELECT]: component => ({
        custom_id: component.customID,
        values:    component.values,
        id:        component.id,
        type:      component.type
    }),
    [ComponentTypes.CHANNEL_SELECT]: component => ({
        custom_id: component.customID,
        values:    component.values,
        id:        component.id,
        type:      component.type
    }),
    [ComponentTypes.LABEL]: component => ({
        component: toRaw(component.component),
        id:        component.id,
        type:      component.type
    }),
    [ComponentTypes.FILE_UPLOAD]: component => ({
        custom_id: component.customID,
        values:    component.values,
        id:        component.id,
        type:      component.type
    }),
    [ComponentTypes.RADIO_GROUP]: component => ({
        custom_id: component.customID,
        value:     component.value,
        id:        component.id,
        type:      component.type
    }),
    [ComponentTypes.CHECKBOX]: component => ({
        custom_id: component.customID,
        value:     component.value,
        id:        component.id,
        type:      component.type
    }),
    [ComponentTypes.CHECKBOX_GROUP]: component => ({
        custom_id: component.customID,
        values:    component.values,
        id:        component.id,
        type:      component.type
    })
};

export function toRaw<T extends Types.Interactions.ModalSubmitComponentsActionRow | Types.Interactions.ModalSubmitComponentsLabel | Types.Interactions.ModalSubmitComponents>(component: T): Types.Interactions.ToRawFromModalSubmitComponent<T> {
    return TO_RAW[component.type](component as never) as never;
}