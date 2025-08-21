/* =========================================================
 * M VIEW SERVICE — Main Scripts
 * - PARALLAX (rAF, reduced motion aware)
 * - SCROLL PROGRESS ARROW
 * - SWIPER INIT
 * =======================================================*/

(() => {
  // -------------------------------------------------------
  // Utilities
  // -------------------------------------------------------
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Single rAF ticker for scroll/resize work
  let ticking = false;
  const onScrollOrResize = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        updateParallax();
        updateScrollProgress();
        ticking = false;
      });
    }
  };

  // -------------------------------------------------------
  // PARALLAX
  // -------------------------------------------------------
  const sections = $$(".parallax");

  function updateParallax() {
    if (prefersReducedMotion || sections.length === 0) return;

    const baseWidth = 768;
    const maxZoom = 0.07; // ~7% max zoom on small screens
    const vw = Math.max(window.innerWidth, 1);
    const scaleFactor =
      vw < baseWidth ? 1 + ((baseWidth - vw) / baseWidth) * maxZoom : 1;

    for (const section of sections) {
      const bg = $(".bg-image", section);
      const content = $(".content", section);
      if (!bg || !content) continue;

      const y = section.getBoundingClientRect().top;
      const bgSpeed = 0.45;
      const contentSpeed = 0.25;

      if (section.id === "section1") {
        bg.style.transform = `translateY(${
          y * bgSpeed
        }px) scale(${scaleFactor})`;
      } else {
        bg.style.transform = `translateY(${y * bgSpeed}px)`;
      }
      content.style.transform = `translateY(${y * contentSpeed}px)`;
    }
  }

  // Run once right away (safe because scripts use `defer`)
  updateParallax();

  // -------------------------------------------------------
  // SCROLL PROGRESS ARROW
  // -------------------------------------------------------
  const scrollArrow = $("#scrollArrow");
  const progressCircle = $(".progress-ring__progress");

  let circumference = 0;
  if (progressCircle) {
    const radius = progressCircle.r.baseVal.value;
    circumference = 2 * Math.PI * radius;
    progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    progressCircle.style.strokeDashoffset = `${circumference}`;
  }

  function setProgress(percent) {
    if (!progressCircle || !circumference) return;
    const offset = circumference - (percent / 100) * circumference;
    progressCircle.style.strokeDashoffset = `${offset}`;
  }

  function updateScrollProgress() {
    if (!scrollArrow) return;
    const scrollTop = window.scrollY || window.pageYOffset;
    const docHeight = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      1
    );
    const scrollPercent = (scrollTop / docHeight) * 100;

    setProgress(scrollPercent);

    // Show after scrolling 50px, hide near bottom
    if (scrollTop > 50 && scrollPercent < 99) {
      scrollArrow.classList.add("visible");
    } else {
      scrollArrow.classList.remove("visible");
    }
  }

  // Smooth scroll to bottom on click
  if (scrollArrow) {
    scrollArrow.addEventListener("click", () => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    });
  }

  // Initial progress set
  updateScrollProgress();

  // -------------------------------------------------------
  // SWIPER INIT
  // -------------------------------------------------------
  function initSwiper() {
    const swiperEl = $(".swiper-slider");
    if (!swiperEl) return;
    if (typeof Swiper === "undefined") {
      console.warn(
        "Swiper library not found. Make sure CDN script is loaded before script.js."
      );
      return;
    }

    // eslint-disable-next-line no-unused-vars
    const swiper = new Swiper(".swiper-slider", {
      centeredSlides: true,
      slidesPerView: 1,
      grabCursor: true,
      freeMode: false,
      loop: true,
      mousewheel: false,
      keyboard: { enabled: true },
      autoplay: { delay: 5000, disableOnInteraction: false },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        400: { slidesPerView: 1.1, spaceBetween: 20 },
        520: { slidesPerView: 1.6, spaceBetween: 20 },
        640: { slidesPerView: 1.9, spaceBetween: 20 },
        768: { slidesPerView: 2.5, spaceBetween: 20 },
        1024: { slidesPerView: 2.6, spaceBetween: 20 },
        1100: { slidesPerView: 3, spaceBetween: 20 },
      },
    });
  }

  // -------------------------------------------------------
  // Listeners
  // -------------------------------------------------------
  window.addEventListener("scroll", onScrollOrResize, { passive: true });
  window.addEventListener("resize", onScrollOrResize);
  window.addEventListener("DOMContentLoaded", () => {
    // run one more time when DOMContentLoaded fires
    onScrollOrResize();
    initSwiper();
  });
})();

/* -------------------------------------------------------
 * iOS in-app browser fix for tel:/mailto:
 * -----------------------------------------------------*/
(function () {
  const isIOS =
    /iP(hone|od|ad)/i.test(navigator.platform) ||
    (/Mac/i.test(navigator.platform) && "ontouchend" in document);
  const isInApp = /(FBAN|FBAV|Instagram|Line|WeChat|Twitter)/i.test(
    navigator.userAgent
  );

  if (!(isIOS && isInApp)) return;

  const forceNativeOpen = (e) => {
    const a = e.currentTarget;
    const href = a.getAttribute("href") || "";
    if (!/^tel:|^mailto:/i.test(href)) return;
    e.preventDefault();
    window.location.href = href;
  };

  document
    .querySelectorAll('a[href^="tel:"], a[href^="mailto:"]')
    .forEach((a) => {
      a.addEventListener("click", forceNativeOpen, { passive: false });
    });
})();
