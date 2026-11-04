# GlideHorizon website

Static product and setup information for the experimental GlideHorizon Android app. The website currently offers no public app download.

## Website files

- [site/](site/): the complete published website, including all HTML pages and local assets.
- [doc/user-manual.md](doc/user-manual.md): the source manual for app instructions and limitations; not included in the deployed website.
- [Deployment workflow](.github/workflows/deploy-pages.yml): publishes only `site/`, with no application build or package installation required.

Keep shared navigation and footers consistent across all seven HTML pages. App claims should match the manual and the terms provided with the relevant build. Review privacy and release information when adding services, analytics or downloads.

## Publish with GitHub Pages

1. In the GitHub repository, open **Settings > Pages** and select **GitHub Actions** as the build and deployment source. Repository permissions and a plan supporting Pages for the repository's visibility are required.
2. Commit and push the website and workflow changes to `main`.
3. In **Actions**, check that **Deploy website to GitHub Pages** completes successfully. It can also be run manually on `main` once the workflow is pushed.
4. Open the URL reported by the deployment. Without a custom domain, the expected address is <https://humlan25.github.io/glidehorizon-site/>.
5. Check every navigation/footer link, the setup guide's section links, screenshots and the external donation link on the deployed site.

The workflow publishes the contents of `site/` as the website root, not under `/site/`. Do not select branch-based publishing from the repository root: the home page is inside `site/`, and GitHub Pages branch publishing does not support selecting that directory directly.

The workflow does not change repository settings or publish until committed and pushed. Initial publication can take a few minutes. If the URL still returns 404, check the Pages source, Actions result and any environment approval requirements.

## Review before announcing

- Open `site/index.html` in a browser for a local preview; the pages work without a server or JavaScript.
- Test desktop and narrow/mobile widths, keyboard navigation, the skip link, focus indicators and expandable troubleshooting answers.
- Confirm all links and images resolve, including after deployment under the repository URL prefix.
- Verify downloads remain clearly marked unavailable until an authorized release exists; never add an unverified download URL.
- Keep the operational limitations visible and privacy/terms information accurate for the hosting and app release.
- The homepage allows search indexing; search engines decide whether and when to index it.
