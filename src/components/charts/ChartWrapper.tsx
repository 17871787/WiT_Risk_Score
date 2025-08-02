import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

interface ChartWrapperProps {
  children: React.ReactNode;
  height?: number;
}

// Reusable loading spinner for charts
export const ChartLoadingSpinner: React.FC<{ height?: number }> = ({ height = 300 }) => (
  <div 
    className="flex items-center justify-center bg-gray-50 rounded-lg"
    style={{ height }}
  >
    <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
  </div>
);

// Wrapper component for lazy-loaded charts
export const ChartWrapper: React.FC<ChartWrapperProps> = ({ children, height = 300 }) => {
  return (
    <Suspense fallback={<ChartLoadingSpinner height={height} />}>
      {children}
    </Suspense>
  );
};

// Error boundary specifically for charts
export class ChartErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg">
          <p className="text-red-600">Failed to load chart</p>
        </div>
      );
    }

    return this.props.children;
  }
}