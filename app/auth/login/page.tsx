"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AppIcon } from "@/components/app-icon"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

/**
 * Página de Login.
 * 
 * Esta página maneja iniciar sesión con email y contraseña.
 * Usa contexto auth para la lógica de signIn.
 * Redirige a "/env-setup" si Firebase no está configurado.
 * Presenta mensajes de error claros y muestra indicador de carga.
 */
export default function LoginPage() {
  // Estados locales para inputs, error y loading
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Desestructuramos funciones y estados desde contexto auth
  const { signIn, isConfigured } = useAuth()
  const router = useRouter()

  // Efecto para redirigir if Firebase no esta configurado
  useEffect(() => {
    if (!isConfigured) {
      router.push("/env-setup")
    }
  }, [isConfigured, router])

  // Handler para enviar formulario login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!isConfigured) {
      setError("Firebase no está configurado. Por favor configura las variables de entorno.")
      setIsLoading(false)
      return
    }

    try {
      await signIn(email, password)
      router.push("/")
    } catch (error: any) {
      console.error("Login error:", error)

      if (error.message === "Firebase no está configurado") {
        setError("Firebase no está configurado. Por favor configura las variables de entorno.")
      } else if (error.code === "auth/invalid-credential") {
        setError("Credenciales inválidas. Por favor verifica tu email y contraseña.")
      } else {
        setError("Ocurrió un error al iniciar sesión. Por favor intenta de nuevo.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // UI cuando no está configurado Firebase, muestra loader y redirige
  if (!isConfigured) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-white">Redirigiendo a configuración...</p>
        </div>
      </div>
    )
  }

  // UI principal con formulario de login
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-900 to-black text-white">
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          {/* Logo y eslogan */}
          <div className="flex flex-col items-center text-center">
            <AppIcon size={80} />
            <h1 className="mt-4 text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Challz
            </h1>
            <p className="mt-2 text-zinc-400">Desafía tu rutina. Reta tu mundo.</p>
          </div>

          {/* Mensajes de error */}
          {error && (
            <Alert variant="destructive" className="bg-red-900/20 border-red-900 text-red-300">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Formulario inicio de sesión */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Input email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-zinc-400">
                Correo Electrónico
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                className="bg-zinc-900 border-zinc-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Input contraseña */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm text-zinc-400">
                  Contraseña
                </Label>
                <Link href="/auth/forgot-password" className="text-xs text-purple-400 hover:text-purple-300">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="bg-zinc-900 border-zinc-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Botón de inicio */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </form>

          {/* Separador con texto */}
          <div className="relative my-6">
            <Separator className="bg-zinc-800" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black px-2 text-xs text-zinc-500">
              O continúa con
            </span>
          </div>

          {/* Botones sociales (Google, Apple) */}
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="border-zinc-700 hover:bg-zinc-900 bg-transparent">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 mr

