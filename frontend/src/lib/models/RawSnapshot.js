import mongoose from 'mongoose';

const rawSnapshotSchema = new mongoose.Schema({
  fetched_at: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  source_url: {
    type: String,
    required: true
  },
  raw_json: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  state: {
    type: String,
    required: true,
    index: true
  },
  fetch_status: {
    type: String,
    enum: ['success', 'failed', 'partial'],
    default: 'success'
  },
  error_message: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

let RawSnapshot;
try {
  RawSnapshot = mongoose.model('RawSnapshot');
} catch (e) {
  RawSnapshot = mongoose.model('RawSnapshot', rawSnapshotSchema);
}

export default RawSnapshot;

