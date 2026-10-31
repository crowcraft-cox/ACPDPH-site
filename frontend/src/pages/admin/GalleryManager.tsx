import { useState, useRef } from 'react';
import { useAdminData } from '../../context/adminData';
import type { GalleryItem } from '../../types';
import {
  extractYoutubeId,
  getYoutubeThumbnail,
  detectMediaType,
  aggregateAllGalleryItems,
} from '../../utils/galleryAggregator';

/* Compression d'image via canvas HTML5 */
function compressImage(file: File, maxWidth = 1400, maxHeight = 1400, quality = 0.82): Promise<string> {
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

function formatDate(dateStr?: string) {
  if (!dateStr) return 'Date non spécifiée';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function GalleryManager() {
  const { data, gallery, addGalleryItem, updateGalleryItem, deleteGalleryItem } = useAdminData();

  // Onglet courant : 'manual' (médias galerie), 'sync' (médias synchronisés projets/actualités), 'all' (aperçu complet)
  const [activeTab, setActiveTab] = useState<'manual' | 'sync' | 'all'>('manual');

  // Modales
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);

  // Formulaire ajout Image
  const [imageFiles, setImageFiles] = useState<{ file: File; dataUrl: string; title: string; caption: string; alt: string }[]>([]);
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);
  const [imageManualUrl, setImageManualUrl] = useState('');
  const [imageManualTitle, setImageManualTitle] = useState('');
  const [imageManualCaption, setImageManualCaption] = useState('');
  const [imageManualAlt, setImageManualAlt] = useState('');

  // Formulaire ajout Vidéo
  const [videoMode, setVideoMode] = useState<'youtube' | 'file' | 'url'>('youtube');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoCaption, setVideoCaption] = useState('');
  const [videoAlt, setVideoAlt] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  // Formulaire édition
  const [editTitle, setEditTitle] = useState('');
  const [editCaption, setEditCaption] = useState('');
  const [editAlt, setEditAlt] = useState('');
  const [editOrder, setEditOrder] = useState(0);
  const [editActive, setEditActive] = useState(true);

  // Notification
  const [notification, setNotification] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  // Médias automatiques agrégés (projets, actualités, domaines)
  const autoSyncedItems = aggregateAllGalleryItems(data.projects, data.news, data.pillars, []).filter(
    (item) => item.sourceCategory !== 'Galerie'
  );

  // Tous les médias publics combinés
  const allAggregatedItems = aggregateAllGalleryItems(data.projects, data.news, data.pillars, gallery);

  // ── Gestion de la sélection de fichiers images depuis l'appareil ──
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessingFiles(true);
    try {
      const newItems: { file: File; dataUrl: string; title: string; caption: string; alt: string }[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;
        const compressed = await compressImage(file);
        const defaultName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        newItems.push({
          file,
          dataUrl: compressed,
          title: defaultName,
          caption: '',
          alt: defaultName,
        });
      }
      setImageFiles((prev) => [...prev, ...newItems]);
    } catch (err) {
      console.error('Erreur compression image:', err);
      notify('Erreur lors de la lecture des fichiers.');
    } finally {
      setIsProcessingFiles(false);
      e.target.value = '';
    }
  };

  // Enregistrer les photos sélectionnées
  const handleSaveImages = async () => {
    if (imageFiles.length === 0 && !imageManualUrl.trim()) {
      notify('Veuillez sélectionner au moins une image ou entrer une URL.');
      return;
    }

    try {
      // Images depuis fichiers locaux
      for (const item of imageFiles) {
        if (!item.dataUrl) continue;
        await addGalleryItem({
          title: item.title.trim() || 'Photo sans titre',
          alt: item.alt.trim() || item.title.trim() || 'Photo galerie',
          caption: item.caption.trim() || undefined,
          type: 'image',
          url: item.dataUrl,
          date: new Date().toISOString(),
          order: 0,
          active: true,
          sourceCategory: 'Galerie',
        });
      }

      // Image manuelle par URL
      if (imageManualUrl.trim()) {
        const type = detectMediaType(imageManualUrl.trim());
        await addGalleryItem({
          title: imageManualTitle.trim() || 'Photo galerie',
          alt: imageManualAlt.trim() || imageManualTitle.trim() || 'Photo galerie',
          caption: imageManualCaption.trim() || undefined,
          type,
          url: imageManualUrl.trim(),
          date: new Date().toISOString(),
          order: 0,
          active: true,
          sourceCategory: 'Galerie',
        });
      }

      notify(`${imageFiles.length + (imageManualUrl ? 1 : 0)} photo(s) ajoutée(s) à la galerie avec succès.`);
      setImageFiles([]);
      setImageManualUrl('');
      setImageManualTitle('');
      setImageManualCaption('');
      setImageManualAlt('');
      setIsAddingImage(false);
    } catch (err) {
      console.error('Erreur ajout galerie:', err);
      notify('Une erreur est survenue lors de l\'enregistrement.');
    }
  };

  // ── Gestion de l'ajout de vidéo ──
  const handleSaveVideo = async () => {
    if (!videoUrl.trim()) {
      notify('Veuillez renseigner l\'URL de la vidéo ou le lien YouTube.');
      return;
    }

    try {
      const url = videoUrl.trim();
      const ytId = extractYoutubeId(url);
      const isYoutube = Boolean(ytId);
      const type = isYoutube ? 'youtube' : 'video';

      await addGalleryItem({
        title: videoTitle.trim() || (isYoutube ? 'Vidéo YouTube' : 'Vidéo ACPDPH'),
        alt: videoAlt.trim() || videoTitle.trim() || 'Vidéo ACPDPH',
        caption: videoCaption.trim() || undefined,
        type,
        url,
        youtubeId: ytId || undefined,
        thumbnailUrl: ytId ? getYoutubeThumbnail(ytId) : undefined,
        date: new Date().toISOString(),
        order: 0,
        active: true,
        sourceCategory: 'Galerie',
      });

      notify('Vidéo ajoutée à la galerie avec succès.');
      setVideoUrl('');
      setVideoTitle('');
      setVideoCaption('');
      setVideoAlt('');
      setIsAddingVideo(false);
    } catch (err) {
      console.error('Erreur ajout vidéo:', err);
      notify('Erreur lors de l\'ajout de la vidéo.');
    }
  };

  // ── Ouvrir édition ──
  const openEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditCaption(item.caption || '');
    setEditAlt(item.alt || '');
    setEditOrder(item.order || 0);
    setEditActive(item.active !== false);
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;
    updateGalleryItem(editingItem._id, {
      title: editTitle.trim() || editingItem.title,
      caption: editCaption.trim() || undefined,
      alt: editAlt.trim() || editingItem.alt,
      order: editOrder,
      active: editActive,
    });
    setEditingItem(null);
    notify('Élément mis à jour avec succès.');
  };

  // ── Suppression ──
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteGalleryItem(deleteTarget._id);
    setDeleteTarget(null);
    notify('Élément supprimé de la galerie.');
  };

  return (
    <div>
      {/* Toast Notification */}
      {notification && (
        <div style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 100, background: '#1D4ED8', color: '#FFFFFF', padding: '0.75rem 1.25rem', borderRadius: '0.625rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          {notification}
        </div>
      )}

      {/* Header & Boutons d'action */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
            Gestion de la Galerie & Médias
          </h2>
          <p style={{ color: '#E5E7EB', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Ajoutez des images/vidéos manuellement ou visualisez les médias automatiquement synchronisés depuis les Projets, Domaines d'intervention et Actualités.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="admin-btn admin-btn-blue" onClick={() => setIsAddingImage(true)}>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18" />
            </svg>
            Ajouter des photos
          </button>
          <button className="admin-btn admin-btn-ghost" onClick={() => setIsAddingVideo(true)}>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
            </svg>
            Ajouter une vidéo
          </button>
        </div>
      </div>

      {/* Cartes statistiques */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="admin-stat-card" style={{ cursor: 'default' }}>
          <div className="admin-stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)' }}>
            <svg width="22" height="22" fill="none" stroke="#60A5FA" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18" />
            </svg>
          </div>
          <div>
            <div className="admin-stat-value" style={{ color: '#60A5FA' }}>{allAggregatedItems.length}</div>
            <div className="admin-stat-label">Total médias publics</div>
          </div>
        </div>

        <div className="admin-stat-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('manual')}>
          <div className="admin-stat-icon" style={{ background: 'rgba(194, 83, 10, 0.15)' }}>
            <svg width="22" height="22" fill="none" stroke="#FB923C" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <div>
            <div className="admin-stat-value" style={{ color: '#FB923C' }}>{gallery.length}</div>
            <div className="admin-stat-label">Ajoutés manuellement</div>
          </div>
        </div>

        <div className="admin-stat-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('sync')}>
          <div className="admin-stat-icon" style={{ background: 'rgba(34, 197, 94, 0.15)' }}>
            <svg width="22" height="22" fill="none" stroke="#4ADE80" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </div>
          <div>
            <div className="admin-stat-value" style={{ color: '#4ADE80' }}>{autoSyncedItems.length}</div>
            <div className="admin-stat-label">Synchronisés (Projets, Actualités, Piliers)</div>
          </div>
        </div>
      </div>

      {/* Onglets de navigation interne */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
        <button
          className={`admin-btn ${activeTab === 'manual' ? 'admin-btn-blue' : 'admin-btn-ghost'}`}
          onClick={() => setActiveTab('manual')}
        >
          Médias Galerie ({gallery.length})
        </button>
        <button
          className={`admin-btn ${activeTab === 'sync' ? 'admin-btn-blue' : 'admin-btn-ghost'}`}
          onClick={() => setActiveTab('sync')}
        >
          Médias Synchronisés Auto ({autoSyncedItems.length})
        </button>
        <button
          className={`admin-btn ${activeTab === 'all' ? 'admin-btn-blue' : 'admin-btn-ghost'}`}
          onClick={() => setActiveTab('all')}
        >
          Vue Complète Galerie Publique ({allAggregatedItems.length})
        </button>
      </div>

      {/* ── ONGLET 1 : Médias Galerie ajoutés manuellement ── */}
      {activeTab === 'manual' && (
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Aperçu</th>
                  <th>Titre & Légende</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Statut</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {gallery.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div style={{ width: '56px', height: '42px', borderRadius: '6px', overflow: 'hidden', background: '#111827', position: 'relative', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <img
                          src={item.thumbnailUrl || item.url}
                          alt={item.alt}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        {item.type !== 'image' && (
                          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{item.title}</div>
                        {item.caption && (
                          <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '2px', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {item.caption}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', background: item.type === 'youtube' ? 'rgba(239, 68, 68, 0.2)' : item.type === 'video' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.1)', color: item.type === 'youtube' ? '#EF4444' : item.type === 'video' ? '#60A5FA' : '#E5E7EB' }}>
                        {item.type === 'youtube' ? 'YouTube' : item.type === 'video' ? 'Vidéo' : 'Photo'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#E5E7EB' }}>{formatDate(item.date)}</td>
                    <td>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: item.active !== false ? '#4ADE80' : '#9CA3AF' }}>
                        {item.active !== false ? 'Visible' : 'Masqué'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => openEdit(item)}
                          style={{ background: 'none', border: 'none', color: '#60A5FA', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '0.25rem' }}
                        >
                          <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {gallery.length === 0 && (
            <div className="admin-empty" style={{ padding: '2.5rem 1rem', textAlign: 'center' }}>
              <p style={{ color: '#E5E7EB', marginBottom: '1rem' }}>
                Aucun média n'a encore été ajouté directement à la galerie.
              </p>
              <button className="admin-btn admin-btn-blue" onClick={() => setIsAddingImage(true)}>
                Ajouter une photo maintenant
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── ONGLET 2 : Médias synchronisés automatiquement ── */}
      {activeTab === 'sync' && (
        <div className="admin-card">
          <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.25rem', color: '#4ADE80', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ flexShrink: 0 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <strong>Synchronisation automatique active :</strong> Les {autoSyncedItems.length} photos publiées dans vos Projets, Domaines d'intervention et Actualités sont automatiquement récupérées et présentées dans la galerie publique.
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {autoSyncedItems.map((item) => (
              <div
                key={item._id}
                style={{ background: '#111827', borderRadius: '0.625rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ position: 'relative', height: '120px', background: '#000' }}>
                  <img src={item.url} alt={item.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', top: 6, left: 6, background: item.sourceCategory === 'Projets' ? '#10B981' : item.sourceCategory === 'Actualités' ? '#3B82F6' : '#8B5CF6', color: '#FFFFFF', fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>
                    {item.sourceCategory}
                  </span>
                </div>
                <div style={{ padding: '0.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '0.825rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.title}
                  </div>
                  {item.caption && (
                    <div style={{ fontSize: '0.7rem', color: '#9CA3AF', marginTop: '4px', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.caption}
                    </div>
                  )}
                  {item.sourceLink && (
                    <a
                      href={item.sourceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ marginTop: 'auto', paddingTop: '0.5rem', fontSize: '0.75rem', color: '#60A5FA', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      Voir la source
                      <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ONGLET 3 : Vue Complète Galerie Publique ── */}
      {activeTab === 'all' && (
        <div className="admin-card">
          <p style={{ color: '#E5E7EB', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Voici la liste complète des {allAggregatedItems.length} médias visibles sur la page publique <code>/galeries</code>.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {allAggregatedItems.map((item) => (
              <div
                key={item._id}
                style={{ background: '#111827', borderRadius: '0.625rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <div style={{ position: 'relative', height: '130px', background: '#000' }}>
                  <img src={item.thumbnailUrl || item.url} alt={item.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', top: 6, left: 6, background: item.sourceCategory === 'Projets' ? '#10B981' : item.sourceCategory === 'Actualités' ? '#3B82F6' : item.sourceCategory === 'Domaines d\'intervention' ? '#8B5CF6' : '#C2530A', color: '#FFFFFF', fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>
                    {item.sourceCategory}
                  </span>
                  {item.type !== 'image' && (
                    <span style={{ position: 'absolute', bottom: 6, right: 6, background: 'rgba(0,0,0,0.7)', color: '#FFF', fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>
                      {item.type === 'youtube' ? 'YouTube' : 'Vidéo'}
                    </span>
                  )}
                </div>
                <div style={{ padding: '0.75rem' }}>
                  <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '0.825rem', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.title}
                  </div>
                  {item.caption && (
                    <div style={{ fontSize: '0.7rem', color: '#9CA3AF', marginTop: '2px', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.caption}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODALE AJOUT PHOTO(S) DEPUIS LE STOCKAGE DE L'APPAREIL ── */}
      {isAddingImage && (
        <div className="admin-modal-overlay" onClick={() => setIsAddingImage(false)}>
          <div className="admin-modal" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">Ajouter des photos à la galerie</h2>
              <button className="admin-modal-close" onClick={() => setIsAddingImage(false)}>
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="admin-modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Zone de sélection de fichier depuis le stockage */}
                <label
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.75rem',
                    border: '2px dashed #4B5563',
                    borderRadius: '0.75rem',
                    background: '#1F2937',
                    cursor: isProcessingFiles ? 'not-allowed' : 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <svg width="36" height="36" fill="none" stroke="#3B82F6" viewBox="0 0 24 24" strokeWidth={1.5} style={{ marginBottom: '0.5rem' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  <span style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '0.95rem' }}>
                    {isProcessingFiles ? 'Optimisation des images en cours...' : 'Sélectionner des images depuis votre appareil'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '4px' }}>
                    Cliquez pour choisir un ou plusieurs fichiers (JPG, PNG, WEBP). Les photos sont compressées automatiquement.
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageFileChange}
                    disabled={isProcessingFiles}
                    style={{ display: 'none' }}
                  />
                </label>

                {/* Liste des images sélectionnées avec titre/légende */}
                {imageFiles.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '280px', overflowY: 'auto' }}>
                    {imageFiles.map((item, idx) => (
                      <div
                        key={idx}
                        style={{ display: 'flex', gap: '0.75rem', background: '#111827', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)', alignItems: 'center' }}
                      >
                        <img src={item.dataUrl} alt={item.title} style={{ width: '56px', height: '42px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} />
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <input
                            type="text"
                            className="admin-input"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                            value={item.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              setImageFiles((prev) => prev.map((it, i) => (i === idx ? { ...it, title: val, alt: val } : it)));
                            }}
                            placeholder="Titre de la photo..."
                          />
                          <input
                            type="text"
                            className="admin-input"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#9CA3AF' }}
                            value={item.caption}
                            onChange={(e) => {
                              const val = e.target.value;
                              setImageFiles((prev) => prev.map((it, i) => (i === idx ? { ...it, caption: val } : it)));
                            }}
                            placeholder="Légende (optionnelle)..."
                          />
                        </div>
                        <button
                          type="button"
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          onClick={() => setImageFiles((prev) => prev.filter((_, i) => i !== idx))}
                          style={{ padding: '0.25rem 0.5rem' }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Option URL manuelle */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#E5E7EB', marginBottom: '0.5rem' }}>
                    Ou ajouter une image via une URL web
                  </div>
                  <input
                    type="text"
                    className="admin-input"
                    value={imageManualUrl}
                    onChange={(e) => setImageManualUrl(e.target.value)}
                    placeholder="https://exemple.org/photo.jpg ou /images/photo.jpg"
                    style={{ marginBottom: '0.5rem' }}
                  />
                  {imageManualUrl && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <input
                        type="text"
                        className="admin-input"
                        value={imageManualTitle}
                        onChange={(e) => setImageManualTitle(e.target.value)}
                        placeholder="Titre de l'image..."
                      />
                      <input
                        type="text"
                        className="admin-input"
                        value={imageManualCaption}
                        onChange={(e) => setImageManualCaption(e.target.value)}
                        placeholder="Légende..."
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-ghost" onClick={() => setIsAddingImage(false)}>
                Annuler
              </button>
              <button
                className="admin-btn admin-btn-blue"
                onClick={handleSaveImages}
                disabled={imageFiles.length === 0 && !imageManualUrl.trim()}
              >
                Enregistrer {imageFiles.length > 0 ? `(${imageFiles.length})` : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODALE AJOUT VIDÉO / YOUTUBE ── */}
      {isAddingVideo && (
        <div className="admin-modal-overlay" onClick={() => setIsAddingVideo(false)}>
          <div className="admin-modal" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">Ajouter une vidéo à la galerie</h2>
              <button className="admin-modal-close" onClick={() => setIsAddingVideo(false)}>
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="admin-modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Type de vidéo */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className={`admin-btn ${videoMode === 'youtube' ? 'admin-btn-blue' : 'admin-btn-ghost'}`}
                    onClick={() => setVideoMode('youtube')}
                  >
                    Lien YouTube
                  </button>
                  <button
                    type="button"
                    className={`admin-btn ${videoMode === 'url' ? 'admin-btn-blue' : 'admin-btn-ghost'}`}
                    onClick={() => setVideoMode('url')}
                  >
                    URL Vidéo (MP4/WebM)
                  </button>
                </div>

                <div>
                  <label className="admin-label">
                    {videoMode === 'youtube' ? 'URL de la vidéo YouTube *' : 'URL directe du fichier vidéo *'}
                  </label>
                  <input
                    type="text"
                    className="admin-input"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder={videoMode === 'youtube' ? 'https://www.youtube.com/watch?v=... ou https://youtu.be/...' : 'https://domaine.org/video.mp4'}
                  />
                  {videoMode === 'youtube' && videoUrl && extractYoutubeId(videoUrl) && (
                    <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <img src={getYoutubeThumbnail(extractYoutubeId(videoUrl)!)} alt="Miniature YouTube" style={{ width: '80px', height: '45px', objectFit: 'cover', borderRadius: '4px' }} />
                      <span style={{ fontSize: '0.75rem', color: '#4ADE80' }}>Vidéo YouTube détectée</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="admin-label">Titre de la vidéo *</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="Ex: Témoignage d'un bénéficiaire à Beni"
                  />
                </div>

                <div>
                  <label className="admin-label">Légende / Description</label>
                  <textarea
                    className="admin-textarea"
                    rows={3}
                    value={videoCaption}
                    onChange={(e) => setVideoCaption(e.target.value)}
                    placeholder="Brève description de la vidéo..."
                  />
                </div>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-ghost" onClick={() => setIsAddingVideo(false)}>
                Annuler
              </button>
              <button
                className="admin-btn admin-btn-blue"
                onClick={handleSaveVideo}
                disabled={!videoUrl.trim() || !videoTitle.trim()}
              >
                Ajouter la vidéo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODALE MODIFICATION ÉLÉMENT ── */}
      {editingItem && (
        <div className="admin-modal-overlay" onClick={() => setEditingItem(null)}>
          <div className="admin-modal" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">Modifier l'élément de la galerie</h2>
              <button className="admin-modal-close" onClick={() => setEditingItem(null)}>
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="admin-modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <img
                    src={editingItem.thumbnailUrl || editingItem.url}
                    alt={editingItem.alt}
                    style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.15)' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Type : {editingItem.type}</div>
                    <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Date : {formatDate(editingItem.date)}</div>
                  </div>
                </div>

                <div>
                  <label className="admin-label">Titre *</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="admin-label">Légende</label>
                  <textarea
                    className="admin-textarea"
                    rows={3}
                    value={editCaption}
                    onChange={(e) => setEditCaption(e.target.value)}
                  />
                </div>

                <div>
                  <label className="admin-label">Texte alternatif (accessibilité)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={editAlt}
                    onChange={(e) => setEditAlt(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div>
                    <label className="admin-label">Ordre d'affichage</label>
                    <input
                      type="number"
                      className="admin-input"
                      style={{ width: '100px' }}
                      value={editOrder}
                      onChange={(e) => setEditOrder(parseInt(e.target.value, 10) || 0)}
                    />
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '1.25rem' }}>
                    <input
                      type="checkbox"
                      checked={editActive}
                      onChange={(e) => setEditActive(e.target.checked)}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontSize: '0.875rem', color: '#FFFFFF', fontWeight: 600 }}>Visible dans la galerie publique</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-ghost" onClick={() => setEditingItem(null)}>
                Annuler
              </button>
              <button className="admin-btn admin-btn-blue" onClick={handleSaveEdit}>
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODALE SUPPRESSION ── */}
      {deleteTarget && (
        <div className="admin-confirm-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="admin-confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div style={{ width: 56, height: 56, borderRadius: '1rem', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <svg width="28" height="28" fill="none" stroke="#EF4444" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.125rem', color: '#F1F5F9', marginBottom: '0.5rem' }}>
              Supprimer cet élément ?
            </h3>
            <p style={{ color: '#E5E7EB', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              "{deleteTarget.title}" sera retiré de la galerie. Cette action est irréversible.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button className="admin-btn admin-btn-ghost" onClick={() => setDeleteTarget(null)}>
                Annuler
              </button>
              <button className="admin-btn admin-btn-danger" onClick={handleConfirmDelete}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
