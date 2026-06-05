/* ============================================================
   PAJU LOUNGE & FAMILY RESTAURANT — script.js
   Vanilla JS only. No dependencies.
   ============================================================ */

"use strict";

/* ── Utility ─────────────────────────────────────────────── */
function throttle(fn, ms) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn.apply(this, args);
    }
  };
}

function qs(sel, ctx) {
  return (ctx || document).querySelector(sel);
}
function qsa(sel, ctx) {
  return (ctx || document).querySelectorAll(sel);
}

/* ═══════════════════════════════════════════════════════════
   INIT on DOM ready
═══════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  initPageLoader();
  handleArrivalHash(); // clean URL if page was opened with a #hash
  initNavbar();
  initMobileNav();
  initSmoothScroll();
  initScrollReveal();
  initMenuPage(); // Loads data from Google Sheet and kicks off filters
  initCarousel();
  initScrollTop();
  initOpenStatus();
  initReservationForm();
  initStatCounters();
  initHeroParallax();
  initFooterYear();
});

/* ═══════════════════════════════════════════════════════════
   0. PAGE LOADER
   Hides the loader once the page is fully loaded.
   Max wait: 4s so it never blocks the user.
═══════════════════════════════════════════════════════════ */
function initPageLoader() {
  const loader = qs("#pageLoader");
  if (!loader) return;

  // Lock scroll while loader is visible
  document.body.style.overflow = "hidden";
  document.body.style.touchAction = "none";

  let dismissed = false;

  function hideLoader() {
    if (dismissed) return; // guard: never run twice
    dismissed = true;

    // 1. Restore scrolling immediately so the page is usable
    document.body.style.overflow = "";
    document.body.style.touchAction = "";

    // 2. Start the fade-out (CSS transition: opacity .55s)
    loader.classList.add("hidden");

    // 3. Remove from DOM after transition completes.
    const CSS_TRANSITION_MS = 600;

    const removeLoader = () => {
      if (loader.parentNode) loader.parentNode.removeChild(loader);
    };

    // Primary: CSS transition end
    loader.addEventListener("transitionend", removeLoader, { once: true });

    // Fallback: hard timeout — always removes loader
    setTimeout(removeLoader, CSS_TRANSITION_MS);
  }

  // Show loader for at least 1.2s so the animation is visible,
  // then hide as soon as the page is ready.
  const MIN_DISPLAY_MS = 1200;
  const MAX_WAIT_MS = 5000; // absolute maximum — never blocks user
  const startTime = Date.now();

  function tryHide() {
    const elapsed = Date.now() - startTime;
    const delay = Math.max(0, MIN_DISPLAY_MS - elapsed);
    setTimeout(hideLoader, delay);
  }

  if (document.readyState === "complete") {
    tryHide();
  } else {
    window.addEventListener("load", tryHide, { once: true });
    setTimeout(hideLoader, MAX_WAIT_MS);
  }
}

