export const VALID_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/mp4",
  "audio/m4a",
  "audio/ogg",
  "audio/flac",
  "audio/webm",
  "video/mp4",
  "video/webm",
];

export const VALID_AUDIO_EXTENSIONS = /\.(mp3|wav|m4a|mp4|ogg|flac|webm)$/i;

export function isValidAudioFile(file: File): boolean {
  return (
    VALID_AUDIO_TYPES.includes(file.type) ||
    VALID_AUDIO_EXTENSIONS.test(file.name)
  );
}
