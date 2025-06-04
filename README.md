# SVG Gradient Mesh

A React library for gradient mesh emulation using SVG Voronoi surfaces and advanced SVG filters.

**Live Demo:** [https://tombigel.github.io/svg-mesh/](https://tombigel.github.io/svg-mesh/)

## Installation

```bash
git clone https://github.com/tombigel/svg-mesh.git
cd svg-mesh
npm install
npm run build:lib
```

## Usage

```tsx
import React, { useState } from 'react';
import { SvgMesh } from 'svg-mesh';

function App() {
  const [points, setPoints] = useState([
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
      stdDeviation={40}
      slope={1}
      intercept={0}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `points` | `Point[]` | **required** | Array of points with x, y, color |
| `width` | `number` | **required** | Canvas width |
| `height` | `number` | **required** | Canvas height |
| `stdDeviation` | `number` | `40` | Blur intensity |
| `slope` | `number` | `1` | Color transfer slope |
| `intercept` | `number` | `0` | Color transfer intercept |
| `interactive` | `boolean` | `true` | Enable interaction |
| `onPointsChange` | `function` | `undefined` | Points change callback |

## Point Type

```tsx
type Point = {
  x: number;
  y: number;
  color: string;
};
```

## Development

```bash
npm run dev        # Start demo
npm run build:lib  # Build library
npm run test       # Run tests
npm run deploy     # Deploy demo
```

## License

MIT