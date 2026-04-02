/**
 * Disable Zone.js's patching of requestAnimationFrame.
 * This must be imported BEFORE zone.js loads.
 *
 * Without this, every rAF callback (GSAP ticker, Three.js render loop,
 * Lenis RAF driver) triggers Angular change detection at 60fps — causing
 * the scroll throttle / jank.
 */
(window as any).__Zone_disable_requestAnimationFrame = true;
