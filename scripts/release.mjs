import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';

export const assetNames = ['GlideHorizon.apk', 'GlideHorizon.apk.sha256'];

export function validateRelease(tag, directory) {
  if (!/^v(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)$/.test(tag)) {
    throw new Error('Use a stable version tag such as v1.0.2 (no prerelease suffix).');
  }
  const assets = assetNames.map(name => ({ name, data: readFileSync(path.join(directory, name)) }));
  const apk = assets[0].data;
  if (apk.length < 4 || !apk.subarray(0, 4).equals(Buffer.from([0x50, 0x4b, 0x03, 0x04]))) {
    throw new Error('GlideHorizon.apk must be a nonempty APK/ZIP file.');
  }
  const checksum = assets[1].data.toString('utf8').replace(/^\uFEFF/, '').trim();
  const match = /^([a-fA-F0-9]{64})[ \t]+\*?GlideHorizon\.apk$/.exec(checksum);
  if (!match) throw new Error('Checksum must contain one SHA-256 entry for GlideHorizon.apk.');
  const digest = createHash('sha256').update(apk).digest('hex');
  if (match[1].toLowerCase() !== digest) throw new Error('APK SHA-256 does not match the checksum file.');
  return assets;
}

export async function publishRelease(github, { owner, repo, tag }, directory) {
  const assets = validateRelease(tag, directory);
  const scope = { owner, repo };
  let release;
  try {
    release = (await github.rest.repos.getReleaseByTag({ ...scope, tag })).data;
  } catch (error) {
    if (error.status !== 404) throw error;
  }

  if (release && !release.draft) {
    if (release.prerelease) throw new Error('This stable tag already belongs to a prerelease. Use a new tag.');
    for (const asset of assets) {
      const existing = release.assets.find(item => item.name === asset.name);
      if (!existing || existing.state !== 'uploaded' || existing.size !== asset.data.length) {
        throw new Error(`Published release differs from this tag: ${asset.name}. Publish a new version instead.`);
      }
      const downloaded = await github.rest.repos.getReleaseAsset({
        ...scope, asset_id: existing.id, headers: { accept: 'application/octet-stream' }
      });
      if (!Buffer.from(downloaded.data).equals(asset.data)) {
        throw new Error(`Published asset differs from this tag: ${asset.name}. Published files are never overwritten.`);
      }
    }
    return release.html_url;
  }

  const description = [
    `GlideHorizon Android ${tag}.`,
    '',
    'Download GlideHorizon.apk and GlideHorizon.apk.sha256 from the assets below.',
    'Verify the SHA-256 checksum before installation. The checksum detects file corruption; it is not an independent proof of authenticity.',
    '',
    'Experimental software, not a certified or flight-qualified instrument. Do not use as a primary or emergency attitude reference, or to fly without external visual reference.',
    '',
    'GlideHorizon is free to use under a proprietary license, not open source. Read About / licenses and the terms supplied with the build.',
    `Terms: https://${owner.toLowerCase()}.github.io/${repo}/terms.html`,
    `Privacy: https://${owner.toLowerCase()}.github.io/${repo}/privacy.html`,
    'License, support and privacy inquiries: ubackudd@gmail.com.',
    `Setup and limitations: https://${owner.toLowerCase()}.github.io/${repo}/`,
    '',
    'This tag identifies the website/distribution repository, not the private Android application source.',
    'GitHub-generated Source code archives contain this repository, not the Android app source.'
  ].join('\n');
  if (!release) {
    release = (await github.rest.repos.createRelease({
      ...scope, tag_name: tag, name: `GlideHorizon Android ${tag}`,
      body: description, draft: true, prerelease: false
    })).data;
  }

  for (const asset of assets) {
    const existing = release.assets.find(item => item.name === asset.name);
    if (existing) await github.rest.repos.deleteReleaseAsset({ ...scope, asset_id: existing.id });
    const uploaded = (await github.rest.repos.uploadReleaseAsset({
      ...scope, release_id: release.id, name: asset.name,
      headers: { 'content-type': 'application/octet-stream', 'content-length': asset.data.length },
      data: asset.data
    })).data;
    if (uploaded.state !== 'uploaded' || uploaded.size !== asset.data.length) {
      throw new Error(`Incomplete upload: ${asset.name}. Release remains a draft.`);
    }
  }
  return (await github.rest.repos.updateRelease({
    ...scope, release_id: release.id, draft: false, prerelease: false, make_latest: 'legacy'
  })).data.html_url;
}
