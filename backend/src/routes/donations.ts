import { Router, Request, Response } from 'express';
import Donation from '../models/Donation';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// GET all donations (Protected Admin Endpoint)
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: donations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch donations.' });
  }
});

// POST process donation
router.post('/', async (req: Request, res: Response) => {
  try {
    const { amount, type, name, email, paymentMethod } = req.body;
    
    const newDonation = await Donation.create({
      amount: amount || 0,
      type: type || 'ONE_TIME',
      name: name || 'Anonyme',
      email: email || 'donor@acpdph.org',
      paymentMethod: paymentMethod || 'MOBILE_MONEY'
    });

    res.status(201).json({ 
      success: true, 
      message: 'Donation recorded successfully',
      data: newDonation
    });
  } catch (error) {
    console.error('Donation error:', error);
    res.status(500).json({ success: false, message: 'Payment processing failed.' });
  }
});

export default router;
