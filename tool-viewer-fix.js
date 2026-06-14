(() => {
  function getRepo() {
    const host = window.location.hostname;

    if (window.PORTFOLIO_REPO) return window.PORTFOLIO_REPO;
    if (!host.endsWith("github.io")) return "voidflare-root/profile";

    const owner = host.replace(".github.io", "");
    const repo = window.location.pathname.split("/").filter(Boolean)[0] || `${owner}.github.io`;
    return `${owner}/${repo}`;
  }

  async function loadBioFromGithub() {
    const bioText = document.querySelector(".bio span");
    if (!bioText) return;

    ensureBioBox();

    try {
      const repo = getRepo();
      const response = await fetch(`https://api.github.com/repos/${repo}/contents/bio`, { cache: "no-store" });
      if (!response.ok) return;

      const files = (await response.json()).filter((file) => file.type === "file" && !file.name.startsWith("."));
      const bioFile = files.find((file) => file.name.toLowerCase() === "bio.txt") || files[0];
      if (!bioFile) return;

      const bioResponse = await fetch(bioFile.download_url, { cache: "no-store" });
      if (!bioResponse.ok) return;

      const text = (await bioResponse.text())
        .replace(/\r\n/g, "\n")
        .replace(/[ \t]+/g, " ")
        .trim();
      if (text) bioText.textContent = text;
    } catch {
      // Keep default bio if GitHub bio file is unavailable.
    }
  }

  function ensureBioBox() {
    const bio = document.querySelector(".bio");
    const bioText = document.querySelector(".bio span");
    if (!bio || !bioText) return;

    const currentBio = bioText.textContent.trim();
    const devotionLines = [...document.querySelectorAll(".devotion-tags span")]
      .map((line) => line.textContent.trim())
      .filter(Boolean);

    if (!currentBio) {
      bioText.textContent = `Welcome To My Profile I,am PIYUSH
HAR HAR MAHADEV
JAY SHREE RAM
RADHE RADHE`;
    } else if (!currentBio.includes("\n") && devotionLines.length) {
      bioText.textContent = [currentBio, ...devotionLines].join("\n");
    }

    document.querySelector(".devotion-tags")?.remove();

    if (!document.querySelector("#bioBoxStyles")) {
      const style = document.createElement("style");
      style.id = "bioBoxStyles";
      style.textContent = `
        .bio{margin:18px 0 0!important;border:1px solid rgba(168,85,247,.34)!important;border-radius:18px!important;padding:14px 12px!important;color:#fff!important;background:linear-gradient(135deg,rgba(138,43,226,.18),rgba(168,85,247,.08)),rgba(255,255,255,.055)!important;font-size:.92rem!important;font-weight:900!important;line-height:1.7!important;text-align:center!important;text-shadow:0 0 18px rgba(168,85,247,.72)!important;box-shadow:inset 0 0 20px rgba(168,85,247,.05)!important}
        .bio span{white-space:pre-line!important}
        .devotion-tags{display:none!important}
      `;
      document.head.appendChild(style);
    }
  }

  function showMessage(message) {
    const toast = document.querySelector("#toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(showMessage.timer);
    showMessage.timer = window.setTimeout(() => toast.classList.remove("show"), 1800);
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const input = document.createElement("textarea");
      input.value = text;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
  }

  function ensureQrTools() {
    const qrCard = document.querySelector(".qr-card");
    const qrLink = document.querySelector("#qrLink");
    const qrImage = document.querySelector("#qrImage");
    if (!qrCard || !qrLink || !qrImage) return;

    if (!document.querySelector("#qrEnhanceStyles")) {
      const style = document.createElement("style");
      style.id = "qrEnhanceStyles";
      style.textContent = `
        .qr-modal{animation:qrFadeIn .22s ease both}
        .qr-modal.is-open .qr-card{animation:qrPopIn .34s cubic-bezier(.2,.85,.2,1.12) both}
        .qr-card{transform-origin:center}
        .qr-actions{width:100%;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:14px}
        .qr-actions button,.qr-actions a{min-height:40px;border:1px solid rgba(168,85,247,.32);border-radius:14px;display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:0 8px;color:#fff;background:rgba(255,255,255,.07);font-size:.78rem;font-weight:900;text-decoration:none;cursor:pointer;box-shadow:inset 0 0 18px rgba(168,85,247,.05);transition:transform 160ms ease,box-shadow 160ms ease,background 160ms ease}
        .qr-actions button:hover,.qr-actions button:active,.qr-actions a:hover,.qr-actions a:active{transform:translateY(-2px);background:rgba(168,85,247,.18);box-shadow:0 0 26px rgba(168,85,247,.38)}
        @keyframes qrFadeIn{from{opacity:0}to{opacity:1}}
        @keyframes qrPopIn{from{opacity:0;transform:translateY(18px) scale(.92)}to{opacity:1;transform:translateY(0) scale(1)}}
        @media (max-width:380px){.qr-actions{grid-template-columns:1fr}.qr-actions button,.qr-actions a{min-height:38px}}
      `;
      document.head.appendChild(style);
    }

    if (!document.querySelector("#qrActions")) {
      const actions = document.createElement("div");
      actions.className = "qr-actions";
      actions.id = "qrActions";
      actions.innerHTML = `
        <button type="button" id="qrShare"><i class="fa-solid fa-share-nodes"></i><span>Share</span></button>
        <a id="qrDownload" href="#" download="piyush-profile-qr.png"><i class="fa-solid fa-download"></i><span>Download</span></a>
        <button type="button" id="qrCopy"><i class="fa-solid fa-link"></i><span>Copy</span></button>
      `;
      qrImage.insertAdjacentElement("afterend", actions);
    }

    document.querySelector("#qrShare")?.addEventListener("click", async () => {
      const link = qrLink.textContent.trim() || window.location.href.split("#")[0];
      if (navigator.share) {
        try {
          await navigator.share({ title: "PIYUSH Profile", text: "PIYUSH profile link", url: link });
          return;
        } catch {
          return;
        }
      }
      await copyText(link);
      showMessage("Profile link copied.");
    });

    document.querySelector("#qrCopy")?.addEventListener("click", async () => {
      const link = qrLink.textContent.trim() || window.location.href.split("#")[0];
      await copyText(link);
      showMessage("QR link copied.");
    });

    document.querySelector("#qrDownload")?.addEventListener("click", async (event) => {
      const download = event.currentTarget;
      const src = qrImage.src;
      if (!src) return;

      try {
        event.preventDefault();
        const response = await fetch(src);
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = objectUrl;
        link.download = "piyush-profile-qr.png";
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1200);
      } catch {
        download.href = src;
      }
    });
  }

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
        .tool-command,.tool-info{border:1px solid rgba(168,85,247,.22);border-radius:16px;display:grid;gap:10px;align-items:center;padding:10px;background:linear-gradient(135deg,rgba(138,43,226,.13),rgba(168,85,247,.05)),rgba(255,255,255,.055)}
        .tool-command{grid-template-columns:auto minmax(0,1fr) auto}
        .tool-number{width:32px;height:32px;border-radius:999px;display:grid;place-items:center;color:#fff;background:linear-gradient(135deg,#8a2be2,#a855f7);font-size:.82rem;font-weight:900;box-shadow:0 0 20px rgba(168,85,247,.46)}
        .tool-command code{min-width:0;overflow:auto;color:#fff;font-family:Consolas,Monaco,monospace;font-size:.86rem;line-height:1.5;white-space:pre-wrap;word-break:break-word}
        .tool-info{color:#d8c8ff;font-size:.9rem;font-weight:800;line-height:1.55}
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

  function getRows(text) {
    let commandIndex = 0;
    return text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && line !== "```")
      .map((line) => {
        if (line.startsWith("#")) {
          return { type: "info", text: line.replace(/^#+\s*/, "") };
        }

        commandIndex += 1;
        const command = line.replace(/^\d+[\.)]?\s+/, "");
        return { type: "command", number: commandIndex, text: command, copyText: command };
      })
      .filter((row) => row.text);
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

  function renderRows(rows) {
    const list = document.querySelector("#toolCommandList");
    list.innerHTML = "";

    if (!rows.length) {
      document.querySelector("#toolViewerStatus").textContent = "Is tool file me commands nahi mile. Har command ko alag line me rakho.";
      return;
    }

    document.querySelector("#toolViewerStatus").textContent = "Info text normal dikhega, commands copy button ke saath dikhenge.";
    rows.forEach((row) => {
      if (row.type === "info") {
        const info = document.createElement("article");
        info.className = "tool-info";
        info.textContent = row.text;
        list.appendChild(info);
        return;
      }

      const item = document.createElement("article");
      item.className = "tool-command";
      const number = document.createElement("span");
      number.className = "tool-number";
      number.textContent = row.number;
      const code = document.createElement("code");
      code.textContent = row.text;
      const copy = document.createElement("button");
      copy.className = "tool-copy";
      copy.type = "button";
      copy.innerHTML = '<i class="fa-solid fa-copy"></i><span>Copy</span>';
      copy.addEventListener("click", () => copyCommand(row.copyText, copy));
      item.append(number, code, copy);
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
      renderRows(getRows(await response.text()));
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

  ensureQrTools();
  loadBioFromGithub();
})();
