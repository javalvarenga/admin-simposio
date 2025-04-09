"use client"

import Image from "next/image"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface Participante {
  id: string
  nombre: string
  email: string
  tipo: string
  estadoPago: string
  tipoPago: string
  fechaRegistro: string
  telefono: string
  institucion: string
  boletaUrl: string
}

interface VerBoletaDialogProps {
  isOpen: boolean
  onClose: () => void
  participante: Participante
  onCambiarEstado: (id: string, nuevoEstado: string) => void
  onCambiarTipoPago?: (id: string, nuevoTipo: string) => void
}

export function VerBoletaDialog({
  isOpen,
  onClose,
  participante,
  onCambiarEstado,
  onCambiarTipoPago,
}: VerBoletaDialogProps) {
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(participante.estadoPago)
  const [tipoPagoSeleccionado, setTipoPagoSeleccionado] = useState(participante.tipoPago)

  const handleCambiarEstado = () => {
    onCambiarEstado(participante.id, estadoSeleccionado)

    if (onCambiarTipoPago && tipoPagoSeleccionado !== participante.tipoPago) {
      onCambiarTipoPago(participante.id, tipoPagoSeleccionado)
    }

    onClose()
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
            <span className="font-medium">Estado actual:</span>
            <Badge
              variant={
                participante.estadoPago === "Pagado"
                  ? "success"
                  : participante.estadoPago === "Verificacion pendiente"
                    ? "warning"
                    : participante.estadoPago === "Pendiente de Pago"
                      ? "default"
                      : "destructive"
              }
            >
              {participante.estadoPago}
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium">Tipo de pago:</span>
            <Badge variant={participante.tipoPago === "Efectivo" ? "outline" : "secondary"}>
              {participante.tipoPago}
            </Badge>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Fecha de registro:</span>
            <span>{participante.fechaRegistro}</span>
          </div>

          <div className="border rounded-md overflow-hidden">
            <Image
              src={participante.boletaUrl || "/placeholder.svg"}
              alt="Boleta de pago"
              width={400}
              height={300}
              className="w-full h-auto object-contain"
            />
          </div>

          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <Label htmlFor="cambiar-estado">Cambiar estado de pago</Label>
              <Select value={estadoSeleccionado} onValueChange={setEstadoSeleccionado}>
                <SelectTrigger id="cambiar-estado">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendiente de Pago">Pendiente de Pago</SelectItem>
                  <SelectItem value="Verificacion pendiente">Verificacion pendiente</SelectItem>
                  <SelectItem value="Pagado">Pagado</SelectItem>
                  <SelectItem value="Rechazado">Rechazado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cambiar-tipo-pago">Cambiar tipo de pago</Label>
              <Select value={tipoPagoSeleccionado} onValueChange={setTipoPagoSeleccionado}>
                <SelectTrigger id="cambiar-tipo-pago">
                  <SelectValue placeholder="Seleccionar tipo de pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Efectivo">Efectivo</SelectItem>
                  <SelectItem value="Comprobante">Comprobante</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleCambiarEstado}>Guardar Cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

