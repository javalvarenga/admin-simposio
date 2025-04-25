
/* crea un hook para obtener todos los participantes */

import { useQuery } from "@tanstack/react-query"
import { api } from "../../services/api"

export function useGetParticipantById(id: number) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["participantePorId", id], // Include id in the query key for proper caching
    queryFn: () => api.get(`/participants/${id}`), // Use the id parameter in the API call
  })
  
  return {
    result: data?.data, // Changed to singular since it's a single participant
    isLoading,
    error,
  }
}