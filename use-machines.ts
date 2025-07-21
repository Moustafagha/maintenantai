import { useQuery } from "@tanstack/react-query";
import type { Machine } from "@/types";

export function useMachines() {
  return useQuery({
    queryKey: ["/api/machines"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

export function useMachine(id: number) {
  return useQuery({
    queryKey: ["/api/machines", id],
    enabled: !!id,
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["/api/analytics/dashboard-stats"],
    refetchInterval: 30000,
  });
}

export function usePredictiveAnalytics() {
  return useQuery({
    queryKey: ["/api/analytics/predictive"],
    refetchInterval: 60000, // Refresh every minute
  });
}

export function useMaintenanceSchedule() {
  return useQuery({
    queryKey: ["/api/analytics/maintenance-schedule"],
    refetchInterval: 60000,
  });
}
