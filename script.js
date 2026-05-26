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
  initNavbar();
  initMobileNav();
  initSmoothScroll();
  initScrollReveal();
  initMenuPage();
  initMenuFilter();
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

  // Prevent scrolling while loader is visible
  document.body.style.overflow = "hidden";

  function hideLoader() {
    loader.classList.add("hidden");
    document.body.style.overflow = "";
    document.body.style.touchAction = "";
    // Remove from DOM after transition so it doesn't block clicks
    loader.addEventListener("transitionend", () => {
      if (loader.parentNode) loader.parentNode.removeChild(loader);
    }, { once: true });
  }

  // Hide on window load (all resources loaded)
  if (document.readyState === "complete") {
    // Already loaded — short delay so loader is at least briefly visible
    setTimeout(hideLoader, 600);
  } else {
    window.addEventListener("load", () => setTimeout(hideLoader, 400), { once: true });
    // Safety net: always hide after 4 seconds max
    setTimeout(hideLoader, 4000);
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

    // Scrolled state
    navbar.classList.toggle("scrolled", y > 50);

    // Scroll-to-top visibility
    if (scrollBtn) scrollBtn.classList.toggle("visible", y > 500);

    // Active nav link
    let current = "";
    sections.forEach((sec) => {
      if (y >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach((link) => {
      const href = link.getAttribute("href") || "";
      let isActive = false;

      if (href.startsWith("#")) {
        isActive = href === `#${current}`;
      } else {
        try {
          const url = new URL(href, window.location.href);
          const currentPage = window.location.pathname.split("/").pop() || "index.html";
          const linkPage = url.pathname.split("/").pop() || "index.html";
          isActive = linkPage === currentPage && url.hash === `#${current}`;
          if (!current && currentPage === "menu.html" && linkPage === "menu.html") isActive = true;
        } catch (_) {
          isActive = false;
        }
      }

      link.classList.toggle("active", isActive);
    });
  }, 60);

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // run once on load
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
    // Lock scroll without shifting page (avoids layout jump)
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

  // Close when a link is tapped
  mobileLinks.forEach((link) => link.addEventListener("click", close));

  // Close when clicking the backdrop
  mobileNav.addEventListener("click", (e) => {
    if (e.target === mobileNav) close();
  });

  // ESC key
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
  });
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

  function applyMenuFilters() {
    const menuCards = qsa(".menu-card");
    if (!menuCards.length) return; // nothing to filter (e.g. index.html)
    const filter = getActiveFilter();
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    let visibleCount = 0;

    menuCards.forEach((card) => {
      const categoryMatch = filter === "all" || card.dataset.category === filter;
      const searchText = card.dataset.search || "";
      const searchMatch = !query || searchText.includes(query);
      const match = categoryMatch && searchMatch;

      if (match) {
        card.classList.remove("hidden");
        card.style.animationDelay = `${(visibleCount % 8) * 0.055}s`;
        void card.offsetWidth;
        card.style.animation = "fadeUp .38s var(--ease) both";
        visibleCount += 1;
      } else {
        card.classList.add("hidden");
      }
    });

    if (resultCount) {
      const itemLabel = visibleCount === 1 ? "item" : "items";
      resultCount.textContent = query
        ? `${visibleCount} ${itemLabel} found for “${searchInput.value.trim()}”`
        : `${visibleCount} ${itemLabel} shown`;
    }

    if (emptyState) emptyState.hidden = visibleCount !== 0;
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      applyMenuFilters();
    });
  });

  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      applyMenuFilters();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", applyMenuFilters);
    searchInput.addEventListener("search", applyMenuFilters);
  }

  applyMenuFilters();
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

  // Build dots
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

    // Slide the track — each card is 100% of carousel width
    track.style.transform = `translateX(-${current * 100}%)`;

    // Update dots
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

  // Swipe support
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

  // Pause on hover / focus
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
    // Nepal time offset: +5 hours 45 minutes = 345 minutes
    const NPL_OFFSET_MS = 345 * 60 * 1000;
    const nowNPL = new Date(Date.now() + NPL_OFFSET_MS);
    const hour = nowNPL.getUTCHours();
    const min = nowNPL.getUTCMinutes();
    const day = nowNPL.getUTCDay(); // 0=Sun … 6=Sat
    const totalMin = hour * 60 + min;

    // Restaurant hours: 6:00 (360) – 22:00 (1320)
    const OPEN_MIN = 6 * 60;
    const CLOSE_MIN = 22 * 60;

    // Live music: Fri (5) & Sat (6) 18:00–21:00
    const LM_START = 18 * 60;
    const LM_END = 21 * 60;
    const isLiveMusicNow =
      (day === 5 || day === 6) && totalMin >= LM_START && totalMin < LM_END;

    const isOpen = totalMin >= OPEN_MIN && totalMin < CLOSE_MIN;

    // Live music implies the restaurant is also open (18:00–21:00 ⊂ 06:00–22:00)
    // but we check independently to be safe at boundary conditions
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
  setInterval(update, 60 * 1000); // refresh every minute
}

