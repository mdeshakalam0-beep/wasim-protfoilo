import React, { useState } from 'react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onClose: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === '@#work786#@') {
      onLoginSuccess();
    } else {
      setError('Invalid username or password.');
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
            className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
            aria-label="Close Login"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleLogin} className="relative z-10 space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-6 py-4 font-medium text-white focus:ring-2 focus:ring-indigo-500 placeholder-slate-500"
              placeholder="admin"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-6 py-4 font-medium text-white focus:ring-2 focus:ring-indigo-500 placeholder-slate-500"
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button 
            type="submit" 
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30 active:scale-95"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;