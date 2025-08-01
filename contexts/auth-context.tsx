import React, { createContext, useContext, useState, useEffect } from "react"

/**
 * Tipo que representa un usuario autenticado.
 * Puedes extenderlo con más campos según tu modelo.
 */
interface User {
  id: string
  username: string
  email: string
  // otros campos que uses en tu usuario
}

/**
 * Tipo que define los métodos y el estado expuestos en el contexto de autenticación.
 */
interface AuthContextType {
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (username: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  uploadImage: (file: File) => Promise<string>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Proveedor de contexto de autenticación.
 * Encapsula estados y métodos para el login, registro, logout, etc.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  // Al montar, intenta obtener la sesión/usuario actual desde el backend
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me")
        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
        } else {
          setUser(null)
        }
      } catch {
        setUser(null)
      }
    }
    fetchUser()
  }, [])

  /**
   * Función para iniciar sesión.
   * Llama la API y actualiza el usuario en estado.
   */
  const signIn = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.message || "Error al iniciar sesión")
    }
    const data = await res.json()
    setUser(data.user)
    // Aquí podrías guardar token en localStorage/cookie si es necesario
  }

  /**
   * Función para registrar un usuario nuevo.
   */
  const signUp = async (username: string, email: string, password: string) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    })
    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.message || "Error al registrarse")
    }
    const data = await res.json()
    setUser(data.user)
  }

  /**
   * Función para cerrar sesión.
   * Limpia datos de usuario local y notifica al backend.
   */
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
    // Limpia tokens o cookies locales si usas
  }

  /**
   * Solicita cambio de contraseña enviando el email al backend.
   */
  const resetPassword = async (email: string) => {
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.message || "Error al solicitar cambio de contraseña")
    }
    // Puedes gestionar mensaje o estado en el componente que llame esta función
  }

  /**
   * Sube una imagen a Cloudinary usando fetch.
   * Retorna la URL segura de la imagen subida.
   */
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "")
    formData.append("folder", "tu_carpeta") // Cambia "tu_carpeta" por la carpeta deseada en Cloudinary

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: "POST",
        body: formData,
      }
    )

    if (!res.ok) throw new Error("Error al subir imagen a Cloudinary")

    const data = await res.json()
    return data.secure_url
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, logout, resetPassword, uploadImage }}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook para usar el contexto de autenticación.
 * Lanza error si se usa fuera del AuthProvider.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider")
  return context
}

  
