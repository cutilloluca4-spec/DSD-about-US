/* ==================================================================
   🔗 LINK DEL PORTALE DSD — unico punto da modificare per tutto il sito.
   Incolla l'indirizzo tra le virgolette, ad esempio:
   window.PORTAL_URL = "https://portale.digitalsportsdesk.it";
   Tutti i pulsanti "Entra nel portale" di tutte le pagine si aggiornano da soli.
   ================================================================== */
window.PORTAL_URL = "https://cutilloluca4-spec.github.io/dsd-portale/";

(function () {
  function apply() {
    var url = window.PORTAL_URL;
    document.querySelectorAll('[data-portal]').forEach(function (a) {
      if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener'; }
    });
    document.querySelectorAll('[data-portal-url]').forEach(function (el) {
      el.textContent = url ? url.replace(/^https?:\/\//, '') : 'link in arrivo';
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply); else apply();
})();
