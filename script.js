/* =========================================================
   InsurTech Ideathon 2026 — script.js
   ---------------------------------------------------------
   ✏️  YOU ONLY NEED TO EDIT THE CONFIG OBJECT BELOW.
   Everything on the page is built from it.
   Leave a value as "" (empty) if you don't know it yet —
   the site will show "TBA" or hide that button instead.
   ========================================================= */

const CONFIG = {
  // ----- Basic info -----
  presenter: "FYLeaderS presents",
  eventName: "InsurTech Ideathon 2026",
  tagline: "Re-imagining protection for every Malaysian",


  // ----- Date & time (Malaysia time) -----
  eventDate: "2026-12-25",   // YYYY-MM-DD   ("" = TBA)
  eventStartTime: "",        // 24-hour, e.g. "09:00"   ("" = time TBA, countdown runs to midnight)
  eventEndTime: "",          // 24-hour, e.g. "17:00"

  // Text above the hero countdown, e.g. "Registration closes in"
  countdownLabel: "Registration closes in",

  // ----- Registration deadline (the hero countdown counts down to this, Malaysia time) -----
  registrationDeadline: "2026-12-25",  // YYYY-MM-DD   ("" = hide the countdown)
  registrationDeadlineTime: "23:59",   // 24-hour; registration closes at the end of this minute

  // ----- Venue -----
  venueName: "Asia Pacific University (APU)",
  venueAddress: "Jalan Teknologi 5, Technology Park Malaysia, Bukit Jalil, 57000 Kuala Lumpur",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Asia+Pacific+University+Bukit+Jalil",

  // ----- Registration link (Google Form etc.) -----
  registrationUrl: "", // "" shows "Registration opens soon"

  // ----- FAQ (add, remove or edit questions here) -----
  faq: [
    { q: "What is the InsurTech Ideathon?",
      a: "A competition where student teams pitch new tech ideas that solve real gaps in Malaysia's insurance and takaful market, like people being left uninsured, slow claims, and low customer trust." },
    { q: "Who can join, and how big can a team be?",
      a: "Eligibility and team size will be announced together with registration. Stay tuned!" },
    { q: "What are the competition tracks?",
      a: "There are 4 tracks: AI Innovations for Insurance, Claims & Underwriting Operations, Future Distribution Models, and Human-Centric Customer Engagement." },
    { q: "How does the competition work?",
      a: "It runs in 3 phases: (1) submit your idea and concept deck, (2) build a prototype with mentor guidance, and (3) pitch and demo your solution live to the judges." },
    { q: "What do we need to submit?",
      a: "One PDF per team, named TeamName.Track.pdf, written in English. Maximum 12 core slides, including a one-slide executive summary (cover, references and appendix don't count). The cover slide should show only your team name and track." },
    { q: "How will the judges score us?",
      a: "On four things: strategic thinking and analysis, how feasible your recommendation is, data storytelling, and slide writing and visuals." },
    { q: "Can we get help from a lecturer or advisor?",
      a: "Yes, faculty advisors are optional and can give feedback, but the analysis, ideas and slides must be your team's own work." },
  ],

  // ----- Timeline phases (date is just text, e.g. "12 Nov 2026") -----
  timeline: [
    { title: "Registration Opens", date: "TBA", text: "Form your team and sign up through the registration link." },
    { title: "Phase 1: Concept Deck Submission", date: "TBA", text: "Submit your idea deck: the problem, your solution and how it works." },
    { title: "Phase 2: Prototype & Mentorship", date: "TBA", text: "Build a working prototype with feedback from industry mentors." },
    { title: "Phase 3: Final Pitch & Demo Day", date: "TBA", text: "Pitch live to the judges and show your demo." },
  ],

  // ----- Sponsors -----
  // tier must match one of sponsorTiers. Put logo files in assets/sponsors/
  // Example: { name: "Company A", logo: "assets/sponsors/company-a.png", tier: "Platinum", url: "https://company-a.com" },
  sponsorTiers: ["Platinum", "Gold", "Silver"],
  sponsors: [],

  // ----- Contact & social -----
  contactEmail: "",      // used by the "Become a sponsor" button + footer email icon
  instagramUrl: "",
  linkedinUrl: "",
};

/* =========================================================
   Below this line is the website logic.
   You don't need to change it.
   ========================================================= */

