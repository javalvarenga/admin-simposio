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
  tipoParticipante: string
  nombre: string
  carnetCarrera: number
  carnetAnio: number
  carnetSerie: number
  correoElectronico: string
  telefono: number
  talla: "S" | "M" | "L" | "XL"
  fechaNacimiento: string
  institucion: string
  Rol: string
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
        <div className="mx-auto w-full max-w-sm h-[85vh] overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>Editar Participante</DrawerTitle>
            <DrawerDescription>Actualice la información del participante</DrawerDescription>
          </DrawerHeader>

          <form onSubmit={handleSubmit}>
            <div className="p-4 pt-0 grid gap-4">
              {/* tipoParticipante */}
              <div className="grid gap-2">
                <Label htmlFor="tipoParticipante">Tipo de Participante</Label>
                <Select value={formData.tipoParticipante} onValueChange={(value) => handleSelectChange("tipoParticipante", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="E">Estudiante</SelectItem>
                    <SelectItem value="C">Catedrático</SelectItem>
                    <SelectItem value="I">Invitado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* nombre */}
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} />
              </div>

              {/* carnetCarrera, carnetAnio, carnetSerie - Campo combinado */}
              <div className="grid gap-2">
                <Label htmlFor="carnet">Carnet</Label>
                <div className="flex space-x-2">
                  <Input
                    id="carnetCarrera"
                    name="carnetCarrera"
                    value={formData.carnetCarrera}
                    onChange={handleChange}
                    className="w-1/3"
                    placeholder="Carrera"
                  />
                  <span>-</span>
                  <Input
                    id="carnetAnio"
                    name="carnetAnio"
                    value={formData.carnetAnio}
                    onChange={handleChange}
                    className="w-1/3"
                    placeholder="Año"
                  />
                  <span>-</span>
                  <Input
                    id="carnetSerie"
                    name="carnetSerie"
                    value={formData.carnetSerie}
                    onChange={handleChange}
                    className="w-1/3"
                    placeholder="Serie"
                  />
                </div>
              </div>

              {/* correoElectronico */}
              <div className="grid gap-2">
                <Label htmlFor="correoElectronico">Correo Electrónico</Label>
                <Input id="correoElectronico" name="correoElectronico" value={formData.correoElectronico} onChange={handleChange} />
              </div>

              {/* telefono */}
              <div className="grid gap-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} />
              </div>

              {/* talla */}
              <div className="grid gap-2">
                <Label htmlFor="talla">Talla</Label>
                <Select value={formData.talla} onValueChange={(value) => handleSelectChange("talla", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar talla" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="S">S</SelectItem>
                    <SelectItem value="M">M</SelectItem>
                    <SelectItem value="L">L</SelectItem>
                    <SelectItem value="XL">XL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
              <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
              <Input 
                id="fechaNacimiento" 
                name="fechaNacimiento" 
                type="date" 
                value={formData.fechaNacimiento} 
                                   onChange={handleChange} 
                      className="cursor-pointer"
                    />
                  </div>

              {/* institucion */}
              <div className="grid gap-2">
                <Label htmlFor="institucion">Institución</Label>
                <Input id="institucion" name="institucion" value={formData.institucion} onChange={handleChange} />
              </div>

              {/* Rol */}
              <div className="grid gap-2">
                <Label htmlFor="Rol">Rol</Label>
                <Input id="Rol" name="Rol" value={formData.Rol} onChange={handleChange} />
              </div>
            </div>

            <DrawerFooter className="mt-4">
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
