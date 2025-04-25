"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.simposioumg.site/api/v1";

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
      const response = await axios.post(`${API_URL}/administrators`, {
        username,
        password
      });

      // Verifica la respuesta del backend
      console.log(response);

      if (response.status === 200) {
        /* set localstorager value to indicate valid login in another pages or tabs */
        localStorage.setItem("isLoggedIn", "true");
        console.log("Login exitoso, redirigiendo...");
        router.push("/dashboard");  // Si la respuesta es 200, redirige
      }
    } catch (error: any) {
      setError("Credenciales incorrectas o error al intentar iniciar sesión.");
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

      {error && <p className="text-red-500">{error}</p>} {/* Muestra el error si existe */}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
      </Button>
    </form>
  );
}
