/* OneCup — interactions and motion.
   Motion follows the coffee-tech.com reference: GSAP + ScrollTrigger + SplitText, smooth scroll,
   power2.out eases, 0.6–0.9 s, small staggers. Everything degrades to a static page without JS. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Language menu: close on outside click */
  const lang = $(".oc-lang");
  document.addEventListener("click", (e) => {
    if (lang && lang.open && !lang.contains(e.target)) lang.open = false;
  });

  /* Header: hides on scroll down, shows on scroll up */
  const header = $(".oc-header");
  if (header) {
    let last = scrollY;
    addEventListener(
      "scroll",
      () => {
        const y = scrollY;
        header.classList.toggle("is-scrolled", y > 40);
        header.classList.toggle("is-hidden", y > last && y > 200 && !(lang && lang.open));
        last = y;
      },
      { passive: true },
    );
  }

  /* FAQ: one item open at a time (fallback for browsers without <details name>) */
  $$(".oc-faq__item").forEach((d, _, all) =>
    d.addEventListener("toggle", () => {
      if (d.open) all.forEach((o) => o !== d && (o.open = false));
    }),
  );

  /* Materials: one row open, image follows the active row */
  const mat = $(".oc-mat");
  if (mat) {
    const rows = $$(".oc-mat__row", mat);
    const imgs = $$(".oc-mat__media img", mat);
    const media = $(".oc-mat__media", mat);
    const activate = (i) => {
      rows.forEach((r, k) => {
        r.classList.toggle("is-active", k === i);
        $(".oc-mat__name", r).setAttribute("aria-expanded", String(k === i));
      });
      imgs.forEach((im, k) => im.classList.toggle("is-active", k === i));
      if (media && matchMedia("(min-width: 1201px)").matches) {
        const row = rows[i];
        media.style.setProperty(
          "--oc-mat-y",
          `${row.offsetTop + row.offsetHeight / 2 - media.offsetHeight / 2}px`,
        );
        media.style.setProperty("--oc-mat-r", `${i % 2 ? -4 : 4}deg`);
      }
    };
    rows.forEach((r, i) => {
      $(".oc-mat__name", r).addEventListener("click", () => activate(i));
      r.addEventListener("mouseenter", () => activate(i));
    });
    addEventListener("load", () => activate(0));
  }

  /* Sliders: buttons scroll by one card */
  $$(".oc-slider").forEach((s) => {
    const track = $(".oc-slider__track", s);
    const [prev, next] = $$(".oc-round", s);
    const step = () => {
      const card = $(".oc-card", track);
      return card.offsetWidth + parseFloat(getComputedStyle(track).columnGap || 24);
    };
    const sync = () => {
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    };
    [prev, next].forEach((b) =>
      b.addEventListener("click", () =>
        track.scrollBy({ left: step() * Number(b.dataset.dir), behavior: "smooth" }),
      ),
    );
    track.addEventListener("scroll", sync, { passive: true });
    sync();
  });

  if (reduced || !window.gsap) return;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  const ease = "power2.out";

  /* Smooth scroll */
  if (window.Lenis) {
    const lenis = new Lenis({ lerp: 0.1 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach((a) =>
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        const el = id === "#top" ? 0 : $(id);
        if (el === null) return;
        e.preventDefault();
        lenis.scrollTo(el, { duration: 1.2 });
      }),
    );
  }

  /* Hero: orbit video scrubbed by scroll while the hero is pinned */
  const video = $(".oc-hero__video");
  if (video) {
    const pin = $(".oc-hero__pin");
    let target = 0;
    const seek = () => {
      if (video.readyState >= 1 && Math.abs(video.currentTime - target) > 0.01)
        video.currentTime = target;
    };
    // iOS only renders seeks after the video has been played once
    const unlock = () =>
      video
        .play()
        .then(() => video.pause())
        .catch(() => {});
    addEventListener("touchstart", unlock, { once: true, passive: true });
    video.load();
    ScrollTrigger.create({
      trigger: ".oc-hero",
      start: "top top",
      end: "+=120%",
      pin,
      scrub: true,
      onUpdate: (self) => {
        if (!video.duration) return;
        target = self.progress * (video.duration - 0.05);
        requestAnimationFrame(seek);
      },
    });
    // The machine lifts up while it turns
    gsap.fromTo(
      ".oc-hero__media",
      { yPercent: 0, scale: 1 },
      {
        yPercent: -22,
        scale: 1.06,
        ease: "none",
        scrollTrigger: { trigger: ".oc-hero", start: "top top", end: "+=120%", scrub: true },
      },
    );
  }

  /* Headings: coffee-tech.com text reveal — lines rise and unclip (power4.out, 1.6 s, stagger 0.1) */
  document.fonts.ready.then(() => {
    $$("[data-split]").forEach((el) => {
      const split = SplitText.create(el, { type: "lines", linesClass: "oc-line" });
      const inHero = el.closest(".oc-hero");
      gsap.set(split.lines, { clipPath: "inset(0% 0% 100% 0%)", yPercent: 100, opacity: 0 });
      const tl = gsap.timeline({
        delay: inHero ? 0.2 : 0,
        scrollTrigger: inHero ? undefined : { trigger: el, start: "top 90%", once: true },
      });
      tl.to(split.lines, { opacity: 1, duration: 0.01, stagger: 0.1 }, 0).to(
        split.lines,
        {
          clipPath: "inset(0% -5% -30% 0%)",
          yPercent: 0,
          duration: 1.6,
          ease: "power4.out",
          stagger: 0.1,
        },
        0,
      );
    });
    ScrollTrigger.refresh();
  });

  /* About: words fill in as you scroll */
  const fill = $("[data-fill]");
  if (fill) {
    const walk = (node) =>
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3 && n.textContent.trim()) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((w) => {
            if (!w.trim()) return frag.append(w);
            const s = document.createElement("span");
            s.className = "oc-word";
            s.textContent = w;
            frag.append(s);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== "IMG") walk(n);
      });
    walk(fill);
    gsap.set($$(".oc-about__pill", fill), { opacity: 0.15 });
    gsap.to($$(".oc-word, .oc-about__pill", fill), {
      opacity: 1,
      ease: "none",
      stagger: 0.1,
      scrollTrigger: { trigger: fill, start: "top 80%", end: "bottom 45%", scrub: true },
    });
  }

  /* Steps: number slides up from a mask, texts follow */
  $$(".oc-step").forEach((step) => {
    step.removeAttribute("data-reveal");
    const tl = gsap.timeline({ scrollTrigger: { trigger: step, start: "top 80%", once: true } });
    tl.from($(".oc-step__n span", step), { yPercent: 100, duration: 0.9, ease: "power3.out" }).from(
      $$(".oc-step__label, .oc-step__note, .oc-step__body", step),
      { y: 30, autoAlpha: 0, duration: 0.7, stagger: 0.08, ease },
      0.15,
    );
  });

  /* Blocks fade up */
  $$("[data-reveal]").forEach((el) =>
    gsap.from(el, {
      y: 40,
      autoAlpha: 0,
      duration: 0.8,
      ease,
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    }),
  );

  /* Cards stagger in */
  $$(".oc-slider__track").forEach((t) =>
    gsap.from($$(".oc-card", t), {
      y: 60,
      autoAlpha: 0,
      duration: 0.9,
      ease,
      stagger: 0.06,
      scrollTrigger: { trigger: t, start: "top 85%", once: true },
    }),
  );

  /* Metrics count up */
  $$("[data-count]").forEach((el) => {
    const to = Number(el.dataset.count);
    const obj = { v: 0 };
    gsap.to(obj, {
      v: to,
      duration: 1.6,
      ease: "power2.inOut",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
      onUpdate: () => (el.textContent = Math.round(obj.v)),
    });
  });

  /* Station in «Two models» drifts with scroll */
  const station = $(".oc-models__station img");
  if (station)
    gsap.fromTo(
      station,
      { yPercent: 8, scale: 0.94 },
      {
        yPercent: -4,
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".oc-models",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );

  /* Marquee reacts to scroll direction and speed */
  const track = $(".oc-marquee__track");
  if (track) {
    track.style.animation = "none";
    const loop = gsap.to(track, { xPercent: -50, duration: 30, ease: "none", repeat: -1 });
    ScrollTrigger.create({
      trigger: ".oc-marquee",
      onUpdate: (self) => {
        const v = gsap.utils.clamp(-6, 6, self.getVelocity() / 300);
        gsap.to(loop, { timeScale: v === 0 ? 1 : v, duration: 0.3, overwrite: true });
        gsap.to(loop, { timeScale: self.direction, duration: 1, delay: 0.3 });
      },
    });
  }
})();
