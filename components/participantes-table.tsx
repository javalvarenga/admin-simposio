"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { VerBoletaDialog } from "@/components/ver-boleta-dialog"
import { EditarParticipanteDrawer } from "@/components/editar-participante-drawer"
import { EliminarParticipanteDialog } from "@/components/eliminar-participante-dialog"
import { ChevronDown, ChevronUp, Search, Eye, Edit, Trash2, CreditCard } from "lucide-react"

// Tipos para los participantes
type TipoParticipante = "Estudiante" | "Catedrático" | "Invitado"
// Actualizar el tipo EstadoPago
type EstadoPago = "Pagado" | "Verificacion pendiente" | "Pendiente de Pago" | "Rechazado"
// Nuevo tipo para el tipo de pago
type TipoPago = "Efectivo" | "Comprobante"

interface Participante {
  id: string
  nombre: string
  email: string
  tipo: TipoParticipante
  estadoPago: EstadoPago
  tipoPago: TipoPago
  fechaRegistro: string
  telefono: string
  institucion: string
  boletaUrl: string
}

// Actualizar los datos de ejemplo con los nuevos estados y tipo de pago
const participantesData: Participante[] = [
  {
    id: "1",
    nombre: "Juan Pérez",
    email: "juan.perez@ejemplo.com",
    tipo: "Estudiante",
    estadoPago: "Pagado",
    tipoPago: "Comprobante",
    fechaRegistro: "2024-03-15",
    telefono: "5555-1234",
    institucion: "Universidad Nacional",
    boletaUrl: "/placeholder.svg?height=400&width=300",
  },
  {
    id: "2",
    nombre: "María López",
    email: "maria.lopez@ejemplo.com",
    tipo: "Catedrático",
    estadoPago: "Pendiente de Pago",
    tipoPago: "Efectivo",
    fechaRegistro: "2024-03-16",
    telefono: "5555-5678",
    institucion: "Universidad Central",
    boletaUrl: "/placeholder.svg?height=400&width=300",
  },
  {
    id: "3",
    nombre: "Carlos Rodríguez",
    email: "carlos.rodriguez@ejemplo.com",
    tipo: "Invitado",
    estadoPago: "Verificacion pendiente",
    tipoPago: "Comprobante",
    fechaRegistro: "2024-03-17",
    telefono: "5555-9012",
    institucion: "Empresa Tecnológica",
    boletaUrl: "/placeholder.svg?height=400&width=300",
  },
  {
    id: "4",
    nombre: "Ana Martínez",
    email: "ana.martinez@ejemplo.com",
    tipo: "Estudiante",
    estadoPago: "Pagado",
    tipoPago: "Efectivo",
    fechaRegistro: "2024-03-18",
    telefono: "5555-3456",
    institucion: "Universidad Nacional",
    boletaUrl: "/placeholder.svg?height=400&width=300",
  },
  {
    id: "5",
    nombre: "Roberto Sánchez",
    email: "roberto.sanchez@ejemplo.com",
    tipo: "Catedrático",
    estadoPago: "Rechazado",
    tipoPago: "Comprobante",
    fechaRegistro: "2024-03-19",
    telefono: "5555-7890",
    institucion: "Universidad Central",
    boletaUrl: "/placeholder.svg?height=400&width=300",
  },
]