/* ═══════════════════════════════════════════════════════════
   1. NAVBAR — sticky + active link highlight
═══════════════════════════════════════════════════════════ */
function initNavbar() {
  const navbar = qs("#navbar");
  const navLinks = qsa(".nav-link");
  const sections = qsa("section[id]");
  const scrollBtn = qs("#scrollTop");

  if (!navbar) return;

  const onScroll = throttle(() => {
    const y = window.scrollY;

    navbar.classList.toggle("scrolled", y > 50);
    if (scrollBtn) scrollBtn.classList.toggle("visible", y > 500);

    let current = "";
    sections.forEach((sec) => {
      if (y >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach((link) => {
      const href = link.getAttribute("href") || "";
      let targetSection = "";

      if (href.startsWith("#")) {
        targetSection = href.slice(1);
      } else if (href.startsWith("/#")) {
        targetSection = href.slice(2);
      }

      const isMenuLink =
        href === "menu.html" ||
        href === "/menu.html" ||
        href.endsWith("menu.html");
      const onMenuPage = window.location.pathname.includes("menu.html");

      let isActive = false;
      if (isMenuLink) {
        isActive = onMenuPage;
      } else if (targetSection) {
        isActive = targetSection === current;
      }

      link.classList.toggle("active", isActive);
    });
  }, 60);

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ═══════════════════════════════════════════════════════════
   2. MOBILE NAV
═══════════════════════════════════════════════════════════ */
function initMobileNav() {
  const hamburger = qs("#hamburger");
  const mobileNav = qs("#mobileNav");
  const closeBtn = qs("#mobileNavClose");
  const mobileLinks = qsa(".mobile-link, .mobile-cta-btn");

  if (!hamburger || !mobileNav) return;

  function open() {
    mobileNav.classList.add("open");
    mobileNav.setAttribute("aria-hidden", "false");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
  }

  function close() {
    mobileNav.classList.remove("open");
    mobileNav.setAttribute("aria-hidden", "true");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    document.body.style.touchAction = "";
  }

  hamburger.addEventListener("click", open);
  if (closeBtn) closeBtn.addEventListener("click", close);

  mobileLinks.forEach((link) => link.addEventListener("click", close));

  mobileNav.addEventListener("click", (e) => {
    if (e.target === mobileNav) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileNav.classList.contains("open")) close();
  });
}

/* ═══════════════════════════════════════════════════════════
   3. SMOOTH SCROLL for all anchor links
═══════════════════════════════════════════════════════════ */
function initSmoothScroll() {
  const navbar = qs("#navbar");

  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const id = link.getAttribute("href");
    if (id === "#") return;

    const target = qs(id);
    if (!target) return;

    e.preventDefault();
    const offset = navbar ? navbar.offsetHeight : 64;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top, behavior: "smooth" });
    history.replaceState(null, "", window.location.pathname);
  });

  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="/#"]');
    if (!link) return;

    const href = link.getAttribute("href");
    const sectionId = href.replace("/", "");
    const isOnHomePage =
      window.location.pathname === "/" ||
      window.location.pathname === "/index.html" ||
      window.location.pathname.endsWith("/");

    if (isOnHomePage) {
      e.preventDefault();
      const target = qs(sectionId);
      if (!target) return;
      const offset = navbar ? navbar.offsetHeight : 64;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
      history.replaceState(null, "", "/");
    }
  });
}

/* ═══════════════════════════════════════════════════════════
   3b. ARRIVAL HASH HANDLER
═══════════════════════════════════════════════════════════ */
function handleArrivalHash() {
  const hash = window.location.hash;
  if (!hash || hash === "#") return;

  const target = qs(hash);
  if (!target) {
    history.replaceState(null, "", window.location.pathname);
    return;
  }

  const navbar = qs("#navbar");
  const offset = navbar ? navbar.offsetHeight : 64;

  setTimeout(() => {
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });

    setTimeout(() => {
      history.replaceState(null, "", window.location.pathname);
    }, 100);
  }, 120);
}

/* ═══════════════════════════════════════════════════════════
   4. SCROLL REVEAL — Intersection Observer
═══════════════════════════════════════════════════════════ */
function initScrollReveal() {
  const els = qsa(".reveal-up, .reveal-left, .reveal-right");
  if (!els.length) return;

  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
  );

  els.forEach((el) => observer.observe(el));
}

/* ═══════════════════════════════════════════════════════════
   5. MENU FILTER + SEARCH
═══════════════════════════════════════════════════════════ */
function initMenuFilter() {
  const filterBtns = qsa(".filter-btn");
  const searchForm = qs("#menuSearchForm");
  const searchInput = qs("#menuSearchInput");
  const resultCount = qs("#menuResultsCount");
  const emptyState = qs("#menuEmptyState");

  if (!filterBtns.length && !searchForm) return;

  function getActiveFilter() {
    const activeBtn = qs(".filter-btn.active");
    return activeBtn ? activeBtn.dataset.filter : "all";
  }

  window.applyMenuFilters = function () {
    const menuCards = qsa(".menu-card");
    if (!menuCards.length) return;
    const filter = getActiveFilter();
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    let visibleCount = 0;

    menuCards.forEach((card) => {
      const categoryMatch =
        filter === "all" || card.dataset.category === filter;
      const searchText = card.dataset.search || "";
      const searchMatch = !query || searchText.includes(query);
      const match = categoryMatch && searchMatch;

      if (match) {
        card.classList.remove("hidden");
        card.style.setProperty(
          "--card-delay",
          `${(visibleCount % 8) * 0.055}s`,
        );
        card.classList.remove("menu-card--animate");
        requestAnimationFrame(() => {
          card.classList.add("menu-card--animate");
        });
        visibleCount += 1;
      } else {
        card.classList.add("hidden");
        card.classList.remove("menu-card--animate");
      }
    });

    if (resultCount) {
      const itemLabel = visibleCount === 1 ? "item" : "items";
      resultCount.textContent = query
        ? `${visibleCount} ${itemLabel} found for “${searchInput.value.trim()}”`
        : `${visibleCount} ${itemLabel} shown`;
    }

    if (emptyState) emptyState.hidden = visibleCount !== 0;
  };

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      window.applyMenuFilters();
    });
  });

  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      window.applyMenuFilters();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", window.applyMenuFilters);
    searchInput.addEventListener("search", window.applyMenuFilters);
  }

  window.applyMenuFilters();
}

