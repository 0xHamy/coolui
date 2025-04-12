// script.js
function WaveGraph(elementId, options = {}) {
    this.element = document.getElementById(elementId);
    
    // Create canvas dynamically
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.element.appendChild(this.canvas);

    // Default options (mimicking ocean waves)
    this.options = {
        gridSize: options.gridSize || 20, // Default grid spacing
        waveSpeed: options.waveSpeed || 0.02, // Default speed
        waveHeight: options.waveHeight || 30, // Default amplitude
        dotSize: options.dotSize || 2, // Default dot size
        colors: options.colors || ['#FF0000', '#FF4500', '#FFD700', '#00FF00', '#00CED1', '#1E90FF', '#FF00FF'], // Default rainbow-like colors
        ...options
    };

    // Parse color to RGB
    this.parseColor = function(color) {
        const ctx = document.createElement('canvas').getContext('2d');
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        return { r, g, b };
    };

    // Parse colors once and store RGB values
    this.parsedColors = this.options.colors.map(color => this.parseColor(color));

    // Set canvas size to match the element
    this.width = this.element.offsetWidth;
    this.height = this.element.offsetHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.cols = Math.floor(this.width / this.options.gridSize);
    this.rows = Math.floor(this.height / this.options.gridSize);

    // Time for animation
    this.time = 0;

    // Initialize
    this.init = function() {
        // Update canvas size in case the container size has changed
        this.width = this.element.offsetWidth;
        this.height = this.element.offsetHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.cols = Math.floor(this.width / this.options.gridSize);
        this.rows = Math.floor(this.height / this.options.gridSize);
        this.animate();
    };

    // Generate color from the custom list based on time and position
    this.getRainbowColor = function(x, y) {
        const colorCount = this.parsedColors.length;
        // Use sine to create a smooth, shifting effect across the grid
        const phase = (Math.sin(this.time + (x + y) * 0.05) + 1) / 2; // Value between 0 and 1
        const colorIndex = Math.floor(phase * colorCount) % colorCount;
        const nextColorIndex = (colorIndex + 1) % colorCount;
        const t = (phase * colorCount) % 1; // Fraction for smooth transition

        const color1 = this.parsedColors[colorIndex];
        const color2 = this.parsedColors[nextColorIndex];

        // Linear interpolation between colors
        const r = Math.floor(color1.r + (color2.r - color1.r) * t);
        const g = Math.floor(color1.g + (color2.g - color1.g) * t);
        const b = Math.floor(color1.b + (color2.b - color1.b) * t);

        return `rgb(${r}, ${g}, ${b})`;
    };

    // Animation loop
    this.animate = function() {
        const self = this;
        self.time += self.options.waveSpeed;
        
        // Clear canvas
        self.ctx.fillStyle = 'black';
        self.ctx.fillRect(0, 0, self.width, self.height);

        // Draw wave grid
        for (let x = 0; x < self.cols; x++) {
            for (let y = 0; y < self.rows; y++) {
                const xPos = x * self.options.gridSize;
                const yPos = y * self.options.gridSize;

                // Calculate wave offset
                const waveOffset = Math.sin(self.time + x * 0.2) * Math.cos(self.time + y * 0.2) * self.options.waveHeight;
                const newY = yPos + waveOffset;

                // Draw dot with rainbow color
                self.ctx.beginPath();
                self.ctx.arc(xPos, newY, self.options.dotSize, 0, Math.PI * 2);
                self.ctx.fillStyle = self.getRainbowColor(x, y);
                self.ctx.fill();
            }
        }

        // Continue animation
        requestAnimationFrame(function() {
            self.animate();
        });
    };
}