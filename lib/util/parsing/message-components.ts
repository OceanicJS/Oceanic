import { ButtonStyles, ComponentTypes } from "../../Constants";

import type * as Types from "../../types/namespaced";

function unfurledMediaItemFromRaw(media: Types.Channels.RawUnfurledMediaItem): Types.Channels.UnfurledMediaItem {
    return {
        attachmentID: media.attachment_id,
        contentScanMetadata: media.content_scan_metadata === undefined ? undefined : { flags: media.content_scan_metadata.flags },
        contentType: media.content_type,
        flags: media.flags,
        height: media.height,
        placeholder: media.placeholder,
        placeholderVersion: media.placeholder_version,
        proxyURL: media.proxy_url,
        url: media.url,
        width: media.width,
    };
}

function unfurledMediaItemToRaw(media: Types.Channels.UnfurledMediaItem): Types.Channels.RawUnfurledMediaItem {
    return {
        attachment_id: media.attachmentID,
        content_scan_metadata: media.contentScanMetadata === undefined ? undefined : { flags: media.contentScanMetadata.flags },
        content_type: media.contentType,
        flags: media.flags,
        height: media.height,
        placeholder: media.placeholder,
        placeholder_version: media.placeholderVersion,
        proxy_url: media.proxyURL,
        url: media.url,
        width: media.width,
    };
}

const FROM_RAW: { [K in ComponentTypes]: (input: Types.Channels.RawMessageComponentTypeMap[K]) => Types.Channels.MessageComponentTypeMap[K] } = {
    [ComponentTypes.ACTION_ROW]: component => ({
        components: component.components.map(c => fromRaw(c) as never),
        type: component.type,
    }),
    [ComponentTypes.BUTTON]: (component) => {
        if (component.style === ButtonStyles.LINK) return component;

        if (component.style === ButtonStyles.PREMIUM) {
            return {
                disabled: component.disabled,
                skuID: component.sku_id,
                style: component.style,
                type: component.type,
            };
        }

        return {
            customID: component.custom_id,
            disabled: component.disabled,
            emoji: component.emoji,
            label: component.label,
            style: component.style,
            type: component.type,
        };
    },
    [ComponentTypes.STRING_SELECT]: component => ({
        customID: component.custom_id,
        disabled: component.disabled,
        maxValues: component.max_values,
        minValues: component.min_values,
        placeholder: component.placeholder,
        required: component.required,
        type: component.type,
        options: component.options,
    }),
    [ComponentTypes.TEXT_INPUT]: component => ({
        customID: component.custom_id,
        label: component.label,
        maxLength: component.max_length,
        minLength: component.min_length,
        placeholder: component.placeholder,
        required: component.required,
        style: component.style,
        type: component.type,
        value: component.value,
    }),
    [ComponentTypes.USER_SELECT]: component => ({
        customID: component.custom_id,
        defaultValues: component.default_values,
        disabled: component.disabled,
        maxValues: component.max_values,
        minValues: component.min_values,
        placeholder: component.placeholder,
        required: component.required,
        type: component.type,
    }),
    [ComponentTypes.ROLE_SELECT]: component => ({
        customID: component.custom_id,
        defaultValues: component.default_values,
        disabled: component.disabled,
        maxValues: component.max_values,
        minValues: component.min_values,
        placeholder: component.placeholder,
        required: component.required,
        type: component.type,
    }),
    [ComponentTypes.MENTIONABLE_SELECT]: component => ({
        customID: component.custom_id,
        defaultValues: component.default_values,
        disabled: component.disabled,
        maxValues: component.max_values,
        minValues: component.min_values,
        placeholder: component.placeholder,
        required: component.required,
        type: component.type,
    }),
    [ComponentTypes.CHANNEL_SELECT]: component => ({
        customID: component.custom_id,
        channelTypes: component.channel_types,
        defaultValues: component.default_values,
        disabled: component.disabled,
        maxValues: component.max_values,
        minValues: component.min_values,
        placeholder: component.placeholder,
        required: component.required,
        type: component.type,
    }),
    [ComponentTypes.TEXT_DISPLAY]: component => ({
        content: component.content,
        type: component.type,
    }),
    [ComponentTypes.THUMBNAIL]: component => ({
        description: component.description,
        media: unfurledMediaItemFromRaw(component.media),
        spoiler: component.spoiler,
        type: component.type,
    }),
    [ComponentTypes.MEDIA_GALLERY]: component => ({
        items: component.items.map(i => ({
            description: i.description,
            media: unfurledMediaItemFromRaw(i.media),
            spoiler: i.spoiler,
        })),
        type: component.type,
    }),
    [ComponentTypes.FILE]: component => ({
        file: unfurledMediaItemFromRaw(component.file),
        spoiler: component.spoiler,
        type: component.type,
    }),
    [ComponentTypes.SEPARATOR]: component => ({
        divider: component.divider,
        spacing: component.spacing,
        type: component.type,
    }),
    [ComponentTypes.CONTENT_INVENTORY_ENTRY]: component => component,
    [ComponentTypes.CONTAINER]: component => ({
        accentColor: component.accent_color,
        components: component.components.map(c => fromRaw(c)),
        spoiler: component.spoiler,
        type: component.type,
    }),
    [ComponentTypes.SECTION]: component => ({
        type: component.type,
        accessory: fromRaw(component.accessory),
        components: component.components.map(c => fromRaw(c)),
    }),
    [ComponentTypes.LABEL]: component => ({
        type: component.type,
        label: component.label,
        description: component.description,
        component: fromRaw(component.component),
    }),
    [ComponentTypes.FILE_UPLOAD]: component => ({
        customID: component.custom_id,
        fileTypes: component.file_types,
        id: component.id,
        maxValues: component.max_values,
        minValues: component.min_values,
        required: component.required,
        type: component.type,
    }),
    [ComponentTypes.RADIO_GROUP]: component => ({
        customID: component.custom_id,
        required: component.required,
        options: component.options.map(o => ({
            default: o.default,
            description: o.description,
            label: o.label,
            value: o.value,
        })),
        type: component.type,
    }),
    [ComponentTypes.CHECKBOX]: component => ({
        customID: component.custom_id,
        default: component.default,
        type: component.type,
    }),
    [ComponentTypes.CHECKBOX_GROUP]: component => ({
        customID: component.custom_id,
        maxValues: component.max_values,
        minValues: component.min_values,
        options: component.options.map(o => ({
            default: o.default,
            description: o.description,
            label: o.label,
            value: o.value,
        })),
        required: component.required,
        type: component.type,
    }),
};

