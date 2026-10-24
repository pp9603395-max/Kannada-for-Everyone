import React, { useEffect, useRef, useState } from 'react';

/**
 * GyroscopeCursor (React Bits Pro component specification)
 * A custom directional arrow cursor that smoothly rotates toward its vector of movement.
 * - Disabled on touch/coarse devices
 * - Non-blocking pointer events (pointer-events: none)
 * - Respects prefers-reduced-motion
 * - Auto-hides on interactive controls (buttons, links, inputs)
 */
export const GyroscopeCursor: React.FC<{
  color?: string;
  size?: number;
}> = ({ color = '#183B28', size = 28 }) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [isOverInteractive, setIsOverInteractive] = useState(false);

  // Motion physics state
  const pos = useRef({ x: -100, y: -100 });
  const prevPos = useRef({ x: -100, y: -100 });
  const currentAngle = useRef(0);
  const targetAngle = useRef(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Only enable on desktop pointer devices with fine precision and no reduced motion
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!finePointer || prefersReducedMotion) {
      setEnabled(false);
      return;
    }

    setEnabled(true);

    const handleMouseMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };

      // Check if hovering interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = !!target.closest(
          'a, button, input, select, textarea, [role="button"], label, .interactive-cursor'
        );
        setIsOverInteractive(isInteractive);
      }
    };

    const handleMouseLeave = () => {
      pos.current = { x: -100, y: -100 };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // Smooth animation loop for rotation and tracking
    const updatePhysics = () => {
      const dx = pos.current.x - prevPos.current.x;
      const dy = pos.current.y - prevPos.current.y;
      const distance = Math.hypot(dx, dy);

      if (distance > 1.5) {
        // Calculate angle of movement in degrees
        let rad = Math.atan2(dy, dx);
        let deg = (rad * 180) / Math.PI + 90; // Align arrow tip with direction

        // Normalize angle difference for shortest angular interpolation
        let diff = (deg - currentAngle.current) % 360;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;

        targetAngle.current = currentAngle.current + diff;
        prevPos.current = { x: pos.current.x, y: pos.current.y };
      }

      // Smooth damping (spring/lerp)
      currentAngle.current += (targetAngle.current - currentAngle.current) * 0.18;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%) rotate(${currentAngle.current}deg)`;
      }

      rafId.current = requestAnimationFrame(updatePhysics);
    };

    rafId.current = requestAnimationFrame(updatePhysics);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-50 transition-opacity duration-200"
      style={{
        opacity: pos.current.x < 0 || isOverInteractive ? 0 : 0.85,
        willChange: 'transform, opacity',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-md"
      >
        {/* Dynamic Gyroscope Directional Arrow */}
        <polygon
          points="12,2 22,21 12,16 2,21"
          fill={color}
          stroke="#FAF7F2"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="2.5" fill="#E07A5F" />
      </svg>
    </div>
  );
};
export default GyroscopeCursor;
