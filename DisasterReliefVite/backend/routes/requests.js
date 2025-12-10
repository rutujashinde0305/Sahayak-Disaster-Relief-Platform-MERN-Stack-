import express from 'express';
import { getRequests, createRequest, getRequest, updateRequest, deleteRequest } from '../controllers/requestController.js';

const router = express.Router();

router.get('/', getRequests);
router.post('/', createRequest);
router.get('/:id', getRequest);
router.put('/:id', updateRequest);
router.delete('/:id', deleteRequest);

export default router;
