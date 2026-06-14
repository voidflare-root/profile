(() => {
  function injectDesktopMode() {
    if (document.querySelector("#desktopModeStyles")) return;

    const style = document.createElement("style");
    style.id = "desktopModeStyles";
    style.textContent = `
      @media (min-width:1024px){
        body{display:block!important}
        .app-shell{width:min(430px,calc(100% - 28px))!important;display:block!important;margin:0 auto!important;padding:18px 0 48px!important}
        .profile-card,.posts-section,.stories-section,.info-section{position:relative!important;top:auto!important;width:100%!important;margin-left:auto!important;margin-right:auto!important;grid-column:auto!important;grid-row:auto!important}
        .posts-section,.stories-section,.info-section{margin-top:16px!important}
        h1{font-size:clamp(2rem,8.5vw,4.4rem)!important;white-space:normal!important;overflow-wrap:anywhere!important;word-break:normal!important}
        .profile-line{gap:16px!important}
        .dp-ring{width:clamp(92px,25vw,148px)!important}
        .name-row{gap:clamp(10px,2vw,16px)!important;min-width:0!important}
        .instagram-link{width:clamp(40px,8vw,54px)!important;height:clamp(40px,8vw,54px)!important;border-radius:16px!important}
        .bio{font-size:.92rem!important}
        .role-boxes{grid-template-columns:repeat(2,minmax(0,1fr))!important}
        .action-row{grid-template-columns:repeat(4,minmax(0,1fr))!important}
        .section-title{padding:16px 16px 14px!important}
        .post-grid,.tab-card-grid,.story-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:8px!important;padding:10px!important}
        .tab-card-grid article{min-height:104px!important}
        .post-card{border-radius:18px!important}
        .contact-options,.chip-grid,.service-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}
      }
    `;
    document.head.appendChild(style);
  }

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", injectDesktopMode);
  } else {
    injectDesktopMode();
  }
})();
