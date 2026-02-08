/* ========================================
   Scroll Animations using GSAP
   ======================================== */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.initFadeInAnimations();
        this.initStaggerAnimations();
        this.initParallaxEffects();
        this.initNavbarScroll();
    }

    // Fade-in animations for elements with .fade-in class
    initFadeInAnimations() {
        const fadeElements = document.querySelectorAll('.fade-in');

        fadeElements.forEach(element => {
            gsap.fromTo(element,
                {
                    opacity: 0,
                    y: 50
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });
    }

    // Staggered animations for project cards
    initStaggerAnimations() {
        const cardContainers = document.querySelectorAll('.works-grid');

        cardContainers.forEach(container => {
            const cards = container.querySelectorAll('.project-card');

            if (cards.length > 0) {
                gsap.fromTo(cards,
                    {
                        opacity: 0,
                        y: 60,
                        scale: 0.95
                    },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.6,
                        stagger: 0.1,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: container,
                            start: 'top 80%',
                            toggleActions: 'play none none none'
                        }
                    }
                );
            }
        });
    }

    // Parallax effects for hero section (avatar only)
    initParallaxEffects() {
        const heroAvatar = document.querySelector('.hero-avatar img');

        if (heroAvatar) {
            gsap.to(heroAvatar, {
                y: 50,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        }
        // Hero text parallax removed to prevent vanishing
    }

    // Navbar background on scroll
    initNavbarScroll() {
        const header = document.querySelector('.header');

        if (header) {
            ScrollTrigger.create({
                start: 'top -80',
                onUpdate: (self) => {
                    if (self.direction === 1) {
                        header.classList.add('scrolled');
                    } else if (window.scrollY < 80) {
                        header.classList.remove('scrolled');
                    }
                }
            });
        }
    }
}

// Initialize animations when DOM is ready - MOVED TO main.js
// document.addEventListener('DOMContentLoaded', () => {
//     new ScrollAnimations();
// });

export default ScrollAnimations;
