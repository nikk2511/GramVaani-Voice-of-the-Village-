'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getDistrictSummary, getDistrictMetrics } from '@/lib/api';
import MetricTile from './MetricTile';
import HistoricalChart from './HistoricalChart';
import ComparisonChart from './ComparisonChart';

const PEOPLE_ICON = (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
  </svg>
);

const MONEY_ICON = (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.803-.19-1.36-.19A4.988 4.988 0 015 14H3a1 1 0 01-1-1v-1a1 1 0 011-1h2.228c.524-.602 1.272-.939 2.06-.939a2.49 2.49 0 011.318.423A2.49 2.49 0 0114 11.5V10a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1h-1a2.49 2.49 0 01-1.318-.423A2.49 2.49 0 0111 14H9a1 1 0 01-1-1v-1a1 1 0 011-1h2.228c.524-.602 1.272-.939 2.06-.939a2.49 2.49 0 011.318.423z" clipRule="evenodd" />
  </svg>
);

const CALENDAR_ICON = (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
  </svg>
);

const WORK_ICON = (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

export default function Dashboard({ district, onBack }) {
  const { t } = useTranslation();
  const [summary, setSummary] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    if (district) {
      loadData();
    }
  }, [district]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [summaryData, metricsData] = await Promise.all([
        getDistrictSummary(district.id),
        getDistrictMetrics(district.id)
      ]);

      setSummary(summaryData);
      setMetrics(metricsData);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (value, percentile) => {
    // Simple status based on percentiles (would need state averages in real implementation)
    if (percentile > 70) return 'good';
    if (percentile > 30) return 'average';
    return 'poor';
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-xl">{t('loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-xl mb-4">{t('error')}: {error}</div>
        <button 
          onClick={onBack}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {t('selectDistrict')}
        </button>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600 text-xl mb-4">{t('noData')}</div>
        <button 
          onClick={onBack}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {t('selectDistrict')}
        </button>
      </div>
    );
  }

  const voiceTexts = {
    people: `${t('peopleBenefited')}: ${summary.metrics.people_benefited}. ${t('peopleBenefitedDesc')}`,
    expenditure: `${t('expenditure')}: ${summary.metrics.expenditure}. ${t('expenditureDesc')}`,
    persondays: `${t('persondays')}: ${summary.metrics.persondays}. ${t('persondaysDesc')}`,
    works: `${t('worksCompleted')}: ${summary.metrics.works_completed}`
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <button 
          onClick={onBack}
          className="mb-4 text-blue-600 hover:text-blue-800 font-medium"
        >
          ← {t('selectDistrict')}
        </button>
        <h2 className="text-2xl font-bold mb-2">
          {summary.district_name}
          {summary.district_name_hi && (
            <span className="text-lg text-gray-600 ml-2">
              ({summary.district_name_hi})
            </span>
          )}
        </h2>
        <p className="text-sm text-gray-600">
          {t('lastUpdated')}: {new Date(summary.last_updated).toLocaleDateString()}
        </p>
      </div>

      {/* Metric Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricTile
          title={t('peopleBenefited')}
          value={summary.metrics.people_benefited}
          description={t('peopleBenefitedDesc')}
          icon={PEOPLE_ICON}
          status={getStatusColor(summary.metrics.people_benefited, 50)}
          voiceText={voiceTexts.people}
        />
        
        <MetricTile
          title={t('expenditure')}
          value={summary.metrics.expenditure}
          description={t('expenditureDesc')}
          icon={MONEY_ICON}
          status={getStatusColor(summary.metrics.expenditure, 50)}
          voiceText={voiceTexts.expenditure}
        />
        
        <MetricTile
          title={t('persondays')}
          value={summary.metrics.persondays}
          description={t('persondaysDesc')}
          icon={CALENDAR_ICON}
          status={getStatusColor(summary.metrics.persondays, 50)}
          voiceText={voiceTexts.persondays}
        />
        
        <MetricTile
          title={t('worksCompleted')}
          value={summary.metrics.works_completed}
          description={`${t('worksCompleted')} in ${summary.month}`}
          icon={WORK_ICON}
          status={getStatusColor(summary.metrics.works_completed, 50)}
          voiceText={voiceTexts.works}
        />
      </div>

      {/* Historical Chart */}
      {metrics && metrics.months && metrics.months.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold mb-4">{t('historicalTrends')}</h3>
          <HistoricalChart data={metrics.months} />
        </div>
      )}

      {/* Comparison */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">{t('compareWithState')}</h3>
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {showComparison ? 'Hide' : 'Show'} Comparison
          </button>
        </div>
        {showComparison && (
          <div className="text-sm text-gray-600">
            Comparison feature - select another district to compare
          </div>
        )}
      </div>
    </div>
  );
}

