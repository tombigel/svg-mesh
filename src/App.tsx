import React from "react";
import "./App.css";
import { Controls } from "./components/Controls";
import { Stage } from "./components/Stage";

function App() {
  const [points, setPoints] = React.useState([
    { x: 200, y: 200, color: "#FF0000" },
  ]);
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
