/**
 * The body as text, or undefined once it passes `maxBytes` (read no
 * further). A stream that fails mid-read comes back empty, so it fails
 * validation with the usual 400.
 */
export const readCapped = async (
  request: Request,
  maxBytes: number
): Promise<string | undefined> => {
  const declared = Number(request.headers.get("content-length") ?? 0);

  if (declared > maxBytes || !request.body) {
    return declared > maxBytes ? undefined : "";
  }

  const reader = request.body.getReader();
  // Raw chunks are collected and decoded once, so tiny chunks cost no copying.
  const chunks: Uint8Array[] = [];

  const pump = async (bytes: number): Promise<string | undefined> => {
    const chunk = await reader.read();

    if (chunk.done) {
      return Buffer.concat(chunks).toString("utf-8");
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
    return "";
  }
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
