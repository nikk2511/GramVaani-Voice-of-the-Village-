const mongoose = require('mongoose');

const districtMetricSchema = new mongoose.Schema({
  district_id: {
    type: String,
    required: true,
    index: true
  },
  month: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}$/
  },
  metrics: {
    people_benefited: { type: Number, default: 0 },
    expenditure: { type: Number, default: 0 },
    persondays: { type: Number, default: 0 },
    works_started: { type: Number, default: 0 },
    works_completed: { type: Number, default: 0 },
    average_persondays: { type: Number, default: 0 }
  },
  source_snapshot_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RawSnapshot',
    default: null
  }
}, {
  timestamps: true
});

districtMetricSchema.index({ district_id: 1, month: 1 }, { unique: true });
districtMetricSchema.index({ district_id: 1, month: -1 });

module.exports = mongoose.model('DistrictMetric', districtMetricSchema);

