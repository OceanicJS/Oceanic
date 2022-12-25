/** @module Util */
import { CDN_URL } from "./Routes";
import type Client from "../Client";
import type { ImageFormat } from "../Constants";
import {
    ButtonStyles,
    ComponentTypes,
    ImageFormats,
    MAX_IMAGE_SIZE,
    MIN_IMAGE_SIZE
} from "../Constants";
import type {
    AllowedMentions,
    AnyChannel,
    AnyGuildChannelWithoutThreads,
    AnyThreadChannel,
    Component,
    Embed,
    EmbedOptions,
    MessageActionRow,
    ModalActionRow,
    RawAllowedMentions,
    RawChannel,
    RawComponent,
    RawEmbed,
    RawEmbedOptions,
    RawGuildChannel,
    RawMessageActionRow,
    RawModalActionRow,
    RawThreadChannel,
    ToComponentFromRaw,
    ToRawFromComponent
} from "../types/channels";
import type { RawMember, RawSticker, RESTMember, Sticker } from "../types/guilds";
import type { ApplicationCommandOptions, CombinedApplicationCommandOption, RawApplicationCommandOption } from "../types/application-commands";
import Member from "../structures/Member";
import Channel from "../structures/Channel";

/** A general set of utilities. These are intentionally poorly documented, as they serve almost no usefulness to outside developers. */
export default class Util {
    static BASE64URL_REGEX = /^data:image\/(?:jpeg|png|gif);base64,(?:[\d+/A-Za-z]{4})*(?:[\d+/A-Za-z]{2}(==)?|[\d+/A-Za-z]{3}=?)?$/;
    #client: Client;

    constructor(client: Client) {
        this.#client = client;
    }

    /** @hidden intentionally not documented - this is an internal function */
    _convertImage(image: Buffer | string, name: string): string {
        try {
            return this.convertImage(image);
        } catch (err) {
            throw new Error(`Invalid ${name} provided. Ensure you are providing a valid, fully-qualified base64 url.`, { cause: err as Error });
        }
    }

    componentToParsed<T extends RawComponent>(component: T): ToComponentFromRaw<T> {
        switch (component.type) {
            case ComponentTypes.BUTTON: {
                return (component.style === ButtonStyles.LINK ? component : {
                    customID: component.custom_id,
                    disabled: component.disabled,
                    emoji:    component.emoji,
                    label:    component.label,
                    style:    component.style,
                    type:     component.type
                }) as never;
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
                const parsedComponent = {
                    customID:    component.custom_id,
                    disabled:    component.disabled,
                    maxValues:   component.max_values,
                    minValues:   component.min_values,
                    placeholder: component.placeholder,
                    type:        component.type
                };

                if (component.type === ComponentTypes.STRING_SELECT) {
                    return { ...parsedComponent, options: component.options } as never;
                } else if (component.type === ComponentTypes.CHANNEL_SELECT) {
                    return { ...parsedComponent, channelTypes: component.channel_types } as never;
                } else {
                    return parsedComponent as never;
                }
            }
            default: {
                return component as never;
            }
        }
    }

