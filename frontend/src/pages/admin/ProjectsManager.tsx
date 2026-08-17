import { useState } from 'react';
import { useAdminData } from '../../context/adminData';
import type { Project, ProjectImage } from '../../types';

const emptyProject: Omit<Project, 'id'> = {
  title: '',
  location: '',
  type: '',
  status: 'En cours',
  description: '',
  color: 'bg-ba-red',
  image: '',
  images: [],
};

const typeColors: Record<string, string> = {
  'Protection': 'bg-ba-red',
  'Santé': 'bg-ba-green',
  'Éducation': 'bg-orange-500',
  'Environnement': 'bg-emerald-500',
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

export default function ProjectsManager() {
  const { data, addProject, updateProject, deleteProject } = useAdminData();
  const [editing, setEditing] = useState<Project | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Project, 'id'>>(emptyProject);
  const [isUploading, setIsUploading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const openAdd = () => {
    setForm(emptyProject);
    setIsAdding(true);
    setEditing(null);
    setSaveSuccess(false);
  };

  const openEdit = (item: Project) => {
    setForm({
      title: item.title,
      location: item.location,
      type: item.type || 'Protection',
      status: item.status || 'En cours',
      description: item.description,
      color: item.color || 'bg-ba-red',
      image: item.image,
      images: item.images || (item.image ? [{ id: '1', url: item.image, caption: 'Photo principale' }] : []),
    });
    setEditing(item);
    setIsAdding(false);
    setSaveSuccess(false);
  };

  const handleSave = () => {
    if (!form.title.trim()) {
      alert("Veuillez entrer le titre du projet.");
      return;
    }

    const firstPhotoUrl = form.images && form.images.length > 0 ? form.images[0].url : '';
    const coverUrl = form.image || firstPhotoUrl;

    const projectData: Omit<Project, 'id'> = {
      ...form,
      color: typeColors[form.type] || form.color || 'bg-ba-red',
      image: coverUrl,
    };

    try {
      if (editing) {
        updateProject(editing.id, projectData);
      } else {
        addProject(projectData);
      }

      setSaveSuccess(true);
      setTimeout(() => {
        closeModal();
      }, 400);
    } catch (err) {
      console.error("Save error:", err);
      alert("Une erreur est survenue lors de la sauvegarde.");
    }
  };

  const closeModal = () => {
    setEditing(null);
    setIsAdding(false);
    setSaveSuccess(false);
  };

  const handleDelete = (id: string) => {
    deleteProject(id);
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
        const newImages: ProjectImage[] = compressedDataUrls
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

  const insertPhotoTagIntoDescription = (index: number) => {
    const tag = `\n[photo:${index + 1}]\n`;
    setForm((prev) => ({
      ...prev,
      description: prev.description + tag,
    }));
  };

  const updateCaption = (photoId: string, caption: string) => {
    setForm((prev) => ({
      ...prev,
      images: (prev.images || []).map((img) => (img.id === photoId ? { ...img, caption } : img)),
    }));
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <p style={{ color: '#E5E7EB', fontSize: '0.875rem' }}>
          Gérez les projets, uploadez plusieurs photos et insérez-les dans les paragraphes.
        </p>
        <button className="admin-btn admin-btn-red" onClick={openAdd}>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nouveau projet
        </button>
      </div>

      {/* Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="admin-table-wrapper">
          <table className="admin-table">
          <thead>
            <tr>
              <th>Projet & Photos</th>
              <th>Lieu</th>
              <th>Type</th>
              <th>Statut</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.projects.map((project) => {
              const photoCount = project.images ? project.images.length : (project.image ? 1 : 0);
              return (
                <tr key={project.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: 54, height: 54, borderRadius: '0.625rem', overflow: 'hidden', flexShrink: 0, background: '#1E293B', position: 'relative' }}>
                        {project.image ? (
                          <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="20" height="20" fill="none" stroke="#475569" viewBox="0 0 24 24" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159" />
                            </svg>
                          </div>
                        )}
                        {photoCount > 1 && (
                          <span style={{ position: 'absolute', bottom: 2, right: 2, background: 'rgba(0,0,0,0.75)', color: '#FFF', fontSize: '0.65rem', padding: '1px 5px', borderRadius: '4px', fontWeight: 'bold' }}>
                            +{photoCount}
                          </span>
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{project.title}</div>
                        <div style={{ fontSize: '0.8rem', color: '#E5E7EB', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', maxWidth: '280px' }}>
                          {project.description}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#9CA3AF', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <svg style={{ width: '11px', height: '11px', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                          </svg>
                          {photoCount} photo{photoCount > 1 ? 's' : ''} associée{photoCount > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#FFFFFF', fontSize: '0.875rem' }}>
                      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      {project.location}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: '#E5E7EB', fontWeight: 600 }}>
                      {project.type}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: '#E5E7EB', fontWeight: 600 }}>
                      {project.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button onClick={() => openEdit(project)} style={{ background: 'none', border: 'none', color: '#E5E7EB', cursor: 'pointer', fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: '0.8rem', padding: '0.375rem 0' }}>
                        Modifier
                      </button>
                      <button onClick={() => setDeleteConfirm(project.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '0.375rem', display: 'flex', alignItems: 'center' }}>
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

        {data.projects.length === 0 && (
          <div className="admin-empty">
            <p style={{ color: '#E5E7EB' }}>Aucun projet. Cliquez sur "Nouveau projet" pour en créer un.</p>
          </div>
        )}
      </div>

      {/* Modal Edit / Add Project */}
      {(isAdding || editing) && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" style={{ maxWidth: '780px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">
                {editing ? 'Modifier le projet' : 'Nouveau projet'}
              </h2>
              <button className="admin-modal-close" onClick={closeModal}>
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="admin-modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Title */}
                <div>
                  <label className="admin-label">Titre du projet</label>
                  <input type="text" className="admin-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex: Construction de l'École Espoir" />
                </div>

                {/* Location & Type */}
                <div className="admin-grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="admin-label">Localisation</label>
                    <input type="text" className="admin-input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Ex: Goma, Nord-Kivu" />
                  </div>
                  <div>
                    <label className="admin-label">Type d'intervention</label>
                    <select className="admin-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                      <option value="">— Choisir —</option>
                      <option value="Protection">Protection</option>
                      <option value="Santé">Santé</option>
                      <option value="Éducation">Éducation</option>
                      <option value="Environnement">Environnement</option>
                    </select>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="admin-label">Statut d'avancement</label>
                  <select className="admin-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Project['status'] })}>
                    <option value="En cours">En cours</option>
                    <option value="Achevé">Achevé</option>
                    <option value="En planification">En planification</option>
                  </select>
                </div>

                {/* MULTI-PHOTO UPLOADER */}
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '0.875rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <label className="admin-label" style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <svg style={{ width: '15px', height: '15px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                      </svg>
                      Photos du projet ({form.images ? form.images.length : 0})
                    </label>
                  </div>

                  {/* Upload Box */}
                  <label
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '1.5rem',
                      border: '2px dashed #4B5563',
                      borderRadius: '0.75rem',
                      background: '#1F2937',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s ease',
                      marginBottom: '1rem',
                    }}
                    className="hover:border-red-500 hover:bg-gray-800"
                  >
                    <svg width="32" height="32" fill="none" stroke="#E30613" viewBox="0 0 24 24" strokeWidth={1.5} style={{ marginBottom: '0.5rem' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                    </svg>
                    <span style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '0.9rem' }}>
                      {isUploading ? 'Chargement et optimisation des images...' : 'Cliquez pour uploader une ou plusieurs photos'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '4px' }}>
                      Sélectionnez plusieurs fichiers d'images (JPG, PNG, WEBP). Les photos sont compressées automatiquement.
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

                  {/* Uploaded Photos Gallery List */}
                  {form.images && form.images.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.875rem' }}>
                      {form.images.map((img, idx) => {
                        const isCover = form.image === img.url;
                        return (
                          <div
                            key={img.id}
                            style={{
                              background: '#1F2937',
                              borderRadius: '0.625rem',
                              overflow: 'hidden',
                              border: isCover ? '2px solid #E30613' : '1px solid rgba(255,255,255,0.1)',
                              display: 'flex',
                              flexDirection: 'column',
                            }}
                          >
                            <div style={{ position: 'relative', height: '110px', background: '#111827' }}>
                              <img src={img.url} alt={`Photo ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              
                              {/* Tag index */}
                              <span style={{ position: 'absolute', top: 4, left: 4, background: '#E30613', color: '#FFF', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                                [photo:{idx + 1}]
                              </span>

                              {/* Cover Badge */}
                              {isCover && (
                                <span style={{ position: 'absolute', top: 4, right: 4, background: '#1A8F0A', color: '#FFF', fontSize: '0.6rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                                  Couverture
                                </span>
                              )}
                            </div>

                            {/* Caption Input */}
                            <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.375rem', flex: 1 }}>
                              <input
                                type="text"
                                className="admin-input"
                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                value={img.caption || ''}
                                onChange={(e) => updateCaption(img.id, e.target.value)}
                                placeholder="Légende de la photo..."
                              />

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: 'auto' }}>
                                {!isCover && (
                                  <button
                                    type="button"
                                    className="admin-btn admin-btn-ghost admin-btn-sm"
                                    style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                    onClick={() => setAsCover(img.url)}
                                  >
                                    <svg style={{ width: '11px', height: '11px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                    </svg>
                                    Couverture
                                  </button>
                                )}

                                <button
                                  type="button"
                                  className="admin-btn admin-btn-ghost admin-btn-sm"
                                  style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem', justifyContent: 'center', background: 'rgba(255,255,255,0.1)', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                  onClick={() => insertPhotoTagIntoDescription(idx)}
                                >
                                  <svg style={{ width: '11px', height: '11px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                  </svg>
                                  Placer dans le texte
                                </button>

                                <button
                                  type="button"
                                  className="admin-btn admin-btn-danger admin-btn-sm"
                                  style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem', justifyContent: 'center' }}
                                  onClick={() => removePhoto(img.id)}
                                >
                                  Supprimer
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.8rem', color: '#9CA3AF', textAlign: 'center', padding: '0.5rem' }}>
                      Aucune photo téléversée pour ce projet.
                    </div>
                  )}
                </div>

                {/* Description Textarea */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                    <label className="admin-label" style={{ marginBottom: 0 }}>Description & Paragraphes</label>
                    <span style={{ fontSize: '0.75rem', color: '#E5E7EB' }}>
                      Cliquez sur <strong>"Placer dans le texte"</strong> sous une photo pour l'insérer dans le paragraphe.
                    </span>
                  </div>
                  <textarea
                    className="admin-textarea"
                    rows={6}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Ecrivez votre description ici. Vous pouvez placer des photos dans les paragraphes à l'aide des boutons 'Placer dans le texte' ci-dessus (ex: [photo:1], [photo:2])."
                  />
                </div>

                {saveSuccess && (
                  <div style={{ background: 'rgba(26, 143, 10, 0.2)', border: '1px solid rgba(26, 143, 10, 0.4)', color: '#4ADE80', padding: '0.75rem 1rem', borderRadius: '0.625rem', fontSize: '0.875rem', fontWeight: 600 }}>
                    ✅ Projet enregistré avec succès !
                  </div>
                )}

              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn admin-btn-ghost" onClick={closeModal}>Annuler</button>
              <button className="admin-btn admin-btn-green" onClick={handleSave} disabled={isUploading}>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {editing ? 'Sauvegarder les modifications' : 'Créer le projet'}
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
              Supprimer ce projet ?
            </h3>
            <p style={{ color: '#E5E7EB', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
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
