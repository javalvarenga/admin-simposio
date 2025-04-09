"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function DashboardHeader() {
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = () => {
    // En un caso real, eliminaríamos la sesión
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    })
    router.push("/")
  }

  return (
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Administración de Participantes</h2>
          <p className="text-sm text-gray-600">Simposio Académico 2025</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </div>
    </header>
  )
}

