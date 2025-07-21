import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Authentication utilities
export const authUtils = {
  // Simple authentication check
  isAuthenticated: () => {
    return localStorage.getItem('maintai_auth') !== null
  },
  
  // Get current user
  getCurrentUser: () => {
    const savedAuth = localStorage.getItem('maintai_auth')
    if (savedAuth) {
      try {
        return JSON.parse(savedAuth)
      } catch {
        return null
      }
    }
    return null
  }
}

// Data generation utilities for real-time updates
export const dataUtils = {
  // Generate random variance for real-time simulation
  addVariance: (baseValue: number, variance: number = 0.1) => {
    const change = (Math.random() - 0.5) * 2 * variance
    return Math.max(0, baseValue + (baseValue * change))
  },
  
  // Format currency values
  formatCurrency: (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  },
  
  // Format percentage values
  formatPercentage: (value: number, decimals: number = 1) => {
    return `${value.toFixed(decimals)}%`
  },
  
  // Format dates for display
  formatDate: (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  },
  
  // Format timestamps for activities
  formatTimestamp: (date: Date | string) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

// Predictive analytics utilities
export const analyticsUtils = {
  // Calculate failure probability color
  getFailureProbabilityColor: (probability: number) => {
    if (probability < 0.3) return 'text-green-600'
    if (probability < 0.7) return 'text-yellow-600'
    return 'text-red-600'
  },
  
  // Get urgency color class
  getUrgencyColor: (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'border-red-200 bg-red-50 text-red-900'
      case 'medium':
        return 'border-yellow-200 bg-yellow-50 text-yellow-900'
      case 'low':
        return 'border-green-200 bg-green-50 text-green-900'
      default:
        return 'border-gray-200 bg-gray-50 text-gray-900'
    }
  },
  
  // Calculate efficiency color
  getEfficiencyColor: (efficiency: number) => {
    if (efficiency >= 85) return 'text-green-600'
    if (efficiency >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }
}

// Machine status utilities
export const machineUtils = {
  // Get status badge variant
  getStatusVariant: (status: string) => {
    switch (status) {
      case 'operational':
        return 'default'
      case 'warning':
        return 'secondary'
      case 'maintenance':
        return 'destructive'
      default:
        return 'outline'
    }
  },
  
  // Get status color class
  getStatusColorClass: (status: string) => {
    switch (status) {
      case 'operational':
        return 'status-operational'
      case 'warning':
        return 'status-warning'
      case 'maintenance':
        return 'status-maintenance'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  },
  
  // Check if machine needs attention
  needsAttention: (machine: any) => {
    return machine.status === 'warning' || 
           machine.status === 'maintenance' ||
           machine.efficiency < 70 ||
           machine.temperature > 85 ||
           machine.vibration > 4
  }
}

// Error handling utilities
export const errorUtils = {
  // Get user-friendly error message
  getErrorMessage: (error: any) => {
    if (typeof error === 'string') return error
    if (error?.message) return error.message
    if (error?.response?.data?.message) return error.response.data.message
    return 'An unexpected error occurred'
  },
  
  // Check if error is network related
  isNetworkError: (error: any) => {
    return error?.code === 'NETWORK_ERROR' || 
           error?.message?.includes('fetch') ||
           error?.message?.includes('network')
  }
}

// Validation utilities
export const validationUtils = {
  // Validate email format
  isValidEmail: (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },
  
  // Validate required fields
  validateRequired: (value: any) => {
    return value !== null && value !== undefined && value !== ''
  },
  
  // Validate numeric range
  validateRange: (value: number, min: number, max: number) => {
    return value >= min && value <= max
  }
}
