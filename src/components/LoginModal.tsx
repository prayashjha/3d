import React, { useState } from 'react';
import { AuthUser, loginUser, signupUser, quickGuestLogin } from '../utils/browserAuth';
import confetti from 'canvas-confetti';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('aitoolslabindia@gmail.com');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [avatarColor, setAvatarColor] = useState('#00f5a0');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f5a0', '#00d2ff', '#50ffaf'],
      });
    } catch {
      // ignore
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await loginUser(email, password);
    setLoading(false);

    if (res.success && res.user) {
      triggerConfetti();
      setSuccessMsg(`Welcome back, ${res.user.displayName}!`);
      setTimeout(() => {
        onLoginSuccess(res.user!);
        onClose();
      }, 700);
    } else {
      setError(res.error || 'Login failed. Please check your credentials or use 1-Click Guest Access.');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password || !displayName.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    const res = await signupUser(email, password, displayName, username, avatarColor);
    setLoading(false);

    if (res.success && res.user) {
      triggerConfetti();
      setSuccessMsg(`Account created for ${res.user.displayName}!`);
      setTimeout(() => {
        onLoginSuccess(res.user!);
        onClose();
      }, 700);
    } else {
      setError(res.error || 'Failed to create account.');
    }
  };

  const handleGuestLogin = () => {
    const user = quickGuestLogin();
    triggerConfetti();
    setSuccessMsg('Logged in as Guest Architect!');
    setTimeout(() => {
      onLoginSuccess(user);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0b0e13]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded bg-[#191c21] border border-[#272a30] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[#272a30] flex items-center justify-between bg-[#1d2025]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00f5a0] text-[20px]">account_circle</span>
            <div>
              <h3 className="font-['Space_Grotesk'] text-base font-semibold text-[#e1e2ea]">
                TOOLSX Browser Account
              </h3>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#00d2ff]">
                Local-First • toolsx.in
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-[#849588] hover:text-[#e1e2ea]">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#272a30] bg-[#111319]">
          <button
            onClick={() => {
              setTab('login');
              setError('');
            }}
            className={`flex-1 py-2.5 text-xs font-['JetBrains_Mono'] font-medium transition-colors ${
              tab === 'login'
                ? 'bg-[#191c21] text-[#00f5a0] border-b-2 border-[#00f5a0]'
                : 'text-[#849588] hover:text-[#e1e2ea]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setTab('signup');
              setError('');
            }}
            className={`flex-1 py-2.5 text-xs font-['JetBrains_Mono'] font-medium transition-colors ${
              tab === 'signup'
                ? 'bg-[#191c21] text-[#00f5a0] border-b-2 border-[#00f5a0]'
                : 'text-[#849588] hover:text-[#e1e2ea]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded bg-[#ffb4ab]/10 border border-[#ffb4ab]/40 text-[#ffb4ab] text-xs font-['JetBrains_Mono'] flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">error</span>
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded bg-[#00f5a0]/10 border border-[#00f5a0]/40 text-[#00f5a0] text-xs font-['JetBrains_Mono'] flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>{successMsg}</span>
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4 font-['JetBrains_Mono'] text-xs">
              <div>
                <label className="text-[10px] uppercase text-[#849588] block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. aitoolslabindia@gmail.com"
                  className="w-full px-3 py-2 rounded bg-[#111319] border border-[#272a30] text-[#e1e2ea] focus:outline-none focus:border-[#00f5a0]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase text-[#849588] block mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password (optional for demo)"
                  className="w-full px-3 py-2 rounded bg-[#111319] border border-[#272a30] text-[#e1e2ea] focus:outline-none focus:border-[#00f5a0]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded bg-[#00f5a0] hover:bg-[#00d2ff] text-[#002111] font-bold uppercase tracking-wider text-xs transition-all shadow-[0_0_12px_rgba(0,245,160,0.25)]"
              >
                {loading ? 'Authenticating...' : 'Sign In to TOOLSX'}
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-[#272a30]" />
                <span className="flex-shrink mx-2 text-[10px] text-[#849588] uppercase">or</span>
                <div className="flex-grow border-t border-[#272a30]" />
              </div>

              <button
                type="button"
                onClick={handleGuestLogin}
                className="w-full py-2 rounded bg-[#1d2025] hover:bg-[#272a30] text-[#00d2ff] border border-[#3b4a40]/40 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">bolt</span>
                <span>1-Click Instant Guest Access</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-3 font-['JetBrains_Mono'] text-xs">
              <div>
                <label className="text-[10px] uppercase text-[#849588] block mb-1">Display Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elena Rostova"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#111319] border border-[#272a30] text-[#e1e2ea] focus:outline-none focus:border-[#00f5a0]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase text-[#849588] block mb-1">Username / Handle</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. elena_3d"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#111319] border border-[#272a30] text-[#e1e2ea] focus:outline-none focus:border-[#00f5a0]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase text-[#849588] block mb-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#111319] border border-[#272a30] text-[#e1e2ea] focus:outline-none focus:border-[#00f5a0]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase text-[#849588] block mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#111319] border border-[#272a30] text-[#e1e2ea] focus:outline-none focus:border-[#00f5a0]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase text-[#849588] block mb-1">Avatar Theme Color</label>
                <div className="flex items-center gap-3">
                  {['#00f5a0', '#00d2ff', '#50ffaf', '#d6baff', '#ffb4ab'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setAvatarColor(c)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${
                        avatarColor === c ? 'scale-125 border-white' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 rounded bg-[#00f5a0] hover:bg-[#00d2ff] text-[#002111] font-bold uppercase tracking-wider text-xs transition-all shadow-[0_0_12px_rgba(0,245,160,0.25)]"
              >
                {loading ? 'Creating...' : 'Register Local Browser Account'}
              </button>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#111319] border-t border-[#272a30] text-[10px] text-[#849588] font-['JetBrains_Mono'] text-center">
          Privacy-First: Data stays in your browser IndexedDB • Visit{' '}
          <a href="https://toolsx.in" target="_blank" rel="noopener noreferrer" className="text-[#00f5a0] hover:underline">
            toolsx.in
          </a>
        </div>
      </div>
    </div>
  );
};
