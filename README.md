# GlideHorizon website

Static product and setup information for the experimental GlideHorizon Android app. Version-tag pushes publish the APK and checksum to GitHub Releases, then deploy the website with links to the latest complete public release.

## Website files

- [site/](site/): the complete published website, including all HTML pages and local assets.
- [doc/user-manual.md](doc/user-manual.md): the source manual for app instructions and limitations; not included in the deployed website.
- [resources/app/](resources/app/): prebuilt `GlideHorizon.apk` and `GlideHorizon.apk.sha256`, committed before tagging. Only these two filenames are uploaded as release assets.
- [Release workflow](.github/workflows/release-app.yml): verifies the tagged files and publishes a GitHub Release on a `v*` tag push. Only stable `vMAJOR.MINOR.PATCH` tags are accepted.
- [Deployment workflow](.github/workflows/deploy-pages.yml): renders the download section from the latest published release, then publishes a generated copy of `site/`. APKs are hosted on GitHub Releases, not duplicated in Pages.
- [Release helper](scripts/release.mjs), [site preparation](scripts/prepare-site.mjs) and [tests/](tests/): dependency-free Node.js 22 automation.

Keep shared navigation and footers consistent across all seven HTML pages. App claims should match the manual and the terms provided with the relevant build. Review privacy and release information when adding services, analytics or downloads.

## License and contacts

GlideHorizon is free to use under the [GlideHorizon Proprietary Public-Use License](LICENSE), not open source. The [Terms page](site/terms.html#license) reproduces the complete approved license; preserve its wording when updating the page. Experimental-use limitations remain in force and Ko-fi contributions are optional. License, support and privacy inquiries go to [ubackudd@gmail.com](mailto:ubackudd@gmail.com); no support or update commitment is made.

The approved-license website update accompanies Android v1.0.5 (version code 1013). Its APK bundles the approved license in `assets/GlideHorizon-LICENSE.txt`. Publish it with a new `v1.0.5` tag; do not relabel or overwrite v1.0.2. For future updates, verify the APK's actual version and bundled license before following the release procedure below. Confirm that the deployed Downloads page links the new version and that the deployed [Terms](https://humlan25.github.io/glidehorizon-site/terms.html) and [Privacy](https://humlan25.github.io/glidehorizon-site/privacy.html) pages contain the approved license and contact updates. Do not claim Google Play availability.

## Publish with GitHub Pages

1. In the GitHub repository, open **Settings > Pages** and select **GitHub Actions** as the build and deployment source. Repository permissions and a plan supporting Pages for the repository's visibility are required.
2. Commit and push the website and workflow changes to `main`.
3. In **Actions**, check that **Deploy website to GitHub Pages** completes successfully. It can also be run manually on `main` once the workflow is pushed.
4. Open the URL reported by the deployment. Without a custom domain, the expected address is <https://humlan25.github.io/glidehorizon-site/>.
5. Check every navigation/footer link, the setup guide's section links, screenshots and the external donation link on the deployed site.

The workflow uses the current `main` website, retrieves the latest non-draft, non-prerelease GitHub Release and generates its version-specific APK/checksum links into a temporary copy of `site/`. It then publishes that copy as the website root, not under `/site/`. With no published release, it shows the no-download message. Incomplete release assets or API failures other than “no release” fail deployment instead of publishing broken links. Source HTML is not rewritten or committed by CI, and visitors do not need JavaScript or GitHub API requests.

Do not select branch-based publishing from the repository root: the home page is inside `site/`, and GitHub Pages branch publishing does not support selecting that directory directly.

The workflow does not change repository settings or publish until committed and pushed. Initial publication can take a few minutes. If the URL still returns 404, check the Pages source, Actions result and any environment approval requirements.

## Publish an Android release

1. Build, sign and test the APK in the app project. This repository's CI **does not build or sign the app**, verify its signing certificate, or infer its Android version. Check that the APK version matches the intended tag and includes the applicable license notices.
2. Replace `resources/app/GlideHorizon.apk` and `resources/app/GlideHorizon.apk.sha256`. The checksum must contain exactly one SHA-256 entry naming `GlideHorizon.apk`. To regenerate it in PowerShell:

   ```powershell
   $hash = (Get-FileHash resources\app\GlideHorizon.apk -Algorithm SHA256).Hash.ToLowerInvariant()
   "$hash  GlideHorizon.apk" | Set-Content resources\app\GlideHorizon.apk.sha256 -Encoding ascii
   ```

3. Run `node --test`, commit both files and all automation changes, and push `main` before tagging. The release job reads files **from the tagged commit**, not from your working folder. APKs committed here remain in public Git history and source archives; never put signing keys, passwords or private app source in this folder.
4. Choose an **unused stable tag matching the APK's actual version**. For example, only if `v1.0.2` is the correct version and does not already exist:

   ```powershell
   git tag -a v1.0.2 -m "GlideHorizon Android v1.0.2"
   git push origin v1.0.2
   ```

5. Check **Actions > Publish APK release**. CI validates the APK/checksum, creates a draft release, uploads both files and publishes only after both uploads finish. It then calls the Pages deployment directly; it does not rely on another event being triggered by `GITHUB_TOKEN`.
6. Check the public [Downloads page](https://humlan25.github.io/glidehorizon-site/downloads.html). Its links identify the latest published stable version. GitHub decides the latest release using its version/date-based `legacy` policy, so do not mark older releases as latest manually unless intentional.

The built-in `GITHUB_TOKEN` is sufficient: the release job requests `contents: write`, and the deployment requests Pages/OIDC permissions. No personal token or signing secret is required. Repository/organization policies must allow those permissions, and **Settings > Pages > GitHub Actions** must be configured. If the `github-pages` environment restricts allowed deployment refs, allow the `v*` release tags as well as `main` (or approve deployments as required).

For a failed upload, rerun the failed workflow: existing drafts are resumed. For an already published release, reruns verify the two assets byte-for-byte and never overwrite them. A published release with missing/different assets requires a new version tag. Do not move or force-push released tags. If release publication succeeds but Pages fails, rerun the failed deployment or run **Deploy website to GitHub Pages** manually on `main`; the published APK remains available.

Manual release changes do not automatically trigger a new Pages deployment. Run the Pages workflow manually after editing which release is latest or removing a release. The tag belongs to this website/distribution repository; separately tag the matching private Android source for traceability.

Pages upload and deployment use the same attempt-specific artifact name (`github-pages-${{ github.run_attempt }}`), so reruns do not select artifacts from earlier attempts. If an older run reports multiple artifacts named `github-pages`, start a new **Deploy website to GitHub Pages** run on `main` after pushing this workflow fix. Rerunning the old tagged workflow does not pick up the fix; do not move the release tag or republish the APK.

## Validation

Run `node --test` with Node.js 22; no package installation is needed. Tests cover the supplied checksum, invalid inputs, draft/resume and immutable-release behavior, both download-page states, and local links in generated output. Release API calls are mocked; a real GitHub Actions run is still required to verify repository permissions and live publication.

## Review before announcing

- Open `site/index.html` in a browser for a local preview; the pages work without a server or JavaScript. Source previews show the no-release fallback; CI renders the actual release links.
- Test desktop and narrow/mobile widths, keyboard navigation, the skip link, focus indicators and expandable troubleshooting answers.
- Confirm all links and images resolve, including after deployment under the repository URL prefix.
- Verify downloads remain clearly marked unavailable until an authorized release exists; never add an unverified download URL.
- Keep the operational limitations visible and privacy/terms information accurate for the hosting and app release.
- The homepage allows search indexing; search engines decide whether and when to index it.
