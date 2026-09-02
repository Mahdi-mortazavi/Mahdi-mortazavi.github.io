#!/usr/bin/env node
/**
 * IndexNow ping. Tells Bing, Yandex, DuckDuckGo and Seznam the moment our
 * pages change, instead of waiting for them to re-crawl on their own.
 * No account or API key registration — the key below is self-issued and
 * proven by serving it at /<key>.txt.
 */
import { readFile } from 'node:fs/promises';

const HOST = 'mahdi-mortazavi.github.io';
const KEY = '776a58aa325f2e55ac016d805b5a3264';

const xml = await readFile('sitemap.xml', 'utf8');
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
if (!urlList.length) { console.log('no URLs in sitemap — nothing to ping'); process.exit(0); }

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});
// 200 = accepted, 202 = accepted but key still being validated. Both are fine.
console.log(`IndexNow: HTTP ${res.status} for ${urlList.length} URLs`);
if (res.status >= 400) {
  console.log(await res.text().catch(() => ''));
  console.log('::warning::IndexNow rejected the ping; search engines will still crawl normally');
}
