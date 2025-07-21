import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
// Removed Tabs import as we're using custom tab implementation
import { Cog, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import OverviewTab from "@/components/dashboard/overview-tab";
import MonitoringTab from "@/components/dashboard/monitoring-tab";
import AnalyticsTab from "@/components/dashboard/analytics-tab";
import SecurityTab from "@/components/dashboard/security-tab";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // This would trigger data refetch in real implementation
      console.log("Auto-refreshing dashboard data...");
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Cog className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">MaintAI Platform</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.username}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6" data-active-tab={activeTab}>
          <div className="grid w-full grid-cols-4 bg-gray-100 h-10 items-center justify-center rounded-md p-1 text-muted-foreground">
            <button
              onClick={() => setActiveTab("overview")}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                activeTab === "overview" ? "bg-white text-foreground shadow-sm" : ""
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("monitoring")}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                activeTab === "monitoring" ? "bg-white text-foreground shadow-sm" : ""
              }`}
            >
              Monitoring
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                activeTab === "analytics" ? "bg-white text-foreground shadow-sm" : ""
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                activeTab === "security" ? "bg-white text-foreground shadow-sm" : ""
              }`}
            >
              Security
            </button>
          </div>

          <div className="fade-in mt-6">
            {activeTab === "overview" && <OverviewTab />}
            {activeTab === "monitoring" && <MonitoringTab />}
            {activeTab === "analytics" && <AnalyticsTab />}
            {activeTab === "security" && <SecurityTab />}
          </div>
        </div>
      </main>
    </div>
  );
}
