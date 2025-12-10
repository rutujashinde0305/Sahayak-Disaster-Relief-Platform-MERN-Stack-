import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  address: String,
}, { _id: false });

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: { type: String, enum: ['food', 'shelter', 'medical', 'transport'], required: true },
  quantity: { type: Number, required: true },
  available_quantity: { type: Number, required: true },
  location: locationSchema,
  status: { type: String, enum: ['available', 'limited', 'unavailable'], default: 'available' },
  provider_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model('Resource', resourceSchema);
