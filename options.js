const listEl = document.getElementById("tag-list");
const newTagInput = document.getElementById("new-tag");
const statusEl = document.getElementById("status");

let tags = [];

function flash(message) {
  statusEl.textContent = message;
  setTimeout(() => {
    statusEl.textContent = "";
  }, 1200);
}

function save() {
  browser.storage.local.set({ whiteboardTags: tags }).then(() => flash("Saved."));
}

function render() {
  listEl.innerHTML = "";
  tags.forEach((tag, i) => {
    const li = document.createElement("li");

    const input = document.createElement("input");
    input.type = "text";
    input.value = tag;
    input.addEventListener("change", () => {
      const val = input.value.trim();
      if (!val) {
        removeTag(i);
        return;
      }
      tags[i] = val;
      save();
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        input.blur();
      }
    });

    const del = document.createElement("button");
    del.type = "button";
    del.className = "delete";
    del.title = "Remove this tag";
    del.textContent = "Remove";
    del.addEventListener("click", () => {
      if (window.confirm(`Remove "${tag}" from the list?`)) {
        removeTag(i);
      }
    });

    li.appendChild(input);
    li.appendChild(del);
    listEl.appendChild(li);
  });
}

function removeTag(i) {
  tags.splice(i, 1);
  save();
  render();
}

function addTag() {
  const val = newTagInput.value.trim();
  if (!val) return;
  if (tags.includes(val)) {
    flash("Already exists.");
    return;
  }
  tags.push(val);
  newTagInput.value = "";
  save();
  render();
}

function load() {
  browser.storage.local.get({ whiteboardTags: WB_AUTOFILL_DEFAULT_TAGS }).then((res) => {
    tags = res.whiteboardTags.slice();
    render();
  });
}

document.getElementById("add").addEventListener("click", addTag);
newTagInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addTag();
  }
});

document.getElementById("reset").addEventListener("click", () => {
  const confirmed = window.confirm(
    "Reset to defaults? This will discard your current list of " +
      tags.length +
      " tag(s) and replace it with the built-in defaults."
  );
  if (!confirmed) return;
  tags = WB_AUTOFILL_DEFAULT_TAGS.slice();
  save();
  render();
  flash("Reset to defaults.");
});

load();
