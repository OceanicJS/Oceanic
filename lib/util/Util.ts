/** @module Util */
import { CDN_URL } from "./Routes";
import { FrozenModificationError } from "./Errors";
import type * as Types from "../types/namespaced";
import type Client from "../Client";
import {
    ButtonStyles,
    ComponentTypes,
    ImageFormats,
    MEDIA_PROXY_SIZES,
    type ImageFormat,
    ThreadChannelTypes,
    ChannelTypes,
    Intents,
    PrivilegedIntentMapping,
    type ApplicationFlags,
    type PrivilegedIntentNames
} from "../Constants";
import Member from "../structures/Member";
import Channel from "../structures/Channel";
import Message from "../structures/Message";
import Entitlement from "../structures/Entitlement";
import TestEntitlement from "../structures/TestEntitlement";
import type Poll from "../structures/Poll";
import { types } from "node:util";

/** A general set of utilities. These are intentionally poorly documented, as they serve almost no usefulness to outside developers. */
export default class Util {
    private _client: Client;

    constructor(client: Client) {
        this._client = client;
    }

    static rawEmbeds(embeds: Types.Channels.RawEmbed): Types.Channels.Embed;
    static rawEmbeds(embeds: Array<Types.Channels.RawEmbed>): Array<Types.Channels.Embed>;
    static rawEmbeds(embeds: Types.Channels.RawEmbed | Array<Types.Channels.RawEmbed>): Types.Channels.Embed | Array<Types.Channels.Embed> {
        const data = Util.prototype.embedsToParsed(Array.isArray(embeds) ? embeds : [embeds]);
        return Array.isArray(embeds) ? data : data[0];
    }

    static rawMessageComponents(components: Types.Channels.RawMessageComponent): Types.Channels.MessageComponent;
    static rawMessageComponents(components: Array<Types.Channels.RawMessageComponent>): Array<Types.Channels.MessageComponent>;
    static rawMessageComponents(components: Types.Channels.RawMessageComponent | Array<Types.Channels.RawMessageComponent>): Types.Channels.MessageComponent | Array<Types.Channels.MessageComponent> {
        const data = Util.prototype.componentsToParsed(Array.isArray(components) ? components : [components]);
        return Array.isArray(components) ? data : data[0];
    }

    static rawModalComponents(components: Types.Channels.RawModalComponent): Types.Channels.ModalComponent;
    static rawModalComponents(components: Array<Types.Channels.RawModalComponent>): Array<Types.Channels.ModalComponent>;
    static rawModalComponents(components: Types.Channels.RawModalComponent | Array<Types.Channels.RawModalComponent>): Types.Channels.ModalComponent | Array<Types.Channels.ModalComponent> {
        const data = Util.prototype.componentsToParsed(Array.isArray(components) ? components : [components]);
        return Array.isArray(components) ? data : data[0];
    }

    /** @hidden intentionally not documented - this is an internal function */
    _arrayToCSV(data: Array<string>, header?: string): Buffer {
        return Buffer.from([header, ...data].filter(Boolean).join("\n"), "utf8");
    }

    /** @hidden intentionally not documented - this is an internal function */
    _arrayToCSVFile(data: Array<string>, name: string, header?: string): Types.RequestHandler.File {
        return {
            name:     `${name}.csv`,
            field:    name,
            contents: this._arrayToCSV(data, header)
        };
    }

    /** @hidden intentionally not documented - this is an internal function */
    _convertImage(image: Buffer | string, name: string): string {
        try {
            return this.convertImage(image);
        } catch (err) {
            throw new TypeError(`Invalid ${name} provided. Ensure you are providing a valid, fully-qualified base64 url.`, { cause: err as Error });
        }
    }

    /** @hidden intended for internal use only */
    _convertSound(sound: Buffer | string, name: string): string {
        try {
            return this.convertSound(sound);
        } catch (err) {
            throw new TypeError(`Invalid ${name} provided. Ensure you are providing a valid, fully-qualified base64 url.`, { cause: err as Error });
        }
    }

    /** @internal */
    _freeze<T>(obj: T, detail?: string): T {
        let message = "This is an error in the library and should be reported.";
        if (detail) {
            message += `Detail: ${detail}`;
        }
        if (typeof obj !== "object" || obj === null || types.isProxy(obj)) {
            return obj;
        }
        return new Proxy(obj, {
            set: (target, prop, value, receiver): boolean => {
                this._client.emit("error", new FrozenModificationError(message, prop));
                return Reflect.set(target, prop, value, receiver);
            }
        });
    }

