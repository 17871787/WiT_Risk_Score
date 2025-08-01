import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  valueColor?: string;
  bgColor?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit = '',
  subtitle,
  icon: Icon,
  iconColor = 'text-gray-600',
  valueColor = 'text-gray-900',
  bgColor = 'bg-gray-50'
}) => {
  return (
    <div className={`${bgColor} p-4 rounded-lg`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-600">{title}</span>
        {Icon && <Icon className={iconColor} size={16} />}
      </div>
      <div className={`text-xl font-bold ${valueColor}`}>
        {value}{unit && <span className="text-sm font-normal ml-1">{unit}</span>}
      </div>
      {subtitle && (
        <div className="text-xs text-gray-500 mt-1">{subtitle}</div>
      )}
    </div>
  );
};