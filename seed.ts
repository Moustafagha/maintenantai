import { db } from "./db";
import { users, machines, maintenanceRecords, securityEvents } from "@shared/schema";

export async function seedDatabase() {
  try {
    // Check if data already exists
    const existingUsers = await db.select().from(users);
    if (existingUsers.length > 0) {
      console.log("Database already seeded");
      return;
    }

    console.log("Seeding database...");

    // Create admin user
    const [adminUser] = await db.insert(users).values({
      username: "admin",
      password: "password", // In production, this should be hashed
      role: "admin"
    }).returning();

    console.log("Created admin user:", adminUser.username);

    // Create sample machines
    const sampleMachines = [
      {
        name: "CNC Machine 001",
        type: "CNC Milling",
        machineId: "CNC-001",
        status: "operational",
        temperature: 68,
        vibration: 0.8,
        efficiency: 94
      },
      {
        name: "Press Machine 002", 
        type: "Hydraulic Press",
        machineId: "PRESS-002",
        status: "warning",
        temperature: 82,
        vibration: 2.1,
        efficiency: 87
      },
      {
        name: "Robotic Arm 003",
        type: "Assembly Robot",
        machineId: "ROBOT-003", 
        status: "operational",
        temperature: 71,
        vibration: 0.5,
        efficiency: 96
      },
      {
        name: "Conveyor Belt 004",
        type: "Transport System",
        machineId: "CONV-004",
        status: "maintenance",
        temperature: 65,
        vibration: 1.2,
        efficiency: 78
      },
      {
        name: "Quality Scanner 005",
        type: "Vision System", 
        machineId: "SCAN-005",
        status: "operational",
        temperature: 69,
        vibration: 0.3,
        efficiency: 99
      }
    ];

    const createdMachines = await db.insert(machines).values(sampleMachines).returning();
    console.log(`Created ${createdMachines.length} machines`);

    // Create sample maintenance records
    const sampleMaintenanceRecords = [
      {
        machineId: createdMachines[0].id,
        type: "scheduled",
        description: "Scheduled maintenance on CNC-001",
        technician: "John Doe",
        status: "completed",
        scheduledDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        completedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        cost: 1200
      },
      {
        machineId: createdMachines[1].id,
        type: "repair",
        description: "Temperature warning on PRESS-002", 
        technician: "Jane Smith",
        status: "pending",
        scheduledDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        completedDate: null,
        cost: 3200
      },
      {
        machineId: createdMachines[2].id,
        type: "inspection",
        description: "Safety inspection on ROBOT-003",
        technician: "Mike Johnson", 
        status: "pending",
        scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        completedDate: null,
        cost: 800
      }
    ];

    const createdRecords = await db.insert(maintenanceRecords).values(sampleMaintenanceRecords).returning();
    console.log(`Created ${createdRecords.length} maintenance records`);

    // Create sample security events
    const sampleSecurityEvents = [
      {
        eventType: "login",
        description: "Admin user logged in successfully",
        username: "admin",
        ipAddress: "192.168.1.100",
        severity: "info"
      },
      {
        eventType: "failed_login", 
        description: "Failed login attempt with invalid credentials",
        username: "unknown",
        ipAddress: "192.168.1.50",
        severity: "warning"
      },
      {
        eventType: "system_update",
        description: "System security patch applied",
        username: "system",
        ipAddress: null,
        severity: "info"
      },
      {
        eventType: "access_denied",
        description: "Unauthorized access attempt to machine control panel",
        username: "guest",
        ipAddress: "192.168.1.75", 
        severity: "high"
      }
    ];

    const createdEvents = await db.insert(securityEvents).values(sampleSecurityEvents).returning();
    console.log(`Created ${createdEvents.length} security events`);

    console.log("Database seeding completed successfully!");

  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}