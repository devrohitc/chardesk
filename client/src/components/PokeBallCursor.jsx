import React, { useEffect, useRef, useCallback } from 'react';

// ─── Jigglypuff glitter colours ───────────────────────────────────────────────
const GLITTER_COLORS = [
  '#ff9ed2', '#ff6eb4', '#ffb3e6', '#ff4da6',  // pinks
  '#c084fc', '#e879f9', '#f0abfc', '#d946ef',  // purples
  '#fde68a', '#fbbf24', '#fff9c4',              // gold shimmer
  '#ffffff', '#f9a8d4',                          // white & soft pink
];

// ─── Sparkle shapes ───────────────────────────────────────────────────────────
const SHAPES = ['✦', '✧', '★', '♪', '♫', '◆', '·', '✿'];

let glitterIdCounter = 0;

export default function PokeBallCursor() {
  const ballRef = useRef(null);
  const ballPos = useRef({ x: -100, y: -100 });
  const mousePos = useRef({ x: -100, y: -100 });
  const rafRef = useRef(null);
  const containerRef = useRef(null);
  const lastSparkleTime = useRef(0);

  // ─── Smooth-follow animation loop ───────────────────────────────────────────
  const animate = useCallback(() => {
    const ball = ballRef.current;
    if (!ball) return;

    // Lerp the ball toward the mouse (lag factor = 0.13 → feels floaty)
    ballPos.current.x += (mousePos.current.x - ballPos.current.x) * 0.13;
    ballPos.current.y += (mousePos.current.y - ballPos.current.y) * 0.13;

    ball.style.transform = `translate(${ballPos.current.x - 18}px, ${ballPos.current.y - 18}px)`;

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  // ─── Spawn one glitter particle ─────────────────────────────────────────────
  const spawnGlitter = useCallback((x, y) => {
    const container = containerRef.current;
    if (!container) return;

    const el = document.createElement('span');
    el.className = 'pkball-glitter';
    el.textContent = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    el.style.cssText = `
      left: ${x}px;
      top: ${y}px;
      color: ${GLITTER_COLORS[Math.floor(Math.random() * GLITTER_COLORS.length)]};
      font-size: ${8 + Math.random() * 14}px;
      --dx: ${(Math.random() - 0.5) * 70}px;
      --dy: ${-30 - Math.random() * 60}px;
      --rot: ${(Math.random() - 0.5) * 360}deg;
    `;

    container.appendChild(el);

    // Remove after animation ends (600ms)
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }, []);

  // ─── Mouse move handler ──────────────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      const now = performance.now();
      if (now - lastSparkleTime.current > 35) {
        // Burst 2-3 glitters slightly spread around the cursor
        const burst = 2 + Math.floor(Math.random() * 2);
        for (let i = 0; i < burst; i++) {
          spawnGlitter(
            e.clientX + (Math.random() - 0.5) * 20,
            e.clientY + (Math.random() - 0.5) * 20,
          );
        }
        lastSparkleTime.current = now;
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [animate, spawnGlitter]);

  return (
    <>
      {/* Glitter particle container – fixed, full-screen, pointer-none */}
      <div
        ref={containerRef}
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 99998,
          overflow: 'hidden',
        }}
      />

      {/* Pokéball SVG follower */}
      <div
        ref={ballRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          pointerEvents: 'none',
          zIndex: 99999,
          willChange: 'transform',
          filter: 'drop-shadow(0 0 6px #ff9ed2) drop-shadow(0 0 2px #fff)',
        }}
      >
        <svg
          viewBox="0 0 36 36"
          width="36"
          height="36"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block' }}
        >
          {/* Top half – red */}
          <path d="M18 2 A16 16 0 0 1 34 18 L22 18 A4 4 0 0 0 14 18 L2 18 A16 16 0 0 1 18 2Z" fill="#e63946" />
          {/* Bottom half – white */}
          <path d="M18 34 A16 16 0 0 1 2 18 L14 18 A4 4 0 0 0 22 18 L34 18 A16 16 0 0 1 18 34Z" fill="#f8f9fa" />
          {/* Dividing band */}
          <line x1="2" y1="18" x2="34" y2="18" stroke="#212529" strokeWidth="2.5" />
          {/* Outer ring of centre button */}
          <circle cx="18" cy="18" r="5" fill="#212529" />
          {/* Inner button */}
          <circle cx="18" cy="18" r="3" fill="#f8f9fa" />
          {/* Shine */}
          <circle cx="12" cy="10" r="2.5" fill="white" opacity="0.35" />
        </svg>
      </div>

      {/* Keyframe styles injected once */}
      <style>{`
        .pkball-glitter {
          position: absolute;
          display: inline-block;
          pointer-events: none;
          line-height: 1;
          animation: pkGlitter 0.65s ease-out forwards;
          transform-origin: center;
        }

        @keyframes pkGlitter {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) rotate(0deg) scale(1);
          }
          60% {
            opacity: 0.8;
            transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) rotate(var(--rot)) scale(1.2);
          }
          100% {
            opacity: 0;
            transform: translate(calc(-50% + var(--dx) * 1.4), calc(-50% + var(--dy) * 1.3)) rotate(calc(var(--rot) * 1.5)) scale(0.3);
          }
        }
      `}</style>
    </>
  );
}