// ---------- Small helpers ----------
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasGSAP = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
const TZ = "Asia/Kuala_Lumpur";

// Arrow icon used on external links
const ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';

// Build an external link that opens in a new tab
function externalLink(url, html, className) {
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.className = className;
  a.innerHTML = html;
  return a;
}

// Put the same text into every element with a class
function fill(selector, text) {
  $$(selector).forEach((el) => (el.textContent = text));
}

// Builds the start/end moments from CONFIG (Malaysia time = +08:00)
const hasTime = () => !!(CONFIG.eventDate && CONFIG.eventStartTime);
function startDate() {
  if (!CONFIG.eventDate) return null;
  return new Date(`${CONFIG.eventDate}T${CONFIG.eventStartTime || "00:00"}:00+08:00`);
}
function endDate() {
  const s = startDate();
  if (!s) return null;
  if (CONFIG.eventEndTime) return new Date(`${CONFIG.eventDate}T${CONFIG.eventEndTime}:00+08:00`);
  // No end time: assume 8 hours, or the whole day if the start time is TBA
  return new Date(s.getTime() + (hasTime() ? 8 : 24) * 60 * 60 * 1000);
}

function formatDate(d) {
  return d.toLocaleDateString("en-MY", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: TZ });
}
function formatTime(d) {
  return d.toLocaleTimeString("en-MY", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: TZ });
}

/* =========================================================
   1. RENDER CONTENT FROM CONFIG
   ========================================================= */
function renderContent() {
  const s = startDate();
  const e = endDate();

  fill(".js-presenter", CONFIG.presenter);
  fill(".js-event-name", CONFIG.eventName);
  fill(".js-tagline", CONFIG.tagline);
  fill(".js-date-text", s ? formatDate(s) : "TBA");
  fill(".js-time-text", hasTime() ? `${formatTime(s)} – ${formatTime(e)}` : "TBA");
  fill(".js-venue-name", CONFIG.venueName || "TBA");
  fill(".js-venue-address", CONFIG.venueAddress);

  // Register buttons (nav, hero, CTA)
  $$(".js-register").forEach((slot) => {
    const label = slot.dataset.label;
    let btn;
    if (CONFIG.registrationUrl) {
      btn = externalLink(CONFIG.registrationUrl, `${label} ${ARROW}`, "btn btn--primary");
    } else {
      btn = document.createElement("span");
      btn.className = "btn btn--soon";
      btn.textContent = slot.dataset.soon || "Registration opens soon";
    }
    slot.replaceWith(btn);
  });

  // Timeline cards
  $("#timelineTrack").innerHTML = CONFIG.timeline
    .map((p, i) => `
      <li class="glass tl-card">
        <span class="tl-card__dot" aria-hidden="true"></span>
        <p class="tl-card__step">Step ${String(i + 1).padStart(2, "0")}</p>
        <h3 class="tl-card__title">${p.title}</h3>
        <p class="tl-card__date">${p.date || "TBA"}</p>
        <p>${p.text}</p>
      </li>`)
    .join("");

  // Event buttons: Google Maps + Google Calendar (only if we have the info)
  const eventButtons = $("#eventButtons");
  if (CONFIG.mapsUrl) {
    eventButtons.append(externalLink(CONFIG.mapsUrl, `Open in Google Maps ${ARROW}`, "btn btn--outline"));
  }
  if (s) {
    eventButtons.append(externalLink(googleCalendarUrl(s, e), `Add to Google Calendar ${ARROW}`, "btn btn--outline"));
  }

  // FAQ accordion (native <details>: works with keyboard + screen readers, no JS needed to open)
  $("#faqList").innerHTML = CONFIG.faq
    .map((item) => `
      <details class="glass faq__item pop">
        <summary>
          <span>${item.q}</span>
          <svg class="faq__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
        </summary>
        <p class="faq__answer">${item.a}</p>
      </details>`)
    .join("");

  renderSponsors();
  renderFooter();
}

