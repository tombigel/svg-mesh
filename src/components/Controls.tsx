import React from "react";
import { Point } from "../types";

export const Controls = ({
  points,
  selected,
  setSelected,
  stdDeviation,
  setStdDeviation,
  setPoints,
  slope,
  setSlope,
  intercept,
  setIntercept,
}: {
  points: Point[];
  selected: number;
  setSelected: (value: number) => void;
  stdDeviation: number;
  setStdDeviation: (value: number) => void;
  setPoints: (value: Point[]) => void;
  slope: number;
  setSlope: (value: number) => void;
  intercept: number;
  setIntercept: (value: number) => void;

}) => {
  const handleColor = React.useCallback(
    (event) => {
      const newPoints = [...points]
      const point = points[selected];
      point.color = event.target.value;
      newPoints.splice(selected, 1, point);
      setPoints(newPoints);
    },
    [points, selected, setPoints]
  );
  const handleDelete = React.useCallback(
    (event) => {
      if (points.length > 1) {
        const newPoints = [...points]
        newPoints.splice(selected, 1);
        setPoints(newPoints);
        setSelected(selected - 1 || 0);
      }
    },
    [points, selected, setPoints, setSelected]
  );
  const handleDeviation = React.useCallback(
    (event) => {
      setStdDeviation(+event.target.value);
    },
    [setStdDeviation]
  );

  const handleSlope = React.useCallback(
    (event) => {
      setSlope(+event.target.value);
    },
    [setSlope]
  );

  const handleIntercept = React.useCallback(
    (event) => {
        setIntercept(+event.target.value);
    },
    [setIntercept]
  );

  const point = points[selected];
  return (
    <div id="controls">
      <h2>Selected Point</h2>
      <input type="color" value={point?.color} onChange={handleColor} />
      &nbsp;&nbsp;
      <button onClick={handleDelete}>Delete</button>
      <h2>General</h2>
      <label>
        <span>stdDeviation</span>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={stdDeviation}
          onInput={handleDeviation}
        /> {stdDeviation}
      </label>
      <label>
      <span>Slope</span>
        <input
          type="range"
          min={-4}
          max={4}
          step={0.1}
          value={slope}
          onInput={handleSlope}
        /> {slope}
      </label>
      <label>
      <span>Intercept</span>
        <input
          type="range"
          min={-4}
          max={4}
          step={0.1}
          value={intercept}
          onInput={handleIntercept}
        /> {intercept}
      </label>
    </div>
  );
};
