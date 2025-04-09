"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const username = formData.get("username") as string
    const password = formData.get("password") as string

    // Simulación de autenticación
    // En un caso real, esto sería una llamada a una API
    try {
      // Simulamos un delay para la autenticación
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Credenciales de prueba: admin/admin
      if (username === "admin" && password === "admin") {
        toast({
          title: "Inicio de sesión exitoso",
          description: "Bienvenido al sistema de administración",
        })
        router.push("/dashboard")
      } else {
        throw new Error("Credenciales incorrectas")
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error de autenticación",
        description: "Usuario o contraseña incorrectos",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="username">Usuario</Label>
        <Input id="username" name="username" placeholder="Ingrese su usuario" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input id="password" name="password" type="password" placeholder="Ingrese su contraseña" required />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
      </Button>
    </form>
  )
}

