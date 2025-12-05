import React, { useEffect, useRef, useState } from 'react';

const ORANGE = '#fb923c';
const ORANGE_LIGHT = '#fdba74';
const ORANGE_DARK = '#ea580c';

const CustomCursor: React.FC = () => {
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const mouse = useRef({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const idRef = useRef<number>(0);

  useEffect(() => {
    const updateMouse = (e: MouseEvent) => {
      mouse.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    const animate = () => {
      setPosition(prev => {
        const lerp = isClicking ? 0.25 : 0.15;
        return {
          x: prev.x + (mouse.current.x - prev.x) * lerp,
          y: prev.y + (mouse.current.y - prev.y) * lerp,
        };
      });
      rafRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', updateMouse);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', updateMouse);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isClicking]);

  useEffect(() => {
    const handleMouseDown = () => {
      setIsClicking(true);
      const newRipple = {
        x: mouse.current.x,
        y: mouse.current.y,
        id: idRef.current++,
      };
      setRipples(prev => [...prev, newRipple]);
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 500);
    };

    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.style.cursor === 'pointer' ||
        target.closest('a') ||
        target.closest('button')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      {/* Main orb */}
      <div
        className="fixed pointer-events-none"
        style={{
          left: position.x - 12,
          top: position.y - 12,
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: isHovering ? ORANGE_DARK : ORANGE,
          boxShadow: `0 0 20px 8px ${ORANGE}50, 0 0 40px 16px ${ORANGE}30`,
          transform: isClicking
            ? 'scale(0.7)'
            : isHovering
              ? 'scale(1.5)'
              : 'scale(1)',
          transition: 'transform 0.2s ease, background 0.3s, box-shadow 0.3s',
          zIndex: 9999,
          animation: isHovering ? 'pulseGlow 1.2s infinite' : 'pulseSoft 2s infinite',
        }}
      />

      {/* Trail blur */}
      <div
        className="fixed pointer-events-none"
        style={{
          left: position.x - 10,
          top: position.y - 10,
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${ORANGE_LIGHT}50 0%, transparent 70%)`,
          filter: 'blur(6px)',
          opacity: 0.6,
          transform: isHovering ? 'scale(1.8)' : 'scale(1)',
          transition: 'transform 0.25s ease-out',
          zIndex: 9998,
        }}
      />

      {/* Ripple effects on click */}
      {ripples.map(r => (
        <div
          key={r.id}
          className="fixed pointer-events-none"
          style={{
            left: r.x - 15,
            top: r.y - 15,
            width: 30,
            height: 30,
            borderRadius: '50%',
            border: `2px solid ${ORANGE_DARK}`,
            transform: 'scale(1)',
            animation: 'ripple 0.5s ease-out forwards',
            zIndex: 9997,
          }}
        />
      ))}

      <style>{`
        body {
          cursor: none;
        }
        @keyframes pulseGlow {
          0%, 100% {
            transform: scale(1.5);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.8);
            opacity: 1;
          }
        }
        @keyframes pulseSoft {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }
        @keyframes ripple {
          0% {
            opacity: 0.8;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(2);
          }
        }
      `}</style>
    </>
  );
};

export default CustomCursor;
