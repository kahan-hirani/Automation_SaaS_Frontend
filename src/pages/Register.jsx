import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Bot, Mail, Lock, AlertCircle, UserPlus } from 'lucide-react';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.errMessage || 'Failed to register');
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
          animate={{ x: [0, 28, -14, 0], y: [0, -18, 14, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-[12%] top-[10%] h-80 w-80 rounded-full bg-white/8 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -22, 16, 0], y: [0, 18, -16, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[10%] right-[8%] h-[26rem] w-[26rem] rounded-full bg-white/5 blur-3xl"
        />
      </motion.div>

      <div className="relative grid w-full max-w-6xl overflow-hidden rounded-[40px] border border-white/10 bg-black/70 shadow-[0_50px_140px_rgba(0,0,0,0.65)] backdrop-blur-2xl lg:grid-cols-[0.95fr_1.05fr]">
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center border-b border-white/10 p-6 sm:p-10 lg:border-b-0 lg:border-r"
        >
          <Card className="w-full border-white/10 bg-white/[0.03] p-0">
            <CardHeader className="p-8 pb-2">
              <p className="section-kicker">Create Access</p>
              <CardTitle>Register</CardTitle>
              <CardDescription>
                Set up a new workspace account and start orchestrating automations immediately.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-8 pt-6">
              <form onSubmit={handleSubmit} className="space-y-5">
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

            <div className="space-y-2">
              <label className="section-kicker block">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
              <UserPlus className="h-4 w-4" />
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

              <p className="mt-6 text-sm text-zinc-400">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-white transition hover:text-zinc-300">
                Sign in
              </Link>
              </p>
            </CardContent>
          </Card>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mesh-panel relative flex min-h-[320px] flex-col justify-between p-8 sm:p-10"
        >
          <div>
            <div className="mb-10 flex h-16 w-16 items-center justify-center rounded-[26px] border border-white/10 bg-white text-black">
              <Bot className="h-8 w-8" />
            </div>
            <p className="section-kicker">Build Your Stack</p>
            <h1 className="mt-4 max-w-lg font-display text-5xl leading-[0.95] tracking-[0.05em] text-white sm:text-6xl">
              Start with a sharper control room.
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-zinc-400">
              New accounts land directly in a redesigned environment built for contrast, clarity, and faster scanning.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ['Structured', 'shadcn-style components'],
              ['Animated', 'motion-led page transitions'],
              ['Responsive', 'mobile and desktop layouts'],
              ['Monochrome', 'strict grayscale surfaces'],
            ].map(([title, subtitle]) => (
              <div key={title} className="rounded-3xl border border-white/8 bg-white/5 p-5">
                <p className="text-lg font-semibold text-white">{title}</p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{subtitle}</p>
              </div>
            ))}
          </div>
        </motion.section>
      </div>

      </div>

      <Footer />
    </div>
  );
};

export default Register;
