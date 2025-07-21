import React from "react";
import { Badge } from "@/components/ui/badge";
import type { Machine } from "@/types";

interface MachineCardProps {
  machine: Machine;
}

export default function MachineCard({ machine }: MachineCardProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "operational":
        return "default";
      case "warning":
        return "secondary";
      case "maintenance":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "status-operational";
      case "warning":
        return "status-warning";
      case "maintenance":
        return "status-maintenance";
      default:
        return "";
    }
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">{machine.machineId}</h3>
        <Badge className={`${getStatusColor(machine.status)} border`}>
          {machine.status}
        </Badge>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Efficiency:</span>
          <span className="font-medium text-gray-900">{machine.efficiency}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Temperature:</span>
          <span className="font-medium text-gray-900">{machine.temperature}°C</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Vibration:</span>
          <span className="font-medium text-gray-900">{machine.vibration} Hz</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Last Maintenance:</span>
          <span className="font-medium text-gray-900">
            {formatDate(machine.lastMaintenance)}
          </span>
        </div>
      </div>
    </div>
  );
}
