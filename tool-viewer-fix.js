(() => {
  function ensureToolViewer() {
    let modal = document.querySelector("#toolViewerModal");

    if (!modal) {
      modal = document.createElement("div");
      modal.className = "tool-viewer-modal";
      modal.id = "toolViewerModal";
      modal.setAttribute("aria-hidden", "true");
      modal.innerHTML = `
        <div class="tool-viewer">
          <div class="tool-viewer-bar">
            <strong id="toolViewerTitle">Tool</strong>
            <button type="button" id="toolViewerClose" aria-label="Close tool"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="tool-viewer-body">
            <p id="toolViewerStatus">Loading tool...</p>
            <div id="toolCommandList"></div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    if (!document.querySelector("#toolViewerStyles")) {
      const style = document.createElement("style");
      style.id = "toolViewerStyles";
      style.textContent = `
        .tool-viewer-modal{position:fixed;inset:0;z-index:88;display:none;place-items:center;background:rgba(0,0,0,.94);backdrop-filter:blur(16px)}
        .tool-viewer-modal.is-open{display:grid}
        .tool-viewer{width:min(780px,100%);height:100vh;display:grid;grid-template-rows:auto 1fr;background:#05050a;border:1px solid rgba(168,85,247,.34);box-shadow:0 0 80px rgba(168,85,247,.44)}
        .tool-viewer-bar{min-height:58px;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;border-bottom:1px solid rgba(168,85,247,.24);background:rgba(255,255,255,.055)}
        .tool-viewer-bar strong{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#fff}
        .tool-viewer-bar button,.tool-copy{border:1px solid rgba(168,85,247,.3);display:inline-flex;align-items:center;justify-content:center;gap:8px;color:#fff;background:rgba(255,255,255,.07);cursor:pointer}
        .tool-viewer-bar button{width:40px;height:40px;border-radius:999px;flex:0 0 auto}
        .tool-viewer-body{min-height:0;overflow:auto;padding:14px;background:#090911}
        #toolViewerStatus{margin:8px 0 14px;color:#b8b8b8;font-weight:800;line-height:1.5}
        #toolCommandList{display:grid;gap:10px}
        .tool-command{border:1px solid rgba(168,85,247,.22);border-radius:16px;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center;padding:10px;background:linear-gradient(135deg,rgba(138,43,226,.13),rgba(168,85,247,.05)),rgba(255,255,255,.055)}
        .tool-command code{min-width:0;overflow:auto;color:#fff;font-family:Consolas,Monaco,monospace;font-size:.86rem;line-height:1.5;white-space:pre-wrap;word-break:break-word}
        .tool-copy{min-height:38px;border-radius:13px;padding:0 12px;font-size:.78rem;font-weight:900}
        .tool-copy.is-copied{background:rgba(34,197,94,.18);border-color:rgba(34,197,94,.42)}
      `;
      document.head.appendChild(style);
    }

    document.querySelector("#toolViewerClose")?.addEventListener("click", closeToolViewer);
    modal.addEventListener("click", (event) => {
      if (event.target.id === "toolViewerModal") closeToolViewer();
    });

    return modal;
  }

  function getCommands(text) {
    return text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && line !== "```" && !line.startsWith("#"));
  }

  async function copyCommand(command, button) {
    try {
      await navigator.clipboard.writeText(command);
    } catch {
      const input = document.createElement("textarea");
      input.value = command;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }

    button.classList.add("is-copied");
    button.innerHTML = '<i class="fa-solid fa-check"></i><span>Copied</span>';
    window.setTimeout(() => {
      button.classList.remove("is-copied");
      button.innerHTML = '<i class="fa-solid fa-copy"></i><span>Copy</span>';
    }, 1200);
  }

  function renderCommands(commands) {
    const list = document.querySelector("#toolCommandList");
    list.innerHTML = "";

    if (!commands.length) {
      document.querySelector("#toolViewerStatus").textContent = "Is tool file me commands nahi mile. Har command ko alag line me rakho.";
      return;
    }

    document.querySelector("#toolViewerStatus").textContent = "Command copy karne ke liye Copy dabao.";
    commands.forEach((command) => {
      const item = document.createElement("article");
      item.className = "tool-command";
      const code = document.createElement("code");
      code.textContent = command;
      const copy = document.createElement("button");
      copy.className = "tool-copy";
      copy.type = "button";
      copy.innerHTML = '<i class="fa-solid fa-copy"></i><span>Copy</span>';
      copy.addEventListener("click", () => copyCommand(command, copy));
      item.append(code, copy);
      list.appendChild(item);
    });
  }

  async function openToolViewer(title, url) {
    const modal = ensureToolViewer();
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.querySelector("#toolViewerTitle").textContent = title;
    document.querySelector("#toolViewerStatus").textContent = "Loading tool...";
    document.querySelector("#toolCommandList").innerHTML = "";

    try {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) throw new Error("Tool file failed");
      renderCommands(getCommands(await response.text()));
    } catch {
      document.querySelector("#toolViewerStatus").textContent = "Tool open nahi ho pa raha. File public tools folder me upload karo.";
    }
  }

  function closeToolViewer() {
    const modal = document.querySelector("#toolViewerModal");
    modal?.classList.remove("is-open");
    modal?.setAttribute("aria-hidden", "true");
  }

  document.addEventListener("click", (event) => {
    const openButton = event.target.closest("#toolsList button");
    if (!openButton) return;

    const item = openButton.closest(".note-item");
    const title = item?.querySelector("strong")?.textContent?.trim() || "Tool";
    const download = item?.querySelector("a[download]");
    const url = download?.href;
    if (!url) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    openToolViewer(title, url);
  }, true);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeToolViewer();
  });
})();
