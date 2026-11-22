import React, { useState } from 'react';
import { MirroraScene } from '../types/schema';
import { exportScene, ExportFormat } from '../utils/exporters';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  scene: MirroraScene;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, scene }) => {
  const [activeFormat, setActiveFormat] = useState<'json' | 'ts' | 'sql'>('json');
  const [copied, setCopied] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const doExport = async (fmt: ExportFormat) => {
    setExportError(null);
    setBusy(true);
    try {
      await exportScene(scene, fmt);
    } catch (err) {
      setExportError(err instanceof Error ? err.message : 'Export failed.');
    } finally {
      setBusy(false);
    }
  };

  if (!isOpen) return null;

  const jsonContent = JSON.stringify(scene, null, 2);

  const tsContent = `// Auto-generated Spatial Engine Schema v2.4.0
export interface Transform3D {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

export interface MaterialConfig {
  id: string;
  type: 'standard' | 'physical' | 'toon' | 'unlit';
  color: string;
  roughness: number;
  metalness: number;
  emissive?: string;
  wireframe?: boolean;
}

export interface SceneObject {
  id: string;
  name: string;
  type: 'mesh' | 'directional_light' | 'point_light' | 'camera' | 'group';
  geometry?: 'box' | 'sphere' | 'torus' | 'cylinder' | 'pyramid' | 'custom_gltf';
  transform: Transform3D;
  material?: MaterialConfig;
  children?: SceneObject[];
  castShadow: boolean;
  receiveShadow: boolean;
  visible: boolean;
}

export const activeSceneData = ${jsonContent};
`;

  const sqlContent = `-- Supabase PostgreSQL 15 Row-Level Security Definition
ALTER TABLE public.worlds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public worlds are viewable by everyone"
  ON public.worlds FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can only edit own worlds"
  ON public.worlds FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Snapshot commit for world ${scene.worldId}
INSERT INTO public.worlds (id, name, scene_ast, updated_at)
VALUES (
  '${scene.worldId}',
  '${scene.worldName}',
  '${JSON.stringify(scene).replace(/'/g, "''")}'::jsonb,
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  scene_ast = EXCLUDED.scene_ast,
  updated_at = NOW();
`;

  const getActiveCode = () => {
    switch (activeFormat) {
      case 'ts':
        return tsContent;
      case 'sql':
        return sqlContent;
      case 'json':
      default:
        return jsonContent;
    }
  };

  const getFilename = () => {
    switch (activeFormat) {
      case 'ts':
        return 'schema.v2.4.ts';
      case 'sql':
        return 'supabase_rls.sql';
      case 'json':
      default:
        return 'MirroraScene.json';
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const blob = new Blob([getActiveCode()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = getFilename();
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0b0e13]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-3xl max-h-[85vh] rounded bg-[#191c21] border border-[#272a30] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#272a30] flex items-center justify-between bg-[#1d2025]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00d2ff] text-[20px]">ios_share</span>
            <div>
              <h3 className="font-['Space_Grotesk'] text-base font-semibold text-[#e1e2ea]">
                Export Scene
              </h3>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#849588]">
                {scene.worldName}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#849588] hover:text-[#e1e2ea] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Real 3D model export */}
        <div className="px-6 py-3 border-b border-[#272a30] bg-[#191c21]">
          <div className="font-['JetBrains_Mono'] text-[10px] text-[#849588] mb-2">3D MODEL FILES (open in Blender, 3D Viewer, etc.)</div>
          <div className="flex flex-wrap items-center gap-2">
            {(['glb', 'gltf', 'obj', 'stl'] as ExportFormat[]).map((f) => (
              <button
                key={f}
                disabled={busy}
                onClick={() => doExport(f)}
                className="px-3.5 py-1.5 rounded bg-[#00f5a0] hover:bg-[#00d2ff] disabled:opacity-50 text-[#002111] font-['JetBrains_Mono'] text-xs font-semibold uppercase"
              >
                Download .{f}
              </button>
            ))}
          </div>
          {exportError && <p role="alert" className="mt-2 text-xs text-[#ffb4ab]">{exportError}</p>}
        </div>

        {/* Format Selector */}
        <div className="px-6 pt-4 flex items-center gap-2 bg-[#191c21] border-b border-[#272a30] pb-3">
          {[
            { id: 'json', label: 'SceneGraph (JSON)' },
            { id: 'ts', label: 'TypeScript AST' },
            { id: 'sql', label: 'Postgres SQL & RLS' },
          ].map((fmt) => (
            <button
              key={fmt.id}
              onClick={() => setActiveFormat(fmt.id as any)}
              className={`px-3 py-1.5 rounded font-['JetBrains_Mono'] text-xs transition-colors ${
                activeFormat === fmt.id
                  ? 'bg-[#00f5a0] text-[#002111] font-semibold'
                  : 'text-[#b9cbbd] hover:text-[#e1e2ea] hover:bg-[#272a30]'
              }`}
            >
              {fmt.label}
            </button>
          ))}
        </div>

        {/* Code Content */}
        <div className="p-4 overflow-y-auto flex-1 font-['JetBrains_Mono'] text-xs text-[#e1e2ea] bg-[#0b0e13]">
          <pre className="leading-relaxed">
            <code>{getActiveCode()}</code>
          </pre>
        </div>

        {/* Actions */}
        <div className="p-3 border-t border-[#272a30] bg-[#1d2025] flex items-center justify-between">
          <span className="font-['JetBrains_Mono'] text-[10px] text-[#00f5a0]">
            Exporting as {getFilename()}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={copyToClipboard}
              className="px-3.5 py-1.5 rounded bg-[#272a30] hover:bg-[#32353b] text-[#e1e2ea] font-['JetBrains_Mono'] text-xs flex items-center gap-1.5 transition-colors border border-[#3b4a40]/40"
            >
              <span className="material-symbols-outlined text-[14px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
            <button
              onClick={downloadFile}
              className="px-4 py-1.5 rounded bg-[#00f5a0] hover:bg-[#00d2ff] text-[#002111] font-['JetBrains_Mono'] text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-[14px]">download</span>
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
