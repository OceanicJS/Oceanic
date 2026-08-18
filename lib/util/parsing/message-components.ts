/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ButtonStyles, ComponentTypes } from "../../Constants";
import type * as Types from "../../types/namespaced";

const FROM_RAW: { [K in ComponentTypes]: (input: Types.Channels.RawMessageComponentTypeMap[K]) => Types.Channels.MessageComponentTypeMap[K] } = {
    [ComponentTypes.ACTION_ROW]: component => ({
        components: component.components.map(c => fromRaw(c) as never),
        id:         component.id,
        type:       component.type
    }),
    [ComponentTypes.BUTTON]: component => {
        if (component.style === ButtonStyles.LINK) return component;

        if (component.style === ButtonStyles.PREMIUM) {
            return {
                disabled: component.disabled,
                id:       component.id,
                skuID:    component.sku_id,
                style:    component.style,
                type:     component.type
            };
        }

        return {
            customID: component.custom_id,
            disabled: component.disabled,
            emoji:    component.emoji,
            id:       component.id,
            label:    component.label,
            style:    component.style,
            type:     component.type
        };
    },
    [ComponentTypes.STRING_SELECT]: component => ({
        customID:    component.custom_id,
        disabled:    component.disabled,
        id:          component.id,
        maxValues:   component.max_values,
        minValues:   component.min_values,
        placeholder: component.placeholder,
        required:    component.required,
        type:        component.type,
        options:     component.options
    }),
    [ComponentTypes.TEXT_INPUT]: component => ({
        customID:    component.custom_id,
        id:          component.id,
        label:       component.label,
        maxLength:   component.max_length,
        minLength:   component.min_length,
        placeholder: component.placeholder,
        required:    component.required,
        style:       component.style,
        type:        component.type,
        value:       component.value
    }),
    [ComponentTypes.USER_SELECT]: component => ({
        customID:      component.custom_id,
        defaultValues: component.default_values,
        disabled:      component.disabled,
        id:            component.id,
        maxValues:     component.max_values,
        minValues:     component.min_values,
        placeholder:   component.placeholder,
        required:      component.required,
        type:          component.type
    }),
    [ComponentTypes.ROLE_SELECT]: component => ({
        customID:      component.custom_id,
        defaultValues: component.default_values,
        disabled:      component.disabled,
        id:            component.id,
        maxValues:     component.max_values,
        minValues:     component.min_values,
        placeholder:   component.placeholder,
        required:      component.required,
        type:          component.type
    }),
    [ComponentTypes.MENTIONABLE_SELECT]: component => ({
        customID:      component.custom_id,
        defaultValues: component.default_values,
        disabled:      component.disabled,
        id:            component.id,
        maxValues:     component.max_values,
        minValues:     component.min_values,
        placeholder:   component.placeholder,
        required:      component.required,
        type:          component.type
    }),
    [ComponentTypes.CHANNEL_SELECT]: component => ({
        customID:      component.custom_id,
        channelTypes:  component.channel_types,
        defaultValues: component.default_values,
        disabled:      component.disabled,
        id:            component.id,
        maxValues:     component.max_values,
        minValues:     component.min_values,
        placeholder:   component.placeholder,
        required:      component.required,
        type:          component.type
    }),
    [ComponentTypes.TEXT_DISPLAY]: component => ({
        content: component.content,
        id:      component.id,
        type:    component.type
    }),
    [ComponentTypes.THUMBNAIL]: component => ({
        description: component.description,
        id:          component.id,
        media:       {
            attachmentID:       component.media.attachment_id,
            contentType:        component.media.content_type,
            flags:              component.media.flags,
            height:             component.media.height,
            placeholder:        component.media.placeholder,
            placeholderVersion: component.media.placeholder_version,
            proxyURL:           component.media.proxy_url,
            url:                component.media.url,
            width:              component.media.width
        },
        spoiler: component.spoiler,
        type:    component.type
    }),
    [ComponentTypes.MEDIA_GALLERY]: component => ({
        id:    component.id,
        items: component.items.map(i => ({
            description: i.description,
            media:       {
                attachmentID:       i.media.attachment_id,
                contentType:        i.media.content_type,
                flags:              i.media.flags,
                height:             i.media.height,
                placeholder:        i.media.placeholder,
                placeholderVersion: i.media.placeholder_version,
                proxyURL:           i.media.proxy_url,
                url:                i.media.url,
                width:              i.media.width
            },
            spoiler: i.spoiler
        })),
        type: component.type
    }),
    [ComponentTypes.FILE]: component => ({
        file: {
            attachmentID:       component.file.attachment_id,
            contentType:        component.file.content_type,
            flags:              component.file.flags,
            height:             component.file.height,
            placeholder:        component.file.placeholder,
            placeholderVersion: component.file.placeholder_version,
            proxyURL:           component.file.proxy_url,
            url:                component.file.url,
            width:              component.file.width
        },
        id:     component.id,
        name:   component.name,
        size:   component.size,
        spoiler: component.spoiler,
        type:   component.type
    }),
    [ComponentTypes.SEPARATOR]: component => ({
        divider: component.divider,
        id:      component.id,
        spacing: component.spacing,
        type:    component.type
    }),
    [ComponentTypes.CONTENT_INVENTORY_ENTRY]: component => component,
    [ComponentTypes.CONTAINER]:               component => ({
        accentColor: component.accent_color,
        components:  component.components.map(c => fromRaw(c)),
        id:          component.id,
        spoiler:     component.spoiler,
        type:        component.type
    }),
    [ComponentTypes.SECTION]: component =>  ({
        type:       component.type,
        accessory:  fromRaw(component.accessory),
        components: component.components.map(c => fromRaw(c)),
        id:         component.id
    }),
    [ComponentTypes.LABEL]: component => ({
        type:        component.type,
        label:       component.label,
        description: component.description,
        component:   fromRaw(component.component),
        id:          component.id
    }),
    [ComponentTypes.FILE_UPLOAD]: component => ({
        customID:  component.custom_id,
        fileTypes: component.file_types,
        id:        component.id,
        maxValues: component.max_values,
        minValues: component.min_values,
        required:  component.required,
        type:      component.type
    }),
    [ComponentTypes.RADIO_GROUP]: component => ({
        customID: component.custom_id,
        id:       component.id,
        required: component.required,
        options:  component.options.map(o => ({
            default:     o.default,
            description: o.description,
            label:       o.label,
            value:       o.value
        })),
        type: component.type
    }),
    [ComponentTypes.CHECKBOX]: component => ({
        customID: component.custom_id,
        default:  component.default,
        id:       component.id,
        type:     component.type
    }),
    [ComponentTypes.CHECKBOX_GROUP]: component => ({
        customID:  component.custom_id,
        id:        component.id,
        maxValues: component.max_values,
        minValues: component.min_values,
        options:   component.options.map(o => ({
            default:     o.default,
            description: o.description,
            label:       o.label,
            value:       o.value
        })),
        required: component.required,
        type:     component.type
    })
};

