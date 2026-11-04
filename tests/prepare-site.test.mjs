import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assetNames } from '../scripts/release.mjs';
import { prepareSite, releaseDownloads } from '../scripts/prepare-site.mjs';

const repository = 'Humlan25/glidehorizon-site';
function release() {
  return {
    tag_name: 'v1.0.2', draft: false, prerelease: false,
    html_url: `https://github.com/${repository}/releases/tag/v1.0.2`,
    assets: assetNames.map(name => ({
      name, state: 'uploaded', size: name.endsWith('.apk') ? 9080811 : 83,
      browser_download_url: `https://github.com/${repository}/releases/download/v1.0.2/${name}`
    }))
  };
}

test('no-release state contains no APK download link', () => {
  const html = releaseDownloads(null, repository);
  assert.match(html, /No public download currently offered/);
  assert(!html.includes('href='));
});

test('published state links versioned APK, checksum and release notes', () => {
  const metadata = release();
  const html = releaseDownloads(metadata, repository);
  for (const asset of metadata.assets) assert(html.includes(`href="${asset.browser_download_url}"`));
  assert(html.includes(`href="${metadata.html_url}"`));
  assert(html.includes('v1.0.2'));
  assert(html.includes('8.7 MiB'));
  assert(!html.includes('No public download'));
});

test('refuses incomplete, draft, prerelease and malformed metadata', () => {
  const mutations = [
    value => { value.draft = true; },
    value => { value.prerelease = true; },
    value => { value.tag_name = 'v1.0.2-beta'; },
    value => { value.assets.pop(); },
    value => { value.assets.push(value.assets[0]); },
    value => { value.assets[0].state = 'new'; },
    value => { value.assets[0].size = 0; },
    value => { value.assets[0].size = '<script>'; },
    value => { value.tag_name = '"><script>alert(1)</script>'; },
    value => { value.html_url = 'https://example.com/'; },
    value => { value.assets[0].browser_download_url = 'javascript:alert(1)'; },
    value => { value.assets[0].browser_download_url = value.assets[0].browser_download_url.replace('v1.0.2', 'v1.0.1'); }
  ];
  for (const mutate of mutations) {
    const metadata = release();
    mutate(metadata);
    assert.throws(() => releaseDownloads(metadata, repository));
  }
  assert.throws(() => releaseDownloads(undefined, repository));
  assert.throws(() => releaseDownloads(null, 'invalid/owner/repo'));
});

test('builds both states without modifying source or including APKs in Pages', t => {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'glide-site-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const source = fileURLToPath(new URL('../site/downloads.html', import.meta.url));
  const before = readFileSync(source, 'utf8');
  for (const metadata of [null, release()]) {
    const output = path.join(directory, metadata ? 'released' : 'unreleased');
    prepareSite(metadata, repository, output);
    assert.equal(readFileSync(source, 'utf8'), before);
    assert(!existsSync(path.join(output, 'resources')));
    assert(!existsSync(path.join(output, 'GlideHorizon.apk')));
    const downloads = readFileSync(path.join(output, 'downloads.html'), 'utf8');
    if (metadata) assert(!downloads.includes('No public download'));
    else assert(downloads.includes('No public download'));
    const pages = readdirSync(output).filter(name => name.endsWith('.html'));
    assert.equal(pages.length, 7);
    for (const page of pages) {
      const html = readFileSync(path.join(output, page), 'utf8');
      for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
        if (/^(?:[a-z]+:|\/\/)/i.test(match[1])) continue;
        const [file, fragment] = match[1].split('#');
        const target = path.resolve(output, file || page);
        assert(existsSync(target), `${page}: missing ${match[1]}`);
        if (fragment) assert(readFileSync(target, 'utf8').includes(`id="${fragment}"`), `${page}: missing anchor ${match[1]}`);
      }
    }
  }
});

test('rejects output inside the source site', () => {
  const source = fileURLToPath(new URL('../site/', import.meta.url));
  assert.throws(() => prepareSite(null, repository, source), /outside/);
  assert.throws(() => prepareSite(null, repository, path.join(source, 'output')), /outside/);
});
