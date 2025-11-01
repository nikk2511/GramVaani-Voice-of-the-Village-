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
    <div className="w-full max-w-2xl mx-auto relative" ref={dropdownRef}>
      <label className="block text-2xl font-bold mb-4 text-gray-800">
        {t('selectDistrict') || 'Select Your District'}
      </label>
      
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => {
              setIsOpen(true);
            }}
            placeholder={t('searchDistrict') || 'Type district name to search (English or Hindi)'}
            className="w-full px-5 py-4 text-xl border-3 border-blue-400 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-200 shadow-md"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </div>
        </div>
        
        {isOpen && searchTerm && filteredDistricts.length === 0 && (
          <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-600">
            No districts found matching "{searchTerm}"
          </div>
        )}

        {isOpen && filteredDistricts.length > 0 && (
          <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-xl max-h-96 overflow-y-auto">
            <div className="p-2 text-sm text-gray-600 font-semibold border-b">
              {filteredDistricts.length} district{filteredDistricts.length !== 1 ? 's' : ''} found
            </div>
            {filteredDistricts.slice(0, 50).map((district) => (
              <button
                key={district.id}
                onClick={() => handleSelect(district)}
                className="w-full px-5 py-4 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100 transition-colors"
              >
                <div className="font-bold text-lg text-gray-900">{district.name_en}</div>
                {district.name_hi && (
                  <div className="text-base text-gray-600 mt-1">{district.name_hi}</div>
                )}
              </button>
            ))}
            {filteredDistricts.length > 50 && (
              <div className="p-3 text-center text-sm text-gray-500 border-t">
                Showing first 50 of {filteredDistricts.length} districts. Type more to narrow search.
              </div>
            )}
          </div>
        )}

        {isOpen && !searchTerm && districts.length > 0 && (
          <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-xl max-h-96 overflow-y-auto">
            <div className="p-2 text-sm text-gray-600 font-semibold border-b">
              All districts ({districts.length})
            </div>
            {districts.slice(0, 100).map((district) => (
              <button
                key={district.id}
                onClick={() => handleSelect(district)}
                className="w-full px-5 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100 transition-colors"
              >
                <div className="font-semibold text-base text-gray-900">{district.name_en}</div>
                {district.name_hi && (
                  <div className="text-sm text-gray-600 mt-0.5">{district.name_hi}</div>
                )}
              </button>
            ))}
            {districts.length > 100 && (
              <div className="p-3 text-center text-sm text-gray-500 border-t">
                Showing first 100 districts. Type to search for specific district.
              </div>
            )}
          </div>
        )}
      </div>

      <button
        onClick={handleGeolocation}
        className="mt-4 w-full px-5 py-3 bg-blue-100 text-blue-800 rounded-xl hover:bg-blue-200 font-semibold text-lg shadow-md transition-colors"
      >
        📍 {t('useMyLocation') || 'Use My Location'}
      </button>

      {loading && (
        <div className="mt-4 text-center text-gray-600 text-lg">
          {t('loading') || 'Loading districts...'}
        </div>
      )}

      {!loading && districts.length === 0 && (
        <div className="mt-4 text-center text-red-600 font-semibold">
          No districts found. Please check your database connection.
        </div>
      )}
    </div>
  );
}