/* ═══════════════════════════════════════════════════════════
   9. RESERVATION FORM
═══════════════════════════════════════════════════════════ */
function initReservationForm() {
  const form = qs("#reserveForm");
  if (!form) return;

  // Set min date to today
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

  const nameEl   = qs("#guestName",  form);
  const phoneEl  = qs("#guestPhone", form);
  const dateEl   = qs("#resDate",    form);
  const timeEl   = qs("#resTime",    form);
  const guestEl  = qs("#guestCount", form);

  if (!nameEl || !phoneEl || !dateEl || !timeEl || !guestEl) return;

  const name   = nameEl.value.trim();
  const phone  = phoneEl.value.trim();
  const date   = dateEl.value;
  const time   = timeEl.value;
  const guests = guestEl.value;

  // Basic validation
  if (!name || !phone || !date || !time || !guests) {
    showFormMsg(form, "Please fill in all required fields.", "error");
    return;
  }

  /*
  ── HOW TO CONNECT THIS FORM ─────────────────────────────────
  Option A — Formspree (recommended for static sites, free tier):
    1. Go to https://formspree.io → create a form → copy your endpoint URL
    2. Change the <form action="#"> to action="https://formspree.io/f/YOUR_ID"
    3. Change method="POST" (already set)
    4. Delete the e.preventDefault() line and this whole JS handler —
       Formspree handles the submission and redirect natively.

  Option B — EmailJS (sends email from browser, no server):
    1. Sign up at https://emailjs.com
    2. Add to <head>: <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
    3. Replace the showFormMsg() call below with:
       emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', form)
         .then(() => showFormMsg(form, 'Booking sent!', 'success'))
         .catch(() => showFormMsg(form, 'Something went wrong. Please call us.', 'error'));
       return; // prevent WhatsApp fallback below

  Option C — WhatsApp fallback (works right now, zero setup):
    Uncomment the four lines below to redirect to WhatsApp with booking details.
  ────────────────────────────────────────────────────────── */

  // ── Option C: WhatsApp fallback — uncomment to activate ──
  // const msg = `Hi Paju Lounge!\n\nNew Table Booking:\nName: ${name}\nPhone: ${phone}\nDate: ${date}\nTime: ${time}\nGuests: ${guests}`;
  // window.open(`https://wa.me/9779841546941?text=${encodeURIComponent(msg)}`, '_blank');
  // showFormMsg(form, `Thanks ${name}! Opening WhatsApp to confirm your booking.`, 'success');
  // return;

  // Default: show a confirmation message (replace with real submission above)
  showFormMsg(
    form,
    `Thank you, ${name}! Your request for ${date} at ${time} has been received. We'll confirm via phone or WhatsApp shortly.`,
    "success",
  );
  form.reset();
}

function showFormMsg(form, text, type) {
  // Remove any existing message
  const existing = qs(".form-msg", form);
  if (existing) existing.remove();

  const msg = document.createElement("p");
  msg.className = `form-msg form-msg--${type}`;
  msg.textContent = text;
  form.appendChild(msg);

  msg.scrollIntoView({ behavior: "smooth", block: "nearest" });

  // Auto-dismiss after 8 s
  setTimeout(() => {
    msg.style.transition = "opacity .3s ease";
    msg.style.opacity = "0";
    setTimeout(() => msg.remove(), 320);
  }, 8000);
}

/* ═══════════════════════════════════════════════════════════
   10. STAT COUNTERS (About section)
═══════════════════════════════════════════════════════════ */
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
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(from + (to - from) * eased);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ═══════════════════════════════════════════════════════════
   11. HERO PARALLAX
   Disabled — hero background now uses CSS zoom animation (heroBgZoom).
   Parallax would conflict with the CSS animation transform.
   To re-enable: remove the animation from .hero-bg in style.css,
   then uncomment the code below.
