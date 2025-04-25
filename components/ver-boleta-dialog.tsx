"use client";

import { useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Participante } from "./participantes-table";

// Genera el src para <img> o <iframe> según el tipo de boleta
function generarSrc(boleta: string | { type: string; data: number[] }) {
  if (typeof boleta === "string") {
    if (boleta.startsWith("data:")) {
      return boleta;
    }

    // Detecta si probablemente es PDF por la codificación (comienza con "JVBER")
    const probablePDF = boleta.slice(0, 10).includes("JVBER") || boleta.includes("base64,aVZCT1J3");
    return probablePDF
      ? `data:application/pdf;base64,${boleta}`
      : `data:image/png;base64,${boleta}`; // Cambia a image/jpeg si usás JPG
  } else if (boleta && boleta.data && Array.isArray(boleta.data)) {
    const byteArray = new Uint8Array(boleta.data);
    const base64String = btoa(String.fromCharCode(...byteArray));
    return `data:application/pdf;base64,${base64String}`;
  }

  return "";
}

interface VerBoletaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  participante: Participante;
}

export function VerBoletaDialog({
  isOpen,
  onClose,
  participante,
}: VerBoletaDialogProps) {
  const srcBoleta = useMemo(() => generarSrc(participante.boleta), [participante.boleta]);

  const esPDF = useMemo(() => {
    return srcBoleta.startsWith("data:application/pdf");
  }, [srcBoleta]);

  useEffect(() => {
    if (srcBoleta) {
      console.log("Base64 generado para boleta:", srcBoleta);
    }
  }, [srcBoleta]);

  const handleDescargarBoleta = () => {
    const link = document.createElement("a");
    link.href = srcBoleta;
    link.download = `boleta_${participante.idParticipante}${esPDF ? ".pdf" : ".png"}`;
    link.click();
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

        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Estado de pago:</span>
            <span>{participante.estadoPago}</span>
          </div>

          <div className="border rounded-md overflow-hidden max-h-[600px]">
            {srcBoleta ? (
              esPDF ? (
                <iframe
                  src={srcBoleta}
                  title="Boleta PDF"
                  width="100%"
                  height="600px"
                  className="rounded"
                />
              ) : (
                <img
                  src={srcBoleta}
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
  );
}
