// api-backend.ts

const TOKEN_KEY = "auth_token"

/** Guarda token JWT en almacenamiento local */
export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

/** Obtiene el token JWT guardado */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

/** Elimina el token, p. ej. al hacer logout */
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

/**
 * Hace fetch con autorización Bearer token y maneja errores comunes.
 * Lanza excepción con mensaje en caso de error.
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<any> {
  const token = getToken()
  if (!token) throw new Error("No autenticado")

  const headers = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
    ...(options.headers || {}),
  }

  const res = await fetch(url, { ...options, headers })

  if (!res.ok) {
    let errorMsg = "Error desconocido"
    try {
      const data = await res.json()
      errorMsg = data.error || data.message || errorMsg
    } catch {
      // No JSON en respuesta, mantenemos mensaje por defecto
    }
    throw new Error(errorMsg)
  }

  if (res.status === 204) {
    return null // Sin contenido
  }

  return res.json()
}
