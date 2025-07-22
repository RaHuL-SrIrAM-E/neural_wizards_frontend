import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { API_CONFIG, buildApiUrl } from '../config/api';

interface ConnectionStatusProps {
  onStatusChange?: (isConnected: boolean) => void;
}

function ConnectionStatus({ onStatusChange }: ConnectionStatusProps) {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(buildApiUrl('HEALTH'), {
        method: 'GET',
        signal: controller.signal,
        headers: {
          [API_CONFIG.REQUEST.HEADERS.NGROK_SKIP_WARNING]: 'true',
        },
      });
      
      clearTimeout(timeoutId);
      const connected = response.ok;
      setIsConnected(connected);
      onStatusChange?.(connected);
    } catch (error) {
      setIsConnected(false);
      onStatusChange?.(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (isConnected === null) {
    return (
      <div className="flex items-center gap-2 text-yellow-400 text-sm">
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
        Checking connection...
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 text-sm ${
      isConnected ? 'text-green-400' : 'text-red-400'
    }`}>
      {isConnected ? (
        <>
          <Wifi className="w-4 h-4" />
          Backend connected
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4" />
          Backend offline
        </>
      )}
      {!isConnected && (
        <button
          onClick={checkConnection}
          disabled={isChecking}
          className="ml-2 text-xs bg-red-500/20 hover:bg-red-500/30 px-2 py-1 rounded transition-colors disabled:opacity-50"
        >
          {isChecking ? 'Checking...' : 'Retry'}
        </button>
      )}
    </div>
  );
}

export default ConnectionStatus;