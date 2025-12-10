
import User from '../models/User.js';
import Request from '../models/Request.js';

export const getVolunteers = async (req, res) => {
  try {
    // Only fetch users with role 'volunteer', exclude password
    const volunteers = await User.find({ role: 'volunteer' }).select('-password');
    // For each volunteer, count approved requests for their resources
    const volunteerData = await Promise.all(volunteers.map(async (v) => {
      // Find requests for resources provided by this volunteer and approved
      // We need to find requests where the resource's provider_id matches this volunteer's _id
      // This requires population, so we fetch all approved requests and filter in JS
      const approvedRequests = await Request.find({ status: 'approved' }).populate('resource');
      const approvedCount = approvedRequests.filter(r => r.resource && r.resource.provider_id && String(r.resource.provider_id) === String(v._id)).length;
      return {
        ...v.toObject(),
        approvedCount
      };
    }));
    res.json(volunteerData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createVolunteer = async (req, res) => {
  const volunteer = new Volunteer(req.body);
  await volunteer.save();
  res.status(201).json(volunteer);
};

export const getVolunteer = async (req, res) => {
  const volunteer = await Volunteer.findById(req.params.id);
  if (!volunteer) return res.status(404).json({ error: 'Volunteer not found' });
  res.json(volunteer);
};

export const updateVolunteer = async (req, res) => {
  const volunteer = await Volunteer.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!volunteer) return res.status(404).json({ error: 'Volunteer not found' });
  res.json(volunteer);
};

export const deleteVolunteer = async (req, res) => {
  const volunteer = await Volunteer.findByIdAndDelete(req.params.id);
  if (!volunteer) return res.status(404).json({ error: 'Volunteer not found' });
  res.json({ message: 'Volunteer deleted' });
};
