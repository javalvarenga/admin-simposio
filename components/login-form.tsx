"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from 'axios';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null); // Reset error message

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      // Realizamos la solicitud POST al backend para autenticar al administrador
      const response = await axios.post('http://localhost:8080/api/v1/administrators/login', {
        username,
        password
      });

      if (response.status === 200) {
        // Si el login es exitoso, redirigimos al dashboard
        router.push("/dashboard");
      }
    } catch (error: any) {
      setError("Credenciales incorrectas o error al intentar iniciar sesión.");
      console.error("Error de autenticación:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="username">Usuario</Label>
        <Input
          id="username"
          name="username"
          placeholder="Ingrese su usuario"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Ingrese su contraseña"
          required
        />
      </div>

      {/* Mostrar mensaje de error si las credenciales son incorrectas */}
      {error && <p className="text-red-500">{error}</p>}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
      </Button>
    </form>
  );
}
