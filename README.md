# Bugzilla Whiteboard Autofill

A Firefox extension that adds one-click toggle buttons under the **Whiteboard**
field on `bugzilla.mozilla.org` bug pages, so you can quickly add/remove
predefined tags like `[good-first-bug]` or `[blocked]` without typing them.

## Load it in Firefox (temporary, for development/testing)

1. Open `about:debugging` in Firefox.
2. Click **This Firefox** (left sidebar).
3. Click **Load Temporary Add-on…**
4. Select `manifest.json` in this folder.
5. Visit a bug, e.g. `https://bugzilla.mozilla.org/show_bug.cgi?id=<id>` —
   toggle buttons appear right under the Whiteboard field.

Temporary add-ons are removed when Firefox restarts, and you'll need to
re-reload them after editing any file (reload the add-on in
`about:debugging`, then hard-reload the bug tab so the content script
re-injects).

## Installing more permanently

- **Nightly / Developer Edition only:** build an unsigned `.xpi` with
  `npx web-ext build`, set `xpinstall.signature.required` to `false` in
  `about:config`, then open the `.xpi` in Firefox to install it for good.
  This does *not* work on Release/Beta — there's no override there.
- **Any channel:** TODO — add the addons.mozilla.org listing link once
  submitted.

## Customizing the tag list

Click the ⚙ button in the toolbar (or open the extension's Preferences from
`about:addons`) to add, edit, or remove predefined tags. Changes save to
local storage automatically and apply immediately to any open bug pages.
Removing a tag or resetting to defaults asks for confirmation first.

## Files

- `manifest.json` — extension manifest (MV3)
- `defaults.js` — shared default tag list
- `background.js` — handles opening the options page (content scripts can't
  call `browser.runtime.openOptionsPage()` directly)
- `content.js` / `content.css` — injects the toggle-button toolbar on bug pages
- `options.html` / `options.js` — settings page for editing the tag list

## Notes

- Only matches `bugzilla.mozilla.org` by default. To support another Bugzilla
  instance, add its `show_bug.cgi`/`enter_bug.cgi` URLs to `host_permissions`
  and `content_scripts.matches` in `manifest.json`.
- Editing the Whiteboard field on BMO requires `editbugs` privileges — if you
  don't have them, the field (and toolbar) won't be present/editable.
