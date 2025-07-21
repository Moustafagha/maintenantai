import { users, machines, maintenanceRecords, securityEvents, type User, type InsertUser, type Machine, type InsertMachine, type MaintenanceRecord, type InsertMaintenanceRecord, type SecurityEvent, type InsertSecurityEvent } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Machine methods
  getAllMachines(): Promise<Machine[]>;
  getMachine(id: number): Promise<Machine | undefined>;
  createMachine(machine: InsertMachine): Promise<Machine>;
  updateMachine(id: number, updates: Partial<InsertMachine>): Promise<Machine | undefined>;

  // Maintenance methods
  getMaintenanceRecords(machineId?: number): Promise<MaintenanceRecord[]>;
  createMaintenanceRecord(record: InsertMaintenanceRecord): Promise<MaintenanceRecord>;
  updateMaintenanceRecord(id: number, updates: Partial<InsertMaintenanceRecord>): Promise<MaintenanceRecord | undefined>;

  // Security methods
  getSecurityEvents(limit?: number): Promise<SecurityEvent[]>;
  createSecurityEvent(event: InsertSecurityEvent): Promise<SecurityEvent>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private machines: Map<number, Machine>;
  private maintenanceRecords: Map<number, MaintenanceRecord>;
  private securityEvents: Map<number, SecurityEvent>;
  private currentUserId: number;
  private currentMachineId: number;
  private currentMaintenanceId: number;
  private currentSecurityEventId: number;

  constructor() {
    this.users = new Map();
    this.machines = new Map();
    this.maintenanceRecords = new Map();
    this.securityEvents = new Map();
    this.currentUserId = 1;
    this.currentMachineId = 1;
    this.currentMaintenanceId = 1;
    this.currentSecurityEventId = 1;
    this.initializeData();
  }

  private initializeData() {
    // Create default admin user
    const adminUser: User = {
      id: 1,
      username: "admin",
      password: "password", // In production, this would be hashed
      role: "admin",
      createdAt: new Date(),
    };
    this.users.set(1, adminUser);
    this.currentUserId = 2;

    // Create sample machines
    const sampleMachines: Machine[] = [
      {
        id: 1,
        machineId: "CNC-001",
        name: "CNC Machine 001",
        type: "CNC",
        status: "operational",
        efficiency: 87,
        temperature: 72,
        vibration: 2.1,
        lastMaintenance: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        machineId: "PRESS-002",
        name: "Hydraulic Press 002",
        type: "Press",
        status: "warning",
        efficiency: 65,
        temperature: 89,
        vibration: 4.8,
        lastMaintenance: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        machineId: "ROBOT-003",
        name: "Robotic Arm 003",
        type: "Robot",
        status: "operational",
        efficiency: 92,
        temperature: 68,
        vibration: 1.5,
        lastMaintenance: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        machineId: "CONV-004",
        name: "Conveyor Belt 004",
        type: "Conveyor",
        status: "maintenance",
        efficiency: 0,
        temperature: 25,
        vibration: 0,
        lastMaintenance: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        machineId: "DRILL-005",
        name: "Drill Press 005",
        type: "Drill",
        status: "operational",
        efficiency: 81,
        temperature: 75,
        vibration: 2.8,
        lastMaintenance: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    sampleMachines.forEach(machine => {
      this.machines.set(machine.id, machine);
    });
    this.currentMachineId = 6;

    // Create sample maintenance records
    const sampleMaintenanceRecords: MaintenanceRecord[] = [
      {
        id: 1,
        machineId: 1,
        type: "scheduled",
        description: "Scheduled maintenance on CNC-001",
        technician: "John Doe",
        status: "completed",
        scheduledDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        completedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        cost: 1200,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: 2,
        machineId: 2,
        type: "repair",
        description: "Temperature warning on PRESS-002",
        technician: "Jane Smith",
        status: "pending",
        scheduledDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        completedDate: null,
        cost: 3200,
        createdAt: new Date(),
      },
      {
        id: 3,
        machineId: 3,
        type: "inspection",
        description: "Safety inspection on ROBOT-003",
        technician: "Mike Johnson",
        status: "pending",
        scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        completedDate: null,
        cost: 800,
        createdAt: new Date(),
      },
    ];

    sampleMaintenanceRecords.forEach(record => {
      this.maintenanceRecords.set(record.id, record);
    });
    this.currentMaintenanceId = 4;

    // Create sample security events
    const sampleSecurityEvents: SecurityEvent[] = [
      {
        id: 1,
        eventType: "login",
        description: "User admin logged in",
        ipAddress: "192.168.1.100",
        username: "admin",
        severity: "info",
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
      {
        id: 2,
        eventType: "security_scan",
        description: "Security scan completed",
        ipAddress: "system",
        username: "system",
        severity: "info",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: 3,
        eventType: "failed_login",
        description: "Failed login attempt",
        ipAddress: "192.168.1.150",
        username: "unknown",
        severity: "warning",
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },
    ];

    sampleSecurityEvents.forEach(event => {
      this.securityEvents.set(event.id, event);
    });
    this.currentSecurityEventId = 4;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser,
      role: insertUser.role || "technician",
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  // Machine methods
  async getAllMachines(): Promise<Machine[]> {
    return Array.from(this.machines.values());
  }

  async getMachine(id: number): Promise<Machine | undefined> {
    return this.machines.get(id);
  }

  async createMachine(insertMachine: InsertMachine): Promise<Machine> {
    const id = this.currentMachineId++;
    const machine: Machine = {
      ...insertMachine,
      status: insertMachine.status || "operational",
      efficiency: insertMachine.efficiency || 100,
      temperature: insertMachine.temperature || 70,
      vibration: insertMachine.vibration || 1.0,
      id,
      lastMaintenance: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.machines.set(id, machine);
    return machine;
  }

  async updateMachine(id: number, updates: Partial<InsertMachine>): Promise<Machine | undefined> {
    const machine = this.machines.get(id);
    if (!machine) return undefined;

    const updatedMachine: Machine = {
      ...machine,
      ...updates,
      updatedAt: new Date(),
    };
    this.machines.set(id, updatedMachine);
    return updatedMachine;
  }

  // Maintenance methods
  async getMaintenanceRecords(machineId?: number): Promise<MaintenanceRecord[]> {
    const records = Array.from(this.maintenanceRecords.values());
    if (machineId) {
      return records.filter(record => record.machineId === machineId);
    }
    return records.sort((a, b) => {
      const aTime = a.createdAt?.getTime() || 0;
      const bTime = b.createdAt?.getTime() || 0;
      return bTime - aTime;
    });
  }

  async createMaintenanceRecord(insertRecord: InsertMaintenanceRecord): Promise<MaintenanceRecord> {
    const id = this.currentMaintenanceId++;
    const record: MaintenanceRecord = {
      ...insertRecord,
      status: insertRecord.status || "pending",
      machineId: insertRecord.machineId || null,
      scheduledDate: insertRecord.scheduledDate || null,
      cost: insertRecord.cost || null,
      id,
      completedDate: null,
      createdAt: new Date(),
    };
    this.maintenanceRecords.set(id, record);
    return record;
  }

  async updateMaintenanceRecord(id: number, updates: Partial<InsertMaintenanceRecord>): Promise<MaintenanceRecord | undefined> {
    const record = this.maintenanceRecords.get(id);
    if (!record) return undefined;

    const updatedRecord: MaintenanceRecord = {
      ...record,
      ...updates,
    };
    this.maintenanceRecords.set(id, updatedRecord);
    return updatedRecord;
  }

  // Security methods
  async getSecurityEvents(limit?: number): Promise<SecurityEvent[]> {
    const events = Array.from(this.securityEvents.values())
      .sort((a, b) => {
        const aTime = a.createdAt?.getTime() || 0;
        const bTime = b.createdAt?.getTime() || 0;
        return bTime - aTime;
      });
    
    return limit ? events.slice(0, limit) : events;
  }

  async createSecurityEvent(insertEvent: InsertSecurityEvent): Promise<SecurityEvent> {
    const id = this.currentSecurityEventId++;
    const event: SecurityEvent = {
      ...insertEvent,
      severity: insertEvent.severity || "info",
      username: insertEvent.username || null,
      ipAddress: insertEvent.ipAddress || null,
      id,
      createdAt: new Date(),
    };
    this.securityEvents.set(id, event);
    return event;
  }
}

// DatabaseStorage class implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        role: insertUser.role || "technician",
      })
      .returning();
    return user;
  }

  async getAllMachines(): Promise<Machine[]> {
    return await db.select().from(machines).orderBy(desc(machines.createdAt));
  }

  async getMachine(id: number): Promise<Machine | undefined> {
    const [machine] = await db.select().from(machines).where(eq(machines.id, id));
    return machine || undefined;
  }

  async createMachine(insertMachine: InsertMachine): Promise<Machine> {
    const [machine] = await db
      .insert(machines)
      .values({
        ...insertMachine,
        status: insertMachine.status || "operational",
        efficiency: insertMachine.efficiency || 100,
        temperature: insertMachine.temperature || 70,
        vibration: insertMachine.vibration || 1.0,
      })
      .returning();
    return machine;
  }

  async updateMachine(id: number, updates: Partial<InsertMachine>): Promise<Machine | undefined> {
    const [machine] = await db
      .update(machines)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(machines.id, id))
      .returning();
    return machine || undefined;
  }

  async getMaintenanceRecords(machineId?: number): Promise<MaintenanceRecord[]> {
    if (machineId) {
      return await db.select().from(maintenanceRecords)
        .where(eq(maintenanceRecords.machineId, machineId))
        .orderBy(desc(maintenanceRecords.createdAt));
    }
    return await db.select().from(maintenanceRecords)
      .orderBy(desc(maintenanceRecords.createdAt));
  }

  async createMaintenanceRecord(insertRecord: InsertMaintenanceRecord): Promise<MaintenanceRecord> {
    const [record] = await db
      .insert(maintenanceRecords)
      .values({
        ...insertRecord,
        status: insertRecord.status || "pending",
        machineId: insertRecord.machineId || null,
      })
      .returning();
    return record;
  }

  async updateMaintenanceRecord(id: number, updates: Partial<InsertMaintenanceRecord>): Promise<MaintenanceRecord | undefined> {
    const [record] = await db
      .update(maintenanceRecords)
      .set(updates)
      .where(eq(maintenanceRecords.id, id))
      .returning();
    return record || undefined;
  }

  async getSecurityEvents(limit?: number): Promise<SecurityEvent[]> {
    const query = db.select().from(securityEvents).orderBy(desc(securityEvents.createdAt));
    if (limit) {
      return await query.limit(limit);
    }
    return await query;
  }

  async createSecurityEvent(insertEvent: InsertSecurityEvent): Promise<SecurityEvent> {
    const [event] = await db
      .insert(securityEvents)
      .values({
        ...insertEvent,
        severity: insertEvent.severity || "info",
        username: insertEvent.username || null,
        ipAddress: insertEvent.ipAddress || null,
      })
      .returning();
    return event;
  }
}

// Use DatabaseStorage instead of MemStorage
export const storage = new DatabaseStorage();
