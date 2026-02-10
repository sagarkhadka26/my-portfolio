/* ========================================
   Main JavaScript Entry Point
   ======================================== */

// Import modules
import { projects } from './projects.js';
import { resumeData } from './resumeData.js';
import { Header, Footer } from './components.js';

/* ========================================
   Component Injection
   ======================================== */
const injectComponents = () => {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = Header();
        // Unwrap the div to avoid extra container if needed, but innerHTML is safer for layout 
        // unless the CSS specifically target the placeholder ID.
    }
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = Footer();
    }
};

/* ========================================
   Project Gallery Rendering
   ======================================== */
class ProjectGallery {
    constructor() {
        this.container = document.querySelector('.works-grid');
        this.isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';

        if (this.container) {
            this.render();
        }
    }

    render() {
        // Clear container
        this.container.innerHTML = '';

        // If on home page, maybe only show recent 6? 
        // For now, consistent with what was there, we show all or limit.
        const projectsToShow = this.isHomePage ? projects.slice(0, 6) : projects;

        projectsToShow.forEach(project => {
            const card = this.createProjectCard(project);
            this.container.appendChild(card);
        });
    }

    createProjectCard(project) {
        const link = document.createElement('a');
        link.href = `project.html?id=${project.id}`;
        link.className = `project-card ${project.colorClass}`;

        link.innerHTML = `
            <div class="project-card-inner">
                <img src="${project.image}" alt="${project.title}" class="project-card-image">
            </div>
            <p class="project-card-title">
                ${project.title}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
            </p>
        `;

        return link;
    }
}

/* ========================================
   Resume Timeline Rendering
   ======================================== */
class ResumeTimeline {
    constructor() {
        this.experienceContainer = document.getElementById('experience-timeline');
        this.educationContainer = document.getElementById('education-timeline');

        if (this.experienceContainer || this.educationContainer) {
            this.render();
        }
    }

    render() {
        if (this.experienceContainer && resumeData.experience) {
            this.experienceContainer.innerHTML = resumeData.experience.map(item => `
                <div class="timeline-item fade-in">
                    <span class="timeline-year">${item.period}</span>
                    <h3>${item.role} | ${item.company}</h3>
                    <p>${item.description}</p>
                </div>
            `).join('');
        }

        if (this.educationContainer && resumeData.education) {
            this.educationContainer.innerHTML = resumeData.education.map(item => `
                <div class="timeline-item fade-in">
                    <span class="timeline-year">${item.period}</span>
                    <h3>${item.degree}</h3>
                    <p>${item.institution}</p>
                    ${item.description ? `<p style="font-size: 0.9rem; margin-top: 5px;">${item.description}</p>` : ''}
                </div>
            `).join('');
        }
    }
}

// Styling for this project is now handled via <link> tags in HTML files
// to prevent Flash of Unstyled Content (FOUC).

/* ========================================
   Navigation
   ======================================== */
class Navigation {
    constructor() {
        this.header = document.querySelector('.header');
        this.menuToggle = document.querySelector('.menu-toggle');
        this.nav = document.querySelector('.nav');
        this.navLinks = document.querySelectorAll('.nav-link');

        this.init();
    }

    init() {
        // Mobile menu toggle
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', () => this.toggleMenu());
        }

        // Close menu on link click (mobile)
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (this.nav && this.nav.classList.contains('active')) {
                if (!this.nav.contains(e.target) && !this.menuToggle.contains(e.target)) {
                    this.closeMenu();
                }
            }
        });

        // Set active nav link based on current page
        this.setActiveLink();
    }

    toggleMenu() {
        if (this.nav) {
            this.nav.classList.toggle('active');
        }
    }

    closeMenu() {
        if (this.nav) {
            this.nav.classList.remove('active');
        }
    }

    setActiveLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage ||
                (currentPage === '' && href === 'index.html') ||
                (currentPage === 'index.html' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}

/* ========================================
   Smooth Scroll for Anchor Links
   ======================================== */
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('click', (e) => {
            const anchor = e.target.closest('a[href^="#"]');
            if (!anchor) return;

            const href = anchor.getAttribute('href');
            if (!href || href === '#') return;

            // Only handle internal anchors on the same page
            try {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            } catch (err) {
                // If querySelector fails (e.g. invalid selector), let browser handle it or ignore
                console.warn('Invalid smooth scroll target:', href);
            }
        });
    }
}

/* ========================================
   Page Transitions
   ======================================== */
class PageTransition {
    constructor() {
        this.transitionElement = null;
        this.init();
    }

    init() {
        // Create transition element
        this.transitionElement = document.createElement('div');
        this.transitionElement.className = 'page-transition';
        document.body.appendChild(this.transitionElement);

        // Handle internal link clicks
        document.querySelectorAll('a[href]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                const target = link.getAttribute('target');

                // Skip if it's an external link, a hash link, special protocol, or opens in new tab
                if (!href ||
                    href.startsWith('http') ||
                    href.startsWith('#') ||
                    href.startsWith('mailto:') ||
                    href.startsWith('tel:') ||
                    href.startsWith('javascript:') ||
                    link.hasAttribute('download') ||
                    href.endsWith('.pdf') ||
                    target === '_blank') {
                    return;
                }

                e.preventDefault();
                this.navigateTo(href);
            });
        });
    }

    navigateTo(url) {
        this.transitionElement.classList.add('active');

        setTimeout(() => {
            window.location.href = url;
        }, 500);
    }
}

/* ========================================
   Initialize Everything
   ======================================== */
document.addEventListener('DOMContentLoaded', () => {
    // 0. Initialize loader first (it handles the screen overlay)
    import('./loader.js').then(module => {
        const Loader = module.default;
        new Loader();
    });

    // 1. Inject components
    injectComponents();

    // 2. Initialize navigation (handles active links and mobile menu)
    new Navigation();

    // 3. Initialize scroll animations (now that header/footer are in DOM)
    import('./animations.js').then(module => {
        const ScrollAnimations = module.default;
        new ScrollAnimations();
    });

    // 4. Initialize cursor
    import('./cursor.js').then(module => {
        const SparklesCursor = module.default;
        new SparklesCursor();
    });

    // 5. Initialize other misc utilities
    new SmoothScroll();
    new PageTransition();
    new ProjectGallery();
    new ResumeTimeline();

    // 6. Initialize Speech Bubble Sequence
    // import('./speech.js').then(module => {
    //     const SpeechHandler = module.default;
    //     new SpeechHandler();
    // });

    console.log('🚀 Portfolio loaded successfully!');
});
