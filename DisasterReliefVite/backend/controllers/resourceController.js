import Resource from '../models/Resource.js';

export const getResources = async (req, res) => {
  const resources = await Resource.find();
  res.json(resources);
};

export const createResource = async (req, res) => {
  const resource = new Resource(req.body);
  await resource.save();
  res.status(201).json(resource);
};

export const getResource = async (req, res) => {
  const resource = await Resource.findById(req.params.id);
  if (!resource) return res.status(404).json({ error: 'Resource not found' });
  res.json(resource);
};

export const updateResource = async (req, res) => {
  const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!resource) return res.status(404).json({ error: 'Resource not found' });
  res.json(resource);
};

export const deleteResource = async (req, res) => {
  const resource = await Resource.findByIdAndDelete(req.params.id);
  if (!resource) return res.status(404).json({ error: 'Resource not found' });
  res.json({ message: 'Resource deleted' });
};
