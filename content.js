(function () {
  const TOOLBAR_CLASS = "wb-autofill-toolbar";
  let toolbarEl = null;
  let currentInput = null;

  function getWhiteboardInput() {
    return document.querySelector('input[name="status_whiteboard"], input#status_whiteboard');
  }

  function splitTags(value) {
    return value.match(/\[[^\]]*\]|\S+/g) || [];
  }

  function toggleTag(input, tag) {
    const parts = splitTags(input.value);
    const idx = parts.indexOf(tag);
    if (idx >= 0) {
      parts.splice(idx, 1);
    } else {
      parts.push(tag);
    }
    input.value = parts.join(" ");
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    updateActiveStates(input);
  }

  function updateActiveStates(input) {
    if (!toolbarEl) return;
    const parts = splitTags(input.value);
    toolbarEl.querySelectorAll(".wb-autofill-btn").forEach((btn) => {
      btn.classList.toggle("active", parts.includes(btn.dataset.tag));
    });
  }

  function buildToolbar(input, tags) {
    if (toolbarEl) toolbarEl.remove();

    toolbarEl = document.createElement("div");
    toolbarEl.className = TOOLBAR_CLASS;

    tags.forEach((tag) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "wb-autofill-btn";
      btn.textContent = tag;
      btn.dataset.tag = tag;
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        toggleTag(input, tag);
      });
      toolbarEl.appendChild(btn);
    });

    const optBtn = document.createElement("button");
    optBtn.type = "button";
    optBtn.className = "wb-autofill-options-btn";
    optBtn.title = "Edit predefined whiteboard tags";
    optBtn.textContent = "⚙";
    optBtn.addEventListener("click", (e) => {
      e.preventDefault();
      browser.runtime.sendMessage({ type: "open-options-page" });
    });
    toolbarEl.appendChild(optBtn);

    input.insertAdjacentElement("afterend", toolbarEl);
    updateActiveStates(input);
  }

  function loadTagsAndRender(input) {
    browser.storage.local.get({ whiteboardTags: WB_AUTOFILL_DEFAULT_TAGS }).then((res) => {
      buildToolbar(input, res.whiteboardTags);
    });
  }

  function attach(input) {
    currentInput = input;
    loadTagsAndRender(input);
    input.addEventListener("input", () => updateActiveStates(input));
  }

  function tryInit() {
    const input = getWhiteboardInput();
    if (!input) return;
    if (input === currentInput && toolbarEl && document.body.contains(toolbarEl)) return;
    attach(input);
  }

  browser.storage.onChanged.addListener((changes) => {
    if (changes.whiteboardTags && currentInput) {
      buildToolbar(currentInput, changes.whiteboardTags.newValue);
    }
  });

  tryInit();

  const observer = new MutationObserver(() => tryInit());
  observer.observe(document.body, { childList: true, subtree: true });
})();
