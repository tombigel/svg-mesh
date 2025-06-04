import React, { SyntheticEvent } from "react";
import { SvgMeshProps } from "../types";
import { clamp } from "../utils";
import { Delaunay } from "d3-delaunay";

const getCalculatedOffsets = (
  event: SyntheticEvent<HTMLElement, PointerEvent>,
  container: HTMLElement
): { offsetX: number; offsetY: number } => {
  const containerRect = container.getBoundingClientRect();
  const offsetX = event.nativeEvent.clientX - containerRect.left;
  const offsetY = event.nativeEvent.clientY - containerRect.top;
  return { offsetX, offsetY };
};

export const SvgMesh = React.forwardRef<
  { exportSVG: () => string },
  SvgMeshProps
>(({
  points,
  width,
  height,
  stdDeviation = 40,
  slope = 1,
  intercept = 0,
  interactive = true,
  onPointsChange,
  onSelectedChange,
  className,
  style,
}, ref) => {
  const [selected, setSelected] = React.useState(0);
  const selectedMemo = React.useRef(selected);
  
  React.useEffect(() => {
    selectedMemo.current = selected;
    onSelectedChange?.(selected);
  }, [selected, onSelectedChange]);

  const voronoi = Delaunay.from(
    points,
    (p) => p.x,
    (p) => p.y
  ).voronoi([0, 0, width, height]);
  
  const paths = points.map((_p, i) => voronoi.renderCell(i));

  const handleMove = React.useCallback(
    (event: PointerEvent) => {
      if (!interactive || !onPointsChange) return;
      
      // Use the same reliable coordinate calculation
      const container = event.currentTarget as HTMLElement;
      const containerRect = container.getBoundingClientRect();
      const offsetX = event.clientX - containerRect.left;
      const offsetY = event.clientY - containerRect.top;
      
      const newPoints = [...points];
      newPoints.splice(selectedMemo.current, 1, {
        x: clamp(0, width, offsetX),
        y: clamp(0, height, offsetY),
        color: points[selectedMemo.current]?.color || points[selected].color,
      });
      onPointsChange(newPoints);
    },
    [height, points, selected, onPointsChange, width, interactive]
  );

  const handleDown = React.useCallback(
    (event: SyntheticEvent<HTMLElement, PointerEvent>) => {
      if (!interactive) return;
      
      const { offsetX, offsetY } = getCalculatedOffsets(event, event.currentTarget as HTMLElement);
      const element = event.target as HTMLElement;
      const container = event.currentTarget;

      // Check if we clicked on a point element or its children (more reliable detection)
      let pointElement = element;
      while (pointElement && pointElement !== container) {
        if (pointElement.hasAttribute('data-index')) {
          break;
        }
        pointElement = pointElement.parentElement as HTMLElement;
      }
      
      const isPointElement = pointElement && pointElement.hasAttribute('data-index');
      
      if (isPointElement) {
        // Select existing point
        const { index = "0" } = pointElement.dataset;
        const newSelected = +index;
        selectedMemo.current = newSelected;
        setSelected(newSelected);
      } else {
        // Add new point (clicked on empty area - container, SVG, or paths)
        const color = points[selected]?.color || '#000000';
        const newIndex = points.length;
        selectedMemo.current = newIndex;
        setSelected(newIndex);
        onPointsChange?.([...points, { x: offsetX, y: offsetY, color }]);
      }

      if (!onPointsChange) return;

      container.addEventListener("pointermove", handleMove);
      container.addEventListener(
        "pointerup",
        function handleUp(_e: PointerEvent) {
          container.removeEventListener("pointermove", handleMove);
          container.removeEventListener("pointerup", handleUp);
        }
      );

      container.setPointerCapture && container.setPointerCapture(event.nativeEvent.pointerId);
    },
    [handleMove, points, selected, onPointsChange, interactive]
  );

  const handleDoubleClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!interactive || !onPointsChange) return;
      
      const element = event.target as HTMLElement;
      if (!element.hasAttribute('data-index')) return;
      
      const { index = "0" } = element.dataset;
      const pointIndex = +index;
      
      // Create a temporary input element to trigger the color picker
      const colorInput = document.createElement('input');
      colorInput.type = 'color';
      colorInput.value = points[pointIndex].color;
      colorInput.style.position = 'absolute';
      colorInput.style.left = '-9999px';
      colorInput.style.opacity = '0';
      colorInput.style.pointerEvents = 'none';
      
      document.body.appendChild(colorInput);
      
      colorInput.addEventListener('change', (e) => {
        const newColor = (e.target as HTMLInputElement).value;
        const newPoints = [...points];
        newPoints[pointIndex] = { ...newPoints[pointIndex], color: newColor };
        onPointsChange(newPoints);
        document.body.removeChild(colorInput);
      });
      
      colorInput.addEventListener('blur', () => {
        // Clean up if user cancels
        if (document.body.contains(colorInput)) {
          document.body.removeChild(colorInput);
        }
      });
      
      // Trigger the color picker
      colorInput.click();
      colorInput.focus();
    },
    [points, onPointsChange, interactive]
  );

  const meshStyles: React.CSSProperties = {
    position: 'relative',
    width,
    height,
    cursor: interactive ? 'crosshair' : 'default',
    ...style,
  };

  const pointStyles: React.CSSProperties = {
    position: 'absolute',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    border: '2px solid #0d6efd',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.8)',
    transform: 'translate(-50%, -50%)',
    cursor: interactive ? 'move' : 'default',
    pointerEvents: interactive ? 'auto' : 'none',
    padding: '4px',
    margin: '-4px',
    zIndex: 5,
  };

  const selectedPointStyles: React.CSSProperties = {
    ...pointStyles,
    width: '14px',
    height: '14px',
    backgroundColor: '#0d6efd',
    border: '3px solid #ffffff',
    boxShadow: '0 0 0 2px #0d6efd, 0 4px 12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.9)',
    zIndex: 10,
    transform: 'translate(-50%, -50%) scale(1.1)',
    cursor: interactive ? 'move' : 'default',
  };

  // Generate a consistent filter ID
  const filterId = React.useMemo(() => `blur-${crypto.randomUUID()}`, []);

  // Export utility function
  const exportSVG = React.useCallback(() => {
    const svgContent = `<svg viewBox="0 0 ${width} ${height}" width="100%" height="100%" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="${filterId}">
      <feConvolveMatrix order="3" kernelMatrix="0 0 0 0 1 0 0 1 0"/>
      <feGaussianBlur in="SourceGraphic" result="Blurred" stdDeviation="${stdDeviation}"/>
      <feComponentTransfer in="Blurred" result="NonBlurred">
        <feFuncR type="linear" slope="${slope}" intercept="${intercept}"/>
        <feFuncG type="linear" slope="${slope}" intercept="${intercept}"/>
        <feFuncB type="linear" slope="${slope}" intercept="${intercept}"/>
        <feFuncA type="discrete" tableValues="1"/>
      </feComponentTransfer>
    </filter>
  </defs>
  <g filter="url(#${filterId})">
${paths.map((path, index) => `    <path d="${path}" fill="${points[index]?.color || '#000000'}"/>`).join('\n')}
  </g>
</svg>`;
    
    return svgContent;
  }, [width, height, filterId, stdDeviation, slope, intercept, paths, points]);

  // Expose export function via ref
  React.useImperativeHandle(ref, () => ({
    exportSVG
  }), [exportSVG]);

  return (
    <div 
      className={className}
      style={meshStyles}
      onPointerDown={interactive ? handleDown : undefined}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id={filterId}>
            <feConvolveMatrix 
              order="3" 
              kernelMatrix="0 0 0 0 1 0 0 1 0"
            />
            <feGaussianBlur
              in="SourceGraphic"
              result="Blurred"
              stdDeviation={stdDeviation}
            />
            <feComponentTransfer in="Blurred" result="NonBlurred">
              <feFuncR type="linear" slope={slope} intercept={intercept} />
              <feFuncG type="linear" slope={slope} intercept={intercept} />
              <feFuncB type="linear" slope={slope} intercept={intercept} />
              <feFuncA type="discrete" tableValues="1" />
            </feComponentTransfer>
          </filter>
        </defs>
        <g filter={`url(#${filterId})`}>
          {paths.map((path, index) => (
            <path key={`path-${index}`} d={path} fill={points[index]?.color || '#000000'} />
          ))}
        </g>
      </svg>
      {interactive && points.map((point, index) => (
        <div
          key={`point-${index}`}
          data-index={index}
          onDoubleClick={handleDoubleClick}
          style={{
            ...(index === selected ? selectedPointStyles : pointStyles),
            left: `${point.x}px`,
            top: `${point.y}px`,
          }}
        />
      ))}
    </div>
  );
}); 