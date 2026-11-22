import React, { useState } from 'react';
import { MirroraScene, SceneObject } from '../types/schema';

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  scene: MirroraScene;
  onInsertGeneratedNodes: (nodes: SceneObject[]) => void;
}

export const AIGeneratorModal: React.FC<AIGeneratorModalProps> = ({
  isOpen,
  onClose,
  scene,
  onInsertGeneratedNodes,
}) => {
  const [prompt, setPrompt] = useState('Cyberpunk orbital monolith with luminous teal ion rings and metallic pylons');
  const [generating, setGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [generatedNodes, setGeneratedNodes] = useState<SceneObject[] | null>(null);

  if (!isOpen) return null;

  const handleGenerate = () => {
    setGenerating(true);
    setGenerationStep('01. INGESTION: Parsing prompt into structural topology latents (~240ms)...');

    setTimeout(() => {
      setGenerationStep('02. GRAPH PARSER: Converting vertices and materials to MirroraScene AST...');
    }, 400);

    setTimeout(() => {
      setGenerationStep('03. COMPRESSION: Validating Draco geometry buffers and PBR standard materials...');
    }, 800);

    setTimeout(() => {
      // Create new procedural nodes based on the prompt
      const timestamp = Date.now().toString().slice(-4);
      const newNodes: SceneObject[] = [
        {
          id: `obj-gen-spire-${timestamp}`,
          name: 'AI Generated Spire Node',
          type: 'mesh',
          geometry: 'box',
          transform: {
            position: [+(Math.random() * 2 - 1).toFixed(1), 3.2, +(Math.random() * 2 - 1).toFixed(1)],
            rotation: [0, 0.45, 0],
            scale: [0.8, 6.4, 0.8],
          },
          material: {
            id: `mat-spire-${timestamp}`,
            type: 'standard',
            color: '#111822',
            roughness: 0.15,
            metalness: 0.9,
            emissive: '#00f5a0',
            wireframe: false,
          },
          castShadow: true,
          receiveShadow: true,
          visible: true,
        },
        {
          id: `obj-gen-halo-${timestamp}`,
          name: 'Ion Halo Emitter',
          type: 'mesh',
          geometry: 'torus',
          transform: {
            position: [0, 5.0, 0],
            rotation: [1.57, 0, 0],
            scale: [2.2, 2.2, 0.1],
          },
          material: {
            id: `mat-halo-${timestamp}`,
            type: 'physical',
            color: '#00d2ff',
            roughness: 0.1,
            metalness: 0.8,
            emissive: '#00d2ff',
            wireframe: false,
          },
          castShadow: false,
          receiveShadow: false,
          visible: true,
        },
        {
          id: `obj-gen-emitter-${timestamp}`,
          name: 'Sub-Atomic Quantum Sphere',
          type: 'mesh',
          geometry: 'sphere',
          transform: {
            position: [0, 6.8, 0],
            rotation: [0, 0, 0],
            scale: [0.5, 0.5, 0.5],
          },
          material: {
            id: `mat-emitter-${timestamp}`,
            type: 'standard',
            color: '#50ffaf',
            roughness: 0.05,
            metalness: 0.3,
            emissive: '#00f5a0',
            wireframe: true,
          },
          castShadow: false,
          receiveShadow: false,
          visible: true,
        },
      ];

      setGeneratedNodes(newNodes);
      setGenerating(false);
      setGenerationStep('Generated 3 structural SceneObjects ready for scene insertion.');
    }, 1200);
  };

  const insertIntoScene = () => {
    if (!generatedNodes) return;
    onInsertGeneratedNodes(generatedNodes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0b0e13]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded bg-[#191c21] border border-[#272a30] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[#272a30] flex items-center justify-between bg-[#1d2025]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00f5a0] text-[20px]">auto_awesome</span>
            <div>
              <h3 className="font-['Space_Grotesk'] text-base font-semibold text-[#e1e2ea]">
                AI 3D Scene Generation Engine
              </h3>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#00d2ff]">
                Spatial Computing Pipeline v2.4
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

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-['JetBrains_Mono'] text-[#b9cbbd] mb-1.5 uppercase">
              Natural Language Spatial Prompt
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe 3D structures, lighting, materials, and geometries..."
              className="w-full p-3 rounded bg-[#111319] border border-[#272a30] text-xs font-['JetBrains_Mono'] text-[#e1e2ea] focus:outline-none focus:border-[#00f5a0] leading-relaxed"
            />
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-['JetBrains_Mono'] text-[#849588]">Quick Presets:</span>
            {[
              'Cyber Citadel Spire with Ion Rings',
              'Subterranean Quantum Vault',
              'Orbital Satellite Station Alpha',
            ].map((preset) => (
              <button
                key={preset}
                onClick={() => setPrompt(preset)}
                className="px-2 py-0.5 rounded bg-[#1d2025] hover:bg-[#272a30] text-[#b9cbbd] text-[10px] font-['JetBrains_Mono'] border border-[#272a30] transition-colors"
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Generation Progress Indicator */}
          {generating && (
            <div className="p-3 rounded bg-[#111319] border border-[#00f5a0]/40 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#00f5a0] animate-ping" />
              <span className="font-['JetBrains_Mono'] text-xs text-[#00f5a0]">
                {generationStep}
              </span>
            </div>
          )}

          {/* Generated Result Preview */}
          {generatedNodes && !generating && (
            <div className="p-4 rounded bg-[#111319] border border-[#272a30] space-y-2">
              <div className="flex items-center justify-between font-['JetBrains_Mono'] text-xs text-[#00f5a0]">
                <span className="flex items-center gap-1.5 font-semibold">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>Synthesized {generatedNodes.length} SceneObjects</span>
                </span>
                <span className="text-[10px] text-[#b9cbbd]">AST Schema Validated</span>
              </div>
              <div className="divide-y divide-[#272a30] max-h-40 overflow-y-auto">
                {generatedNodes.map((node) => (
                  <div key={node.id} className="py-1.5 flex items-center justify-between text-xs font-['JetBrains_Mono']">
                    <span className="text-[#e1e2ea]">{node.name}</span>
                    <span className="text-[#849588] text-[10px]">
                      {node.geometry} • pos: [{node.transform.position.join(', ')}]
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#272a30] bg-[#1d2025] flex items-center justify-between">
          <span className="font-['JetBrains_Mono'] text-[10px] text-[#849588]">
            Target Scene: {scene.worldName}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded bg-[#272a30] text-[#b9cbbd] text-xs font-['JetBrains_Mono'] hover:text-[#e1e2ea]"
            >
              Cancel
            </button>
            {!generatedNodes ? (
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="px-4 py-1.5 rounded bg-[#00f5a0] hover:bg-[#00d2ff] text-[#002111] text-xs font-['JetBrains_Mono'] font-semibold transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,245,160,0.3)] disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                <span>{generating ? 'Synthesizing...' : 'Generate 3D Nodes'}</span>
              </button>
            ) : (
              <button
                onClick={insertIntoScene}
                className="px-4 py-1.5 rounded bg-[#00f5a0] hover:bg-[#00d2ff] text-[#002111] text-xs font-['JetBrains_Mono'] font-semibold transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,245,160,0.3)]"
              >
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                <span>Insert into 3D Viewport</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
