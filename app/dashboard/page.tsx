'use client'

import { ParticipantesTable } from "@/components/participantes-table"
import { DashboardHeader } from "@/components/dashboard-header"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const queryClient = new QueryClient()

export default function DashboardPage() {
  const router = useRouter()
  const [isAuthChecked, setIsAuthChecked] = useState(false)


  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    setIsAuthChecked(true);
    if (!isLoggedIn) {
      setIsAuthChecked(false);
      router.replace("/");
    }

  }, [])

  if (!isAuthChecked) {
    // Evita mostrar contenido antes de verificar la autenticación
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <main className="flex-1 container mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold mb-6">Solicitudes de Registro</h1>
          <ParticipantesTable />
        </main>
      </div>
    </QueryClientProvider>
  )
}