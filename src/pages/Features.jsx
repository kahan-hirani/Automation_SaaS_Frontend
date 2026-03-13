import { motion } from 'framer-motion';
import {
  Globe,
  DollarSign,
  Briefcase,
  Bell,
  Clock3,
  BarChart3,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const automations = [
  {
    key: 'WEBSITE_UPTIME',
    title: 'Website Uptime Monitor',
    icon: Globe,
    description: 'Checks website availability, latency, and health level with contextual email alerts.',
    config: ['URL target', 'Cron schedule'],
    outcomes: ['Healthy / Degraded / Unhealthy classification', 'Execution logs with response metadata'],
  },
  {
    key: 'PRICE_MONITOR',
    title: 'Price Monitor',
    icon: DollarSign,
    description: 'Tracks product pages and alerts when price changes or drops below your target value.',
    config: ['Product URL', 'Price CSS selector', 'Target price'],
    outcomes: ['Price drop detection', 'Previous vs current price tracking'],
  },
  {
    key: 'JOB_MONITOR',
    title: 'Job Listings Monitor',
    icon: Briefcase,
    description: 'Watches careers pages and notifies you when new listings appear.',
    config: ['Careers URL', 'Job card CSS selector', 'Optional keyword'],
    outcomes: ['New job detection', 'Change tracking across runs'],
  },
];

const platformFeatures = [
  { title: 'Smart Scheduling', icon: Clock3, detail: 'Run every minute to daily with cron-based precision.' },
  { title: 'Rich Logs', icon: BarChart3, detail: 'Execution history with status, details, and pagination.' },
  { title: 'Email Alerts', icon: Bell, detail: 'Actionable notifications on failures and important state changes.' },
  { title: 'Secure Access', icon: ShieldCheck, detail: 'JWT authentication and protected dashboard routes.' },
];

const Features = () => {
  return (
    <div className="app-shell">
      <div className="noise-overlay" />
      <Navbar />

      <main className="page-frame">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[36px] border border-white/10 bg-black px-6 py-8 shadow-[0_40px_120px_rgba(0,0,0,0.5)] sm:px-8 lg:px-10"
        >
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.14),transparent_48%)] opacity-80 blur-2xl" />
          <div className="relative">
            <p className="section-kicker">Platform Overview</p>
            <h1 className="mt-4 max-w-4xl font-display text-5xl leading-[0.94] tracking-[0.05em] text-white sm:text-6xl">
              Features and Automation Types
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-400">
              This workspace supports multiple automation engines with a unified dashboard, logs, metrics, and notifications.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              <Badge variant="outline">3 automation types</Badge>
              <Badge variant="outline">Health-aware alerts</Badge>
              <Badge variant="outline">Modular worker routing</Badge>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8"
        >
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-zinc-300" />
            <h2 className="text-lg font-semibold uppercase tracking-[0.26em] text-zinc-300">Automation Types</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {automations.map(({ key, title, icon: Icon, description, config, outcomes }, index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12 bg-white/6">
                      <Icon className="h-5 w-5 text-zinc-200" />
                    </div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="section-kicker mb-2">Required Config</p>
                      <div className="flex flex-wrap gap-2">
                        {config.map((item) => (
                          <Badge key={item} variant="muted">{item}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="section-kicker mb-2">Outputs</p>
                      <ul className="space-y-2 text-sm text-zinc-400">
                        {outcomes.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <ArrowRight className="mt-1 h-3.5 w-3.5 flex-shrink-0 text-zinc-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8"
        >
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-zinc-300" />
            <h2 className="text-lg font-semibold uppercase tracking-[0.26em] text-zinc-300">Core Platform Features</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {platformFeatures.map(({ title, icon: Icon, detail }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.16 + index * 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                <Card>
                  <CardContent className="p-0">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-white/12 bg-white/6">
                      <Icon className="h-4 w-4 text-zinc-200" />
                    </div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-300">{title}</p>
                    <p className="mt-3 text-sm leading-6 text-zinc-500">{detail}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
};

export default Features;