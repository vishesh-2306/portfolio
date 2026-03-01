class PortfolioExperience {
    constructor() {
        this.init();
    }

    init() {
        this.setupLenis();
        this.setupScrollAnimations();

        // Ensure layout is clean on resize
        window.addEventListener('resize', this.debounce(() => ScrollTrigger.refresh(), 200));
    }

    setupLenis() {
        // Buttery smooth inertia scroll matching premium agency feel
        this.lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        this.lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            this.lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0, 0);
    }

    setupScrollAnimations() {
        // Register GSAP ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);

        // Select all elements marked for reveal
        const reveals = document.querySelectorAll('.gs-reveal');

        reveals.forEach((element) => {
            // Subtle upward slide and fade in
            gsap.fromTo(element,
                {
                    y: 50,
                    opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: element,
                        start: "top 85%", // Trigger when top of element hits 85% down viewport
                        toggleActions: "play none none reverse" // Play on scroll down, reverse on scroll up
                    }
                }
            );
        });

        // Parallax effect on the Hero Visual
        const heroVisual = document.querySelector('.hero-visual');
        if (heroVisual) {
            gsap.to(heroVisual, {
                yPercent: 30, // Move down slightly as user scrolls
                ease: "none",
                scrollTrigger: {
                    trigger: ".hero-section",
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });
        }

        // Parallax effect on Project Cover Images
        const parallaxImages = document.querySelectorAll('.parallax-img');
        parallaxImages.forEach((img) => {
            gsap.to(img, {
                yPercent: 20, // Translate down as user scrolls
                ease: "none",
                scrollTrigger: {
                    trigger: img.closest('.work-img-wrapper'),
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });

        // Philosophy Horizontal Marquee Scroll
        const philosophySection = document.querySelector('.philosophy-section');
        if (philosophySection) {
            gsap.to('.scroll-right', {
                xPercent: 15, // Move right
                ease: "none",
                scrollTrigger: {
                    trigger: philosophySection,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });

            gsap.to('.scroll-left', {
                xPercent: -15, // Move left
                ease: "none",
                scrollTrigger: {
                    trigger: philosophySection,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        }

        // Header Visibility Control
        const header = document.querySelector('.site-header');
        const mainContent = document.querySelector('.page-content');

        if (header && mainContent) {
            ScrollTrigger.create({
                trigger: mainContent,
                start: "top 5%", // Hide when scrolling past hero
                end: "bottom 95%", // Show when reaching footer
                onEnter: () => gsap.to(header, { autoAlpha: 0, y: -20, duration: 0.3 }),
                onLeave: () => gsap.to(header, { autoAlpha: 1, y: 0, duration: 0.3 }),
                onEnterBack: () => gsap.to(header, { autoAlpha: 0, y: -20, duration: 0.3 }),
                onLeaveBack: () => gsap.to(header, { autoAlpha: 1, y: 0, duration: 0.3 })
            });
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Boot up the experience when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioExperience();
});