/* ═══════════════════════════════════════════════════════════
   6. REVIEW CAROUSEL
═══════════════════════════════════════════════════════════ */
function initCarousel() {
  const track = qs("#reviewsTrack");
  const prevBtn = qs("#prevReview");
  const nextBtn = qs("#nextReview");
  const dotsWrap = qs("#carouselDots");

  if (!track || !prevBtn || !nextBtn) return;

  const cards = qsa(".review-card", track);
  const total = cards.length;
  let current = 0;
  let timer = null;

  if (dotsWrap) {
    cards.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel-dot" + (i === 0 ? " active" : "");
      dot.setAttribute("aria-label", `Go to review ${i + 1}`);
      dot.addEventListener("click", () => {
        goTo(i);
        resetTimer();
      });
      dotsWrap.appendChild(dot);
    });
  }

  function goTo(idx) {
    current = ((idx % total) + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    if (dotsWrap) {
      qsa(".carousel-dot", dotsWrap).forEach((dot, i) => {
        dot.classList.toggle("active", i === current);
      });
    }
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 5500);
  }

  prevBtn.addEventListener("click", () => {
    goTo(current - 1);
    resetTimer();
  });
  nextBtn.addEventListener("click", () => {
    goTo(current + 1);
    resetTimer();
  });

  let touchX = 0;
  track.addEventListener(
    "touchstart",
    (e) => {
      touchX = e.changedTouches[0].screenX;
    },
    { passive: true },
  );
  track.addEventListener(
    "touchend",
    (e) => {
      const diff = touchX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 40) {
        goTo(diff > 0 ? current + 1 : current - 1);
        resetTimer();
      }
    },
    { passive: true },
  );

  track.addEventListener("mouseenter", () => clearInterval(timer));
  track.addEventListener("mouseleave", resetTimer);
  track.addEventListener("focusin", () => clearInterval(timer));
  track.addEventListener("focusout", resetTimer);

  resetTimer();
}

/* ═══════════════════════════════════════════════════════════
   7. SCROLL-TO-TOP
═══════════════════════════════════════════════════════════ */
function initScrollTop() {
  const btn = qs("#scrollTop");
  if (!btn) return;
  btn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );
}

/* ═══════════════════════════════════════════════════════════
   8. OPEN/CLOSED STATUS (Nepal Standard Time: UTC+5:45)
═══════════════════════════════════════════════════════════ */
function initOpenStatus() {
  const el = qs("#openStatus");
  if (!el) return;

  function update() {
    const NPL_OFFSET_MS = 345 * 60 * 1000;
    const nowNPL = new Date(Date.now() + NPL_OFFSET_MS);
    const hour = nowNPL.getUTCHours();
    const min = nowNPL.getUTCMinutes();
    const day = nowNPL.getUTCDay();
    const totalMin = hour * 60 + min;

    const OPEN_MIN = 6 * 60;
    const CLOSE_MIN = 22 * 60;

    const LM_START = 18 * 60;
    const LM_END = 21 * 60;
    const isLiveMusicNow =
      (day === 5 || day === 6) && totalMin >= LM_START && totalMin < LM_END;

    const isOpen = totalMin >= OPEN_MIN && totalMin < CLOSE_MIN;

    if (isLiveMusicNow && isOpen) {
      el.className = "open-status is-open";
      el.textContent = "🎵 Open Now · Live Music Happening!";
    } else if (isOpen) {
      const minsLeft = CLOSE_MIN - totalMin;
      el.className = "open-status is-open";
      el.textContent =
        minsLeft <= 60
          ? `✅ Open Now · Closing in ${minsLeft} min`
          : "✅ Open Now · Closes at 10:00 PM";
    } else {
      el.className = "open-status is-closed";
      const minsToOpen =
        totalMin < OPEN_MIN
          ? OPEN_MIN - totalMin
          : 24 * 60 - totalMin + OPEN_MIN;
      el.textContent =
        minsToOpen <= 60
          ? `⏰ Closed · Opens in ${minsToOpen} min`
          : "⏰ Closed · Opens at 6:00 AM";
    }
  }

  update();
  setInterval(update, 60 * 1000);
}

