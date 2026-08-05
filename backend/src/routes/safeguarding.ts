import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { safeguardingLimiter } from '../middleware/security';
import { authMiddleware } from '../middleware/authMiddleware';
import Safeguarding from '../models/Safeguarding';

const router = Router();

// GET all safeguarding reports (Protected Admin Endpoint)
router.get('/reports', authMiddleware, async (req: Request, res: Response) => {
  try {
    const reports = await Safeguarding.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch reports.' });
  }
});

// POST submit a safeguarding report
router.post('/report', safeguardingLimiter, [
  body('incidentType').notEmpty().withMessage('Type of incident is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('description').notEmpty().withMessage('Description is required')
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
     res.status(400).json({ errors: errors.array() });
     return;
  }

  try {
    const { reporterType, incidentType, location, description, contactInfo } = req.body;

    const newReport = await Safeguarding.create({
      reporterType: reporterType || 'ANONYMOUS',
      incidentType,
      location,
      description,
      contactInfo: contactInfo || ''
    });

    res.status(201).json({ 
      success: true, 
      message: 'Report submitted securely.',
      data: newReport
    });
  } catch (error) {
    console.error('Safeguarding report error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit report securely.' });
  }
});

// DELETE safeguarding report by ID (Protected Admin Endpoint)
router.delete('/reports/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Safeguarding.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Report deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete report.' });
  }
});

export default router;
