import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Monitor, Gauge, AlertTriangle, DollarSign, Wrench, BarChart3, Database, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import StatsCard from "./stats-card";
import ActivityItem from "./activity-item";

export default function OverviewTab() {
  const { data: stats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/analytics/dashboard-stats"],
  });

  const { data: maintenanceRecords = [], isLoading: recordsLoading } = useQuery({
    queryKey: ["/api/maintenance"],
  });

  const quickActions = [
    { icon: Wrench, label: "Schedule Maintenance", onClick: () => console.log("Schedule maintenance") },
    { icon: BarChart3, label: "View Reports", onClick: () => console.log("View reports") },
    { icon: Database, label: "Data Export", onClick: () => console.log("Data export") },
    { icon: Shield, label: "Security Check", onClick: () => console.log("Security check") },
  ];

  if (statsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Machines"
          value={(stats as any)?.totalMachines || 0}
          subtitle={`${(stats as any)?.operationalMachines || 0} operational`}
          icon={Monitor}
        />
        <StatsCard
          title="Avg Efficiency"
          value={`${(stats as any)?.avgEfficiency || 0}%`}
          subtitle="+2.5% from last week"
          icon={Gauge}
        />
        <StatsCard
          title="Active Alerts"
          value={(stats as any)?.activeAlerts || 0}
          subtitle="Requires attention"
          icon={AlertTriangle}
        />
        <StatsCard
          title="Cost Savings"
          value={`$${((stats as any)?.costSavings || 0).toLocaleString()}`}
          subtitle="This month"
          icon={DollarSign}
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common maintenance tasks and system operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-gray-50"
                onClick={action.onClick}
              >
                <action.icon className="h-6 w-6 text-gray-600" />
                <span className="text-sm font-medium text-center">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Latest maintenance activities and system events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recordsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                    <div className="h-5 w-5 bg-gray-200 rounded"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              ))
            ) : (maintenanceRecords as any[]).length > 0 ? (
              (maintenanceRecords as any[]).slice(0, 5).map((record: any) => (
                <ActivityItem key={record.id} record={record} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                <p>No recent activities found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
