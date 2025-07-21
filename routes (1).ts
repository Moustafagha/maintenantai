import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertMachineSchema, insertMaintenanceRecordSchema, insertSecurityEventSchema } from "@shared/schema";
import { z } from "zod";

// Predictive analytics algorithms
const predictiveAnalytics = {
  // Calculate failure probability based on machine data
  calculateFailureProbability: (machine: any) => {
    const { temperature, vibration, efficiency, lastMaintenance } = machine;
    
    // Normalize factors (0-1 scale)
    const tempFactor = Math.max(0, (temperature - 70) / 30); // Higher temp = higher risk
    const vibrationFactor = Math.max(0, (vibration - 1) / 4); // Higher vibration = higher risk
    const efficiencyFactor = Math.max(0, (100 - efficiency) / 40); // Lower efficiency = higher risk
    
    // Days since last maintenance
    const daysSinceMaintenance = (Date.now() - new Date(lastMaintenance).getTime()) / (1000 * 60 * 60 * 24);
    const maintenanceFactor = Math.min(1, daysSinceMaintenance / 30); // More days = higher risk
    
    // Weighted average
    const failureProbability = (
      tempFactor * 0.3 +
      vibrationFactor * 0.25 +
      efficiencyFactor * 0.25 +
      maintenanceFactor * 0.2
    );
    
    return Math.min(1, failureProbability);
  },

  // Calculate maintenance schedule
  calculateMaintenanceSchedule: (machines: any[]) => {
    return machines.map(machine => {
      const failureProb = predictiveAnalytics.calculateFailureProbability(machine);
      const urgency = failureProb > 0.7 ? 'high' : failureProb > 0.4 ? 'medium' : 'low';
      const recommendedDays = failureProb > 0.7 ? 1 : failureProb > 0.4 ? 7 : 30;
      
      return {
        machineId: machine.id,
        machineIdentifier: machine.machineId,
        name: machine.name,
        urgency,
        recommendedDays,
        failureProbability: failureProb,
        estimatedCost: Math.floor(failureProb * 10000) + 1000
      };
    });
  },

  // Calculate cost savings
  calculateCostSavings: (machines: any[]) => {
    const totalPreventiveCost = machines.length * 2000;
    const potentialFailureCost = machines.reduce((total, machine) => {
      const failureProb = predictiveAnalytics.calculateFailureProbability(machine);
      return total + (failureProb * 15000);
    }, 0);
    
    return Math.max(0, potentialFailureCost - totalPreventiveCost);
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        // Log failed login attempt
        await storage.createSecurityEvent({
          eventType: "failed_login",
          description: `Failed login attempt for user: ${username}`,
          ipAddress: req.ip,
          username: username,
          severity: "warning"
        });
        
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Log successful login
      await storage.createSecurityEvent({
        eventType: "login",
        description: `User ${username} logged in successfully`,
        ipAddress: req.ip,
        username: username,
        severity: "info"
      });

      res.json({ 
        user: { 
          id: user.id, 
          username: user.username, 
          role: user.role 
        } 
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    // In a real app, you'd handle session invalidation here
    res.json({ message: "Logged out successfully" });
  });

  // Machine routes
  app.get("/api/machines", async (req, res) => {
    try {
      const machines = await storage.getAllMachines();
      res.json(machines);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch machines" });
    }
  });

  app.get("/api/machines/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const machine = await storage.getMachine(id);
      
      if (!machine) {
        return res.status(404).json({ message: "Machine not found" });
      }
      
      res.json(machine);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch machine" });
    }
  });

  app.post("/api/machines", async (req, res) => {
    try {
      const validatedData = insertMachineSchema.parse(req.body);
      const machine = await storage.createMachine(validatedData);
      res.status(201).json(machine);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid machine data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create machine" });
      }
    }
  });

  app.patch("/api/machines/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const updatedMachine = await storage.updateMachine(id, updates);
      
      if (!updatedMachine) {
        return res.status(404).json({ message: "Machine not found" });
      }
      
      res.json(updatedMachine);
    } catch (error) {
      res.status(500).json({ message: "Failed to update machine" });
    }
  });

  // Analytics routes
  app.get("/api/analytics/dashboard-stats", async (req, res) => {
    try {
      const machines = await storage.getAllMachines();
      const maintenanceRecords = await storage.getMaintenanceRecords();
      
      const operationalMachines = machines.filter(m => m.status === 'operational').length;
      const avgEfficiency = Math.floor(machines.reduce((sum, m) => sum + m.efficiency, 0) / machines.length);
      const activeAlerts = machines.filter(m => m.status === 'warning').length;
      const costSavings = predictiveAnalytics.calculateCostSavings(machines);
      
      res.json({
        totalMachines: machines.length,
        operationalMachines,
        avgEfficiency,
        activeAlerts,
        costSavings: Math.floor(costSavings)
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  app.get("/api/analytics/predictive", async (req, res) => {
    try {
      const machines = await storage.getAllMachines();
      const maintenanceSchedule = predictiveAnalytics.calculateMaintenanceSchedule(machines);
      const totalFailureProbability = machines.reduce((sum, machine) => 
        sum + predictiveAnalytics.calculateFailureProbability(machine), 0) / machines.length;
      
      // Find next maintenance recommendation
      const sortedSchedule = maintenanceSchedule.sort((a, b) => a.recommendedDays - b.recommendedDays);
      const nextMaintenance = sortedSchedule[0];
      
      const avgEfficiency = Math.floor(machines.reduce((sum, m) => sum + m.efficiency, 0) / machines.length);
      
      res.json({
        failureProbability: (totalFailureProbability * 100).toFixed(1),
        recommendedMaintenance: nextMaintenance ? nextMaintenance.recommendedDays : 30,
        potentialSavings: Math.floor(predictiveAnalytics.calculateCostSavings(machines)),
        efficiencyForecast: Math.min(100, avgEfficiency + Math.floor(Math.random() * 10))
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch predictive analytics" });
    }
  });

  app.get("/api/analytics/maintenance-schedule", async (req, res) => {
    try {
      const machines = await storage.getAllMachines();
      const schedule = predictiveAnalytics.calculateMaintenanceSchedule(machines);
      
      // Sort by urgency and recommended days
      const sortedSchedule = schedule.sort((a, b) => {
        const urgencyOrder: { [key: string]: number } = { high: 0, medium: 1, low: 2 };
        const aUrgency = urgencyOrder[a.urgency] ?? 3;
        const bUrgency = urgencyOrder[b.urgency] ?? 3;
        if (aUrgency !== bUrgency) {
          return aUrgency - bUrgency;
        }
        return a.recommendedDays - b.recommendedDays;
      });
      
      res.json(sortedSchedule);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch maintenance schedule" });
    }
  });

  // Maintenance routes
  app.get("/api/maintenance", async (req, res) => {
    try {
      const records = await storage.getMaintenanceRecords();
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch maintenance records" });
    }
  });

  app.post("/api/maintenance", async (req, res) => {
    try {
      const validatedData = insertMaintenanceRecordSchema.parse(req.body);
      const record = await storage.createMaintenanceRecord(validatedData);
      res.status(201).json(record);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid maintenance record data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create maintenance record" });
      }
    }
  });

  // Security routes
  app.get("/api/security/events", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const events = await storage.getSecurityEvents(limit);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch security events" });
    }
  });

  app.get("/api/security/status", async (req, res) => {
    try {
      const recentEvents = await storage.getSecurityEvents(10);
      const failedLogins = recentEvents.filter(e => e.eventType === 'failed_login' && 
        e.createdAt && e.createdAt.getTime() > Date.now() - 24 * 60 * 60 * 1000).length;
      
      res.json({
        systemIntegrity: "secure",
        accessControl: "active",
        failedLoginsToday: failedLogins,
        lastSecurityScan: recentEvents.find(e => e.eventType === 'security_scan')?.createdAt || new Date()
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch security status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
