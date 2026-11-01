// URL du backend — utilise la variable d'env Vite si définie, sinon l'URL Render en production
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://acpdph-site.onrender.com/api/v1';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('ba-admin-token') : null;
    const authHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
    const defaultHeaders: Record<string, string> = isFormData ? {} : { 'Content-Type': 'application/json' };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        ...defaultHeaders,
        ...authHeaders,
        ...(options.headers || {}),
      },
      ...options,
    });

    // Lecture sécurisée du corps de la réponse selon le Content-Type
    const contentType = response.headers.get('content-type') || '';
    let data: any = null;

    if (contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch (jsonErr) {
        console.warn(`[API JSON Parse Warning] ${endpoint}:`, jsonErr);
        data = null;
      }
    } else {
      const text = await response.text();
      data = { message: text };
    }

    if (!response.ok) {
      const errorMessage =
        data?.message ||
        data?.error ||
        (response.status === 404
          ? 'Le service demandé est en cours de déploiement sur le serveur. Veuillez patienter un instant et réessayer.'
          : `Erreur serveur (${response.status}). Veuillez réessayer.`);

      return {
        success: false,
        error: errorMessage,
      };
    }

    return {
      success: true,
      data: data?.data !== undefined ? data.data : data,
      message: data?.message,
    };
  } catch (err: any) {
    console.error(`[API Error] ${endpoint}:`, err);
    return {
      success: false,
      error: 'Impossible de contacter le serveur backend. Veuillez vérifier votre connexion ou patienter pendant le réveil du serveur.',
    };
  }
}
