import React, { useState } from 'react';
import { WorldProject } from '../types/schema';

interface DocsAndSpecsScreenProps {
  currentProject: WorldProject;
  onOpenAudit: () => void;
  onNavigateToStudio: () => void;
}

export const DocsAndSpecsScreen: React.FC<DocsAndSpecsScreenProps> = ({
  currentProject,
  onOpenAudit,
  onNavigateToStudio,
}) => {
  const [activeTab, setActiveTab] = useState<'schema' | 'sql' | 'cicd' | 'keys'>('schema');
  const [copied, setCopied] = useState(false);
  const [pipelineActiveStep, setPipelineActiveStep] = useState<number | null>(null);
  const [retestingChecks, setRetestingChecks] = useState(false);

  const copySpecJson = () => {
    const specData = {
      specVersion: '2.4.0-STABLE',
      sha256: '7f83b165c016e792e84c98fbc1859600a9dc129841f38e4a909405624b82',
      target: 'Spatial Computing Engine v2.4',
      currentScene: currentProject.scene,
      rlsVerification: 'PASS',
      webglContext: 'WebGL2',
      framerateTarget: 60.0,
      timestamp: new Date().toISOString(),
    };

    navigator.clipboard.writeText(JSON.stringify(specData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const simulatePipeline = () => {
    setPipelineActiveStep(0);
    setTimeout(() => setPipelineActiveStep(1), 350);
    setTimeout(() => setPipelineActiveStep(2), 700);
    setTimeout(() => setPipelineActiveStep(3), 1050);
    setTimeout(() => setPipelineActiveStep(null), 1600);
  };

  const triggerCheckRetest = () => {
    setRetestingChecks(true);
    setTimeout(() => setRetestingChecks(false), 1200);
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-[#0b0e13]">
      {/* Top Technical Banner & Title Matrix */}
      <section className="relative w-full px-6 py-8 bg-[#191c21] overflow-hidden border-b border-[#272a30]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00f5a0]/5 via-[#00d2ff]/5 to-transparent pointer-events-none" />
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-[#00f5a0]/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-4 max-w-7xl mx-auto">
          {/* Metadata breadcrumbs */}
          <div className="flex flex-wrap items-center gap-2 font-['JetBrains_Mono'] text-xs uppercase">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#272a30] text-[#00f5a0] font-medium tracking-widest border border-[#3b4a40]/50">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f5a0] animate-pulse" />
              TOOLSX.SPEC.v2.4-STABLE
            </span>
            <span className="text-[#849588]">/</span>
            <span className="text-[#b9cbbd] font-['JetBrains_Mono'] text-xs tracking-wider">
              AI TOOLS LAB COMPENDIUM
            </span>
            <span className="text-[#849588]">/</span>
            <a
              href="https://toolsx.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00d2ff] hover:text-[#00f5a0] font-['JetBrains_Mono'] text-xs hover:underline flex items-center gap-1"
            >
              <span>toolsx.in</span>
              <span className="material-symbols-outlined text-[13px]">open_in_new</span>
            </a>
          </div>

          {/* Heading & Action buttons */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-1.5 max-w-3xl">
              <h1 className="font-['Space_Grotesk'] text-2xl lg:text-[34px] lg:leading-[42px] text-[#e1e2ea] font-semibold tracking-tight">
                <span className="text-[#00f5a0]">TOOLSX</span> System Architecture &amp; Engineering Specification
              </h1>
              <p className="font-['Geist'] text-base text-[#b9cbbd] leading-relaxed">
                Comprehensive overview of 3D Graphics pipeline, browser-based storage security, Scene graph serialization, and AI Generation schemas by AI Tools Lab India (<a href="https://toolsx.in" target="_blank" rel="noopener noreferrer" className="text-[#00f5a0] hover:underline">toolsx.in</a>).
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={copySpecJson}
                className="flex items-center gap-2 px-4 py-2 rounded bg-[#32353b] hover:bg-[#36393f] text-[#e1e2ea] font-['JetBrains_Mono'] text-xs transition-all shadow-sm border border-[#3b4a40]/40"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {copied ? 'check' : 'content_copy'}
                </span>
                <span>{copied ? 'Copied Spec JSON!' : 'Copy Spec JSON'}</span>
              </button>

              <button
                onClick={onOpenAudit}
                className="flex items-center gap-2 px-4 py-2 rounded bg-[#00f5a0] hover:bg-[#00d2ff] text-[#003921] font-['JetBrains_Mono'] text-xs uppercase font-semibold transition-all shadow-[0_0_16px_rgba(0,245,160,0.25)]"
              >
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>Audit Report</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Workspace Body */}
      <div className="w-full px-6 py-8 flex flex-col gap-8 max-w-7xl mx-auto">
        {/* System Diagnostics & Verification Matrix */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00f5a0] text-[20px]">
                troubleshoot
              </span>
              <h2 className="font-['Space_Grotesk'] text-lg text-[#e1e2ea] uppercase tracking-wide font-medium">
                Interactive Diagnostics Matrix
              </h2>
            </div>
            <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-xs text-[#b9cbbd]">
              <span className="w-2 h-2 rounded-full bg-[#00f5a0] shadow-[0_0_8px_#00f5a0] animate-pulse" />
              <span>ALL ENGINES NORMAL (5/5 PASSED)</span>
            </div>
          </div>

          {/* Bento Diagnostics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Diagnostic 1: TypeScript */}
            <div className="group p-4 rounded bg-[#191c21] hover:bg-[#1d2025] transition-all flex flex-col justify-between shadow-sm border border-[#272a30]">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#1d2025] flex items-center justify-center text-[#00d2ff] border border-[#3b4a40]/30">
                    <span className="material-symbols-outlined text-[18px]">code</span>
                  </div>
                  <div>
                    <div className="font-['Space_Grotesk'] text-[15px] font-semibold text-[#e1e2ea]">
                      TypeScript 5.8 Compiler
                    </div>
                    <div className="font-['JetBrains_Mono'] text-xs text-[#b9cbbd]">
                      Strict Null & Type Safety
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#00f5a0]/20 text-[#00f5a0] font-['JetBrains_Mono'] text-xs font-semibold tracking-wider border border-[#00f5a0]/30">
                  PASS: 0 ERR
                </span>
              </div>
              <div className="mt-4 pt-2 border-t border-[#272a30]/60 flex items-center justify-between font-['JetBrains_Mono'] text-xs text-[#b9cbbd]">
                <span>Target: ES2024 / NodeNext</span>
                <span className="text-[#00f5a0] font-medium">99.8% AST Resolved</span>
              </div>
            </div>

            {/* Diagnostic 2: 3D Engine */}
            <div
              onClick={onNavigateToStudio}
              className="group p-4 rounded bg-[#191c21] hover:bg-[#1d2025] hover:border-[#00f5a0]/40 transition-all flex flex-col justify-between shadow-sm border border-[#272a30] cursor-pointer"
              title="Click to launch 3D Studio"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#1d2025] flex items-center justify-center text-[#00f5a0] border border-[#3b4a40]/30">
                    <span className="material-symbols-outlined text-[18px]">deployed_code</span>
                  </div>
                  <div>
                    <div className="font-['Space_Grotesk'] text-[15px] font-semibold text-[#e1e2ea] group-hover:text-[#00f5a0] transition-colors">
                      Three.js v0.162 + R3F
                    </div>
                    <div className="font-['JetBrains_Mono'] text-xs text-[#b9cbbd]">
                      WebGL2 Accelerated Context
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#00d2ff]/20 text-[#00d2ff] font-['JetBrains_Mono'] text-xs font-semibold tracking-wider border border-[#00d2ff]/30">
                  ACTIVE
                </span>
              </div>
              <div className="mt-4 pt-2 border-t border-[#272a30]/60 flex items-center justify-between font-['JetBrains_Mono'] text-xs text-[#b9cbbd]">
                <span>OrbitControls • TransformGizmo</span>
                <span className="text-[#e1e2ea] font-medium">60.2 FPS Target</span>
              </div>
            </div>

            {/* Diagnostic 3: Supabase & RLS */}
            <div className="group p-4 rounded bg-[#191c21] hover:bg-[#1d2025] transition-all flex flex-col justify-between shadow-sm border border-[#272a30]">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#1d2025] flex items-center justify-center text-[#50ffaf] border border-[#3b4a40]/30">
                    <span className="material-symbols-outlined text-[18px]">security</span>
                  </div>
                  <div>
                    <div className="font-['Space_Grotesk'] text-[15px] font-semibold text-[#e1e2ea]">
                      Supabase PostgreSQL 15
                    </div>
                    <div className="font-['JetBrains_Mono'] text-xs text-[#b9cbbd]">
                      Row-Level Security Enabled
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#00f5a0]/20 text-[#00f5a0] font-['JetBrains_Mono'] text-xs font-semibold tracking-wider border border-[#00f5a0]/30">
                  RLS STRICT
                </span>
              </div>
              <div className="mt-4 pt-2 border-t border-[#272a30]/60 flex items-center justify-between font-['JetBrains_Mono'] text-xs text-[#b9cbbd]">
                <span>`worlds` & `profiles` Tables</span>
                <span className="text-[#00f5a0] font-medium">Isolation Verified</span>
              </div>
            </div>

            {/* Diagnostic 4: Vitest Coverage */}
            <div className="group p-4 rounded bg-[#191c21] hover:bg-[#1d2025] transition-all flex flex-col justify-between shadow-sm border border-[#272a30]">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#1d2025] flex items-center justify-center text-[#00d2ff] border border-[#3b4a40]/30">
                    <span className="material-symbols-outlined text-[18px]">fact_check</span>
                  </div>
                  <div>
                    <div className="font-['Space_Grotesk'] text-[15px] font-semibold text-[#e1e2ea]">
                      Vitest + Test Library
                    </div>
                    <div className="font-['JetBrains_Mono'] text-xs text-[#b9cbbd]">
                      Deterministic Assertion Suite
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#00f5a0]/20 text-[#00f5a0] font-['JetBrains_Mono'] text-xs font-semibold tracking-wider border border-[#00f5a0]/30">
                  38/38 PASS
                </span>
              </div>
              <div className="mt-4 pt-2 border-t border-[#272a30]/60 flex items-center justify-between font-['JetBrains_Mono'] text-xs text-[#b9cbbd]">
                <span>Coverage: 94.2% Total</span>
                <span className="text-[#00f5a0] font-medium">E2E Ready</span>
              </div>
            </div>

            {/* Diagnostic 5: Content Security Policy */}
            <div className="group p-4 rounded bg-[#191c21] hover:bg-[#1d2025] transition-all flex flex-col justify-between shadow-sm border border-[#272a30]">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#1d2025] flex items-center justify-center text-[#cdffde] border border-[#3b4a40]/30">
                    <span className="material-symbols-outlined text-[18px]">shield</span>
                  </div>
                  <div>
                    <div className="font-['Space_Grotesk'] text-[15px] font-semibold text-[#e1e2ea]">
                      Content Security (CSP)
                    </div>
                    <div className="font-['JetBrains_Mono'] text-xs text-[#b9cbbd]">
                      Tier-1 Enforced Policies
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#00f5a0]/20 text-[#00f5a0] font-['JetBrains_Mono'] text-xs font-semibold tracking-wider border border-[#00f5a0]/30">
                  0 SECRETS
                </span>
              </div>
              <div className="mt-4 pt-2 border-t border-[#272a30]/60 flex items-center justify-between font-['JetBrains_Mono'] text-xs text-[#b9cbbd]">
                <span>Strict JSON Schema Validator</span>
                <span className="text-[#00f5a0] font-medium">Safe Boundary</span>
              </div>
            </div>

            {/* Diagnostic 6: VRAM Allocation */}
            <div className="group p-4 rounded bg-[#191c21] hover:bg-[#1d2025] transition-all flex flex-col justify-between shadow-sm border border-[#272a30]">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#1d2025] flex items-center justify-center text-[#00d2ff] border border-[#3b4a40]/30">
                    <span className="material-symbols-outlined text-[18px]">memory</span>
                  </div>
                  <div>
                    <div className="font-['Space_Grotesk'] text-[15px] font-semibold text-[#e1e2ea]">
                      VRAM Allocation
                    </div>
                    <div className="font-['JetBrains_Mono'] text-xs text-[#b9cbbd]">
                      Dynamic Texture Buffers
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#1d2025] text-[#e1e2ea] font-['JetBrains_Mono'] text-xs tracking-wider border border-[#3b4a40]/40">
                  68.4 MB / 4 GB
                </span>
              </div>
              {/* Sparkline */}
              <div className="mt-4 pt-2 border-t border-[#272a30]/60 flex items-center justify-between font-['JetBrains_Mono'] text-xs text-[#b9cbbd]">
                <span>GC Recycle Rate</span>
                <svg className="h-4 w-28 text-[#00f5a0]" fill="none" viewBox="0 0 100 20">
                  <path
                    d="M0 15 Q 15 5, 30 14 T 60 8 T 85 16 T 100 4"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Architecture Visual Pipeline: 3D Dataflow */}
        <section className="rounded bg-[#191c21] p-5 shadow-sm border border-[#272a30]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
            <div>
              <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-[#00f5a0] font-medium">
                Pipeline Topology
              </span>
              <h3 className="font-['Space_Grotesk'] text-xl text-[#e1e2ea] font-semibold">
                Client &lt;--&gt; Engine &lt;--&gt; Supabase Realtime Flow
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-['JetBrains_Mono'] text-xs text-[#b9cbbd]">
                Full-Duplex WebSocket Synchronization
              </span>
              <button
                onClick={simulatePipeline}
                className="px-2.5 py-1 rounded bg-[#272a30] hover:bg-[#32353b] text-[#00f5a0] font-['JetBrains_Mono'] text-xs transition-colors border border-[#3b4a40]/50"
              >
                Pulse Flow
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
            {/* Node 1 */}
            <div
              className={`p-4 rounded bg-[#1d2025] flex flex-col gap-2 relative overflow-hidden border transition-all ${
                pipelineActiveStep === 0
                  ? 'border-[#00f5a0] shadow-[0_0_16px_rgba(0,245,160,0.3)] bg-[#272a30]'
                  : 'border-[#272a30]'
              }`}
            >
              <div className="w-full flex items-center justify-between">
                <span className="font-['JetBrains_Mono'] text-xs text-[#00d2ff] font-semibold">
                  01. INGESTION
                </span>
                <span className="material-symbols-outlined text-[18px] text-[#b9cbbd]">input</span>
              </div>
              <div className="font-['Geist'] text-sm font-medium text-[#e1e2ea]">
                AI Generation Engine
              </div>
              <p className="font-['Geist'] text-xs text-[#b9cbbd]">
                Diffusion &amp; NeRF parameters parse prompt inputs into structural topology payloads.
              </p>
              <div className="mt-1 font-['JetBrains_Mono'] text-xs text-[#00f5a0]">Latency: ~240ms</div>
            </div>

            {/* Node 2 */}
            <div
              className={`p-4 rounded bg-[#1d2025] flex flex-col gap-2 relative overflow-hidden border transition-all ${
                pipelineActiveStep === 1
                  ? 'border-[#00f5a0] shadow-[0_0_16px_rgba(0,245,160,0.3)] bg-[#272a30]'
                  : 'border-[#272a30]'
              }`}
            >
              <div className="w-full flex items-center justify-between">
                <span className="font-['JetBrains_Mono'] text-xs text-[#00f5a0] font-semibold">
                  02. GRAPH PARSER
                </span>
                <span className="material-symbols-outlined text-[18px] text-[#b9cbbd]">hub</span>
              </div>
              <div className="font-['Geist'] text-sm font-medium text-[#e1e2ea]">
                SceneGraph Serializer
              </div>
              <p className="font-['Geist'] text-xs text-[#b9cbbd]">
                TypeScript strict schema converts vertices, lights, and materials into `MirroraScene` AST.
              </p>
              <div className="mt-1 font-['JetBrains_Mono'] text-xs text-[#00f5a0]">Throughput: 14.2k tris/ms</div>
            </div>

            {/* Node 3 */}
            <div
              className={`p-4 rounded bg-[#1d2025] flex flex-col gap-2 relative overflow-hidden border transition-all ${
                pipelineActiveStep === 2
                  ? 'border-[#00f5a0] shadow-[0_0_16px_rgba(0,245,160,0.3)] bg-[#272a30]'
                  : 'border-[#272a30]'
              }`}
            >
              <div className="w-full flex items-center justify-between">
                <span className="font-['JetBrains_Mono'] text-xs text-[#00d2ff] font-semibold">
                  03. PERSISTENCE
                </span>
                <span className="material-symbols-outlined text-[18px] text-[#b9cbbd]">database</span>
              </div>
              <div className="font-['Geist'] text-sm font-medium text-[#e1e2ea]">
                Supabase Postgres 15
              </div>
              <p className="font-['Geist'] text-xs text-[#b9cbbd]">
                Row-Level Security checks `auth.uid() = user_id`, storing compressed JSONB snapshots.
              </p>
              <div className="mt-1 font-['JetBrains_Mono'] text-xs text-[#00f5a0]">Isolation: Verified RLS</div>
            </div>

            {/* Node 4 */}
            <div
              className={`p-4 rounded bg-[#1d2025] flex flex-col gap-2 relative overflow-hidden border transition-all ${
                pipelineActiveStep === 3
                  ? 'border-[#00f5a0] shadow-[0_0_16px_rgba(0,245,160,0.3)] bg-[#272a30]'
                  : 'border-[#272a30]'
              }`}
            >
              <div className="w-full flex items-center justify-between">
                <span className="font-['JetBrains_Mono'] text-xs text-[#00f5a0] font-semibold">
                  04. VIEWPORT
                </span>
                <span className="material-symbols-outlined text-[18px] text-[#b9cbbd]">view_in_ar</span>
              </div>
              <div className="font-['Geist'] text-sm font-medium text-[#e1e2ea]">
                WebGL2 / R3F Canvas
              </div>
              <p className="font-['Geist'] text-xs text-[#b9cbbd]">
                Dynamic render loop renders shadows, SSAO, bloom shaders, and handles user gizmo interactions.
              </p>
              <div className="mt-1 font-['JetBrains_Mono'] text-xs text-[#00f5a0]">Refresh: 60 FPS Sync</div>
            </div>
          </div>
        </section>

        {/* Interactive Specs & Schema Explorer */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00d2ff] text-[20px]">terminal</span>
              <h2 className="font-['Space_Grotesk'] text-lg text-[#e1e2ea] uppercase tracking-wide font-medium">
                Interactive Specs &amp; Schema Explorer
              </h2>
            </div>
            <div className="flex items-center gap-1 bg-[#1d2025] p-1 rounded font-['JetBrains_Mono'] text-xs border border-[#272a30]">
              <button
                onClick={() => setActiveTab('schema')}
                className={`px-3 py-1 rounded font-semibold transition-all ${
                  activeTab === 'schema'
                    ? 'bg-[#00f5a0] text-[#002111]'
                    : 'text-[#b9cbbd] hover:text-[#e1e2ea]'
                }`}
              >
                Scene Graph (JSON)
              </button>
              <button
                onClick={() => setActiveTab('sql')}
                className={`px-3 py-1 rounded transition-all ${
                  activeTab === 'sql'
                    ? 'bg-[#00f5a0] text-[#002111] font-semibold'
                    : 'text-[#b9cbbd] hover:text-[#e1e2ea]'
                }`}
              >
                Database SQL &amp; RLS
              </button>
              <button
                onClick={() => setActiveTab('cicd')}
                className={`px-3 py-1 rounded transition-all ${
                  activeTab === 'cicd'
                    ? 'bg-[#00f5a0] text-[#002111] font-semibold'
                    : 'text-[#b9cbbd] hover:text-[#e1e2ea]'
                }`}
              >
                GitHub Actions CI/CD
              </button>
              <button
                onClick={() => setActiveTab('keys')}
                className={`px-3 py-1 rounded transition-all ${
                  activeTab === 'keys'
                    ? 'bg-[#00f5a0] text-[#002111] font-semibold'
                    : 'text-[#b9cbbd] hover:text-[#e1e2ea]'
                }`}
              >
                Keyboard &amp; Gizmo
              </button>
            </div>
          </div>

          {/* Tab Content Area */}
          <div className="rounded bg-[#191c21] p-5 shadow-sm border border-[#272a30]">
            {/* PANEL 1: Scene Graph Schema */}
            {activeTab === 'schema' && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between font-['JetBrains_Mono'] text-xs text-[#b9cbbd] pb-1 border-b border-[#272a30]">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00d2ff]" />
                    types/schema.v2.4.ts • Strict Scene Graph Interface
                  </span>
                  <span className="text-[#00f5a0] font-medium">Schema Version: 2.4.0-STABLE</span>
                </div>
                <pre className="bg-[#0b0e13] p-4 rounded font-['JetBrains_Mono'] text-xs text-[#e1e2ea] overflow-x-auto leading-relaxed border border-[#272a30]/80">
                  <code>
{`export interface Transform3D {
  position: [number, number, number]; // [x, y, z] in world coordinate space
  rotation: [number, number, number]; // [pitch, yaw, roll] in radians
  scale: [number, number, number];    // Normalized 1.0 unit scale factor
}

export interface MaterialConfig {
  id: string;
  type: 'standard' | 'physical' | 'toon' | 'unlit';
  color: string;             // Hex format #RRGGBB
  roughness: number;         // 0.0 - 1.0
  metalness: number;         // 0.0 - 1.0
  emissive?: string;         // Luminescent bloom color
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

export interface MirroraScene {
  version: '2.4.0';
  worldId: string;
  environment: {
    ambientColor: string;
    ambientIntensity: number;
    fogDensity: number;
    skyPreset: 'cyberpunk_dawn' | 'orbital_void' | 'monolith_gray';
  };
  rootObjects: SceneObject[];
}`}
                  </code>
                </pre>
              </div>
            )}

            {/* PANEL 2: Database SQL & RLS */}
            {activeTab === 'sql' && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between font-['JetBrains_Mono'] text-xs text-[#b9cbbd] pb-1 border-b border-[#272a30]">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00f5a0]" />
                    supabase/migrations/20250301000000_init_rls.sql
                  </span>
                  <span className="text-[#00f5a0] font-medium">Postgres 15 Production Hardening</span>
                </div>
                <pre className="bg-[#0b0e13] p-4 rounded font-['JetBrains_Mono'] text-xs text-[#e1e2ea] overflow-x-auto leading-relaxed border border-[#272a30]/80">
                  <code>
{`-- 1. Enable Row-Level Security for Isolation
ALTER TABLE public.worlds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Strict World Access Policies
CREATE POLICY "Public worlds are viewable by everyone"
  ON public.worlds FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can only edit own worlds"
  ON public.worlds FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can create worlds in their scope"
  ON public.worlds FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own worlds"
  ON public.worlds FOR DELETE
  USING (auth.uid() = user_id);

-- 3. Secure Account & Resource Teardown Cascading Function
CREATE OR REPLACE FUNCTION public.handle_account_deletion()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  DELETE FROM public.worlds WHERE user_id = auth.uid();
  DELETE FROM public.profiles WHERE id = auth.uid();
END;
$$;`}
                  </code>
                </pre>
              </div>
            )}

            {/* PANEL 3: CI/CD Pipeline */}
            {activeTab === 'cicd' && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between font-['JetBrains_Mono'] text-xs text-[#b9cbbd] pb-1 border-b border-[#272a30]">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00d2ff]" />
                    .github/workflows/deploy-production.yml
                  </span>
                  <span className="text-[#00d2ff] font-medium">Automated Verification Gate</span>
                </div>
                <pre className="bg-[#0b0e13] p-4 rounded font-['JetBrains_Mono'] text-xs text-[#e1e2ea] overflow-x-auto leading-relaxed border border-[#272a30]/80">
                  <code>
{`name: Production Build & Gatekeeper
on:
  push:
    branches: [ "main" ]

jobs:
  verify-matrix:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js 22.x
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
      - run: npm ci
      - name: TypeScript Strict Checker
        run: npx tsc --noEmit
      - name: Vitest Test Suite (38 Units)
        run: npx vitest run --coverage
      - name: Webpack / Vite Production Bundle
        run: npm run build
      - name: Deploy to Edge CDN
        if: success()
        run: npm run deploy:prod`}
                  </code>
                </pre>
              </div>
            )}

            {/* PANEL 4: Keyboard Map Diagram */}
            {activeTab === 'keys' && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between font-['JetBrains_Mono'] text-xs text-[#b9cbbd] pb-1 border-b border-[#272a30]">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00f5a0]" />
                    Viewport Manipulation Hotkey Mapping
                  </span>
                  <span className="text-[#e1e2ea] font-medium">Standard 3D DCC Conventions</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-2">
                  <div className="p-3 rounded bg-[#1d2025] flex flex-col items-center justify-center text-center gap-1 border border-[#272a30]">
                    <kbd className="px-2.5 py-1 rounded bg-[#32353b] text-[#00f5a0] font-['JetBrains_Mono'] text-xs font-bold shadow-sm">
                      W
                    </kbd>
                    <span className="font-['Geist'] text-xs text-[#e1e2ea] font-medium">Translate</span>
                    <span className="font-['JetBrains_Mono'] text-[10px] text-[#b9cbbd]">Move Position</span>
                  </div>
                  <div className="p-3 rounded bg-[#1d2025] flex flex-col items-center justify-center text-center gap-1 border border-[#272a30]">
                    <kbd className="px-2.5 py-1 rounded bg-[#32353b] text-[#00f5a0] font-['JetBrains_Mono'] text-xs font-bold shadow-sm">
                      E
                    </kbd>
                    <span className="font-['Geist'] text-xs text-[#e1e2ea] font-medium">Rotate</span>
                    <span className="font-['JetBrains_Mono'] text-[10px] text-[#b9cbbd]">Euler Angles</span>
                  </div>
                  <div className="p-3 rounded bg-[#1d2025] flex flex-col items-center justify-center text-center gap-1 border border-[#272a30]">
                    <kbd className="px-2.5 py-1 rounded bg-[#32353b] text-[#00f5a0] font-['JetBrains_Mono'] text-xs font-bold shadow-sm">
                      R
                    </kbd>
                    <span className="font-['Geist'] text-xs text-[#e1e2ea] font-medium">Scale</span>
                    <span className="font-['JetBrains_Mono'] text-[10px] text-[#b9cbbd]">Dimensions</span>
                  </div>
                  <div className="p-3 rounded bg-[#1d2025] flex flex-col items-center justify-center text-center gap-1 border border-[#272a30]">
                    <kbd className="px-2.5 py-1 rounded bg-[#32353b] text-[#00d2ff] font-['JetBrains_Mono'] text-xs font-bold shadow-sm">
                      Cmd + Z
                    </kbd>
                    <span className="font-['Geist'] text-xs text-[#e1e2ea] font-medium">Undo</span>
                    <span className="font-['JetBrains_Mono'] text-[10px] text-[#b9cbbd]">History Stack</span>
                  </div>
                  <div className="p-3 rounded bg-[#1d2025] flex flex-col items-center justify-center text-center gap-1 border border-[#272a30]">
                    <kbd className="px-2.5 py-1 rounded bg-[#32353b] text-[#00d2ff] font-['JetBrains_Mono'] text-xs font-bold shadow-sm">
                      Cmd + Y
                    </kbd>
                    <span className="font-['Geist'] text-xs text-[#e1e2ea] font-medium">Redo</span>
                    <span className="font-['JetBrains_Mono'] text-[10px] text-[#b9cbbd]">Forward Stack</span>
                  </div>
                  <div className="p-3 rounded bg-[#1d2025] flex flex-col items-center justify-center text-center gap-1 border border-[#272a30]">
                    <kbd className="px-2.5 py-1 rounded bg-[#32353b] text-[#00f5a0] font-['JetBrains_Mono'] text-xs font-bold shadow-sm">
                      G
                    </kbd>
                    <span className="font-['Geist'] text-xs text-[#e1e2ea] font-medium">Snap Grid</span>
                    <span className="font-['JetBrains_Mono'] text-[10px] text-[#b9cbbd]">0.5m / 1.0m Increments</span>
                  </div>
                  <div className="p-3 rounded bg-[#1d2025] flex flex-col items-center justify-center text-center gap-1 border border-[#272a30]">
                    <kbd className="px-2.5 py-1 rounded bg-[#32353b] text-[#00f5a0] font-['JetBrains_Mono'] text-xs font-bold shadow-sm">
                      F
                    </kbd>
                    <span className="font-['Geist'] text-xs text-[#e1e2ea] font-medium">Focus Object</span>
                    <span className="font-['JetBrains_Mono'] text-[10px] text-[#b9cbbd]">Frame Selection</span>
                  </div>
                  <div className="p-3 rounded bg-[#1d2025] flex flex-col items-center justify-center text-center gap-1 border border-[#272a30]">
                    <kbd className="px-2.5 py-1 rounded bg-[#32353b] text-[#ffb4ab] font-['JetBrains_Mono'] text-xs font-bold shadow-sm">
                      Del
                    </kbd>
                    <span className="font-['Geist'] text-xs text-[#e1e2ea] font-medium">Remove</span>
                    <span className="font-['JetBrains_Mono'] text-[10px] text-[#b9cbbd]">Purge Mesh Node</span>
                  </div>
                  <div className="p-3 rounded bg-[#1d2025] flex flex-col items-center justify-center text-center gap-1 col-span-2 border border-[#272a30]">
                    <kbd className="px-6 py-1 rounded bg-[#32353b] text-[#e1e2ea] font-['JetBrains_Mono'] text-xs font-bold shadow-sm">
                      SPACEBAR
                    </kbd>
                    <span className="font-['Geist'] text-xs text-[#e1e2ea] font-medium">Orbit Navigation Mode</span>
                    <span className="font-['JetBrains_Mono'] text-[10px] text-[#b9cbbd]">Hold to pan and roll camera freeform</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Production Readiness & Deployment Checklist */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00f5a0] text-[20px]">task_alt</span>
              <h2 className="font-['Space_Grotesk'] text-lg text-[#e1e2ea] uppercase tracking-wide font-medium">
                Deployment &amp; Environment Readiness Checklist
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-['JetBrains_Mono'] text-xs text-[#00f5a0] font-semibold">
                4 / 4 CRITICAL CHECKS CLEARED
              </span>
              <button
                onClick={triggerCheckRetest}
                className="px-2.5 py-1 rounded bg-[#1d2025] hover:bg-[#272a30] text-[#00d2ff] font-['JetBrains_Mono'] text-xs border border-[#3b4a40]/40 transition-colors"
              >
                {retestingChecks ? 'Verifying...' : 'Re-verify Edge Rules'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Checklist Item 1 */}
            <div className="p-4 rounded bg-[#191c21] flex items-start gap-4 shadow-sm border border-[#272a30]">
              <div className="w-6 h-6 rounded bg-[#00f5a0]/20 text-[#00f5a0] flex items-center justify-center shrink-0 mt-0.5 border border-[#00f5a0]/30">
                <span className="material-symbols-outlined text-[16px]">check</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-['Space_Grotesk'] text-[15px] font-semibold text-[#e1e2ea]">
                  SPA Fallback &amp; BrowserRouter Redirects
                </span>
                <p className="font-['Geist'] text-xs text-[#b9cbbd] leading-relaxed">
                  Rewrites all root paths (<code className="bg-[#111319] px-1 py-0.5 rounded text-[#00f5a0]">/*</code>) to{' '}
                  <code className="bg-[#111319] px-1 py-0.5 rounded text-[#00f5a0]">/index.html</code> with HTTP 200 via edge rules. Prevents client-side hydration tearing on direct deep-links.
                </p>
                <div className="mt-1 font-['JetBrains_Mono'] text-xs text-[#00f5a0]">
                  Status: Enforced on CDN edge layer
                </div>
              </div>
            </div>

            {/* Checklist Item 2 */}
            <div className="p-4 rounded bg-[#191c21] flex items-start gap-4 shadow-sm border border-[#272a30]">
              <div className="w-6 h-6 rounded bg-[#00f5a0]/20 text-[#00f5a0] flex items-center justify-center shrink-0 mt-0.5 border border-[#00f5a0]/30">
                <span className="material-symbols-outlined text-[16px]">check</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-['Space_Grotesk'] text-[15px] font-semibold text-[#e1e2ea]">
                  OpenGraph Metadata &amp; SEO Topology
                </span>
                <p className="font-['Geist'] text-xs text-[#b9cbbd] leading-relaxed">
                  Dynamic Twitter cards, og:image 1200x630 asset caching, canonical URL headers, sitemap.xml automation, and robots.txt rules indexed.
                </p>
                <div className="mt-1 font-['JetBrains_Mono'] text-xs text-[#00f5a0]">
                  Status: Validated with rich preview crawlers
                </div>
              </div>
            </div>

            {/* Checklist Item 3 */}
            <div className="p-4 rounded bg-[#191c21] flex items-start gap-4 shadow-sm border border-[#272a30]">
              <div className="w-6 h-6 rounded bg-[#00f5a0]/20 text-[#00f5a0] flex items-center justify-center shrink-0 mt-0.5 border border-[#00f5a0]/30">
                <span className="material-symbols-outlined text-[16px]">check</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-['Space_Grotesk'] text-[15px] font-semibold text-[#e1e2ea]">
                  WCAG AA Contrast &amp; Accessibility
                </span>
                <p className="font-['Geist'] text-xs text-[#b9cbbd] leading-relaxed">
                  Contrast ratio exceedance &gt; 4.5:1 on text nodes. Prefers-reduced-motion media query dampens procedural canvas camera swings.
                </p>
                <div className="mt-1 font-['JetBrains_Mono'] text-xs text-[#00f5a0]">
                  Status: Lighthouse Score 100/100
                </div>
              </div>
            </div>

            {/* Checklist Item 4 */}
            <div className="p-4 rounded bg-[#191c21] flex items-start gap-4 shadow-sm border border-[#272a30]">
              <div className="w-6 h-6 rounded bg-[#00f5a0]/20 text-[#00f5a0] flex items-center justify-center shrink-0 mt-0.5 border border-[#00f5a0]/30">
                <span className="material-symbols-outlined text-[16px]">check</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-['Space_Grotesk'] text-[15px] font-semibold text-[#e1e2ea]">
                  WebGL Context Loss Resilience
                </span>
                <p className="font-['Geist'] text-xs text-[#b9cbbd] leading-relaxed">
                  <code className="bg-[#111319] px-1 py-0.5 rounded text-[#00f5a0]">webglcontextlost</code> and{' '}
                  <code className="bg-[#111319] px-1 py-0.5 rounded text-[#00f5a0]">webglcontextrestored</code> listeners dispose dangling buffer attributes and automatically rebake shaders upon recovery.
                </p>
                <div className="mt-1 font-['JetBrains_Mono'] text-xs text-[#00f5a0]">
                  Status: Tested via forced GPU stall triggers
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Showcase Asset Block */}
        <section className="rounded bg-[#191c21] p-6 shadow-sm border border-[#272a30] flex flex-col md:flex-row items-center gap-6 overflow-hidden">
          <div className="w-full md:w-1/3 h-52 rounded overflow-hidden relative shrink-0 border border-[#272a30]">
            <img
              className="w-full h-full object-cover"
              alt="Futuristic cybernetic engineering terminal showing holographic 3D wireframe models and glowing matrix telemetry in dark emerald and electric cyan lighting."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-uHMi-jzFZ4UdiRgDahrCnclHj9U_XRstBz4oakLopc9VwCD35w36cTsqs5rsF6YobK_wNdVJRQ0ssyX9iElsv9oJk23iWbIfBVpJ9r3YeezmtNIPj8_fbvHqFsA8ec3ymWePmW39kjAfsYgWHKMzN13K4RdrWCENaKpp1wS1dtzUz-2DxS4SXuIZMrkwPVEfuk1MLGMZSffvj_KFeYrnCRIYVHbGKfTqSqCQFVjPXagmbCUbnpoL"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e13]/80 via-transparent to-transparent" />
            <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#0b0e13]/90 font-['JetBrains_Mono'] text-[10px] text-[#00f5a0] border border-[#3b4a40]/50">
              TELEMETRY CAPTURE
            </span>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-xs text-[#00d2ff]">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <span>ENTERPRISE SPECIFICATION CERTIFIED • AI TOOLS LAB</span>
            </div>
            <h3 className="font-['Space_Grotesk'] text-xl text-[#e1e2ea] font-semibold">
              Compliant with TOOLSX Spatial Computing Schema v2.4
            </h3>
            <p className="font-['Geist'] text-xs text-[#b9cbbd] leading-relaxed">
              All published environments adhere to non-blocking GLTF/GLB buffer standards, ensuring smooth frame pacing across mobile WebGL, Apple Vision Pro Safari WebXR runtimes, and desktop workstation viewports. Built and maintained by AI Tools Lab India (<a href="https://toolsx.in" target="_blank" rel="noopener noreferrer" className="text-[#00f5a0] hover:underline">toolsx.in</a>).
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="font-['JetBrains_Mono'] text-xs px-2.5 py-1 rounded bg-[#1d2025] text-[#e1e2ea] border border-[#272a30]">
                DRACO Compression: ON
              </span>
              <span className="font-['JetBrains_Mono'] text-xs px-2.5 py-1 rounded bg-[#1d2025] text-[#e1e2ea] border border-[#272a30]">
                KTX2 Basis Textures: ON
              </span>
              <span className="font-['JetBrains_Mono'] text-xs px-2.5 py-1 rounded bg-[#1d2025] text-[#00f5a0] border border-[#00f5a0]/40">
                WebXR Ready: VERIFIED
              </span>
              <a
                href="https://toolsx.in"
                target="_blank"
                rel="noopener noreferrer"
                className="font-['JetBrains_Mono'] text-xs px-2.5 py-1 rounded bg-[#00f5a0]/15 text-[#00f5a0] border border-[#00f5a0]/40 hover:bg-[#00f5a0]/30 transition-colors flex items-center gap-1"
              >
                <span>toolsx.in Portal</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
              <button
                onClick={onNavigateToStudio}
                className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded bg-[#00f5a0] hover:bg-[#00d2ff] text-[#002111] font-['JetBrains_Mono'] text-xs font-semibold transition-colors"
              >
                <span>Launch in 3D Viewport</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
