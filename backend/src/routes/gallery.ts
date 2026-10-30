import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { authMiddleware } from '../middleware/authMiddleware';
import Gallery from '../models/Gallery';

const router = Router();

// ── Ensure uploads directory exists ──────────────────────────────────────────
const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'gallery');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// ── Multer configuration ──────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, name);
  },
});

function fileFilter(_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  const allowed = [
    'image/jpeg', 'image/png', 'image/webp', 'image/gif',
    'video/mp4', 'video/webm', 'video/ogg',
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Type de fichier non autorise: ${file.mimetype}`));
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB max (images validated separately below)
});

// ── Helper ────────────────────────────────────────────────────────────────────
function extractYoutubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = re.exec(url);
    if (m) return m[1];
  }
  return null;
}

// ── GET /api/v1/gallery — public ──────────────────────────────────────────────
router.get('/', async (_req: Request, res: Response) => {
  try {
    const items = await Gallery.find({ active: true })
      .sort({ order: 1, date: -1 })
      .lean();
    res.json({ success: true, data: items, total: items.length });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── GET /api/v1/gallery/all — admin (includes inactive) ──────────────────────
router.get('/all', authMiddleware, async (_req: Request, res: Response) => {
  try {
    const items = await Gallery.find()
      .sort({ order: 1, date: -1 })
      .lean();
    res.json({ success: true, data: items, total: items.length });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /api/v1/gallery/upload — admin, upload file ─────────────────────────
router.post('/upload', authMiddleware, upload.single('file'), async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const { title, alt, caption, order } = req.body;

    if (!file) {
      res.status(400).json({ success: false, error: 'Aucun fichier recu' });
      return;
    }
    if (!title || !alt) {
      // Clean up uploaded file
      fs.unlink(file.path, () => {});
      res.status(400).json({ success: false, error: 'Titre et texte alternatif requis' });
      return;
    }

    // Validate image size <= 5 MB
    const isImage = file.mimetype.startsWith('image/');
    if (isImage && file.size > 5 * 1024 * 1024) {
      fs.unlink(file.path, () => {});
      res.status(400).json({ success: false, error: 'Image trop grande (max 5 Mo)' });
      return;
    }

    const type = isImage ? 'image' : 'video';
    const url = `/uploads/gallery/${file.filename}`;

    const item = await Gallery.create({
      title,
      alt,
      caption: caption || '',
      type,
      url,
      date: new Date(),
      order: order ? parseInt(order, 10) : 0,
      fileSize: file.size,
      mimeType: file.mimetype,
    });

    res.status(201).json({ success: true, data: item });
  } catch (err: any) {
    if (req.file) fs.unlink(req.file.path, () => {});
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /api/v1/gallery/youtube — admin, add YouTube link ───────────────────
router.post('/youtube', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { title, alt, caption, youtubeUrl, order } = req.body;

    if (!title || !alt || !youtubeUrl) {
      res.status(400).json({ success: false, error: 'Titre, alt et URL YouTube requis' });
      return;
    }

    const youtubeId = extractYoutubeId(youtubeUrl);
    if (!youtubeId) {
      res.status(400).json({ success: false, error: 'URL YouTube invalide' });
      return;
    }

    const item = await Gallery.create({
      title,
      alt,
      caption: caption || '',
      type: 'youtube',
      url: youtubeUrl,
      thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
      youtubeId,
      date: new Date(),
      order: order ? parseInt(order, 10) : 0,
    });

    res.status(201).json({ success: true, data: item });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── PUT /api/v1/gallery/:id — admin ──────────────────────────────────────────
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { title, alt, caption, order, active } = req.body;
    const update: Record<string, any> = {};
    if (title !== undefined) update.title = title;
    if (alt !== undefined) update.alt = alt;
    if (caption !== undefined) update.caption = caption;
    if (order !== undefined) update.order = parseInt(order, 10);
    if (active !== undefined) update.active = active;

    const item = await Gallery.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!item) {
      res.status(404).json({ success: false, error: 'Element non trouve' });
      return;
    }
    res.json({ success: true, data: item });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── DELETE /api/v1/gallery/:id — admin ───────────────────────────────────────
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      res.status(404).json({ success: false, error: 'Element non trouve' });
      return;
    }

    // Delete file from disk if local
    if (item.type !== 'youtube' && item.url.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), item.url);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await item.deleteOne();
    res.json({ success: true, message: 'Element supprime avec succes' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
