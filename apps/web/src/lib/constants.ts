// Animation constants
export const ANIMATION_DURATION_SHORT = 0.5;
export const ANIMATION_DURATION_MEDIUM = 0.6;
export const ANIMATION_DURATION_LONG = 0.7;
export const ANIMATION_DELAY_STAGGER = 0.12;
export const ANIMATION_DELAY_BASE = 0.4;
export const ANIMATION_DELAY_INCREMENT = 0.1;
export const ANIMATION_DELAY_PROJECT = 0.06;
export const ANIMATION_DURATION_PROJECT = 0.32;
export const ANIMATION_DURATION_CASE_STUDY = 0.4;
export const ANIMATION_DELAY_CASE_STUDY = 0.1;
export const STAR_RATING_COUNT = 5;
export const ANIMATION_EASE_CUBIC = [0.25, 0.25, 0, 1] as const;

// Skills section constants
export const SKILL_HOVER_SCALE = 1.1;
export const SKILL_ICON_HOVER_SCALE = 1.12;
export const SKILL_ICON_HOVER_Y = -3;
export const SKILL_ROTATION_ANGLES = [0, -5, 5, 0];
export const SKILL_ICON_SIZE = 24;
export const SKILL_ICON_DISPLAY_SIZE = 6;

// Spotify polling intervals (in milliseconds)
export const SPOTIFY_POLLING_INTERVAL_PLAYING = 5000; // 5 seconds when playing
export const SPOTIFY_POLLING_INTERVAL_PAUSED = 15_000; // 15 seconds when paused

// Scroll provider constants
export const SCROLL_DURATION = 1.2;
export const SCROLL_EASING_CONSTANT = 1.001;
export const SCROLL_EASING_EXPONENT = -10;

// Email validation regex (moved to top level for performance)
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
