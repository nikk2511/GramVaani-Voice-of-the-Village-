import mongoose from 'mongoose';

// Lazy initialization to avoid build-time issues
let districtSchema = null;
let District = null;

function getDistrictModel() {
  if (District) {
    return District;
  }

  if (!districtSchema) {
    districtSchema = new mongoose.Schema({
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
  }

  try {
    District = mongoose.model('District');
  } catch (e) {
    District = mongoose.model('District', districtSchema);
  }

  return District;
}

export default getDistrictModel;

