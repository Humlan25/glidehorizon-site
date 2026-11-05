import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { assetNames } from './release.mjs';

const source = fileURLToPath(new URL('../site/', import.meta.url));
const start = '<!-- release-downloads:start -->';
const end = '<!-- release-downloads:end -->';

export function releaseDownloads(release, repository) {
  if (!/^[\w.-]+\/[\w.-]+$/.test(repository)) throw new Error('Invalid GitHub repository.');
  if (release === null) {
    return '<p class="release-state">No public download currently offered</p><p>A download will appear here after the first complete public APK release is published. GlideHorizon is free to use under a proprietary license, not open source.</p>';
  }
  if (!release || release.draft || release.prerelease || !/^v(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)$/.test(release.tag_name)) {
    throw new Error('Expected a published stable version release.');
  }
  const base = `https://github.com/${repository}/releases`;
  const tag = release.tag_name;
  const notes = `${base}/tag/${tag}`;
  if (release.html_url !== notes) throw new Error('Unexpected release URL.');
  const assets = assetNames.map(name => {
    const matches = (release.assets ?? []).filter(asset => asset.name === name);
    const asset = matches[0];
    const url = `${base}/download/${tag}/${name}`;
    if (matches.length !== 1 || asset.state !== 'uploaded' || !Number.isSafeInteger(asset.size) || asset.size <= 0 || asset.browser_download_url !== url) {
      throw new Error(`Release ${tag} does not contain a valid uploaded ${name}.`);
    }
    return asset;
  });
  return `<p class="eyebrow">Latest public release: ${tag}</p>
        <p>GlideHorizon Android ${tag} is available as a direct APK download (${(assets[0].size / 1024 / 1024).toFixed(1)} MiB). GlideHorizon is free to use under a proprietary license, not open source. Experimental-use limitations still apply.</p>
        <div class="actions"><a class="button" href="${assets[0].browser_download_url}" rel="noreferrer">Download APK</a><a class="text-link" href="${assets[1].browser_download_url}" rel="noreferrer">Download SHA-256 checksum</a></div>
        <p><a href="${notes}" rel="noreferrer">Release notes and all assets for ${tag}</a>. These files are hosted on GitHub Releases.</p>`;
}

export function prepareSite(release, repository, output) {
  const directory = path.resolve(output);
  const relative = path.relative(source, directory);
  if (!relative || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative))) {
    throw new Error('Generated output must be outside the source site directory.');
  }
  const template = readFileSync(path.join(source, 'downloads.html'), 'utf8');
  if (template.split(start).length !== 2 || template.split(end).length !== 2 || template.indexOf(start) > template.indexOf(end)) {
    throw new Error('Downloads template must contain exactly one release marker pair.');
  }
  const content = releaseDownloads(release, repository);
  const html = template.slice(0, template.indexOf(start) + start.length) + '\n        ' + content + '\n        ' + template.slice(template.indexOf(end));
  mkdirSync(directory, { recursive: true });
  cpSync(source, directory, { recursive: true });
  writeFileSync(path.join(directory, 'downloads.html'), html);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const [metadata, output] = process.argv.slice(2);
  if (!metadata || !output || !process.env.GITHUB_REPOSITORY) {
    throw new Error('Usage: node scripts/prepare-site.mjs <release.json> <output-directory>, with GITHUB_REPOSITORY set.');
  }
  prepareSite(JSON.parse(readFileSync(metadata, 'utf8')), process.env.GITHUB_REPOSITORY, output);
  console.log(`Prepared static website in ${output}`);
}
