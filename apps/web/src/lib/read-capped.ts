/**
 * A request body read with a hard size limit, shared by the tutor, share and
 * transcription routes: the bytes, or undefined once they pass `maxBytes`
 * (read no further). A declared Content-Length over the limit is refused
 * before reading. A stream that fails mid-read comes back empty, so callers
 * fail validation with their usual 400.
 */
export const readCappedBytes = async (
  request: Request,
  maxBytes: number
): Promise<Buffer | undefined> => {
  const declared = Number(request.headers.get("content-length") ?? 0);

  if (declared > maxBytes || !request.body) {
    return declared > maxBytes ? undefined : Buffer.alloc(0);
  }

  const reader = request.body.getReader();
  // Raw chunks are collected and joined once, so tiny chunks cost no copying.
  const chunks: Uint8Array[] = [];

  const pump = async (bytes: number): Promise<Buffer | undefined> => {
    const chunk = await reader.read();

    if (chunk.done) {
      return Buffer.concat(chunks);
    }

    const total = bytes + chunk.value.byteLength;

    if (total > maxBytes) {
      await reader.cancel();

      return undefined;
    }

    chunks.push(chunk.value);

    return pump(total);
  };

  try {
    return await pump(0);
  } catch {
    return Buffer.alloc(0);
  }
};

/** The body as UTF-8 text, with the same limit and failure rules as readCappedBytes. */
export const readCapped = async (
  request: Request,
  maxBytes: number
): Promise<string | undefined> => {
  const bytes = await readCappedBytes(request, maxBytes);

  return bytes?.toString("utf-8");
};

export const plain = (
  status: number,
  message: string,
  headers: HeadersInit = {}
) =>
  new Response(message, {
    headers: { "Content-Type": "text/plain; charset=utf-8", ...headers },
    status,
  });
