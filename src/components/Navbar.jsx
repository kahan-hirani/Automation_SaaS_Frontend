import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { LogOut, Bot, BarChart3, ScrollText, BookOpen, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

const navItems = [
  { to: '/', label: 'Automations', icon: Bot, end: true },
  { to: '/logs', label: 'Logs', icon: ScrollText },
  { to: '/metrics', label: 'Metrics', icon: BarChart3 },
  { to: '/features', label: 'Features', icon: BookOpen },
  { to: '/profile', label: 'Profile', icon: Settings },
];

const Navbar = () => {
  const { logout } = useAuth();
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
      className="fixed inset-x-0 top-0 z-[70] border-b border-white/8 bg-black/88 backdrop-blur-2xl"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2 sm:px-6 lg:px-8">
        <div className="min-w-0 flex flex-1 items-center gap-3">
          <Link to="/" className="group flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white text-black shadow-[0_12px_30px_rgba(255,255,255,0.08)] transition duration-300 group-hover:-translate-y-0.5">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <h1 className="font-display text-[1.25rem] leading-none tracking-[0.05em] text-white sm:text-[1.45rem]">
                Automation SaaS
              </h1>
            </div>
          </Link>
        </div>

        <nav className="glass-panel hidden flex-wrap items-center gap-2 px-2 py-2 lg:flex">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'group relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-white/10 hover:text-white hover:shadow-[0_10px_24px_rgba(255,255,255,0.14)] active:translate-y-0 active:scale-[0.96]',
                  isActive && 'bg-white text-black shadow-[0_10px_24px_rgba(255,255,255,0.14)] hover:bg-white hover:text-black'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon
                      className={cn(
                        'h-4 w-4 transition-transform duration-200 ease-out group-hover:-translate-y-0.5',
                        isActive && 'text-black'
                      )}
                    />
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex flex-1 justify-end">
          <Button
            onClick={handleLogout}
            variant="secondary"
            size="sm"
            className="hidden h-9 px-4 justify-center transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.97] lg:inline-flex"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl px-4 pb-2 lg:hidden sm:px-6 lg:px-8">
        <nav className="glass-panel flex w-full flex-wrap items-center gap-2 px-2 py-2">
          {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'group relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-white/10 hover:text-white hover:shadow-[0_10px_24px_rgba(255,255,255,0.14)] active:translate-y-0 active:scale-[0.96]',
                    isActive && 'bg-white text-black shadow-[0_10px_24px_rgba(255,255,255,0.14)] hover:bg-white hover:text-black'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="relative z-10 flex items-center gap-2">
                      <Icon
                        className={cn(
                          'h-4 w-4 transition-transform duration-200 ease-out group-hover:-translate-y-0.5',
                          isActive && 'text-black'
                        )}
                      />
                      {label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
        </nav>

        <Button
          onClick={handleLogout}
          variant="secondary"
          size="sm"
          className="ml-2 h-9 px-4 justify-center transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.97] lg:hidden"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </motion.header>
  );
};

export default Navbar;
