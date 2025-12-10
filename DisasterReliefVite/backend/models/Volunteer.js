import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skills: [String],
  availability: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model('Volunteer', volunteerSchema);