/* ═══════════════════════════════════════════════════════════
   9. RESERVATION FORM
═══════════════════════════════════════════════════════════ */
function initReservationForm() {
  const form = qs("#reserveForm");
  if (!form) return;

  const dateInput = qs("#resDate", form);
  if (dateInput) {
    const todayISO = new Date().toISOString().split("T")[0];
    dateInput.setAttribute("min", todayISO);
  }

  form.addEventListener("submit", handleFormSubmit);
}

function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;

  const nameEl = qs("#guestName", form);
  const phoneEl = qs("#guestPhone", form);
  const dateEl = qs("#resDate", form);
  const timeEl = qs("#resTime", form);
  const guestEl = qs("#guestCount", form);
  const occasionEl = qs("#occasion", form);
  const messageEl = qs("#resMessage", form);

  if (!nameEl || !phoneEl || !dateEl || !timeEl || !guestEl) return;

  const name = nameEl.value.trim();
  const phone = phoneEl.value.trim();
  const date = dateEl.value;
  const time = timeEl.value;
  const guests = guestEl.value;
  const occasion = occasionEl ? occasionEl.value.trim() : "";
  const message = messageEl ? messageEl.value.trim() : "";

  if (!name || !phone || !date || !time || !guests) {
    showFormMsg(form, "Please fill in all required fields.", "error");
    return;
  }

  function formatDate(raw) {
    if (!raw) return raw;
    try {
      const d = new Date(raw + "T00:00:00");
      return d.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (_) {
      return raw;
    }
  }

  function formatTime(raw) {
    if (!raw) return raw;
    try {
      const [h, m] = raw.split(":").map(Number);
      const period = h >= 12 ? "PM" : "AM";
      const hour = h % 12 || 12;
      return `${hour}:${String(m).padStart(2, "0")} ${period}`;
    } catch (_) {
      return raw;
    }
  }

  const formattedDate = formatDate(date);
  const formattedTime = formatTime(time);

  const lines = [
    "🍽️ *NEW TABLE RESERVATION*",
    "━━━━━━━━━━━━━━━━━━━━━━━━",
    "",
    `👤 *Name:* ${name}`,
    `📞 *Phone:* ${phone}`,
    `📅 *Date:* ${formattedDate}`,
    `🕐 *Time:* ${formattedTime}`,
    `👥 *Guests:* ${guests}`,
  ];

  if (occasion) {
    lines.push(`🎉 *Occasion:* ${occasion}`);
  }

  if (message) {
    lines.push("");
    lines.push(`💬 *Requests:*`);
    lines.push(message);
  }

  lines.push("");
  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━");
  lines.push("_Sent from pajulounge.com.np_");

  const waText = lines.join("\n");
  const waURL = `https://wa.me/9779863037607?text=${encodeURIComponent(waText)}`;

  window.open(waURL, "_blank", "noopener,noreferrer");

  showFormMsg(
    form,
    `Thank you, ${name}! WhatsApp is opening with your booking details. We'll confirm your table shortly.`,
    "success",
  );

  form.reset();
}

function showFormMsg(form, text, type) {
  const existing = qs(".form-msg", form);
  if (existing) existing.remove();

  const msg = document.createElement("p");
  msg.className = `form-msg form-msg--${type}`;
  msg.textContent = text;
  form.appendChild(msg);

  msg.scrollIntoView({ behavior: "smooth", block: "nearest" });

  setTimeout(() => {
    msg.style.transition = "opacity .3s ease";
    msg.style.opacity = "0";
    setTimeout(() => msg.remove(), 320);
  }, 8000);
}

