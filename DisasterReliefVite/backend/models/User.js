import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  address: String,
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'volunteer', 'victim'], required: true },
  phone: String,
  location: locationSchema,
  organization: String,
  skills: [String],
  availability: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