═══════════════════════════════════════════════════════════ */
function initHeroParallax() {
  // Intentionally disabled — see note above.
}

/* ═══════════════════════════════════════════════════════════
   12. FOOTER YEAR
═══════════════════════════════════════════════════════════ */
function initFooterYear() {
  const el = qs("#footerYear");
  if (el) el.textContent = new Date().getFullYear();
}


/* ═══════════════════════════════════════════════════════════
   13. MENU PAGE RENDERER
   Menu data was moved out of index.html to avoid inline scripts.
═══════════════════════════════════════════════════════════ */
const whatsappNumber = "9779841546941";

const menuItems = [
  /* MAIN COURSE */
  {
    category: "main",
    tag: "Main Course",
    name: "KFC Chicken",
    price: 300,
    desc: "Crispy fried chicken served fresh and hot.",
  },
  {
    category: "main",
    tag: "Main Course",
    name: "Crispy Chicken",
    price: 300,
    desc: "Crunchy chicken snack with a golden crisp coating.",
  },
  {
    category: "main",
    tag: "Main Course",
    name: "Kurkure Chicken",
    price: 350,
    desc: "Spicy crunchy chicken with bold kurkure-style flavor.",
  },
  {
    category: "main",
    tag: "Main Course",
    name: "Grilled Chicken",
    price: 500,
    desc: "Grilled chicken served with salad.",
  },
  {
    category: "main",
    tag: "Main Course",
    name: "Hot Wings (Spicy)",
    price: 300,
    desc: "Spicy chicken wings served hot and flavorful.",
  },

  /* VEG MOMO */
  {
    category: "momo",
    tag: "Veg Momo",
    name: "Veg Steam Momo (Paneer)",
    price: 150,
    desc: "Steamed paneer momo served with chutney.",
  },
  {
    category: "momo",
    tag: "Veg Momo",
    name: "Veg Fried Momo (Paneer)",
    price: 180,
    desc: "Fried paneer momo with a crispy outside.",
  },
  {
    category: "momo",
    tag: "Veg Momo",
    name: "Veg Steam C. Momo (Paneer)",
    price: 180,
    desc: "Steamed paneer momo tossed in spicy chilli sauce.",
  },
  {
    category: "momo",
    tag: "Veg Momo",
    name: "Veg Fried C. Momo (Paneer)",
    price: 190,
    desc: "Fried paneer momo tossed in chilli sauce.",
  },
  {
    category: "momo",
    tag: "Veg Momo",
    name: "Veg Sadheko Momo (Paneer)",
    price: 200,
    desc: "Paneer momo mixed with Nepali-style sadheko spices.",
  },
  {
    category: "momo",
    tag: "Veg Momo",
    name: "Veg Jhol Momo (Paneer)",
    price: 150,
    desc: "Paneer momo served with flavorful jhol achar.",
  },

  /* CHICKEN MOMO */
  {
    category: "momo",
    tag: "Chicken Momo",
    name: "Chicken Steam Momo",
    price: 150,
    desc: "Classic steamed chicken momo served with chutney.",
  },
  {
    category: "momo",
    tag: "Chicken Momo",
    name: "Chicken Fried Momo",
    price: 180,
    desc: "Fried chicken momo with a crispy golden shell.",
  },
  {
    category: "momo",
    tag: "Chicken Momo",
    name: "Chicken Steam C. Momo",
    price: 190,
    desc: "Steamed chicken momo tossed in spicy chilli sauce.",
  },
  {
    category: "momo",
    tag: "Chicken Momo",
    name: "Chicken Fried C. Momo",
    price: 200,
    desc: "Fried chicken momo mixed with chilli sauce.",
  },
  {
    category: "momo",
    tag: "Chicken Momo",
    name: "Chicken Sadheko Momo",
    price: 200,
    desc: "Chicken momo mixed with sadheko spices and herbs.",
  },
  {
    category: "momo",
    tag: "Chicken Momo",
    name: "Chicken Jhol Momo",
    price: 180,
    desc: "Chicken momo served with rich jhol achar.",
  },

  /* CHOWMEIN & NOODLES */
  {
    category: "noodles",
    tag: "Chowmein & Noodles",
    name: "Veg Chowmein",
    price: 130,
    desc: "Stir-fried noodles with vegetables.",
  },
  {
    category: "noodles",
    tag: "Chowmein & Noodles",
    name: "Buff Chowmein",
    price: 180,
    desc: "Stir-fried noodles with buff and vegetables.",
  },
  {
    category: "noodles",
    tag: "Chowmein & Noodles",
    name: "Chicken Chowmein",
    price: 180,
    desc: "Stir-fried noodles with chicken and vegetables.",
  },
  {
    category: "noodles",
    tag: "Chowmein & Noodles",
    name: "Sausage Chowmein",
    price: 180,
    desc: "Noodles tossed with sausage and vegetables.",
  },
  {
    category: "noodles",
    tag: "Chowmein & Noodles",
    name: "Egg Chowmein",
    price: 180,
    desc: "Stir-fried noodles with egg and vegetables.",
  },
  {
    category: "noodles",
    tag: "Chowmein & Noodles",
    name: "Mix Chowmein",
    price: 250,
    desc: "Mixed chowmein with assorted toppings.",
  },

  /* THUKPA */
  {
    category: "noodles",
    tag: "Thukpa",
    name: "Veg Thukpa",
    price: 140,
    desc: "Warm noodle soup with vegetables.",
  },
  {
    category: "noodles",
    tag: "Thukpa",
    name: "Buff Thukpa",
    price: 180,
    desc: "Noodle soup with buff and vegetables.",
  },
  {
    category: "noodles",
    tag: "Thukpa",
    name: "Chicken Thukpa",
    price: 180,
    desc: "Chicken noodle soup served hot.",
  },
  {
    category: "noodles",
    tag: "Thukpa",
    name: "Egg Thukpa",
    price: 180,
    desc: "Noodle soup with egg and vegetables.",
  },
  {
    category: "noodles",
    tag: "Thukpa",
    name: "Mix Thukpa",
    price: 270,
    desc: "Mixed thukpa with assorted ingredients.",
  },

  /* SPRING ROLL */
  {
    category: "snacks",
    tag: "Spring Roll",
    name: "Veg Spring Roll",
    price: 190,
    desc: "Crispy roll filled with seasoned vegetables.",
  },
  {
    category: "snacks",
    tag: "Spring Roll",
    name: "Buff Spring Roll",
    price: 200,
    desc: "Crispy spring roll with buff filling.",
  },
  {
    category: "snacks",
    tag: "Spring Roll",
    name: "Chicken Spring Roll",
    price: 250,
    desc: "Crispy spring roll with chicken filling.",
  },
  {
    category: "snacks",
    tag: "Spring Roll",
    name: "Egg Spring Roll",
    price: 200,
    desc: "Spring roll filled with egg and seasoning.",
  },
  {
    category: "snacks",
    tag: "Spring Roll",
    name: "Mix Spring Roll",
    price: 300,
    desc: "Mixed spring roll with assorted filling.",
  },

  /* KATHI ROLL */
  {
    category: "snacks",
    tag: "Kathi Roll",
    name: "Veg Kathi Roll",
    price: 180,
    desc: "Soft roll filled with vegetables and spices.",
  },
  {
    category: "snacks",
    tag: "Kathi Roll",
    name: "Buff Kathi Roll",
    price: 200,
    desc: "Kathi roll with buff filling.",
  },
  {
    category: "snacks",
    tag: "Kathi Roll",
    name: "Chicken Kathi Roll",
    price: 250,
    desc: "Kathi roll with chicken and spices.",
  },
  {
    category: "snacks",
    tag: "Kathi Roll",
    name: "Mix Kathi Roll",
    price: 300,
    desc: "Mixed kathi roll with assorted filling.",
  },

  /* KHAJA SET */
  {
    category: "family",
    tag: "Khaja Set",
    name: "Veg Khaja Set",
    price: 200,
    desc: "Vegetarian khaja set served Nepali-style.",
  },
  {
    category: "family",
    tag: "Khaja Set",
    name: "Egg Khaja Set",
    price: 250,
    desc: "Khaja set served with egg.",
  },
  {
    category: "family",
    tag: "Khaja Set",
    name: "Buff Khaja Set",
    price: 325,
    desc: "Khaja set served with buff.",
  },
  {
    category: "family",
    tag: "Khaja Set",
    name: "Chicken Khaja Set",
    price: 325,
    desc: "Khaja set served with chicken.",
  },
  {
    category: "family",
    tag: "Khaja Set",
    name: "Combo Set (Normal)",
    price: 350,
    desc: "Normal combo khaja set.",
  },
  {
    category: "family",
    tag: "Khaja Set",
    name: "Mix Combo Set",
    price: 500,
    desc: "Mixed combo set for a fuller meal.",
  },

  /* SALAD */
  {
    category: "salad",
    tag: "Salad",
    name: "Nepali Salad",
    price: 150,
    desc: "Fresh Nepali-style salad.",
  },
  {
    category: "salad",
    tag: "Salad",
    name: "Green Salad",
    price: 150,
    desc: "Fresh green salad.",
  },
  {
    category: "salad",
    tag: "Salad",
    name: "Russian Salad",
    price: 300,
    desc: "Creamy Russian-style salad.",
  },
  {
    category: "salad",
    tag: "Salad",
    name: "Mix Fruits Salad",
    price: 250,
    desc: "Fresh mixed fruit salad.",
  },

  /* SOUPS */
  {
    category: "soup",
    tag: "Soup",
    name: "Hot & Sour Soup (Non-Veg)",
    price: 160,
    desc: "Hot and sour non-veg soup.",
  },
  {
    category: "soup",
    tag: "Soup",
    name: "Chicken Soup",
    price: 150,
    desc: "Warm chicken soup.",
  },
  {
    category: "soup",
    tag: "Soup",
    name: "Mushroom Soup",
    price: 150,
    desc: "Creamy mushroom soup.",
  },
  {
    category: "soup",
    tag: "Soup",
    name: "Chicken Clear Soup",
    price: 150,
    desc: "Light chicken clear soup.",
  },
  {
    category: "soup",
    tag: "Soup",
    name: "Veg Soup",
    price: 120,
    desc: "Vegetable soup served hot.",
  },
  {
    category: "soup",
    tag: "Soup",
    name: "Mix Soup",
    price: 200,
    desc: "Mixed soup with assorted ingredients.",
  },

  /* CHICKEN SNACKS */
  {
    category: "snacks",
    tag: "Chicken Snacks",
    name: "Chicken Chilly (Boneless)",
    price: 300,
    desc: "Boneless chicken tossed in chilli sauce.",
  },
  {
    category: "snacks",
    tag: "Chicken Snacks",
    name: "Chicken Chilly (With Bone)",
    price: 300,
    desc: "Chicken with bone tossed in chilli sauce.",
  },
  {
    category: "snacks",
    tag: "Chicken Snacks",
    name: "Chicken Sadheko",
    price: 300,
    desc: "Chicken mixed with Nepali-style sadheko spices.",
  },
  {
    category: "snacks",
    tag: "Chicken Snacks",
    name: "Chicken Meat Balls",
    price: 200,
    desc: "Chicken meat balls served as a snack.",
  },
  {
    category: "snacks",
    tag: "Chicken Snacks",
    name: "Chicken Boiled",
    price: 200,
    desc: "Boiled chicken served simple and fresh.",
  },
  {
    category: "snacks",
    tag: "Chicken Snacks",
    name: "Chicken Fried/Roast",
    price: 300,
    desc: "Chicken served fried or roasted.",
  },
  {
    category: "snacks",
    tag: "Chicken Snacks",
    name: "Chicken Sausage (4 pcs)",
    price: 280,
    desc: "Four pieces of chicken sausage.",
  },
  {
    category: "snacks",
    tag: "Chicken Snacks",
    name: "Sausage Chilly (4 pcs)",
    price: 300,
    desc: "Four pieces of sausage tossed in chilli sauce.",
  },
  {
    category: "snacks",
    tag: "Chicken Snacks",
    name: "Chicken Choila",
    price: 300,
    desc: "Spiced chicken choila.",
  },

  /* APPETIZERS */
  {
    category: "snacks",
    tag: "Appetizers",
    name: "Buff Sekuwa/Tass/Sukuti",
    price: 180,
    desc: "Buff appetizer served sekuwa, tass, or sukuti style.",
  },
  {
    category: "snacks",
    tag: "Appetizers",
    name: "Buff Choila",
    price: 200,
    desc: "Traditional spiced buff choila.",
  },
  {
    category: "snacks",
    tag: "Appetizers",
    name: "Buff Chilly",
    price: 300,
    desc: "Buff tossed in spicy chilli sauce.",
  },
  {
    category: "snacks",
    tag: "Appetizers",
    name: "Buff Sausage (4 pcs)",
    price: 180,
    desc: "Four pieces of buff sausage.",
  },
  {
    category: "snacks",
    tag: "Appetizers",
    name: "Sausage Chilly",
    price: 300,
    desc: "Sausage tossed in chilli sauce.",
  },
  {
    category: "snacks",
    tag: "Appetizers",
    name: "Sukuti Sadheko",
    price: 250,
    desc: "Dry meat mixed with sadheko spices.",
  },

  /* VEG SNACKS */
  {
    category: "snacks",
    tag: "Veg Snacks",
    name: "Aloo Sadheko",
    price: 150,
    desc: "Potato mixed with Nepali-style sadheko spices.",
  },
  {
    category: "snacks",
    tag: "Veg Snacks",
    name: "Aloo Jira",
    price: 150,
    desc: "Potato tossed with cumin flavor.",
  },
  {
    category: "snacks",
    tag: "Veg Snacks",
    name: "French Fries",
    price: 150,
    desc: "Crispy golden fries.",
  },
  {
    category: "snacks",
    tag: "Veg Snacks",
    name: "Soyabean Chilly",
    price: 220,
    desc: "Soyabean tossed in chilli sauce.",
  },
  {
    category: "snacks",
    tag: "Veg Snacks",
    name: "Chips Chilly",
    price: 200,
    desc: "Crispy chips tossed in chilli sauce.",
  },
  {
    category: "snacks",
    tag: "Veg Snacks",
    name: "Mustang Aloo",
    price: 150,
    desc: "Spicy Mustang-style potato snack.",
  },
  {
    category: "snacks",
    tag: "Veg Snacks",
    name: "Cheese Balls",
    price: 300,
    desc: "Crispy cheese balls.",
  },
  {
    category: "snacks",
    tag: "Veg Snacks",
    name: "Mushroom Chilly",
    price: 300,
    desc: "Mushroom tossed in chilli sauce.",
  },
  {
    category: "snacks",
    tag: "Veg Snacks",
    name: "Paneer Chilly",
    price: 300,
    desc: "Paneer tossed in chilli sauce.",
  },
  {
    category: "snacks",
    tag: "Veg Snacks",
    name: "Pakoda (Veg)",
    price: 150,
    desc: "Crispy vegetable pakoda.",
  },
  {
    category: "snacks",
    tag: "Veg Snacks",
    name: "Plain Peanuts",
    price: 100,
    desc: "Plain peanuts.",
  },
  {
    category: "snacks",
    tag: "Veg Snacks",
    name: "Peanuts Sadheko",
    price: 150,
    desc: "Peanuts mixed with sadheko spices.",
  },
  {
    category: "snacks",
    tag: "Veg Snacks",
    name: "Dry Papad",
    price: 80,
    desc: "Dry papad.",
  },
  {
    category: "snacks",
    tag: "Veg Snacks",
    name: "Fried Papad",
    price: 80,
    desc: "Crispy fried papad.",
  },
  {
    category: "snacks",
    tag: "Veg Snacks",
    name: "Masala Papad",
    price: 150,
    desc: "Papad topped with masala.",
  },
  {
    category: "snacks",
    tag: "Veg Snacks",
    name: "Kaju Fried",
    price: 275,
    desc: "Fried cashew snack.",
  },
  {
    category: "snacks",
    tag: "Veg Snacks",
    name: "Poleko Lasoon",
    price: 130,
    desc: "Roasted garlic snack.",
  },
  {
    category: "snacks",
    tag: "Veg Snacks",
    name: "Fried Lasoon",
    price: 150,
    desc: "Fried garlic snack.",
  },
  {
    category: "snacks",
    tag: "Veg Snacks",
    name: "Bhatmas Sadheko",
    price: 150,
    desc: "Soybeans mixed with sadheko spices.",
  },

  /* SANDWICHES */
  {
    category: "bread",
    tag: "Sandwiches",
    name: "Veg Sandwich",
    price: 150,
    desc: "Vegetable sandwich.",
  },
  {
    category: "bread",
    tag: "Sandwiches",
    name: "Chicken Sandwich",
    price: 180,
    desc: "Chicken sandwich.",
  },
  {
    category: "bread",
    tag: "Sandwiches",
    name: "Egg Sandwich",
    price: 180,
    desc: "Egg sandwich.",
  },
  {
    category: "bread",
    tag: "Sandwiches",
    name: "Veg Saute",
    price: 180,
    desc: "Sauteed vegetable item.",
  },

  /* BURGER */
  {
    category: "bread",
    tag: "Burger",
    name: "Veg Burger",
    price: 160,
    desc: "Vegetarian burger.",
  },
  {
    category: "bread",
    tag: "Burger",
    name: "Egg Burger",
    price: 160,
    desc: "Burger with egg.",
  },
  {
    category: "bread",
    tag: "Burger",
    name: "Chicken Burger",
    price: 180,
    desc: "Chicken burger.",
  },
  {
    category: "bread",
    tag: "Burger",
    name: "Cheese Burger",
    price: 210,
    desc: "Burger with cheese.",
  },
  {
    category: "bread",
    tag: "Burger",
    name: "Crispy Chicken Burger",
    price: 240,
    desc: "Crispy chicken burger.",
  },

  /* PIZZA */
  {
    category: "bread",
    tag: "Pizza",
    name: "Veg Pizza",
    price: 500,
    desc: "Vegetarian pizza served with Tabasco sauce.",
  },
  {
    category: "bread",
    tag: "Pizza",
    name: "Mushroom Pizza",
    price: 500,
    desc: "Mushroom pizza served with Tabasco sauce.",
  },
  {
    category: "bread",
    tag: "Pizza",
    name: "Sausage Pizza",
    price: 500,
    desc: "Sausage pizza served with Tabasco sauce.",
  },
  {
    category: "bread",
    tag: "Pizza",
    name: "Salami Pizza",
    price: 500,
    desc: "Salami pizza served with Tabasco sauce.",
  },
  {
    category: "bread",
    tag: "Pizza",
    name: "Cheese Pizza",
    price: 500,
    desc: "Cheese pizza served with Tabasco sauce.",
  },
  {
    category: "bread",
    tag: "Pizza",
    name: "Mix Pizza",
    price: 600,
    desc: "Mixed pizza served with Tabasco sauce.",
  },

  /* DRINKS */
  {
    category: "drinks",
    tag: "Hot Drinks",
    name: "Black Coffee",
    price: 70,
    desc: "Freshly served black coffee.",
  },
  {
    category: "drinks",
    tag: "Hot Drinks",
    name: "Milk Coffee",
    price: 100,
    desc: "Freshly served milk coffee.",
  },
  {
    category: "drinks",
    tag: "Hot Drinks",
    name: "Hot Lemon",
    price: 70,
    desc: "Warm lemon drink.",
  },
  {
    category: "drinks",
    tag: "Hot Drinks",
    name: "Hot Lemon with Honey",
    price: 100,
    desc: "Hot lemon with honey.",
  },
  {
    category: "drinks",
    tag: "Hot Drinks",
    name: "Hot Lemon with Lemon & Ginger",
    price: 110,
    desc: "Hot lemon with ginger.",
  },

  /* MOCKTAILS */
  {
    category: "drinks",
    tag: "Mocktails",
    name: "Mint Fresher",
    price: 250,
    desc: "Refreshing mint mocktail.",
  },
  {
    category: "drinks",
    tag: "Mocktails",
    name: "Virgin Mojito",
    price: 250,
    desc: "Classic refreshing mojito mocktail.",
  },
  {
    category: "drinks",
    tag: "Mocktails",
    name: "Cinderella",
    price: 250,
    desc: "Fruit-based refreshing mocktail.",
  },
  {
    category: "drinks",
    tag: "Mocktails",
    name: "Mimosa",
    price: 250,
    desc: "Refreshing mocktail option.",
  },
  {
    category: "drinks",
    tag: "Mocktails",
    name: "Apple Sour",
    price: 250,
    desc: "Apple-flavored sour mocktail.",
  },
  {
    category: "drinks",
    tag: "Mocktails",
    name: "Real Fruit Juice",
    price: "120/380",
    desc: "Real fruit juice available in two sizes.",
  },

  /* LASSI */
  {
    category: "drinks",
    tag: "Lassi",
    name: "Plain Lassi",
    price: 90,
    desc: "Classic plain lassi.",
  },
  {
    category: "drinks",
    tag: "Lassi",
    name: "Banana Lassi",
    price: 100,
    desc: "Banana-flavored lassi.",
  },
  {
    category: "drinks",
    tag: "Lassi",
    name: "Mango Lassi",
    price: 150,
    desc: "Mango-flavored lassi.",
  },
  {
    category: "drinks",
    tag: "Lassi",
    name: "Mix Lassi",
    price: 160,
    desc: "Mixed-flavor lassi.",
  },

  /* TOBACCO / HOOKAH */
  {
    category: "tobacco",
    tag: "Cigarette",
    name: "Surya Red/White",
    price: "30/500",
    desc: "Per stick / per packet.",
  },
  {
    category: "tobacco",
    tag: "Cigarette",
    name: "Sikhar Ice",
    price: "25/450",
    desc: "Per stick / per packet.",
  },
  {
    category: "tobacco",
    tag: "Hookah",
    name: "Choice of Flavors Hookah",
    price: 400,
    desc: "Varieties of hookah flavors available.",
  },
  {
    category: "tobacco",
    tag: "Hookah",
    name: "Cloud Hookah",
    price: 500,
    desc: "Cloud hookah available. Additional coal charge Rs. 50.",
  },

  /* ICE CREAM */
  {
    category: "dessert",
    tag: "Ice Cream",
    name: "Vanilla Ice Cream (90 ml)",
    price: 75,
    desc: "ND's vanilla ice cream.",
  },
  {
    category: "dessert",
    tag: "Ice Cream",
    name: "Chocolate Ice Cream (90 ml)",
    price: 75,
    desc: "ND's chocolate ice cream.",
  },
  {
    category: "dessert",
    tag: "Ice Cream",
    name: "Strawberry Ice Cream (90 ml)",
    price: 75,
    desc: "ND's strawberry ice cream.",
  },
  {
    category: "dessert",
    tag: "Ice Cream",
    name: "21st Love Ice Cream (90 ml)",
    price: 80,
    desc: "ND's 21st Love ice cream.",
  },
  {
    category: "dessert",
    tag: "Ice Cream",
    name: "Butterscotch Ice Cream (90 ml)",
    price: 80,
    desc: "ND's butterscotch ice cream.",
  },
];

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

