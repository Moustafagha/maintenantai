import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Lock, AlertTriangle, Shield, UserCheck, Key, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function SecurityTab() {
  const { data: securityStatus = {}, isLoading: statusLoading } = useQuery({
    queryKey: ["/api/security/status"],
  });

  const { data: securityEvents = [], isLoading: eventsLoading } = useQuery({
    queryKey: ["/api/security/events", "10"],
    queryFn: async () => {
      const response = await fetch("/api/security/events?limit=10", {
        credentials: "include"
      });
      if (!response.ok) {
        throw new Error("Failed to fetch security events");
      }
      return response.json();
    }
  });

  // Mock user data - in real app this would come from API
  const users = [
    { id: 1, username: "admin", role: "Administrator", status: "Active" },
    { id: 2, username: "technician01", role: "Maintenance Technician", status: "Offline" },
    { id: 3, username: "supervisor", role: "Operations Supervisor", status: "Active" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Status */}
        <Card>
          <CardHeader>
            <CardTitle>Security Status</CardTitle>
            <CardDescription>System security and access monitoring</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {statusLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-5 w-5 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                    <span className="font-medium">System Integrity</span>
                  </div>
                  <span className="text-sm font-medium text-green-600">
                    {(securityStatus as any)?.systemIntegrity || "Secure"}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Lock className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Access Control</span>
                  </div>
                  <span className="text-sm font-medium text-green-600">
                    {(securityStatus as any)?.accessControl || "Active"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium">Failed Login Attempts</span>
                  </div>
                  <span className="text-sm font-medium text-yellow-600">
                    {(securityStatus as any)?.failedLoginsToday || 0} today
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Recent Security Events */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Security Events</CardTitle>
            <CardDescription>Latest security-related activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {eventsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                      <div className="h-4 w-4 bg-gray-200 rounded mt-0.5"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : securityEvents.length > 0 ? (
                securityEvents.slice(0, 5).map((event: any) => {
                  const getEventIcon = (eventType: string) => {
                    switch (eventType) {
                      case "login":
                        return <UserCheck className="h-4 w-4 text-blue-600 mt-0.5" />;
                      case "security_scan":
                        return <Shield className="h-4 w-4 text-green-600 mt-0.5" />;
                      case "failed_login":
                        return <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />;
                      default:
                        return <Key className="h-4 w-4 text-purple-600 mt-0.5" />;
                    }
                  };

                  return (
                    <div key={event.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                      {getEventIcon(event.eventType)}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{event.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(event.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <Shield className="h-6 w-6 mx-auto mb-2" />
                  <p>No recent security events</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Active users and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    user.status === "Active" ? "bg-blue-100" : "bg-gray-100"
                  }`}>
                    <User className={`h-4 w-4 ${
                      user.status === "Active" ? "text-blue-600" : "text-gray-600"
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium">{user.username}</p>
                    <p className="text-sm text-gray-500">{user.role}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.status === "Active" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {user.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
