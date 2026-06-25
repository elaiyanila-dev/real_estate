import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import AuthShell from '../components/AuthShell.jsx';

export default function CustomerLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const message = location.state?.message || 
    (location.search.includes('verified=1') ? 'Email verified successfully. Sign in to continue.' : '');

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({
        email,
        password,
        role: 'customer',
        remember
      });
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Customer Login"
      subtitle="Sign in to save homes, send enquiries, and manage your profile."
      footer={
        <div className="space-y-2 text-center text-sm text-[#6B7280]">
          <p>
            New here?{' '}
            <Link to="/register" className="font-bold text-[#0F766E]">
              Create a customer account
            </Link>
          </p>
          <p>
            Broker?{' '}
            <Link to="/broker/login" className="font-bold text-[#0F766E]">
              Sign in as a broker
            </Link>
          </p>
        </div>
      }
    >
      {message && <Notice tone="success">{message}</Notice>}
      {error && <Notice tone="error">{error}</Notice>}

      <div className="flex min-h-screen items-center justify-center bg-[#FAF9F6] px-4 py-10">
        <div className="w-full max-w-sm">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#6B7280] hover:text-[#0F766E]"
          >
            <ArrowLeft size={16} /> Back to Home
          </Link>

          <div className="surface rounded-3xl p-8">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-extrabold text-[#1F2937]">Welcome back</h1>
              <p className="mt-2 text-sm text-[#6B7280]">
                Sign in to access your dashboard and saved properties
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <label className="block text-sm font-bold text-[#1F2937]">
                Email Address
                <div className="relative mt-2">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0F766E]" />
                  <input
                    className="input-field pl-11"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </label>

              <label className="block text-sm font-bold text-[#1F2937]">
                Password
                <div className="relative mt-2">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0F766E]" />
                  <input
                    className="input-field pl-11 pr-11"
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#0F766E]"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-[#6B7280]">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="accent-[#0F766E]"
                  />
                  Remember me
                </label>
                <Link to="/forgot-password" className="font-bold text-[#0F766E]">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full rounded-2xl py-3 font-bold disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#6B7280]">
              New to ALAYAA?{' '}
              <Link to="/register" className="font-bold text-[#0F766E]">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthShell>
  );
}

// ─── Helper Components ─────────────────────────────────────────────────────

function Notice({ tone, children }) {
  return (
    <div
      className={`mb-4 rounded-2xl px-4 py-3 text-sm font-semibold ${
        tone === 'success'
          ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
          : 'border border-rose-200 bg-rose-50 text-rose-600'
      }`}
    >
      {children}
    </div>
  );
}