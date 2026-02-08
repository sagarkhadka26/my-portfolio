/* ========================================
   Custom Cursor with Sparkle Effect
   ======================================== */

class SparklesCursor {
    constructor() {
        this.cursor = null;
        this.cursorDot = null;
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.cursorX = 0;
        this.cursorY = 0;

        this.init();
    }

    init() {
        // Create cursor elements
        this.createCursor();
        this.createCanvas();

        // Bind events
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('mousedown', this.onMouseDown.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));

        // Handle hover states on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .project-card, input, textarea');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => this.cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => this.cursor.classList.remove('hover'));
        });

        // Start animation loop
        this.animate();
    }

    createCursor() {
        // Main cursor
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        document.body.appendChild(this.cursor);

        // Cursor dot (inner)
        this.cursorDot = document.createElement('div');
        this.cursorDot.className = 'cursor-dot';
        document.body.appendChild(this.cursorDot);
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'sparkle-canvas';
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');

        // Handle resize
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }

    onMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;

        // Spawn sparkle particles
        if (Math.random() > 0.5) {
            this.createParticle(e.clientX, e.clientY);
        }
    }

    onMouseDown() {
        this.cursor.classList.add('clicking');
        // Burst of particles on click
        for (let i = 0; i < 8; i++) {
            this.createParticle(this.mouseX, this.mouseY, true);
        }
    }

    onMouseUp() {
        this.cursor.classList.remove('clicking');
    }

    createParticle(x, y, isBurst = false) {
        const colors = ['#FFD700', '#FFF8DC', '#FFFACD', '#F5DEB3', '#FFE4B5', '#FFEFD5'];
        const particle = {
            x: x,
            y: y,
            size: Math.random() * 4 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            velocityX: isBurst ? (Math.random() - 0.5) * 8 : (Math.random() - 0.5) * 2,
            velocityY: isBurst ? (Math.random() - 0.5) * 8 : Math.random() * -2,
            alpha: 1,
            decay: Math.random() * 0.02 + 0.02,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10
        };

        this.particles.push(particle);
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            // Update position
            p.x += p.velocityX;
            p.y += p.velocityY;
            p.velocityY += 0.05; // Gravity

            // Update rotation
            p.rotation += p.rotationSpeed;

            // Fade out
            p.alpha -= p.decay;

            // Remove dead particles
            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(p => {
            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate((p.rotation * Math.PI) / 180);
            this.ctx.globalAlpha = p.alpha;

            // Draw sparkle (4-pointed star)
            this.ctx.beginPath();
            this.ctx.fillStyle = p.color;
            this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)'; // Subtle dark border
            this.ctx.lineWidth = 1;

            const spikes = 4;
            const outerRadius = p.size;
            const innerRadius = p.size * 0.4;

            for (let i = 0; i < spikes * 2; i++) {
                const radius = i % 2 === 0 ? outerRadius : innerRadius;
                const angle = (i * Math.PI) / spikes;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                if (i === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }

            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke(); // Render the border

            // Add glow/contrast effect
            this.ctx.shadowBlur = 4;
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'; // Added subtle dark shadow for contrast on light areas
            this.ctx.fill();

            // Add native glow
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = p.color;
            this.ctx.fill();

            this.ctx.restore();
        });
    }

    updateCursor() {
        // Instant cursor movement (no delay)
        this.cursorX = this.mouseX;
        this.cursorY = this.mouseY;

        // Update cursor position (centered for 38px size)
        this.cursor.style.left = `${this.cursorX - 19}px`;
        this.cursor.style.top = `${this.cursorY - 19}px`;

        // Dot follows more closely
        this.cursorDot.style.left = `${this.mouseX - 4}px`;
        this.cursorDot.style.top = `${this.mouseY - 4}px`;
    }

    animate() {
        this.updateCursor();
        this.updateParticles();
        this.drawParticles();

        requestAnimationFrame(this.animate.bind(this));
    }
}

// Initialize cursor when DOM is ready - MOVED TO main.js
// document.addEventListener('DOMContentLoaded', () => {
//     // Only enable custom cursor on non-touch devices
//     if (!('ontouchstart' in window)) {
//         new SparklesCursor();
//     }
// });

export default SparklesCursor;
