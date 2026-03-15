import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Bot, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.errMessage || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell flex min-h-screen flex-col overflow-hidden">
      <div className="noise-overlay" />

      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-10">

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="pointer-events-none absolute inset-0"
      >
        <motion.div
          animate={{ x: [0, 20, -12, 0], y: [0, 18, -10, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-[8%] top-[12%] h-72 w-72 rounded-full bg-white/8 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -24, 10, 0], y: [0, -10, 20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[8%] right-[10%] h-96 w-96 rounded-full bg-white/6 blur-3xl"
        />
      </motion.div>

      <div className="relative grid w-full max-w-6xl overflow-hidden rounded-[40px] border border-white/10 bg-black/70 shadow-[0_50px_140px_rgba(0,0,0,0.65)] backdrop-blur-2xl lg:grid-cols-[1.1fr_0.9fr]">
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mesh-panel relative flex min-h-[320px] flex-col justify-between border-b border-white/10 p-8 sm:p-10 lg:border-b-0 lg:border-r"
        >
          <div>
            <div className="mb-10 flex h-16 w-16 items-center justify-center rounded-[26px] border border-white/10 bg-white text-black">
              <Bot className="h-8 w-8" />
            </div>
            <p className="section-kicker">Monochrome command center</p>
            <h1 className="mt-4 max-w-lg font-display text-5xl leading-[0.95] tracking-[0.05em] text-white sm:text-6xl">
              Monitor every workflow from a cleaner surface.
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-zinc-400">
              Secure sign-in, live system visibility, and a dashboard rebuilt around contrast, rhythm, and motion.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ['24/7', 'automations live'],
              ['Fast', 'logs and metrics'],
              ['Secure', 'protected accounts and tokens'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-3xl border border-white/8 bg-white/5 p-4">
                <p className="font-display text-4xl text-white">{value}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.28em] text-zinc-500">{label}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center p-6 sm:p-10"
        >
          <Card className="w-full border-white/10 bg-white/[0.03] p-0">
            <CardHeader className="p-8 pb-2">
              <p className="section-kicker">Welcome Back</p>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Access your automation workspace and resume where the system left off.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-8 pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-3xl border border-white/12 bg-white/7 p-4 text-sm text-zinc-300">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="section-kicker block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="section-kicker block">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              <ArrowRight className="h-4 w-4" />
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

              <p className="mt-6 text-sm text-zinc-400">
                Don&apos;t have an account?{' '}
                <Link to="/register" className="font-semibold text-white transition hover:text-zinc-300">
                Sign up
              </Link>
              </p>
            </CardContent>
          </Card>
        </motion.section>
      </div>

      </div>

      <Footer />
    </div>
  );
};

export default Login;
