import crypto from "node:crypto";
import { NextResponse } from "next/server";

const BINANCE_PUBLISH_URL =
  "https://www.binance.com/bapi/composite/v1/public/pgc/openApi/content/add";
const TWITTER_PUBLISH_URL = "https://api.x.com/2/tweets";
const FARCASTER_PUBLISH_URL = "https://api.neynar.com/v2/farcaster/cast";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PublishResult = {
  platform: "twitter" | "square" | "farcaster";
  ok: boolean;
  httpStatus?: number;
  id?: string;
  url?: string;
  error?: string;
  detail?: unknown;
};

type PublishPayload = {
  text?: string;
  credentials?: {
    binanceApiKey?: string;
    twitterApiKey?: string;
    twitterApiSecret?: string;
    twitterAccessToken?: string;
    twitterAccessSecret?: string;
    neynarApiKey?: string;
    farcasterSignerUuid?: string;
  };
  publishTo?: {
    twitter?: boolean;
    binance?: boolean;
    farcaster?: boolean;
  };
};

function parseJsonSafely(text: string): unknown {
  if (!text.trim()) {
    return {};
  }
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

function percentEncode(value: string): string {
  return encodeURIComponent(value).replace(/[!*'()]/g, (char) =>
    `%${char.charCodeAt(0).toString(16).toUpperCase()}`
  );
}

function buildOAuth1Header(params: {
  method: string;
  url: string;
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessSecret: string;
}): string {
  const oauthParams = {
    oauth_consumer_key: params.apiKey,
    oauth_nonce: crypto.randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: params.accessToken,
    oauth_version: "1.0",
  };

  const url = new URL(params.url);
  const queryParams = Array.from(url.searchParams.entries());
  const signatureParams = [...queryParams, ...Object.entries(oauthParams)];
  signatureParams.sort((left, right) => {
    const leftPair = `${percentEncode(left[0])}=${percentEncode(left[1])}`;
    const rightPair = `${percentEncode(right[0])}=${percentEncode(right[1])}`;
    return leftPair.localeCompare(rightPair);
  });

  const normalized = signatureParams
    .map(([key, value]) => `${percentEncode(key)}=${percentEncode(value)}`)
    .join("&");

  const baseString = [
    percentEncode(params.method.toUpperCase()),
    percentEncode(`${url.protocol}//${url.host}${url.pathname}`),
    percentEncode(normalized),
  ].join("&");

  const signingKey = `${percentEncode(params.apiSecret)}&${percentEncode(params.accessSecret)}`;
  const signature = crypto
    .createHmac("sha1", signingKey)
    .update(baseString)
    .digest("base64");

  const signedParams = { ...oauthParams, oauth_signature: signature };
  return (
    "OAuth " +
    Object.entries(signedParams)
      .map(([key, value]) => `${percentEncode(key)}="${percentEncode(value)}"`)
      .join(", ")
  );
}

async function publishTwitter(text: string, creds: Required<NonNullable<PublishPayload["credentials"]>>): Promise<PublishResult> {
  const authorization = buildOAuth1Header({
    method: "POST",
    url: TWITTER_PUBLISH_URL,
    apiKey: creds.twitterApiKey,
    apiSecret: creds.twitterApiSecret,
    accessToken: creds.twitterAccessToken,
    accessSecret: creds.twitterAccessSecret,
  });

  const response = await fetch(TWITTER_PUBLISH_URL, {
    method: "POST",
    headers: {
      Authorization: authorization,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
    cache: "no-store",
  });

  const rawBody = await response.text();
  const body = parseJsonSafely(rawBody) as Record<string, unknown>;
  const data = body?.data as Record<string, unknown> | undefined;
  const tweetId = data?.id ? String(data.id) : undefined;

  if (response.ok && tweetId) {
    return {
      platform: "twitter",
      ok: true,
      httpStatus: response.status,
      id: tweetId,
      url: `https://x.com/i/web/status/${tweetId}`,
    };
  }

  return {
    platform: "twitter",
    ok: false,
    httpStatus: response.status,
    error:
      typeof body?.detail === "string"
        ? body.detail
        : typeof body?.title === "string"
          ? body.title
          : "Twitter publish failed",
    detail: body,
  };
}

async function publishSquare(text: string, apiKey: string): Promise<PublishResult> {
  const response = await fetch(BINANCE_PUBLISH_URL, {
    method: "POST",
    headers: {
      "X-Square-OpenAPI-Key": apiKey,
      clienttype: "binanceSkill",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ bodyTextOnly: text }),
    cache: "no-store",
  });

  const rawBody = await response.text();
  const body = parseJsonSafely(rawBody) as Record<string, unknown>;
  const code = typeof body?.code === "string" ? body.code : "";
  const data = body?.data as Record<string, unknown> | undefined;
  const postId = data?.id ? String(data.id) : undefined;

  if (response.ok && code === "000000") {
    return {
      platform: "square",
      ok: true,
      httpStatus: response.status,
      id: postId,
      url: postId ? `https://www.binance.com/square/post/${postId}` : undefined,
    };
  }

  return {
    platform: "square",
    ok: false,
    httpStatus: response.status,
    error: typeof body?.message === "string" ? body.message : "Binance Square publish failed",
    detail: body,
  };
}

async function publishFarcaster(
  text: string,
  neynarApiKey: string,
  signerUuid: string
): Promise<PublishResult> {
  const response = await fetch(FARCASTER_PUBLISH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": neynarApiKey,
    },
    body: JSON.stringify({
      text,
      signer_uuid: signerUuid,
    }),
    cache: "no-store",
  });

  const rawBody = await response.text();
  const body = parseJsonSafely(rawBody) as Record<string, unknown>;
  const cast = body?.cast as Record<string, unknown> | undefined;
  const hash = cast?.hash ? String(cast.hash) : undefined;
  const author = cast?.author as Record<string, unknown> | undefined;
  const username = author?.username ? String(author.username) : undefined;

  if (response.ok && hash) {
    return {
      platform: "farcaster",
      ok: true,
      httpStatus: response.status,
      id: hash,
      url: username ? `https://warpcast.com/${username}/${hash}` : undefined,
    };
  }

  return {
    platform: "farcaster",
    ok: false,
    httpStatus: response.status,
    error:
      typeof body?.message === "string"
        ? body.message
        : typeof body?.error === "string"
          ? body.error
          : "Farcaster publish failed",
    detail: body,
  };
}

