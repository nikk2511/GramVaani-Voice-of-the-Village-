'use client';

import { useTranslation } from 'react-i18next';
import VoiceButton from './VoiceButton';

export default function MetricTile({ 
  title, 
  value, 
  description, 
  status = 'default',
  icon,
  voiceText 
}) {
  const { t } = useTranslation();
  
  const statusColors = {
    good: 'bg-green-50 border-green-200 text-green-800',
    average: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    poor: 'bg-red-50 border-red-200 text-red-800',
    default: 'bg-white border-gray-200 text-gray-800',
  };

  const formatNumber = (num) => {
    if (typeof num !== 'number') return 'N/A';
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const formatCurrency = (num) => {
    if (typeof num !== 'number') return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const displayValue = title.toLowerCase().includes('amount') || title.toLowerCase().includes('expenditure')
    ? formatCurrency(value)
    : formatNumber(value);

  return (
    <div className={`p-4 rounded-lg border-2 ${statusColors[status]} min-h-[120px] flex flex-col`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="text-sm font-semibold mb-1">{title}</h3>
          <div className="text-2xl font-bold">{displayValue}</div>
        </div>
        {icon && (
          <div className="text-3xl ml-2">
            {icon}
          </div>
        )}
      </div>
      {description && (
        <p className="text-xs mt-auto mb-2">{description}</p>
      )}
      {voiceText && (
        <div className="mt-auto">
          <VoiceButton text={voiceText} className="mt-2" />
        </div>
      )}
    </div>
  );
}

