/**
 * Premier Schools Exhibition - Interactive Sliders
 * Handles all slider functionality with accessibility support
 */

(function() {
    'use strict';

    // ============================================
    // Hero Dual-Axis Slider
    // ============================================

    class HeroSlider {
        constructor() {
            this.horizontalTrack = document.querySelector('.hero__slider-track--horizontal');
            this.verticalTrack = document.querySelector('.hero__slider-track--vertical');
            this.controls = {
                prev: document.querySelector('.hero__control-btn--prev'),
                next: document.querySelector('.hero__control-btn--next'),
                pause: document.querySelector('.hero__control-btn--pause')
            };
            this.isPaused = false;
            this.currentSlide = 0;
            this.totalSlides = 4;
            this.autoPlayInterval = null;
            this.autoPlayDelay = 5000;

            this.init();
        }

        init() {
            if (!this.horizontalTrack || !this.verticalTrack) return;

            // Pause on hover
            const heroSection = document.querySelector('.hero');
            if (heroSection) {
                heroSection.addEventListener('mouseenter', () => this.pause());
                heroSection.addEventListener('mouseleave', () => {
                    if (!this.isPaused) this.play();
                });
            }

            // Control buttons
            if (this.controls.prev) {
                this.controls.prev.addEventListener('click', () => this.prevSlide());
            }
            if (this.controls.next) {
                this.controls.next.addEventListener('click', () => this.nextSlide());
            }
            if (this.controls.pause) {
                this.controls.pause.addEventListener('click', () => this.togglePause());
            }

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (document.activeElement.closest('.hero')) {
                    if (e.key === 'ArrowLeft') {
                        e.preventDefault();
                        this.prevSlide();
                    } else if (e.key === 'ArrowRight') {
                        e.preventDefault();
                        this.nextSlide();
                    } else if (e.key === ' ' || e.key === 'Space') {
                        e.preventDefault();
                        this.togglePause();
                    }
                }
            });

            // Touch/swipe support
            this.initSwipe();

            // Start autoplay
            this.play();
        }

        initSwipe() {
            let startX = 0;
            let startY = 0;
            let isDragging = false;

            const heroSection = document.querySelector('.hero');
            if (!heroSection) return;

            heroSection.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                isDragging = true;
            }, { passive: true });

            heroSection.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                e.preventDefault();
            }, { passive: false });

            heroSection.addEventListener('touchend', (e) => {
                if (!isDragging) return;
                isDragging = false;

                const endX = e.changedTouches[0].clientX;
                const endY = e.changedTouches[0].clientY;
                const diffX = startX - endX;
                const diffY = startY - endY;

                // Determine if horizontal or vertical swipe
                if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                    if (diffX > 0) {
                        this.nextSlide();
                    } else {
                        this.prevSlide();
                    }
                }
            }, { passive: true });
        }

        goToSlide(index) {
            this.currentSlide = (index + this.totalSlides) % this.totalSlides;
            this.updateSlides();
        }

        nextSlide() {
            this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
            this.updateSlides();
            this.resetAutoplay();
        }

        prevSlide() {
            this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
            this.updateSlides();
            this.resetAutoplay();
        }

        updateSlides() {
            if (this.horizontalTrack) {
                this.horizontalTrack.classList.add('hero__slider-track--manual');
                this.horizontalTrack.style.transform = `translateX(-${this.currentSlide * 100}%)`;
            }
            if (this.verticalTrack) {
                this.verticalTrack.classList.add('hero__slider-track--manual');
                this.verticalTrack.style.transform = `translateY(-${this.currentSlide * 100}%)`;
            }
        }

        play() {
            this.isPaused = false;
            if (this.controls.pause) {
                this.controls.pause.classList.remove('hero__control-btn--pause');
                this.controls.pause.setAttribute('aria-label', 'Pause slideshow');
            }
            // Resume CSS animations
            if (this.horizontalTrack) {
                this.horizontalTrack.classList.remove('hero__slider-track--manual');
            }
            if (this.verticalTrack) {
                this.verticalTrack.classList.remove('hero__slider-track--manual');
            }
            this.startAutoplay();
        }

        pause() {
            this.isPaused = true;
            if (this.controls.pause) {
                this.controls.pause.classList.add('hero__control-btn--pause');
                this.controls.pause.setAttribute('aria-label', 'Play slideshow');
            }
            this.stopAutoplay();
        }

        togglePause() {
            if (this.isPaused) {
                this.play();
            } else {
                this.pause();
            }
        }

        startAutoplay() {
            this.stopAutoplay();
            if (!this.isPaused) {
                this.autoPlayInterval = setInterval(() => {
                    this.nextSlide();
                }, this.autoPlayDelay);
            }
        }

        stopAutoplay() {
            if (this.autoPlayInterval) {
                clearInterval(this.autoPlayInterval);
                this.autoPlayInterval = null;
            }
        }

        resetAutoplay() {
            this.stopAutoplay();
            if (!this.isPaused) {
                this.startAutoplay();
            }
        }
    }

    // ============================================
    // Choose School Slider (Mobile)
    // ============================================

    class ChooseSchoolSlider {
        constructor() {
            this.slider = document.querySelector('.choose-school__slider');
            this.track = document.querySelector('.choose-school__slider-track');
            this.dots = document.querySelectorAll('.choose-school__dot');
            this.cards = document.querySelectorAll('.choose-school__slider .choose-school__card');
            this.currentIndex = 0;
            this.totalSlides = this.cards.length;
            this.isDragging = false;
            this.startX = 0;
            this.currentX = 0;
            this.offsetX = 0;

            if (this.slider && window.innerWidth <= 768) {
                this.init();
            }

            // Reinitialize on resize
            window.addEventListener('resize', () => {
                if (window.innerWidth <= 768 && !this.initialized) {
                    this.init();
                }
            });
        }

        init() {
            this.initialized = true;
            if (!this.track || !this.dots.length) return;

            // Dot navigation
            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => this.goToSlide(index));
            });

            // Touch/swipe support
            this.initSwipe();

            // Keyboard navigation
            this.slider.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.prevSlide();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.nextSlide();
                }
            });

            this.updateSlider();
        }

        initSwipe() {
            if (!this.track) return;

            this.track.addEventListener('touchstart', (e) => {
                this.isDragging = true;
                this.startX = e.touches[0].clientX;
                this.currentX = this.startX;
            }, { passive: true });

            this.track.addEventListener('touchmove', (e) => {
                if (!this.isDragging) return;
                this.currentX = e.touches[0].clientX;
                const diff = this.currentX - this.startX;
                this.track.style.transform = `translateX(calc(-${this.currentIndex * 100}% + ${diff}px))`;
            }, { passive: true });

            this.track.addEventListener('touchend', () => {
                if (!this.isDragging) return;
                this.isDragging = false;

                const diff = this.currentX - this.startX;
                const threshold = 50;

                if (Math.abs(diff) > threshold) {
                    if (diff > 0) {
                        this.prevSlide();
                    } else {
                        this.nextSlide();
                    }
                } else {
                    this.updateSlider();
                }
            }, { passive: true });
        }

        goToSlide(index) {
            this.currentIndex = Math.max(0, Math.min(index, this.totalSlides - 1));
            this.updateSlider();
        }

        nextSlide() {
            if (this.currentIndex < this.totalSlides - 1) {
                this.currentIndex++;
            } else {
                this.currentIndex = 0;
            }
            this.updateSlider();
        }

        prevSlide() {
            if (this.currentIndex > 0) {
                this.currentIndex--;
            } else {
                this.currentIndex = this.totalSlides - 1;
            }
            this.updateSlider();
        }

        updateSlider() {
            if (!this.track) return;

            this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;

            // Update dots
            this.dots.forEach((dot, index) => {
                if (index === this.currentIndex) {
                    dot.classList.add('choose-school__dot--active');
                    dot.setAttribute('aria-current', 'true');
                } else {
                    dot.classList.remove('choose-school__dot--active');
                    dot.removeAttribute('aria-current');
                }
            });
        }
    }

    // ============================================
    // Exhibition Slider
    // ============================================

    class ExhibitionSlider {
        constructor() {
            this.slider = document.querySelector('.exhibition__slider');
            this.track = document.querySelector('.exhibition__track');
            this.cards = document.querySelectorAll('.exhibition__card');
            this.controls = {
                prev: document.querySelector('.exhibition__control-btn--prev'),
                next: document.querySelector('.exhibition__control-btn--next')
            };
            this.currentIndex = 0;
            this.cardsPerView = this.getCardsPerView();
            this.totalSlides = Math.ceil(this.cards.length / this.cardsPerView);
            this.autoPlayInterval = null;
            this.autoPlayDelay = 5000;
            this.isPaused = false;

            if (this.slider) {
                this.init();
            }

            // Recalculate on resize
            window.addEventListener('resize', () => {
                this.cardsPerView = this.getCardsPerView();
                this.totalSlides = Math.ceil(this.cards.length / this.cardsPerView);
                this.updateSlider();
            });
        }

        getCardsPerView() {
            const width = window.innerWidth;
            if (width <= 768) return 1;
            if (width <= 1024) return 2;
            return 3;
        }

        init() {
            // Control buttons
            if (this.controls.prev) {
                this.controls.prev.addEventListener('click', () => this.prevSlide());
            }
            if (this.controls.next) {
                this.controls.next.addEventListener('click', () => this.nextSlide());
            }

            // Keyboard navigation
            this.slider.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.prevSlide();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.nextSlide();
                }
            });

            // Pause on hover
            this.slider.addEventListener('mouseenter', () => this.pause());
            this.slider.addEventListener('mouseleave', () => {
                if (!this.isPaused) this.play();
            });

            // Touch/swipe support
            this.initSwipe();

            // Start autoplay
            this.play();
        }

        initSwipe() {
            if (!this.track) return;

            let startX = 0;
            let isDragging = false;

            this.track.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                isDragging = true;
            }, { passive: true });

            this.track.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                e.preventDefault();
            }, { passive: false });

            this.track.addEventListener('touchend', (e) => {
                if (!isDragging) return;
                isDragging = false;

                const endX = e.changedTouches[0].clientX;
                const diff = startX - endX;

                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        this.nextSlide();
                    } else {
                        this.prevSlide();
                    }
                }
            }, { passive: true });
        }

        goToSlide(index) {
            this.currentIndex = Math.max(0, Math.min(index, this.totalSlides - 1));
            this.updateSlider();
        }

        nextSlide() {
            if (this.currentIndex < this.totalSlides - 1) {
                this.currentIndex++;
            } else {
                this.currentIndex = 0;
            }
            this.updateSlider();
            this.resetAutoplay();
        }

        prevSlide() {
            if (this.currentIndex > 0) {
                this.currentIndex--;
            } else {
                this.currentIndex = this.totalSlides - 1;
            }
            this.updateSlider();
            this.resetAutoplay();
        }

        updateSlider() {
            if (!this.track) return;

            const cardWidth = 100 / this.cardsPerView;
            const translateX = this.currentIndex * cardWidth;
            this.track.style.transform = `translateX(-${translateX}%)`;
        }

        play() {
            this.isPaused = false;
            this.startAutoplay();
        }

        pause() {
            this.isPaused = true;
            this.stopAutoplay();
        }

        startAutoplay() {
            this.stopAutoplay();
            if (!this.isPaused) {
                this.autoPlayInterval = setInterval(() => {
                    this.nextSlide();
                }, this.autoPlayDelay);
            }
        }

        stopAutoplay() {
            if (this.autoPlayInterval) {
                clearInterval(this.autoPlayInterval);
                this.autoPlayInterval = null;
            }
        }

        resetAutoplay() {
            this.stopAutoplay();
            if (!this.isPaused) {
                this.startAutoplay();
            }
        }
    }

    // ============================================
    // School Selection Slider
    // ============================================

    class SchoolSelectionSlider {
        constructor() {
            this.slider = document.querySelector('.school-selection__slider');
            this.track = document.querySelector('.school-selection__track');
            this.cards = document.querySelectorAll('.school-selection__card');
            this.controls = {
                prev: document.querySelector('.school-selection__control-btn--prev'),
                next: document.querySelector('.school-selection__control-btn--next')
            };
            this.currentIndex = 0;
            this.cardsPerView = this.getCardsPerView();
            this.totalSlides = Math.ceil(this.cards.length / this.cardsPerView);

            if (this.slider) {
                this.init();
            }

            // Recalculate on resize
            window.addEventListener('resize', () => {
                this.cardsPerView = this.getCardsPerView();
                this.totalSlides = Math.ceil(this.cards.length / this.cardsPerView);
                this.currentIndex = 0;
                this.updateSlider();
            });
        }

        getCardsPerView() {
            const width = window.innerWidth;
            if (width <= 480) return 1;
            if (width <= 768) return 2;
            if (width <= 1024) return 3;
            return 5;
        }

        init() {
            // Control buttons
            if (this.controls.prev) {
                this.controls.prev.addEventListener('click', () => this.prevSlide());
            }
            if (this.controls.next) {
                this.controls.next.addEventListener('click', () => this.nextSlide());
            }

            // Keyboard navigation
            this.slider.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.prevSlide();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.nextSlide();
                }
            });

            // Touch/swipe support
            this.initSwipe();

            this.updateSlider();
        }

        initSwipe() {
            if (!this.track) return;

            let startX = 0;
            let isDragging = false;

            this.track.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                isDragging = true;
            }, { passive: true });

            this.track.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                e.preventDefault();
            }, { passive: false });

            this.track.addEventListener('touchend', (e) => {
                if (!isDragging) return;
                isDragging = false;

                const endX = e.changedTouches[0].clientX;
                const diff = startX - endX;

                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        this.nextSlide();
                    } else {
                        this.prevSlide();
                    }
                }
            }, { passive: true });
        }

        goToSlide(index) {
            this.currentIndex = Math.max(0, Math.min(index, this.totalSlides - 1));
            this.updateSlider();
        }

        nextSlide() {
            if (this.currentIndex < this.totalSlides - 1) {
                this.currentIndex++;
            } else {
                this.currentIndex = 0;
            }
            this.updateSlider();
        }

        prevSlide() {
            if (this.currentIndex > 0) {
                this.currentIndex--;
            } else {
                this.currentIndex = this.totalSlides - 1;
            }
            this.updateSlider();
        }

        updateSlider() {
            if (!this.track) return;

            const cardWidth = 100 / this.cardsPerView;
            const translateX = this.currentIndex * cardWidth;
            this.track.style.transform = `translateX(-${translateX}%)`;
        }
    }

    // ============================================
    // Form Handling
    // ============================================

    function initForm() {
        const form = document.querySelector('.hero__form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Basic validation
            if (!data['parent-name'] || !data['phone-number'] || !data['grade']) {
                alert('Please fill in all required fields.');
                return;
            }

            // Phone validation
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(data['phone-number'].replace(/\D/g, ''))) {
                alert('Please enter a valid 10-digit phone number.');
                return;
            }

            // Simulate form submission
            console.log('Form submitted:', data);
            alert('Thank you for your enquiry! We will contact you soon.');
            form.reset();
        });
    }

    // ============================================
    // Prefers Reduced Motion
    // ============================================

    function handleReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        function updateMotionPreference() {
            if (prefersReducedMotion.matches) {
                document.documentElement.classList.add('reduced-motion');
            } else {
                document.documentElement.classList.remove('reduced-motion');
            }
        }

        // Check initial state
        updateMotionPreference();

        // Listen for changes
        if (prefersReducedMotion.addEventListener) {
            prefersReducedMotion.addEventListener('change', updateMotionPreference);
        } else {
            // Fallback for older browsers
            prefersReducedMotion.addListener(updateMotionPreference);
        }
    }

    // ============================================
    // Initialize Everything
    // ============================================

    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // Initialize components
        new HeroSlider();
        new ChooseSchoolSlider();
        new ExhibitionSlider();
        new SchoolSelectionSlider();
        initForm();
        handleReducedMotion();

        // Focus management for accessibility
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const mainContent = document.getElementById('main-content');
                if (mainContent) {
                    mainContent.focus();
                    mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }
    }

    // Start initialization
    init();

})();

