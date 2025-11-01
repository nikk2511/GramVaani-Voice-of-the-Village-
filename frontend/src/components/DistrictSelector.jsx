'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { getDistricts } from '@/lib/api';

export default function DistrictSelector({ onSelect, stateCode }) {
  const { t, i18n } = useTranslation();
  const [districts, setDistricts] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  useEffect(() => {
    loadDistricts();
  }, [stateCode]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = districts.filter(d => 
        d.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (d.name_hi && d.name_hi.includes(searchTerm))
      );
      setFilteredDistricts(filtered);
    } else {
      setFilteredDistricts(districts);
    }
  }, [searchTerm, districts]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadDistricts = async () => {
    try {
      setLoading(true);
      const data = await getDistricts(stateCode);
      setDistricts(data.districts || []);
      setFilteredDistricts(data.districts || []);
    } catch (error) {
      console.error('Error loading districts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (district) => {
    onSelect(district);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert(t('useMyLocation') + ': Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // In a real implementation, you would reverse geocode to find district
        // For now, just show a message
        alert('Geolocation feature: District detection coming soon!');
      },
      (error) => {
        alert('Could not determine your location. Please select manually.');
      }
    );
  };

  const selectedDistrict = filteredDistricts.find(d => 
    d.name_en.toLowerCase() === searchTerm.toLowerCase() ||
    d.name_hi === searchTerm
  );

  return (
    <div className="w-full max-w-md mx-auto relative" ref={dropdownRef}>
      <label className="block text-lg font-semibold mb-2">
        {t('selectDistrict')}
      </label>
      
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={t('searchDistrict')}
          className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        
        {isOpen && filteredDistricts.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredDistricts.map((district) => (
              <button
                key={district.id}
                onClick={() => handleSelect(district)}
                className="w-full px-4 py-3 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-lg"
              >
                <div className="font-semibold">{district.name_en}</div>
                {district.name_hi && (
                  <div className="text-sm text-gray-600">{district.name_hi}</div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleGeolocation}
        className="mt-2 w-full px-4 py-3 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 font-medium"
      >
        📍 {t('useMyLocation')}
      </button>

      {loading && (
        <div className="mt-2 text-center text-gray-600">{t('loading')}</div>
      )}
    </div>
  );
}