/* ═══════════════════════════════════════════
   10. STAT COUNTERS (About section)
═══════════════════════════════════════════ */
function initStatCounters() {
  const nums = qsa(".stat-num[data-target]");
  if (!nums.length) return;

  if (!("IntersectionObserver" in window)) {
    nums.forEach((el) => {
      el.textContent = el.dataset.target;
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        if (isNaN(target)) return;
        animateCount(el, 0, target, 1400);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 },
  );

  nums.forEach((el) => observer.observe(el));
}

function animateCount(el, from, to, duration) {
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(from + (to - from) * eased);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ═══════════════════════════════════════════
   11. HERO PARALLAX
═══════════════════════════════════════════ */
function initHeroParallax() {}

/* ═══════════════════════════════════════════
   12. FOOTER YEAR
═══════════════════════════════════════════ */
function initFooterYear() {
  const el = qs("#footerYear");
  if (el) el.textContent = new Date().getFullYear();
}

/* ═══════════════════════════════════════════════════════════
   13. MENU PAGE DYNAMIC RENDERER (GOOGLE SHEETS INTEGRATION)
═══════════════════════════════════════════════════════════ */
const whatsappNumber = "9779841546941";

// UPDATED: Connected to your active stream endpoint
const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTCz0RdJDaBkB4dljrGCpzSoPzu7xguppyhZ_4lcPJUqJyAWBDJmibIfRaXTBtKA6WrVT4JpaZ-DDkR/pub?gid=1247711582&output=csv";

function createOrderLink(itemName) {
  const decoded = itemName
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi! I'd like to order: " + decoded)}`;
}

function formatPrice(price) {
  return `NPR ${price}`;
}

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Custom parser to split CSV properly while handling fields wrapped in quotes containing commas
function parseCSV(csvText) {
  const lines = [];
  let currentLine = [];
  let currentToken = "";
  let insideQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentToken += '"'; // Handle escaped double quotes ""
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      currentLine.push(currentToken.trim());
      currentToken = "";
    } else if ((char === "\r" || char === "\n") && !insideQuotes) {
      if (char === "\r" && nextChar === "\n") i++;
      currentLine.push(currentToken.trim());
      lines.push(currentLine);
      currentLine = [];
      currentToken = "";
    } else {
      currentToken += char;
    }
  }
  if (currentToken || currentLine.length > 0) {
    currentLine.push(currentToken.trim());
    lines.push(currentLine);
  }

  const cleanLines = lines.filter(
    (line) => line.length > 0 && line.some((val) => val !== ""),
  );
  if (cleanLines.length === 0) return [];

  const headers = cleanLines[0].map((h) => h.toLowerCase());

  return cleanLines.slice(1).map((row) => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || "";
    });
    return obj;
  });
}

async function initMenuPage() {
  const menuGrid = document.getElementById("menuGrid");
  if (!menuGrid) return; // Guard: prevents running on index.html if menuGrid element isn't there

  try {
    menuGrid.innerHTML =
      '<p style="text-align:center; grid-column:1/-1; color:var(--c-text2);">Loading fresh menu items from database...</p>';

    const response = await fetch(SHEET_CSV_URL);
    if (!response.ok) throw new Error("Failed to fetch menu sheet data.");

    const csvText = await response.text();
    const menuItems = parseCSV(csvText);

    renderMenuItems(menuItems);

    // Now that items are injected into the DOM, initialize filters and run filter algorithms
    initMenuFilter();
    if (window.applyMenuFilters) {
      window.applyMenuFilters();
    }
  } catch (error) {
    console.error("Error connecting to Google Sheets:", error);
    menuGrid.innerHTML =
      '<p style="text-align:center; grid-column:1/-1; color:var(--c-error);">Failed to load menu. Please try refreshing or checking your internet connection.</p>';
  }
}

function renderMenuItems(items) {
  const menuGrid = document.getElementById("menuGrid");
  if (!menuGrid) return;

  if (items.length === 0) {
    menuGrid.innerHTML =
      '<p style="text-align:center; grid-column:1/-1; color:var(--c-muted);">The menu is currently empty.</p>';
    return;
  }

  menuGrid.innerHTML = items
    .map((item, index) => {
      const safeName = escapeHTML(item.name || "Unnamed Item");
      const safeTag = escapeHTML(item.tag || "Delicious Selection");
      const safeDesc = escapeHTML(
        item.desc || "Prepared fresh using handpicked local ingredients.",
      );
      const safeCategory = escapeHTML(item.category || "other").toLowerCase();
      const searchText = escapeHTML(
        `${item.name} ${item.tag} ${item.category} ${item.desc}`.toLowerCase(),
      );

      return `
<article class="menu-card menu-card--animate" data-category="${safeCategory}" data-search="${searchText}" style="--card-delay:${(index % 8) * 0.055}s">
  <div class="menu-card-body">
    <span class="menu-card-accent__tag">${safeTag}</span>
    <h4 class="menu-item-name">${safeName}</h4>
    <p class="menu-item-desc">${safeDesc}</p>
    <div class="menu-item-footer">
      <span class="menu-price">${formatPrice(item.price || "0")}</span>
      <a
        href="${createOrderLink(safeName)}"
        target="_blank"
        rel="noopener noreferrer"
        class="menu-order-link"
      >Order</a>
    </div>
  </div>
</article>`;
    })
    .join("");
}

/* ── End of script.js ───────────────────────────────────── */
