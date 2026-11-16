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

  /* Header: hides on scroll down, shows on scroll up, turns dark-on-light over .oc-light sections */
  const header = $(".oc-header");
  if (header) {
    let last = scrollY;
    const lights = $$(".oc-light");
    const blocks = $$("main section, .oc-footer");
    addEventListener(
      "scroll",
      () => {
        const y = scrollY;
        const mid = header.offsetHeight / 2;
        header.classList.toggle(
          "is-light",
          !header.classList.contains("is-open") &&
            lights.some((s) => {
              const r = s.getBoundingClientRect();
              return r.top <= mid && r.bottom >= mid;
            }),
        );
        header.classList.toggle("is-scrolled", y > 40);
        // Bar takes the colour of the block under it (CSS fades between them)
        const under = blocks.find((s) => {
          const r = s.getBoundingClientRect();
          return r.top <= mid && r.bottom >= mid;
        });
        const bg = under && getComputedStyle(under).backgroundColor;
        header.style.setProperty(
          "--oc-header-bg",
          bg && bg !== "rgba(0, 0, 0, 0)" ? bg : "var(--oc-bg-dark)",
        );
        header.classList.toggle("is-hidden", y > last && y > 200 && !(lang && lang.open));
        last = y;
      },
      { passive: true },
    );
  }

  /* Mobile menu: burger toggles the panel; a link, Escape or resize closes it */
  const burger = $(".oc-burger");
  if (header && burger) {
    const setOpen = (open) => {
      header.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", open);
      document.documentElement.style.overflow = open ? "hidden" : "";
    };
    burger.addEventListener("click", () => setOpen(!header.classList.contains("is-open")));
    $$(".oc-header__nav a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
    addEventListener("keydown", (e) => e.key === "Escape" && setOpen(false));
    matchMedia("(min-width: 1101px)").addEventListener(
      "change",
      (m) => m.matches && setOpen(false),
    );
  }

  /* FAQ: one item open at a time (fallback for browsers without <details name>) */
  $$(".oc-faq__item").forEach((d, _, all) =>
    d.addEventListener("toggle", () => {
      if (d.open) all.forEach((o) => o !== d && (o.open = false));
    }),
  );

  /* Calculator: drinks per day → monthly revenue */
  $$("[data-calc]").forEach((card) => {
    const range = $("input[type=range]", card);
    const out = $("output", card);
    const sum = $("[data-calc-sum]", card);
    const fmt = new Intl.NumberFormat(card.dataset.locale, { maximumFractionDigits: 0 });
    const update = () => {
      const v = Number(range.value);
      const p = ((v - range.min) / (range.max - range.min)) * 100;
      range.style.setProperty("--oc-fill", `${p}%`);
      out.textContent = v;
      sum.textContent = fmt.format(v * card.dataset.price * card.dataset.days);
    };
    range.addEventListener("input", update);
    update();
  });

  /* Contact form (home): no backend yet, so submit opens a prefilled email.
     Model buttons preselect the topic */
  const form = $("[data-mailto]");
  if (form) {
    $$("a[data-topic]").forEach((a) =>
      a.addEventListener("click", () => {
        const r = $(`input[data-topic="${a.dataset.topic}"]`, form);
        if (r) r.checked = true;
      }),
    );
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const d = new FormData(form);
      const body = ["topic", "name", "email", "phone", "message"]
        .map((k) => d.get(k))
        .filter(Boolean)
        .join("\n");
      const subject = `${form.dataset.subject}: ${d.get("topic")}`;
      location.href = `mailto:${form.dataset.mailto}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

  /* Buy page model switcher: a thumb shows its station in the big photo */
  $$(".oc-start__media").forEach((m) => {
    const photos = $$(".oc-start__photo img", m);
    const thumbs = $$("[data-model]", m);
    thumbs.forEach((t) =>
      t.addEventListener("click", () => {
        const i = Number(t.dataset.model);
        photos.forEach((p, j) => (p.hidden = j !== i));
        thumbs.forEach((b) => b.setAttribute("aria-pressed", String(b === t)));
      }),
    );
  });

  /* Sliders: buttons scroll by one card */
  $$(".oc-slider").forEach((s) => {
    const track = $(".oc-slider__track", s);
    const [prev, next] = $$(".oc-round", s);
    const cards = $$(".oc-card", track);
    // Scroll to the next / previous card's own position (Safari drops smooth scrollBy on snap tracks)
    const go = (dir) => {
      const x = track.scrollLeft;
      const lefts = cards.map((c) => c.offsetLeft - cards[0].offsetLeft);
      const i = lefts.findIndex((l) => l > x + 2);
      const cur = i === -1 ? lefts.length - 1 : i - 1;
      const to = lefts[Math.max(0, Math.min(lefts.length - 1, cur + dir))];
      track.scrollTo({ left: to, behavior: reduced ? "auto" : "smooth" });
    };
    const sync = () => {
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    };
    [prev, next].forEach((b) => b.addEventListener("click", () => go(Number(b.dataset.dir))));
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

  /* Hero: pinned once the title reaches the top of the viewport, so the title and the
     station stay in view while scroll scrubs the orbit (frames on a canvas); the
     subtitle and CTAs below come in after it */
  const orbit = $("[data-orbit]");
  if (orbit) {
    const n = Number(orbit.dataset.frames);
    const frames = Array.from({ length: n }, (_, i) => {
      const im = new Image();
      im.src = `${orbit.dataset.src}${String(i).padStart(2, "0")}.webp`;
      return im;
    });
    const canvas = document.createElement("canvas");
    canvas.width = 1920;
    canvas.height = 1080;
    canvas.setAttribute("aria-hidden", "true");
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingQuality = "high";
    const state = { f: 0 };
    let shown = -1;
    const draw = () => {
      const i = Math.round(state.f);
      const im = frames[i];
      if (i === shown || !im.complete || !im.naturalWidth) return;
      ctx.drawImage(im, 0, 0, canvas.width, canvas.height);
      shown = i;
    };
    frames[0].decode().then(() => {
      draw();
      orbit.append(canvas);
    });
    gsap
      .timeline({
        scrollTrigger: {
          // Home (Figma 425:3524) opens on the render, so it pins from the top
          trigger: orbit.closest(".oc-hero"),
          start: "top top",
          end: "+=150%",
          pin: ".oc-hero",
          scrub: 0.6,
        },
      })
      .to(state, { f: n - 1, ease: "none", onUpdate: draw }, 0)
      // The station rises 5% while it orbits and sinks back on scroll up
      .to(orbit, { yPercent: -5, ease: "none" }, 0);
  }

  /* Headings: coffee-tech.com text reveal — lines rise and unclip (power4.out, 1.6 s, stagger 0.1) */
  document.fonts.ready.then(() => {
    $$("[data-split]").forEach((el) => {
      const split = SplitText.create(el, { type: "lines", linesClass: "oc-line" });
      const inHero = el.closest(".oc-hero");
      const stagger = inHero ? 0.25 : 0.1; // hero: each title line gets its own visible beat
      gsap.set(split.lines, { clipPath: "inset(0% 0% 100% 0%)", yPercent: 100, opacity: 0 });
      const tl = gsap.timeline({
        delay: inHero ? 0.2 : 0,
        scrollTrigger: inHero ? undefined : { trigger: el, start: "top 90%", once: true },
      });
      tl.to(split.lines, { opacity: 1, duration: 0.01, stagger }, 0).to(
        split.lines,
        {
          clipPath: "inset(0% -5% -30% 0%)",
          yPercent: 0,
          duration: 1.6,
          ease: "power4.out",
          stagger,
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
    gsap.to($$(".oc-word", fill), {
      opacity: 1,
      ease: "none",
      stagger: 0.1,
      scrollTrigger: { trigger: fill, start: "top 80%", end: "bottom 45%", scrub: true },
    });
  }

  /* Blocks fade up */
  $$("[data-reveal]").forEach((el) =>
    gsap.from(el, {
      y: 40,
      autoAlpha: 0,
      duration: 0.8,
      ease,
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        once: true,
        pinnedContainer: el.closest(".oc-hero") || undefined,
      },
    }),
  );

  /* Lists stagger in: calc card, model cards, FAQ, footer, metrics */
  [
    [".oc-calc", ".oc-calc__card"],
    [".oc-models__cards", ".oc-model"],
    [".oc-faq__list", ".oc-faq__item"],
    [".oc-footer", ".oc-footer > * > *"],
    [".oc-metrics__list", ".oc-metric"],
  ].forEach(([scope, items]) => {
    const root = $(scope);
    const els = root ? $$(items, root.parentElement) : [];
    if (!els.length) return;
    gsap.from(els, {
      y: 40,
      autoAlpha: 0,
      duration: 0.8,
      ease,
      stagger: 0.08,
      scrollTrigger: { trigger: els[0], start: "top 88%", once: true },
    });
  });

  /* Calculator: revenue counts up the first time it comes into view */
  const sum = $("[data-calc-sum]");
  if (sum) {
    const card = sum.closest("[data-calc]");
    const fmt = new Intl.NumberFormat(card.dataset.locale, { maximumFractionDigits: 0 });
    const n = { v: 0 };
    const range = $("input[type=range]", card);
    const to = Number(range.value) * card.dataset.price * card.dataset.days;
    const count = gsap.to(n, {
      v: to,
      duration: 1.4,
      ease: "power3.out",
      onUpdate: () => (sum.textContent = fmt.format(n.v)),
      scrollTrigger: { trigger: card, start: "top 80%", once: true },
    });
    range.addEventListener("input", () => count.kill(), { once: true });
  }

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
})();
