import React from 'react';
import { SidePanelType, ActiveScreen } from '../types/schema';

interface LeftSidebarProps {
  activePanel: SidePanelType;
  onTogglePanel: (panel: SidePanelType) => void;
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  activePanel,
  onTogglePanel,
  activeScreen,
  onNavigate,
}) => {
  const topButtons = [
    { id: 'outliner' as SidePanelType, icon: 'account_tree', label: 'Outliner Tree' },
    { id: 'viewport' as SidePanelType, icon: 'grid_view', label: 'Viewport Setup' },
    { id: 'assets' as SidePanelType, icon: 'inventory_2', label: 'Asset Library' },
    { id: 'shaders' as SidePanelType, icon: 'wb_sunny', label: 'Atmosphere & Shaders' },
    { id: 'physics' as SidePanelType, icon: 'token', label: 'Physics & Collision' },
  ];

  const bottomButtons = [
    { id: 'terminal' as SidePanelType, icon: 'terminal', label: 'Terminal & Console' },
    { id: 'settings' as SidePanelType, icon: 'settings', label: 'Studio Preferences' },
  ];

  const handleClick = (panel: SidePanelType) => {
    // If not in studio-editor, and user clicks an editor panel, switch to studio-editor or toggle
    if (activeScreen !== 'studio-editor' && panel !== 'terminal' && panel !== 'settings') {
      onNavigate('studio-editor');
      onTogglePanel(panel);
    } else {
      onTogglePanel(activePanel === panel ? null : panel);
    }
  };

  return (
    <aside className="fixed left-0 top-14 bottom-8 w-16 bg-[#0b0e13] border-r border-[#272a30] z-40 flex flex-col items-center py-3 justify-between">
      {/* Top Tools */}
      <div className="flex flex-col items-center gap-2 w-full">
        {topButtons.map((btn) => {
          const isActive = activePanel === btn.id;
          return (
            <button
              key={btn.id}
              onClick={() => handleClick(btn.id)}
              title={btn.label}
              className={`w-10 h-10 rounded flex items-center justify-center transition-colors relative group ${
                isActive
                  ? 'text-[#e1e2ea] bg-[#1d2025] border border-[#00f5a0]/40 text-[#00f5a0]'
                  : 'text-[#b9cbbd] hover:text-[#e1e2ea] hover:bg-[#272a30]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{btn.icon}</span>
              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-2 py-1 rounded bg-[#1d2025] text-[#e1e2ea] text-xs font-['JetBrains_Mono'] border border-[#272a30] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                {btn.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Tools */}
      <div className="flex flex-col items-center gap-2">
        {bottomButtons.map((btn) => {
          const isActive = activePanel === btn.id;
          return (
            <button
              key={btn.id}
              onClick={() => handleClick(btn.id)}
              title={btn.label}
              className={`w-10 h-10 rounded flex items-center justify-center transition-colors relative group ${
                isActive
                  ? 'text-[#e1e2ea] bg-[#1d2025] border border-[#00f5a0]/40 text-[#00f5a0]'
                  : 'text-[#b9cbbd] hover:text-[#e1e2ea] hover:bg-[#272a30]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{btn.icon}</span>
              <div className="absolute left-full ml-2 px-2 py-1 rounded bg-[#1d2025] text-[#e1e2ea] text-xs font-['JetBrains_Mono'] border border-[#272a30] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                {btn.label}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