export function fromRaw<T extends Types.Channels.RawComponent>(component: T): Types.Channels.ToComponentFromRaw<T> {
    return FROM_RAW[component.type](component as never) as never;
}

const TO_RAW: { [K in ComponentTypes]: (input: Types.Channels.MessageComponentTypeMap[K]) => Types.Channels.RawMessageComponentTypeMap[K] } = {
    [ComponentTypes.ACTION_ROW]: component => ({
        type: component.type,
        components: component.components.map(c => toRaw(c) as never),
    }),
    [ComponentTypes.BUTTON]: (component) => {
        if (component.style === ButtonStyles.LINK) return component;

        if (component.style === ButtonStyles.PREMIUM) {
            return {
                disabled: component.disabled,
                sku_id: component.skuID,
                style: component.style,
                type: component.type,
            };
        }

        return {
            custom_id: component.customID,
            disabled: component.disabled,
            emoji: component.emoji,
            label: component.label,
            style: component.style,
            type: component.type,
        };
    },
    [ComponentTypes.STRING_SELECT]: component => ({
        custom_id: component.customID,
        disabled: component.disabled,
        max_values: component.maxValues,
        min_values: component.minValues,
        placeholder: component.placeholder,
        required: component.required,
        options: component.options,
        type: component.type,
    }),
    [ComponentTypes.TEXT_INPUT]: component => ({
        custom_id: component.customID,
        label: component.label,
        max_length: component.maxLength,
        min_length: component.minLength,
        placeholder: component.placeholder,
        required: component.required,
        style: component.style,
        type: component.type,
        value: component.value,
    }),
    [ComponentTypes.USER_SELECT]: component => ({
        custom_id: component.customID,
        disabled: component.disabled,
        max_values: component.maxValues,
        min_values: component.minValues,
        placeholder: component.placeholder,
        required: component.required,
        type: component.type,
    }),
    [ComponentTypes.ROLE_SELECT]: component => ({
        custom_id: component.customID,
        disabled: component.disabled,
        max_values: component.maxValues,
        min_values: component.minValues,
        placeholder: component.placeholder,
        required: component.required,
        type: component.type,
    }),
    [ComponentTypes.MENTIONABLE_SELECT]: component => ({
        custom_id: component.customID,
        disabled: component.disabled,
        max_values: component.maxValues,
        min_values: component.minValues,
        placeholder: component.placeholder,
        required: component.required,
        type: component.type,
    }),
    [ComponentTypes.CHANNEL_SELECT]: component => ({
        channel_types: component.channelTypes,
        custom_id: component.customID,
        disabled: component.disabled,
        max_values: component.maxValues,
        min_values: component.minValues,
        placeholder: component.placeholder,
        required: component.required,
        type: component.type,
    }),
    [ComponentTypes.TEXT_DISPLAY]: component => ({
        content: component.content,
        type: component.type,
    }),
    [ComponentTypes.THUMBNAIL]: component => ({
        description: component.description,
        media: unfurledMediaItemToRaw(component.media),
        spoiler: component.spoiler,
        type: component.type,
    }),
    [ComponentTypes.MEDIA_GALLERY]: component => ({
        items: component.items.map(i => ({
            description: i.description,
            media: unfurledMediaItemToRaw(i.media),
            spoiler: i.spoiler,
        })),
        type: component.type,
    }),
    [ComponentTypes.FILE]: component => ({
        file: unfurledMediaItemToRaw(component.file),
        spoiler: component.spoiler,
        type: component.type,
    }),
    [ComponentTypes.SEPARATOR]: component => ({
        divider: component.divider,
        spacing: component.spacing,
        type: component.type,
    }),
    [ComponentTypes.CONTENT_INVENTORY_ENTRY]: component => component,
    [ComponentTypes.CONTAINER]: component => ({
        accent_color: component.accentColor,
        components: component.components.map(c => toRaw(c)),
        spoiler: component.spoiler,
        type: component.type,
    }),
    [ComponentTypes.SECTION]: component => ({
        type: component.type,
        accessory: toRaw(component.accessory),
        components: component.components.map(c => toRaw(c)),
    }),
    [ComponentTypes.LABEL]: component => ({
        type: component.type,
        label: component.label,
        description: component.description,
        component: toRaw(component.component),
    }),
    [ComponentTypes.FILE_UPLOAD]: component => ({
        custom_id: component.customID,
        file_types: component.fileTypes,
        id: component.id,
        max_values: component.maxValues,
        min_values: component.minValues,
        required: component.required,
        type: component.type,
    }),
    [ComponentTypes.RADIO_GROUP]: component => ({
        custom_id: component.customID,
        required: component.required,
        options: component.options.map(o => ({
            default: o.default,
            description: o.description,
            label: o.label,
            value: o.value,
        })),
        type: component.type,
    }),
    [ComponentTypes.CHECKBOX]: component => ({
        custom_id: component.customID,
        default: component.default,
        type: component.type,
    }),
    [ComponentTypes.CHECKBOX_GROUP]: component => ({
        custom_id: component.customID,
        max_values: component.maxValues,
        min_values: component.minValues,
        options: component.options.map(o => ({
            default: o.default,
            description: o.description,
            label: o.label,
            value: o.value,
        })),
        required: component.required,
        type: component.type,
    }),
};

export function toRaw<T extends Types.Channels.Component>(component: T): Types.Channels.ToRawFromComponent<T> {
    return TO_RAW[component.type](component as never) as never;
}
