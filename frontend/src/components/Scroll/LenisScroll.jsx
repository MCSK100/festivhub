import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

/**
 * LenisScroll Component
 * Provides smooth scrolling experience using Lenis
 * Wraps the entire application for global smooth scroll
 */
const LenisScroll = ({ children }) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Animation loop
    let lastTime = Date.now();
    const raf = (time) => {
      lenis.raf(time - lastTime);
      lastTime = time;
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};

export default LenisScroll;
