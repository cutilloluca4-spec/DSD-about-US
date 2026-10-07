/* ==================================================================
   D.S.D. — site.js
   Intro video, reveal on scroll, nav, back-to-top e form contatti.
   Condiviso da tutte le pagine del sito.
   ================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  /* Versione per Figma (?figma): niente intro e niente animazioni, tutto visibile */
  if (/[?&]figma/.test(location.search)) {
    const i = document.getElementById("intro"); if (i) i.remove();
    document.body.style.overflow = "";
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  /* ---------------------------------------------------------------
     0. Split del titolo hero in parole (per lo stagger GSAP)
     --------------------------------------------------------------- */
  const heroTitle = document.getElementById("heroTitle");
  if (heroTitle) {
    const lines = heroTitle.innerHTML.split("<br>");
    heroTitle.innerHTML = lines
      .map(line =>
        line
          .trim()
          .split(" ")
          .map(w => '<span class="word">' + w + "</span>")
          .join(" ")
      )
      .join("<br>");
  }
  const heroWords = heroTitle ? heroTitle.querySelectorAll(".word") : [];
  const heroRevealEls = document.querySelectorAll(".hero .reveal-up, .page-header .reveal-up");

  gsap.set(heroWords, { y: "110%", opacity: 0 });
  gsap.set(heroRevealEls, { y: 24, opacity: 0 });

  const heroTl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });
  heroTl
    .to(heroWords, { y: "0%", opacity: 1, duration: 0.7, stagger: 0.05 }, 0)
    .to(heroRevealEls, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 }, 0.25);

  /* ---------------------------------------------------------------
     1. Intro — video del logo (solo home)
     --------------------------------------------------------------- */
  const intro = document.getElementById("intro");
  const introVideo = document.getElementById("introVideo");
  const introSkip = document.getElementById("introSkip");
  const introBar = document.getElementById("introBar");

  if (intro && introVideo) {
    document.body.style.overflow = "hidden";
    let closed = false;

    const closeIntro = () => {
      if (closed) return;
      closed = true;
      gsap.to(intro, {
        yPercent: -100,
        duration: 0.9,
        ease: "power3.inOut",
        onComplete: () => {
          intro.style.display = "none";
          document.body.style.overflow = "";
        }
      });
      heroTl.play();
    };

    introVideo.addEventListener("ended", closeIntro);
    introVideo.addEventListener("error", closeIntro);
    // Fallback: se l'autoplay viene bloccato o il video impiega troppo, non blocchiamo l'utente
    const safetyTimeout = setTimeout(closeIntro, 6500);
    introVideo.addEventListener("ended", () => clearTimeout(safetyTimeout));

    if (introBar) {
      introVideo.addEventListener("timeupdate", () => {
        if (introVideo.duration) {
          introBar.style.width = (introVideo.currentTime / introVideo.duration) * 100 + "%";
        }
      });
    }

    introVideo.play().catch(() => {
      // Autoplay bloccato dal browser: passiamo comunque alla home dopo una breve pausa
      setTimeout(closeIntro, 400);
    });

    if (introSkip) introSkip.addEventListener("click", closeIntro);
  } else {
    // Pagine senza intro: la hero/page-header è già "pronta"
    heroTl.play();
  }

  /* ---------------------------------------------------------------
     2. Reveal on scroll per il resto della pagina
     --------------------------------------------------------------- */
  const otherReveals = document.querySelectorAll(
    ".reveal-up:not(.hero .reveal-up):not(.page-header .reveal-up)"
  );
  gsap.set(otherReveals, { y: 24, opacity: 0 });
  otherReveals.forEach(el => {
    gsap.to(el, {
      y: 0,
      opacity: 1,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 88%" }
    });
  });

  /* ---------------------------------------------------------------
     3. Nav: stato "scrolled" + menu mobile + link attivo
     --------------------------------------------------------------- */
  const nav = document.getElementById("siteNav");
  const navToggle = document.getElementById("navToggle");
  const navMobile = document.getElementById("navMobile");

  if (nav) {
    ScrollTrigger.create({
      start: 40,
      onUpdate: self => nav.classList.toggle("is-scrolled", self.scroll() > 40)
    });
  }

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navMobile.classList.toggle("is-open");
    });
    navMobile.querySelectorAll("a").forEach(a =>
      a.addEventListener("click", () => navMobile.classList.remove("is-open"))
    );
    // chiusura toccando fuori dal pannello o con Esc
    document.addEventListener("click", e => {
      if (navMobile.classList.contains("is-open") && !navMobile.contains(e.target) && !navToggle.contains(e.target)) navMobile.classList.remove("is-open");
    });
    document.addEventListener("keydown", e => { if (e.key === "Escape") navMobile.classList.remove("is-open"); });
  }

  /* ---------------------------------------------------------------
     4. Back to top
     --------------------------------------------------------------- */
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    // Soglia proporzionale: compare anche sulle pagine corte (es. Contatti)
    const updateBackToTop = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const threshold = Math.min(600, Math.max(80, max * 0.35));
      backToTop.classList.toggle("is-visible", max > 40 && window.scrollY > threshold);
    };
    window.addEventListener("scroll", updateBackToTop, { passive: true });
    window.addEventListener("resize", updateBackToTop);
    updateBackToTop();
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------------------------------------------------------
     5. Form contatti (solo front-end, nessun invio reale)
     --------------------------------------------------------------- */
  const contactForm = document.getElementById("contactForm");
  const formSuccess = document.getElementById("formSuccess");
  if (contactForm) {
    contactForm.addEventListener("submit", e => {
      e.preventDefault();
      contactForm.reset();
      if (formSuccess) {
        formSuccess.classList.add("is-visible");
        formSuccess.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }
});