// Builds an "Add to Google Calendar" link from CONFIG
function googleCalendarUrl(start, end) {
  const toUTC = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  // Malaysia-date as YYYYMMDD (used for all-day events when the time is TBA)
  const toDay = (d) => d.toLocaleDateString("en-CA", { timeZone: TZ }).replace(/-/g, "");
  const dates = hasTime() ? `${toUTC(start)}/${toUTC(end)}` : `${toDay(start)}/${toDay(end)}`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: CONFIG.eventName,
    dates,
    details: `${CONFIG.tagline}. Organised by FYLeaderS.`,
    location: `${CONFIG.venueName}, ${CONFIG.venueAddress}`,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

function renderSponsors() {
  const wrap = $("#sponsorTiers");
  const marquee = $("#logoMarquee");
  const becomeBtn = $("#becomeSponsor");

  // "Become a sponsor" uses the contact email
  if (CONFIG.contactEmail) {
    becomeBtn.href = `mailto:${CONFIG.contactEmail}?subject=${encodeURIComponent("Sponsoring " + CONFIG.eventName)}`;
  } else {
    becomeBtn.remove();
  }

  // No sponsors yet → friendly message instead of empty boxes
  if (!CONFIG.sponsors.length) {
    wrap.innerHTML = `
      <div class="glass sponsors__empty pop">
        <p><strong>Sponsors will be announced soon.</strong></p>
        <p>Want your brand in front of Malaysia's next InsurTech talent? We'd love to hear from you.</p>
      </div>`;
    marquee.remove();
    return;
  }

  // One group per tier
  CONFIG.sponsorTiers.forEach((tier, index) => {
    const list = CONFIG.sponsors.filter((sp) => sp.tier === tier);
    if (!list.length) return;
    const section = document.createElement("div");
    section.className = "tier" + (index === 0 ? " tier--big" : "");
    section.innerHTML = `<h3 class="tier__name">${tier}</h3><div class="tier__grid"></div>`;
    const grid = $(".tier__grid", section);
    list.forEach((sp) => {
      const inner = sp.logo
        ? `<img src="${sp.logo}" alt="${sp.name} logo" loading="lazy" />`
        : `<span class="sponsor-card__name">${sp.name}</span>`;
      const card = sp.url
        ? externalLink(sp.url, inner, "glass sponsor-card pop")
        : Object.assign(document.createElement("div"), { className: "glass sponsor-card pop", innerHTML: inner });
      // If a logo file is missing, show the name instead of a broken image
      const img = $("img", card);
      if (img) img.onerror = () => (img.outerHTML = `<span class="sponsor-card__name">${sp.name}</span>`);
      grid.append(card);
    });
    wrap.append(section);
  });

  // Infinite logo marquee (decorative copy, hidden for reduced motion)
  if (reducedMotion) { marquee.remove(); return; }
  const items = CONFIG.sponsors
    .map((sp) => (sp.logo ? `<img src="${sp.logo}" alt="" onerror="this.outerHTML='<span>${sp.name.replace(/['"]/g, "")}</span>'" />` : `<span>${sp.name}</span>`))
    .join("");
  // Repeat enough times to fill wide screens, then double for a seamless loop
  const repeat = Math.max(1, Math.ceil(8 / CONFIG.sponsors.length));
  const row = items.repeat(repeat);
  $("#logoMarqueeTrack").innerHTML = row + row;
}

function renderFooter() {

  const social = $("#footerSocial");
  const icons = {
    instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.3" cy="6.7" r=".6"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10.5V17M8 7.2v.01M11.5 17v-6.5M11.5 13.5a2.7 2.7 0 0 1 5.2-1V17"/></svg>',
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  };
  if (CONFIG.instagramUrl) {
    const a = externalLink(CONFIG.instagramUrl, icons.instagram, "");
    a.setAttribute("aria-label", "FYLeaderS on Instagram (opens in new tab)");
    social.append(a);
  }
  if (CONFIG.linkedinUrl) {
    const a = externalLink(CONFIG.linkedinUrl, icons.linkedin, "");
    a.setAttribute("aria-label", "FYLeaderS on LinkedIn (opens in new tab)");
    social.append(a);
  }
  if (CONFIG.contactEmail) {
    const a = document.createElement("a");
    a.href = `mailto:${CONFIG.contactEmail}`;
    a.innerHTML = icons.mail;
    a.setAttribute("aria-label", "Email FYLeaderS");
    social.append(a);
  }
}

/* =========================================================
   2. COUNTDOWN (before / during / after — never all zeros)
   ========================================================= */
function initCountdown() {
  const box = $("#countdown");
  if (!CONFIG.registrationDeadline) {
    box.innerHTML = '<p class="glass countdown__msg">Registration dates to be announced</p>';
    return;
  }
  // Counts down to the registration deadline (Malaysia time = +08:00)
  const deadline = new Date(`${CONFIG.registrationDeadline}T${CONFIG.registrationDeadlineTime || "23:59"}:59+08:00`);

  let state = "";
  const units = [["d", "Days"], ["h", "Hours"], ["m", "Mins"], ["s", "Secs"]];

  function tick() {
    const now = Date.now();
    const left = deadline.getTime() - now;
    // Under one second left counts as "closed", so we never show 00:00:00:00
    const newState = left >= 1000 ? "before" : "after";

    if (newState !== state) {
      state = newState;
      if (state === "before") {
        box.innerHTML = `
          <p class="countdown__label">${CONFIG.countdownLabel}</p>
          <div class="countdown__grid">${units
            .map(([k, label]) => `<div class="countdown__box"><span class="countdown__num" data-unit="${k}">--</span><span class="countdown__unit">${label}</span></div>`)
            .join("")}</div>`;
      } else {
        box.innerHTML = '<p class="glass countdown__msg">Registration is now closed</p>';
      }
    }

    if (state === "before") {
      const total = Math.floor(left / 1000);
      const values = {
        d: Math.floor(total / 86400),
        h: Math.floor((total % 86400) / 3600),
        m: Math.floor((total % 3600) / 60),
        s: total % 60,
      };
      $$("[data-unit]", box).forEach((el) => (el.textContent = String(values[el.dataset.unit]).padStart(2, "0")));
    }
    if (state === "after") clearInterval(timer);
  }

  tick();
  const timer = setInterval(tick, 1000);
}

/* =========================================================
   3. NAVIGATION (smooth scroll, mobile menu, active link)
   ========================================================= */
let lenis = null;

function initNav() {
  const nav = $("#nav");
  const toggle = $("#navToggle");
  const menu = $("#navMenu");
  const bar = $(".progress__bar");

  function closeMenu() {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    if (lenis) lenis.start();
  }

  toggle.addEventListener("click", () => {
    const open = !menu.classList.contains("is-open");
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (lenis) open ? lenis.stop() : lenis.start();
  });
  document.addEventListener("keydown", (ev) => { if (ev.key === "Escape") closeMenu(); });

  // All in-page links scroll smoothly
  $$("[data-scroll]").forEach((link) => {
    link.addEventListener("click", (ev) => {
      const target = $(link.getAttribute("href"));
      if (!target) return;
      ev.preventDefault();
      closeMenu();
      if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4 });
      else target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    });
  });

  // Frosted nav after scrolling + top progress bar
  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 40);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Highlight the link for the section in the middle of the screen
  const links = $$(".nav__menu ul a");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => {
          const active = a.getAttribute("href") === `#${entry.target.id}`;
          a.classList.toggle("is-active", active);
          active ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current");
        });
      });
    },
    { rootMargin: "-50% 0px -50% 0px" }
  );
  $$("[data-section]").forEach((sec) => observer.observe(sec));
}

