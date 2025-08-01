const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("Falta la variable de entorno NEXT_PUBLIC_API_URL (ruta base del backend)");
}

const TOKEN_KEY = "auth_token";

/** Guarda token JWT en almacenamiento local */
export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

/** Obtiene el token JWT guardado */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/** Elimina el token, p. ej. al hacer logout */
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Hace fetch centralizado al backend, agregando el JWT si existe y usando la URL base del entorno.
 * Lanza excepción si la respuesta es error o si falta el token para rutas protegidas.
 */
export async function apiFetch(
  endpoint: string,
  options: RequestInit = {},
  authRequired: boolean = false
): Promise<any> {
  const url = `${API_URL}${endpoint}`;
  let headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (authRequired) {
    const token = getToken();
    if (!token) throw new Error("No autenticado");
    headers = {
      ...headers,
      "Authorization": `Bearer ${token}`,
    };
  }

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    let errorMsg = "Error desconocido";
    try {
      const data = await res.json();
      errorMsg = data.error || data.message || errorMsg;
    } catch {
      // No JSON en respuesta
    }
    throw new Error(errorMsg);
  }

  if (res.status === 204) {
    return null; // Sin contenido
  }

  return res.json();
}

// Ejemplo de función para login
export async function login(email: string, password: string) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// Ejemplo de función para obtener perfil protegido
export async function getUserProfile() {
  return apiFetch("/user/profile", { method: "GET" }, true);
}