export async function POST(request: Request) {
  let payload: PublishPayload;
  try {
    payload = (await request.json()) as PublishPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON payload" },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  const text = (payload.text ?? "").trim();
  if (!text) {
    return NextResponse.json(
      { ok: false, error: "Text is required" },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  const publishToTwitter = payload.publishTo?.twitter ?? true;
  const publishToBinance = payload.publishTo?.binance ?? true;
  const publishToFarcaster = payload.publishTo?.farcaster ?? false;
  if (!publishToTwitter && !publishToBinance && !publishToFarcaster) {
    return NextResponse.json(
      { ok: false, error: "Select at least one platform" },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  const credentials = payload.credentials ?? {};
  const normalizedCreds = {
    binanceApiKey: (credentials.binanceApiKey ?? "").trim(),
    twitterApiKey: (credentials.twitterApiKey ?? "").trim(),
    twitterApiSecret: (credentials.twitterApiSecret ?? "").trim(),
    twitterAccessToken: (credentials.twitterAccessToken ?? "").trim(),
    twitterAccessSecret: (credentials.twitterAccessSecret ?? "").trim(),
    neynarApiKey: (credentials.neynarApiKey ?? "").trim(),
    farcasterSignerUuid: (credentials.farcasterSignerUuid ?? "").trim(),
  };

  if (publishToBinance && !normalizedCreds.binanceApiKey) {
    return NextResponse.json(
      { ok: false, error: "BINANCE API Key is required for Binance publish" },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  if (
    publishToTwitter &&
    (!normalizedCreds.twitterApiKey ||
      !normalizedCreds.twitterApiSecret ||
      !normalizedCreds.twitterAccessToken ||
      !normalizedCreds.twitterAccessSecret)
  ) {
    return NextResponse.json(
      { ok: false, error: "Twitter API credentials are incomplete" },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  if (publishToFarcaster && (!normalizedCreds.neynarApiKey || !normalizedCreds.farcasterSignerUuid)) {
    return NextResponse.json(
      { ok: false, error: "Neynar API Key and Farcaster Signer UUID are required" },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  const tasks: Promise<PublishResult>[] = [];
  if (publishToTwitter) {
    tasks.push(
      publishTwitter(text, normalizedCreds).catch((error: unknown) => ({
        platform: "twitter",
        ok: false,
        error: error instanceof Error ? error.message : "Unexpected publish error",
      }))
    );
  }
  if (publishToBinance) {
    tasks.push(
      publishSquare(text, normalizedCreds.binanceApiKey).catch((error: unknown) => ({
        platform: "square",
        ok: false,
        error: error instanceof Error ? error.message : "Unexpected publish error",
      }))
    );
  }
  if (publishToFarcaster) {
    tasks.push(
      publishFarcaster(text, normalizedCreds.neynarApiKey, normalizedCreds.farcasterSignerUuid).catch(
        (error: unknown) => ({
          platform: "farcaster",
          ok: false,
          error: error instanceof Error ? error.message : "Unexpected publish error",
        })
      )
    );
  }

  const results = await Promise.all(tasks);
  const allOk = results.every((item) => item.ok);

  return NextResponse.json(
    {
      ok: allOk,
      results,
      notice:
        "Credentials are used only for this request. SyncX does not persist your API keys or tokens.",
    },
    { status: allOk ? 200 : 207, headers: { "Cache-Control": "no-store" } }
  );
}
