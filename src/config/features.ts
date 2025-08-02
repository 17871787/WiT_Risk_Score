/**
 * Feature flags configuration
 * 
 * Allows enabling/disabling features without code changes
 * Can be controlled via environment variables or runtime config
 */

// Default feature flags
const defaultFeatures = {
  // Core features (always enabled)
  EMISSIONS_CALCULATOR: true,
  LME_CALCULATOR: true,
  RISK_SCORING: true,
  LOAN_CALCULATOR: true,
  
  // V3 features
  NUE_CALCULATOR: true,
  FEED_OPTIMIZATION: true,
  
  // V4 features
  THEORETICAL_MINIMUM: true,
  REDUCTION_PATHWAYS: true,
  GREEN_FINANCING: true,
  SCENARIO_FINANCING: true,
  
  // Experimental features
  CARBON_MARKETPLACE: false,
  PEER_BENCHMARKING: false,
  ML_PREDICTIONS: false,
  
  // UI features
  DARK_MODE: false,
  ADVANCED_CHARTS: true,
  EXPORT_PDF: true,
  
  // Integration features
  API_INTEGRATION: false,
  REALTIME_SYNC: false,
  TEAM_COLLABORATION: false,
};

// Feature flag type
export type FeatureFlags = typeof defaultFeatures;

// Get feature flags from environment or use defaults
const getFeatureFlags = (): FeatureFlags => {
  const flags = { ...defaultFeatures };
  
  // Override from environment variables (if available)
  // In a real app, these might come from a config service
  if (typeof window !== 'undefined' && window.featureFlags) {
    Object.assign(flags, window.featureFlags);
  }
  
  return flags;
};

// Export feature flags
export const FEATURES = getFeatureFlags();

// Helper to check if a feature is enabled
export const isFeatureEnabled = (feature: keyof FeatureFlags): boolean => {
  return FEATURES[feature] === true;
};

// Helper to get all enabled features
export const getEnabledFeatures = (): string[] => {
  return Object.entries(FEATURES)
    .filter(([_, enabled]) => enabled)
    .map(([feature]) => feature);
};

// Helper to get all disabled features
export const getDisabledFeatures = (): string[] => {
  return Object.entries(FEATURES)
    .filter(([_, enabled]) => !enabled)
    .map(([feature]) => feature);
};

// Development helper to toggle features
export const toggleFeature = (feature: keyof FeatureFlags): void => {
  // Only allow in development mode
  if (import.meta.env.DEV) {
    FEATURES[feature] = !FEATURES[feature];
    console.log(`Feature ${feature} is now ${FEATURES[feature] ? 'enabled' : 'disabled'}`);
  }
};

// Declare global type for window.featureFlags
declare global {
  interface Window {
    featureFlags?: Partial<FeatureFlags>;
  }
}