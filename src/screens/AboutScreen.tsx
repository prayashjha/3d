import React, { useState } from 'react';

interface AboutScreenProps {
  onNavigateToStudio: () => void;
  onOpenLogin: () => void;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({ onNavigateToStudio, onOpenLogin }) => {
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactName, setContactName] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage.trim()) return;
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackSent(false);
      setContactSubject('');
      setContactMessage('');
      setContactName('');
    }, 4000);
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-[#0b0e13]">
      {/* Hero Section */}
      <section className="relative px-6 py-12 bg-[#191c21] border-b border-[#272a30] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00f5a0]/10 via-[#00d2ff]/5 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-wrap items-center gap-2 font-['JetBrains_Mono'] text-xs text-[#00f5a0] uppercase mb-3">
            <span className="w-2 h-2 rounded-full bg-[#00f5a0] animate-pulse" />
            <span>AI TOOLS LAB INDIA • SPATIAL 3D ENGINE</span>
          </div>

          <h1 className="font-['Space_Grotesk'] text-3xl md:text-5xl font-bold text-[#e1e2ea] tracking-tight">
            About <span className="text-[#00f5a0]">TOOLSX</span>
          </h1>

          <p className="font-['Geist'] text-base md:text-lg text-[#b9cbbd] max-w-3xl mt-3 leading-relaxed">
            TOOLSX is a next-generation browser-based spatial computing and 3D world creation platform.
            Created by <strong className="text-[#e1e2ea]">AI Tools Lab India</strong>, our mission is to empower developers,
            architects, and creative builders to craft interactive 3D spaces with absolute data privacy and zero vendor lock-in.
          </p>

          {/* Official Website Banner Callout */}
          <div className="mt-8 p-5 rounded-lg bg-[#111319] border border-[#00f5a0]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#00f5a0]/20 text-[#00f5a0] flex items-center justify-center shrink-0 border border-[#00f5a0]/30">
                <span className="material-symbols-outlined text-[24px]">language</span>
              </div>
              <div>
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#00d2ff] uppercase tracking-wider block">
                  Official Web Portal
                </span>
                <span className="font-['Space_Grotesk'] text-lg font-bold text-[#e1e2ea]">
                  Visit our official website: <span className="text-[#00f5a0]">toolsx.in</span>
                </span>
                <p className="font-['Geist'] text-xs text-[#b9cbbd]">
                  Discover our full suite of AI tools, world templates, and developer SDKs.
                </p>
              </div>
            </div>

            <a
              href="https://toolsx.in"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded bg-[#00f5a0] hover:bg-[#00d2ff] text-[#002111] font-['JetBrains_Mono'] text-xs uppercase font-bold tracking-wider transition-all flex items-center gap-2 shadow-[0_0_16px_rgba(0,245,160,0.3)] shrink-0"
            >
              <span>Visit toolsx.in</span>
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="w-full px-6 py-10 max-w-6xl mx-auto flex-1 flex flex-col gap-10">
        {/* Core Pillars */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded bg-[#191c21] border border-[#272a30] flex flex-col gap-3 shadow-md">
            <div className="w-10 h-10 rounded bg-[#1d2025] text-[#00f5a0] flex items-center justify-center border border-[#3b4a40]/30">
              <span className="material-symbols-outlined text-[22px]">lock</span>
            </div>
            <h3 className="font-['Space_Grotesk'] text-lg font-semibold text-[#e1e2ea]">
              Browser-First &amp; Local Storage
            </h3>
            <p className="font-['Geist'] text-xs text-[#b9cbbd] leading-relaxed">
              Your 3D worlds, custom shaders, and profile credentials stay strictly in your browser.
              We prioritize user ownership through IndexedDB and localStorage so you can work completely offline.
            </p>
          </div>

          <div className="p-6 rounded bg-[#191c21] border border-[#272a30] flex flex-col gap-3 shadow-md">
            <div className="w-10 h-10 rounded bg-[#1d2025] text-[#00d2ff] flex items-center justify-center border border-[#3b4a40]/30">
              <span className="material-symbols-outlined text-[22px]">deployed_code</span>
            </div>
            <h3 className="font-['Space_Grotesk'] text-lg font-semibold text-[#e1e2ea]">
              Real-Time WebGL2 Graphics
            </h3>
            <p className="font-['Geist'] text-xs text-[#b9cbbd] leading-relaxed">
              Powered by Three.js and accelerated WebGL2 context, delivering 60 FPS frame pacing,
              PBR standard materials, bloom post-processing, and interactive DCC transform gizmos.
            </p>
          </div>

          <div className="p-6 rounded bg-[#191c21] border border-[#272a30] flex flex-col gap-3 shadow-md">
            <div className="w-10 h-10 rounded bg-[#1d2025] text-[#50ffaf] flex items-center justify-center border border-[#3b4a40]/30">
              <span className="material-symbols-outlined text-[22px]">auto_awesome</span>
            </div>
            <h3 className="font-['Space_Grotesk'] text-lg font-semibold text-[#e1e2ea]">
              AI 3D Scene Synthesis
            </h3>
            <p className="font-['Geist'] text-xs text-[#b9cbbd] leading-relaxed">
              Generate full 3D topological scene graph structures with natural language prompts.
              Export clean SceneGraph AST JSON or Draco-compressed GLTF assets at any time.
            </p>
          </div>
        </section>

        {/* Business & Contact Information Block */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Details Card */}
          <div className="p-6 rounded bg-[#191c21] border border-[#272a30] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00f5a0] text-[20px]">contact_mail</span>
                <h2 className="font-['Space_Grotesk'] text-xl font-semibold text-[#e1e2ea]">
                  Official Contact Details
                </h2>
              </div>
              <p className="font-['Geist'] text-xs text-[#b9cbbd] leading-relaxed">
                Have questions, partnership inquiries, or need custom 3D spatial development for your enterprise?
                Get in touch directly with the TOOLSX core team.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 p-3 rounded bg-[#111319] border border-[#272a30]">
                  <span className="material-symbols-outlined text-[#00d2ff] text-[20px] mt-0.5">mail</span>
                  <div>
                    <span className="font-['JetBrains_Mono'] text-[10px] text-[#849588] block uppercase">
                      Official Email Support
                    </span>
                    <a
                      href="mailto:aitoolslabindia@gmail.com"
                      className="font-['JetBrains_Mono'] text-xs font-semibold text-[#00f5a0] hover:underline"
                    >
                      aitoolslabindia@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded bg-[#111319] border border-[#272a30]">
                  <span className="material-symbols-outlined text-[#00f5a0] text-[20px] mt-0.5">globe</span>
                  <div>
                    <span className="font-['JetBrains_Mono'] text-[10px] text-[#849588] block uppercase">
                      Official Web Domain
                    </span>
                    <a
                      href="https://toolsx.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-['JetBrains_Mono'] text-xs font-semibold text-[#e1e2ea] hover:text-[#00f5a0] transition-colors"
                    >
                      https://toolsx.in
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded bg-[#111319] border border-[#272a30]">
                  <span className="material-symbols-outlined text-[#50ffaf] text-[20px] mt-0.5">badge</span>
                  <div>
                    <span className="font-['JetBrains_Mono'] text-[10px] text-[#849588] block uppercase">
                      Organization
                    </span>
                    <span className="font-['Geist'] text-xs text-[#e1e2ea]">
                      AI Tools Lab India • Creator of TOOLSX
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#272a30] flex flex-wrap items-center gap-3">
              <button
                onClick={onNavigateToStudio}
                className="px-4 py-2 rounded bg-[#00f5a0] hover:bg-[#00d2ff] text-[#002111] font-['JetBrains_Mono'] text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                <span>Launch 3D Studio</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
              <button
                onClick={onOpenLogin}
                className="px-4 py-2 rounded bg-[#272a30] hover:bg-[#32353b] text-[#e1e2ea] font-['JetBrains_Mono'] text-xs transition-colors"
              >
                Browser Account / Login
              </button>
            </div>
          </div>

          {/* Quick Contact Form */}
          <div className="p-6 rounded bg-[#191c21] border border-[#272a30] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-[#00d2ff] text-[20px]">send</span>
                <h3 className="font-['Space_Grotesk'] text-lg font-semibold text-[#e1e2ea]">
                  Send Message to AI Tools Lab
                </h3>
              </div>
              <p className="font-['Geist'] text-xs text-[#b9cbbd] mb-4">
                Leave feedback or propose a feature directly. We respond within 24 hours.
              </p>

              {feedbackSent ? (
                <div className="p-4 rounded bg-[#00f5a0]/15 border border-[#00f5a0] text-[#00f5a0] font-['JetBrains_Mono'] text-xs flex items-center gap-3">
                  <span className="material-symbols-outlined text-[24px]">task_alt</span>
                  <div>
                    <p className="font-bold">Message Dispatched!</p>
                    <p className="text-[11px] text-[#b9cbbd]">Thank you for reaching out to toolsx.in support.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitContact} className="space-y-3 font-['JetBrains_Mono'] text-xs">
                  <div>
                    <label className="text-[10px] text-[#849588] uppercase block mb-1">Your Name / Handle</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-[#111319] border border-[#272a30] text-[#e1e2ea] focus:outline-none focus:border-[#00f5a0]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#849588] uppercase block mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 3D Scene Export or Integration"
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-[#111319] border border-[#272a30] text-[#e1e2ea] focus:outline-none focus:border-[#00f5a0]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#849588] uppercase block mb-1">Message</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Tell us what you are building..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-[#111319] border border-[#272a30] text-[#e1e2ea] focus:outline-none focus:border-[#00f5a0]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded bg-[#00f5a0] hover:bg-[#00d2ff] text-[#002111] font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
                  >
                    Submit Feedback (Direct to aitoolslabindia@gmail.com)
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
