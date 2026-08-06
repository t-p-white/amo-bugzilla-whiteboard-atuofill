browser.runtime.onMessage.addListener((message) => {
  if (message && message.type === "open-options-page") {
    browser.runtime.openOptionsPage();
  }
});