    componentToRaw<T extends Component>(component: T): ToRawFromComponent<T> {
        switch (component.type) {
            case ComponentTypes.BUTTON: {
                return (component.style === ButtonStyles.LINK ? component : {
                    custom_id: component.customID,
                    disabled:  component.disabled,
                    emoji:     component.emoji,
                    label:     component.label,
                    style:     component.style,
                    type:      component.type
                }) as never;
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
                    type:        component.type
                };

                if (component.type === ComponentTypes.STRING_SELECT) {
                    return { ...rawComponent, options: component.options } as never;
                } else if (component.type === ComponentTypes.CHANNEL_SELECT) {
                    return { ...rawComponent, channel_types: component.channelTypes } as never;
                } else {
                    return rawComponent as never;
                }
            }
            default: {
                return component as never;
            }
        }
    }

    componentsToParsed<T extends RawModalActionRow | RawMessageActionRow>(components: Array<T>): T extends RawModalActionRow ? Array<ModalActionRow> : T extends RawMessageActionRow ? Array<MessageActionRow> : never {
        return components.map(row => ({
            type:       row.type,
            components: row.components.map(component => this.componentToParsed(component))
        })) as never;
    }

    componentsToRaw<T extends ModalActionRow | MessageActionRow>(components: Array<T>): T extends ModalActionRow ? Array<RawModalActionRow> : T extends MessageActionRow ? Array<RawMessageActionRow> : never {
        return components.map(row => ({
            type:       row.type,
            components: row.components.map(component => this.componentToRaw(component))
        })) as never;
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
                // FF D8 FF DB
                ["image/jpeg", /^FFD8FFDB/],
                // FF D8 FF E0 00 10 4A 46 49 46 00 01
                ["image/jpeg", /^FFD8FFE000104A4649460001/],
                // 49 46 00 01
                ["image/jpeg", /^49460001/],
                // FF D8 FF EE
                ["image/jpeg", /^FFD8FFEE/],
                // FF D8 FF E1 ?? ?? 45 78 69 66 00 00
                ["image/jpeg", /^FFD8FFE1[\dA-F]{4}457869660000/],
                // 52 49 46 46 ?? ?? ?? ?? 57 45 42 50
                ["image/webp", /^52494646\d{8}57454250/]
            ];
            for (const format of magicMap) {
                if (format[1].test(this.getMagic(img, 16))) {
                    mime = format[0];
                    break;
                }
            }
            if (!mime) {
                throw new Error(`Failed to determine image format. (magic: ${this.getMagic(img, 16)})`);
            }
            img = `data:${mime};base64,${b64}`;
        }
        if (!Util.BASE64URL_REGEX.test(img)) {
            throw new Error("Invalid image provided. Ensure you are providing a valid, fully-qualified base64 url.");
        }
        return img;
    }

    convertSticker(raw: RawSticker): Sticker {
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
            user:        raw.user ? this.#client.users.update(raw.user) : undefined
        };
    }

    embedsToParsed(embeds: Array<RawEmbed>): Array<Embed> {
        return embeds.map(embed => ({
            author: embed.author !== undefined ? {
                name:         embed.author.name,
                iconURL:      embed.author.icon_url,
                proxyIconURL: embed.author.proxy_icon_url
            } : undefined,
            color:       embed.color,
            description: embed.description,
            fields:      embed.fields?.map(field => ({
                inline: field.inline,
                name:   field.name,
                value:  field.value
            })),
            footer: embed.footer !== undefined ? {
                text:         embed.footer.text,
                iconURL:      embed.footer.icon_url,
                proxyIconURL: embed.footer.proxy_icon_url
            } : undefined,
            timestamp: embed.timestamp,
            title:     embed.title,
            image:     embed.image !== undefined ? {
                url:      embed.image.url,
                height:   embed.image.height,
                proxyURL: embed.image.proxy_url,
                width:    embed.image.width
            } : undefined,
            provider: embed.provider !== undefined ? {
                name: embed.provider.name,
                url:  embed.provider.url
            } : undefined,
            thumbnail: embed.thumbnail !== undefined ? {
                url:      embed.thumbnail.url,
                height:   embed.thumbnail.height,
                proxyURL: embed.thumbnail.proxy_url,
                width:    embed.thumbnail.width
            } : undefined,
            url:   embed.url,
            type:  embed.type,
            video: embed.video !== undefined ? {
                height:   embed.video.height,
                proxyURL: embed.video.proxy_url,
                url:      embed.video.url,
                width:    embed.video.width
            } : undefined
        }));
    }

    embedsToRaw(embeds: Array<EmbedOptions>): Array<RawEmbedOptions> {
        return embeds.map(embed => ({
            author: embed.author !== undefined ? {
                name:     embed.author.name,
                icon_url: embed.author.iconURL,
                url:      embed.author.url
            } :  undefined,
            color:       embed.color,
            description: embed.description,
            fields:      embed.fields?.map(field => ({
                inline: field.inline,
                name:   field.name,
                value:  field.value
            })),
            footer: embed.footer !== undefined ? {
                text:     embed.footer.text,
                icon_url: embed.footer.iconURL
            } : undefined,
            timestamp: embed.timestamp,
            title:     embed.title,
            image:     embed.image !== undefined ? { url: embed.image.url } : undefined,
            thumbnail: embed.thumbnail !== undefined ? { url: embed.thumbnail.url } : undefined,
            url:       embed.url
        }));
    }

    formatAllowedMentions(allowed?: AllowedMentions): RawAllowedMentions {
        const result: RawAllowedMentions = { parse: [] };

        if (!allowed) {
            return this.formatAllowedMentions(this.#client.options.allowedMentions);
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
            format = url.includes("/a_") ? "gif" : this.#client.options.defaultImageFormat;
        }
        if (!size || size < MIN_IMAGE_SIZE || size > MAX_IMAGE_SIZE) {
            size = this.#client.options.defaultImageSize;
        }
        return `${CDN_URL}${url}.${format}?size=${size}`;
    }

    getMagic(file: Buffer, len = 4): string {
        return [...new Uint8Array(file.subarray(0, len))].map(b => b.toString(16).padStart(2, "0")).join("").toUpperCase();
    }

    optionToParsed(option: RawApplicationCommandOption): ApplicationCommandOptions {
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
        } as ApplicationCommandOptions;
    }

    optionToRaw(option: ApplicationCommandOptions): RawApplicationCommandOption {
        const opt = option as CombinedApplicationCommandOption;
        return {
            autocomplete:              opt.autocomplete,
            channel_types:             opt.channelTypes,
            choices:                   opt.choices,
            description:               opt.description,
            description_localizations: opt.descriptionLocalizations,
            max_length:                opt.maxLength,
            max_value:                 opt.maxValue,
            min_length:                opt.minLength,
            min_value:                 opt.minValue,
            name:                      opt.name,
            name_localizations:        opt.nameLocalizations,
            options:                   opt.options?.map(o => this.optionToRaw(o as ApplicationCommandOptions)),
            required:                  opt.required,
            type:                      opt.type
        } as RawApplicationCommandOption;
    }

    updateChannel<T extends AnyChannel>(channelData: RawChannel): T {
        if (channelData.guild_id) {
            const guild = this.#client.guilds.get(channelData.guild_id);
            if (guild) {
                this.#client.channelGuildMap[channelData.id] = channelData.guild_id;
                const channel = guild.channels.has(channelData.id) ? guild.channels.update(channelData as RawGuildChannel)  : guild.channels.add(Channel.from<AnyGuildChannelWithoutThreads>(channelData, this.#client));
                return channel as T;
            }
        }
        return Channel.from<T>(channelData, this.#client);
    }

    updateMember(guildID: string, memberID: string, member: RawMember | RESTMember): Member {
        const guild = this.#client.guilds.get(guildID);
        if (guild && this.#client["_user"] && this.#client.user.id === memberID) {
            if (guild["_clientMember"]) {
                guild["_clientMember"]["update"](member);
            } else {
                guild["_clientMember"] = guild.members.update({ ...member, id: memberID }, guildID);
            }
            return guild["_clientMember"];
        }
        return guild ? guild.members.update({ ...member, id: memberID }, guildID) : new Member({ ...member, id: memberID }, this.#client, guildID);
    }

    updateThread<T extends AnyThreadChannel>(threadData: RawThreadChannel): T {
        const guild = this.#client.guilds.get(threadData.guild_id);
        if (guild) {
            this.#client.threadGuildMap[threadData.id] = threadData.guild_id;
            const thread = guild.threads.has(threadData.id) ? guild.threads.update(threadData) as T : guild.threads.add(Channel.from<T>(threadData, this.#client));
            const channel = guild.channels.get(threadData.parent_id!);
            if (channel && "threads" in channel) {
                channel.threads.update(thread as never);
            }
            return thread;
        }
        return Channel.from<T>(threadData, this.#client);
    }
}

export function is<T>(input: unknown): input is T {
    return true;
}
