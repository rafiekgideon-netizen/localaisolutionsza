import confetti from "canvas-confetti";

/**
 * Fires a subtle, premium celebratory confetti burst tailored to Local AI Solutions'
 * brand palette (Orange #f97316, Emerald #10b981, Amber Gold #fbbf24, and Crisp White).
 */
export function fireAuditCelebrationConfetti() {
  const brandColors = ["#f97316", "#ea580c", "#10b981", "#fbbf24", "#ffffff"];

  // First burst from bottom-left corner
  confetti({
    particleCount: 45,
    angle: 60,
    spread: 55,
    origin: { x: 0.15, y: 0.75 },
    colors: brandColors,
    ticks: 200,
    gravity: 1.1,
    scalar: 0.9,
    disableForReducedMotion: true
  });

  // Second burst from bottom-right corner
  confetti({
    particleCount: 45,
    angle: 120,
    spread: 55,
    origin: { x: 0.85, y: 0.75 },
    colors: brandColors,
    ticks: 200,
    gravity: 1.1,
    scalar: 0.9,
    disableForReducedMotion: true
  });

  // Delayed elegant center shower
  setTimeout(() => {
    confetti({
      particleCount: 60,
      spread: 80,
      origin: { x: 0.5, y: 0.45 },
      colors: brandColors,
      ticks: 250,
      gravity: 0.95,
      scalar: 1.05,
      shapes: ["circle", "square"],
      disableForReducedMotion: true
    });
  }, 220);
}
