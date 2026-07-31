import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const coarsePointer = window.matchMedia("(pointer:coarse)").matches;
const q = (selector, scope = document) => scope.querySelector(selector);
const qa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const themeToggles = qa("[data-theme-toggle]");
const themeColorMeta = q('meta[name="theme-color"]');
const setTheme = (theme, persist = true) => {
  const nextTheme = theme === "light" ? "light" : "dark";
  const isLight = nextTheme === "light";
  document.documentElement.dataset.theme = nextTheme;
  themeToggles.forEach((toggle) => {
    const icon = q("[data-theme-icon]", toggle);
    if (icon) icon.dataset.icon = isLight ? "moonStar" : "sun";
    toggle.setAttribute("aria-pressed", String(isLight));
    toggle.setAttribute("aria-label", isLight ? "Enable dark mode" : "Enable light mode");
    toggle.setAttribute("title", isLight ? "Enable dark mode" : "Enable light mode");
  });
  themeColorMeta?.setAttribute("content", isLight ? "#eef4f7" : "#07080b");
  if (persist) {
    try {
      localStorage.setItem("harisriyoni-theme", nextTheme);
    } catch (error) {
      // The visual theme still works when storage is disabled.
    }
  }
};
setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark", false);
themeToggles.forEach((toggle) => toggle.addEventListener("click", () => {
  setTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light");
}));

const roleRotator = q("[data-role-rotator]");
if (roleRotator) {
  const roles = ["Backend Engineer", "Fullstack Developer"];
  const roleBox = roleRotator.closest(".hero-role-switcher");
  let roleIndex = 0;
  let roleTimer = 0;
  const renderRoleWords = (role, animate = false) => {
    roleRotator.innerHTML = role.split(" ").map((word, index) => `<span class="hero-word-part" style="--word-index:${index}">${word}</span>`).join("");
    roleRotator.classList.toggle("is-entering", animate);
  };
  const fitRoleBox = () => {
    if (!roleBox) return;
    roleBox.style.width = "max-content";
    roleBox.style.width = `${Math.ceil(roleBox.getBoundingClientRect().width)}px`;
  };
  renderRoleWords(roles[0]);
  requestAnimationFrame(fitRoleBox);

  if (reduceMotion) {
    roleRotator.classList.remove("is-entering", "is-exiting");
  }

  if (!reduceMotion) {
  const rotateRole = () => {
    roleRotator.classList.remove("is-entering");
    roleRotator.classList.add("is-exiting");
    window.setTimeout(() => {
      roleIndex = (roleIndex + 1) % roles.length;
      const currentWidth = roleBox?.getBoundingClientRect().width || 0;
      renderRoleWords(roles[roleIndex], true);
      if (roleBox) {
        roleBox.style.width = `${currentWidth}px`;
        roleBox.style.width = "max-content";
        const nextWidth = Math.ceil(roleBox.getBoundingClientRect().width);
        roleBox.style.width = `${currentWidth}px`;
        requestAnimationFrame(() => { roleBox.style.width = `${nextWidth}px`; });
      }
      roleRotator.classList.remove("is-exiting");
      window.setTimeout(() => roleRotator.classList.remove("is-entering"), 620);
    }, 280);
  };
  const startRoleRotation = () => {
    if (!roleTimer) roleTimer = window.setInterval(rotateRole, 3200);
  };
  const stopRoleRotation = () => {
    window.clearInterval(roleTimer);
    roleTimer = 0;
  };
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopRoleRotation();
    else startRoleRotation();
  });
  startRoleRotation();
  }
}

const menuButton = q("[data-menu-button]");
const mobileMenu = q("[data-mobile-menu]");
const menuIcon = q("[data-menu-icon]");

function closeMenu() {
  mobileMenu?.classList.add("hidden");
  menuButton?.setAttribute("aria-expanded", "false");
  if (menuIcon) menuIcon.dataset.icon = "menu";
}

menuButton?.addEventListener("click", () => {
  const open = mobileMenu?.classList.toggle("hidden") === false;
  menuButton.setAttribute("aria-expanded", String(open));
  if (menuIcon) menuIcon.dataset.icon = open ? "x" : "menu";
});
qa("[data-mobile-menu] a").forEach((link) => link.addEventListener("click", closeMenu));

