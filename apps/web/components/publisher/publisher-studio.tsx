"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleHelp, ExternalLink, Loader2, ShieldCheck } from "lucide-react";

type PublishResult = {
  platform: "twitter" | "square" | "farcaster";
  ok: boolean;
  url?: string;
  id?: string;
  error?: string;
};

function platformLabel(platform: PublishResult["platform"]): string {
  if (platform === "twitter") {
    return "X / Twitter";
  }
  if (platform === "farcaster") {
    return "Farcaster";
  }
  return "Binance Square";
}

export function PublisherStudio() {
  const [binanceApiKey, setBinanceApiKey] = useState("");
  const [twitterApiKey, setTwitterApiKey] = useState("");
  const [twitterApiSecret, setTwitterApiSecret] = useState("");
  const [twitterAccessToken, setTwitterAccessToken] = useState("");
  const [twitterAccessSecret, setTwitterAccessSecret] = useState("");
  const [neynarApiKey, setNeynarApiKey] = useState("");
  const [farcasterSignerUuid, setFarcasterSignerUuid] = useState("");
  const [text, setText] = useState("");
  const [publishToTwitter, setPublishToTwitter] = useState(true);
  const [publishToBinance, setPublishToBinance] = useState(true);
  const [publishToFarcaster, setPublishToFarcaster] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [responseNotice, setResponseNotice] = useState("");
  const [results, setResults] = useState<PublishResult[]>([]);
  const [errorText, setErrorText] = useState("");

  const publishDisabled = useMemo(() => {
    if (!text.trim()) {
      return true;
    }
    if (!publishToTwitter && !publishToBinance && !publishToFarcaster) {
      return true;
    }
    if (publishToBinance && !binanceApiKey.trim()) {
      return true;
    }
    if (
      publishToTwitter &&
      (!twitterApiKey.trim() ||
        !twitterApiSecret.trim() ||
        !twitterAccessToken.trim() ||
        !twitterAccessSecret.trim())
    ) {
      return true;
    }
    if (publishToFarcaster && (!neynarApiKey.trim() || !farcasterSignerUuid.trim())) {
      return true;
    }
    return false;
  }, [
    binanceApiKey,
    farcasterSignerUuid,
    neynarApiKey,
    publishToBinance,
    publishToFarcaster,
    publishToTwitter,
    text,
    twitterAccessSecret,
    twitterAccessToken,
    twitterApiKey,
    twitterApiSecret,
  ]);

  async function handlePublish() {
    setErrorText("");
    setResponseNotice("");
    setResults([]);
    setIsPublishing(true);

    try {
      const response = await fetch("/api/publisher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          publishTo: {
            twitter: publishToTwitter,
            binance: publishToBinance,
            farcaster: publishToFarcaster,
          },
          credentials: {
            binanceApiKey,
            twitterApiKey,
            twitterApiSecret,
            twitterAccessToken,
            twitterAccessSecret,
            neynarApiKey,
            farcasterSignerUuid,
          },
        }),
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
        notice?: string;
        results?: PublishResult[];
      };

      if (!response.ok && !payload.results) {
        setErrorText(payload.error ?? "Publish failed");
        return;
      }

      setResponseNotice(payload.notice ?? "");
      setResults(payload.results ?? []);
      if (!payload.ok && !payload.results?.length) {
        setErrorText(payload.error ?? "Publish failed");
      }
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Publish failed");
    } finally {
      setIsPublishing(false);
    }
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-5xl space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">Web Publisher</h1>
          <p className="text-zinc-400 text-lg">
            输入你自己的 X API、Binance API、Farcaster 参数，直接发布同一条内容到多个平台。
          </p>
          <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
            <ShieldCheck className="w-4 h-4" />
            我们不会存储你的 API Key 或 Token，只用于当前这次发布请求。
          </div>
        </div>

        <Card className="border-zinc-700/80 bg-zinc-900/70">
          <CardHeader>
            <CardTitle className="text-white text-xl flex items-center gap-2">
              <CircleHelp className="w-5 h-5 text-primary" />
              不懂如何获取 API？
            </CardTitle>
            <CardDescription>点击下方按钮查看 X / Binance / Farcaster 的配置步骤。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="dark" onClick={() => setShowGuide((value) => !value)}>
              {showGuide ? "收起教程" : "点击这里查看 API 配置教程"}
            </Button>
            {showGuide ? (
              <div className="grid md:grid-cols-3 gap-4">
                <div className="rounded-lg border border-zinc-700 bg-zinc-900/60 p-4 space-y-3">
                  <h3 className="text-white font-semibold">X / Twitter API</h3>
                  <ol className="text-sm text-zinc-300 space-y-2 list-decimal pl-4">
                    <li>进入 X Developer Portal 创建 App。</li>
                    <li>将权限设置为 Read and Write。</li>
                    <li>生成并复制 API Key、API Secret。</li>
                    <li>生成并复制 Access Token、Access Token Secret。</li>
                  </ol>
                  <a
                    href="https://developer.x.com/en/portal/dashboard"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:text-[#FCD535]/80 text-sm"
                  >
                    前往 X Developer Portal
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <div className="rounded-lg border border-zinc-700 bg-zinc-900/60 p-4 space-y-3">
                  <h3 className="text-white font-semibold">Binance Square API</h3>
                  <ol className="text-sm text-zinc-300 space-y-2 list-decimal pl-4">
                    <li>在 Binance Square Open API 页面申请 API Key。</li>
                    <li>确认账号有发布权限。</li>
                    <li>复制 API Key 到下方输入框。</li>
                  </ol>
                  <a
                    href="https://developers.binance.com/docs/binance-spot-api-docs/faqs"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:text-[#FCD535]/80 text-sm"
                  >
                    查看 Binance 文档入口
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <div className="rounded-lg border border-zinc-700 bg-zinc-900/60 p-4 space-y-3">
                  <h3 className="text-white font-semibold">Farcaster (Neynar)</h3>
                  <ol className="text-sm text-zinc-300 space-y-2 list-decimal pl-4">
                    <li>注册 Neynar 并创建应用，获取 API Key。</li>
                    <li>创建 signer request 并在 Warpcast 批准。</li>
                    <li>拿到 signer_uuid 后填入下方输入框。</li>
                  </ol>
                  <a
                    href="https://docs.neynar.com/docs/write-to-farcaster-with-neynar-managed-signers"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:text-[#FCD535]/80 text-sm"
                  >
                    查看 Farcaster 接入教程
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-white text-2xl">API Credentials</CardTitle>
            <CardDescription>每个用户填写自己的凭证，发布时仅使用当前输入。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <label className="space-y-2">
                <span className="text-sm text-zinc-300">Binance API Key</span>
                <input
                  type="password"
                  value={binanceApiKey}
                  onChange={(event) => setBinanceApiKey(event.target.value)}
                  placeholder="BINANCE_SQUARE_API_KEY"
                  className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-primary"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-zinc-300">X API Key</span>
                <input
                  type="password"
                  value={twitterApiKey}
                  onChange={(event) => setTwitterApiKey(event.target.value)}
                  placeholder="TWITTER_API_KEY"
                  className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-primary"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-zinc-300">X API Secret</span>
                <input
                  type="password"
                  value={twitterApiSecret}
                  onChange={(event) => setTwitterApiSecret(event.target.value)}
                  placeholder="TWITTER_API_SECRET"
                  className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-primary"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-zinc-300">X Access Token</span>
                <input
                  type="password"
                  value={twitterAccessToken}
                  onChange={(event) => setTwitterAccessToken(event.target.value)}
                  placeholder="TWITTER_ACCESS_TOKEN"
                  className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-primary"
                />
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm text-zinc-300">X Access Token Secret</span>
                <input
                  type="password"
                  value={twitterAccessSecret}
                  onChange={(event) => setTwitterAccessSecret(event.target.value)}
                  placeholder="TWITTER_ACCESS_SECRET"
                  className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-primary"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-zinc-300">Neynar API Key</span>
                <input
                  type="password"
                  value={neynarApiKey}
                  onChange={(event) => setNeynarApiKey(event.target.value)}
                  placeholder="NEYNAR_API_KEY"
                  className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-primary"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm text-zinc-300">Farcaster Signer UUID</span>
                <input
                  type="password"
                  value={farcasterSignerUuid}
                  onChange={(event) => setFarcasterSignerUuid(event.target.value)}
                  placeholder="FARCASTER_SIGNER_UUID"
                  className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-primary"
                />
              </label>
            </div>

            <div className="flex flex-wrap gap-6">
              <label className="inline-flex items-center gap-2 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={publishToTwitter}
                  onChange={(event) => setPublishToTwitter(event.target.checked)}
                  className="accent-primary"
                />
                发布到 X / Twitter
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={publishToBinance}
                  onChange={(event) => setPublishToBinance(event.target.checked)}
                  className="accent-primary"
                />
                发布到 Binance Square
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={publishToFarcaster}
                  onChange={(event) => setPublishToFarcaster(event.target.checked)}
                  className="accent-primary"
                />
                发布到 Farcaster
              </label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-white text-2xl">Publish Content</CardTitle>
            <CardDescription>写一条内容，点击发布即可同步到已勾选平台。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              rows={8}
              placeholder="在这里输入你要发布的内容..."
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-3 text-sm text-zinc-100 outline-none focus:border-primary"
            />
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-zinc-500">建议控制在 280 字符内，确保 X 发布稳定。</p>
              <Button
                variant="binance"
                size="lg"
                onClick={handlePublish}
                disabled={publishDisabled || isPublishing}
                className="gap-2"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  "发布到所选平台"
                )}
              </Button>
            </div>

            {errorText ? (
              <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {errorText}
              </div>
            ) : null}

            {responseNotice ? (
              <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
                {responseNotice}
              </div>
            ) : null}

            {results.length ? (
              <div className="space-y-2">
                {results.map((result) => (
                  <div
                    key={result.platform}
                    className="rounded-md border border-zinc-700 bg-zinc-900/80 px-3 py-2 text-sm text-zinc-200"
                  >
                    <div className="font-medium text-white">{platformLabel(result.platform)}</div>
                    <div className={result.ok ? "text-emerald-300" : "text-red-300"}>
                      {result.ok ? "发布成功" : `发布失败：${result.error ?? "Unknown error"}`}
                    </div>
                    {result.url ? (
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:text-[#FCD535]/80 text-xs"
                      >
                        打开结果链接
                      </a>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
