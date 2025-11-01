'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTranslation } from 'react-i18next';

export default function HistoricalChart({ data }) {
  const { t } = useTranslation();

  // Format data for chart (show last 24 months)
  const chartData = data.slice(-24).map(item => ({
    month: item.month,
    people: item.people_benefited || 0,
    expenditure: (item.expenditure || 0) / 1000000, // Convert to crores
    persondays: (item.persondays || 0) / 1000, // Convert to thousands
  }));

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month" 
            angle={-45}
            textAnchor="end"
            height={80}
            fontSize={12}
          />
          <YAxis fontSize={12} />
          <Tooltip 
            formatter={(value, name) => {
              if (name === 'expenditure') return `₹${value.toFixed(2)} Cr`;
              if (name === 'persondays') return `${value.toFixed(1)}K`;
              return value.toLocaleString('en-IN');
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="people" 
            stroke="#10b981" 
            strokeWidth={2}
            name={t('peopleBenefited')}
            dot={{ r: 3 }}
          />
          <Line 
            type="monotone" 
            dataKey="persondays" 
            stroke="#f59e0b" 
            strokeWidth={2}
            name={t('persondays')}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>• {t('peopleBenefited')}: Green line</p>
        <p>• {t('persondays')}: Orange line</p>
        <p className="mt-2">• Expenditure shown separately (hover to see)</p>
      </div>
    </div>
  );
}

