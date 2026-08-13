import type * as Types from "../../types/namespaced";

export function fromRaw(embed: Types.Channels.RawEmbed): Types.Channels.Embed {
    return {
        author: embed.author === undefined ? undefined : {
            name:         embed.author.name,
            iconURL:      embed.author.icon_url,
            proxyIconURL: embed.author.proxy_icon_url,
            url:          embed.author.url
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
    };
}

export function toRaw(embed: Types.Channels.EmbedOptions): Types.Channels.RawEmbed {
    return {
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
    };
}
