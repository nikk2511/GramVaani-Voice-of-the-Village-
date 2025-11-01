import mongoose from 'mongoose';

// Lazy initialization to avoid build-time issues
let rawSnapshotSchema = null;
let RawSnapshot = null;

function getRawSnapshotModel() {
  if (RawSnapshot) {
    return RawSnapshot;
  }

  if (!rawSnapshotSchema) {
    rawSnapshotSchema = new mongoose.Schema({
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
  }

  try {
    RawSnapshot = mongoose.model('RawSnapshot');
  } catch (e) {
    RawSnapshot = mongoose.model('RawSnapshot', rawSnapshotSchema);
  }

  return RawSnapshot;
}

export default getRawSnapshotModel();

