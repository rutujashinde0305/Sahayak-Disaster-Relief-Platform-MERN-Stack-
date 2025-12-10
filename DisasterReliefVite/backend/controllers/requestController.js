import Request from '../models/Request.js';
import User from '../models/User.js';
import { sendSMS } from '../utils/sms.js';


export const getRequests = async (req, res) => {
  // Populate resource and user for richer filtering on frontend
  const requests = await Request.find().populate('resource').populate('user');
  res.json(requests);
};

export const createRequest = async (req, res) => {
  const request = new Request(req.body);
  await request.save();
  res.status(201).json(request);
};

export const getRequest = async (req, res) => {
  const request = await Request.findById(req.params.id);
  if (!request) return res.status(404).json({ error: 'Request not found' });
  res.json(request);
};

export const updateRequest = async (req, res) => {
  const request = await Request.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('user');
  if (!request) return res.status(404).json({ error: 'Request not found' });
  // If status is updated to approved or rejected, send SMS to victim
  if (req.body.status === 'approved' || req.body.status === 'rejected') {
    try {
      const user = request.user;
      if (user && user.phone) {
        const msg = req.body.status === 'approved'
          ? 'Your disaster relief request has been accepted!'
          : 'Your disaster relief request was not accepted.';
        await sendSMS(user.phone, msg);
      }
    } catch (e) {
      // Log but do not block response
      console.error('SMS send failed:', e.message);
    }
  }
  res.json(request);
};

export const deleteRequest = async (req, res) => {
  const request = await Request.findByIdAndDelete(req.params.id);
  if (!request) return res.status(404).json({ error: 'Request not found' });
  res.json({ message: 'Request deleted' });
};
