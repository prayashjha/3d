import React, { useState } from 'react';
import { WorldProject } from '../types/schema';

interface MyProjectsScreenProps {
  projects: WorldProject[];
  currentProject: WorldProject;
  onSelectProject: (proj: WorldProject) => void;
  onLaunchInStudio: (proj: WorldProject) => void;
  onCreateProject: (title: string, desc: string) => void;
  onDeleteProject: (id: string) => void;
}

export const MyProjectsScreen: React.FC<MyProjectsScreenProps> = ({
  projects,
  currentProject,
  onSelectProject,
  onLaunchInStudio,
  onCreateProject,
  onDeleteProject,
}) => {
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [descInput, setDescInput] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim()) return;
    onCreateProject(titleInput.trim(), descInput.trim() || 'Custom spatial computing world.');
    setTitleInput('');
    setDescInput('');
    setNewModalOpen(false);
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-[#0b0e13]">
      {/* Header Banner */}
      <section className="px-6 py-8 bg-[#191c21] border-b border-[#272a30]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-xs text-[#00f5a0] uppercase mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f5a0]" />
              <span>SUPABASE ROW-LEVEL STORAGE • USER SCOPE</span>
            </div>
            <h1 className="font-['Space_Grotesk'] text-2xl lg:text-3xl font-semibold text-[#e1e2ea]">
              My Projects &amp; Scene Repositories
            </h1>
            <p className="font-['Geist'] text-sm text-[#b9cbbd] mt-1">
              Isolated via <code>auth.uid() = user_id</code> RLS policies. Instant zero-downtime hot reloading.
            </p>
          </div>

          <button
            onClick={() => setNewModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded bg-[#00f5a0] hover:bg-[#00d2ff] text-[#002111] font-['JetBrains_Mono'] text-xs uppercase font-semibold transition-all shadow-[0_0_16px_rgba(0,245,160,0.25)]"
          >
            <span className="material-symbols-outlined text-[16px]">add_box</span>
            <span>New World Project</span>
          </button>
        </div>
      </section>

      {/* Projects Table / Cards */}
      <div className="w-full px-6 py-8 max-w-7xl mx-auto flex-1">
        <div className="rounded bg-[#191c21] border border-[#272a30] overflow-hidden shadow-lg">
          <div className="px-6 py-4 border-b border-[#272a30] flex items-center justify-between">
            <span className="font-['Space_Grotesk'] text-base font-semibold text-[#e1e2ea]">
              Active Workspaces ({projects.length})
            </span>
            <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-xs text-[#00f5a0]">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>RLS Isolation Enforced</span>
            </div>
          </div>

          <div className="divide-y divide-[#272a30]">
            {projects.map((proj) => {
              const isCurrent = proj.id === currentProject.id;
              return (
                <div
                  key={proj.id}
                  className={`p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                    isCurrent ? 'bg-[#1d2025]' : 'hover:bg-[#1d2025]/50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={proj.thumbnail}
                      alt={proj.title}
                      className="w-16 h-16 rounded object-cover border border-[#272a30] shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-['Space_Grotesk'] text-lg font-semibold text-[#e1e2ea]">
                          {proj.title}
                        </h3>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded bg-[#00f5a0]/15 text-[#00f5a0] font-['JetBrains_Mono'] text-[10px] border border-[#00f5a0]/40">
                            ACTIVE
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded bg-[#272a30] text-[#b9cbbd] font-['JetBrains_Mono'] text-[10px]">
                          v2.4
                        </span>
                      </div>
                      <p className="font-['Geist'] text-xs text-[#b9cbbd] mt-1 max-w-xl">
                        {proj.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 font-['JetBrains_Mono'] text-[11px] text-[#849588]">
                        <span>{proj.tris.toLocaleString()} Tris</span>
                        <span>•</span>
                        <span>{proj.items} Items</span>
                        <span>•</span>
                        <span>Updated {proj.updatedAt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        onSelectProject(proj);
                        onLaunchInStudio(proj);
                      }}
                      className="px-3.5 py-1.5 rounded bg-[#00f5a0] hover:bg-[#00d2ff] text-[#002111] font-['JetBrains_Mono'] text-xs font-semibold transition-all flex items-center gap-1.5"
                    >
                      <span>Edit Scene</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>

                    {projects.length > 1 && (
                      <button
                        onClick={() => onDeleteProject(proj.id)}
                        className="p-2 rounded text-[#849588] hover:text-[#ffb4ab] hover:bg-[#272a30] transition-colors"
                        title="Delete World"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* New Project Modal */}
      {newModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0b0e13]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreate}
            className="w-full max-w-md rounded bg-[#191c21] border border-[#272a30] p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#272a30] pb-3">
              <h3 className="font-['Space_Grotesk'] text-lg font-semibold text-[#e1e2ea]">
                Create Spatial World
              </h3>
              <button
                type="button"
                onClick={() => setNewModalOpen(false)}
                className="text-[#849588] hover:text-[#e1e2ea]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div>
              <label className="text-xs font-['JetBrains_Mono'] text-[#b9cbbd] block mb-1">
                World Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Cyber Matrix Hub"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#111319] border border-[#272a30] text-xs font-['JetBrains_Mono'] text-[#e1e2ea] focus:outline-none focus:border-[#00f5a0]"
              />
            </div>

            <div>
              <label className="text-xs font-['JetBrains_Mono'] text-[#b9cbbd] block mb-1">
                Description / Purpose
              </label>
              <textarea
                rows={3}
                placeholder="Brief technical architecture description..."
                value={descInput}
                onChange={(e) => setDescInput(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#111319] border border-[#272a30] text-xs font-['JetBrains_Mono'] text-[#e1e2ea] focus:outline-none focus:border-[#00f5a0]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#272a30]">
              <button
                type="button"
                onClick={() => setNewModalOpen(false)}
                className="px-3 py-1.5 rounded bg-[#272a30] text-[#b9cbbd] text-xs font-['JetBrains_Mono'] hover:text-[#e1e2ea]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded bg-[#00f5a0] text-[#002111] text-xs font-['JetBrains_Mono'] font-semibold hover:bg-[#00d2ff]"
              >
                Create Project
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
