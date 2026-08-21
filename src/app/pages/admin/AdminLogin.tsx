import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Zap, Eye, EyeOff, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function AdminLogin() {
  const { adminLogin } = useApp();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const ok = adminLogin(password);
    setLoading(false);
    if (ok) {
      navigate('/admin/dashboard');
    } else {
      setError('Password salah. Coba lagi.');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Zap className="w-6 h-6 text-black" strokeWidth={2.5} />
          </div>
          <h1 className="text-white font-bold text-xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Zeroth<span className="text-amber-500">Store</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Admin Panel</p>
        </div>

        <div className="bg-[#1C1C1C] rounded-2xl p-7 border border-gray-800">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-4 h-4 text-gray-500" />
            <h2 className="text-white font-semibold">Login Admin</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Masukkan password admin"
                  className="w-full bg-[#0A0A0A] border border-gray-700 text-white rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder-gray-600 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-800 text-red-400 text-sm px-4 py-2.5 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold py-3 rounded-xl transition-colors"
            >
              {loading ? 'Memverifikasi...' : 'Masuk'}
            </button>
          </form>

          <div className="mt-4 p-3 bg-gray-800/50 rounded-xl">
            <p className="text-gray-500 text-xs text-center">
              Demo password: <code className="text-amber-400">zeroth2026</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
