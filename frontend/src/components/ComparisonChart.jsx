'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function ComparisonChart({ data }) {
  if (!data || !data.comparison) {
    return <div className="text-center text-gray-600 p-4">No comparison data available</div>;
  }

  const { district1, district2, metric } = data.comparison;

  // Merge data by month
  const monthMap = new Map();
  
  district1.data.forEach(point => {
    if (!monthMap.has(point.month)) {
      monthMap.set(point.month, { month: point.month });
    }
    monthMap.get(point.month)[district1.name_en] = point.value;
  });

  district2.data.forEach(point => {
    if (!monthMap.has(point.month)) {
      monthMap.set(point.month, { month: point.month });
    }
    monthMap.get(point.month)[district2.name_en] = point.value;
  });

  const chartData = Array.from(monthMap.values()).sort((a, b) => a.month.localeCompare(b.month));

  return (
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
        <Tooltip formatter={(value) => value.toLocaleString('en-IN')} />
        <Legend />
        <Line 
          type="monotone" 
          dataKey={district1.name_en} 
          stroke="#10b981" 
          strokeWidth={2}
          dot={{ r: 3 }}
        />
        <Line 
          type="monotone" 
          dataKey={district2.name_en} 
          stroke="#3b82f6" 
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

