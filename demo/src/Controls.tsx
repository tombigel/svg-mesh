import React from "react";
import { Point } from "../../src/types";

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
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newPoints = [...points]
      const point = points[selected];
      point.color = event.target.value;
      newPoints.splice(selected, 1, point);
      setPoints(newPoints);
    },
    [points, selected, setPoints]
  );
  const handleDelete = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
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
    (event: React.FormEvent<HTMLInputElement>) => {
      setStdDeviation(+(event.target as HTMLInputElement).value);
    },
    [setStdDeviation]
  );

  const handleSlope = React.useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      setSlope(+(event.target as HTMLInputElement).value);
    },
    [setSlope]
  );

  const handleIntercept = React.useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
        setIntercept(+(event.target as HTMLInputElement).value);
    },
    [setIntercept]
  );

  const point = points[selected];
  return (
    <div className="controls-panel">
      <div className="control-section">
        <h3 className="control-title">Point Controls</h3>
        <div className="control-group">
          <label className="control-label">
            <span className="label-text">Color</span>
            <div className="color-input-wrapper">
              <input 
                type="color" 
                value={point?.color} 
                onChange={handleColor}
                className="color-input"
              />
              <span className="color-value">{point?.color}</span>
            </div>
          </label>
        </div>
        <div className="control-group">
          <button 
            onClick={handleDelete}
            className="btn btn-danger"
            disabled={points.length <= 1}
          >
            Delete Point
          </button>
          <span className="help-text">
            {points.length <= 1 ? "At least one point required" : `Point ${selected + 1} of ${points.length}`}
          </span>
        </div>
      </div>

      <div className="control-section">
        <h3 className="control-title">Filter Effects</h3>
        
        <div className="control-group">
          <label className="control-label">
            <span className="label-text">Blur Intensity</span>
            <div className="range-input-wrapper">
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={stdDeviation}
                onInput={handleDeviation}
                className="range-input"
              />
              <span className="range-value">{stdDeviation}</span>
            </div>
          </label>
        </div>

        <div className="control-group">
          <label className="control-label">
            <span className="label-text">Color Slope</span>
            <div className="range-input-wrapper">
              <input
                type="range"
                min={-4}
                max={4}
                step={0.1}
                value={slope}
                onInput={handleSlope}
                className="range-input"
              />
              <span className="range-value">{slope}</span>
            </div>
          </label>
        </div>

        <div className="control-group">
          <label className="control-label">
            <span className="label-text">Color Intercept</span>
            <div className="range-input-wrapper">
              <input
                type="range"
                min={-4}
                max={4}
                step={0.01}
                value={intercept}
                onInput={handleIntercept}
                className="range-input"
              />
              <span className="range-value">{intercept.toFixed(2)}</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
