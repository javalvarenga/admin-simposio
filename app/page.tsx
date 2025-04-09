import { redirect } from "next/navigation"
import { LoginForm } from "@/components/login-form"

export default async function Home() {
  // En un caso real, verificaríamos la sesión del usuario
  // Si ya está autenticado, redirigir al dashboard
  const isAuthenticated = false

  if (isAuthenticated) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Administración de Participantes</h1>
          <p className="mt-2 text-gray-600">Simposio Académico 2025</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

