import React from "react";
import "./App.css";
import { Controls } from "./Controls";
import { SvgMesh } from "../../src/components/SvgMesh";

function App() {
  const [points, setPoints] = React.useState(
    [
      {
          "x": 279.7303771972656,
          "y": 241.024658203125,
          "color": "#FF0000"
      },
      {
          "x": 122.05767822265625,
          "y": 85.09025573730469,
          "color": "#4400ff"
      },
      {
          "x": 183.1702880859375,
          "y": 285.7411804199219,
          "color": "#000000"
      },
      {
          "x": 79.20132446289062,
          "y": 226.319580078125,
          "color": "#00ff88"
      },
      {
          "x": 288.25323486328125,
          "y": 120.594482421875,
          "color": "#00e1ff"
      }
    ]
  );
  const [selected, setSelected] = React.useState(0);
  const [stdDeviation, setStdDeviation] = React.useState(40);
  const [slope, setSlope] = React.useState(1);
  const [intercept, setIntercept] = React.useState(0);

  const svgMeshRef = React.useRef<{ exportSVG: () => string }>(null);

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1 className="app-title">SVG Gradient Mesh</h1>
          <p className="app-subtitle">Gradient mesh emulation using SVG Voronoi surfaces and advanced SVG filters. Create smooth color transitions and artistic effects through interactive point manipulation and real-time mesh generation.</p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <div className="demo-section">
            <div className="demo-content">
              <div className="mesh-container">
                <SvgMesh
                  ref={svgMeshRef}
                  points={points}
                  onPointsChange={setPoints}
                  onSelectedChange={setSelected}
                  width={480}
                  height={480}
                  stdDeviation={stdDeviation}
                  slope={slope}
                  intercept={intercept}
                  className="mesh-canvas"
                />
                <div className="mesh-instructions">
                  <p><strong>Click</strong> to add points</p>
                  <p><strong>Drag</strong> to move points</p>
                  <p><strong>Use sidebar</strong> to change colors</p>
                </div>
              </div>
              
              <div className="controls-container">
                <Controls
                  points={points}
                  selected={selected}
                  setSelected={setSelected}
                  stdDeviation={stdDeviation}
                  setStdDeviation={setStdDeviation}
                  setPoints={setPoints}
                  slope={slope}
                  setSlope={setSlope}  
                  intercept={intercept}
                  setIntercept={setIntercept}
                  svgMeshRef={svgMeshRef}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-links">
              <a href="https://github.com/tombigel/svg-mesh" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="https://github.com/tombigel/svg-mesh/issues" target="_blank" rel="noopener noreferrer">Issues</a>
            </div>
            <div className="footer-author">
              <span>Created by <a href="https://github.com/tombigel" target="_blank" rel="noopener noreferrer">Tom Bigelajzen</a></span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
