/* ========================================
   Custom Cursor - Minimal Fade Effect
   ======================================== */

class MinimalCursor {
    constructor() {
        this.cursor = null;
        this.cursorDot = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.cursorX = 0;
        this.cursorY = 0;

        this.init();
    }

    init() {
        // Create cursor elements
        this.createCursor();

        // Bind events
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('mousedown', this.onMouseDown.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));

        // Handle hover states on interactive elements
        this.bindHoverStates();

        // Start animation loop
        this.animate();
    }

    createCursor() {
        // Main cursor ring
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        document.body.appendChild(this.cursor);

        // Cursor dot (inner)
        this.cursorDot = document.createElement('div');
        this.cursorDot.className = 'cursor-dot';
        document.body.appendChild(this.cursorDot);
    }

    bindHoverStates() {
        // Re-bind when DOM updates (for dynamically loaded content)
        const observer = new MutationObserver(() => {
            this.updateHoverBindings();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Initial binding
        this.updateHoverBindings();
    }

    updateHoverBindings() {
        const interactiveElements = document.querySelectorAll('a, button, .project-card, input, textarea, .nav-link, .social-link');
        
        interactiveElements.forEach(el => {
            // Remove old listeners by cloning (prevents duplicates)
            const newEl = el.cloneNode(true);
            if (el.parentNode) {
                el.parentNode.replaceChild(newEl, el);
            }

            newEl.addEventListener('mouseenter', () => this.cursor.classList.add('hover'));
            newEl.addEventListener('mouseleave', () => this.cursor.classList.remove('hover'));
        });
    }

    onMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    }

    onMouseDown() {
        this.cursor.classList.add('clicking');
    }

    onMouseUp() {
        this.cursor.classList.remove('clicking');
    }

    updateCursor() {
        // Smooth following effect with slight delay
        const dx = this.mouseX - this.cursorX;
        const dy = this.mouseY - this.cursorY;
        
        this.cursorX += dx * 0.15;
        this.cursorY += dy * 0.15;

        // Update cursor position (centered)
        this.cursor.style.left = `${this.cursorX - 10}px`;
        this.cursor.style.top = `${this.cursorY - 10}px`;

        // Dot follows instantly
        this.cursorDot.style.left = `${this.mouseX - 3}px`;
        this.cursorDot.style.top = `${this.mouseY - 3}px`;
    }

    animate() {
        this.updateCursor();
        requestAnimationFrame(this.animate.bind(this));
    }
}

export default MinimalCursor;
