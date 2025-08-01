// Servicio para obtener media desde el backend mediante token JWT

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

import { getToken } from "./api-backend";

/**
 * Obtiene la lista de medios del usuario autenticado.
 * Lanza error si no está autenticado o la respuesta falla.
 */
export async function getUserMediaBackend() {
  const token = getToken();
  if (!token) throw new Error("No autenticado");

  const res = await fetch(`${API_URL}/api/media`, {
    method: "GET",
    headers: { 
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    // Intenta extraer mensaje de error JSON
    let errorMsg = "Error al obtener media";
    try {
      const data = await res.json();
      errorMsg = data.error || data.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }

  return res.json();
}

/**
 * Obtiene un medio específico por su ID para el usuario autenticado.
 * Lanza error si no autenticado o si la respuesta falla.
 * @param id ID del medio a obtener
 */
export async function getMediaByIdBackend(id: string) {
  const token = getToken();
  if (!token) throw new Error("No autenticado");

  const res = await fetch(`${API_URL}/api/media/${id}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) {
    let errorMsg = "Error al obtener media";
    try {
      const data = await res.json();
      errorMsg = data.error || data.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }

  return res.json();
}
