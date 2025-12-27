/**
 * Premier Schools Exhibition - School Selection Slider
 * Pure JavaScript implementation
 */

(function () {
  "use strict";

  // School Selection Slider
  function initSchoolSelectionSlider() {
    const slider = document.querySelector(".school-selection__slider");
    const track = document.querySelector(".school-selection__track");
    const prevBtn = document.querySelector(
      ".school-selection__control-btn--prev"
    );
    const nextBtn = document.querySelector(
      ".school-selection__control-btn--next"
    );
    const cards = document.querySelectorAll(".school-selection__card");

    if (!slider || !track || !prevBtn || !nextBtn || cards.length === 0) {
      return;
    }

    let currentIndex = 0;
    let cardsPerView = getCardsPerView();
    let maxIndex = Math.max(0, cards.length - cardsPerView);

    // Calculate how many cards to show based on viewport
    function getCardsPerView() {
      const width = window.innerWidth;
      if (width <= 480) return 1;
      if (width <= 768) return 2;
      if (width <= 1024) return 3;
      return 4; // Desktop shows 4 cards
    }

    // Update slider position
    function updateSlider() {
      if (!track || cards.length === 0) return;

      // Get the first card's width including margin
      const firstCard = cards[0];
      const cardRect = firstCard.getBoundingClientRect();
      const cardWidth = cardRect.width;

      // Get gap from computed style
      const trackStyle = getComputedStyle(track);
      const gap = parseFloat(trackStyle.gap) || 0;

      // Calculate translateX - slide left (negative)
      // Start with 80px offset, then subtract based on current index
      const translateX = 80 - currentIndex * (cardWidth + gap);

      track.style.transform = `translateX(${translateX}px)`;
      updateButtons();
    }

    // Update button states
    function updateButtons() {
      if (prevBtn) {
        prevBtn.disabled = currentIndex === 0;
      }
      if (nextBtn) {
        nextBtn.disabled = currentIndex >= maxIndex;
      }
    }

    // Go to next slide
    function nextSlide() {
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateSlider();
      }
    }

    // Go to previous slide
    function prevSlide() {
      if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
      }
    }

    // Handle window resize
    function handleResize() {
      const newCardsPerView = getCardsPerView();
      if (newCardsPerView !== cardsPerView) {
        cardsPerView = newCardsPerView;
        maxIndex = Math.max(0, cards.length - cardsPerView);
        // Reset to start if current index is beyond max
        if (currentIndex > maxIndex) {
          currentIndex = maxIndex;
        }
        updateSlider();
      }
    }

    // Event listeners
    if (nextBtn) {
      nextBtn.addEventListener("click", nextSlide);
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", prevSlide);
    }

    // Keyboard navigation
    slider.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nextSlide();
      }
    });

    // Touch/swipe support
    let startX = 0;
    let isDragging = false;

    track.addEventListener(
      "touchstart",
      function (e) {
        startX = e.touches[0].clientX;
        isDragging = true;
      },
      { passive: true }
    );

    track.addEventListener(
      "touchmove",
      function (e) {
        if (!isDragging) return;
        e.preventDefault();
      },
      { passive: false }
    );

    track.addEventListener(
      "touchend",
      function (e) {
        if (!isDragging) return;
        isDragging = false;

        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        const threshold = 50;

        if (Math.abs(diff) > threshold) {
          if (diff > 0) {
            nextSlide();
          } else {
            prevSlide();
          }
        }
      },
      { passive: true }
    );

    // Handle window resize
    let resizeTimeout;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 250);
    });

    // Initialize
    updateSlider();
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSchoolSelectionSlider);
  } else {
    initSchoolSelectionSlider();
  }
})();
