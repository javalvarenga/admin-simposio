import { useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
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
  const [fecha, setFecha] = useState<Date | null>(new Date(participante.fechaNacimiento))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const updatedData = {
      ...formData,
      fechaNacimiento: fecha?.toISOString().split("T")[0] || formData.fechaNacimiento,
    }
    onSave(updatedData)
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="z-50">
        <div className="mx-auto w-full max-w-sm h-[85vh] overflow-visible">
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

              {/* carnet combinado */}
              <div className="grid gap-2">
                <Label>Carnet</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    name="carnetCarrera"
                    placeholder="Carrera"
                    value={formData.carnetCarrera}
                    onChange={handleChange}
                  />
                  <span className="self-center">-</span>
                  <Input
                    type="number"
                    name="carnetAnio"
                    placeholder="Año"
                    value={formData.carnetAnio}
                    onChange={handleChange}
                  />
                  <span className="self-center">-</span>
                  <Input
                    type="number"
                    name="carnetSerie"
                    placeholder="Serie"
                    value={formData.carnetSerie}
                    onChange={handleChange}
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

              {/* fechaNacimiento con calendario */}
              <div className="grid gap-2">
                <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
                <DatePicker
                  selected={fecha}
                  onChange={(date: Date | null) => setFecha(date)}
                  dateFormat="yyyy-MM-dd"
                  className="w-full border rounded-md p-2"
                  placeholderText="Selecciona una fecha"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
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
