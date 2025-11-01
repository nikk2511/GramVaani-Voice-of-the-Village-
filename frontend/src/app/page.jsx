'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DistrictSelector from '@/components/DistrictSelector';
import Dashboard from '@/components/Dashboard';
import Header from '@/components/Header';
import { getStatus } from '@/lib/api';

const STATE_CODE = process.env.NEXT_PUBLIC_STATE_CODE || 
  (typeof window !== 'undefined' ? 'UP' : process.env.STATE_CODE || 'UP');

export default function Home() {
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [dataStatus, setDataStatus] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const status = await getStatus();
      setDataStatus(status);
    } catch (error) {
      console.error('Error loading status:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {!selectedDistrict ? (
          <div className="py-8">
            <h1 className="text-3xl font-bold text-center mb-8">
              {t('appName')}
            </h1>
            <DistrictSelector 
              onSelect={setSelectedDistrict}
              stateCode={STATE_CODE}
            />
          </div>
        ) : (
          <Dashboard 
            district={selectedDistrict}
            onBack={() => setSelectedDistrict(null)}
          />
        )}

        {dataStatus && dataStatus.data?.last_successful_fetch && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-center">
            {t('lastUpdated')}: {new Date(dataStatus.data.last_successful_fetch).toLocaleString()}
            {dataStatus.services?.upstream_api?.status !== 'connected' && (
              <span className="ml-2 text-yellow-800 font-semibold">
                ({t('dataMayBeOld')})
              </span>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

