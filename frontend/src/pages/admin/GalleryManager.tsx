import { useState, useEffect, useRef, useCallback } from 'react';

interface GalleryItem {
  _id: string;
  title: string;
  alt: string;
  caption?: string;
  type: 'image' | 'video' | 'youtube';
  url: string;
  thumbnailUrl?: string;
  youtubeId?: string;
  date: string;
  order: number;
  active: boolean;
  fileSize?: number;
  mimeType?: string;
}

interface UploadFile {
  file: File;
  title: string;
  alt: string;
  caption: string;
  progress: number;
  status: 'pending' | 'uploading' | 'done' | 'error';
  error?: string;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;  // 5 MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100 MB

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('adminToken') || 'admin-session-active';
  return { Authorization: `Bearer ${token}` };
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ─── Delete confirm modal ─────────────────────────────────────────────────────
function DeleteModal({ item, onConfirm, onCancel }: { item: GalleryItem; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            </svg>
          </div>
          <div>
            <h3 className="font-heading font-bold text-gray-900">Confirmer la suppression</h3>
            <p className="text-sm text-gray-500 mt-0.5">Cette action est irreversible.</p>
          </div>
        </div>
        <p className="text-sm text-gray-700 mb-6">
          Supprimer <strong>"{item.title}"</strong> ?
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            Annuler
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold text-white transition-colors">
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Edit modal ───────────────────────────────────────────────────────────────
function EditModal({ item, onSave, onCancel }: {
  item: GalleryItem;
  onSave: (data: { title: string; alt: string; caption: string; order: number; active: boolean }) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(item.title);
  const [alt, setAlt] = useState(item.alt);
  const [caption, setCaption] = useState(item.caption || '');
  const [order, setOrder] = useState(item.order);
  const [active, setActive] = useState(item.active);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-lg w-full mx-4">
        <h3 className="font-heading font-bold text-gray-900 text-lg mb-5">Modifier l&rsquo;element</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Titre <span className="text-red-500">*</span></label>
            <input value={title} onChange={e => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Texte alternatif (alt) <span className="text-red-500">*</span></label>
            <input value={alt} onChange={e => setAlt(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Legende</label>
            <input value={caption} onChange={e => setCaption(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Ordre</label>
              <input type="number" value={order} onChange={e => setOrder(parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} className="w-4 h-4 accent-[var(--color-primary)]" />
                <span className="text-sm font-semibold text-gray-700">Visible</span>
              </label>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onCancel}
            className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            Annuler
          </button>
          <button onClick={() => onSave({ title, alt, caption, order, active })}
            disabled={!title || !alt}
            className="flex-1 py-2.5 bg-[var(--color-primary)] hover:opacity-90 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-50">
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Admin Gallery Manager ───────────────────────────────────────────────
export default function GalleryManager() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeTitle, setYoutubeTitle] = useState('');
  const [youtubeAlt, setYoutubeAlt] = useState('');
  const [youtubeCaption, setYoutubeCaption] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
  const [editTarget, setEditTarget] = useState<GalleryItem | null>(null);
  const [tab, setTab] = useState<'upload' | 'youtube'>('upload');
  const [notification, setNotification] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  // Fetch all items
  const fetchItems = useCallback(async () => {
    try {
      const r = await fetch(`${API_BASE}/api/v1/gallery/all`, { headers: getAuthHeader() });
      const d = await r.json();
      if (d.success) setItems(d.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  // File validation
  const validateFile = (file: File): string | null => {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    if (!isImage && !isVideo) return `Type non supporte: ${file.type}`;
    if (isImage && file.size > MAX_IMAGE_SIZE) return `Image trop grande (max 5 Mo, fichier: ${formatBytes(file.size)})`;
    if (isVideo && file.size > MAX_VIDEO_SIZE) return `Video trop grande (max 100 Mo, fichier: ${formatBytes(file.size)})`;
    return null;
  };

  const addFiles = (files: FileList | File[]) => {
    const arr = Array.from(files);
    const newUploads: UploadFile[] = arr.map(file => {
      const validErr = validateFile(file);
      return {
        file,
        title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        alt: '',
        caption: '',
        progress: 0,
        status: validErr ? 'error' : 'pending',
        error: validErr || undefined,
      };
    });
    setUploadFiles(prev => [...prev, ...newUploads]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
  };

  const updateUploadField = (idx: number, field: keyof UploadFile, value: string) => {
    setUploadFiles(prev => prev.map((u, i) => i === idx ? { ...u, [field]: value } : u));
  };

  const removeUploadFile = (idx: number) => {
    setUploadFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const uploadSingle = async (idx: number) => {
    const uf = uploadFiles[idx];
    if (!uf.title || !uf.alt) {
      setUploadFiles(prev => prev.map((u, i) => i === idx ? { ...u, error: 'Titre et alt requis', status: 'error' } : u));
      return;
    }
    setUploadFiles(prev => prev.map((u, i) => i === idx ? { ...u, status: 'uploading', progress: 0 } : u));

    const formData = new FormData();
    formData.append('file', uf.file);
    formData.append('title', uf.title);
    formData.append('alt', uf.alt);
    formData.append('caption', uf.caption);

    try {
      // Simulate progress (XHR would be more accurate but fetch is simpler)
      const interval = setInterval(() => {
        setUploadFiles(prev => prev.map((u, i) => i === idx && u.progress < 85 ? { ...u, progress: u.progress + 15 } : u));
      }, 200);

      const r = await fetch(`${API_BASE}/api/v1/gallery/upload`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: formData,
      });
      clearInterval(interval);
      const d = await r.json();
      if (d.success) {
        setUploadFiles(prev => prev.map((u, i) => i === idx ? { ...u, status: 'done', progress: 100 } : u));
        fetchItems();
        notify('Fichier uploade avec succes');
      } else {
        setUploadFiles(prev => prev.map((u, i) => i === idx ? { ...u, status: 'error', error: d.error, progress: 0 } : u));
      }
    } catch {
      setUploadFiles(prev => prev.map((u, i) => i === idx ? { ...u, status: 'error', error: 'Erreur reseau', progress: 0 } : u));
    }
  };

  const uploadAll = async () => {
    const pending = uploadFiles.map((u, i) => ({ u, i })).filter(x => x.u.status === 'pending');
    for (const { i } of pending) await uploadSingle(i);
  };

  const addYoutube = async () => {
    if (!youtubeUrl || !youtubeTitle || !youtubeAlt) {
      notify('URL, titre et alt requis');
      return;
    }
    try {
      const r = await fetch(`${API_BASE}/api/v1/gallery/youtube`, {
        method: 'POST',
        headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ youtubeUrl, title: youtubeTitle, alt: youtubeAlt, caption: youtubeCaption }),
      });
      const d = await r.json();
      if (d.success) {
        setYoutubeUrl(''); setYoutubeTitle(''); setYoutubeAlt(''); setYoutubeCaption('');
        fetchItems();
        notify('Video YouTube ajoutee');
      } else {
        notify(d.error || 'Erreur');
      }
    } catch {
      notify('Erreur reseau');
    }
  };

  const handleDelete = async (item: GalleryItem) => {
    try {
      await fetch(`${API_BASE}/api/v1/gallery/${item._id}`, {
        method: 'DELETE', headers: getAuthHeader(),
      });
      setItems(prev => prev.filter(i => i._id !== item._id));
      setDeleteTarget(null);
      notify('Element supprime');
    } catch {
      notify('Erreur lors de la suppression');
    }
  };

  const handleEdit = async (data: { title: string; alt: string; caption: string; order: number; active: boolean }) => {
    if (!editTarget) return;
    try {
      const r = await fetch(`${API_BASE}/api/v1/gallery/${editTarget._id}`, {
        method: 'PUT',
        headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const d = await r.json();
      if (d.success) {
        setItems(prev => prev.map(i => i._id === editTarget._id ? d.data : i));
        setEditTarget(null);
        notify('Element modifie');
      }
    } catch {
      notify('Erreur lors de la modification');
    }
  };

  const thumb = (item: GalleryItem) => {
    if (item.type === 'youtube') return item.thumbnailUrl || `https://img.youtube.com/vi/${item.youtubeId}/default.jpg`;
    if (item.url.startsWith('/')) return `${API_BASE}${item.url}`;
    return item.url;
  };

  const pendingCount = uploadFiles.filter(u => u.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[var(--color-primary)] text-white px-6 py-5 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-heading font-black text-xl uppercase tracking-wider">Gestion de la Galerie</h1>
            <p className="text-white/70 text-sm mt-0.5">{items.length} element{items.length !== 1 ? 's' : ''} au total</p>
          </div>
          <a href="/galerie" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 rounded-lg text-sm font-semibold transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
            Voir la galerie
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Notification */}
        {notification && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm font-semibold">
            {notification}
          </div>
        )}

        {/* ── Upload section ── */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-heading font-bold text-gray-900 text-base uppercase tracking-wider mb-5">
            Ajouter des medias
          </h2>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {(['upload', 'youtube'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === t ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {t === 'upload' ? 'Photos / Videos' : 'Lien YouTube'}
              </button>
            ))}
          </div>

          {tab === 'upload' ? (
            <div className="space-y-4">
              {/* Drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${isDragging ? 'border-[var(--color-primary)] bg-blue-50' : 'border-gray-300 hover:border-[var(--color-primary)] hover:bg-blue-50/30'}`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                  className={`w-12 h-12 mx-auto mb-3 ${isDragging ? 'text-[var(--color-primary)]' : 'text-gray-400'}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <p className="font-semibold text-gray-700">Glissez-deposez vos fichiers ici</p>
                <p className="text-sm text-gray-400 mt-1">ou cliquez pour selectionner</p>
                <p className="text-xs text-gray-400 mt-2">JPG, PNG, WEBP (max 5 Mo) — MP4 (max 100 Mo)</p>
                <input ref={fileInputRef} type="file" multiple accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
                  className="hidden" onChange={handleFileInput} />
              </div>

              {/* File list */}
              {uploadFiles.length > 0 && (
                <div className="space-y-3">
                  {uploadFiles.map((uf, idx) => (
                    <div key={idx} className={`border rounded-lg p-4 ${uf.status === 'error' ? 'border-red-200 bg-red-50' : uf.status === 'done' ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                          {uf.file.type.startsWith('image/') ? (
                            <img src={URL.createObjectURL(uf.file)} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-gray-400">
                              <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs text-gray-500 truncate">{uf.file.name} ({formatBytes(uf.file.size)})</span>
                            {uf.status === 'done' ? (
                              <span className="text-xs font-semibold text-green-700 shrink-0">Termine</span>
                            ) : uf.status === 'error' ? (
                              <span className="text-xs font-semibold text-red-600 shrink-0">Erreur</span>
                            ) : null}
                            <button onClick={() => removeUploadFile(idx)} aria-label="Supprimer" className="text-gray-400 hover:text-red-500 shrink-0">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                              </svg>
                            </button>
                          </div>
                          {uf.status === 'error' && uf.error && (
                            <p className="text-xs text-red-600">{uf.error}</p>
                          )}
                          {uf.status !== 'error' && uf.status !== 'done' && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <input placeholder="Titre *" value={uf.title}
                                onChange={e => updateUploadField(idx, 'title', e.target.value)}
                                className="border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
                              <input placeholder="Texte alt *" value={uf.alt}
                                onChange={e => updateUploadField(idx, 'alt', e.target.value)}
                                className="border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
                              <input placeholder="Legende (optionnel)" value={uf.caption}
                                onChange={e => updateUploadField(idx, 'caption', e.target.value)}
                                className="border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" />
                            </div>
                          )}
                          {/* Progress bar */}
                          {uf.status === 'uploading' && (
                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-200" style={{ width: `${uf.progress}%` }} />
                            </div>
                          )}
                        </div>
                        {uf.status === 'pending' && (
                          <button onClick={() => uploadSingle(idx)}
                            className="shrink-0 px-3 py-1.5 bg-[var(--color-primary)] text-white text-xs font-semibold rounded hover:opacity-90 transition-opacity">
                            Uploader
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {pendingCount > 1 && (
                    <button onClick={uploadAll}
                      className="w-full py-2.5 bg-[var(--color-primary)] text-white text-sm font-bold uppercase tracking-wider rounded-lg hover:opacity-90 transition-opacity">
                      Uploader tous ({pendingCount} fichiers)
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* YouTube form */
            <div className="space-y-4 max-w-lg">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">URL YouTube <span className="text-red-500">*</span></label>
                <input value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Titre <span className="text-red-500">*</span></label>
                <input value={youtubeTitle} onChange={e => setYoutubeTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Texte alt <span className="text-red-500">*</span></label>
                <input value={youtubeAlt} onChange={e => setYoutubeAlt(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Legende</label>
                <input value={youtubeCaption} onChange={e => setYoutubeCaption(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
              </div>
              <button onClick={addYoutube}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors">
                Ajouter la video YouTube
              </button>
            </div>
          )}
        </section>

        {/* ── Media table ── */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-heading font-bold text-gray-900 text-base uppercase tracking-wider">
              Medias ({items.length})
            </h2>
            <button onClick={fetchItems} aria-label="Rafraichir"
              className="p-2 text-gray-400 hover:text-[var(--color-primary)] transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
                <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
              </svg>
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="font-semibold">Aucun media pour l&rsquo;instant</p>
              <p className="text-sm mt-1">Ajoutez des photos ou videos ci-dessus</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-4 py-3 w-16">Apercu</th>
                    <th className="px-4 py-3">Titre / Alt</th>
                    <th className="px-4 py-3 hidden md:table-cell">Type</th>
                    <th className="px-4 py-3 hidden lg:table-cell">Date</th>
                    <th className="px-4 py-3 hidden lg:table-cell">Ordre</th>
                    <th className="px-4 py-3 hidden md:table-cell">Visible</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map(item => (
                    <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 shrink-0">
                          <img src={thumb(item)} alt={item.alt}
                            className="w-full h-full object-cover" loading="lazy" />
                        </div>
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <p className="font-semibold text-gray-900 truncate">{item.title}</p>
                        <p className="text-gray-400 text-xs truncate mt-0.5">{item.alt}</p>
                        {item.caption && <p className="text-gray-400 text-xs truncate italic">{item.caption}</p>}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
                          item.type === 'image' ? 'bg-blue-100 text-blue-700' :
                          item.type === 'youtube' ? 'bg-red-100 text-red-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {item.type === 'image' ? 'Photo' : item.type === 'youtube' ? 'YouTube' : 'Video'}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-gray-500 text-xs">{formatDate(item.date)}</td>
                      <td className="px-4 py-3 hidden lg:table-cell text-gray-500 text-center">{item.order}</td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={`inline-block w-2.5 h-2.5 rounded-full ${item.active ? 'bg-green-500' : 'bg-gray-300'}`} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setEditTarget(item)} aria-label="Modifier"
                            className="p-1.5 text-gray-400 hover:text-[var(--color-primary)] transition-colors">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                          </button>
                          <button onClick={() => setDeleteTarget(item)} aria-label="Supprimer"
                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* Modals */}
      {deleteTarget && (
        <DeleteModal item={deleteTarget} onConfirm={() => handleDelete(deleteTarget)} onCancel={() => setDeleteTarget(null)} />
      )}
      {editTarget && (
        <EditModal item={editTarget} onSave={handleEdit} onCancel={() => setEditTarget(null)} />
      )}
    </div>
  );
}
