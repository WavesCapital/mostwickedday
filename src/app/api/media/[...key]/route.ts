import { NextRequest } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";
import { serverEnv } from "@/lib/server-env";

// Proxy every R2 object through Vercel so we never expose raw R2 creds or
// depend on a third-party public URL. /api/media/legacy/2023/xxx.jpeg →
// R2 key `legacy/2023/xxx.jpeg`.
export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ key: string[] }> },
) {
  const { key } = await ctx.params;
  const fullKey = key.join("/");

  try {
    const obj = await r2.send(
      new GetObjectCommand({
        Bucket: serverEnv().R2_BUCKET,
        Key: fullKey,
      }),
    );
    const body = obj.Body;
    if (!body) {
      return new Response("Not found", { status: 404 });
    }
    // Convert Node stream / web stream body into a passthrough Response
    const stream = body.transformToWebStream?.() ?? (body as unknown as ReadableStream);
    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": obj.ContentType ?? "application/octet-stream",
        "Content-Length": obj.ContentLength ? String(obj.ContentLength) : "",
        "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
        "X-R2-Key": fullKey,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "R2 error";
    return new Response(`Media not available: ${message}`, { status: 404 });
  }
}
