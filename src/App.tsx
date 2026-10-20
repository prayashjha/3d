/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActiveScreen, MirroraScene, SceneObject, SidePanelType, WorldProject } from './types/schema';
import { DEFAULT_NEON_CITADEL_SCENE, SAMPLE_PROJECTS } from './data/mockScenes';
import { Header } from './components/Header';
import { LeftSidebar } from './components/LeftSidebar';
import { FooterStatusBar } from './components/FooterStatusBar';
import { DocsAndSpecsScreen } from './screens/DocsAndSpecsScreen';
import { StudioEditorScreen } from './screens/StudioEditorScreen';
import { ExploreWorldsScreen } from './screens/ExploreWorldsScreen';
import { MyProjectsScreen } from './screens/MyProjectsScreen';
import { AboutScreen } from './screens/AboutScreen';
import { PrivacyScreen } from './screens/PrivacyScreen';
import { TermsScreen } from './screens/TermsScreen';
import { AIGeneratorModal } from './components/AIGeneratorModal';
import { ExportModal } from './components/ExportModal';
import { AuditReportModal } from './components/AuditReportModal';
import { TerminalDrawer } from './components/TerminalDrawer';
import { LoginModal } from './components/LoginModal';
import { AuthUser, getCurrentUser, logoutUser } from './utils/browserAuth';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('docs-and-specs');
  const [activeSidePanel, setActiveSidePanel] = useState<SidePanelType>(null);
  const [projects, setProjects] = useState<WorldProject[]>(SAMPLE_PROJECTS);
  const [currentProject, setCurrentProject] = useState<WorldProject>(SAMPLE_PROJECTS[0]);
  const [currentScene, setCurrentScene] = useState<MirroraScene>(DEFAULT_NEON_CITADEL_SCENE);
  const [cameraMode, setCameraMode] = useState<'PERSP' | 'ORTHO'>('PERSP');

  // User auth state
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  // Modals state
  const [aiGenModalOpen, setAiGenModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Switch project
  const handleSelectProject = (proj: WorldProject) => {
    setCurrentProject(proj);
    setCurrentScene(proj.scene);
  };

  // Launch in studio
  const handleLaunchInStudio = (proj: WorldProject) => {
    handleSelectProject(proj);
    setActiveScreen('studio-editor');
  };

  // Scene update
  const handleUpdateScene = (updated: MirroraScene) => {
    setCurrentScene(updated);
    setCurrentProject((prev) => ({
      ...prev,
      scene: updated,
      tris: updated.rootObjects.length * 2800,
      items: updated.rootObjects.length,
    }));
    setProjects((prev) =>
      prev.map((p) =>
        p.id === currentProject.id
          ? {
              ...p,
              scene: updated,
              tris: updated.rootObjects.length * 2800,
              items: updated.rootObjects.length,
            }
          : p
      )
    );
  };

  // Insert AI generated nodes
  const handleInsertGeneratedNodes = (newNodes: SceneObject[]) => {
    const updatedScene: MirroraScene = {
      ...currentScene,
      rootObjects: [...currentScene.rootObjects, ...newNodes],
    };
    handleUpdateScene(updatedScene);
    setActiveScreen('studio-editor');
  };

  // Create project
  const handleCreateProject = (title: string, desc: string) => {
    const newId = `proj-${Date.now().toString().slice(-4)}`;
    const newProj: WorldProject = {
      id: newId,
      title,
      slug: title.toLowerCase().replace(/\s+/g, '-'),
      description: desc,
      thumbnail: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
      author: currentUser ? currentUser.displayName : 'TOOLSX Architect',
      updatedAt: 'Just now',
      tris: 11200,
      items: 12,
      isPublic: true,
      tags: ['Custom', 'WebGL2', 'PBR', 'toolsx.in'],
      scene: {
        ...DEFAULT_NEON_CITADEL_SCENE,
        worldId: `world-${newId}`,
        worldName: title,
      },
    };
    setProjects([newProj, ...projects]);
    handleSelectProject(newProj);
    setActiveScreen('studio-editor');
  };

  // Delete project
  const handleDeleteProject = (id: string) => {
    const filtered = projects.filter((p) => p.id !== id);
    setProjects(filtered);
    if (currentProject.id === id && filtered.length > 0) {
      handleSelectProject(filtered[0]);
    }
  };

  // Toggle side panels
  const handleTogglePanel = (panel: SidePanelType) => {
    if (panel === 'terminal') {
      setTerminalOpen(!terminalOpen);
      return;
    }
    if (panel === 'settings') {
      setActiveScreen('about');
      return;
    }
    setActiveSidePanel(activeSidePanel === panel ? null : panel);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-[#111319] text-[#e1e2ea] flex flex-col font-['Geist'] selection:bg-[#00f5a0] selection:text-[#006b43]">
      {/* Top Fixed Header */}
      <Header
        activeScreen={activeScreen}
        onNavigate={setActiveScreen}
        currentProject={currentProject}
        projects={projects}
        onSelectProject={handleSelectProject}
        onOpenAIGen={() => setAiGenModalOpen(true)}
        onOpenExport={() => setExportModalOpen(true)}
        supabaseConnected={true}
        currentUser={currentUser}
        onOpenLogin={() => setLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Left Fixed Sidebar Dock */}
      <LeftSidebar
        activePanel={activeSidePanel}
        onTogglePanel={handleTogglePanel}
        activeScreen={activeScreen}
        onNavigate={setActiveScreen}
      />

      {/* Main Content Area */}
      <div className="pl-16 w-full flex-1 flex flex-col pt-14 pb-8">
        <main className="w-full flex-1 flex flex-col bg-[#0b0e13]">
          {activeScreen === 'docs-and-specs' && (
            <DocsAndSpecsScreen
              currentProject={currentProject}
              onOpenAudit={() => setAuditModalOpen(true)}
              onNavigateToStudio={() => setActiveScreen('studio-editor')}
            />
          )}

          {activeScreen === 'studio-editor' && (
            <StudioEditorScreen
              scene={currentScene}
              onUpdateScene={handleUpdateScene}
              activeSidePanel={activeSidePanel}
              cameraMode={cameraMode}
              onOpenAIGen={() => setAiGenModalOpen(true)}
            />
          )}

          {activeScreen === 'explore-worlds' && (
            <ExploreWorldsScreen
              projects={projects}
              onSelectProject={handleSelectProject}
              onLaunchInStudio={handleLaunchInStudio}
            />
          )}

          {activeScreen === 'my-projects' && (
            <MyProjectsScreen
              projects={projects}
              currentProject={currentProject}
              onSelectProject={handleSelectProject}
              onLaunchInStudio={handleLaunchInStudio}
              onCreateProject={handleCreateProject}
              onDeleteProject={handleDeleteProject}
            />
          )}

          {activeScreen === 'about' && (
            <AboutScreen
              onNavigateToStudio={() => setActiveScreen('studio-editor')}
              onOpenLogin={() => setLoginModalOpen(true)}
            />
          )}

          {activeScreen === 'privacy' && <PrivacyScreen />}

          {activeScreen === 'terms' && <TermsScreen />}
        </main>
      </div>

      {/* Bottom Fixed Status Bar */}
      <FooterStatusBar
        cameraMode={cameraMode}
        onToggleCameraMode={setCameraMode}
        trisCount={currentProject.tris}
        itemsCount={currentScene.rootObjects.length}
        memoryMb={68.4}
        onOpenTerminal={() => setTerminalOpen(!terminalOpen)}
      />

      {/* Interactive Modals */}
      <AIGeneratorModal
        isOpen={aiGenModalOpen}
        onClose={() => setAiGenModalOpen(false)}
        scene={currentScene}
        onInsertGeneratedNodes={handleInsertGeneratedNodes}
      />

      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        scene={currentScene}
      />

      <AuditReportModal
        isOpen={auditModalOpen}
        onClose={() => setAuditModalOpen(false)}
      />

      <TerminalDrawer
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
      />

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
        }}
      />
    </div>
  );
}
