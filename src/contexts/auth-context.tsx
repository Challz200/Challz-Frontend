import React, { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  username: string
  email: string
  // otros campos de usuario que tengas
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  signup: (username: string, email: string, password: string) => Promise<void>
  uploadImage: (file: File) => Promise<string> // retorna URL en Cloudinary
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  // Opcional: carga el usuario desde tu backend cuando la app inicia
  useEffect(() => {
    async function fetchUser() {
      // Ejemplo: fetch('/api/auth/me') para obtener usuario logueado
      // const res = await fetch('/api/auth/me')
      // si está autenticado: setUser(data)
    }
    fetchUser()
  }, [])

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) throw new Error("Error en login")
    const data = await res.json()
    setUser(data.user)
    // Guarda token si usas (localStorage, cookie, etc)
  }

  const signup = async (username: string, email: string, password: string) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    })
    if (!res.ok) throw new Error("Error en signup")
    const data = await res.json()
    setUser(data.user)
  }

  const logout = () => {
    setUser(null)
    // Borra token si usas
  }

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "")
    formData.append("folder", "tu_carpeta")

    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`, {
      method: "POST",
      body: formData,
    })

    if (!res.ok) throw new Error("Error al subir imagen a Cloudinary")

    const data = await res.json()
    return data.secure_url // URL accesible de la imagen subida
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, uploadImage }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider")
  return context
}
