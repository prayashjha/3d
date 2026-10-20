import React from 'react';

export const TermsScreen: React.FC = () => {
  return (
    <div className="w-full flex-1 flex flex-col bg-[#0b0e13]">
      <section className="px-6 py-10 bg-[#191c21] border-b border-[#272a30]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <span className="material-symbols-outlined text-[#00d2ff] text-[28px]">description</span>
            <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#e1e2ea]">
              Terms and Conditions of Use
            </h1>
          </div>
          <p className="font-['JetBrains_Mono'] text-xs text-[#849588]">
            Effective Date: October 20, 2026 • AI Tools Lab India (toolsx.in)
          </p>
        </div>
      </section>

      <div className="w-full px-6 py-10 max-w-4xl mx-auto flex-1 font-['Geist'] text-sm text-[#b9cbbd] space-y-8 leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-['Space_Grotesk'] text-xl font-semibold text-[#e1e2ea]">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing and utilizing <strong>TOOLSX</strong> (a spatial computing engine by AI Tools Lab India, hosted at{' '}
            <a href="https://toolsx.in" target="_blank" rel="noopener noreferrer" className="text-[#00f5a0] hover:underline">
              toolsx.in
            </a>
            ), you agree to comply with and be bound by these Terms and Conditions. If you disagree with any portion of these terms, please discontinue using the service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-['Space_Grotesk'] text-xl font-semibold text-[#e1e2ea]">
            2. Nature of the Spatial Engine
          </h2>
          <p>
            TOOLSX is a client-side WebGL2 application that allows users to design, assemble, simulate, and export 3D spatial scenes.
            Because the application executes within your client browser, all operational data is stored on your local machine.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-['Space_Grotesk'] text-xl font-semibold text-[#e1e2ea]">
            3. Intellectual Property &amp; Content Ownership
          </h2>
          <p>
            <strong>You own 100% of your creations.</strong> Any 3D scenes, custom geometries, material configurations,
            or exported JSON AST graphs created by you remain your sole property. AI Tools Lab India claims no copyright
            over user-generated spatial environments.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-['Space_Grotesk'] text-xl font-semibold text-[#e1e2ea]">
            4. User Responsibility for Backups
          </h2>
          <p>
            Since all data is saved locally via browser storage mechanisms, clearing your browser cookies, local storage,
            or operating system cache may delete your local worlds. You are solely responsible for periodically downloading
            or exporting copies of your projects via the built-in JSON / GLTF Export functionality.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-['Space_Grotesk'] text-xl font-semibold text-[#e1e2ea]">
            5. Disclaimers &amp; Limitation of Liability
          </h2>
          <p>
            The software is provided &quot;AS IS&quot;, without warranty of any kind, express or implied.
            In no event shall AI Tools Lab India or its developers be liable for any claim, damages, or hardware GPU context loss
            arising from the use of 3D shaders or WebGL render loops.
          </p>
        </section>

        <section className="space-y-3 border-t border-[#272a30] pt-6">
          <h2 className="font-['Space_Grotesk'] text-xl font-semibold text-[#e1e2ea]">
            6. Inquiries &amp; Official Contact
          </h2>
          <div className="p-4 rounded bg-[#191c21] border border-[#272a30] font-['JetBrains_Mono'] text-xs space-y-1 text-[#e1e2ea]">
            <p><strong>Service:</strong> TOOLSX by AI Tools Lab India</p>
            <p>
              <strong>Email:</strong>{' '}
              <a href="mailto:aitoolslabindia@gmail.com" className="text-[#00f5a0] hover:underline">
                aitoolslabindia@gmail.com
              </a>
            </p>
            <p>
              <strong>Website:</strong>{' '}
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
