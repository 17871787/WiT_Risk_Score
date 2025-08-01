// UI configuration constants

// Disable animations in production for better performance
// In Vite, we default to enabling animations
export const CHART_ANIMATION_ENABLED = true;

// Chart animation duration (ms)
export const CHART_ANIMATION_DURATION = CHART_ANIMATION_ENABLED ? 1500 : 0;

// Chart colors
export const CHART_COLORS = {
  primary: '#3B82F6',
  secondary: '#10B981',
  tertiary: '#F59E0B',
  quaternary: '#EF4444',
  quinary: '#8B5CF6',
  senary: '#EC4899'
};

// Responsive breakpoints
export const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  wide: 1280
};