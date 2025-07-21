import { clsx } from "clsx"

export function cn(...inputs) {
  return clsx(inputs)
}

// Authentication utilities
export const authUtils = {
  // Simple authentication check
  isAuthenticated: () => {
    return localStorage.getItem('isAuthenticated') === 'true'
  },
  
  // Login function
  login: (username, password) => {
    // Demo credentials validation
    if (username === 'admin' && password === 'password') {
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('username', username)
      return true
    }
    return false
  },
  
  // Logout function
  logout: () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('username')
  },
  
  // Get current user
  getCurrentUser: () => {
    return localStorage.getItem('username')
  }
}

// Data generation utilities for demo
export const dataUtils = {
  // Generate random data for dashboard
  generateMachineData: () => {
    const machines = ['CNC-001', 'PRESS-002', 'ROBOT-003', 'CONV-004', 'DRILL-005']
    return machines.map(id => ({
      id,
      status: Math.random() > 0.8 ? 'warning' : Math.random() > 0.6 ? 'maintenance' : 'operational',
      efficiency: Math.floor(Math.random() * 40) + 60,
      temperature: Math.floor(Math.random() * 30) + 70,
      vibration: Math.random() * 5 + 1,
      lastMaintenance: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }))
  },
  
  // Generate predictive analytics data
  generatePredictiveData: () => {
    return {
      failureProbability: Math.random() * 0.3,
      recommendedMaintenance: Math.floor(Math.random() * 14) + 1,
      costSavings: Math.floor(Math.random() * 50000) + 10000,
      efficiency: Math.random() * 0.2 + 0.8
    }
  },
  
  // Generate recent activities
  generateActivities: () => {
    const activities = [
      { type: 'maintenance', description: 'Scheduled maintenance on CNC-001', status: 'completed' },
      { type: 'alert', description: 'Temperature warning on PRESS-002', status: 'active' },
      { type: 'inspection', description: 'Safety inspection on ROBOT-003', status: 'pending' },
      { type: 'repair', description: 'Belt replacement on CONV-004', status: 'in-progress' },
      { type: 'maintenance', description: 'Oil change on DRILL-005', status: 'completed' }
    ]
    
    return activities.map((activity, index) => ({
      ...activity,
      id: index + 1,
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      technician: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson'][Math.floor(Math.random() * 4)]
    }))
  }
}

// Predictive analytics algorithms
export const analyticsAlgorithms = {
  // Simple failure prediction based on multiple factors
  predictFailure: (machineData) => {
    const { temperature, vibration, efficiency, lastMaintenance } = machineData
    
    // Normalize factors (0-1 scale)
    const tempFactor = Math.max(0, (temperature - 70) / 30) // Higher temp = higher risk
    const vibrationFactor = Math.max(0, (vibration - 1) / 4) // Higher vibration = higher risk
    const efficiencyFactor = Math.max(0, (100 - efficiency) / 40) // Lower efficiency = higher risk
    
    // Days since last maintenance
    const daysSinceMaintenance = (Date.now() - new Date(lastMaintenance).getTime()) / (1000 * 60 * 60 * 24)
    const maintenanceFactor = Math.min(1, daysSinceMaintenance / 30) // More days = higher risk
    
    // Weighted average
    const failureProbability = (
      tempFactor * 0.3 +
      vibrationFactor * 0.25 +
      efficiencyFactor * 0.25 +
      maintenanceFactor * 0.2
    )
    
    return Math.min(1, failureProbability)
  },
  
  // Calculate optimal maintenance schedule
  calculateMaintenanceSchedule: (machines) => {
    return machines.map(machine => {
      const failureProb = analyticsAlgorithms.predictFailure(machine)
      const urgency = failureProb > 0.7 ? 'high' : failureProb > 0.4 ? 'medium' : 'low'
      const recommendedDays = failureProb > 0.7 ? 1 : failureProb > 0.4 ? 7 : 30
      
      return {
        machineId: machine.id,
        urgency,
        recommendedDays,
        failureProbability: failureProb,
        estimatedCost: Math.floor(failureProb * 10000) + 1000
      }
    })
  },
  
  // Calculate cost savings from predictive maintenance
  calculateCostSavings: (machines) => {
    const totalPreventiveCost = machines.length * 2000 // Average preventive maintenance cost
    const potentialFailureCost = machines.reduce((total, machine) => {
      const failureProb = analyticsAlgorithms.predictFailure(machine)
      return total + (failureProb * 15000) // Average failure cost
    }, 0)
    
    return Math.max(0, potentialFailureCost - totalPreventiveCost)
  }
}

