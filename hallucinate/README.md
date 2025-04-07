# Triangle Animation

A lightweight, customizable JavaScript library that creates an animated triangle pattern background with pulse effects and interactive hover behavior. No dependencies required - works with vanilla JavaScript in any HTML context.

## Features
- Configurable colors (any number of colors in gradient)
- Adjustable triangle size and spacing
- Customizable pulse animation (speed, opacity range)
- Stroke style options (solid, dashed, dotted)
- Interactive hover effect
- Responsive and adaptable to any container size

## Installation
1. Copy `script.js` to your project directory
2. Include it in your HTML:
```
<script src="script.js"></script>
```

## Usage
Add a container element with an ID, then call -createTriangleAnimation()- with your configuration options.

### Basic Configuration Options
- containerId-: ID of the target element (default: 'triangle-background')
- colors-: Array of color hex codes (default: ['#32c5ca', '#8ee2aa'])
- spacing-: Space between triangles in pixels (default: 8)
- triangleWidth-: Width of triangles in pixels (default: 60)
- triangleHeight-: Height of triangles in pixels (default: 52)
- pulse-: Object with pulse settings
  - enabled-: Boolean (default: true)
  - speed-: Duration in seconds (default: 2)
  - minOpacity-: Minimum opacity (default: 0.7)
  - maxOpacity-: Maximum opacity (default: 1)
- -stroke-: Object with stroke settings
  - width-: Stroke width in pixels (default: 2)
  - style-: 'solid', 'dashed', or 'dotted' (default: 'solid')
  - dashArray-: Custom dash pattern (default: 'none')
- -hoverEffect-: Object with hover settings
  - enabled-: Boolean (default: true)
  - size-: Hover circle diameter in pixels (default: 200)

## Examples

### As Page Background
Use it as a full-page background:
```html
<!DOCTYPE html>
<html>
<body>
    <div id="page-bg" style="width: 100%; height: 100vh;"></div>
    <script src="triangleAnimation.js"></script>
    <script>
        createTriangleAnimation({
            containerId: 'page-bg',
            colors: ['#26a0a5', '#32c5ca', '#8ee2aa'],
            triangleWidth: 80,
            triangleHeight: 70
        });
    </script>
</body>
</html>
```

### As Bootstrap Container Background
Add to a Bootstrap container:
```html
<!DOCTYPE html>
<html>
<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <div id="bs-bg" class="p-4" style="min-height: 200px;">
            <h2>Content Here</h2>
        </div>
    </div>
    <script src="triangleAnimation.js"></script>
    <script>
        createTriangleAnimation({
            containerId: 'bs-bg',
            colors: ['#4eebd6', '#6af6b8', '#94cf74'],
            spacing: 10,
            stroke: { style: 'dashed', width: 3 }
        });
    </script>
</body>
</html>
```

### As Semantic UI Segment Background
Use with Semantic UI's segment:
```html
<!DOCTYPE html>
<html>
<head>
    <link href="https://cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" rel="stylesheet">
</head>
<body>
    <div class="ui container">
        <div id="semantic-bg" class="ui segment" style="min-height: 200px;">
            <h3>Segment Content</h3>
        </div>
    </div>
    <script src="triangleAnimation.js"></script>
    <script>
        createTriangleAnimation({
            containerId: 'semantic-bg',
            colors: ['#32c5ca', '#78e9a1', '#8ee2aa'],
            pulse: { speed: 1.5, minOpacity: 0.5 },
            hoverEffect: { size: 150 }
        });
    </script>
</body>
</html>
```

### As Background for Any Element
Apply to any custom element:
```html
<!DOCTYPE html>
<html>
<body>
    <div style="position: relative; width: 300px; height: 200px;">
        <div id="custom-bg"></div>
        <div style="position: relative; z-index: 1;">Content on top</div>
    </div>
    <script src="triangleAnimation.js"></script>
    <script>
        createTriangleAnimation({
            containerId: 'custom-bg',
            colors: ['#26a0a5', '#40d8d0', '#6af6b8', '#94cf74'],
            triangleWidth: 40,
            triangleHeight: 35,
            stroke: { style: 'dotted', width: 2 }
        });
    </script>
</body>
</html>
```

## Notes
- Ensure the container has a defined size (width/height)
- Use -position: relative- on the container and -z-index- on content to layer properly
- The animation automatically resizes with the container
- Works in any modern browser without additional setup

## Troubleshooting
- If no animation appears, check:
  - Container ID matches your HTML
  - Script is loaded before calling the function
  - Container has non-zero dimensions

