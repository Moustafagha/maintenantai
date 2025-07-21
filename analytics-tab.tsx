import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Clock, DollarSign, Gauge } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function AnalyticsTab() {
  const { data: predictive = {}, isLoading: predictiveLoading } = useQuery({
    queryKey: ["/api/analytics/predictive"],
  });

  const { data: schedule = [], isLoading: scheduleLoading } = useQuery({
    queryKey: ["/api/analytics/maintenance-schedule"],
  });

  const { data: stats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/analytics/dashboard-stats"],
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Predictive Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Predictive Insights</CardTitle>
            <CardDescription>AI-powered maintenance predictions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {predictiveLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-5 w-5 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Failure Probability</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">
                    {(predictive as any)?.failureProbability || "0"}%
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Recommended Maintenance</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    {(predictive as any)?.recommendedMaintenance || "30"} days
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Gauge className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">Efficiency Forecast</span>
                  </div>
                  <span className="text-lg font-bold text-purple-600">
                    {(predictive as any)?.efficiencyForecast || "85"}%
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-5 w-5 text-amber-600" />
                    <span className="font-medium">Potential Savings</span>
                  </div>
                  <span className="text-lg font-bold text-amber-600">
                    ${((predictive as any)?.potentialSavings || 0).toLocaleString()}
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Maintenance Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Schedule</CardTitle>
            <CardDescription>Upcoming maintenance recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scheduleLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                    </div>
                  </div>
                ))
              ) : (schedule as any[]).length > 0 ? (
                (schedule as any[]).slice(0, 5).map((item: any) => {
                  const urgencyColors: { [key: string]: string } = {
                    high: "border-red-200 bg-red-50 text-red-900",
                    medium: "border-yellow-200 bg-yellow-50 text-yellow-900", 
                    low: "border-green-200 bg-green-50 text-green-900"
                  };
                  
                  return (
                    <div key={item.machineId} className={`flex items-center justify-between p-3 border rounded-lg ${urgencyColors[item.urgency] || urgencyColors.low}`}>
                      <div>
                        <p className="font-medium">{item.machineIdentifier}</p>
                        <p className="text-sm capitalize">{item.urgency} Priority</p>
                      </div>
                      <span className="text-sm font-medium">
                        {item.recommendedDays} days
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <Clock className="h-6 w-6 mx-auto mb-2" />
                  <p>No maintenance scheduled</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>Key performance indicators and trends</CardDescription>
        </CardHeader>
        <CardContent>
          {statsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="text-center animate-pulse">
                  <div className="h-10 bg-gray-200 rounded w-20 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-24 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">94.5%</div>
                <p className="text-sm text-gray-600">Overall Equipment Effectiveness</p>
                <p className="text-xs text-green-600">↑ 2.3% from last month</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">99.1%</div>
                <p className="text-sm text-gray-600">Uptime Percentage</p>
                <p className="text-xs text-green-600">↑ 0.8% from last month</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  ${(((stats as any)?.costSavings || 0) / 1000).toFixed(0)}K
                </div>
                <p className="text-sm text-gray-600">Maintenance Cost Savings</p>
                <p className="text-xs text-green-600">↓ 15% from last quarter</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
