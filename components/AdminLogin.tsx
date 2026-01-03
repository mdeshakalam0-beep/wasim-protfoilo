
import React, { useState } from 'react';

interface AdminLoginProps {
  onClose: () => void;
  onLoginSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === '@#work786#@') {
      setMessage({ type: 'success', text: 'Verified. Redirecting...' });
      setTimeout(() => {
        onLoginSuccess();
      }, 800);
    } else {
      setMessage({ type: 'error', text: 'Access Denied.' });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-6">
      <div className="bg-white/10 backdrop-blur-xl w-full max-w-md rounded-[2rem] shadow-2xl p-10 border border-white/20 animate-in fade-in zoom-in duration-300 relative overflow-hidden text-white">
        
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-indigo-500 rounded-full blur-[80px] opacity-40 pointer-events-none"></div>

        <div className="flex justify-between items-center mb-10 relative z-10">
          <div>
            <h3 className="text-2xl font-black tracking-tight">System Login</h3>
            <p className="text-slate-400 text-sm mt-1">Authorized personnel only</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {message && (
          <div className={`p-4 rounded-xl mb-6 text-sm font-bold text-center animate-pulse ${message.type === 'success' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5 relative z-10">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-5 py-4 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-black/40 text-white transition-all placeholder-slate-600"
              placeholder="Enter ID"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-black/40 text-white transition-all placeholder-slate-600"
              placeholder="••••••••"
              required
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 active:scale-95 mt-4"
          >
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
