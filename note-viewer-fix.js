(() => {
  let pdfDoc = null;
  let zoom = 1;
  let renderToken = 0;

  function ensureViewer() {
    let modal = document.querySelector("#noteCanvasModal");

    if (!modal) {
      modal = document.createElement("div");
      modal.className = "note-canvas-modal";
      modal.id = "noteCanvasModal";
      modal.setAttribute("aria-hidden", "true");
      modal.innerHTML = `
        <div class="note-canvas-viewer">
          <div class="note-canvas-bar">
            <strong id="noteCanvasTitle">Note</strong>
            <div class="note-canvas-actions">
              <button type="button" id="noteZoomOut" aria-label="Zoom out"><i class="fa-solid fa-minus"></i></button>
              <span id="noteZoomInfo">100%</span>
              <button type="button" id="noteZoomIn" aria-label="Zoom in"><i class="fa-solid fa-plus"></i></button>
              <button type="button" id="noteCanvasClose" aria-label="Close note"><i class="fa-solid fa-xmark"></i></button>
            </div>
          </div>
          <div class="note-canvas-stage">
            <div id="notePages"></div>
            <p id="noteCanvasStatus">Loading note...</p>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    if (!document.querySelector("#noteCanvasStyles")) {
      const style = document.createElement("style");
      style.id = "noteCanvasStyles";
      style.textContent = `
        .note-canvas-modal{position:fixed;inset:0;z-index:90;display:none;place-items:center;background:rgba(0,0,0,.94);backdrop-filter:blur(16px)}
        .note-canvas-modal.is-open{display:grid}
        .note-canvas-viewer{width:min(1040px,100%);height:100vh;display:grid;grid-template-rows:auto 1fr;background:#05050a;border:1px solid rgba(168,85,247,.34);box-shadow:0 0 80px rgba(168,85,247,.44)}
        .note-canvas-bar{min-height:58px;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;border-bottom:1px solid rgba(168,85,247,.24);background:rgba(255,255,255,.055)}
        .note-canvas-bar strong{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .note-canvas-actions{display:inline-flex;align-items:center;gap:8px;flex:0 0 auto}
        .note-canvas-actions button{width:38px;height:38px;border:1px solid rgba(168,85,247,.3);border-radius:999px;display:grid;place-items:center;color:white;background:rgba(255,255,255,.07);cursor:pointer}
        .note-canvas-actions span{color:#b8b8b8;font-size:.82rem;font-weight:900;min-width:58px;text-align:center}
        .note-canvas-stage{min-height:0;overflow:auto;padding:16px;background:#111}
        #notePages{display:grid;justify-items:center;gap:18px}
        .note-page-wrap{display:grid;gap:8px;justify-items:center}
        .note-page-label{color:#b8b8b8;font-size:.78rem;font-weight:900}
        .note-page-wrap canvas{max-width:none;height:auto;background:white;border-radius:8px;box-shadow:0 18px 60px rgba(0,0,0,.42)}
        #noteCanvasStatus{margin:18px;color:#b8b8b8;font-weight:800;text-align:center}
      `;
      document.head.appendChild(style);
    }

    document.querySelector("#noteCanvasClose")?.addEventListener("click", closeViewer);
    document.querySelector("#noteCanvasModal")?.addEventListener("click", (event) => {
      if (event.target.id === "noteCanvasModal") closeViewer();
    });
    document.querySelector("#noteZoomOut")?.addEventListener("click", () => {
      zoom = Math.max(0.75, Number((zoom - 0.15).toFixed(2)));
      renderAllPages();
    });
    document.querySelector("#noteZoomIn")?.addEventListener("click", () => {
      zoom = Math.min(2.4, Number((zoom + 0.15).toFixed(2)));
      renderAllPages();
    });

    return modal;
  }

  function loadPdfJs() {
    if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      script.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        resolve(window.pdfjsLib);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async function renderAllPages() {
    if (!pdfDoc) return;

    const token = ++renderToken;
    const pages = document.querySelector("#notePages");
    const stage = document.querySelector(".note-canvas-stage");
    const status = document.querySelector("#noteCanvasStatus");
    const deviceScale = Math.max(2, Math.min(window.devicePixelRatio || 1, 3));
    const maxCssWidth = Math.max(300, Math.min(stage.clientWidth - 32, 980));

    pages.innerHTML = "";
    status.hidden = false;
    status.textContent = "Rendering high quality PDF...";
    document.querySelector("#noteZoomInfo").textContent = `${Math.round(zoom * 100)}%`;

    for (let pageNumber = 1; pageNumber <= pdfDoc.numPages; pageNumber += 1) {
      if (token !== renderToken) return;

      const page = await pdfDoc.getPage(pageNumber);
      const baseViewport = page.getViewport({ scale: 1 });
      const cssScale = (maxCssWidth / baseViewport.width) * zoom;
      const renderViewport = page.getViewport({ scale: cssScale * deviceScale });
      const cssViewport = page.getViewport({ scale: cssScale });

      const wrap = document.createElement("div");
      wrap.className = "note-page-wrap";
      const canvas = document.createElement("canvas");
      canvas.width = Math.floor(renderViewport.width);
      canvas.height = Math.floor(renderViewport.height);
      canvas.style.width = `${Math.floor(cssViewport.width)}px`;
      canvas.style.height = `${Math.floor(cssViewport.height)}px`;

      const label = document.createElement("span");
      label.className = "note-page-label";
      label.textContent = `Page ${pageNumber} / ${pdfDoc.numPages}`;
      wrap.append(canvas, label);
      pages.appendChild(wrap);

      await page.render({
        canvasContext: canvas.getContext("2d"),
        viewport: renderViewport,
      }).promise;
    }

    if (token === renderToken) status.hidden = true;
  }

  async function openViewer(title, url) {
    const modal = ensureViewer();
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.querySelector("#noteCanvasTitle").textContent = title;
    document.querySelector("#notePages").innerHTML = "";
    document.querySelector("#noteCanvasStatus").hidden = false;
    document.querySelector("#noteCanvasStatus").textContent = "Loading note...";

    try {
      const pdfjsLib = await loadPdfJs();
      pdfDoc = await pdfjsLib.getDocument({ url }).promise;
      zoom = 1;
      await renderAllPages();
    } catch {
      document.querySelector("#noteCanvasStatus").hidden = false;
      document.querySelector("#noteCanvasStatus").textContent = "PDF open nahi ho pa raha. Download button use karo.";
    }
  }

  function closeViewer() {
    const modal = document.querySelector("#noteCanvasModal");
    modal?.classList.remove("is-open");
    modal?.setAttribute("aria-hidden", "true");
    pdfDoc = null;
    renderToken += 1;
    zoom = 1;
  }

  document.addEventListener("click", (event) => {
    const openButton = event.target.closest("#notesList button");
    if (!openButton) return;
    const item = openButton.closest(".note-item");
    const title = item?.querySelector("strong")?.textContent?.trim() || "Note";
    const download = item?.querySelector("a[download]");
    const url = download?.href;
    if (!url) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openViewer(title, url);
  }, true);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeViewer();
  });
})();
