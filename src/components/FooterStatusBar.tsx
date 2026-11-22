import React, { useState, useEffect } from 'react';

interface FooterStatusBarProps {
  cameraMode: 'PERSP' | 'ORTHO';
  onToggleCameraMode: (mode: 'PERSP' | 'ORTHO') => void;
  trisCount: number;
  itemsCount: number;
  memoryMb: number;
  onOpenTerminal: () => void;
}

export const FooterStatusBar: React.FC<FooterStatusBarProps> = ({
  cameraMode,
  onToggleCameraMode,
  trisCount,
  itemsCount,
  memoryMb,
  onOpenTerminal,
}) => {
  const [fps, setFps] = useState(60.1);
  const [audioActive, setAudioActive] = useState(true);

  // Gentle realistic FPS fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setFps(+(59.8 + Math.random() * 0.4).toFixed(1));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-8 bg-[#0b0e13] border-t border-[#272a30] z-50 px-4 flex items-center justify-between font-['JetBrains_Mono'] text-[10px]">
      {/* Telemetry Metrics */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-[#e1e2ea]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00f5a0] shadow-[0_0_6px_#00f5a0] animate-pulse" />
          <span className="font-['JetBrains_Mono'] text-xs font-semibold text-[#00f5a0]">
            {fps} FPS
          </span>
        </div>

        <div className="h-3 w-px bg-[#3b4a40]/40" />

        <div className="flex items-center gap-3 text-[#b9cbbd]">
          <span>
            TRIS: <span className="text-[#e1e2ea] font-medium">{trisCount.toLocaleString()}</span>
          </span>
          <span>
            ITEMS: <span className="text-[#e1e2ea] font-medium">{itemsCount}</span>
          </span>
          <span>
            MEM: <span className="text-[#e1e2ea] font-medium">{memoryMb.toFixed(1)} MB</span>
          </span>
          <span className="hidden lg:inline text-[#849588]">|</span>
          <a
            href="https://toolsx.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline text-[#00f5a0] hover:underline"
          >
            toolsx.in
          </a>
        </div>
      </div>

      {/* Camera & Audio Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenTerminal}
          className="text-[#849588] hover:text-[#00f5a0] transition-colors flex items-center gap-1"
          title="Toggle Terminal Console"
        >
          <span className="material-symbols-outlined text-[13px]">terminal</span>
          <span className="hidden sm:inline">CONSOLE</span>
        </button>

        <div className="h-3 w-px bg-[#3b4a40]/30 hidden sm:block" />

        <div className="flex items-center bg-[#1d2025] rounded p-0.5 border border-[#3b4a40]/40">
          <button
            onClick={() => onToggleCameraMode('PERSP')}
            className={`px-2 py-0.5 rounded text-[9px] font-['JetBrains_Mono'] font-medium tracking-wide transition-colors ${
              cameraMode === 'PERSP'
                ? 'bg-[#00f5a0] text-[#003921]'
                : 'text-[#b9cbbd] hover:text-[#e1e2ea]'
            }`}
          >
            PERSP
          </button>
          <button
            onClick={() => onToggleCameraMode('ORTHO')}
            className={`px-2 py-0.5 rounded text-[9px] font-['JetBrains_Mono'] font-medium tracking-wide transition-colors ${
              cameraMode === 'ORTHO'
                ? 'bg-[#00f5a0] text-[#003921]'
                : 'text-[#b9cbbd] hover:text-[#e1e2ea]'
            }`}
          >
            ORTHO
          </button>
        </div>

        <div className="h-3 w-px bg-[#3b4a40]/30" />

        <button
          onClick={() => setAudioActive(!audioActive)}
          className={`flex items-center gap-1.5 transition-colors ${
            audioActive ? 'text-[#a5e7ff]' : 'text-[#849588]'
          }`}
          title="Spatial Audio Engine"
        >
          <span className="material-symbols-outlined text-[13px]">
            {audioActive ? 'spatial_audio' : 'spatial_audio_off'}
          </span>
          <span className="hidden sm:inline">AUDIO: 48kHz</span>
        </button>
      </div>
    </footer>
  );
};
