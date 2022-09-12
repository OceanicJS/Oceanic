// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { DiscordGatewayAdapterCreator } from "@discordjs/voice";

export interface JoinVoiceChannelOptions {
    channelID: string;
    debug?: boolean;
    guildID: string;
    selfDeaf?: boolean;
    selfMute?: boolean;
    voiceAdapterCreator: DiscordGatewayAdapterCreator;
}
