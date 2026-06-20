import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * Text Reveal Animation
 * Animates text with character-by-character reveal effect
 */
export const textRevealAnimation = (element, options = {}) => {
  const defaults = {
    duration: 0.8,
    stagger: 0.02,
    delay: 0,
    ease: 'power2.out',
  };

  const config = { ...defaults, ...options };

  if (!element) return;

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      end: 'top 20%',
      scrub: false,
      markers: false,
    },
  });

  timeline.fromTo(
    element,
    {
      opacity: 0,
      y: 30,
    },
    {
      opacity: 1,
      y: 0,
      duration: config.duration,
      ease: config.ease,
      delay: config.delay,
    }
  );

  return timeline;
};

/**
 * Parallax Animation
 * Creates parallax effect on scroll
 */
export const parallaxAnimation = (element, speed = 0.5) => {
  if (!element) return;

  gsap.to(element, {
    y: `${speed * 100}px`,
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
      markers: false,
    },
  });
};

/**
 * Scale Transition Animation
 * Animates element scale on scroll
 */
export const scaleTransitionAnimation = (element, options = {}) => {
  const defaults = {
    startScale: 0.8,
    endScale: 1,
    duration: 1,
    ease: 'power2.out',
  };

  const config = { ...defaults, ...options };

  if (!element) return;

  gsap.fromTo(
    element,
    {
      scale: config.startScale,
      opacity: 0,
    },
    {
      scale: config.endScale,
      opacity: 1,
      duration: config.duration,
      ease: config.ease,
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'top 20%',
        scrub: false,
        markers: false,
      },
    }
  );
};

/**
 * Fade In Animation
 * Simple fade in effect on scroll
 */
export const fadeInAnimation = (element, options = {}) => {
  const defaults = {
    duration: 0.8,
    delay: 0,
    ease: 'power2.out',
  };

  const config = { ...defaults, ...options };

  if (!element) return;

  gsap.fromTo(
    element,
    {
      opacity: 0,
    },
    {
      opacity: 1,
      duration: config.duration,
      delay: config.delay,
      ease: config.ease,
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        end: 'top 15%',
        scrub: false,
        markers: false,
      },
    }
  );
};

/**
 * Slide In Animation
 * Slides element in from a direction
 */
export const slideInAnimation = (element, direction = 'left', options = {}) => {
  const defaults = {
    duration: 0.8,
    distance: 100,
    ease: 'power2.out',
  };

  const config = { ...defaults, ...options };

  const fromProps = {};
  const toProps = {};

  switch (direction) {
    case 'left':
      fromProps.x = -config.distance;
      break;
    case 'right':
      fromProps.x = config.distance;
      break;
    case 'top':
      fromProps.y = -config.distance;
      break;
    case 'bottom':
      fromProps.y = config.distance;
      break;
    default:
      fromProps.x = -config.distance;
  }

  fromProps.opacity = 0;
  toProps.opacity = 1;

  if (!element) return;

  gsap.fromTo(
    element,
    fromProps,
    {
      ...toProps,
      duration: config.duration,
      ease: config.ease,
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'top 20%',
        scrub: false,
        markers: false,
      },
    }
  );
};

/**
 * Stagger Animation
 * Animates multiple elements with stagger effect
 */
export const staggerAnimation = (elements, options = {}) => {
  const defaults = {
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out',
    fromY: 30,
  };

  const config = { ...defaults, ...options };

  if (!elements || elements.length === 0) return;

  gsap.fromTo(
    elements,
    {
      opacity: 0,
      y: config.fromY,
    },
    {
      opacity: 1,
      y: 0,
      duration: config.duration,
      stagger: config.stagger,
      ease: config.ease,
      scrollTrigger: {
        trigger: elements[0].parentElement,
        start: 'top 80%',
        end: 'top 20%',
        scrub: false,
        markers: false,
      },
    }
  );
};

/**
 * Rotate Animation
 * Rotates element continuously or on scroll
 */
export const rotateAnimation = (element, options = {}) => {
  const defaults = {
    duration: 20,
    rotation: 360,
    repeat: -1,
  };

  const config = { ...defaults, ...options };

  if (!element) return;

  gsap.to(element, {
    rotation: config.rotation,
    duration: config.duration,
    repeat: config.repeat,
    ease: 'none',
  });
};

/**
 * Floating Animation
 * Creates floating/bobbing effect
 */
export const floatingAnimation = (element, options = {}) => {
  const defaults = {
    duration: 3,
    distance: 20,
    repeat: -1,
    yoyo: true,
  };

  const config = { ...defaults, ...options };

  if (!element) return;

  gsap.to(element, {
    y: config.distance,
    duration: config.duration,
    repeat: config.repeat,
    yoyo: config.yoyo,
    ease: 'sine.inOut',
  });
};

/**
 * Glow Animation
 * Creates pulsing glow effect
 */
export const glowAnimation = (element, options = {}) => {
  const defaults = {
    duration: 2,
    intensity: 0.8,
    repeat: -1,
  };

  const config = { ...defaults, ...options };

  if (!element) return;

  gsap.to(element, {
    boxShadow: `0 0 30px rgba(250, 204, 21, ${config.intensity})`,
    duration: config.duration,
    repeat: config.repeat,
    yoyo: true,
    ease: 'sine.inOut',
  });
};

/**
 * Cleanup ScrollTrigger instances
 */
export const cleanupScrollTriggers = () => {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
};

export default {
  textRevealAnimation,
  parallaxAnimation,
  scaleTransitionAnimation,
  fadeInAnimation,
  slideInAnimation,
  staggerAnimation,
  rotateAnimation,
  floatingAnimation,
  glowAnimation,
  cleanupScrollTriggers,
};
