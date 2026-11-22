import React from 'react';

export const PrivacyScreen: React.FC = () => {
  return (
    <div className="w-full flex-1 flex flex-col bg-[#0b0e13]">
      <section className="px-6 py-10 bg-[#191c21] border-b border-[#272a30]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <span className="material-symbols-outlined text-[#00f5a0] text-[28px]">shield</span>
            <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#e1e2ea]">
              Privacy Policy
            </h1>
          </div>
          <p className="font-['JetBrains_Mono'] text-xs text-[#849588]">
            Last updated: October 20, 2026 • Published by AI Tools Lab India (toolsx.in)
          </p>
        </div>
      </section>

      <div className="w-full px-6 py-10 max-w-4xl mx-auto flex-1 font-['Geist'] text-sm text-[#b9cbbd] space-y-8 leading-relaxed">
        {/* Banner */}
        <div className="p-4 rounded bg-[#111319] border border-[#00f5a0]/40 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#00f5a0] text-[24px]">verified</span>
            <div>
              <span className="font-['Space_Grotesk'] text-sm font-semibold text-[#e1e2ea] block">
                Local-First Privacy Architecture
              </span>
              <span className="text-xs text-[#b9cbbd]">
                TOOLSX stores your world scenes and credentials directly in your browser.
              </span>
            </div>
          </div>
          <a
            href="https://toolsx.in"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded bg-[#00f5a0] text-[#002111] font-['JetBrains_Mono'] text-xs font-semibold shrink-0 hover:bg-[#00d2ff]"
          >
            Visit toolsx.in
          </a>
        </div>

        <section className="space-y-3">
          <h2 className="font-['Space_Grotesk'] text-xl font-semibold text-[#e1e2ea]">1. Overview</h2>
          <p>
            At <strong>TOOLSX</strong> (operated by AI Tools Lab India, accessible at{' '}
            <a href="https://toolsx.in" className="text-[#00f5a0] hover:underline" target="_blank" rel="noopener noreferrer">
              toolsx.in
            </a>
            ), privacy is our founding principle. This application operates as a client-side WebGL2 spatial computing engine.
            We do not operate backend servers that collect, profile, or sell your private personal data.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-['Space_Grotesk'] text-xl font-semibold text-[#e1e2ea]">2. Data Storage (Local First)</h2>
          <p>
            All world projects, scene graph AST snapshots, customized shaders, and browser-based login credentials
            are stored strictly on your local device using your browser's <code>localStorage</code> and <code>IndexedDB</code> APIs.
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs font-['JetBrains_Mono'] text-[#e1e2ea]">
            <li>Scene objects, meshes, and textures reside in your browser's persistent sandbox.</li>
            <li>Browser-based account profiles are verified locally and never sent to third-party ad networks.</li>
            <li>Data never leaves your machine unless you explicitly export JSON or share models.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-['Space_Grotesk'] text-xl font-semibold text-[#e1e2ea]">3. What We Do NOT Collect</h2>
          <div className="p-4 rounded bg-[#191c21] border border-[#272a30] space-y-2 text-xs">
            <p className="flex items-center gap-2 text-[#ffb4ab]">
              <span className="material-symbols-outlined text-[16px]">close</span>
              No tracking cookies or surveillance pixels.
            </p>
            <p className="flex items-center gap-2 text-[#ffb4ab]">
              <span className="material-symbols-outlined text-[16px]">close</span>
              No unauthorized personal telemetry or screen recordings.
            </p>
            <p className="flex items-center gap-2 text-[#ffb4ab]">
              <span className="material-symbols-outlined text-[16px]">close</span>
              No selling or renting of creator email addresses.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-['Space_Grotesk'] text-xl font-semibold text-[#e1e2ea]">4. Your Rights &amp; Data Control</h2>
          <p>
            You have total control over your work:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li><strong>Full Data Export:</strong> Use the Export button to save all your 3D scenes as standard JSON or GLTF at any time.</li>
            <li><strong>Immediate Deletion:</strong> Clearing your browser cache or using the in-app delete buttons purges data instantly.</li>
          </ul>
        </section>

        <section className="space-y-3 border-t border-[#272a30] pt-6">
          <h2 className="font-['Space_Grotesk'] text-xl font-semibold text-[#e1e2ea]">5. Contact &amp; Governance</h2>
          <p>
            If you have questions about our privacy architecture, contact the core team:
          </p>
          <div className="p-4 rounded bg-[#191c21] border border-[#272a30] font-['JetBrains_Mono'] text-xs space-y-1 text-[#e1e2ea]">
            <p><strong>Organization:</strong> AI Tools Lab India</p>
            <p>
              <strong>Email:</strong>{' '}
              <a href="mailto:aitoolslabindia@gmail.com" className="text-[#00f5a0] hover:underline">
                aitoolslabindia@gmail.com
              </a>
            </p>
            <p>
              <strong>Official Website:</strong>{' '}
              <a href="https://toolsx.in" target="_blank" rel="noopener noreferrer" className="text-[#00d2ff] hover:underline">
                https://toolsx.in
              </a>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
