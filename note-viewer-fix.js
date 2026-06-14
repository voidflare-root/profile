(() => {
  let pdfDoc = null;
  let pageNumber = 1;
  let activeRender = null;

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
              <button type="button" id="notePrevPage" aria-label="Previous page"><i class="fa-solid fa-chevron-left"></i></button>
              <span id="notePageInfo">1 / 1</span>
              <button type="button" id="noteNextPage" aria-label="Next page"><i class="fa-solid fa-chevron-right"></i></button>
              <button type="button" id="noteCanvasClose" aria-label="Close note"><i class="fa-solid fa-xmark"></i></button>
            </div>
          </div>
          <div class="note-canvas-stage">
            <canvas id="noteCanvas"></canvas>
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
        .note-canvas-viewer{width:min(960px,100%);height:100vh;display:grid;grid-template-rows:auto 1fr;background:#05050a;border:1px solid rgba(168,85,247,.34);box-shadow:0 0 80px rgba(168,85,247,.44)}
        .note-canvas-bar{min-height:58px;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;border-bottom:1px solid rgba(168,85,247,.24);background:rgba(255,255,255,.055)}
        .note-canvas-bar strong{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .note-canvas-actions{display:inline-flex;align-items:center;gap:8px;flex:0 0 auto}
        .note-canvas-actions button{width:38px;height:38px;border:1px solid rgba(168,85,247,.3);border-radius:999px;display:grid;place-items:center;color:white;background:rgba(255,255,255,.07);cursor:pointer}
        .note-canvas-actions span{color:#b8b8b8;font-size:.82rem;font-weight:900;min-width:58px;text-align:center}
        .note-canvas-stage{min-height:0;overflow:auto;display:grid;place-items:start center;padding:14px;background:#111}
        #noteCanvas{max-width:100%;height:auto;background:white;border-radius:8px;box-shadow:0 18px 60px rgba(0,0,0,.42)}
        #noteCanvasStatus{margin:18px;color:#b8b8b8;font-weight:800}
      `;
      document.head.appendChild(style);
    }

    document.querySelector("#noteCanvasClose")?.addEventListener("click", closeViewer);
    document.querySelector("#noteCanvasModal")?.addEventListener("click", (event) => {
      if (event.target.id === "noteCanvasModal") closeViewer();
    });
    document.querySelector("#notePrevPage")?.addEventListener("click", () => {
      if (pageNumber > 1) {
        pageNumber -= 1;
        renderPage(pageNumber);
      }
    });
    document.querySelector("#noteNextPage")?.addEventListener("click", () => {
      if (pdfDoc && pageNumber < pdfDoc.numPages) {
        pageNumber += 1;
        renderPage(pageNumber);
      }
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

  async function renderPage(number) {
    if (!pdfDoc) return;
    if (activeRender) activeRender.cancel();

    const page = await pdfDoc.getPage(number);
    const container = document.querySelector(".note-canvas-stage");
    const canvas = document.querySelector("#noteCanvas");
    const context = canvas.getContext("2d");
    const baseViewport = page.getViewport({ scale: 1 });
    const maxWidth = Math.max(280, Math.min(container.clientWidth - 28, 900));
    const scale = maxWidth / baseViewport.width;
    const viewport = page.getViewport({ scale });

    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    document.querySelector("#notePageInfo").textContent = `${number} / ${pdfDoc.numPages}`;
    document.querySelector("#noteCanvasStatus").hidden = true;

    activeRender = page.render({ canvasContext: context, viewport });
    await activeRender.promise.catch(() => {});
    activeRender = null;
  }

  async function openViewer(title, url) {
    const modal = ensureViewer();
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.querySelector("#noteCanvasTitle").textContent = title;
    document.querySelector("#noteCanvasStatus").hidden = false;
    document.querySelector("#noteCanvasStatus").textContent = "Loading note...";

    try {
      const pdfjsLib = await loadPdfJs();
      pdfDoc = await pdfjsLib.getDocument({ url }).promise;
      pageNumber = 1;
      await renderPage(pageNumber);
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
    pageNumber = 1;
  }

  document.addEventListener(
    "click",
    (event) => {
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
    },
    true
  );

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeViewer();
  });
})();
