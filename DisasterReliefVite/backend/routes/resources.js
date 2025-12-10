import express from 'express';
import { getResources, createResource, getResource, updateResource, deleteResource } from '../controllers/resourceController.js';

const router = express.Router();

router.get('/', getResources);
router.post('/', createResource);
router.get('/:id', getResource);
router.put('/:id', updateResource);
router.delete('/:id', deleteResource);

export default router;