export function fromRaw<T extends Types.Channels.RawComponent>(component: T): Types.Channels.ToComponentFromRaw<T> {
    return FROM_RAW[component.type](component as never) as never;
}

const TO_RAW: { [K in ComponentTypes]: (input: Types.Channels.MessageComponentTypeMap[K]) => Types.Channels.RawMessageComponentTypeMap[K] } = {
    [ComponentTypes.ACTION_ROW]: component => ({
        type:       component.type,
        components: component.components.map(c => toRaw(c) as never),
        id:         component.id
    }),
    [ComponentTypes.BUTTON]: component => {
        if (component.style === ButtonStyles.LINK) return component;
        if (component.style === ButtonStyles.PREMIUM) {
            return {
                disabled: component.disabled,
                id:       component.id,
                sku_id:   component.skuID,
                style:    component.style,
                type:     component.type
            };
        }
        return {
            custom_id: component.customID,
            disabled:  component.disabled,
            emoji:     component.emoji,
            id:        component.id,
            label:     component.label,
            style:     component.style,
            type:      component.type
        };
    },
    [ComponentTypes.STRING_SELECT]: component => ({
        custom_id:   component.customID,
        disabled:    component.disabled,
        id:          component.id,
        max_values:  component.maxValues,
        min_values:  component.minValues,
        placeholder: component.placeholder,
        required:    component.required,
        options:     component.options,
        type:        component.type
    }),
    [ComponentTypes.TEXT_INPUT]: component => ({
        custom_id:   component.customID,
        id:          component.id,
        label:       component.label,
        max_length:  component.maxLength,
        min_length:  component.minLength,
        placeholder: component.placeholder,
        required:    component.required,
        style:       component.style,
        type:        component.type,
        value:       component.value
    }),
    [ComponentTypes.USER_SELECT]: component => ({
        custom_id:      component.customID,
        default_values: component.defaultValues,
        disabled:       component.disabled,
        id:             component.id,
        max_values:     component.maxValues,
        min_values:     component.minValues,
        placeholder:    component.placeholder,
        required:       component.required,
        type:           component.type
    }),
    [ComponentTypes.ROLE_SELECT]: component => ({
        custom_id:      component.customID,
        default_values: component.defaultValues,
        disabled:       component.disabled,
        id:             component.id,
        max_values:     component.maxValues,
        min_values:     component.minValues,
        placeholder:    component.placeholder,
        required:       component.required,
        type:           component.type
    }),
    [ComponentTypes.MENTIONABLE_SELECT]: component => ({
        custom_id:      component.customID,
        default_values: component.defaultValues,
        disabled:       component.disabled,
        id:             component.id,
        max_values:     component.maxValues,
        min_values:     component.minValues,
        placeholder:    component.placeholder,
        required:       component.required,
        type:           component.type
    }),
    [ComponentTypes.CHANNEL_SELECT]: component => ({
        channel_types:  component.channelTypes,
        custom_id:      component.customID,
        default_values: component.defaultValues,
        disabled:       component.disabled,
        id:             component.id,
        max_values:     component.maxValues,
        min_values:     component.minValues,
        placeholder:    component.placeholder,
        required:       component.required,
        type:           component.type
    }),
    [ComponentTypes.TEXT_DISPLAY]: component => ({
        content: component.content,
        id:      component.id,
        type:    component.type
    }),
    [ComponentTypes.THUMBNAIL]: component => ({
        description: component.description,
        id:          component.id,
        media:       {
            attachment_id:       component.media.attachmentID,
            content_type:        component.media.contentType,
            flags:               component.media.flags,
            height:              component.media.height,
            placeholder:         component.media.placeholder,
            placeholder_version: component.media.placeholderVersion,
            proxy_url:           component.media.proxyURL,
            url:                 component.media.url,
            width:               component.media.width
        },
        spoiler: component.spoiler,
        type:    component.type
    }),
    [ComponentTypes.MEDIA_GALLERY]: component => ({
        id:    component.id,
        items: component.items.map(i => ({
            description: i.description,
            media:       {
                attachment_id:       i.media.attachmentID,
                content_type:        i.media.contentType,
                flags:               i.media.flags,
                height:              i.media.height,
                placeholder:         i.media.placeholder,
                placeholder_version: i.media.placeholderVersion,
                proxy_url:           i.media.proxyURL,
                url:                 i.media.url,
                width:               i.media.width
            },
            spoiler: i.spoiler
        })),
        type: component.type
    }),
    [ComponentTypes.FILE]: component => ({
        file: {
            attachment_id:       component.file.attachmentID,
            content_type:        component.file.contentType,
            flags:               component.file.flags,
            height:              component.file.height,
            placeholder:         component.file.placeholder,
            placeholder_version: component.file.placeholderVersion,
            proxy_url:           component.file.proxyURL,
            url:                 component.file.url,
            width:               component.file.width
        },
        id:      component.id,
        name:    component.name,
        size:    component.size,
        spoiler: component.spoiler,
        type:    component.type
    }),
    [ComponentTypes.SEPARATOR]: component => ({
        divider: component.divider,
        id:      component.id,
        spacing: component.spacing,
        type:    component.type
    }),
    [ComponentTypes.CONTENT_INVENTORY_ENTRY]: component => component,
    [ComponentTypes.CONTAINER]:               component => ({
        accent_color: component.accentColor,
        components:   component.components.map(c => toRaw(c)),
        id:           component.id,
        spoiler:      component.spoiler,
        type:         component.type
    }),
    [ComponentTypes.SECTION]: component => ({
        type:       component.type,
        accessory:  toRaw(component.accessory),
        components: component.components.map(c => toRaw(c)),
        id:         component.id
    }),
    [ComponentTypes.LABEL]: component => ({
        type:        component.type,
        label:       component.label,
        description: component.description,
        component:   toRaw(component.component),
        id:          component.id
    }),
    [ComponentTypes.FILE_UPLOAD]: component => ({
        custom_id:  component.customID,
        file_types: component.fileTypes,
        id:         component.id,
        max_values: component.maxValues,
        min_values: component.minValues,
        required:   component.required,
        type:       component.type
    }),
    [ComponentTypes.RADIO_GROUP]: component => ({
        custom_id: component.customID,
        required:  component.required,
        options:   component.options.map(o => ({
            default:     o.default,
            description: o.description,
            label:       o.label,
            value:       o.value
        })),
        id:   component.id,
        type: component.type
    }),
    [ComponentTypes.CHECKBOX]: component => ({
        custom_id: component.customID,
        default:   component.default,
        id:        component.id,
        type:      component.type
    }),
    [ComponentTypes.CHECKBOX_GROUP]: component => ({
        custom_id:  component.customID,
        max_values: component.maxValues,
        min_values: component.minValues,
        options:    component.options.map(o => ({
            default:     o.default,
            description: o.description,
            label:       o.label,
            value:       o.value
        })),
        id:       component.id,
        required: component.required,
        type:     component.type
    })
};

export function toRaw<T extends Types.Channels.Component>(component: T): Types.Channels.ToRawFromComponent<T> {
    return TO_RAW[component.type](component as never) as never;
}