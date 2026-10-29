# Open on Meta Quest (Firefox extension)

Adds context menu items that send a URL to the browser on your Meta Quest
headset using Meta's [Web Launch](https://developers.meta.com/vr/documentation/web/web-launch/)
facility.

## What it adds

| Where you right-click            | Menu item                        | What is launched            |
| -------------------------------- | -------------------------------- | --------------------------- |
| A link in a page                 | Open Link on Meta Quest          | The link's URL              |
| Anywhere else in a page or frame | Open Page on Meta Quest          | The page (or frame) URL     |
| A tab in the tab strip           | Open Tab on Meta Quest           | That tab's URL              |
| Selected text that is a URL      | Open Selected URL on Meta Quest  | The selected text           |

A toolbar button also opens the current page on the headset.

Firefox does not let extensions add items to the URL bar's own context menu.
To launch the address in the URL bar, right-click the page body, right-click
the tab, or click the toolbar button.

## How it works

Meta's Web Launch is a redirect page. The extension builds

```
https://www.oculus.com/open_url/?url=<percent-encoded HTTPS URL>
```

and opens it in a new tab. That page asks you to sign in to your Meta account
(if you are not already) and pushes the URL to the Meta Quest Browser on a
headset signed in with the same account.

Meta only accepts HTTPS targets, so the menu items are shown only for
`https://` URLs.

The extension needs no host permissions and collects no data.

## Testing locally

Requires Node.js. Firefox Developer Edition is used by default.

```sh
npm install
npm start            # launches Firefox Developer Edition with the extension loaded
npm run start:release   # same, using the release Firefox
npm run lint         # runs web-ext lint
npm run build        # writes dist/open_on_meta_quest-<version>.zip
```

Without Node.js, open `about:debugging#/runtime/this-firefox` in Firefox,
choose "Load Temporary Add-on...", and pick `src/manifest.json`.

## Publishing to addons.mozilla.org

1. Create API credentials at <https://addons.mozilla.org/en-US/developers/addon/api/key/>.
2. Run:

   ```sh
   WEB_EXT_API_KEY=<key> WEB_EXT_API_SECRET=<secret> npm run sign
   ```

   This uploads the extension to the listed channel, creates the listing, and
   waits for the signed `.xpi`.
3. Complete the listing (summary, description, category, screenshots) at
   <https://addons.mozilla.org/en-US/developers/addons>.

The add-on ID is fixed in `src/manifest.json` as
`open-on-meta-quest@eden.net.nz`. Bump `version` before each upload.
