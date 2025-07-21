// Re-export types from shared schema
export type { 
  User, 
  InsertUser,
  Machine, 
  InsertMachine,
  MaintenanceRecord, 
  InsertMaintenanceRecord,
  SecurityEvent,
  InsertSecurityEvent 
} from "@shared/schema";

// Additional frontend-specific types
export interface DashboardStats {
  totalMachines: number;
  operationalMachines: number;
  avgEfficiency: number;
  activeAlerts: number;
  costSavings: number;
}

export interface PredictiveInsights {
  failureProbability: string;
  recommendedMaintenance: number;
  potentialSavings: number;
  efficiencyForecast: number;
}

export interface MaintenanceScheduleItem {
  machineId: number;
  machineIdentifier: string;
  name: string;
  urgency: "high" | "medium" | "low";
  recommendedDays: number;
  failureProbability: number;
  estimatedCost: number;
}

export interface SecurityStatus {
  systemIntegrity: string;
  accessControl: string;
  failedLoginsToday: number;
  lastSecurityScan: Date;
}
