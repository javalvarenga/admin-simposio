
/* crea un hook para obtener todos los participantes */

import { useQuery } from "@tanstack/react-query"
import { api } from "../../services/api"

export function useGetAllParticipants() {


  const { data, isLoading, error } = useQuery({
    queryKey: ["participantes"],
    queryFn: () => api.get("/participants"),
  })

  return {
    participantes: data?.data,
    isLoading,
    error,
  }
}