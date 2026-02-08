/**
 * Handles the sequence of multiple speech bubbles for the hero avatar with looping
 */
export default class SpeechHandler {
    constructor() {
        this.bubbles = [
            document.getElementById('bubble-1'),
            document.getElementById('bubble-2'),
            document.getElementById('bubble-3')
        ];
        this.currentIndex = 0;

        // Check if the bubbles exist in the DOM
        if (this.bubbles[0]) {
            this.startSequence();
        }
    }

    startSequence() {
        // Initial delay of 1s as requested
        setTimeout(() => {
            this.showNextBubble();
        }, 1000);
    }

    showNextBubble() {
        if (this.currentIndex >= this.bubbles.length) {
            // Sequence finished, wait 2s, then erase and restart
            setTimeout(() => {
                this.eraseAndRestart();
            }, 2000);
            return;
        }

        const currentBubble = this.bubbles[this.currentIndex];
        if (currentBubble) {
            currentBubble.classList.add('active');
        }

        this.currentIndex++;

        // Schedule next bubble after 1s interval
        if (this.currentIndex < this.bubbles.length) {
            setTimeout(() => {
                this.showNextBubble();
            }, 1000);
        } else {
            // If it's the last bubble, trigger the loop check
            this.showNextBubble();
        }
    }

    eraseAndRestart() {
        // Erase everything
        this.bubbles.forEach(bubble => {
            if (bubble) bubble.classList.remove('active');
        });

        this.currentIndex = 0;

        // Wait 1s and start again
        setTimeout(() => {
            this.showNextBubble();
        }, 1000);
    }
}
