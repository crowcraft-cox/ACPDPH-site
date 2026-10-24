// URL du backend — utilise la variable d'env Vite si définie, sinon l'URL Render en production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://acpdph-api.onrender.com/api/v1';

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

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...(options.headers || {}),
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || data.error || 'Une erreur est survenue lors de la requête.',
      };
    }

    return {
      success: true,
      data: data.data || data,
      message: data.message,
    };
  } catch (err: any) {
    console.error(`[API Error] ${endpoint}:`, err);
    return {
      success: false,
      error: 'Impossible de contacter le serveur backend. Veuillez vérifier votre connexion.',
    };
  }
}
