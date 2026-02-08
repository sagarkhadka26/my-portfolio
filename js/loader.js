/* ========================================
   Loading Screen
   ======================================== */

class Loader {
    constructor() {
        this.loader = null;
        this.minimumDisplayTime = 800; // Minimum time to show loader
        this.startTime = Date.now();

        this.init();
    }

    init() {
        // Wait for all resources to load
        window.addEventListener('load', () => {
            this.hide();
        });

        // Fallback: hide after 3 seconds max
        setTimeout(() => {
            this.hide();
        }, 3000);
    }

    hide() {
        this.loader = document.querySelector('.loader');

        if (!this.loader) return;

        const elapsedTime = Date.now() - this.startTime;
        const remainingTime = Math.max(0, this.minimumDisplayTime - elapsedTime);

        setTimeout(() => {
            this.loader.classList.add('hidden');

            // Remove from DOM after animation
            setTimeout(() => {
                if (this.loader && this.loader.parentNode) {
                    this.loader.parentNode.removeChild(this.loader);
                }

                // Trigger page content animations
                document.body.classList.add('loaded');
            }, 500);
        }, remainingTime);
    }
}

// Initialize loader - MOVED TO main.js or handled there
// new Loader();

export default Loader;
