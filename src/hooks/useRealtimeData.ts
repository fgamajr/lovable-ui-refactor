import { useState, useEffect, useCallback, useRef } from "react";

export type ConnectionStatus = "connected" | "reconnecting" | "disconnected";

interface UseRealtimeDataOptions<T> {
  /** Initial data */
  initialData?: T;
  /** Polling interval in ms (default: 5000) */
  pollingInterval?: number;
  /** Enable auto-polling (default: false for demo) */
  enabled?: boolean;
  /** Mock data generator for demo */
  mockDataFn?: () => T;
  /** WebSocket URL (optional, falls back to polling) */
  wsUrl?: string;
}

interface UseRealtimeDataReturn<T> {
  data: T | undefined;
  status: ConnectionStatus;
  lastUpdated: Date | null;
  error: Error | null;
  refresh: () => void;
  setMockData: (data: T) => void;
}

export function useRealtimeData<T>({
  initialData,
  pollingInterval = 5000,
  enabled = false,
  mockDataFn,
  wsUrl,
}: UseRealtimeDataOptions<T>): UseRealtimeDataReturn<T> {
  const [data, setData] = useState<T | undefined>(initialData);
  const [status, setStatus] = useState<ConnectionStatus>("connected");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(
    initialData ? new Date() : null
  );
  const [error, setError] = useState<Error | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  // Manual refresh
  const refresh = useCallback(() => {
    if (mockDataFn) {
      setData(mockDataFn());
      setLastUpdated(new Date());
      setStatus("connected");
    }
  }, [mockDataFn]);

  // Set mock data manually
  const setMockData = useCallback((newData: T) => {
    setData(newData);
    setLastUpdated(new Date());
  }, []);

  // WebSocket connection
  useEffect(() => {
    if (!wsUrl || !enabled) return;

    const connect = () => {
      try {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          setStatus("connected");
          reconnectAttempts.current = 0;
          setError(null);
        };

        ws.onmessage = (event) => {
          try {
            const newData = JSON.parse(event.data) as T;
            setData(newData);
            setLastUpdated(new Date());
          } catch (e) {
            console.error("Failed to parse WebSocket message:", e);
          }
        };

        ws.onerror = () => {
          setError(new Error("WebSocket error"));
        };

        ws.onclose = () => {
          if (reconnectAttempts.current < maxReconnectAttempts) {
            setStatus("reconnecting");
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
            reconnectAttempts.current += 1;
            setTimeout(connect, delay);
          } else {
            setStatus("disconnected");
            setError(new Error("Connection lost"));
          }
        };
      } catch (e) {
        setStatus("disconnected");
        setError(e instanceof Error ? e : new Error("Connection failed"));
      }
    };

    connect();

    return () => {
      wsRef.current?.close();
    };
  }, [wsUrl, enabled]);

  // Polling fallback
  useEffect(() => {
    if (wsUrl || !enabled || !mockDataFn) return;

    const interval = setInterval(() => {
      refresh();
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [wsUrl, enabled, pollingInterval, mockDataFn, refresh]);

  return {
    data,
    status,
    lastUpdated,
    error,
    refresh,
    setMockData,
  };
}
