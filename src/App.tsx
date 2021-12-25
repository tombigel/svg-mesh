import React from "react";
import "./App.css";
import { Controls } from "./components/Controls";
import { Stage } from "./components/Stage";

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
  return (
    <div id="main">
      <Controls
        points={points}
        setPoints={setPoints}
        selected={selected}
        setSelected={setSelected}
        stdDeviation={stdDeviation}
        setStdDeviation={setStdDeviation}
        slope={slope}
        intercept={intercept}
        setSlope={setSlope}
        setIntercept={setIntercept}
      />
      <Stage
        points={points}
        setPoints={setPoints}
        selected={selected}
        setSelected={setSelected}
        stdDeviation={stdDeviation}
        width={400}
        height={400}
        slope={slope}
        intercept={intercept}
      />
      <a id="project-link" href="https://github.com/tombigel/svg-mesh">https://github.com/tombigel/svg-mesh</a>
    </div>
  );
}

export default App;
