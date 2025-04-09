"use client"

import type React from "react"

import { useState } from "react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

interface EditarParticipanteDrawerProps {
  isOpen: boolean
  onClose: () => void
  participante: Participante
  onSave: (participante: Participante) => void
}

export function EditarParticipanteDrawer({ isOpen, onClose, participante, onSave }: EditarParticipanteDrawerProps) {
  const [formData, setFormData] = useState<Participante>({ ...participante })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Editar Participante</DrawerTitle>
            <DrawerDescription>Actualice la información del participante</DrawerDescription>
          </DrawerHeader>
          <form onSubmit={handleSubmit}>
            <div className="p-4 pb-0">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="institucion">Institución</Label>
                  <Input id="institucion" name="institucion" value={formData.institucion} onChange={handleChange} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="tipo">Tipo de Participante</Label>
                  <Select value={formData.tipo} onValueChange={(value) => handleSelectChange("tipo", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Estudiante">Estudiante</SelectItem>
                      <SelectItem value="Catedrático">Catedrático</SelectItem>
                      <SelectItem value="Invitado">Invitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="estadoPago">Estado de Pago</Label>
                  <Select
                    value={formData.estadoPago}
                    onValueChange={(value) => handleSelectChange("estadoPago", value)}
                  >
                    <SelectTrigger>
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

                <div className="grid gap-2">
                  <Label htmlFor="tipoPago">Tipo de Pago</Label>
                  <Select value={formData.tipoPago} onValueChange={(value) => handleSelectChange("tipoPago", value)}>
                    <SelectTrigger>
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
            <DrawerFooter>
              <Button type="submit">Guardar Cambios</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