function slugifyMenuImageName(name) {
  return String(name)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getMenuImagePath(item) {
  // Add each item image in: assets/menu/item-name.webp
  // Example: Chicken Steam Momo → assets/menu/chicken-steam-momo.webp
  return item.image || `./assets/menu/${slugifyMenuImageName(item.name)}.webp`;
}

function createOrderLink(itemName) {
  // Decode any HTML entities before encoding for URL
  const decoded = itemName
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Order: " + decoded)}`;
}

function initMenuPage() {
  renderMenuItems(menuItems);
}

function renderMenuItems(items) {
  const menuGrid = document.getElementById("menuGrid");
  if (!menuGrid) return;

  menuGrid.innerHTML = items
    .map((item) => {
      const safeName = escapeHTML(item.name);
      const safeTag = escapeHTML(item.tag);
      const safeDesc = escapeHTML(item.desc);
      const safeCategory = escapeHTML(item.category);
      const imageSrc = escapeHTML(getMenuImagePath(item));
      const searchText = escapeHTML(
        `${item.name} ${item.tag} ${item.category} ${item.desc}`.toLowerCase(),
      );

      return `
<article class="menu-card" data-category="${safeCategory}" data-search="${searchText}">
  <div class="menu-card-img">
    <div class="menu-img-placeholder" aria-hidden="true"></div>
    <img
      src="${imageSrc}"
      alt="${safeName}"
      class="menu-img"
      loading="lazy"
      decoding="async"
      onerror="this.remove()"
    />
    <span class="menu-cat-tag">${safeTag}</span>
  </div>

  <div class="menu-card-body">
    <h4 class="menu-item-name">${safeName}</h4>

    <p class="menu-item-desc">
      ${safeDesc}
    </p>

    <div class="menu-item-footer">
      <span class="menu-price">${formatPrice(item.price)}</span>
      <a
        href="${createOrderLink(safeName)}"
        target="_blank"
        rel="noopener noreferrer"
        class="menu-order-link"
      >
        Order
      </a>
    </div>
  </div>
</article>
      `;
    })
    .join("");
}


/* ── End of script.js ───────────────────────────────────── */
