"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { sweetAlert } from "@/components/ui/sweetAlert";
import { VerBoletaDialog } from "@/components/ver-boleta-dialog";
import { EditarParticipanteDrawer } from "@/components/editar-participante-drawer";
import { EliminarParticipanteDialog } from "@/components/eliminar-participante-dialog";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Eye,
  Edit,
  Trash2,
  FileText,
  CreditCard,
  Shirt,
} from "lucide-react";
import { useGetAllParticipants } from "@/hooks/Participants/useGetAllParticipants";
import { changePaymmentStatus } from "@/services/Participants";
import { changeKitStatus } from "@/services/Participants";
import { KitEntregadoIcon, KitNoEntregadoIcon } from "@/components/ui/icons"; // Asegúrate de importar los íconos correctos
import { deleteParticipant } from "@/services/Participants"; // Asegúrate de importar la función de eliminación
import { updateParticipant } from "@/services/Participants"; // Asegúrate de importar la función de actualización

// Tipos para los participantes
type TipoParticipante = "E" | "C" | "I";
// Actualizar el tipo EstadoPago
type EstadoPago = "P" | "C" | "R" | "V";
// Nuevo tipo para el tipo de pago
type TipoPago = "E" | "D";

type estadoKit = 0 | 1;

type estadoCert = 0 | 1;

export interface Participante {
  idParticipante: number;
  tipoParticipante: TipoParticipante;
  nombre: string;
  carnetCarrera: number;
  carnetAnio: number;
  carnetSerie: number;
  correoElectronico: string;
  telefono: number;
  talla: "S" | "M" | "L" | "XL";
  fechaNacimiento: string; // puede ser `Date` si lo transformas al parsear
  fechaRegistro: string; // puede ser `Date` también
  institucion: string;
  Rol: string;
  codigoQR: string;
  certificadoEnviado: number; // tinyint lo puedes mapear a boolean en TS
  kit: number; // tinyint lo puedes mapear a boolean en TS
  estadoPago: EstadoPago;
  tipoPago: TipoPago;
  boleta: string;
}

// Mapeos para traducción
const tipoParticipanteMap: Record<TipoParticipante, string> = {
  E: "Estudiante",
  C: "Catedrático",
  I: "Invitado",
};

const tipoPagoMap: Record<TipoPago, string> = {
  E: "Efectivo",
  D: "Depósito",
};

const estadoPagoMap: Record<EstadoPago, string> = {
  C: "Completado",
  P: "Pendiente",
  R: "Rechazado",
  V: "Verificando",
};

