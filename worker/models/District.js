const mongoose = require('mongoose');

const districtSchema = new mongoose.Schema({
  district_id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  state: {
    type: String,
    required: true,
    index: true
  },
  name_en: {
    type: String,
    required: true
  },
  name_hi: {
    type: String,
    default: ''
  },
  geo: {
    type: {
      type: String,
      enum: ['Polygon', 'MultiPolygon'],
      default: undefined
    },
    coordinates: {
      type: [[[Number]]],
      default: undefined
    }
  },
  last_updated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

if (districtSchema.path('geo')) {
  districtSchema.index({ geo: '2dsphere' });
}

module.exports = mongoose.model('District', districtSchema);

