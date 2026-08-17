import { useState } from 'react';
import { useAdminData } from '../../context/adminData';
import type { NewsArticle, NewsImage } from '../../types';

const emptyArticle: Omit<NewsArticle, 'id'> = {
  title: '',
  excerpt: '',
  content: '',
  date: '',
  category: 'Protection',
  color: 'ba-red',
  image: '',
  images: [],
};

/* Compress image using HTML5 canvas to keep size under 150KB for fast saving */
function compressImage(file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.82): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const srcUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(srcUrl);
        }
      };
      img.onerror = () => resolve(srcUrl);
      img.src = srcUrl;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

export default function NewsManager() {
  const { data, addNews, updateNews, deleteNews } = useAdminData();
  const [editing, setEditing] = useState<NewsArticle | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [form, setForm] = useState(emptyArticle);
  const [isUploading, setIsUploading] = useState(false);

  const openAdd = () => {
    const now = new Date();
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const dateStr = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
    setForm({ ...emptyArticle, date: dateStr });
    setIsAdding(true);
    setEditing(null);
  };

  const openEdit = (item: NewsArticle) => {
    setForm({
      title: item.title,
      excerpt: item.excerpt,
      content: item.content || item.excerpt,
      date: item.date,
      category: item.category || 'Protection',
      color: item.color || 'ba-red',
      image: item.image || '',
      images: item.images || (item.image ? [{ id: '1', url: item.image, caption: 'Photo principale' }] : []),
    });
    setEditing(item);
    setIsAdding(false);
  };

  const handleSave = () => {
    if (!form.title.trim()) {
      alert("Veuillez entrer le titre de l'article.");
      return;
    }

    const firstPhotoUrl = form.images && form.images.length > 0 ? form.images[0].url : '';
    const coverUrl = form.image || firstPhotoUrl;

    const articleData: Omit<NewsArticle, 'id'> = {
      ...form,
      image: coverUrl,
      content: form.content || form.excerpt,
    };

    if (editing) {
      updateNews(editing.id, articleData);
    } else {
      addNews(articleData);
    }
    closeModal();
  };

  const closeModal = () => {
    setEditing(null);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    deleteNews(id);
    setDeleteConfirm(null);
  };

  /* Compress & Upload multiple photos */
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      const uploadPromises = Array.from(files).map((file) => compressImage(file));
      const compressedDataUrls = await Promise.all(uploadPromises);

      setForm((prev) => {
        const currentImages = prev.images || [];
        const newImages: NewsImage[] = compressedDataUrls
          .filter((url) => Boolean(url))
          .map((url, idx) => ({
            id: String(Date.now() + Math.random() + idx),
            url,
            caption: files[idx] ? files[idx].name.replace(/\.[^/.]+$/, '') : `Photo ${currentImages.length + idx + 1}`,
          }));

        const updatedImages = [...currentImages, ...newImages];
        const coverImage = prev.image || (updatedImages.length > 0 ? updatedImages[0].url : '');

        return {
          ...prev,
          images: updatedImages,
          image: coverImage,
        };
      });
    } catch (err) {
      console.error('Failed to compress images:', err);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const removePhoto = (photoId: string) => {
    setForm((prev) => {
      const updatedImages = (prev.images || []).filter((img) => img.id !== photoId);
      const coverImage = prev.image === (prev.images || []).find((img) => img.id === photoId)?.url
        ? (updatedImages.length > 0 ? updatedImages[0].url : '')
        : prev.image;
      return {
        ...prev,
        images: updatedImages,
        image: coverImage,
      };
    });
  };

  const setAsCover = (url: string) => {
    setForm((prev) => ({ ...prev, image: url }));
  };

  const insertPhotoTagIntoContent = (index: number) => {
    const tag = `\n[photo:${index + 1}]\n`;
    setForm((prev) => ({
      ...prev,
      content: (prev.content || prev.excerpt) + tag,
    }));
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <p style={{ color: '#E5E7EB', fontSize: '0.875rem' }}>
          Gérez les articles d'actualité, communiqués et photos d'illustration.
        </p>
        <button className="admin-btn admin-btn-red" onClick={openAdd}>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nouvelle Actualité
        </button>
      </div>

      {/* Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Photo</th>
                <th>Titre</th>
                <th>Catégorie</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.news.map((article) => {
                const photoCount = article.images ? article.images.length : article.image ? 1 : 0;
                return (
                  <tr key={article.id}>
                    <td>
                      {article.image ? (
                        <div style={{ width: '56px', height: '42px', borderRadius: '8px', overflow: 'hidden', background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <img src={article.image} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ) : (
                        <div style={{ width: '56px', height: '42px', borderRadius: '8px', background: '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
                          <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                          </svg>
                        </div>
                      )}
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: 600, color: '#FFFFFF', marginBottom: '0.25rem' }}>{article.title}</div>
                        <div style={{ fontSize: '0.8rem', color: '#94A3B8', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {article.excerpt}
                        </div>
                        {photoCount > 0 && (
                          <div style={{ fontSize: '0.7rem', color: '#38BDF8', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <svg style={{ width: '12px', height: '12px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                            </svg>
                            {photoCount} photo{photoCount > 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: '#E2E8F0', fontWeight: 600, padding: '0.25rem 0.6rem', borderRadius: '9999px', background: article.color === 'ba-red' ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)' }}>
                        {article.category}
                      </span>
                    </td>
                    <td style={{ whiteSpace: 'nowrap', color: '#FFFFFF', fontSize: '0.85rem' }}>
                      {article.date}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button onClick={() => openEdit(article)} style={{ background: 'none', border: 'none', color: '#38BDF8', cursor: 'pointer', fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: '0.8rem', padding: '0.375rem 0' }}>
                          Modifier
                        </button>
                        <button onClick={() => setDeleteConfirm(article.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '0.375rem', display: 'flex', alignItems: 'center' }}>
                          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {data.news.length === 0 && (
          <div className="admin-empty">
            <div className="admin-empty-icon">
              <svg width="28" height="28" fill="none" stroke="#475569" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25" />
              </svg>
            </div>
            <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Aucune actualité. Cliquez sur "Nouvelle Actualité" pour en publier une.</p>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {(isAdding || editing) && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" style={{ maxWidth: '780px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">
                {editing ? 'Modifier l\'article' : 'Nouvelle actualité'}
              </h2>
              <button className="admin-modal-close" onClick={closeModal}>
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="admin-modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* Titre */}
                <div>
                  <label className="admin-label">Titre de l'article *</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Ex: Distribution de fournitures scolaires à Goma"
                  />
                </div>

                {/* Extrait / Résumé */}
                <div>
                  <label className="admin-label">Extrait / Résumé court (affiché sur la carte)</label>
                  <textarea
                    className="admin-textarea"
                    rows={2}
                    value={form.excerpt}
                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                    placeholder="Résumé synthétique en 2-3 phrases..."
                  />
                </div>

                {/* PHOTOS (Couverture + Galerie) */}
                <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '1rem', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#F1F5F9', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <svg style={{ width: '16px', height: '16px', color: '#94A3B8' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                        </svg>
                        Photos de l'article
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                        Téléchargez la photo de couverture et des photos d'illustration.
                      </div>
                    </div>

                    <label style={{ cursor: isUploading ? 'not-allowed' : 'pointer', opacity: isUploading ? 0.6 : 1 }}>
                        <span className="admin-btn admin-btn-ghost" style={{ fontSize: '0.825rem', padding: '0.4rem 0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          {isUploading ? 'Compression...' : (
                            <>
                              <svg style={{ width: '13px', height: '13px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                              </svg>
                              Ajouter des photos
                            </>
                          )}
                        </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>

                  {/* Galerie de photos téléversées */}
                  {form.images && form.images.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.85rem' }}>
                      {form.images.map((img, idx) => {
                        const isCover = form.image === img.url || (!form.image && idx === 0);
                        return (
                          <div
                            key={img.id || idx}
                            style={{
                              position: 'relative',
                              borderRadius: '0.75rem',
                              overflow: 'hidden',
                              border: isCover ? '2px solid #22C55E' : '1px solid rgba(255,255,255,0.15)',
                              background: '#1E293B',
                            }}
                          >
                            <div style={{ height: '110px', width: '100%', position: 'relative' }}>
                              <img src={img.url} alt={img.caption || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              {isCover && (
                                <span style={{ position: 'absolute', top: 6, left: 6, background: '#22C55E', color: '#000', fontWeight: 700, fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px' }}>
                                  Couverture
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => removePhoto(img.id)}
                                style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(239,68,68,0.85)', border: 'none', color: '#fff', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                title="Supprimer la photo"
                              >
                                ✕
                              </button>
                            </div>

                            <div style={{ padding: '0.5rem' }}>
                              <input
                                type="text"
                                value={img.caption || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setForm((prev) => ({
                                    ...prev,
                                    images: (prev.images || []).map((im, i) => i === idx ? { ...im, caption: val } : im),
                                  }));
                                }}
                                placeholder="Légende..."
                                style={{ width: '100%', fontSize: '0.75rem', background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '4px', padding: '3px 6px', marginBottom: '0.4rem' }}
                              />

                              <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'space-between' }}>
                                {!isCover && (
                                  <button
                                    type="button"
                                    onClick={() => setAsCover(img.url)}
                                    style={{ fontSize: '0.68rem', color: '#22C55E', background: 'rgba(34,197,94,0.15)', border: 'none', padding: '2px 6px', borderRadius: '4px', cursor: 'pointer' }}
                                  >
                                    En couverture
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => insertPhotoTagIntoContent(idx)}
                                  style={{ fontSize: '0.68rem', color: '#38BDF8', background: 'rgba(56,189,248,0.15)', border: 'none', padding: '2px 6px', borderRadius: '4px', cursor: 'pointer', marginLeft: 'auto' }}
                                  title="Insérer [photo:X] dans le texte"
                                >
                                  + Insérer [photo:{idx + 1}]
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '1.25rem', border: '2px dashed rgba(255,255,255,0.15)', borderRadius: '0.75rem', color: '#64748B', fontSize: '0.85rem' }}>
                      Aucune photo téléversée. Cliquez sur "Ajouter des photos" ci-dessus.
                    </div>
                  )}
                </div>

                {/* Contenu complet avec insertion de photos */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <label className="admin-label" style={{ marginBottom: 0 }}>Texte détaillé de l'article</label>
                    {form.images && form.images.length > 0 && (
                       <span style={{ fontSize: '0.75rem', color: '#38BDF8', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <svg style={{ width: '12px', height: '12px', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                        </svg>
                        Utilisez les boutons "+ Insérer [photo:X]" ci-dessus pour afficher une photo entre deux paragraphes.
                       </span>
                    )}
                  </div>
                  <textarea
                    className="admin-textarea"
                    rows={8}
                    value={form.content || form.excerpt}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    placeholder="Rédigez ici l'article complet. Vous pouvez insérer [photo:1], [photo:2] là où vous voulez qu'une photo apparaisse dans le texte."
                  />
                </div>

                {/* Date et Catégorie */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="admin-label">Date</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      placeholder="Ex: 15 Juil 2026"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Catégorie</label>
                    <select
                      className="admin-select"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                    >
                      <option value="Protection">Protection</option>
                      <option value="Santé">Santé</option>
                      <option value="Éducation">Éducation</option>
                      <option value="Environnement">Environnement</option>
                      <option value="Général">Général</option>
                    </select>
                  </div>
                  <div>
                    <label className="admin-label">Couleur d'accent</label>
                    <select
                      className="admin-select"
                      value={form.color}
                      onChange={(e) => setForm({ ...form, color: e.target.value as 'ba-red' | 'ba-green' })}
                    >
                      <option value="ba-red">Rouge Bright</option>
                      <option value="ba-green">Vert Bright</option>
                    </select>
                  </div>
                </div>

              </div>
            </div>

            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-ghost" onClick={closeModal}>Annuler</button>
              <button className="admin-btn admin-btn-green" onClick={handleSave}>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {editing ? 'Sauvegarder' : 'Publier'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="admin-confirm-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="admin-confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div style={{ width: 56, height: 56, borderRadius: '1rem', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <svg width="28" height="28" fill="none" stroke="#EF4444" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.125rem', color: '#F1F5F9', marginBottom: '0.5rem' }}>
              Supprimer cet article ?
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Cette action est irréversible.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button className="admin-btn admin-btn-ghost" onClick={() => setDeleteConfirm(null)}>Annuler</button>
              <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(deleteConfirm)}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
