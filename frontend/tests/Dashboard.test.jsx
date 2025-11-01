import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../src/components/Dashboard';

// Mock the API
jest.mock('../src/lib/api', () => ({
  getDistrictSummary: jest.fn(),
  getDistrictMetrics: jest.fn(),
}));

describe('Dashboard Component', () => {
  const mockDistrict = {
    id: 'test_district',
    name_en: 'Test District',
    name_hi: 'टेस्ट जिला'
  };

  it('should render loading state', () => {
    const { getDistrictSummary, getDistrictMetrics } = require('../src/lib/api');
    getDistrictSummary.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<Dashboard district={mockDistrict} onBack={() => {}} />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should render district name when data is loaded', async () => {
    const { getDistrictSummary, getDistrictMetrics } = require('../src/lib/api');
    
    getDistrictSummary.mockResolvedValue({
      district_id: 'test_district',
      district_name: 'Test District',
      metrics: {
        people_benefited: 1000,
        expenditure: 5000000,
        persondays: 5000,
        works_completed: 10
      }
    });
    
    getDistrictMetrics.mockResolvedValue({
      months: []
    });

    render(<Dashboard district={mockDistrict} onBack={() => {}} />);
    
    // Wait for data to load
    await screen.findByText('Test District');
    expect(screen.getByText('Test District')).toBeInTheDocument();
  });
});