    /** @hidden intended for internal use only */
    _getLimit(name: Exclude<keyof Types.Client.CollectionLimitsOptions, "users">, id?: string): number {
        const opt = this._client.options.collectionLimits[name];
        if (typeof opt === "number") {
            return opt;
        }
        return (id === undefined ? undefined : opt[id]) ?? opt.default ?? Infinity;
    }

    /** @hidden intended for internal use only */
    _isModuleInstalled(name: string): boolean {
        try {
            // eslint-disable-next-line unicorn/prefer-module
            require(name);
            return true;
        } catch {
            return false;
        }
    }

    _setLimit(values?: Record<string, number> | number, defaultValue = Infinity): Record<string, number> | number {
        if (values === undefined) {
            return defaultValue;
        }

        if (typeof values === "object") {
            return { default: defaultValue, ...values };
        }

        return values;
    }

    componentToParsed<T extends Types.Channels.RawComponent>(component: T): Types.Channels.ToComponentFromRaw<T> {
        switch (component.type) {
            case ComponentTypes.ACTION_ROW: {
                return {
                    components: component.components.map(c => this.componentToParsed(c)),
                    type:       component.type
                } as never;
            }
            case ComponentTypes.BUTTON: {
                if (component.style === ButtonStyles.LINK) return component as never;

                if (component.style === ButtonStyles.PREMIUM) {
                    return {
                        disabled: component.disabled,
                        skuID:    component.sku_id,
                        style:    component.style,
                        type:     component.type
                    } as never;
                }

                return {
                    customID: component.custom_id,
                    disabled: component.disabled,
                    emoji:    component.emoji,
                    label:    component.label,
                    style:    component.style,
                    type:     component.type
                } as never;
            }
            case ComponentTypes.TEXT_INPUT: {
                return {
                    customID:    component.custom_id,
                    label:       component.label,
                    maxLength:   component.max_length,
                    minLength:   component.min_length,
                    placeholder: component.placeholder,
                    required:    component.required,
                    style:       component.style,
                    type:        component.type,
                    value:       component.value
                } as never;
            }
            case ComponentTypes.STRING_SELECT:
            case ComponentTypes.USER_SELECT:
            case ComponentTypes.ROLE_SELECT:
            case ComponentTypes.MENTIONABLE_SELECT:
            case ComponentTypes.CHANNEL_SELECT: {
                const parsedComponent  = {
                    customID:    component.custom_id,
                    disabled:    component.disabled,
                    maxValues:   component.max_values,
                    minValues:   component.min_values,
                    placeholder: component.placeholder,
                    type:        component.type
                };

                if (component.type !== ComponentTypes.STRING_SELECT && component.default_values !== undefined) {
                    (parsedComponent as Exclude<Types.Channels.SelectMenuComponent, Types.Channels.StringSelectMenu>).defaultValues = component.default_values;
                }

                if (component.type === ComponentTypes.STRING_SELECT) {
                    return { ...parsedComponent, options: component.options } as never;
                } else if (component.type === ComponentTypes.CHANNEL_SELECT) {
                    return { ...parsedComponent, channelTypes: component.channel_types } as never;
                } else {
                    return parsedComponent as never;
                }
            }

            case ComponentTypes.TEXT_DISPLAY: {
                return component as never;
            }

            case ComponentTypes.THUMBNAIL: {
                return {
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
                } as never;
            }

            case ComponentTypes.MEDIA_GALLERY: {
                return {
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
                } as never;
            }

            case ComponentTypes.FILE: {
                return {
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
                } as never;
            }

            case ComponentTypes.SEPARATOR: {
                return component as never;
            }

            case ComponentTypes.CONTAINER: {
                return {
                    accentColor: component.accent_color,
                    components:  component.components.map(c => this.componentToParsed(c)),
                    spoiler:     component.spoiler,
                    type:        component.type
                } as never;
            }

            case ComponentTypes.SECTION: {
                return {
                    type:       component.type,
                    accessory:  component.accessory ? this.componentToParsed(component.accessory) : undefined,
                    components: component.components.map(c => this.componentToParsed(c))
                } as never;
            }

            case ComponentTypes.LABEL: {
                return {
                    type:        component.type,
                    label:       component.label,
                    description: component.description,
                    component:   this.componentToParsed(component.component)
                } as never;
            }
            case ComponentTypes.FILE_UPLOAD: {
                return {
                    customID:  component.custom_id,
                    maxValues: component.max_values,
                    minValues: component.min_values,
                    required:  component.required,
                    type:      component.type
                } as never;
            }
            case ComponentTypes.RADIO_GROUP: {
                return {
                    customID: component.custom_id,
                    required: component.required,
                    options:  component.options.map(o => ({
                        value:       o.value,
                        description: o.description,
                        default:     o.value,
                        label:       o.value
                    })),
                    type: component.type
                } as never;
            }
            case ComponentTypes.CHECKBOX: {
                return {
                    customID: component.custom_id,
                    default:  component.default,
                    type:     component.type
                } as never;
            }
            case ComponentTypes.CHECKBOX_GROUP: {
                return {
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
                } as never;
            }
            default: {
                return component as never;
            }
        }
    }

