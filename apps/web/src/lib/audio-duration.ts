/**
 * Reads how long an uploaded clip plays, from its container, without
 * decoding: transcription is billed by duration, and a size cap alone can't
 * bound that (Opus DTX sends almost nothing during silence). Returns
 * undefined when the length can't be read, so the caller assumes the worst.
 */

/** WAV: data chunk size divided by the byte rate in the fmt chunk. */
const wavSeconds = (audio: Buffer): number | undefined => {
  if (
    audio.toString("ascii", 0, 4) !== "RIFF" ||
    audio.toString("ascii", 8, 12) !== "WAVE"
  ) {
    return undefined;
  }

  let offset = 12;
  let byteRate: number | undefined;

  while (offset + 8 <= audio.length) {
    const id = audio.toString("ascii", offset, offset + 4);
    const size = audio.readUInt32LE(offset + 4);

    if (id === "fmt " && offset + 16 <= audio.length) {
      byteRate = audio.readUInt32LE(offset + 16);
    }

    if (id === "data" && byteRate) {
      // A streamed WAV may claim a huge size; the bytes actually sent bound it.
      const bytes = Math.min(size, audio.length - offset - 8);

      return bytes / byteRate;
    }

    offset += 8 + size + (size % 2);
  }

  return undefined;
};

/** Every offset where `marker` occurs. */
const offsetsOf = (audio: Buffer, marker: Buffer | string) => {
  const found: number[] = [];
  let at = audio.indexOf(marker);

  while (at >= 0) {
    found.push(at);
    at = audio.indexOf(marker, at + 1);
  }

  return found;
};

/** Ogg page header: the "first page of a stream" flag, and where the payload starts. */
const OGG_BOS_FLAG = 0x02;

const oggPayloadStart = (audio: Buffer, page: number) =>
  page + 27 + (audio[page + 26] ?? 0);

/**
 * Ogg Opus: a page's granule position is its sample count at 48 kHz. Granules
 * restart in each logical stream of a chained file, so the largest granule is
 * taken per stream (by serial number) and the streams are added up; using
 * the largest per stream also means a forged last page can't shorten it.
 */
const oggSeconds = (audio: Buffer): number | undefined => {
  if (audio.toString("ascii", 0, 4) !== "OggS") {
    return undefined;
  }

  const perStream = new Map<number, bigint>();

  for (const page of offsetsOf(audio, "OggS")) {
    if (page + 27 <= audio.length) {
      const granule = audio.readBigUInt64LE(page + 6);
      const serial = audio.readUInt32LE(page + 14);

      const firstPage =
        Math.floor((audio[page + 5] ?? 0) / OGG_BOS_FLAG) % 2 === 1;

      // Only Opus counts granules at 48 kHz (Vorbis, FLAC... use their own
      // rate). Any other codec: length unknown, so the caller assumes the worst.
      if (firstPage) {
        const start = oggPayloadStart(audio, page);

        if (audio.toString("ascii", start, start + 8) !== "OpusHead") {
          return undefined;
        }
      }

      // -1 marks a page with no completed packet.
      if (
        granule !== 0xff_ff_ff_ff_ff_ff_ff_ffn &&
        granule > (perStream.get(serial) ?? 0n)
      ) {
        perStream.set(serial, granule);
      }
    }
  }

  let samples = 0n;

  for (const granule of perStream.values()) {
    samples += granule;
  }

  return samples > 0n ? Number(samples) / 48_000 : undefined;
};

/** An EBML variable-length integer: its value and how many bytes it used. */
const readVint = (audio: Buffer, offset: number) => {
  const first = audio[offset];

  if (first === undefined || first === 0) {
    return;
  }

  const length = Math.clz32(first) - 23;

  if (offset + length > audio.length) {
    return;
  }

  // Drop the length-marker bit, the highest set bit of the first byte.
  let value = first - 2 ** (8 - length);

  for (let i = 1; i < length; i += 1) {
    value = value * 256 + (audio[offset + i] ?? 0);
  }

  return { length, value };
};

const EBML_ID = Buffer.from([0x1a, 0x45, 0xdf, 0xa3]);
const TIMECODE_SCALE_ID = Buffer.from([0x2a, 0xd7, 0xb1]);
const CLUSTER_ID = Buffer.from([0x1f, 0x43, 0xb6, 0x75]);
const TIMECODE_ID = 0xe7;

/**
 * Within a cluster, block timestamps are 16-bit offsets in milliseconds, so
 * no block plays more than ~32.8 s after its cluster's timecode.
 */
const MAX_BLOCK_OFFSET_SECONDS = 32.8;

/** The default WebM TimecodeScale: 1,000,000 ns, i.e. timecodes in milliseconds. */
const DEFAULT_TIMECODE_SCALE = 1_000_000;

/** True if the file declares a TimecodeScale other than the default (or one we can't read). */
const hasCustomTimecodeScale = (audio: Buffer) => {
  const at = audio.indexOf(TIMECODE_SCALE_ID);

  if (at === -1) {
    return false;
  }

  const size = readVint(audio, at + 3);

  if (!size || size.value > 8) {
    return true;
  }

  const start = at + 3 + size.length;
  let scale = 0;

  for (let i = 0; i < size.value; i += 1) {
    scale = scale * 256 + (audio[start + i] ?? 0);
  }

  return scale !== DEFAULT_TIMECODE_SCALE;
};

/** The timecode (ms) at the start of the cluster at `cluster`, if well formed. */
const clusterTimecode = (audio: Buffer, cluster: number) => {
  const size = readVint(audio, cluster + 4);

  if (!size) {
    return;
  }

  const timecodeAt = cluster + 4 + size.length;

  if (audio[timecodeAt] !== TIMECODE_ID) {
    return;
  }

  const timecodeSize = readVint(audio, timecodeAt + 1);

  if (!timecodeSize || timecodeSize.value > 6) {
    return;
  }

  const start = timecodeAt + 1 + timecodeSize.length;
  let timecode = 0;

  for (let i = 0; i < timecodeSize.value; i += 1) {
    timecode = timecode * 256 + (audio[start + i] ?? 0);
  }

  return timecode;
};

/**
 * WebM from MediaRecorder: no Duration header, but every cluster starts with
 * its timecode (ms at the default scale MediaRecorder uses). The largest
 * cluster timecode plus the largest block offset bounds the length.
 */
const webmSeconds = (audio: Buffer): number | undefined => {
  if (audio.readUInt32BE(0) !== 0x1a_45_df_a3) {
    return undefined;
  }

  // Several concatenated segments restart their timecodes, and a custom
  // TimecodeScale changes their unit from milliseconds. MediaRecorder writes
  // neither, so either one means "length unknown" (the caller assumes the worst).
  if (offsetsOf(audio, EBML_ID).length > 1 || hasCustomTimecodeScale(audio)) {
    return undefined;
  }

  const timecodes = offsetsOf(audio, CLUSTER_ID).flatMap((cluster) => {
    const timecode = clusterTimecode(audio, cluster);

    return timecode === undefined ? [] : [timecode];
  });

  if (timecodes.length === 0) {
    return undefined;
  }

  return Math.max(...timecodes) / 1000 + MAX_BLOCK_OFFSET_SECONDS;
};

const READERS = new Map([
  ["ogg", oggSeconds],
  ["wav", wavSeconds],
  ["webm", webmSeconds],
]);

/** Seconds of audio in the clip, as an upper bound, or undefined if unknown. */
export const audioSeconds = (
  audio: Buffer,
  format: string
): number | undefined => {
  const read = READERS.get(format);

  return audio.length >= 12 && read ? read(audio) : undefined;
};
