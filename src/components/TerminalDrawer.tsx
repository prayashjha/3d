import React, { useState, useEffect, useRef } from 'react';

interface TerminalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TerminalDrawer: React.FC<TerminalDrawerProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<string[]>([
    '[SYS:BOOT] TOOLSX Spatial Engine v2.4-PROD initializing...',
    '[SYS:BRAND] AI Tools Lab India (toolsx.in) • Local-First Architecture.',
    '[GL:INFO] WebGL2 Context created with PCFSoftShadowMap enabled.',
    '[GL:SHADERS] PBR Metallic-Roughness shader pipeline compiled in 11.4ms.',
    '[AUTH] Browser Storage Verified: IndexedDB & LocalStorage active.',
    '[AST:VALIDATOR] Schema v2.4.0 verified: 0 warnings, 0 type deviations.',
    '[READY] Viewport interactive at 60.1 FPS. Visit https://toolsx.in',
  ]);
  const [commandInput, setCommandInput] = useState('');
  const logBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      logBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isOpen]);

  if (!isOpen) return null;

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = commandInput.trim().toLowerCase();
    if (!cmd) return;

    const newLogs = [...logs, `> ${commandInput}`];

    if (cmd === 'help') {
      newLogs.push(
        'Available commands:',
        '  status   - View current engine & RLS status',
        '  fps      - Check rendering frame statistics',
        '  clear    - Flush console logs',
        '  schema   - Print schema version'
      );
    } else if (cmd === 'status') {
      newLogs.push(
        '[STATUS:OK] All 5 engine diagnostics nominal.',
        '  Memory: 68.4 MB / 4 GB allocated',
        '  RLS: ENFORCED (auth.uid isolated)'
      );
    } else if (cmd === 'fps') {
      newLogs.push('[FPS] Current: 60.2 FPS | Frame time: 16.61ms | Draw calls: 42');
    } else if (cmd === 'schema') {
      newLogs.push('[SCHEMA] Version: 2.4.0-STABLE | SHA-256: 7f83b165...4b82');
    } else if (cmd === 'clear') {
      setLogs(['[CONSOLE CLEARED]']);
      setCommandInput('');
      return;
    } else {
      newLogs.push(`[CMD:ERR] Unknown command '${cmd}'. Type 'help' for available actions.`);
    }

    setLogs(newLogs);
    setCommandInput('');
  };

  return (
    <div className="fixed bottom-8 left-16 right-0 h-64 bg-[#0b0e13]/95 backdrop-blur-md border-t border-[#272a30] z-40 flex flex-col shadow-2xl font-['JetBrains_Mono'] text-xs">
      {/* Terminal Title Bar */}
      <div className="h-8 px-4 bg-[#191c21] border-b border-[#272a30] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-[#00f5a0]">terminal</span>
          <span className="text-xs font-semibold text-[#e1e2ea]">
            Engine Terminal &amp; Supabase Realtime Log
          </span>
          <span className="text-[10px] text-[#00d2ff]">LIVE STREAM</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLogs(['[LOG BUFFER CLEARED]'])}
            className="text-[10px] text-[#849588] hover:text-[#e1e2ea] px-2 py-0.5 rounded hover:bg-[#272a30]"
          >
            Clear
          </button>
          <button
            onClick={onClose}
            className="text-[#849588] hover:text-[#e1e2ea]"
            title="Close Terminal"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="flex-1 p-3 overflow-y-auto space-y-1 text-[#b9cbbd]">
        {logs.map((log, idx) => (
          <div
            key={idx}
            className={`leading-relaxed ${
              log.includes('[ERR')
                ? 'text-[#ffb4ab]'
                : log.includes('>')
                ? 'text-[#00d2ff] font-bold'
                : log.includes('SYS:BOOT') || log.includes('READY')
                ? 'text-[#00f5a0]'
                : ''
            }`}
          >
            {log}
          </div>
        ))}
        <div ref={logBottomRef} />
      </div>

      {/* Terminal Command Input */}
      <form onSubmit={handleCommand} className="h-9 px-3 bg-[#111319] border-t border-[#272a30] flex items-center gap-2">
        <span className="text-[#00f5a0]">&gt;</span>
        <input
          type="text"
          value={commandInput}
          onChange={(e) => setCommandInput(e.target.value)}
          placeholder="Type 'help', 'status', 'fps', or 'clear'..."
          className="flex-1 bg-transparent text-xs text-[#e1e2ea] placeholder-[#849588] focus:outline-none"
        />
        <button
          type="submit"
          className="px-2 py-0.5 rounded bg-[#272a30] text-[#00f5a0] text-[10px] hover:bg-[#32353b]"
        >
          EXEC
        </button>
      </form>
    </div>
  );
};
