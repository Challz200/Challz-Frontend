import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
<<<<<<< HEAD
import { AuthBackendProvider } from "@/contexts/auth-backend-context"
=======
import { AuthProvider } from "@/contexts/auth-context"
>>>>>>> a2352e7dac0ebfeb1e0d079c1703d9a5b8a10d44

export const metadata = {
  title: "Challz - Desafía tu rutina. Reta tu mundo.",
  description: "Una aplicación de retos diarios para inspirar creatividad, conexión social y crecimiento personal.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen bg-black font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
<<<<<<< HEAD
          <AuthBackendProvider>{children}</AuthBackendProvider>
=======
          <AuthProvider>{children}</AuthProvider>
>>>>>>> a2352e7dac0ebfeb1e0d079c1703d9a5b8a10d44
        </ThemeProvider>
      </body>
    </html>
  )
}
