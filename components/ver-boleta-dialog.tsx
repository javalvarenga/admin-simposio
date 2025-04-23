"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Participante } from "./participantes-table"

interface VerBoletaDialogProps {
  isOpen: boolean
  onClose: () => void
  participante: Participante
}

export function VerBoletaDialog({
  isOpen,
  onClose,
  participante,
}: VerBoletaDialogProps) {
  // Detecta si la boleta es PDF según el prefijo base64
  const esPDF = participante.boleta?.startsWith("JVBER")

  // Función para descargar el archivo de la boleta
  const handleDescargarBoleta = () => {
    const link = document.createElement("a")
    link.href = esPDF
      ? `data:application/pdf;base64,${participante.boleta}`
      : `data:image/jpeg;base64,${participante.boleta}`
    link.download = `boleta_${participante.idParticipante}`
    link.click()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Boleta de Pago</DialogTitle>
          <DialogDescription>Boleta subida por {participante.nombre}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Estado de pago:</span>
            <Badge
              variant={
                participante.estadoPago === "C"
                  ? "success"
                  : participante.estadoPago === "V"
                    ? "warning"
                    : participante.estadoPago === "P"
                      ? "default"
                      : "destructive"
              }
            >
              {participante.estadoPago}
            </Badge>
          </div>

          <div className="border rounded-md overflow-hidden max-h-[600px]">
            {participante.boleta ? (
              esPDF ? (
                <iframe
                  src={`data:application/pdf;base64,${participante.boleta}`}
                  title="Boleta PDF"
                  width="100%"
                  height="600px"
                  className="rounded"
                />
              ) : (
                <img
                  src={`data:image/jpeg;base64,${participante.boleta}`}
                  alt="Boleta de pago"
                  className="w-full h-auto object-contain"
                />
              )
            ) : (
              <p className="text-sm text-muted-foreground p-4 text-center">
                No se ha subido ninguna boleta.
              </p>
            )}
          </div>

          {/* Botón de descarga */}
          <div className="mt-4">
            <Button variant="outline" onClick={handleDescargarBoleta}>
              Descargar Boleta
            </Button>
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
