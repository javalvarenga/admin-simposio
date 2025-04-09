import { ParticipantesTable } from "@/components/participantes-table"
import { DashboardHeader } from "@/components/dashboard-header"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">Solicitudes de Registro</h1>
        <ParticipantesTable />
      </main>
    </div>
  )
}

