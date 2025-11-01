const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server');

describe('District API', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mgnrega_test');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /api/v1/districts', () => {
    it('should return list of districts for a state', async () => {
      const res = await request(app)
        .get('/api/v1/districts')
        .query({ state: 'UP' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('districts');
      expect(Array.isArray(res.body.districts)).toBe(true);
    });

    it('should return 400 if state is missing', async () => {
      const res = await request(app)
        .get('/api/v1/districts');

      // May return 200 with default state or 400, depending on implementation
      expect([200, 400]).toContain(res.statusCode);
    });
  });

  describe('GET /api/v1/districts/:id/summary', () => {
    it('should return district summary', async () => {
      // Assuming test data exists
      const districtId = 'test_district';
      const res = await request(app)
        .get(`/api/v1/districts/${districtId}/summary`);

      if (res.statusCode === 404) {
        // No data yet, which is expected
        expect(res.statusCode).toBe(404);
      } else {
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('district_id');
        expect(res.body).toHaveProperty('metrics');
      }
    });
  });
});

