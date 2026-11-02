import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { UserRole } from '../types/index.ts';
import { X, Sprout, Shield, UserCheck, AlertCircle, Check } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    register,
    allDemoUsers,
    switchAccount,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('farmer');
  const [phone, setPhone] = useState('+254 7');
  const [location, setLocation] = useState('Nakuru, Kenya');
  const [farmName, setFarmName] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      if (authModalMode === 'login') {
        await login(email, password);
      } else if (authModalMode === 'register') {
        await register({
          name,
          email,
          role,
          phone,
          location,
          farmName: role === 'farmer' ? farmName || `${name}'s Farm` : undefined,
        });
      } else if (authModalMode === 'forgot') {
        const res = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        setSuccessMsg(data.message || `Password reset instructions dispatched to ${email}`);
      }
    } catch (err: any) {
      setError(err.message || 'Operation failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200">
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-stone-100 text-stone-500"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center">
            <Sprout className="w-4 h-4 text-emerald-200" />
          </div>
          <span className="font-display font-bold text-lg text-emerald-950">Farmers Hub</span>
        </div>

        <h3 className="text-xl font-bold font-display text-stone-900 mb-1">
          {authModalMode === 'login' && 'Sign in to your account'}
          {authModalMode === 'register' && 'Create your Hub profile'}
          {authModalMode === 'forgot' && 'Reset account password'}
        </h3>
        <p className="text-xs text-stone-500 mb-6">
          {authModalMode === 'login' && 'Access farm management, market orders, and agronomy advice.'}
          {authModalMode === 'register' && 'Select your role to connect with farmers, buyers, and experts.'}
          {authModalMode === 'forgot' && 'Enter your registered email to receive a recovery passkey.'}
        </p>

        {/* 1-Click Fast-Switch Role Tester */}
        {authModalMode === 'login' && (
          <div className="mb-6 p-3 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-[11px] font-semibold text-stone-600 block mb-2">
              Instant 1-Click Demo Profiles:
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {allDemoUsers.map((u) => (
                <button
                  type="button"
                  key={u.id}
                  onClick={() => {
                    switchAccount(u.role);
                    setIsAuthModalOpen(false);
                  }}
                  className="px-2.5 py-1.5 text-left rounded-md border border-stone-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 text-stone-700 transition-colors flex items-center justify-between"
                >
                  <span className="font-semibold capitalize truncate">{u.role}</span>
                  <span className="text-[10px] text-stone-400">Login →</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-emerald-700" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {authModalMode === 'register' && (
            <>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kiprono Korir"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Account Role *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                >
                  <option value="farmer">Farmer (Produce Producer)</option>
                  <option value="buyer">Produce Buyer (Wholesale / Retailer)</option>
                  <option value="supplier">Agricultural Supplier (Inputs & Agrovet)</option>
                  <option value="expert">Agricultural Expert (Agronomist & Researcher)</option>
                  <option value="admin">Administrator (Platform Management)</option>
                </select>
              </div>

              {role === 'farmer' && (
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Farm / Holding Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Mount Elgon Green Estate"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">County / Sub-County</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Email Address *</label>
            <input
              type="email"
              required
              placeholder="name@example.co.ke"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          {authModalMode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-stone-700">Password</label>
                {authModalMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setAuthModalMode('forgot')}
                    className="text-[11px] text-emerald-800 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 disabled:bg-stone-300 text-white font-semibold rounded-lg shadow-sm transition-colors mt-2"
          >
            {isLoading
              ? 'Please wait...'
              : authModalMode === 'login'
              ? 'Sign In'
              : authModalMode === 'register'
              ? 'Complete Registration'
              : 'Dispatch Recovery Link'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-stone-100 text-center text-xs text-stone-600">
          {authModalMode === 'login' ? (
            <p>
              Don't have an account yet?{' '}
              <button
                onClick={() => setAuthModalMode('register')}
                className="font-bold text-emerald-800 hover:underline"
              >
                Register free
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                onClick={() => setAuthModalMode('login')}
                className="font-bold text-emerald-800 hover:underline"
              >
                Sign in here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
