// Utilidades para conectar el frontend con el backend Express/Cloudinary

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function registerUser({ username, email, password }: { username: string; email: string; password: string }) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Error en registro');
  return res.json();
}

export async function loginUser({ email, password }: { email: string; password: string }) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Error en login');
  return res.json(); // { token, user }
}

export function saveToken(token: string) {
  localStorage.setItem('jwt_token', token);
}

export function getToken() {
  return localStorage.getItem('jwt_token');
}

export async function uploadMediaBackend({ file, title, description, hashtags, type, challengeId, challengeTitle }: {
  file: File;
  title: string;
  description: string;
  hashtags: string[];
  type: string;
  challengeId?: string;
  challengeTitle?: string;
}) {
  const token = getToken();
  if (!token) throw new Error('No autenticado');
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', title);
  formData.append('description', description);
  formData.append('hashtags', hashtags.join(','));
  formData.append('type', type);
  if (challengeId) formData.append('challengeId', challengeId);
  if (challengeTitle) formData.append('challengeTitle', challengeTitle);
  const res = await fetch(`${API_URL}/api/media`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Error al subir media');
  return res.json();
}
