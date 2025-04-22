/* using api.ts create a services for particpants: changePaymmentStatus, ... */

import { api } from "../api";

export function changePaymmentStatus(participantId: number, newStatus: string) {
  return api.patch(`/participants/updatePaymentStatus/${participantId}`, {
    estadoPago: newStatus,
  });
}

export function changeKitStatus(participantId: number, newStatus: number) {
  return api.patch(`/participants/updateKitStatus/${participantId}`, {
    kit: newStatus,
  });
}

export function deleteParticipant(participantId: number) {
  return api.delete(`/participants/${participantId}`);
}
