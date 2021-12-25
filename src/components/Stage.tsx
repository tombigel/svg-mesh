import React, { SyntheticEvent } from "react";
import { Point } from "../types";
import { clamp } from "../utils";
import { Delaunay } from "d3-delaunay";

const getCalculatedOffsets = (
  event: SyntheticEvent<HTMLElement, PointerEvent>
): { offsetX: number; offsetY: number } => {
  const offset = {
    offsetX: event.nativeEvent.offsetX,
    offsetY: event.nativeEvent.offsetY,
  };
  if (event.target !== event.currentTarget) {
    const targetRect = (event.target as HTMLElement).getBoundingClientRect();
    const containerRect = (
      event.currentTarget as HTMLElement
    ).getBoundingClientRect();
    offset.offsetX += targetRect.left - containerRect.left;
    offset.offsetY += targetRect.top - containerRect.top;
  }
  return offset;
};

export const Stage = ({
  points,
  setPoints,
  selected,
  setSelected,
  width,
  height,
  stdDeviation,
  slope,
  intercept,
}: {
  points: Point[];
  setPoints: (points: Point[]) => void;
  selected: number;
  setSelected: (selected: number) => void;
  width: number;
  height: number;
  stdDeviation: number;
  slope: number;
  intercept: number;
}) => {
  // Selected change has to be sync
  const selectedMemo = React.useRef(selected);
  // But still update when async selected is updated
  React.useEffect(() => {
    selectedMemo.current = selected;
  }, [selected]);
  const [showColorPicker, setShowColorPicker] = React.useState<{
    top: number;
    left: number;
  } | null>(null);
  const voronoi = Delaunay.from(
    points,
    (p) => p.x,
    (p) => p.y
  ).voronoi([0, 0, width, height]);
  const paths = points.map((p, i) => voronoi.renderCell(i));

  const handleMove = React.useCallback(
    (event: PointerEvent) => {
      const { offsetX, offsetY } = event;
      const newPoints = [...points];
      newPoints.splice(selectedMemo.current, 1, {
        x: clamp(0, width, offsetX),
        y: clamp(0, height, offsetY),
        color: points[selectedMemo.current]?.color || points[selected].color,
      });
      setPoints(newPoints);
    },
    [height, points, selected, setPoints, width]
  );

  const handleDown = React.useCallback(
    (event: SyntheticEvent<HTMLElement, PointerEvent>) => {
      const { offsetX, offsetY } = getCalculatedOffsets(event);
      const element = event.target;
      const container = event.currentTarget;

      if (showColorPicker) {
        setShowColorPicker(null);
      }
      if (element === container) {
        const color = points[selected].color;
        selectedMemo.current = points.length;
        setSelected(selectedMemo.current);

        setPoints([...points, { x: offsetX, y: offsetY, color }]);
      } else {
        const { index = "0" } = (element as HTMLElement).dataset;
        selectedMemo.current = +index;
        setSelected(selectedMemo.current);
      }

      container.addEventListener("pointermove", handleMove);
      container.addEventListener(
        "pointerup",
        function handleUp(e: PointerEvent) {
          container.removeEventListener("pointermove", handleMove);
          container.removeEventListener("pointerup", handleUp);
        }
      );

      container.setPointerCapture(event.nativeEvent.pointerId);
    },
    [handleMove, points, selected, setPoints, setSelected, showColorPicker]
  );

  return (
    <div id="stage" onPointerDown={handleDown} style={{ width, height }}>
      <svg
        viewBox="0 0 400 400"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="blur">
            <feGaussianBlur
              in="SourceGraphic"
              result="Blurred"
              stdDeviation={stdDeviation}
            />
            <feComponentTransfer in="Blurred" result="NonBlurred">
            <feFuncR type="linear" slope={slope} intercept={intercept} />
              <feFuncG type="linear" slope={slope} intercept={intercept} />
              <feFuncB type="linear" slope={slope} intercept={intercept} />
              <feFuncA type="discrete" tableValues="1.0" />
            </feComponentTransfer>
          </filter>
        </defs>
        <g filter="url(#blur)">
          {paths.map((path, index) => (
            <path key={`path-${index}`} d={path} fill={points[index].color} />
          ))}
        </g>
      </svg>
      {points.map((point, index) => (
        <div
          className="point"
          key={`point-${index}`}
          data-index={index}
          data-selected={index === selectedMemo.current || undefined}
          style={{ left: `${point.x}px`, top: `${point.y}px` }}
        ></div>
      ))}
    </div>
  );
};
