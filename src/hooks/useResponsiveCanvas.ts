import { useState, useEffect, type RefObject } from "react";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../constants/game";

/* ========================================
   useResponsiveCanvas Hook
   Dynamically calculates canvas display dimensions
   to fill the container while maintaining aspect ratio.
   ======================================== */

/** Padding from container edges in pixels */
const CONTAINER_PADDING = 16;

/** Canvas aspect ratio (width / height) */
const ASPECT_RATIO = CANVAS_WIDTH / CANVAS_HEIGHT;

interface ResponsiveSize {
  /** CSS display width in pixels */
  displayWidth: number;
  /** CSS display height in pixels */
  displayHeight: number;
}

/**
 * Custom hook that calculates responsive canvas dimensions.
 * Uses ResizeObserver for efficient size tracking.
 * Maintains the game's native aspect ratio (2:3).
 *
 * @param containerRef - Reference to the parent container element
 * @returns Optimal display dimensions for the canvas
 */
export const useResponsiveCanvas = (
  containerRef: RefObject<HTMLDivElement | null>
): ResponsiveSize => {
  const [size, setSize] = useState<ResponsiveSize>({
    displayWidth: CANVAS_WIDTH,
    displayHeight: CANVAS_HEIGHT,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const calculateSize = () => {
      const maxWidth = container.clientWidth - CONTAINER_PADDING * 2;
      const maxHeight = container.clientHeight - CONTAINER_PADDING * 2;

      let width: number;
      let height: number;

      if (maxWidth / maxHeight > ASPECT_RATIO) {
        /* Container is wider than needed — height is the limiting factor */
        height = maxHeight;
        width = height * ASPECT_RATIO;
      } else {
        /* Container is taller than needed — width is the limiting factor */
        width = maxWidth;
        height = width / ASPECT_RATIO;
      }

      setSize({
        displayWidth: Math.floor(Math.max(width, 0)),
        displayHeight: Math.floor(Math.max(height, 0)),
      });
    };

    const observer = new ResizeObserver(calculateSize);
    observer.observe(container);

    return () => observer.disconnect();
  }, [containerRef]);

  return size;
};
