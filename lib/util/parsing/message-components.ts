/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ButtonStyles, ComponentTypes } from "../../Constants";
import type * as Types from "../../types/namespaced";

const FROM_RAW: { [K in ComponentTypes]: (input: Types.Channels.RawMessageComponentTypeMap[K]) => Types.Channels.MessageComponentTypeMap[K] } = {
    [ComponentTypes.ACTION_ROW]: component => ({
        components: component.components.map(c => fromRaw(c) as never),
        type:       component.type
    }),
    [ComponentTypes.BUTTON]: component => {
        if (component.style === ButtonStyles.LINK) return component;

        if (component.style === ButtonStyles.PREMIUM) {
            return {
                disabled: component.disabled,
                skuID:    component.sku_id,
                style:    component.style,
                type:     component.type
            };
        }

        return {
            customID: component.custom_id,
            disabled: component.disabled,
            emoji:    component.emoji,
            label:    component.label,
            style:    component.style,
            type:     component.type
        };
    },
    [ComponentTypes.STRING_SELECT]: component => ({
        customID:    component.custom_id,
        disabled:    component.disabled,
        maxValues:   component.max_values,
        minValues:   component.min_values,
        placeholder: component.placeholder,
        required:    component.required,
        type:        component.type,
        options:     component.options
    }),
    [ComponentTypes.TEXT_INPUT]: component => ({
        customID:    component.custom_id,
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
        maxValues:     component.max_values,
        minValues:     component.min_values,
        placeholder:   component.placeholder,
        required:      component.required,
        type:          component.type
    }),
    [ComponentTypes.TEXT_DISPLAY]: component => ({
        content: component.content,
        type:    component.type
    }),
    [ComponentTypes.THUMBNAIL]: component => ({
        description: component.description,
        media:       {
            attachmentID: component.media.attachment_id,
            contentType:  component.media.content_type,
            height:       component.media.height,
            proxyURL:     component.media.proxy_url,
            url:          component.media.url,
            width:        component.media.width
        },
        spoiler: component.spoiler,
        type:    component.type
    }),
    [ComponentTypes.MEDIA_GALLERY]: component => ({
        items: component.items.map(i => ({
            description: i.description,
            media:       {
                attachmentID: i.media.attachment_id,
                contentType:  i.media.content_type,
                height:       i.media.height,
                proxyURL:     i.media.proxy_url,
                url:          i.media.url,
                width:        i.media.width
            },
            spoiler: i.spoiler
        })),
        type: component.type
    }),
    [ComponentTypes.FILE]: component => ({
        file: {
            attachmentID: component.file.attachment_id,
            contentType:  component.file.content_type,
            height:       component.file.height,
            proxyURL:     component.file.proxy_url,
            url:          component.file.url,
            width:        component.file.width
        },
        spoiler: component.spoiler,
        type:    component.type
    }),
    [ComponentTypes.SEPARATOR]: component => ({
        divider: component.divider,
        spacing: component.spacing,
        type:    component.type
    }),
    [ComponentTypes.CONTENT_INVENTORY_ENTRY]: component => component,
    [ComponentTypes.CONTAINER]:               component => ({
        accentColor: component.accent_color,
        components:  component.components.map(c => fromRaw(c)),
        spoiler:     component.spoiler,
        type:        component.type
    }),
    [ComponentTypes.SECTION]: component =>  ({
        type:       component.type,
        accessory:  fromRaw(component.accessory),
        components: component.components.map(c => fromRaw(c))
    }),
    [ComponentTypes.LABEL]: component => ({
        type:        component.type,
        label:       component.label,
        description: component.description,
        component:   fromRaw(component.component)
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
        type:     component.type
    }),
    [ComponentTypes.CHECKBOX_GROUP]: component => ({
        customID:  component.custom_id,
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
        components: component.components.map(c => toRaw(c) as never)
    }),
    [ComponentTypes.BUTTON]: component => {
        if (component.style === ButtonStyles.LINK) return component;

        if (component.style === ButtonStyles.PREMIUM) {
            return {
                disabled: component.disabled,
                sku_id:   component.skuID,
                style:    component.style,
                type:     component.type
            };
        }

        return {
            custom_id: component.customID,
            disabled:  component.disabled,
            emoji:     component.emoji,
            label:     component.label,
            style:     component.style,
            type:      component.type
        };
    },
    [ComponentTypes.STRING_SELECT]: component => ({
        custom_id:   component.customID,
        disabled:    component.disabled,
        max_values:  component.maxValues,
        min_values:  component.minValues,
        placeholder: component.placeholder,
        required:    component.required,
        options:     component.options,
        type:        component.type
    }),
    [ComponentTypes.TEXT_INPUT]: component => ({
        custom_id:   component.customID,
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
        custom_id:   component.customID,
        disabled:    component.disabled,
        max_values:  component.maxValues,
        min_values:  component.minValues,
        placeholder: component.placeholder,
        required:    component.required,
        type:        component.type
    }),
    [ComponentTypes.ROLE_SELECT]: component => ({
        custom_id:   component.customID,
        disabled:    component.disabled,
        max_values:  component.maxValues,
        min_values:  component.minValues,
        placeholder: component.placeholder,
        required:    component.required,
        type:        component.type
    }),
    [ComponentTypes.MENTIONABLE_SELECT]: component => ({
        custom_id:   component.customID,
        disabled:    component.disabled,
        max_values:  component.maxValues,
        min_values:  component.minValues,
        placeholder: component.placeholder,
        required:    component.required,
        type:        component.type
    }),
    [ComponentTypes.CHANNEL_SELECT]: component => ({
        channel_types: component.channelTypes,
        custom_id:     component.customID,
        disabled:      component.disabled,
        max_values:    component.maxValues,
        min_values:    component.minValues,
        placeholder:   component.placeholder,
        required:      component.required,
        type:          component.type
    }),
    [ComponentTypes.TEXT_DISPLAY]: component => ({
        content: component.content,
        type:    component.type
    }),
    [ComponentTypes.THUMBNAIL]: component => ({
        description: component.description,
        media:       {
            attachment_id: component.media.attachmentID,
            content_type:  component.media.contentType,
            height:        component.media.height,
            proxy_url:     component.media.proxyURL,
            url:           component.media.url,
            width:         component.media.width
        },
        spoiler: component.spoiler,
        type:    component.type
    }),
    [ComponentTypes.MEDIA_GALLERY]: component => ({
        items: component.items.map(i => ({
            description: i.description,
            media:       {
                attachment_id: i.media.attachmentID,
                content_type:  i.media.contentType,
                height:        i.media.height,
                proxy_url:     i.media.proxyURL,
                url:           i.media.url,
                width:         i.media.width
            },
            spoiler: i.spoiler
        })),
        type: component.type
    }),
    [ComponentTypes.FILE]: component => ({
        file: {
            attachment_id: component.file.attachmentID,
            content_type:  component.file.contentType,
            height:        component.file.height,
            proxy_url:     component.file.proxyURL,
            url:           component.file.url,
            width:         component.file.width
        },
        spoiler: component.spoiler,
        type:    component.type
    }),
    [ComponentTypes.SEPARATOR]: component => ({
        divider: component.divider,
        spacing: component.spacing,
        type:    component.type
    }),
    [ComponentTypes.CONTENT_INVENTORY_ENTRY]: component => component,
    [ComponentTypes.CONTAINER]:               component => ({
        accent_color: component.accentColor,
        components:   component.components.map(c => toRaw(c)),
        spoiler:      component.spoiler,
        type:         component.type
    }),
    [ComponentTypes.SECTION]: component => ({
        type:       component.type,
        accessory:  toRaw(component.accessory),
        components: component.components.map(c => toRaw(c))
    }),
    [ComponentTypes.LABEL]: component => ({
        type:        component.type,
        label:       component.label,
        description: component.description,
        component:   toRaw(component.component)
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
        type: component.type
    }),
    [ComponentTypes.CHECKBOX]: component => ({
        custom_id: component.customID,
        default:   component.default,
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
        required: component.required,
        type:     component.type
    })
};

export function toRaw<T extends Types.Channels.Component>(component: T): Types.Channels.ToRawFromComponent<T> {
    return TO_RAW[component.type](component as never) as never;
}
