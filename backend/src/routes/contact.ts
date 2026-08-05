import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Contact from '../models/Contact';
import { sendEmail } from '../utils/email';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// GET all contact messages (Protected Admin Endpoint)
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch contact messages.' });
  }
});

// POST submit new contact message
router.post('/', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').notEmpty().withMessage('Message is required')
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
     res.status(400).json({ errors: errors.array() });
     return;
  }

  try {
    const { name, email, subject, message } = req.body;
    
    // Save to MongoDB Atlas
    const newContact = await Contact.create({ name, email, subject, message });
    
    // Send email notification
    await sendEmail({
      to: process.env.CONTACT_EMAIL || 'contact@brightafrica.org',
      subject: `Nouveau message de contact: ${subject}`,
      text: `Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    });

    res.status(201).json({ success: true, message: 'Message sent successfully.', data: newContact });
  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({ success: false, message: 'Failed to send message.' });
  }
});

// DELETE contact message by ID (Protected Admin Endpoint)
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Message deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete message.' });
  }
});

export default router;
