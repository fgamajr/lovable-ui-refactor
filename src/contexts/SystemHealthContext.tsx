import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type ServiceStatus = "online" | "degraded" | "offline";

export interface ServiceHealth {
  name: string;
  status: ServiceStatus;
  message?: string;
  lastCheck: Date;
  responseTime?: number;
}

interface SystemHealthContextType {
  services: ServiceHealth[];
  overallStatus: ServiceStatus;
  dismissedAlerts: Set<string>;
  checkHealth: () => void;
  dismissAlert: (serviceName: string) => void;
  restoreAlert: (serviceName: string) => void;
  updateService: (name: string, health: Partial<ServiceHealth>) => void;
  isLoading: boolean;
}

const SystemHealthContext = createContext<SystemHealthContextType | null>(null);

// Mock initial services for demo
const initialServices: ServiceHealth[] = [
  {
    name: "Elasticsearch",
    status: "online",
    message: "All systems operational",
    lastCheck: new Date(),
    responseTime: 142,
  },
  {
    name: "RAG Pipeline",
    status: "online",
    message: "Processing normally",
    lastCheck: new Date(),
    responseTime: 89,
  },
  {
    name: "Vector Database",
    status: "online",
    message: "Connected",
    lastCheck: new Date(),
    responseTime: 45,
  },
];

function getOverallStatus(services: ServiceHealth[]): ServiceStatus {
  if (services.some((s) => s.status === "offline")) return "offline";
  if (services.some((s) => s.status === "degraded")) return "degraded";
  return "online";
}

interface SystemHealthProviderProps {
  children: ReactNode;
}

export function SystemHealthProvider({ children }: SystemHealthProviderProps) {
  const [services, setServices] = useState<ServiceHealth[]>(initialServices);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const overallStatus = getOverallStatus(
    services.filter((s) => !dismissedAlerts.has(s.name))
  );

  const checkHealth = useCallback(() => {
    setIsLoading(true);
    // Simulate health check delay
    setTimeout(() => {
      setServices((prev) =>
        prev.map((service) => ({
          ...service,
          lastCheck: new Date(),
        }))
      );
      setIsLoading(false);
    }, 1000);
  }, []);

  const dismissAlert = useCallback((serviceName: string) => {
    setDismissedAlerts((prev) => new Set(prev).add(serviceName));
  }, []);

  const restoreAlert = useCallback((serviceName: string) => {
    setDismissedAlerts((prev) => {
      const next = new Set(prev);
      next.delete(serviceName);
      return next;
    });
  }, []);

  const updateService = useCallback(
    (name: string, health: Partial<ServiceHealth>) => {
      setServices((prev) =>
        prev.map((service) =>
          service.name === name
            ? { ...service, ...health, lastCheck: new Date() }
            : service
        )
      );
      // Restore alert if service comes back online
      if (health.status === "online") {
        restoreAlert(name);
      }
    },
    [restoreAlert]
  );

  return (
    <SystemHealthContext.Provider
      value={{
        services,
        overallStatus,
        dismissedAlerts,
        checkHealth,
        dismissAlert,
        restoreAlert,
        updateService,
        isLoading,
      }}
    >
      {children}
    </SystemHealthContext.Provider>
  );
}

export function useSystemHealth() {
  const context = useContext(SystemHealthContext);
  if (!context) {
    throw new Error("useSystemHealth must be used within a SystemHealthProvider");
  }
  return context;
}
