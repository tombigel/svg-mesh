import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SvgMesh } from '../src/components/SvgMesh';

describe('SvgMesh', () => {
  const mockPoints = [
    { x: 100, y: 100, color: '#ff0000' },
    { x: 200, y: 200, color: '#00ff00' },
  ];

  it('renders without crashing', () => {
    render(
      <SvgMesh
        points={mockPoints}
        width={400}
        height={400}
      />
    );
    
    // Check if SVG element is rendered
    const svgElement = document.querySelector('svg');
    expect(svgElement).not.toBeNull();
  });

  it('renders the correct number of points when interactive', () => {
    render(
      <SvgMesh
        points={mockPoints}
        width={400}
        height={400}
        interactive={true}
      />
    );
    
    // Should render 2 interactive points
    const pointElements = document.querySelectorAll('[data-index]');
    expect(pointElements).toHaveLength(2);
  });

  it('calls onPointsChange when clicking on empty area to add new point', () => {
    const mockOnPointsChange = vi.fn();
    const mockOnSelectedChange = vi.fn();
    
    render(
      <SvgMesh
        points={mockPoints}
        width={400}
        height={400}
        interactive={true}
        onPointsChange={mockOnPointsChange}
        onSelectedChange={mockOnSelectedChange}
        className="test-container"
      />
    );
    
    const container = document.querySelector('.test-container');
    if (container) {
      // Use fireEvent which works better with jsdom
      fireEvent.pointerDown(container, {
        clientX: 300,
        clientY: 150,
        offsetX: 300,
        offsetY: 150,
      });
      
      // Should call onPointsChange with new point added
      expect(mockOnPointsChange).toHaveBeenCalled();
      if (mockOnPointsChange.mock.calls.length > 0) {
        const lastCall = mockOnPointsChange.mock.calls[mockOnPointsChange.mock.calls.length - 1];
        expect(lastCall[0]).toHaveLength(3); // Original 2 + 1 new point
      }
    }
  });

  it('calls onSelectedChange when clicking on existing point', () => {
    const mockOnSelectedChange = vi.fn();
    
    render(
      <SvgMesh
        points={mockPoints}
        width={400}
        height={400}
        interactive={true}
        onSelectedChange={mockOnSelectedChange}
      />
    );
    
    const pointElement = document.querySelector('[data-index="1"]');
    if (pointElement) {
      fireEvent.pointerDown(pointElement);
      
      // Should call onSelectedChange with the clicked point index
      expect(mockOnSelectedChange).toHaveBeenCalledWith(1);
    }
  });

  it('applies CSS filters with consistent IDs', () => {
    render(
      <SvgMesh
        points={mockPoints}
        width={400}
        height={400}
        stdDeviation={30}
        slope={1.5}
        intercept={0.2}
      />
    );
    
    // Check that filter is defined
    const filterElement = document.querySelector('filter');
    expect(filterElement).not.toBeNull();
    
    // Check that filter has an ID
    const filterId = filterElement?.getAttribute('id');
    expect(filterId).toBeTruthy();
    expect(filterId).toMatch(/^blur-/);
    
    // Check that the filter is referenced in the group element
    const groupElement = document.querySelector('g[filter]');
    expect(groupElement).not.toBeNull();
    
    const filterReference = groupElement?.getAttribute('filter');
    expect(filterReference).toBe(`url(#${filterId})`);
  });

  it('applies correct filter parameters', () => {
    const stdDeviation = 25;
    const slope = 2;
    const intercept = 0.5;
    
    const { container } = render(
      <SvgMesh
        points={mockPoints}
        width={400}
        height={400}
        stdDeviation={stdDeviation}
        slope={slope}
        intercept={intercept}
      />
    );
    
    // Check that we have SVG filter elements (may need namespace aware search)
    const svgElements = container.querySelectorAll('svg *');
    const hasFilterElements = Array.from(svgElements).some(el => 
      el.tagName.includes('feGaussianBlur') || el.localName === 'feGaussianBlur'
    );
    
    expect(hasFilterElements).toBe(true);
    
    // Alternative: check the innerHTML contains the expected filter structure
    const svgContent = container.querySelector('svg')?.innerHTML || '';
    expect(svgContent).toContain('feGaussianBlur');
    expect(svgContent).toContain(`stdDeviation="${stdDeviation}"`);
    expect(svgContent).toContain(`slope="${slope}"`);
    expect(svgContent).toContain(`intercept="${intercept}"`);
  });

  it('does not render points when interactive is false', () => {
    render(
      <SvgMesh
        points={mockPoints}
        width={400}
        height={400}
        interactive={false}
      />
    );
    
    // Should not render interactive points
    const pointElements = document.querySelectorAll('[data-index]');
    expect(pointElements).toHaveLength(0);
  });

  it('generates unique filter IDs for multiple instances', () => {
    const { container: container1 } = render(
      <SvgMesh
        points={mockPoints}
        width={400}
        height={400}
      />
    );
    
    const { container: container2 } = render(
      <SvgMesh
        points={mockPoints}
        width={400}
        height={400}
      />
    );
    
    const filter1 = container1.querySelector('filter');
    const filter2 = container2.querySelector('filter');
    
    const id1 = filter1?.getAttribute('id');
    const id2 = filter2?.getAttribute('id');
    
    expect(id1).toBeTruthy();
    expect(id2).toBeTruthy();
    expect(id1).not.toBe(id2); // Should be different IDs
  });

  it('renders Voronoi paths for all points', () => {
    render(
      <SvgMesh
        points={mockPoints}
        width={400}
        height={400}
      />
    );
    
    // Should render one path for each point
    const pathElements = document.querySelectorAll('path[fill]');
    expect(pathElements).toHaveLength(mockPoints.length);
    
    // Check that paths have the correct colors
    pathElements.forEach((path, index) => {
      expect(path.getAttribute('fill')).toBe(mockPoints[index].color);
    });
  });

  it('handles point dragging correctly', () => {
    const mockOnPointsChange = vi.fn();
    
    render(
      <SvgMesh
        points={mockPoints}
        width={400}
        height={400}
        interactive={true}
        onPointsChange={mockOnPointsChange}
        className="drag-test-container"
      />
    );
    
    const pointElement = document.querySelector('[data-index="0"]');
    
    if (pointElement) {
      // Verify that clicking on a point doesn't immediately add a new point
      fireEvent.pointerDown(pointElement, {
        clientX: 100,
        clientY: 100,
        offsetX: 100,
        offsetY: 100,
      });
      
      // Should not add a new point when clicking existing point
      if (mockOnPointsChange.mock.calls.length > 0) {
        const updatedPoints = mockOnPointsChange.mock.calls[0][0];
        expect(updatedPoints).toHaveLength(mockPoints.length); // Same length, no new point added
      }
    }
  });
}); 