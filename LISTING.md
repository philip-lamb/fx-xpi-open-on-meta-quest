# AMO listing text

Paste these into the listing form at https://addons.mozilla.org/en-US/developers/addons
after the first upload.

## Name

Open on Meta Quest

## Summary (250 characters max)

Right-click any link, page, or tab and send it to the browser on your Meta
Quest headset using Meta's Web Launch.

## Description

Open on Meta Quest adds context menu items that send a web page to your Meta
Quest headset:

- Right-click a link: "Open Link on Meta Quest"
- Right-click anywhere on a page: "Open Page on Meta Quest"
- Right-click a tab: "Open Tab on Meta Quest"
- Select a URL in plain text and right-click it: "Open Selected URL on Meta Quest"
- Click the toolbar button to send the current page

Each action opens Meta's Web Launch page (www.oculus.com/open_url) in a new
tab. Sign in to your Meta account there and the page opens in the Meta Quest
Browser on any headset signed in with the same account.

Only HTTPS pages can be launched, which is a restriction of Meta's Web Launch
service. The menu items are shown only for HTTPS URLs.

This extension needs no access to page content and collects no data.

Meta Quest is a trademark of Meta Platforms, Inc. This extension is not
affiliated with or endorsed by Meta.

## Category

Other (or "Tabs" under Firefox categories)

## Support email

support@eden.net.nz

## License

MIT

## Privacy policy

This extension does not collect, store, or transmit any personal data. When
you choose a menu item, the selected URL is passed to Meta's Web Launch page
(www.oculus.com), which is subject to Meta's privacy policy.

## Notes to reviewer

Single background script, no content scripts, no host permissions, no
minification or bundling. Source in this package is the complete source.
