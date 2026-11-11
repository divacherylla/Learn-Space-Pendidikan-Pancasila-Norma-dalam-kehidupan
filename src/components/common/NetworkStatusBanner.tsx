import React, { useState, useEffect } from 'react';

interface NetworkStatusBannerProps {
  isSimulatedOffline?: boolean;
  onToggleSimulatedOffline?: (val: boolean) => void;
}

export const NetworkStatusBanner: React.FC<NetworkStatusBannerProps> = ({
  isSimulatedOffline = false,
  onToggleSimulatedOffline,
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showReconnectedMessage, setShowReconnectedMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnectedMessage(true);
      const timer = setTimeout(() => {
        setShowReconnectedMessage(false);
      }, 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnectedMessage(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const effectiveOffline = !isOnline || isSimulatedOffline;

  return (
    <>
      {/* Offline Alert */}
      {effectiveOffline && (
        <div className="bg-amber-500 text-slate-900 px-4 py-2.5 shadow-sm text-sm font-medium flex items-center justify-between transition-all animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2 mx-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
            <span>
              📡 <strong>Koneksi terputus.</strong> Perubahan belajarmu tersimpan aman di perangkat dan tidak akan hilang.
            </span>
          </div>
          {onToggleSimulatedOffline && isSimulatedOffline && (
            <button
              onClick={() => onToggleSimulatedOffline(false)}
              className="text-xs bg-black/15 hover:bg-black/25 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            >
              Pulihkan Koneksi
            </button>
          )}
        </div>
      )}

      {/* Reconnected Alert */}
      {!effectiveOffline && showReconnectedMessage && (
        <div className="bg-[#6BCB77] text-white px-4 py-2 shadow-sm text-sm font-medium flex items-center justify-center gap-2 transition-all">
          <span>✓</span>
          <span>
            <strong>Koneksi kembali online.</strong> Menyinkronkan perubahan ke sistem...
          </span>
        </div>
      )}
    </>
  );
};
