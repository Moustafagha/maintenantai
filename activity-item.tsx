import React from "react";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";
import type { MaintenanceRecord } from "@/types";

interface ActivityItemProps {
  record: MaintenanceRecord;
}

export default function ActivityItem({ record }: ActivityItemProps) {
  const getActivityIcon = (status: string) => {
    const statusColors = {
      completed: "text-green-600",
      pending: "text-yellow-600", 
      "in-progress": "text-blue-600",
      active: "text-red-600"
    };
    
    return (
      <Activity className={`h-5 w-5 ${statusColors[status as keyof typeof statusColors] || "text-gray-600"}`} />
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="status-operational">completed</Badge>;
      case "pending":
        return <Badge className="status-warning">pending</Badge>;
      case "in-progress":
        return <Badge className="status-warning">in-progress</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="flex items-center space-x-4 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
      <div className="flex-shrink-0">
        {getActivityIcon(record.status)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{record.description}</p>
        <p className="text-sm text-gray-500">
          {record.technician} • {formatDate(record.createdAt)}
        </p>
      </div>
      <div className="flex-shrink-0">
        {getStatusBadge(record.status)}
      </div>
    </div>
  );
}
