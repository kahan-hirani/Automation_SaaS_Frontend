import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { LogOut, Bot, BarChart3, ScrollText, User, Sparkles } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

const navItems = [
  { to: '/', label: 'Automations', icon: Bot, end: true },
  { to: '/logs', label: 'Logs', icon: ScrollText },
  { to: '/metrics', label: 'Metrics', icon: BarChart3 },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-40 border-b border-white/8 bg-black/70 backdrop-blur-2xl"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
            <Link to="/" className="group flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white text-black shadow-[0_12px_30px_rgba(255,255,255,0.08)] transition duration-300 group-hover:-translate-y-0.5">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <p className="section-kicker">Automation Control</p>
                <h1 className="font-display text-3xl leading-none tracking-[0.08em] text-white">
                  Automation SaaS
                </h1>
              </div>
            </Link>

            <nav className="glass-panel flex flex-wrap items-center gap-2 px-2 py-2">
              {navItems.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    cn(
                      'relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400 transition duration-300 hover:text-white',
                      isActive && 'text-black'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive ? (
                        <motion.span
                          layoutId="navbar-pill"
                          className="absolute inset-0 rounded-full bg-white"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      ) : null}
                      <span className="relative z-10 flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {label}
                      </span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="glass-panel flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:min-w-[360px]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5">
                <User className="h-5 w-5 text-zinc-300" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{user?.email}</p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant="outline">{user?.plan || 'free'}</Badge>
                  <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                    <Sparkles className="h-3.5 w-3.5" />
                    Live session
                  </span>
                </div>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="secondary"
              size="sm"
              className="justify-center sm:justify-start"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
