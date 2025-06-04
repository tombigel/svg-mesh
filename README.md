# SVG Gradient Mesh

A React library for gradient mesh emulation using SVG Voronoi surfaces and advanced SVG filters. Create smooth color transitions and artistic effects through interactive point manipulation, real-time mesh generation, and sophisticated blur and color transfer operations.

## Demo

**Live Demo:** [https://tombigel.github.io/svg-mesh/](https://tombigel.github.io/svg-mesh/)

## Installation

This package is currently in development. To use it in your project:

```bash
git clone https://github.com/tombigel/svg-mesh.git
cd svg-mesh
npm install
npm run build:lib
```

Then copy the `dist/` folder to your project or reference the source files directly.

## Usage

```tsx
import React, { useState, useRef } from 'react';
import { SvgMesh, Point } from 'svg-mesh';

function App() {
  const [points, setPoints] = useState<Point[]>([
    { x: 100, y: 100, color: '#ff0000' },
    { x: 200, y: 200, color: '#00ff00' },
    { x: 300, y: 150, color: '#0000ff' },
  ]);

  const svgMeshRef = useRef<{ exportSVG: () => string }>(null);

  const handleExport = () => {
    if (svgMeshRef.current) {
      const svgContent = svgMeshRef.current.exportSVG();
      console.log(svgContent); // Use the exported SVG
    }
  };

  return (
    <div>
      <SvgMesh
        ref={svgMeshRef}
        points={points}
        width={400}
        height={400}
        onPointsChange={setPoints}
        interactive={true}
        stdDeviation={40}
        slope={1}
        intercept={0}
      />
      <button onClick={handleExport}>Export SVG</button>
    </div>
  );
}
```

## Interactive Features

When `interactive={true}`:

- **Click empty area**: Add new points to the mesh
- **Drag points**: Move points to reshape the mesh  
- **Select points**: Click to select for color/position editing via controls

The component provides intuitive direct manipulation of the mesh right on the canvas.

## Export Functionality

The `SvgMesh` component supports exporting the generated mesh as standalone SVG code:

### Using Refs

```tsx
const svgMeshRef = useRef<{ exportSVG: () => string }>(null);

// Export the current mesh state
const svgContent = svgMeshRef.current?.exportSVG();
```

### Export Features

- **On-demand Generation**: SVG is generated on-the-fly when export functions are called
- **Standalone SVG**: Exports complete SVG with embedded filters
- **Current State**: Captures current points, colors, and filter settings
- **Consistent IDs**: Uses stable filter IDs for reliable rendering
- **Direct Actions**: Demo includes direct copy to clipboard and download buttons

The exported SVG includes:

- Voronoi mesh paths with current colors
- SVG filter definitions (blur, color transfer)
- Proper viewBox and dimensions with `width="100%"` and `height="100%"`
- `preserveAspectRatio="none"` for flexible scaling
- All current filter parameters (stdDeviation, slope, intercept)

## API

### SvgMesh Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `points` | `Point[]` | **required** | Array of points with x, y coordinates and color |
| `width` | `number` | **required** | Width of the mesh canvas |
| `height` | `number` | **required** | Height of the mesh canvas |
| `stdDeviation` | `number` | `40` | Gaussian blur standard deviation |
| `slope` | `number` | `1` | Color transfer function slope |
| `intercept` | `number` | `0` | Color transfer function intercept |
| `interactive` | `boolean` | `true` | Enable drag and drop interaction |
| `onPointsChange` | `(points: Point[]) => void` | `undefined` | Callback when points are modified |
| `onSelectedChange` | `(selected: number) => void` | `undefined` | Callback when selection changes |
| `className` | `string` | `undefined` | CSS class name |
| `style` | `Record<string, any>` | `undefined` | Inline styles |

### Point Type

```tsx
type Point = {
  x: number;
  y: number;
  color: string; // CSS color value
};
```

## Development

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
git clone https://github.com/tombigel/svg-mesh.git
cd svg-mesh
npm install
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server for demo |
| `npm run build:lib` | Build library for distribution |
| `npm run build:demo` | Build demo application |
| `npm run test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |
| `npm run clean` | Clean build outputs |
| `npm run deploy` | Deploy demo to GitHub Pages |
| `npm run release` | Full release process |

### Project Structure

```text
svg-mesh/
├── src/                    # Library source code
│   ├── components/         # React components
│   ├── utils/             # Utility functions
│   ├── types.ts           # TypeScript types
│   └── index.ts           # Library entry point
├── demo/                  # Demo application
│   ├── src/               # Demo source code
│   ├── public/            # Demo static assets
│   └── index.html         # Demo HTML template
├── tests/                 # Test files
├── dist/                  # Library build output
├── build/                 # Demo build output
└── docs/                  # Documentation
```

## Testing

The project uses Vitest for testing with jsdom environment:

```bash
npm run test           # Run tests once
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage report
```

## Building

### Library Build

```bash
npm run build:lib
```

Generates:

- `dist/es/` - ES modules
- `dist/cjs/` - CommonJS modules  
- `dist/types/` - TypeScript declarations

### Demo Build

```bash
npm run build:demo
```

Generates static files in `build/` for deployment.

## Deployment

The demo is automatically deployed to GitHub Pages:

```bash
npm run deploy
```

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Run tests and ensure they pass
6. Submit a pull request

## Acknowledgments

- [d3-delaunay](https://github.com/d3/d3-delaunay) for Voronoi diagram generation
- [Vite](https://vitejs.dev) for build tooling
- [Vitest](https://vitest.dev) for testing