"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Participante } from "./participantes-table";
import { useGetParticipantById } from "@/hooks/Participants/useGetParticipantById";

function getMimeTypeFromBuffer(buffer: Buffer): string | null {
  if (!buffer || buffer.length < 8) {
    return null;
  }

  // PNG
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "image/png";
  }

  // JPEG
  if (
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[buffer.length - 2] === 0xff &&
    buffer[buffer.length - 1] === 0xd9
  ) {
    return "image/png";
  }

  return 'image/png'; // Desconocido
}

interface VerBoletaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  participante: Participante;
  onCambiarEstado: (id: number, nuevoEstado: string) => void;
  onCambiarTipoPago?: (id: number, nuevoTipo: string) => void;
}

export function VerBoletaDialog({
  isOpen,
  onClose,
  participante,
  onCambiarEstado,
  onCambiarTipoPago,
}: VerBoletaDialogProps) {
  const { result, isLoading } = useGetParticipantById(
    participante?.idParticipante
  );

  const participanteById = result;

  // Verificar primero si los datos están cargados
  /* const base64Image = participanteById?.boleta?.data
    ? `data:image/png;base64,${Buffer.from(
        participanteById.boleta.data
      ).toString("utf8")}`
    : null;  */
 
  const base64Image = participanteById?.boleta?.data
    ? `data:${getMimeTypeFromBuffer(
        participanteById.boleta.data
      )};base64,${Buffer.from(participanteById.boleta.data).toString("utf8")}`
    : null; 

 

  const [estadoSeleccionado, setEstadoSeleccionado] = useState(
    participante?.estadoPago
  );
  const [tipoPagoSeleccionado, setTipoPagoSeleccionado] = useState(
    participante?.tipoPago
  );

  const handleCambiarEstado = () => {
    onCambiarEstado(participante.idParticipante, estadoSeleccionado);

    if (onCambiarTipoPago && tipoPagoSeleccionado !== participante.tipoPago) {
      onCambiarTipoPago(participante.idParticipante, tipoPagoSeleccionado);
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Boleta de Pago</DialogTitle>
          <DialogDescription>
            Boleta subida por {participante.nombre}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Estado actual:</Label>
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
              {participante.estadoPago === "C"
                ? "Pagado"
                : participante.estadoPago === "V"
                ? "Verificación"
                : participante.estadoPago === "P"
                ? "Pendiente"
                : "Rechazado"}
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <Label>Tipo de pago:</Label>
            <Badge
              variant={participante.tipoPago === "E" ? "outline" : "secondary"}
            >
              {participante.tipoPago === "E" ? "Efectivo" : "Depósito"}
            </Badge>
          </div>

          <div className="flex justify-between">
            <Label>Fecha de registro:</Label>
            <span>
              {new Date(participante.fechaRegistro).toLocaleDateString()}
            </span>
          </div>

          {base64Image && (
            <>
              <div className="border-t pt-4">
                <Label>Boleta de pago</Label>
              </div>
              <div className="border rounded-md overflow-hidden">
                <Image
                style={{height:'300px',objectFit:'contain'}}
                  src={base64Image || "/placeholder.svg"}
                  alt="Boleta de pago"
                  width={400}
                  height={300}
                  className="w-full h-auto object-contain"
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
