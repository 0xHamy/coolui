// triangleAnimation.js
function createTriangleAnimation(options = {}) {
    // Default configuration
    const config = {
        containerId: options.containerId || 'triangle-background',
        colors: options.colors || ['#32c5ca', '#8ee2aa'],
        spacing: options.spacing || 8,
        triangleWidth: options.triangleWidth || 60,
        triangleHeight: options.triangleHeight || 52,
        pulse: {
            enabled: options.pulse?.enabled ?? true,
            speed: options.pulse?.speed || 2,
            minOpacity: options.pulse?.minOpacity || 0.7,
            maxOpacity: options.pulse?.maxOpacity || 1
        },
        stroke: {
            width: options.stroke?.width || 2,
            style: options.stroke?.style || 'solid',
            dashArray: options.stroke?.dashArray || 'none'
        },
        hoverEffect: {
            enabled: options.hoverEffect?.enabled ?? true,
            size: options.hoverEffect?.size || 200
        }
    };

    const container = document.getElementById(config.containerId);
    if (!container) {
        console.error(`Container with ID '${config.containerId}' not found`);
        return;
    }

    // Setup container
    container.style.position = 'relative';
    container.style.overflow = 'hidden';
    container.style.background = 'linear-gradient(45deg, #1a1a1a, #000000)';

    // Create SVG and hover circle
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('triangle-grid');
    svg.style.width = '100%';
    svg.style.height = '100%';

    const hoverCircle = document.createElement('div');
    hoverCircle.classList.add('hover-circle');
    hoverCircle.style.cssText = `
        position: absolute;
        width: ${config.hoverEffect.size}px;
        height: ${config.hoverEffect.size}px;
        border-radius: 50%;
        pointer-events: none;
        transform: translate(-50%, -50%);
        transition: all 0.1s ease;
    `;

    container.appendChild(svg);
    if (config.hoverEffect.enabled) {
        container.appendChild(hoverCircle);
    }

    // Add styles
    const style = document.createElement('style');
    document.head.appendChild(style);
    style.textContent = `
        #${config.containerId} .triangle {
            fill: none;
            stroke: url(#grad1);
            stroke-width: ${config.stroke.width};
            stroke-dasharray: ${config.stroke.style === 'dashed' || config.stroke.style === 'dotted' ? 
                config.stroke.dashArray : 'none'};
            stroke-dasharray: ${config.stroke.style === 'dotted' ? '1 6' : 
                config.stroke.style === 'dashed' ? '10 5' : 'none'};
            transition: opacity 0.5s ease-out;
            vector-effect: non-scaling-stroke;
        }

        ${config.pulse.enabled ? `
            @keyframes pulse-${config.containerId} {
                0% { stroke-opacity: ${config.pulse.minOpacity}; }
                50% { stroke-opacity: ${config.pulse.maxOpacity}; }
                100% { stroke-opacity: ${config.pulse.minOpacity}; }
            }
            #${config.containerId} .triangle.pulse {
                animation: pulse-${config.containerId} ${config.pulse.speed}s infinite;
            }
        ` : ''}
    `;

    function createTrianglePattern() {
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);

        const cols = Math.ceil(width / (config.triangleWidth + config.spacing)) + 1;
        const rows = Math.ceil(height / (config.triangleHeight + config.spacing)) + 1;

        let gradientStops = '';
        const step = 100 / (config.colors.length - 1);
        config.colors.forEach((color, index) => {
            gradientStops += `<stop offset="${index * step}%" style="stop-color:${color};stop-opacity:1" />`;
        });

        svg.innerHTML = `
            <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    ${gradientStops}
                </linearGradient>
            </defs>
        `;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = col * (config.triangleWidth + config.spacing) + (row % 2 * (config.triangleWidth/2));
                const y = row * (config.triangleHeight + config.spacing);

                const upTri = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                upTri.setAttribute('points', `${x},${y} ${x + config.triangleWidth/2},${y + config.triangleHeight} ${x + config.triangleWidth},${y}`);
                upTri.classList.add('triangle');
                if (config.pulse.enabled) {
                    upTri.classList.add('pulse');
                    upTri.style.animationDelay = `${Math.random() * config.pulse.speed}s`;
                }

                const downTri = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                downTri.setAttribute('points', `${x},${y + config.triangleHeight} ${x + config.triangleWidth/2},${y} ${x + config.triangleWidth},${y + config.triangleHeight}`);
                downTri.classList.add('triangle');
                if (config.pulse.enabled) {
                    downTri.classList.add('pulse');
                    downTri.style.animationDelay = `${Math.random() * config.pulse.speed}s`;
                }

                svg.appendChild(upTri);
                svg.appendChild(downTri);
            }
        }
    }

    // Event listeners
    if (config.hoverEffect.enabled) {
        container.addEventListener('mousemove', (e) => {
            hoverCircle.style.left = `${e.clientX}px`;
            hoverCircle.style.top = `${e.clientY}px`;

            const circleRect = hoverCircle.getBoundingClientRect();
            const radius = circleRect.width / 2;
            const triangles = svg.getElementsByClassName('triangle');

            Array.from(triangles).forEach(triangle => {
                const triRect = triangle.getBoundingClientRect();
                const triCenterX = triRect.left + triRect.width/2;
                const triCenterY = triRect.top + triRect.height/2;

                const distance = Math.sqrt(
                    Math.pow(triCenterX - (circleRect.left + radius), 2) +
                    Math.pow(triCenterY - (circleRect.top + radius), 2)
                );

                triangle.style.opacity = distance < radius ? 
                    Math.max(0, 1 - (distance / radius) - 0.5) : 1;
            });
        });

        container.addEventListener('mouseleave', () => {
            const triangles = svg.getElementsByClassName('triangle');
            Array.from(triangles).forEach(triangle => {
                triangle.style.opacity = 1;
            });
        });
    }

    window.addEventListener('resize', createTrianglePattern);
    
    // Initial creation
    createTrianglePattern();
}

// Make it globally available
window.createTriangleAnimation = createTriangleAnimation;