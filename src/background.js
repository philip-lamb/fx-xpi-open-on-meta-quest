/*
 * Open on Meta Quest
 *
 * Builds a Meta "Web Launch" URL for a link, page, tab, or selected text
 * and opens it in a new tab. The oculus.com page then forwards the target
 * URL to the Meta Quest Browser on the user's headset.
 *
 * Web Launch reference:
 * https://developers.meta.com/vr/documentation/web/web-launch/
 */

const WEB_LAUNCH_ENDPOINT = "https://www.oculus.com/open_url/";

// Meta only accepts HTTPS targets. These patterns make the menu items
// appear only where a launchable URL exists.
const HTTPS_PATTERNS = ["https://*/*"];

const MENU_IDS = {
  link: "open-on-meta-quest-link",
  page: "open-on-meta-quest-page",
  tab: "open-on-meta-quest-tab",
  selection: "open-on-meta-quest-selection",
};

/**
 * Returns the Web Launch URL for `target`, or null if `target` is not a
 * valid HTTPS URL.
 */
function createWebLaunchUrl(target) {
  let targetUrl;
  try {
    targetUrl = new URL(String(target).trim());
  } catch {
    return null;
  }
  if (targetUrl.protocol !== "https:") {
    return null;
  }
  const launchUrl = new URL(WEB_LAUNCH_ENDPOINT);
  launchUrl.searchParams.set("url", targetUrl.toString());
  return launchUrl.toString();
}

async function openOnQuest(target, openerTabId) {
  const launchUrl = createWebLaunchUrl(target);
  if (!launchUrl) {
    console.warn("[Open on Meta Quest] Not an HTTPS URL, ignoring:", target);
    return;
  }
  const createProperties = { url: launchUrl, active: true };
  if (typeof openerTabId === "number" && openerTabId >= 0) {
    createProperties.openerTabId = openerTabId;
  }
  await browser.tabs.create(createProperties);
}

function createMenus() {
  browser.menus.create({
    id: MENU_IDS.link,
    title: "Open Link on Meta Quest",
    contexts: ["link"],
    targetUrlPatterns: HTTPS_PATTERNS,
  });
  browser.menus.create({
    id: MENU_IDS.page,
    title: "Open Page on Meta Quest",
    contexts: ["page", "frame"],
    documentUrlPatterns: HTTPS_PATTERNS,
  });
  browser.menus.create({
    id: MENU_IDS.tab,
    title: "Open Tab on Meta Quest",
    contexts: ["tab"],
    documentUrlPatterns: HTTPS_PATTERNS,
  });
  // Selected text that happens to be an HTTPS URL (for example a URL pasted
  // in plain text). There is no pattern filter for selection text, so the
  // item is created and validated at click time.
  browser.menus.create({
    id: MENU_IDS.selection,
    title: "Open Selected URL on Meta Quest",
    contexts: ["selection"],
    visible: false,
  });
}

browser.runtime.onInstalled.addListener(() => {
  createMenus();
});

// Show the selection item only when the selected text looks like an HTTPS URL.
browser.menus.onShown.addListener(async (info) => {
  if (!info.contexts.includes("selection")) {
    return;
  }
  const visible = createWebLaunchUrl(info.selectionText) !== null;
  await browser.menus.update(MENU_IDS.selection, { visible });
  browser.menus.refresh();
});

browser.menus.onClicked.addListener((info, tab) => {
  const openerTabId = tab ? tab.id : undefined;
  switch (info.menuItemId) {
    case MENU_IDS.link:
      return openOnQuest(info.linkUrl, openerTabId);
    case MENU_IDS.page:
      return openOnQuest(info.frameUrl || info.pageUrl, openerTabId);
    case MENU_IDS.tab:
      // For the tab context, pageUrl is the clicked tab's URL. tab.url is a
      // fallback that is populated when activeTab has been granted.
      return openOnQuest(info.pageUrl || (tab && tab.url), openerTabId);
    case MENU_IDS.selection:
      return openOnQuest(info.selectionText, openerTabId);
    default:
      return undefined;
  }
});

// Toolbar button: open the current tab's page. activeTab grants access to
// tab.url for the duration of this user gesture.
browser.action.onClicked.addListener((tab) => {
  openOnQuest(tab.url, tab.id);
});
