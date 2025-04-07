// Get the canvas and context
const canvas = document.getElementById('beaconCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size to window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Resize canvas on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Beacon properties
const beacon = {
    x: canvas.width / 2,
    y: canvas.height,
    baseWidth: 100,
    height: 300
};

// Energy wave properties
const energyWave = {
    x: beacon.x,
    y: beacon.y - beacon.height, // Start at the tip
    radius: 0,
    maxRadius: 200,
    opacity: 1,
    speed: 2 // Speed of wave expansion
};

// Function to draw the beacon (conical shape)
function drawBeacon() {
    // Red base
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.moveTo(beacon.x - beacon.baseWidth / 2, beacon.y); // Bottom left
    ctx.lineTo(beacon.x + beacon.baseWidth / 2, beacon.y); // Bottom right
    ctx.lineTo(beacon.x, beacon.y - beacon.height / 2); // Middle tip
    ctx.fill();

    // Brown middle
    ctx.fillStyle = '#8b4513';
    ctx.beginPath();
    ctx.moveTo(beacon.x - beacon.baseWidth / 3, beacon.y - beacon.height / 2);
    ctx.lineTo(beacon.x + beacon.baseWidth / 3, beacon.y - beacon.height / 2);
    ctx.lineTo(beacon.x, beacon.y - beacon.height * 0.75); // Upper tip
    ctx.fill();

    // Gray tip
    ctx.fillStyle = '#d3d3d3';
    ctx.beginPath();
    ctx.moveTo(beacon.x - beacon.baseWidth / 6, beacon.y - beacon.height * 0.75);
    ctx.lineTo(beacon.x + beacon.baseWidth / 6, beacon.y - beacon.height * 0.75);
    ctx.lineTo(beacon.x, beacon.y - beacon.height); // Top tip
    ctx.fill();
}

// Function to draw and update the energy wave
function drawEnergyWave() {
    // Update wave properties
    energyWave.radius += energyWave.speed;
    energyWave.opacity = 1 - energyWave.radius / energyWave.maxRadius; // Fade out as it expands

    // Draw the wave
    ctx.beginPath();
    ctx.arc(energyWave.x, energyWave.y, energyWave.radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 165, 0, ${energyWave.opacity})`; // Orange glow
    ctx.lineWidth = 3;
    ctx.stroke();

    // Reset wave when it reaches max radius
    if (energyWave.radius >= energyWave.maxRadius) {
        energyWave.radius = 0;
        energyWave.opacity = 1;
    }
}

// Animation loop
function animate() {
    // Clear canvas with a slight fade for smooth effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the beacon
    drawBeacon();

    // Draw and update the energy wave
    drawEnergyWave();

    requestAnimationFrame(animate);
}

// Start the animation
animate();