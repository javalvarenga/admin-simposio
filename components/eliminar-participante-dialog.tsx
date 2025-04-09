"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Participante {
  id: string
  nombre: string
  email: string
  tipo: string
  estadoPago: string
  fechaRegistro: string
  telefono: string
  institucion: string
  boletaUrl: string
}

interface EliminarParticipanteDialogProps {
  isOpen: boolean
  onClose: () => void
  participante: Participante
  onConfirm: () => void
}

export function EliminarParticipanteDialog({
  isOpen,
  onClose,
  participante,
  onConfirm,
}: EliminarParticipanteDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará permanentemente a {participante.nombre} del sistema y no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

