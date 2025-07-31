import React, { createContext, useContext, useState, useEffect } from "react"
import {
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth"
import { auth, isFirebaseConfigured } from "@/lib/firebase"

interface User {
  id: string
  username: string
  email: string
  // otros campos de usuario que tengas
}

interface AuthContextType {
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, username: string) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  uploadImage: (file: File) => Promise<string> // ejemplo para subir imagen
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (!isFirebaseConfigured) return
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          username: firebaseUser.displayName || "",
          email: firebaseUser.email || "",
          // Mapear otros campos si es necesario
        })
      } else {
        setUser(null)
      }
    })
    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    await auth.signInWithEmailAndPassword(email, password)
  }

  const signUp = async (email: string, password: string, username: string) => {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password)
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: username })
      // Actualizar el estado local con el nuevo usuario con nombre
      setUser({
        id: userCredential.user.uid,
        username,
        email: userCredential.user.email || "",
      })
    }
  }

  const logout = async () => {
    await auth.signOut()
    setUser(null)
  }

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email)
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
    return data.secure_url
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, logout, resetPassword, uploadImage }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider")
  return context
}
