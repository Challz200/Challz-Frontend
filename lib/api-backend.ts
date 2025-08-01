const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("Falta la variable de entorno NEXT_PUBLIC_API_URL (ruta base del backend)");
}

const TOKEN_KEY = "auth_token";

/** Guarda token JWT en almacenamiento local */
export function saveToken(token: string) {
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

// --- Funciones específicas para endpoints comunes ---

// Login de usuario y retorno de token + datos
export async function login(email: string, password: string) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// Registro de usuario nuevo
export async function registerUser(user: { username: string; email: string; password: string }) {
  return apiFetch("/auth/signup", {
    method: "POST",
    body: JSON.stringify(user),
  });
}

// Logout (si backend lo requiere)
export async function logout() {
  return apiFetch("/auth/logout", {
    method: "POST",
  }, true);
}

// Obtener perfil de usuario autenticado
export async function getUserProfile() {
  return apiFetch("/user/profile", { method: "GET" }, true);
}

// Obtener media por ID
export async function fetchMediaById(id: string) {
  return apiFetch(`/media/${id}`, { method: "GET" }, false);
}

// Obtener comentarios para media
export async function fetchCommentsByMediaId(mediaId: string) {
  return apiFetch(`/media/${mediaId}/comments`, { method: "GET" }, false);
}

// Agregar comentario a media
export async function postComment(
  mediaId: string,
  comment: {
    userId: string;
    username: string;
    userPhotoURL?: string;
    text: string;
    createdAt: string;
  }
) {
  return apiFetch(
    `/media/${mediaId}/comments`,
    {
      method: "POST",
      body: JSON.stringify(comment),
    },
    true
  );
}

// Obtener medios de usuario
export async function getUserMedia(userId: string) {
  return apiFetch(`/users/${userId}/media`, { method: "GET" }, false);
}

// Obtener medios trending
export async function getTrendingMedia() {
  return apiFetch(`/media/trending`, { method: "GET" }, false);
}

// Puedes agregar más funciones específicas a tu API según lo necesites

