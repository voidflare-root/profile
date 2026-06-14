(() => {
  function injectDesktopMode() {
    if (document.querySelector("#desktopModeStyles")) return;

    const style = document.createElement("style");
    style.id = "desktopModeStyles";
    style.textContent = `
      @media (min-width:1024px){
        .app-shell{width:min(1240px,calc(100% - 56px))!important;display:grid!important;grid-template-columns:minmax(380px,450px) minmax(0,1fr)!important;gap:22px!important;align-items:start!important;padding-top:42px!important}
        .profile-card{position:sticky!important;top:24px!important;width:100%!important;margin:0!important;grid-column:1!important;grid-row:1 / span 8!important}
        .posts-section,.stories-section,.info-section{width:100%!important;margin-top:0!important;grid-column:2!important}
        .stories-section,.info-section{margin-top:22px!important}
        h1{font-size:clamp(2.55rem,3.15vw,3.25rem)!important;white-space:nowrap!important;overflow-wrap:normal!important;word-break:normal!important}
        .profile-line{gap:18px!important}
        .dp-ring{width:150px!important}
        .name-row{gap:10px!important;min-width:0!important}
        .instagram-link{width:46px!important;height:46px!important;border-radius:14px!important}
        .bio{font-size:1rem!important}
        .role-boxes,.action-row{grid-template-columns:repeat(4,minmax(0,1fr))!important}
        .role-boxes span,.action-row button,.action-row a,.social-name-row a{min-height:54px!important}
        .section-title{padding:18px!important}
        .post-grid,.tab-card-grid{grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:12px!important;padding:16px!important}
        .story-grid{grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:12px!important;padding:16px!important}
        .tab-card-grid article{min-height:132px!important}
        .post-card{border-radius:22px!important}
        .contact-options,.chip-grid,.service-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important}
      }
      @media (min-width:1360px){
        .app-shell{width:min(1320px,calc(100% - 72px))!important;grid-template-columns:470px minmax(0,1fr)!important;gap:26px!important}
        .post-grid,.tab-card-grid,.story-grid{grid-template-columns:repeat(5,minmax(0,1fr))!important}
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