    componentToRaw<T extends Types.Channels.Component>(component: T): Types.Channels.ToRawFromComponent<T> {
        switch (component.type) {
            case ComponentTypes.ACTION_ROW: {
                return {
                    type:       component.type,
                    components: component.components.map(c => this.componentToRaw(c))
                } as never;
            }

            case ComponentTypes.BUTTON: {
                if (component.style === ButtonStyles.LINK) return component as never;

                if (component.style === ButtonStyles.PREMIUM) {
                    return {
                        disabled: component.disabled,
                        sku_id:   component.skuID,
                        style:    component.style,
                        type:     component.type
                    } as never;
                }

                return {
                    custom_id: component.customID,
                    disabled:  component.disabled,
                    emoji:     component.emoji,
                    label:     component.label,
                    style:     component.style,
                    type:      component.type
                } as never;
            }
            case ComponentTypes.TEXT_INPUT: {
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
                } as never;
            }
            case ComponentTypes.STRING_SELECT:
            case ComponentTypes.USER_SELECT:
            case ComponentTypes.ROLE_SELECT:
            case ComponentTypes.MENTIONABLE_SELECT:
            case ComponentTypes.CHANNEL_SELECT: {
                const rawComponent = {
                    custom_id:   component.customID,
                    disabled:    component.disabled,
                    max_values:  component.maxValues,
                    min_values:  component.minValues,
                    placeholder: component.placeholder,
                    required:    component.required,
                    type:        component.type
                };

                if (component.type !== ComponentTypes.STRING_SELECT && component.defaultValues !== undefined) {
                    (rawComponent as Exclude<Types.Channels.RawSelectMenuComponent, Types.Channels.RawStringSelectMenu>).default_values = component.defaultValues;
                }

                if (component.type === ComponentTypes.STRING_SELECT) {
                    return { ...rawComponent, options: component.options } as never;
                } else if (component.type === ComponentTypes.CHANNEL_SELECT) {
                    return { ...rawComponent, channel_types: component.channelTypes } as never;
                } else {
                    return rawComponent as never;
                }
            }

            case ComponentTypes.TEXT_DISPLAY: {
                return component as never;
            }

            case ComponentTypes.THUMBNAIL: {
                return {
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
                } as never;
            }

            case ComponentTypes.MEDIA_GALLERY: {
                return {
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
                } as never;
            }

            case ComponentTypes.FILE: {
                return {
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
                } as never;
            }

            case ComponentTypes.SEPARATOR: {
                return component as never;
            }

            case ComponentTypes.CONTAINER: {
                return {
                    accent_color: component.accentColor,
                    components:   component.components.map(c => this.componentToRaw(c)),
                    spoiler:      component.spoiler,
                    type:         component.type
                } as never;
            }

            case ComponentTypes.SECTION: {
                return {
                    type:       component.type,
                    accessory:  component.accessory ? this.componentToRaw(component.accessory) : undefined,
                    components: component.components.map(c => this.componentToRaw(c))
                } as never;
            }

            case ComponentTypes.LABEL: {
                return {
                    type:        component.type,
                    label:       component.label,
                    description: component.description,
                    component:   this.componentToRaw(component.component)
                } as never;
            }
            case ComponentTypes.FILE_UPLOAD:
                return {
                    custom_id:  component.customID,
                    max_values: component.maxValues,
                    min_values: component.minValues,
                    required:   component.required,
                    type:       component.type
                } as never;
            case ComponentTypes.RADIO_GROUP: {
                return {
                    custom_id: component.customID,
                    required:  component.required,
                    options:   component.options.map(o => ({
                        value:       o.value,
                        description: o.description,
                        default:     o.value,
                        label:       o.value
                    })),
                    type: component.type
                } as never;
            }
            case ComponentTypes.CHECKBOX: {
                return {
                    custom_id: component.customID,
                    default:   component.default,
                    type:      component.type
                } as never;
            }
            case ComponentTypes.CHECKBOX_GROUP: {
                return {
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
                } as never;
            }
            default: {
                return component as never;
            }
        }
    }

    componentsToParsed<T extends Types.Channels.AnyRawBaseComponent>(components: Array<T>): Array<Types.Channels.ToComponentFromRaw<T>> {
        return components.map(component => this.componentToParsed(component)) as never;
    }

    componentsToRaw<T extends Types.Channels.MessageComponent | Types.Channels.ModalComponent>(components: Array<T>): Array<T extends Types.Channels.MessageComponent ? Types.Channels.RawMessageComponent : T extends Types.Channels.ModalComponent ? Types.Channels.RawModalComponent : never> {
        return components.map(component => this.componentToRaw(component)) as never;
    }

    convertApplicationEmoji(raw: Types.Applications.RawApplicationEmoji): Types.Applications.ApplicationEmoji {
        return this.convertGuildEmoji(raw);
    }

    convertGuildEmoji(raw: Types.Guilds.RawGuildEmoji): Types.Guilds.GuildEmoji {
        return {
            animated:      raw.animated,
            available:     raw.available,
            id:            raw.id,
            managed:       raw.managed,
            name:          raw.name,
            requireColons: raw.require_colons,
            roles:         raw.roles,
            user:          raw.user ? this._client.users.update(raw.user) : undefined
        };
    }

    convertImage(img: Buffer | string): string {
        if (Buffer.isBuffer(img)) {
            const b64 = img.toString("base64");
            let mime: string | undefined;
            const magicMap: Array<[mime: string, magic: RegExp]> = [
                // 47 49 46 38
                ["image/gif", /^47494638/],
                // 89 50 4E 47
                ["image/png", /^89504E47/],
                // FF D8 FF
                ["image/jpeg", /^FFD8FF/],
                // 52 49 46 46 ?? ?? ?? ?? 57 45 42 50
                ["image/webp", /^52494646\d{8}57454250/],
                // 02 27 62 20 22 0 - lottie JSON (assuming all files will start with {"v":")
                ["application/json", /^02276220220/]
            ];
            for (const format of magicMap) {
                if (format[1].test(this.getMagic(img, 16))) {
                    mime = format[0];
                    break;
                }
            }
            if (!mime) {
                throw new TypeError(`Failed to determine image format. (magic: ${this.getMagic(img, 16)})`);
            }
            img = `data:${mime};base64,${b64}`;
        }
        return img;
    }

    convertSound(audio: Buffer | string): string {
        if (Buffer.isBuffer(audio)) {
            const b64 = audio.toString("base64");
            let mime: string | undefined;
            const magicMap: Array<[mime: string, magic: RegExp]> = [
                // 49 44 33
                ["audio/mpeg", /^494433/],
                // FF FB
                ["audio/mpeg", /^FFFB/],
                // 4F 67 67 53
                ["audio/ogg", /^4F676753/]
            ];
            for (const format of magicMap) {
                if (format[1].test(this.getMagic(audio, 16))) {
                    mime = format[0];
                    break;
                }
            }
            if (!mime) {
                throw new TypeError(`Failed to determine sound format. (magic: ${this.getMagic(audio, 16)})`);
            }
            audio = `data:${mime};base64,${b64}`;
        }
        return audio;
    }

    convertSticker(raw: Types.Guilds.RawSticker): Types.Guilds.Sticker {
        return {
            asset:       raw.asset,
            available:   raw.available,
            description: raw.description,
            formatType:  raw.format_type,
            guildID:     raw.guild_id,
            id:          raw.id,
            name:        raw.name,
            packID:      raw.pack_id,
            sortValue:   raw.sort_value,
            tags:        raw.tags,
            type:        raw.type,
            user:        raw.user ? this._client.users.update(raw.user) : undefined
        };
    }

    async detectMissingPrivilegedIntents(intents?: number): Promise<Array<PrivilegedIntentNames>> {
        const application = this._client["_application"] || await this._client.rest.applications.getClient();
        intents ??= this._client.shards.options.intents;
        this._client["_application"] ??= application;

        const missing: Array<PrivilegedIntentNames> = [];
        const check = (intent: Intents, allowed: Array<ApplicationFlags>): void => {
            if ((intents! & intent) === intent && !allowed.some(flag => (application.flags & flag) === flag)) {
                missing.push(Intents[intent] as PrivilegedIntentNames);
            }
        };
        for (const [intent, allowed] of PrivilegedIntentMapping) {
            check(intent, allowed);
        }

        return missing;
    }

    embedsToParsed(embeds: Array<Types.Channels.RawEmbed>): Array<Types.Channels.Embed> {
        return embeds.map(embed => ({
            author: embed.author === undefined ? undefined : {
                name:         embed.author.name,
                iconURL:      embed.author.icon_url,
                proxyIconURL: embed.author.proxy_icon_url
            },
            color:       embed.color,
            description: embed.description,
            fields:      embed.fields?.map(field => ({
                inline: field.inline,
                name:   field.name,
                value:  field.value
            })),
            flags:  embed.flags,
            footer: embed.footer === undefined ? undefined : {
                flags:        embed.footer.flags,
                iconURL:      embed.footer.icon_url,
                proxyIconURL: embed.footer.proxy_icon_url,
                text:         embed.footer.text
            },
            timestamp: embed.timestamp,
            title:     embed.title,
            image:     embed.image === undefined ? undefined : {
                flags:    embed.image.flags,
                height:   embed.image.height,
                proxyURL: embed.image.proxy_url,
                url:      embed.image.url,
                width:    embed.image.width
            },
            provider: embed.provider === undefined ? undefined : {
                name: embed.provider.name,
                url:  embed.provider.url
            },
            thumbnail: embed.thumbnail === undefined ? undefined : {
                url:      embed.thumbnail.url,
                height:   embed.thumbnail.height,
                proxyURL: embed.thumbnail.proxy_url,
                width:    embed.thumbnail.width
            },
            url:   embed.url,
            type:  embed.type,
            video: embed.video === undefined ? undefined : {
                height:   embed.video.height,
                proxyURL: embed.video.proxy_url,
                url:      embed.video.url,
                width:    embed.video.width
            }
        }));
    }

    embedsToRaw(embeds: Array<Types.Channels.EmbedOptions>): Array<Types.Channels.RawEmbedOptions> {
        return embeds.map(embed => ({
            author: embed.author === undefined ? undefined :  {
                name:     embed.author.name,
                icon_url: embed.author.iconURL,
                url:      embed.author.url
            },
            color:       embed.color,
            description: embed.description,
            fields:      embed.fields?.map(field => ({
                inline: field.inline,
                name:   field.name,
                value:  field.value
            })),
            footer: embed.footer === undefined ? undefined : {
                text:     embed.footer.text,
                icon_url: embed.footer.iconURL
            },
            timestamp: embed.timestamp,
            title:     embed.title,
            image:     embed.image === undefined ? undefined : { url: embed.image.url },
            thumbnail: embed.thumbnail === undefined ? undefined : { url: embed.thumbnail.url },
            url:       embed.url
        }));
    }

    formatAllowedMentions(allowed?: Types.Channels.AllowedMentions | null): Types.Channels.RawAllowedMentions {
        const result: Types.Channels.RawAllowedMentions = { parse: [] };

        if (!allowed) {
            return this.formatAllowedMentions(this._client.options.allowedMentions);
        }

        if (allowed.everyone === true) {
            result.parse.push("everyone");
        }

        if (allowed.roles === true) {
            result.parse.push("roles");
        } else if (Array.isArray(allowed.roles)) {
            result.roles = allowed.roles;
        }

        if (allowed.users === true) {
            result.parse.push("users");
        } else if (Array.isArray(allowed.users)) {
            result.users = allowed.users;
        }

        if (allowed.repliedUser === true) {
            result.replied_user = true;
        }

        return result;
    }

    formatImage(url: string, format?: ImageFormat, size?: number): string {
        if (!format || !ImageFormats.includes(format.toLowerCase() as ImageFormat)) {
            format = url.includes("/a_") ? "gif" : this._client.options.defaultImageFormat;
        }
        if (!size || !MEDIA_PROXY_SIZES.includes(size)) {
            size = this._client.options.defaultImageSize;
        }
        return `${CDN_URL}${url}.${format}?size=${size}`;
    }

    getMagic(file: Buffer, len = 4): string {
        return [...new Uint8Array(file.subarray(0, len))].map(b => b.toString(16).padStart(2, "0")).join("").toUpperCase();
    }

    modalSubmitComponentToParsed<T extends Types.Interactions.RawModalSubmitComponents>(component: T): Types.Interactions.ToModalSubmitComponentFromRaw<T> {
        switch (component.type) {
            case ComponentTypes.TEXT_INPUT: {
                return {
                    customID: component.custom_id,
                    type:     component.type,
                    value:    component.value
                } as never;
            }

            case ComponentTypes.STRING_SELECT:
            case ComponentTypes.USER_SELECT:
            case ComponentTypes.ROLE_SELECT:
            case ComponentTypes.MENTIONABLE_SELECT:
            case ComponentTypes.CHANNEL_SELECT:
            case ComponentTypes.FILE_UPLOAD: {
                return {
                    customID: component.custom_id,
                    type:     component.type,
                    values:   component.values
                } as never;
            }
            default: {
                return component as never;
            }
        }
    }

    modalSubmitComponentsToParsed<T extends Types.Interactions.RawModalSubmitComponentsActionRow | Types.Interactions.RawModalSubmitComponentsLabel>(components: Array<T>): Array<Types.Interactions.ModalSubmitComponentsActionRow | Types.Interactions.ModalSubmitComponentsLabel> {
        return components.map(row => {
            if (row.type === ComponentTypes.ACTION_ROW) {
                return {
                    type:       row.type,
                    components: row.components ? row.components.map(component => this.modalSubmitComponentToParsed(component)) : undefined
                };
            } else {
                return {
                    type:      row.type,
                    component: row.component ? this.modalSubmitComponentToParsed(row.component) : undefined
                };
            }
        }) as never;
    }

    optionToParsed(option: Types.Applications.RawApplicationCommandOption): Types.Applications.ApplicationCommandOptions {
        return {
            autocomplete:             option.autocomplete,
            channelTypes:             option.channel_types,
            choices:                  option.choices,
            description:              option.description,
            descriptionLocalizations: option.description_localizations,
            descriptionLocalized:     option.description_localized,
            max_length:               option.max_length,
            max_value:                option.max_value,
            min_length:               option.min_length,
            min_value:                option.min_value,
            name:                     option.name,
            nameLocalizations:        option.name_localizations,
            nameLocalized:            option.name_localized,
            options:                  option.options?.map(o => this.optionToParsed(o)),
            required:                 option.required,
            type:                     option.type
        } as Types.Applications.ApplicationCommandOptions;
    }

    optionToRaw(option: Types.Applications.ApplicationCommandOptions): Types.Applications.RawApplicationCommandOption {
        const opt = option as Types.Applications.CombinedApplicationCommandOption;
        return {
            autocomplete:  opt.autocomplete,
            channel_types: opt.channelTypes,
            choices:       opt.choices?.map(choice => ({
                name:               choice.name,
                name_localizations: choice.nameLocalizations,
                value:              choice.value
            })),
            description:               opt.description,
            description_localizations: opt.descriptionLocalizations,
            max_length:                opt.maxLength,
            max_value:                 opt.maxValue,
            min_length:                opt.minLength,
            min_value:                 opt.minValue,
            name:                      opt.name,
            name_localizations:        opt.nameLocalizations,
            options:                   opt.options?.map(o => this.optionToRaw(o as Types.Applications.ApplicationCommandOptions)),
            required:                  opt.required,
            type:                      opt.type
        } satisfies Types.Applications.RawApplicationCommandOption as Types.Applications.RawApplicationCommandOption;
    }

    /** @internal */
    replacePollAnswer(poll: Poll, answerID: number, count: number, users?: Array<string>): void {
        let answerCount = poll.results.answerCounts.find(a => a.id === answerID);
        if (!answerCount) {
            answerCount = {
                count,
                id:      answerID,
                users:   [],
                meVoted: false
            };
        }

        answerCount.count = count;
        if (users) {
            answerCount.users = users;
            answerCount.meVoted = (this._client["_user"] && users.includes(this._client["_user"]?.id)) ?? false;
        }
    }

    updateChannel<T extends Types.Channels.AnyChannel>(channelData: Types.Channels.RawChannel): T {
        guild: if (channelData.guild_id) {
            const guild = this._client.guilds.get(channelData.guild_id);
            if (guild) {
                if (ThreadChannelTypes.includes(channelData.type as typeof ThreadChannelTypes[number])) {
                    if (!channelData.parent_id) {
                        break guild;
                    }
                    return guild.threads.update(channelData as Types.Channels.RawThreadChannel) as T;
                } else {
                    return guild.channels.update(channelData as Types.Channels.RawGuildChannel) as T;
                }
            }
        }

        switch (channelData.type) {
            case ChannelTypes.DM: return this._client.privateChannels.update(channelData as Types.Channels.RawPrivateChannel) as T;
            case ChannelTypes.GROUP_DM: return this._client.groupChannels.update(channelData as Types.Channels.RawGroupChannel) as T;
            default: return Channel.from<T>(channelData, this._client);
        }
    }

    /** @internal */
    updateEntitlement<T extends Entitlement | TestEntitlement = Entitlement | TestEntitlement>(data: Types.Applications.RawBaseEntitlement): T {
        if (this._client["_application"] === undefined) {
            return "subscription_id" in data && data.subscription_id ?
                new Entitlement(data as Types.Applications.RawEntitlement, this._client) as T :
                new TestEntitlement(data as Types.Applications.RawTestEntitlement, this._client) as T;
        } else {
            return this._client.application.entitlements.update(data) as T;
        }
    }

    /** @internal */
    updateMember(guildID: string, memberID: string, member: Types.Guilds.RawMember | Types.Guilds.RESTMember): Member {
        const guild = this._client.guilds.get(guildID);
        if (guild && this._client["_user"] && this._client.user.id === memberID) {
            if (guild["_clientMember"]) {
                guild["_clientMember"]["update"](member);
            } else {
                guild["_clientMember"] = guild.members.update({ ...member, id: memberID }, guildID);
            }
            return guild["_clientMember"];
        }
        return guild ? guild.members.update({ ...member, id: memberID }, guildID) : new Member({ ...member, id: memberID }, this._client, guildID);
    }

    /** @internal */
    updateMessage<T extends Types.Channels.AnyTextableChannel | Types.Shared.Uncached>(data: Types.Channels.RawMessage): Message<T> {
        const channel = this._client.getChannel(data.channel_id) as T | undefined;
        if (channel && "messages" in channel) {
            return channel.messages.update(data) as Message<T>;
        }

        return new Message<T>(data, this._client);
    }

    /** @internal */
    updatePollAnswer(poll: Poll, answerID: number, count: number, user?: string): void {
        let answerCount = poll.results.answerCounts.find(a => a.id === answerID);
        if (!answerCount) {
            if (count === -1) {
                return;
            }

            answerCount = {
                count,
                id:      answerID,
                users:   user ? [user] : [],
                meVoted: user === this._client["_user"]?.id
            };
            poll.results.answerCounts.push(answerCount);
            return;
        }

        answerCount.count += count;
        if (user) {
            if (count === 1 && !answerCount.users.includes(user)) {
                answerCount.users.push(user);
                answerCount.meVoted = user === this._client["_user"]?.id;
            } else if (count === -1 && answerCount.users.includes(user)) {
                answerCount.users.splice(answerCount.users.indexOf(user), 1);
                if (user === this._client["_user"]?.id) {
                    answerCount.meVoted = false;
                }
            }
        }
    }

    /** @internal */
    updateThread<T extends Types.Channels.AnyThreadChannel>(threadData: Types.Channels.RawThreadChannel): T {
        const guild = this._client.guilds.get(threadData.guild_id);
        if (guild) {
            return guild.threads.update(threadData) as T;
        }
        return Channel.from<T>(threadData, this._client);
    }
}
