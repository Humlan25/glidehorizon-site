import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assetNames, publishRelease, validateRelease } from '../scripts/release.mjs';

const scope = { owner: 'Humlan25', repo: 'glidehorizon-site', tag: 'v1.0.2' };

function fixture(t) {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'glide-release-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const apk = Buffer.from([0x50, 0x4b, 0x03, 0x04, 1, 2, 3, 4]);
  writeFileSync(path.join(directory, assetNames[0]), apk);
  const hash = createHash('sha256').update(apk).digest('hex');
  writeFileSync(path.join(directory, assetNames[1]), `${hash}  GlideHorizon.apk\n`);
  return { directory, hash };
}

function api() {
  const state = { release: null, events: [], uploads: new Map(), nextId: 1, failChecksum: false };
  const repos = {
    async getReleaseByTag() {
      if (!state.release) throw Object.assign(new Error('Not found'), { status: 404 });
      return { data: state.release };
    },
    async createRelease(input) {
      state.events.push('create-draft');
      assert.equal(input.draft, true);
      state.release = { ...input, id: 1, assets: [], html_url: `https://github.com/${scope.owner}/${scope.repo}/releases/tag/${scope.tag}` };
      return { data: state.release };
    },
    async deleteReleaseAsset({ asset_id }) {
      state.events.push('delete-draft-asset');
      assert.equal(state.release.draft, true);
      state.release.assets = state.release.assets.filter(a => a.id !== asset_id);
    },
    async uploadReleaseAsset(input) {
      assert.equal(state.release.draft, true);
      if (state.failChecksum && input.name.endsWith('.sha256')) throw new Error('Upload failed');
      state.events.push('upload:' + input.name);
      const asset = { id: state.nextId++, name: input.name, state: 'uploaded', size: input.data.length };
      state.uploads.set(asset.id, Buffer.from(input.data));
      state.release.assets.push(asset);
      return { data: asset };
    },
    async getReleaseAsset({ asset_id }) {
      const bytes = state.uploads.get(asset_id);
      return { data: bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) };
    },
    async updateRelease(input) {
      assert.equal(state.release.assets.length, 2);
      assert.equal(input.make_latest, 'legacy');
      state.events.push('publish');
      Object.assign(state.release, input);
      return { data: state.release };
    }
  };
  return { github: { rest: { repos } }, state };
}

test('validates the supplied APK and its SHA-256 file', () => {
  const directory = fileURLToPath(new URL('../resources/app/', import.meta.url));
  assert.deepEqual(validateRelease(scope.tag, directory).map(a => a.name), assetNames);
});

test('accepts common SHA-256 text formats without modifying source files', t => {
  const { directory, hash } = fixture(t);
  for (const text of [`${hash}  GlideHorizon.apk\n`, `${hash.toUpperCase()} *GlideHorizon.apk\r\n`, `\uFEFF${hash}  GlideHorizon.apk\r\n`]) {
    writeFileSync(path.join(directory, assetNames[1]), text);
    assert.equal(validateRelease(scope.tag, directory).length, 2);
    assert.equal(readFileSync(path.join(directory, assetNames[1]), 'utf8'), text);
  }
});

test('rejects malformed and prerelease tags', t => {
  const { directory } = fixture(t);
  for (const tag of ['main', '1.0.2', 'v1.0', 'v01.0.2', 'v1.0.2-beta', 'v1.0.2;echo nope']) {
    assert.throws(() => validateRelease(tag, directory), /stable version tag/);
  }
});

test('rejects missing, empty or non-APK files', t => {
  const { directory } = fixture(t);
  for (const data of [Buffer.alloc(0), Buffer.from('not an APK')]) {
    writeFileSync(path.join(directory, assetNames[0]), data);
    assert.throws(() => validateRelease(scope.tag, directory), /APK\/ZIP/);
  }
  rmSync(path.join(directory, assetNames[0]));
  assert.throws(() => validateRelease(scope.tag, directory), /ENOENT/);
});

test('rejects incorrect hashes, checksum filenames and multiple entries', t => {
  const { directory, hash } = fixture(t);
  for (const text of [`${'0'.repeat(64)}  GlideHorizon.apk`, `${hash}  other.apk`, `${hash}  ../GlideHorizon.apk`, `${hash}  GlideHorizon.apk\n${hash}  GlideHorizon.apk`]) {
    writeFileSync(path.join(directory, assetNames[1]), text);
    assert.throws(() => validateRelease(scope.tag, directory), /checksum|Checksum/);
  }
});

test('publishes only after both verified files have uploaded', async t => {
  const { directory } = fixture(t);
  const { github, state } = api();
  const url = await publishRelease(github, scope, directory);
  assert(url.endsWith('/releases/tag/v1.0.2'));
  assert.deepEqual(state.events, ['create-draft', 'upload:GlideHorizon.apk', 'upload:GlideHorizon.apk.sha256', 'publish']);
  assert.equal(state.release.draft, false);
  assert.match(state.release.body, /free to use under a proprietary license, not open source/);
  assert.match(state.release.body, /Experimental software, not a certified or flight-qualified instrument/);
  assert(state.release.body.includes('https://humlan25.github.io/glidehorizon-site/terms.html'));
  assert(state.release.body.includes('https://humlan25.github.io/glidehorizon-site/privacy.html'));
  assert(state.release.body.includes('ubackudd@gmail.com'));
  assert(!state.release.body.includes('Google Play'));
});

test('failed upload remains a draft and can be resumed', async t => {
  const { directory } = fixture(t);
  const { github, state } = api();
  state.failChecksum = true;
  await assert.rejects(publishRelease(github, scope, directory), /Upload failed/);
  assert.equal(state.release.draft, true);
  assert(!state.events.includes('publish'));
  state.failChecksum = false;
  await publishRelease(github, scope, directory);
  assert.equal(state.release.draft, false);
  assert.equal(state.release.assets.length, 2);
});

test('rerunning a published release verifies bytes without overwriting assets', async t => {
  const { directory } = fixture(t);
  const { github, state } = api();
  await publishRelease(github, scope, directory);
  state.events = [];
  await publishRelease(github, scope, directory);
  assert.deepEqual(state.events, []);
  state.uploads.get(state.release.assets[0].id)[5] ^= 1;
  await assert.rejects(publishRelease(github, scope, directory), /never overwritten/);
  assert.deepEqual(state.events, []);
});

test('rejects incomplete published releases instead of changing them', async t => {
  const { directory } = fixture(t);
  const { github, state } = api();
  await publishRelease(github, scope, directory);
  state.release.assets.pop();
  state.events = [];
  await assert.rejects(publishRelease(github, scope, directory), /new version/);
  assert.deepEqual(state.events, []);
});

test('validation and authorization failures never create a release', async t => {
  const { directory } = fixture(t);
  const { github, state } = api();
  await assert.rejects(publishRelease(github, { ...scope, tag: 'bad' }, directory), /stable version tag/);
  github.rest.repos.getReleaseByTag = async () => { throw Object.assign(new Error('Forbidden'), { status: 403 }); };
  await assert.rejects(publishRelease(github, scope, directory), /Forbidden/);
  assert.deepEqual(state.events, []);
});
