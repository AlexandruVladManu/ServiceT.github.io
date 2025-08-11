const scrollArrow = document.getElementById("scrollArrow");
const progressCircle = document.querySelector(".progress-ring__progress");
const radius = progressCircle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;

progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
progressCircle.style.strokeDashoffset = circumference;

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Sets the stroke-dashoffset of the progress circle to a given percentage.
 * @param {number} percent - a number between 0 and 100 representing the percentage of the circle to fill
 */
/*******  33ddb204-891f-41a0-97bc-73f0e1934823  *******/
function setProgress(percent) {
  const offset = circumference - (percent / 100) * circumference;
  progressCircle.style.strokeDashoffset = offset;
}

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;

  setProgress(scrollPercent);

  // Show after scrolling 50px, hide near bottom
  if (scrollTop > 50 && scrollPercent < 99) {
    scrollArrow.classList.add("visible");
  } else {
    scrollArrow.classList.remove("visible");
  }
});

// Smooth scroll to bottom when clicked
scrollArrow.addEventListener("click", () => {
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: "smooth",
  });
});

const swiper = new Swiper(".swiper-slider", {
  // Optional parameters
  centeredSlides: true,
  slidesPerView: 1,
  grabCursor: true,
  freeMode: false,
  loop: true,
  mousewheel: false,
  keyboard: {
    enabled: true,
  },

  // Enabled autoplay mode
  autoplay: {
    delay: 900000,
    disableOnInteraction: false,
  },

  // If we need pagination
  // pagination: {
  //   el: ".swiper-pagination",
  //   dynamicBullets: false,
  //   clickable: true,
  // },

  // If we need navigation
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  breakpoints: {
    400: {
      slidesPerView: 1.1,
      spaceBetween: 20,
    },
    520: {
      slidesPerView: 1.6,
      spaceBetween: 20,
    },
    640: {
      slidesPerView: 1.75,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 2.5,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 2.6,
      spaceBetween: 20,
    },
    1100: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
  },
});
