class PortfolioExperience {
    constructor() {
        this.init();
    }

    init() {
        this.setupLenis();
        this.setupScrollAnimations();
        this.initInteractiveCanvas();

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

        // Staggered mechanical popping animation for keyboard keys
        const keyboardKeys = document.querySelectorAll('.keyboard-key');
        if (keyboardKeys.length > 0) {
            gsap.fromTo(keyboardKeys, 
                {
                    y: 85,
                    opacity: 0,
                    scale: 0.7,
                    rotateX: -25
                },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    rotateX: 0,
                    duration: 1.4,
                    ease: "elastic.out(1.05, 0.65)", // satisfying spring bounce
                    stagger: 0.08, // crisp rapid succession
                    scrollTrigger: {
                        trigger: ".keyboard-deck",
                        start: "top 88%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }

        // Sticky Stacking Card Deck Effect for Selected Work
        const projectCards = gsap.utils.toArray('.project-row');
        projectCards.forEach((card, index) => {
            // As long as it is not the last card, animate it shrinking/fading as the next card scrolls up
            if (index < projectCards.length - 1) {
                gsap.to(card, {
                    scale: 0.94,
                    opacity: 0.5,
                    yPercent: -10, // slight vertical compression
                    ease: "none",
                    scrollTrigger: {
                        trigger: projectCards[index + 1], // Triggered by the next card entering
                        start: "top 85%",                 // Start scaling when the next card enters viewport
                        end: "top 15%",                   // Stop scaling when the next card is fully placed
                        scrub: true
                    }
                });
            }
        });

        // Education Timeline Progress Trace & Stagger Reveal
        const educationSection = document.querySelector('.education-section');
        if (educationSection) {
            // Animate vertical light trace progress down the timeline line
            gsap.fromTo('.timeline-progress',
                { height: '0%' },
                {
                    height: '100%',
                    ease: "none",
                    scrollTrigger: {
                        trigger: '.education-timeline',
                        start: "top 60%", // Starts drawing when top hits 60% of viewport
                        end: "bottom 70%", // Fully drawn when bottom hits 70% of viewport
                        scrub: true
                    }
                }
            );

            // Stagger reveal of timeline elements
            const timelineItems = document.querySelectorAll('.timeline-item');
            gsap.fromTo(timelineItems,
                {
                    opacity: 0,
                    x: 40,
                    rotateY: 15
                },
                {
                    opacity: 1,
                    x: 0,
                    rotateY: 0,
                    duration: 1.0,
                    stagger: 0.18,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: '.education-timeline',
                        start: "top 75%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }


    }

    initInteractiveCanvas() {
        const canvas = document.getElementById('hero-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const parent = canvas.parentElement;

        let width = canvas.width = parent.clientWidth;
        let height = canvas.height = parent.clientHeight;

        let particles = [];
        const connectionDistance = 110;
        const mouse = { x: null, y: null, radius: 150 };
        const dpr = window.devicePixelRatio || 1;

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.radius = Math.random() * 2.0 + 2.0;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        this.x += (dx / dist) * force * 0.5;
                        this.y += (dy / dist) * force * 0.5;
                    }
                }

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                if (this.x < 0) this.x = 0;
                if (this.x > width) this.x = width;
                if (this.y < 0) this.y = 0;
                if (this.y > height) this.y = height;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 77, 77, 0.65)';
                ctx.fill();
            }
        }

        function resize() {
            width = parent.clientWidth;
            height = parent.clientHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';

            // Generate particles once canvas has non-zero size
            if (particles.length === 0 && width > 0 && height > 0) {
                const maxParticles = Math.max(45, Math.min(85, Math.floor((width * height) / 8000)));
                for (let i = 0; i < maxParticles; i++) {
                    particles.push(new Particle());
                }
            }
        }
        
        resize();
        window.addEventListener('resize', this.debounce(resize, 100));

        parent.addEventListener('mousemove', (e) => {
            const rect = parent.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        parent.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        function animate() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                const p1 = particles[i];
                p1.update();
                p1.draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        const alpha = (1 - dist / connectionDistance) * 0.22;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(255, 77, 77, ${alpha})`;
                        ctx.lineWidth = 0.7;
                        ctx.stroke();
                    }
                }

                if (mouse.x !== null && mouse.y !== null) {
                    const dx = p1.x - mouse.x;
                    const dy = p1.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < mouse.radius) {
                        const alpha = (1 - dist / mouse.radius) * 0.4;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = `rgba(255, 77, 77, ${alpha})`;
                        ctx.lineWidth = 0.95;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animate);
        }

        animate();
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
