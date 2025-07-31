// Servicio para obtener media desde el backend Express/JWT

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
import { getToken } from './api-backend';

export async function getUserMediaBackend() {
  const token = getToken();
  if (!token) throw new Error('No autenticado');
  const res = await fetch(`${API_URL}/api/media`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Error al obtener media');
  return res.json();
}

export async function getMediaByIdBackend(id: string) {
  const token = getToken();
  if (!token) throw new Error('No autenticado');
  const res = await fetch(`${API_URL}/api/media/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Error al obtener media');
  return res.json();
}
