import React, { useState } from 'react';
import { WorldProject } from '../types/schema';

interface ExploreWorldsScreenProps {
  projects: WorldProject[];
  onSelectProject: (proj: WorldProject) => void;
  onLaunchInStudio: (proj: WorldProject) => void;
}

export const ExploreWorldsScreen: React.FC<ExploreWorldsScreenProps> = ({
  projects,
  onSelectProject,
  onLaunchInStudio,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectingProject, setInspectingProject] = useState<WorldProject | null>(null);

  const tags = ['All', 'Cyberpunk', 'WebXR Ready', 'Sci-Fi', 'Brutalist', 'Volumetric', 'PBR Shaders'];

  const filteredProjects = projects.filter((p) => {
    const matchesTag = selectedTag === 'All' || p.tags.includes(selectedTag);
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <div className="w-full flex-1 flex flex-col bg-[#0b0e13]">
      {/* Header Banner */}
      <section className="px-6 py-8 bg-[#191c21] border-b border-[#272a30]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-xs text-[#00f5a0] uppercase mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f5a0] animate-pulse" />
              <span>SPATIAL REALMS &amp; ENVIRONMENTS</span>
            </div>
            <h1 className="font-['Space_Grotesk'] text-2xl lg:text-3xl font-semibold text-[#e1e2ea]">
              Explore Spatial Worlds
            </h1>
            <p className="font-['Geist'] text-sm text-[#b9cbbd] mt-1">
              Curated WebGL2 and WebXR environments serialized with Draco compression and strict AST compliance.
            </p>
          </div>

          {/* Search bar */}
          <div className="w-full md:w-72 relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-[#849588]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by world name or author..."
              className="w-full pl-9 pr-3 py-2 rounded bg-[#111319] border border-[#272a30] text-xs font-['JetBrains_Mono'] text-[#e1e2ea] placeholder-[#849588] focus:outline-none focus:border-[#00f5a0]"
            />
          </div>
        </div>

        {/* Tag Filters */}
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-2 mt-6">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded text-xs font-['JetBrains_Mono'] transition-all ${
                selectedTag === tag
                  ? 'bg-[#00f5a0] text-[#002111] font-semibold shadow-[0_0_12px_rgba(0,245,160,0.25)]'
                  : 'bg-[#1d2025] text-[#b9cbbd] hover:text-[#e1e2ea] hover:bg-[#272a30] border border-[#272a30]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* World Grid */}
      <div className="w-full px-6 py-8 max-w-7xl mx-auto flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="rounded bg-[#191c21] border border-[#272a30] hover:border-[#00f5a0]/50 transition-all flex flex-col overflow-hidden group shadow-md"
            >
              {/* Thumbnail Container */}
              <div className="h-48 w-full relative overflow-hidden bg-[#111319]">
                <img
                  src={proj.thumbnail}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#191c21] via-transparent to-transparent" />

                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#0b0e13]/80 backdrop-blur-md font-['JetBrains_Mono'] text-[10px] text-[#00f5a0] border border-[#3b4a40]/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00f5a0]" />
                  <span>{proj.tris.toLocaleString()} TRIS</span>
                </div>

                <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-[#0b0e13]/80 backdrop-blur-md font-['JetBrains_Mono'] text-[10px] text-[#00d2ff] border border-[#3b4a40]/40">
                  {proj.items} OBJECTS
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-[#849588] font-['JetBrains_Mono'] mb-1">
                    <span>{proj.author}</span>
                    <span>{proj.updatedAt}</span>
                  </div>
                  <h3 className="font-['Space_Grotesk'] text-lg font-semibold text-[#e1e2ea] group-hover:text-[#00f5a0] transition-colors">
                    {proj.title}
                  </h3>
                  <p className="font-['Geist'] text-xs text-[#b9cbbd] line-clamp-2 mt-1 leading-relaxed">
                    {proj.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {proj.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded bg-[#1d2025] text-[#b9cbbd] font-['JetBrains_Mono'] text-[10px] border border-[#272a30]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 mt-4 border-t border-[#272a30] flex items-center justify-between gap-2">
                  <button
                    onClick={() => setInspectingProject(proj)}
                    className="px-3 py-1.5 rounded bg-[#1d2025] hover:bg-[#272a30] text-[#b9cbbd] hover:text-[#e1e2ea] font-['JetBrains_Mono'] text-xs border border-[#3b4a40]/40 transition-colors flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[14px]">code</span>
                    <span>AST JSON</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectProject(proj);
                      onLaunchInStudio(proj);
                    }}
                    className="px-3 py-1.5 rounded bg-[#00f5a0] hover:bg-[#00d2ff] text-[#002111] font-['JetBrains_Mono'] text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <span>Launch in Studio</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inspect AST Modal */}
      {inspectingProject && (
        <div className="fixed inset-0 z-50 bg-[#0b0e13]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl max-h-[85vh] rounded bg-[#191c21] border border-[#272a30] shadow-2xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-[#272a30] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00f5a0]">data_object</span>
                <span className="font-['Space_Grotesk'] text-base font-semibold text-[#e1e2ea]">
                  Scene Graph AST: {inspectingProject.title}
                </span>
              </div>
              <button
                onClick={() => setInspectingProject(null)}
                className="p-1 rounded text-[#849588] hover:text-[#e1e2ea]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 font-['JetBrains_Mono'] text-xs text-[#e1e2ea] bg-[#0b0e13]">
              <pre className="leading-relaxed">
                <code>{JSON.stringify(inspectingProject.scene, null, 2)}</code>
              </pre>
            </div>

            <div className="p-3 border-t border-[#272a30] bg-[#1d2025] flex justify-end gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(inspectingProject.scene, null, 2));
                  alert('AST copied to clipboard!');
                }}
                className="px-3 py-1.5 rounded bg-[#272a30] text-[#e1e2ea] font-['JetBrains_Mono'] text-xs hover:bg-[#32353b]"
              >
                Copy JSON
              </button>
              <button
                onClick={() => {
                  onSelectProject(inspectingProject);
                  onLaunchInStudio(inspectingProject);
                  setInspectingProject(null);
                }}
                className="px-3 py-1.5 rounded bg-[#00f5a0] text-[#002111] font-['JetBrains_Mono'] text-xs font-semibold"
              >
                Load into Studio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
