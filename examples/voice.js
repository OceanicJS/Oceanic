const { Client } = require("oceanic.js");
const { VoiceConnectionStatus, AudioPlayerStatus, createAudioPlayer, createAudioResource } = require("@discordjs/voice");

const client = new Client({
    auth: "Bot [TOKEN]",
    gateway: {
        intents: ["GUILDS", "GUILD_VOICE_STATES"] // Voice connections require the GUILDS intent; We specify the GUILD_VOICE_STATES intent to reconnect to the voice channel in case we get disconnected
    }
});

client.on("ready", () => {
    console.log("Ready as", client.user.tag);

    const guild = client.guilds.get("1005489770278953112"); // We need the guild to get the voiceAdapterCreator

    const voiceConnection = client.joinVoiceChannel({
        channelID: "1005489770849382443", // The ID of the channel to connect to
        guildID: "1005489770278953112", // The ID of the guild the channel belongs to
        selfDeaf: true, // Whether our client joins defeaned
        selfMute: false, // Whether our client joins muted
        voiceAdapterCreator: guild.voiceAdapterCreator // The voiceAdapterCreator the guild provides
    })
    voiceConnection.on(VoiceConnectionStatus.Disconnected, () => {
        voiceConnection.rejoin(); // In case we get disconnected, rejoin
    });

    const player = createAudioPlayer(); // Create the player we will use to play audio
    voiceConnection.subscribe(player); // Subscribe the player to the voice connection to the channel we have

    player.on(AudioPlayerStatus.Playing, () => {
        console.log("Audio started playing");
    });
    player.on(AudioPlayerStatus.Idle, () => {
        console.log("The player is not playing any audio");
    })

    const audio = createAudioResource(`${__dirname}/audio.mp3`); // Create the audio resource from the mp3 we have to play through the player
    player.play(audio); // Play the audio
});

// An error handler
client.on("error", (error) => {
    console.error("Something went wrong:", error);
});

// Connect to Discord
client.connect();
