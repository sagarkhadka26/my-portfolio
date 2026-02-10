/* ========================================
   Loading Screen - Minimal Version
   ======================================== */

class Loader {
    constructor() {
        this.loader = null;
        this.minimumDisplayTime = 500; // Reduced to 500ms
        this.startTime = Date.now();

        this.init();
    }

    init() {
        // Wait for all resources to load
        window.addEventListener('load', () => {
            this.hide();
        });

        // Fallback: hide after 2 seconds max
        setTimeout(() => {
            this.hide();
        }, 2000);
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

export default Loader;
