export type Point = { x: number, y: number, color: string };

export interface SvgMeshProps {
  points: Point[];
  width: number;
  height: number;
  stdDeviation?: number;
  slope?: number;
  intercept?: number;
  interactive?: boolean;
  onPointsChange?: (points: Point[]) => void;
  onSelectedChange?: (selected: number) => void;
  className?: string;
  style?: React.CSSProperties;
}