const sections = qa("main section[id]");
const navLinks = qa("[data-nav-link]");
const updateActiveLink = () => {
  const current = sections.reduce((active, section) => window.scrollY + 180 >= section.offsetTop ? section.id : active, "hero");
  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${current}`;
    link.classList.toggle("is-active", isActive);
    if (isActive) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
};
document.addEventListener("scroll", updateActiveLink, { passive: true });
updateActiveLink();

const scrollTop = q("[data-scroll-top]");
const toggleScrollTop = () => scrollTop?.classList.toggle("hidden", window.scrollY < 500);
document.addEventListener("scroll", toggleScrollTop, { passive: true });
toggleScrollTop();
scrollTop?.addEventListener("click", (event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); });

const timelineTrack = q("[data-timeline-track]");
const timelineLine = q(".timeline-line", timelineTrack || document);
const timelineProgress = q("[data-timeline-progress]");
if (timelineTrack && timelineProgress) {
  const timelineDots = qa("[data-timeline-dot]", timelineTrack);
  const syncTimelineLine = () => {
    if (timelineDots.length < 2) return;
    const timelineItems = qa("[data-timeline-item]", timelineTrack);
    const centerOf = (dot, item) => item.offsetTop + dot.offsetTop + dot.offsetHeight / 2;
    const start = centerOf(timelineDots[0], timelineItems[0]);
    const end = centerOf(timelineDots[timelineDots.length - 1], timelineItems[timelineItems.length - 1]);
    timelineLine.style.top = `${Math.max(0, start)}px`;
    timelineLine.style.bottom = "auto";
    timelineLine.style.height = `${Math.max(1, end - start)}px`;
  };

  syncTimelineLine();
  let timelineResizeFrame = 0;
  const refreshTimelineLayout = () => {
    if (timelineResizeFrame) cancelAnimationFrame(timelineResizeFrame);
    timelineResizeFrame = requestAnimationFrame(() => {
      timelineResizeFrame = 0;
      syncTimelineLine();
      ScrollTrigger.refresh();
    });
  };
  window.addEventListener("load", () => {
    refreshTimelineLayout();
  }, { once: true, passive: true });
  window.addEventListener("resize", refreshTimelineLayout, { passive: true });
  if (document.fonts?.ready) {
    document.fonts.ready.then(refreshTimelineLayout);
  }

  if (reduceMotion) {
    gsap.set(timelineProgress, { scaleY: 1 });
  } else {
    gsap.fromTo(timelineProgress, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: timelineTrack, start: "top 70%", end: "bottom 52%", scrub: .35 } });
  }
  qa("[data-timeline-item]").forEach((item) => {
    ScrollTrigger.create({ trigger: item, start: "top 58%", end: "bottom 58%", onEnter: () => item.classList.add("is-current"), onEnterBack: () => item.classList.add("is-current"), onLeave: () => item.classList.remove("is-current"), onLeaveBack: () => item.classList.remove("is-current") });
  });
}

if (reduceMotion) {
  gsap.set(".reveal", { autoAlpha: 1, y: 0, clearProps: "transform,visibility" });
} else {
  const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
  intro.from("[data-page-nav]", { y: -22, autoAlpha: 0, duration: .42 })
    .from(".hero .eyebrow", { y: 16, autoAlpha: 0, duration: .28 }, "-=.2")
    .from("[data-hero-title]", { y: 34, autoAlpha: 0, duration: .52 }, "-=.12")
    .from("[data-hero-copy]", { y: 22, autoAlpha: 0, duration: .4 }, "-=.28")
    .from("[data-hero-action]", { y: 16, autoAlpha: 0, stagger: .06, duration: .28 }, "-=.18")
    .from("[data-hero-photo]", { scale: .9, rotate: 2, autoAlpha: 0, duration: .7 }, "-=.5");

  gsap.utils.toArray(".reveal").filter((item) => !item.closest("#hero")).forEach((item) => {
    gsap.fromTo(item, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: .5, ease: "power3.out", scrollTrigger: { trigger: item, start: "top 91%", once: true } });
  });

  if (!coarsePointer) {
    gsap.utils.toArray("[data-parallax]").forEach((item) => {
      gsap.to(item, { yPercent: Number(item.dataset.parallax) || -12, ease: "none", scrollTrigger: { trigger: item.closest("section"), start: "top bottom", end: "bottom top", scrub: .65 } });
    });
  }

  gsap.utils.toArray("[data-count]").forEach((item) => {
    const target = Number(item.dataset.count);
    const suffix = item.dataset.suffix || "";
    const decimals = String(target).includes(".") ? 2 : 0;
    const counter = { value: 0 };
    gsap.to(counter, { value: target, duration: .9, ease: "power2.out", scrollTrigger: { trigger: item, start: "top 92%", once: true }, onUpdate: () => { item.textContent = counter.value.toFixed(decimals).replace(/\.00$/, "") + suffix; } });
  });

  if (!coarsePointer) {
    qa(".tilt-card, .project-card").forEach((card) => {
      gsap.set(card, { transformPerspective: 900 });
      const setRotateX = gsap.quickTo(card, "rotateX", { duration: .16, ease: "power2.out" });
      const setRotateY = gsap.quickTo(card, "rotateY", { duration: .16, ease: "power2.out" });
      card.addEventListener("pointerenter", () => {
        gsap.to(card, { scale: 1.012, y: -6, duration: .28, ease: "power2.out", overwrite: "auto" });
      });
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        setRotateX(((event.clientY - rect.top) / rect.height - .5) * -7);
        setRotateY(((event.clientX - rect.left) / rect.width - .5) * 7);
      });
      card.addEventListener("pointerleave", () => gsap.to(card, { rotateX: 0, rotateY: 0, scale: 1, y: 0, duration: .55, ease: "power3.out", overwrite: "auto" }));
    });

    qa(".magnetic").forEach((button) => {
      const setX = gsap.quickTo(button, "x", { duration: .16, ease: "power2.out" });
      const setY = gsap.quickTo(button, "y", { duration: .16, ease: "power2.out" });
      button.addEventListener("pointermove", (event) => {
        const rect = button.getBoundingClientRect();
        setX((event.clientX - (rect.left + rect.width / 2)) * .14);
        setY((event.clientY - (rect.top + rect.height / 2)) * .14);
      });
      button.addEventListener("pointerleave", () => gsap.to(button, { x: 0, y: 0, duration: .5, ease: "elastic.out(1, .45)" }));
    });
  }
}

const cursorGlow = document.createElement("div");
cursorGlow.className = "cursor-glow";
document.body.appendChild(cursorGlow);
const cursorDot = document.createElement("div");
cursorDot.className = "cursor-dot";
document.body.appendChild(cursorDot);
const cursorRing = document.createElement("div");
cursorRing.className = "cursor-ring";
document.body.appendChild(cursorRing);
const finePointer = window.matchMedia("(pointer:fine)").matches;
if (!reduceMotion && finePointer) {
  document.body.classList.add("has-custom-cursor");
  const setDotX = gsap.quickTo(cursorDot, "x", { duration: .06, ease: "none" });
  const setDotY = gsap.quickTo(cursorDot, "y", { duration: .06, ease: "none" });
  const setRingX = gsap.quickTo(cursorRing, "x", { duration: .22, ease: "power3.out" });
  const setRingY = gsap.quickTo(cursorRing, "y", { duration: .22, ease: "power3.out" });
  const setGlowX = gsap.quickTo(cursorGlow, "x", { duration: .35, ease: "power3.out" });
  const setGlowY = gsap.quickTo(cursorGlow, "y", { duration: .35, ease: "power3.out" });
  const showGlow = gsap.quickTo(cursorGlow, "autoAlpha", { duration: .35, ease: "power3.out" });
  window.addEventListener("pointermove", (event) => {
    setDotX(event.clientX);
    setDotY(event.clientY);
    setRingX(event.clientX);
    setRingY(event.clientY);
    setGlowX(event.clientX);
    setGlowY(event.clientY);
    showGlow(1);
  }, { passive: true });
  qa("a, button, .project-card, .toolkit-card, [role=button]").forEach((element) => {
    element.addEventListener("pointerenter", () => document.body.classList.add("cursor-hover"));
    element.addEventListener("pointerleave", () => document.body.classList.remove("cursor-hover"));
  });
} else {
  cursorGlow.remove();
  cursorDot.remove();
  cursorRing.remove();
}
