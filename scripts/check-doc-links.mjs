// Checks that every @see link on rest methods points at an anchor that exists.
// Discord's docs are checked against the rendered page (one request per page). docs.discord.food renders client side,
// so it's checked against its llms.txt, which has the source of every page in a single file.
//
// Anchors are cached in node_modules/.cache. Entries younger than CACHE_TTL are used without a request, older ones are
// revalidated with a conditional request. Pass --no-cache to ignore the cache.
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";

const FILES = [
    ...(await readdir(new URL("../lib/routes/", import.meta.url))).filter(f => f.endsWith(".ts")).map(f => `lib/routes/${f}`),
    "lib/rest/OAuthHelper.ts",
];
const DISCORD = "https://discord.com/developers/docs/";
const FOOD = "https://docs.discord.food/";
const FOOD_LLMS = "https://docs.discord.food/llms.txt";
// both sites send max-age=3600
const CACHE_TTL = 60 * 60 * 1000;
const CACHE_DIR = new URL("../node_modules/.cache/", import.meta.url);
const CACHE_FILE = new URL("oceanic-doc-links.json", CACHE_DIR);
// bump when the cached data changes shape
const CACHE_VERSION = 1;

const useCache = !process.argv.includes("--no-cache");
let cache = {};
if (useCache) {
    try {
        const data = JSON.parse(await readFile(CACHE_FILE, "utf8"));
        if (data.version === CACHE_VERSION) {
            cache = data.entries;
        }
    } catch {}
}

const stats = { cached: 0, notModified: 0, fetched: 0 };

const inflight = new Map();
/**
 * Fetch and parse a url, reusing the cached result when possible.
 * @param {string} url
 * @param {(text: string) => unknown} parse Must return JSON-serializable data.
 * @param {boolean} [revalidate] Skip the TTL and always ask the server.
 */
async function cachedFetch(url, parse, revalidate = false) {
    // pages on docs.discord.food share one url, so concurrent lookups share one request
    const key = `${revalidate}:${url}`;
    if (!inflight.has(key)) {
        inflight.set(key, doCachedFetch(url, parse, revalidate));
    }
    return inflight.get(key);
}

async function doCachedFetch(url, parse, revalidate) {
    const entry = cache[url];
    if (entry && !revalidate && Date.now() - entry.checkedAt < CACHE_TTL) {
        stats.cached++;
        return entry.data;
    }

    const headers = {};
    if (entry?.etag) headers["If-None-Match"] = entry.etag;
    if (entry?.lastModified) headers["If-Modified-Since"] = entry.lastModified;
    const res = await fetch(url, { headers });

    if (res.status === 304 && entry) {
        stats.notModified++;
        entry.checkedAt = Date.now();
        return entry.data;
    }
    if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
    }

    stats.fetched++;
    const data = parse(await res.text());
    cache[url] = {
        checkedAt: Date.now(),
        data,
        etag: res.headers.get("etag") ?? undefined,
        lastModified: res.headers.get("last-modified") ?? undefined,
    };
    return data;
}

// mirrors getNormalisedText in discord-userdoccers
const foodSlug = title => title.trim().toLowerCase().replaceAll(" ", "-");

function parseFoodLLMs(text) {
    // each page starts with a "Link: <url>" line, followed by its source
    const parts = text.split(/^Link: (\S+)$/m);
    const pages = {};
    for (let i = 1; i < parts.length; i += 2) {
        const source = parts[i + 1];
        const titles = [
            ...Array.from(source.matchAll(/<RouteHeader[^>]*>\s*([^<]+?)\s*<\/RouteHeader>/g), m => m[1]),
            ...Array.from(source.matchAll(/^#{1,6} (.+)$/gm), m => m[1]),
        ];
        pages[parts[i].replace(/\/$/, "")] = [...new Set(titles.map(foodSlug))];
    }
    return pages;
}

const parseDiscordPage = html => [...new Set(Array.from(html.matchAll(/id="([^"]+)"/g), m => m[1]))];

async function getAnchors(page, revalidate = false) {
    if (page.startsWith(DISCORD)) {
        return new Set(await cachedFetch(page, parseDiscordPage, revalidate));
    }

    if (page.startsWith(FOOD)) {
        const anchors = (await cachedFetch(FOOD_LLMS, parseFoodLLMs, revalidate))[page];
        if (anchors === undefined) {
            throw new Error("page not found in llms.txt");
        }
        return new Set(anchors);
    }

    throw new Error("not a discord.com/developers/docs or docs.discord.food url");
}

const links = [];
for (const file of FILES) {
    const lines = (await readFile(new URL(`../${file}`, import.meta.url), "utf8")).split("\n");
    for (const [i, line] of lines.entries()) {
        const match = /@see \[[^\]]+]\(([^)]+)\)/.exec(line);
        if (match) {
            const [page, anchor] = match[1].split("#");
            links.push({ anchor, location: `${file}:${i + 1}`, page, url: match[1] });
        }
    }
}

async function check(toCheck, revalidate) {
    const pages = new Map();
    for (const { page } of toCheck) {
        if (!pages.has(page)) {
            pages.set(page, getAnchors(page, revalidate).catch(err => err));
        }
    }

    const failures = [];
    for (const link of toCheck) {
        const anchors = await pages.get(link.page);
        if (anchors instanceof Error) {
            failures.push({ ...link, reason: anchors.message });
        } else if (!link.anchor || !anchors.has(link.anchor)) {
            failures.push({ ...link, reason: "anchor not found" });
        }
    }
    return { failures, pageCount: pages.size };
}

let { failures, pageCount } = await check(links, false);
// a failure could be stale cache, so ask the servers before reporting it
if (failures.length !== 0 && stats.cached !== 0) {
    const failed = new Set(failures.map(f => f.page));
    ({ failures } = await check(links.filter(link => failed.has(link.page)), true));
}

if (useCache) {
    await mkdir(CACHE_DIR, { recursive: true });
    await writeFile(CACHE_FILE, JSON.stringify({ entries: cache, version: CACHE_VERSION }));
}

console.log(`Checked ${links.length} links on ${pageCount} pages. Made ${stats.notModified + stats.fetched} requests (${stats.notModified} not modified, ${stats.fetched} fetched), ${stats.cached} served from cache.`);
if (failures.length !== 0) {
    console.error(`${failures.length} invalid link(s):\n${failures.map(f => `  ${f.location}: ${f.url} (${f.reason})`).join("\n")}`);
    process.exitCode = 1;
}
