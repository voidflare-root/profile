(() => {
  const params = new URLSearchParams(location.search);
  const shared =
    params.get("notes") ? { panel: "notes", selector: "#notesList", value: params.get("notes") } :
    params.get("tools") ? { panel: "tools", selector: "#toolsList", value: params.get("tools") } :
    params.get("project") ? { panel: "projects", selector: "#projectsList", value: params.get("project") } :
    null;

  if (!shared?.value) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const decodeSafe = (value) => {
    try {
      return decodeURIComponent(String(value || "").replace(/\+/g, " "));
    } catch {
      return String(value || "");
    }
  };
  const clean = (value) => decodeSafe(value)
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  function showPanel(panel) {
    if (!$("#directShareOnlyStyles")) {
      const style = document.createElement("style");
      style.id = "directShareOnlyStyles";
      style.textContent = `
        body.direct-share-only .profile-card,
        body.direct-share-only .stories-section,
        body.direct-share-only .info-section,
        body.direct-share-only .posts-section > .section-title,
        body.direct-share-only .notes-head,
        body.direct-share-only .tab-panel:not(.is-active),
        body.direct-share-only .note-item[hidden],
        body.direct-share-only .project-item[hidden] {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    }
    [
      ".profile-card",
      ".stories-section",
      ".info-section",
      "#home",
      "#stories",
      "#about",
      "#skills",
      "#services",
      "#contact"
    ].forEach((selector) => {
      $$(selector).forEach((item) => {
        item.hidden = true;
        item.style.display = "none";
      });
    });
    $$(".posts-section > .section-title,.notes-head").forEach((item) => {
      item.hidden = true;
      item.style.display = "none";
    });
    $$(".tab-panel").forEach((item) => {
      const active = item.dataset.panel === panel;
      item.hidden = !active;
      item.style.display = active ? "" : "none";
      item.classList.toggle("is-active", active);
    });
    const buttons = {
      posts: "#postsToggle",
      skills: "#othersToggle",
      notes: "#notesToggle",
      tools: "#toolsToggle",
      projects: "#projectsToggle"
    };
    Object.entries(buttons).forEach(([name, selector]) => {
      const button = $(selector);
      if (!button) return;
      button.classList.toggle("is-open", name === panel);
      button.hidden = true;
      button.style.display = "none";
    });
    document.body.classList.toggle("is-others-mode", panel !== "posts");
    document.body.classList.add("direct-share-only");
  }

  function itemText(item) {
    return [
      $("strong", item)?.textContent,
      $(".project-desc", item)?.textContent,
      $('a[download]', item)?.getAttribute("download"),
      $(".project-download", item)?.dataset.download
    ].filter(Boolean).join(" ");
  }

  function filterSharedItem() {
    showPanel(shared.panel);
    const list = $(shared.selector);
    if (!list) return false;
    const items = $$(".note-item,.project-item", list);
    if (!items.length) return false;

    const wanted = clean(shared.value);
    const matches = items.filter((item) => {
      const label = clean($("strong", item)?.textContent || "");
      return clean(itemText(item)).includes(wanted) || (label && wanted.includes(label));
    });
    if (!matches.length) return false;

    items.forEach((item) => {
      const same = matches.includes(item);
      item.hidden = !same;
      item.style.display = same ? "" : "none";
      item.classList.toggle("direct-shared-item", same);
    });

    document.body.classList.add("direct-share-mode");
    list.scrollIntoView({ block: "start", behavior: "smooth" });
    return true;
  }

  function init() {
    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      if (filterSharedItem() || tries > 30) clearInterval(timer);
    }, 250);
    filterSharedItem();
    new MutationObserver(filterSharedItem).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") window.addEventListener("DOMContentLoaded", init);
  else init();
})();
