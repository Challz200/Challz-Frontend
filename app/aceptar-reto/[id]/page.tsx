"use client";

import React from "react";
import { ArrowLeft, Camera, ImageIcon, Mic } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function AceptarRetoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-black/80 backdrop-blur-md border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Link href={`/reto/${id}`}>
            <Button variant="ghost" size="icon" className="text-zinc-400">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Aceptar Reto</h1>
        </div>
        <Button
          size="sm"
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          Publicar
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-16 pb-4">
        <div className="p-4">
          <div className="mb-6">
            <Badge className="mb-2 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30">RETO DEL DÍA</Badge>
            <h2 className="text-xl font-bold mb-2">Crea un video bailando con tu canción favorita de los 90s</h2>
            <p className="text-zinc-400 text-sm">
              Muestra tus mejores pasos de baile con una canción nostálgica. ¡Sorprende a todos con tu creatividad!
            </p>
          </div>

          <Tabs defaultValue="video" className="w-full">
            <TabsList className="w-full bg-zinc-900 border-b border-zinc-800 rounded-none h-12">
              <TabsTrigger value="video" className="flex-1 data-[state=active]:bg-black data-[state=active]:text-white">
                <Camera className="h-4 w-4 mr-2" />
                Video
              </TabsTrigger>
              <TabsTrigger value="photo" className="flex-1 data-[state=active]:bg-black data-[state=active]:text-white">
                <ImageIcon className="h-4 w-4 mr-2" />
                Foto
              </TabsTrigger>
              <TabsTrigger value="audio" className="flex-1 data-[state=active]:bg-black data-[state=active]:text-white">
                <Mic className="h-4 w-4 mr-2" />
                Audio
              </TabsTrigger>
            </TabsList>

            <TabsContent value="video" className="mt-4">
              <div className="border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center mb-4">
                <div className="flex flex-col items-center justify-center">
                  <Camera className="h-12 w-12 text-zinc-500 mb-4" />
                  <h3 className="font-medium mb-2">Sube tu video</h3>
                  <p className="text-zinc-500 text-sm mb-4">Arrastra y suelta o haz clic para seleccionar</p>
                  <Button className="bg-zinc-800 hover:bg-zinc-700">Seleccionar Video</Button>
                </div>
              </div>

              {/* resto del contenido sin cambios */}
            </TabsContent>

            {/* ... resto TabsContent igual ... */}
          </Tabs>
        </div>
      </main>
    </div>
  );
}
