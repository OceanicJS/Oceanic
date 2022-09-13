// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { DiscordGatewayAdapterCreator } from "@discordjs/voice";

export interface JoinVoiceChannelOptions {
    /** The ID of the channel to join. */
    channelID: string;
    /** Whether debug messages are enabled. Defaults to false. */
    debug?: boolean;
    /** The ID of the guild the channel to join belongs to. */
    guildID: string;
    /** Whether to join the channel deafened. Defaults to true. */
    selfDeaf?: boolean;
    /** Whether to join the channel muted. Defaults to true. */
    selfMute?: boolean;
    /** The voice adapter creator for this voice connection. Use the \<Guild\>.voiceAdapterCreator property for this. */
    voiceAdapterCreator: DiscordGatewayAdapterCreator;
}