export function ParticipantesTable() {
  const { toast } = useToast()
  const [participantes, setParticipantes] = useState<Participante[]>(participantesData)
  const [searchTerm, setSearchTerm] = useState("")
  const [tipoFilter, setTipoFilter] = useState<string>("todos")
  const [estadoFilter, setEstadoFilter] = useState<string>("todos")
  const [tipoPagoFilter, setTipoPagoFilter] = useState<string>("todos")
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Participante | null
    direction: "asc" | "desc" | null
  }>({
    key: null,
    direction: null,
  })

  // Estados para los modales/drawers
  const [selectedParticipante, setSelectedParticipante] = useState<Participante | null>(null)
  const [isBoletaOpen, setIsBoletaOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  // Función para ordenar
  const requestSort = (key: keyof Participante) => {
    let direction: "asc" | "desc" | null = "asc"

    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        direction = "desc"
      } else if (sortConfig.direction === "desc") {
        direction = null
      }
    }

    setSortConfig({ key, direction })
  }

  // Función para cambiar el estado de pago
  const cambiarEstadoPago = (id: string, nuevoEstado: EstadoPago) => {
    setParticipantes(participantes.map((p) => (p.id === id ? { ...p, estadoPago: nuevoEstado } : p)))

    toast({
      title: "Estado actualizado",
      description: `El estado de pago ha sido actualizado a ${nuevoEstado}`,
    })
  }

  // Función para cambiar el tipo de pago
  const cambiarTipoPago = (id: string, nuevoTipo: TipoPago) => {
    setParticipantes(participantes.map((p) => (p.id === id ? { ...p, tipoPago: nuevoTipo } : p)))

    toast({
      title: "Tipo de pago actualizado",
      description: `El tipo de pago ha sido actualizado a ${nuevoTipo}`,
    })
  }

  // Función para actualizar un participante
  const actualizarParticipante = (participanteActualizado: Participante) => {
    setParticipantes(participantes.map((p) => (p.id === participanteActualizado.id ? participanteActualizado : p)))
    setIsEditOpen(false)

    toast({
      title: "Participante actualizado",
      description: "La información del participante ha sido actualizada correctamente",
    })
  }

  // Función para eliminar un participante
  const eliminarParticipante = (id: string) => {
    setParticipantes(participantes.filter((p) => p.id !== id))
    setIsDeleteOpen(false)

    toast({
      title: "Participante eliminado",
      description: "El participante ha sido eliminado correctamente",
    })
  }

  // Aplicar filtros y ordenamiento
  const filteredAndSortedParticipantes = useMemo(() => {
    // Filtrar por búsqueda
    let result = participantes.filter(
      (p) =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.institucion.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    // Filtrar por tipo
    if (tipoFilter !== "todos") {
      result = result.filter((p) => p.tipo === tipoFilter)
    }

    // Filtrar por estado
    if (estadoFilter !== "todos") {
      result = result.filter((p) => p.estadoPago === estadoFilter)
    }

    // Filtrar por tipo de pago
    if (tipoPagoFilter !== "todos") {
      result = result.filter((p) => p.tipoPago === tipoPagoFilter)
    }

    // Ordenar
    if (sortConfig.key && sortConfig.direction) {
      result.sort((a, b) => {
        if (a[sortConfig.key!] < b[sortConfig.key!]) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (a[sortConfig.key!] > b[sortConfig.key!]) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
    }

    return result
  }, [participantes, searchTerm, tipoFilter, estadoFilter, tipoPagoFilter, sortConfig])

  // Calcular los totales para los indicadores
  const totales = useMemo(() => {
    const total = participantes.length
    const pendientesPago = participantes.filter((p) => p.estadoPago === "Pendiente de Pago").length
    const pagados = participantes.filter((p) => p.estadoPago === "Pagado").length
    const verificacionPendiente = participantes.filter((p) => p.estadoPago === "Verificacion pendiente").length
    const rechazados = participantes.filter((p) => p.estadoPago === "Rechazado").length

    return {
      total,
      pendientesPago,
      pagados,
      verificacionPendiente,
      rechazados,
    }
  }, [participantes])

  // Renderizar el ícono de ordenamiento
  const renderSortIcon = (key: keyof Participante) => {
    if (sortConfig.key !== key) {
      return null
    }

    if (sortConfig.direction === "asc") {
      return <ChevronUp className="ml-1 h-4 w-4" />
    }

    if (sortConfig.direction === "desc") {
      return <ChevronDown className="ml-1 h-4 w-4" />
    }

    return null
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${estadoFilter === "todos" ? "ring-2 ring-primary ring-offset-2" : ""}`}
          onClick={() => setEstadoFilter("todos")}
        >
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Total Solicitudes</p>
              <h3 className="text-3xl font-bold mt-2">{totales.total}</h3>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${estadoFilter === "Pendiente de Pago" ? "ring-2 ring-primary ring-offset-2" : ""}`}
          onClick={() => setEstadoFilter("Pendiente de Pago")}
        >
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Pendientes de Pago</p>
              <h3 className="text-3xl font-bold mt-2 text-blue-600">{totales.pendientesPago}</h3>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${estadoFilter === "Pagado" ? "ring-2 ring-primary ring-offset-2" : ""}`}
          onClick={() => setEstadoFilter("Pagado")}
        >
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Pagados</p>
              <h3 className="text-3xl font-bold mt-2 text-green-600">{totales.pagados}</h3>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${estadoFilter === "Verificacion pendiente" ? "ring-2 ring-primary ring-offset-2" : ""}`}
          onClick={() => setEstadoFilter("Verificacion pendiente")}
        >
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Sin Verificar</p>
              <h3 className="text-3xl font-bold mt-2 text-yellow-600">{totales.verificacionPendiente}</h3>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${estadoFilter === "Rechazado" ? "ring-2 ring-primary ring-offset-2" : ""}`}
          onClick={() => setEstadoFilter("Rechazado")}
        >
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Rechazados</p>
              <h3 className="text-3xl font-bold mt-2 text-red-600">{totales.rechazados}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, email o institución..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={tipoFilter} onValueChange={setTipoFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo de participante" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los tipos</SelectItem>
                  <SelectItem value="Estudiante">Estudiante</SelectItem>
                  <SelectItem value="Catedrático">Catedrático</SelectItem>
                  <SelectItem value="Invitado">Invitado</SelectItem>
                </SelectContent>
              </Select>

              <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Estado de pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="Pendiente de Pago">Pendiente de Pago</SelectItem>
                  <SelectItem value="Verificacion pendiente">Verificacion pendiente</SelectItem>
                  <SelectItem value="Pagado">Pagado</SelectItem>
                  <SelectItem value="Rechazado">Rechazado</SelectItem>
                </SelectContent>
              </Select>

              <Select value={tipoPagoFilter} onValueChange={setTipoPagoFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo de pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los tipos</SelectItem>
                  <SelectItem value="Efectivo">Efectivo</SelectItem>
                  <SelectItem value="Comprobante">Comprobante</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => requestSort("nombre")}>
                <div className="flex items-center">
                  Nombre
                  {renderSortIcon("nombre")}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => requestSort("email")}>
                <div className="flex items-center">
                  Email
                  {renderSortIcon("email")}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => requestSort("tipo")}>
                <div className="flex items-center">
                  Tipo
                  {renderSortIcon("tipo")}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => requestSort("estadoPago")}>
                <div className="flex items-center">
                  Estado de Pago
                  {renderSortIcon("estadoPago")}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => requestSort("tipoPago")}>
                <div className="flex items-center">
                  Tipo de Pago
                  {renderSortIcon("tipoPago")}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => requestSort("fechaRegistro")}>
                <div className="flex items-center">
                  Fecha de Registro
                  {renderSortIcon("fechaRegistro")}
                </div>
              </TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedParticipantes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No se encontraron participantes con los filtros seleccionados
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedParticipantes.map((participante) => (
                <TableRow key={participante.id}>
                  <TableCell className="font-medium">{participante.nombre}</TableCell>
                  <TableCell>{participante.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        participante.tipo === "Estudiante"
                          ? "default"
                          : participante.tipo === "Catedrático"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {participante.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    <Badge variant={participante.tipoPago === "Efectivo" ? "outline" : "secondary"}>
                      {participante.tipoPago}
                    </Badge>
                  </TableCell>
                  <TableCell>{participante.fechaRegistro}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedParticipante(participante)
                          setIsBoletaOpen(true)
                        }}
                        title="Ver boleta"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon" title="Cambiar estado de pago">
                            <CreditCard className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => cambiarEstadoPago(participante.id, "Pendiente de Pago")}>
                            Pendiente de Pago
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => cambiarEstadoPago(participante.id, "Verificacion pendiente")}
                          >
                            Verificacion pendiente
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => cambiarEstadoPago(participante.id, "Pagado")}>
                            Pagado
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => cambiarEstadoPago(participante.id, "Rechazado")}>
                            Rechazado
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedParticipante(participante)
                          setIsEditOpen(true)
                        }}
                        title="Editar participante"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedParticipante(participante)
                          setIsDeleteOpen(true)
                        }}
                        title="Eliminar participante"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal para ver boleta */}
      {selectedParticipante && (
        <VerBoletaDialog
          isOpen={isBoletaOpen}
          onClose={() => setIsBoletaOpen(false)}
          participante={selectedParticipante}
          onCambiarEstado={cambiarEstadoPago}
          onCambiarTipoPago={cambiarTipoPago}
        />
      )}

      {/* Drawer para editar participante */}
      {selectedParticipante && (
        <EditarParticipanteDrawer
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          participante={selectedParticipante}
          onSave={actualizarParticipante}
        />
      )}

      {/* Modal para confirmar eliminación */}
      {selectedParticipante && (
        <EliminarParticipanteDialog
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          participante={selectedParticipante}
          onConfirm={() => eliminarParticipante(selectedParticipante.id)}
        />
      )}
    </>
  )
}

// Estilos personalizados para los badges
const badgeVariants = {
  success: "bg-green-100 text-green-800 hover:bg-green-200",
  warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  destructive: "bg-red-100 text-red-800 hover:bg-red-200",
}

