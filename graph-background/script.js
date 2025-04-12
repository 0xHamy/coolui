// script.js
class GridBackground {
    constructor(config = {}) {
        // Default configuration
        this.container = config.container || document.body;
        this.density = config.density || 50; // Grid spacing in pixels
        this.dotSize = config.dotSize || 2; // Base size of dots in pixels (new parameter)
        this.dotColor = config.dotColor || '#ffffff'; // Default white dots
        this.lineColor = config.lineColor || 'rgba(255, 255, 255, 0.2)'; // Default faint white lines
        this.pumpSpeed = config.pumpSpeed || 1; // Speed of the heart-pumping effect (1 = normal)

        // Initialize canvas
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.zIndex = '-1'; // Place behind other content
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        // Set canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // Start animation
        this.dots = [];
        this.createGrid();
        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.container.clientHeight;
        this.createGrid(); // Recreate grid on resize
    }

    createGrid() {
        this.dots = [];
        const cols = Math.ceil(this.canvas.width / this.density);
        const rows = Math.ceil(this.canvas.height / this.density);

        for (let i = 0; i <= cols; i++) {
            for (let j = 0; j <= rows; j++) {
                this.dots.push({
                    x: i * this.density,
                    y: j * this.density,
                    baseRadius: this.dotSize, // Use the configurable dot size
                    radius: this.dotSize, // Initial radius
                    color: this.dotColor
                });
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw lines
        this.ctx.strokeStyle = this.lineColor;
        this.ctx.lineWidth = 1;

        const cols = Math.ceil(this.canvas.width / this.density) + 1;
        const rows = Math.ceil(this.canvas.height / this.density) + 1;

        // Vertical lines
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows - 1; j++) {
                const idx = i * rows + j;
                const nextIdx = idx + 1;
                if (nextIdx < this.dots.length) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.dots[idx].x, this.dots[idx].y);
                    this.ctx.lineTo(this.dots[nextIdx].x, this.dots[nextIdx].y);
                    this.ctx.stroke();
                }
            }
        }

        // Horizontal lines
        for (let j = 0; j < rows; j++) {
            for (let i = 0; i < cols - 1; i++) {
                const idx = i * rows + j;
                const nextIdx = idx + rows;
                if (nextIdx < this.dots.length) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.dots[idx].x, this.dots[idx].y);
                    this.ctx.lineTo(this.dots[nextIdx].x, this.dots[nextIdx].y);
                    this.ctx.stroke();
                }
            }
        }

        // Draw dots
        this.dots.forEach(dot => {
            this.ctx.beginPath();
            this.ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = dot.color;
            this.ctx.fill();
        });
    }

    animate() {
        // Heart-pumping effect: scale dot radius using a sine wave
        const time = Date.now() * 0.001 * this.pumpSpeed;
        this.dots.forEach(dot => {
            dot.radius = dot.baseRadius + Math.sin(time) * (dot.baseRadius * 0.75); // Pulsing effect scales with dot size
        });

        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Function to initialize the grid background
function initGridBackground(config) {
    return new GridBackground(config);
}

// Expose the function globally
window.initGridBackground = initGridBackground;