/* =========================================================
   4. SMOOTH SCROLL (Lenis + GSAP ScrollTrigger)
   ========================================================= */
function initLenis() {
  if (reducedMotion || typeof window.Lenis === "undefined" || !hasGSAP) return;
  lenis = new Lenis({ duration: 1.15, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* =========================================================
   5. HERO EXTRAS: sparkles + video
   ========================================================= */
function initSparkles() {
  // Reduced motion: keep the hero video still (first frame) instead of playing
  const video = $("#heroVideo");
  if (video && reducedMotion) { video.removeAttribute("autoplay"); video.pause(); }

  if (reducedMotion) return;
  const count = window.innerWidth < 768 ? 10 : 20;
  // Every .sparkles layer (hero + About) gets its own floating dots
  $$(".sparkles").forEach((holder) => {
    for (let i = 0; i < count; i++) {
      const dot = document.createElement("i");
      dot.style.left = `${Math.random() * 100}%`;
      dot.style.setProperty("--s", `${2 + Math.random() * 4}px`);
      dot.style.setProperty("--d", `${9 + Math.random() * 10}s`);
      dot.style.setProperty("--delay", `${-Math.random() * 15}s`);
      holder.append(dot);
    }
  });
}

/* =========================================================
   6. SCROLL ANIMATIONS (GSAP)
   ========================================================= */

// How scroll animations behave:
//   "play none none reset" = play when scrolling down into view,
//   reset when you scroll back up above it, so it plays again every time.
//   Change to "play none none none" to make animations play only once.
const REPLAY = "play none none reset";

// Wrap every word of a heading so it can be revealed word by word
function splitWords() {
  $$(".js-split").forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.setAttribute("aria-label", el.textContent.trim());
    el.innerHTML = words.map((w) => `<span class="word" aria-hidden="true"><span>${w}</span></span>`).join(" ");
  });
}

function initScrollAnimations() {
  if (!hasGSAP || reducedMotion) return;

  // Headings (outside the hero): word-by-word mask reveal
  $$(".js-split").forEach((el) => {
    if (el.closest(".hero")) return;
    gsap.from($$(".word > span", el), {
      yPercent: 110,
      duration: 0.9,
      ease: "power4.out",
      stagger: 0.07,
      scrollTrigger: { trigger: el, start: "top 85%", toggleActions: REPLAY },
    });
  });

  // Section labels
  gsap.utils.toArray(".section .label").forEach((el) => {
    gsap.from(el, { opacity: 0, y: 24, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%", toggleActions: REPLAY } });
  });

  // "Pop out" elements: fade + slide up + scale 0.95 → 1, staggered
  const popTargets = ".reveal, .pop, .tier__name";
  // Tweak these numbers to make the pop stronger / softer:
  //   y = how far it slides up, scale = starting size, start = how far up the screen it triggers
  gsap.set(popTargets, { opacity: 0, y: 70, scale: 0.9 });
  ScrollTrigger.batch(popTargets, {
    start: "top 82%",
    onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: "power3.out", stagger: 0.18, overwrite: true }),
    // Scrolled back up above it? Hide it again so it pops in next time you scroll down
    onLeaveBack: (batch) => gsap.set(batch, { opacity: 0, y: 70, scale: 0.9, overwrite: true }),
  });

  // Hero content drifts up and fades as you scroll away
  gsap.to(".hero__content", {
    yPercent: -12, opacity: 0.2, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });

  initTimeline();
}

// Timeline: horizontal pinned scroll on desktop, vertical on mobile
function initTimeline() {
  // Vertical timeline on every screen size:
  // the line down the left fills in as you scroll, cards fade in one by one
  const track = $("#timelineTrack");
  const fillLine = $(".timeline__line-fill");
  gsap.fromTo(fillLine, { scaleY: 0 }, {
    scaleY: 1, ease: "none",
    scrollTrigger: { trigger: track, start: "top 70%", end: "bottom 60%", scrub: true },
  });
  $$(".tl-card").forEach((card) => {
    gsap.from(card, { opacity: 0, x: 40, scale: 0.95, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 88%", toggleActions: REPLAY } });
  });
}


/* =========================================================
   7. HERO INTRO (plays once when the page opens)
   ========================================================= */
function heroIntro() {
  if (!hasGSAP || reducedMotion) return;

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  // Fade the video in (opacity only — scaling a video can make Chrome draw it above the nav)
  tl.from(".hero__video", { opacity: 0, duration: 1.4 }, 0)
    .from(".hero .label", { opacity: 0, y: 20, duration: 0.6 }, 0.2)
    .from(".hero__title .word > span", { yPercent: 110, duration: 0.9, ease: "power4.out", stagger: 0.08 }, 0.3)
    .from(".hero__tagline", { opacity: 0, y: 24, duration: 0.7 }, 0.6)
    .from(".countdown", { opacity: 0, y: 24, duration: 0.6 }, 0.8)
    .from(".hero__buttons > *", { opacity: 0, y: 24, scale: 0.95, duration: 0.6, stagger: 0.08 }, 1);
}

/* =========================================================
   8. START EVERYTHING
   ========================================================= */
renderContent();
splitWords();
initCountdown();
if (hasGSAP) gsap.registerPlugin(ScrollTrigger);
initLenis();
initNav();
initSparkles();
initScrollAnimations();
heroIntro();

// Recalculate scroll positions once fonts and images have loaded
window.addEventListener("load", () => { if (hasGSAP) ScrollTrigger.refresh(); });
