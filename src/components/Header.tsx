import React, { useState } from 'react';
import { ActiveScreen, WorldProject } from '../types/schema';
import { AuthUser } from '../utils/browserAuth';

interface HeaderProps {
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  currentProject: WorldProject;
  projects: WorldProject[];
  onSelectProject: (proj: WorldProject) => void;
  onOpenAIGen: () => void;
  onOpenExport: () => void;
  supabaseConnected: boolean;
  currentUser: AuthUser | null;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeScreen,
  onNavigate,
  currentProject,
  projects,
  onSelectProject,
  onOpenAIGen,
  onOpenExport,
  supabaseConnected,
  currentUser,
  onOpenLogin,
  onLogout,
}) => {
  const [sceneDropdownOpen, setSceneDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifications = [
    { id: 1, text: 'Browser Storage Synced: IndexedDB active', time: '1m ago' },
    { id: 2, text: 'TOOLSX Engine v2.4 initialized smoothly', time: '3m ago' },
    { id: 3, text: 'Visit toolsx.in for new asset packages', time: '10m ago' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-[#0b0e13]/95 backdrop-blur-md z-50 flex items-center justify-between px-4 border-b border-[#272a30]">
      {/* Brand & Scene Selector */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate('docs-and-specs')}
          className="flex items-center gap-2 text-left group focus:outline-none"
        >
          {/* Logo with TOOLSX icon */}
          <img src="/logo.svg" alt="TOOLSX 3D logo" width={32} height={32} className="w-8 h-8 rounded-lg shadow-[0_0_14px_rgba(0,245,160,0.25)] group-hover:shadow-[0_0_18px_rgba(0,245,160,0.5)] transition-shadow" />
          <span className="font-['Space_Grotesk'] text-lg uppercase tracking-wider text-[#e1e2ea] font-bold group-hover:text-[#00f5a0] transition-colors">
            TOOLSX
          </span>
          <span className="px-1.5 py-0.5 rounded bg-[#272a30] text-[#b9cbbd] font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest border border-[#3b4a40]/40">
            v2.4-PROD
          </span>
        </button>

        <div className="h-4 w-px bg-[#3b4a40]/50 hidden md:block" />

        {/* Scene Breadcrumb & Dropdown */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setSceneDropdownOpen(!sceneDropdownOpen)}
            className="flex items-center gap-1.5 font-['JetBrains_Mono'] text-xs text-[#b9cbbd] hover:text-[#e1e2ea] transition-colors px-2 py-1 rounded hover:bg-[#1d2025]"
          >
            <span className="text-[#e1e2ea] font-medium">{currentProject.title}</span>
            <span className="text-[#849588]">/</span>
            <span className="text-[#b9cbbd]">Default Scene</span>
            <span className="material-symbols-outlined text-sm text-[#849588]">expand_more</span>
            <span className="flex items-center gap-1.5 ml-2 px-1.5 py-0.5 rounded bg-[#191c21] text-[#b9cbbd] border border-[#3b4a40]/30 text-[10px]">
              <span className={`w-1.5 h-1.5 rounded-full ${supabaseConnected ? 'bg-[#00f5a0] shadow-[0_0_8px_#00f5a0]' : 'bg-amber-400'}`} />
              Local Storage Sync
            </span>
          </button>

          {sceneDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 rounded bg-[#1d2025] border border-[#272a30] shadow-xl py-1 z-50">
              <div className="px-3 py-1.5 font-['JetBrains_Mono'] text-[10px] uppercase tracking-wider text-[#849588] border-b border-[#272a30]">
                Switch Active Scene
              </div>
              {projects.map((proj) => (
                <button
                  key={proj.id}
                  onClick={() => {
                    onSelectProject(proj);
                    setSceneDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-['JetBrains_Mono'] flex items-center justify-between hover:bg-[#272a30] transition-colors ${
                    proj.id === currentProject.id ? 'text-[#00f5a0] bg-[#191c21]' : 'text-[#e1e2ea]'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{proj.title}</span>
                    <span className="text-[10px] text-[#849588]">{proj.tris.toLocaleString()} tris • {proj.items} items</span>
                  </div>
                  {proj.id === currentProject.id && (
                    <span className="material-symbols-outlined text-sm text-[#00f5a0]">check</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Nav Tabs */}
      <nav className="hidden lg:flex items-center h-full gap-1">
        {[
          { id: 'studio-editor', label: 'Studio Editor' },
          { id: 'explore-worlds', label: 'Explore Worlds' },
          { id: 'my-projects', label: 'My Projects' },
          { id: 'docs-and-specs', label: 'Docs & Specs' },
          { id: 'about', label: 'About' },
          { id: 'privacy', label: 'Privacy' },
          { id: 'terms', label: 'Terms' },
        ].map((tab) => {
          const isActive = activeScreen === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id as ActiveScreen)}
              className={`flex items-center h-full px-3 text-xs tracking-wide transition-colors ${
                isActive
                  ? 'bg-[#1d2025] text-[#00f5a0] font-medium border-b-2 border-[#00f5a0]'
                  : 'text-[#b9cbbd] hover:text-[#e1e2ea] hover:bg-[#272a30]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Header Actions & Official Website Link */}
      <div className="flex items-center gap-2">
        {/* Visit toolsx.in button */}
        <a
          href="https://toolsx.in"
          target="_blank"
          rel="noopener noreferrer"
          title="Visit Official Website: toolsx.in"
          className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded bg-[#191c21] hover:bg-[#272a30] text-[#00f5a0] font-['JetBrains_Mono'] text-xs border border-[#00f5a0]/40 transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-[14px]">language</span>
          <span>toolsx.in</span>
        </a>

        {/* AI Gen */}
        <button
          onClick={onOpenAIGen}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#00f5a0] text-[#002111] font-['JetBrains_Mono'] text-xs uppercase tracking-wider font-semibold shadow-[0_0_16px_rgba(0,245,160,0.25)] hover:bg-[#00d2ff] hover:text-[#003543] transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
          <span className="hidden sm:inline">AI Gen</span>
        </button>

        {/* Export */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-[#1d2025] text-[#e1e2ea] font-['JetBrains_Mono'] text-xs border border-[#3b4a40]/50 hover:bg-[#272a30] transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">ios_share</span>
          <span className="hidden md:inline">Export</span>
        </button>

        <div className="h-4 w-px bg-[#3b4a40]/40" />

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-1.5 rounded text-[#b9cbbd] hover:text-[#e1e2ea] hover:bg-[#272a30] transition-colors relative"
            title="System Telemetry Notifications"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#00d2ff] animate-pulse" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded bg-[#1d2025] border border-[#272a30] shadow-2xl py-2 z-50">
              <div className="px-3 pb-2 font-['JetBrains_Mono'] text-[11px] font-semibold text-[#e1e2ea] border-b border-[#272a30] flex items-center justify-between">
                <span>SYSTEM EVENTS &amp; NOTICES</span>
                <span className="text-[9px] text-[#00f5a0]">ALL ONLINE</span>
              </div>
              <div className="divide-y divide-[#272a30]/50">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 hover:bg-[#272a30]/50 transition-colors">
                    <p className="text-xs text-[#e1e2ea]">{n.text}</p>
                    <span className="text-[10px] text-[#849588] font-['JetBrains_Mono']">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Browser-based Login Button or Profile */}
        {currentUser ? (
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 px-2 py-1 rounded bg-[#191c21] border border-[#3b4a40] hover:border-[#00f5a0] transition-all focus:outline-none"
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-black"
                style={{ backgroundColor: currentUser.avatarColor || '#00f5a0' }}
              >
                {currentUser.displayName.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline font-['JetBrains_Mono'] text-xs text-[#e1e2ea] max-w-[100px] truncate">
                {currentUser.displayName}
              </span>
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded bg-[#1d2025] border border-[#272a30] shadow-2xl py-2 z-50 font-['JetBrains_Mono'] text-xs">
                <div className="px-3 py-2 border-b border-[#272a30]">
                  <div className="font-semibold text-[#e1e2ea]">{currentUser.displayName}</div>
                  <div className="text-[10px] text-[#849588]">{currentUser.email}</div>
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-[#00f5a0]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00f5a0]" />
                    <span>Browser Session: Active</span>
                  </div>
                </div>
                <div className="py-1">
                  <a
                    href="https://toolsx.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-left px-3 py-1.5 hover:bg-[#272a30] text-[#00f5a0] flex items-center justify-between"
                  >
                    <span>Visit toolsx.in</span>
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </a>
                  <button
                    onClick={() => {
                      onNavigate('studio-editor');
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#272a30] text-[#b9cbbd] hover:text-[#e1e2ea]"
                  >
                    Launch 3D Studio
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('my-projects');
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#272a30] text-[#b9cbbd] hover:text-[#e1e2ea]"
                  >
                    Workspace Projects
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('about');
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#272a30] text-[#b9cbbd] hover:text-[#e1e2ea]"
                  >
                    About &amp; Contact Support
                  </button>
                  <div className="border-t border-[#272a30] my-1" />
                  <button
                    onClick={() => {
                      onLogout();
                      setProfileOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#272a30] text-[#ffb4ab]"
                  >
                    Log Out of Browser
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#191c21] hover:bg-[#272a30] text-[#00f5a0] font-['JetBrains_Mono'] text-xs font-semibold border border-[#00f5a0]/40 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">login</span>
            <span>Browser Login</span>
          </button>
        )}
      </div>
    </header>
  );
};
