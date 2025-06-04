# SVG Mesh

A React library for creating interactive Voronoi gradient meshes using SVG, d3-delaunay, and CSS filters.

## 🚀 Demo

**Live Demo:** [https://tombigel.github.io/svg-mesh/](https://tombigel.github.io/svg-mesh/)

## 📦 Installation

This package is currently in development. To use it in your project:

```bash
git clone https://github.com/tombigel/svg-mesh.git
cd svg-mesh
npm install
npm run build:lib
```

Then copy the `dist/` folder to your project or reference the source files directly.

## 🎯 Usage

```tsx
import React, { useState } from 'react';
import { SvgMesh, Point } from 'svg-mesh';

function App() {
  const [points, setPoints] = useState<Point[]>([
    { x: 100, y: 100, color: '#ff0000' },
    { x: 200, y: 200, color: '#00ff00' },
    { x: 300, y: 150, color: '#0000ff' },
  ]);

  return (
    <SvgMesh
      points={points}
      width={400}
      height={400}
      onPointsChange={setPoints}
      interactive={true}
      stdDeviation={40}
      slope={1}
      intercept={0}
    />
  );
}
```

## 🔧 API

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

## 🛠️ Development

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

## 🧪 Testing

The project uses Vitest for testing with jsdom environment:

```bash
npm run test           # Run tests once
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage report
```

## 📦 Building

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

## 🚀 Deployment

The demo is automatically deployed to GitHub Pages:

```bash
npm run deploy
```

## 📄 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Run tests and ensure they pass
6. Submit a pull request

## 🙏 Acknowledgments

- [d3-delaunay](https://github.com/d3/d3-delaunay) for Voronoi diagram generation
- [Vite](https://vitejs.dev) for build tooling
- [Vitest](https://vitest.dev) for testing
