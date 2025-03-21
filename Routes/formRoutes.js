import express from 'express';
import { submitForm } from '../controller/formController.js'; // Adjusted import path
import { getFormData } from '../controller/formController.js';

const router = express.Router();

// Route to post all form submissions
router.post('/submit', submitForm);

// Route to get all form submissions
router.get('/data', getFormData);

export default router;