const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}-${month}-${year}`;
};

export function ParticipantesTable() {
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState<string>("todos");
  const [estadoFilter, setEstadoFilter] = useState<string>("todos");
  const [tipoPagoFilter, setTipoPagoFilter] = useState<string>("todos");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Participante | null;
    direction: "asc" | "desc" | null;
  }>({
    key: null,
    direction: null,
  });

  const { participantes: data, isLoading, error } = useGetAllParticipants();

  useEffect(() => {
    if (!isLoading && data?.length > 0) {
      setParticipantes(data);
    }
  }, [data]);

  // Estados para los modales/drawers
  const [selectedParticipante, setSelectedParticipante] =
    useState<Participante | null>(null);
  const [isBoletaOpen, setIsBoletaOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Función para ordenar
  const requestSort = (key: keyof Participante) => {
    let direction: "asc" | "desc" | null = "asc";

    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else if (sortConfig.direction === "desc") {
        direction = null;
      }
    }

    setSortConfig({ key, direction });
  };

  // Función para cambiar el estado de pago
  const cambiarEstadoPago = async (id: number, nuevoEstado: EstadoPago) => {
    setParticipantes(
      participantes.map((p) =>
        p.idParticipante === id ? { ...p, estadoPago: nuevoEstado } : p
      )
    );

    const result = await changePaymmentStatus(id, nuevoEstado);
    console.log("result of changePaymmentStatus", result);

    sweetAlert(
      "Pago actualizado",
      "El estado de pago fue cambiado",
      "success",
      5000
    );
  };

  // Función para enviar QR
  const enviarQr = async (id: number, nuevoEstado: EstadoPago) => {
    setParticipantes(
      participantes.map((p) =>
        p.idParticipante === id ? { ...p, estadoPago: nuevoEstado } : p
      )
    );

    const result = await changePaymmentStatus(id, nuevoEstado);
    console.log("result of changePaymmentStatus", result);

    sweetAlert(
      "Pago actualizado",
      "El estado de pago fue cambiado",
      "success",
      5000
    );
  };

  // Función para cambiar el estado del kit
  const cambiarEstadoKit = async (id: number, nuevoEstado: estadoKit) => {
    setParticipantes(
      participantes.map((p) =>
        p.idParticipante === id ? { ...p, kit: nuevoEstado } : p
      )
    );

    const result = await changeKitStatus(id, nuevoEstado);
    console.log("result of changeKitStatus", result);

    sweetAlert(
      "Estado del kit actualizado",
      "El estado del kit fue cambiado correctamente",
      "success",
      5000
    );
  };

  // Función para cambiar el estado del kit
  /*    const cambiarEstadoCert = async (id: number, nuevoEstado: estadoCert) => {
      setParticipantes(
        participantes.map((p) =>
          p.idParticipante === id ? { ...p, certificadoEnviado: nuevoEstado } : p
        )
      );
  
      const result = await changeCertStatus(id, nuevoEstado);
      console.log("result of changeCertStatus", result);
  
      sweetAlert(
        "Estado del certificado actualizado",
        "El estado del certificado fue cambiado correctamente",
        "success",
        5000
      );
    }; */

  // Función para cambiar el tipo de pago
  const cambiarTipoPago = (id: number, nuevoTipo: TipoPago) => {
    setParticipantes(
      participantes.map((p) =>
        p.idParticipante === id ? { ...p, tipoPago: nuevoTipo } : p
      )
    );
  };

  const actualizarParticipante = async (
    participanteActualizado: Participante
  ) => {
    try {
      const response = await updateParticipant(
        participanteActualizado.idParticipante,
        participanteActualizado
      );

      const result = response.data; // ← Aquí extraes solo los datos

      setParticipantes(
        participantes.map((p) =>
          p.idParticipante === participanteActualizado.idParticipante
            ? result
            : p
        )
      );

      sweetAlert(
        "Participante actualizado",
        "Los datos del participante fueron actualizados correctamente.",
        "success",
        5000
      );

      setIsEditOpen(false);
    } catch (error) {
      console.error("Error al actualizar participante:", error);
      sweetAlert(
        "Error",
        "Ocurrió un error al actualizar el participante.",
        "error",
        5000
      );
    }
  };

  // Función para eliminar un participante
  const eliminarParticipante = async (id: number) => {
    try {
      // Llamada al backend
      const result = await deleteParticipant(id);
      console.log("Participante eliminado:", result);

      // Actualización en el frontend
      setParticipantes(participantes?.filter((p) => p.idParticipante !== id));
      setIsDeleteOpen(false);

      sweetAlert(
        "Participante eliminado",
        "El participante fue eliminado correctamente.",
        "success",
        5000
      );
    } catch (error) {
      console.error("Error al eliminar participante:", error);
      sweetAlert(
        "Error",
        "No se pudo eliminar el participante.",
        "error",
        5000
      );
    }
  };

  // Función para formatear la fecha
  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    const day = String(date.getUTCDate()).padStart(2, "0"); // Día con 2 dígitos
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Meses son 0-based
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
  };

  // Aplicar filtros y ordenamiento
  const filteredAndSortedParticipantes = useMemo(() => {
    // Filtrar por búsqueda
    let result = participantes?.filter(
      (p) =>
        p.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.correoElectronico?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.institucion?.toLowerCase().includes(searchTerm.toLowerCase())
    );


    // Filtrar por tipo
    if (tipoFilter !== "todos") {
      result = result.filter((p) => p.tipoParticipante === tipoFilter);
    }

    // Filtrar por estado
    if (
      estadoFilter !== "todos" &&
      estadoFilter !== "K"
    ) {
      result = result.filter((p) => p.estadoPago === estadoFilter);
    } else if (estadoFilter === "K") {
      result = result.filter((p) => p.kit == 0 && p.estadoPago == "C");
    }

    // Filtrar por tipo de pago
    if (tipoPagoFilter !== "todos") {
      result = result.filter((p) => p.tipoPago === tipoPagoFilter);
    }

    // Ordenar
    if (sortConfig.key && sortConfig.direction) {
      result.sort((a, b) => {
        if (a[sortConfig.key!] < b[sortConfig.key!]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key!] > b[sortConfig.key!]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [
    participantes,
    searchTerm,
    tipoFilter,
    estadoFilter,
    tipoPagoFilter,
    sortConfig,
  ]);

  // Calcular los totales para los indicadores
  const totales = useMemo(() => {
    const total = participantes?.length;
    const pendientesPago = participantes?.filter(
      (p) => p.estadoPago === "P"
    ).length;
    const pagados = participantes?.filter((p) => p.estadoPago === "C").length;
    const verificacionPendiente = participantes?.filter(
      (p) => p.estadoPago === "V"
    ).length;
    const rechazados = participantes?.filter(
      (p) => p.estadoPago === "R"
    ).length;

    const kitsPendientesDeEntregar = participantes?.filter(
      (p) => p.kit == 0 && p.estadoPago == "C"
    ).length;

    return {
      total,
      pendientesPago,
      pagados,
      verificacionPendiente,
      rechazados,
      kitsPendientesDeEntregar,
    };
  }, [participantes]);

  // Renderizar el ícono de ordenamiento
  const renderSortIcon = (key: keyof Participante) => {
    if (sortConfig.key !== key) {
      return null;
    }

    if (sortConfig.direction === "asc") {
      return <ChevronUp className="ml-1 h-4 w-4" />;
    }

    if (sortConfig.direction === "desc") {
      return <ChevronDown className="ml-1 h-4 w-4" />;
    }

    return null;
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            estadoFilter === "todos" ? "ring-2 ring-primary ring-offset-2" : ""
          }`}
          onClick={() => setEstadoFilter("todos")}
        >
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">
                Total Solicitudes
              </p>
              <h3 className="text-3xl font-bold mt-2">{totales.total}</h3>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            estadoFilter === "P" ? "ring-2 ring-primary ring-offset-2" : ""
          }`}
          onClick={() => setEstadoFilter("P")}
        >
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">
                Pendientes de Pago
              </p>
              <h3 className="text-3xl font-bold mt-2 text-blue-600">
                {totales.pendientesPago}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            estadoFilter === "C" ? "ring-2 ring-primary ring-offset-2" : ""
          }`}
          onClick={() => setEstadoFilter("C")}
        >
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">
                Pagados
              </p>
              <h3 className="text-3xl font-bold mt-2 text-green-600">
                {totales.pagados}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            estadoFilter === "V" ? "ring-2 ring-primary ring-offset-2" : ""
          }`}
          onClick={() => setEstadoFilter("V")}
        >
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">
                Sin Verificar
              </p>
              <h3 className="text-3xl font-bold mt-2 text-yellow-600">
                {totales.verificacionPendiente}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            estadoFilter === "Rechazado"
              ? "ring-2 ring-primary ring-offset-2"
              : ""
          }`}
          onClick={() => setEstadoFilter("R")}
        >
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">
                Rechazados
              </p>
              <h3 className="text-3xl font-bold mt-2 text-red-600">
                {totales.rechazados}
              </h3>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            estadoFilter === "Kits pendientes de entregar"
              ? "ring-2 ring-primary ring-offset-2"
              : ""
          }`}
          onClick={() => setEstadoFilter("K")}
        >
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">
                Kits pendientes de entregar
              </p>
              <h3 className="text-3xl font-bold mt-2 text-red-600">
                {totales.kitsPendientesDeEntregar}
              </h3>
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
                placeholder="Buscar por nombre, correo electrónico o institución..."
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
                  <SelectItem value="E">Estudiante</SelectItem>
                  <SelectItem value="C">Catedrático</SelectItem>
                  <SelectItem value="I">Invitado</SelectItem>
                </SelectContent>
              </Select>

              <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Estado de pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="P">Pendiente</SelectItem>
                  <SelectItem value="C">Completado</SelectItem>
                  <SelectItem value="R">Rechazado</SelectItem>
                  <SelectItem value="V">Verificando</SelectItem>
                  <SelectItem value="K">Kits pendientes de entregar</SelectItem>
                </SelectContent>
              </Select>

              <Select value={tipoPagoFilter} onValueChange={setTipoPagoFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo de pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los tipos</SelectItem>
                  <SelectItem value="E">Efectivo</SelectItem>
                  <SelectItem value="D">Depósito</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-md border">
        <Table style={{ maxHeight: "500px !important" }}>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => requestSort("idParticipante")}>
                ID
                {renderSortIcon("idParticipante")}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort("nombre")}
              >
                <div className="flex items-center">
                  Nombre
                  {renderSortIcon("nombre")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort("correoElectronico")}
              >
                <div className="flex items-center">
                  Email
                  {renderSortIcon("correoElectronico")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort("tipoParticipante")}
              >
                <div className="flex items-center">
                  Tipo participante
                  {renderSortIcon("tipoParticipante")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort("estadoPago")}
              >
                <div className="flex items-center">
                  Estado de Pago
                  {renderSortIcon("estadoPago")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort("tipoPago")}
              >
                <div className="flex items-center">
                  Tipo de Pago
                  {renderSortIcon("tipoPago")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort("fechaRegistro")}
              >
                <div className="flex items-center">
                  Fecha de Registro
                  {renderSortIcon("fechaRegistro")}
                </div>
              </TableHead>
              {/*   <TableHead onClick={() => requestSort("certificadoEnviado")}>
                Cert. Enviado
                {renderSortIcon("certificadoEnviado")}
              </TableHead> */}
              <TableHead onClick={() => requestSort("kit")}>
                Kit entregado
                {renderSortIcon("kit")}
              </TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody style={{ maxHeight: "500px !important" }}>
            {isLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "0.6rem 0",
                }}
              >
                <small className="text-muted-foreground text-center">
                  Cargando...
                </small>
              </div>
            ) : filteredAndSortedParticipantes?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No se encontraron participantes con los filtros seleccionados
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedParticipantes?.map((participante) => (
                <TableRow key={participante.idParticipante}>
                  <TableCell>{participante.idParticipante}</TableCell>
                  <TableCell className="font-medium">
                    {participante.nombre}
                  </TableCell>
                  <TableCell>{participante.correoElectronico}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {tipoParticipanteMap[participante.tipoParticipante]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        participante.estadoPago === "C"
                          ? "success"
                          : participante.estadoPago === "P"
                          ? "default"
                          : participante.estadoPago === "R"
                          ? "destructive"
                          : participante.estadoPago === "V"
                          ? "warning"
                          : "secondary"
                      }
                    >
                      {estadoPagoMap[participante.estadoPago]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {tipoPagoMap[participante.tipoPago]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatDate(participante.fechaRegistro)}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={participante.kit ? "success" : "destructive"}
                    >
                      {participante.kit ? "Sí" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedParticipante(participante);
                          setIsBoletaOpen(true);
                        }}
                        title="Ver boleta"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            title="Cambiar estado de pago"
                          >
                            <CreditCard className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() =>
                              cambiarEstadoPago(
                                participante.idParticipante,
                                "P"
                              )
                            }
                          >
                            Pendiente de Pago
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              cambiarEstadoPago(
                                participante.idParticipante,
                                "V"
                              )
                            }
                          >
                            Verificación pendiente
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              cambiarEstadoPago(
                                participante.idParticipante,
                                "C"
                              )
                            }
                          >
                            Pagado
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              cambiarEstadoPago(
                                participante.idParticipante,
                                "R"
                              )
                            }
                          >
                            Rechazado
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            title="Cambiar estado del kit"
                          >
                            <Shirt className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {participante.estadoPago === "C" ? (
                            <DropdownMenuItem
                              onClick={() =>
                                cambiarEstadoKit(participante.idParticipante, 1)
                              }
                            >
                              Entregado
                            </DropdownMenuItem>
                          ) : null}
                          <DropdownMenuItem
                            onClick={() =>
                              cambiarEstadoKit(participante.idParticipante, 0)
                            }
                          >
                            No entregado
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" title="Cambiar estado del certificado">
                <FileText className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => cambiarEstadoCert(participante.idParticipante, 1)}>
                Enviado
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => cambiarEstadoCert(participante.idParticipante, 0)}>
                No enviado
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedParticipante(participante);
                          setIsEditOpen(true);
                        }}
                        title="Editar participante"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedParticipante(participante);
                          setIsDeleteOpen(true);
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
          onConfirm={() =>
            eliminarParticipante(selectedParticipante.idParticipante)
          }
        />
      )}
    </>
  );
}

// Estilos personalizados para los badges
const badgeVariants = {
  success: "bg-green-100 text-green-800 hover:bg-green-200",
  warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  destructive: "bg-red-100 text-red-800 hover:bg-red-200",
};
