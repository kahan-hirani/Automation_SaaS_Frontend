import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { metricsAPI } from '../services/api';
import { Activity, TrendingUp, Clock3, CheckCircle2, XCircle, Loader, Radar, TimerReset } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';

const Metrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      const { data } = await metricsAPI.get();
      setMetrics(data.metrics);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="app-shell">
        <div className="noise-overlay" />
        <Navbar />
        <main className="page-frame">
          <div className="glass-panel flex h-[60vh] items-center justify-center gap-3 text-sm uppercase tracking-[0.3em] text-zinc-400">
            <Loader className="h-4 w-4 animate-spin" />
            Loading metrics
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="noise-overlay" />
      <Navbar />

      <main className="page-frame">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <p className="section-kicker">Realtime Monitoring</p>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-display text-5xl leading-none tracking-[0.05em] text-white sm:text-6xl">
                Metrics
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
                Queue health and execution performance, reduced to a clearer grayscale dashboard with continuous updates.
              </p>
            </div>
            <div className="glass-panel px-5 py-4 text-xs uppercase tracking-[0.3em] text-zinc-400">
              Auto-refresh every 30 seconds
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <div className="mb-4 flex items-center gap-3">
            <Radar className="h-5 w-5 text-zinc-300" />
            <h2 className="text-lg font-semibold uppercase tracking-[0.26em] text-zinc-300">Queue Status</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            {[
              { label: 'Waiting', value: metrics?.queue?.waiting || 0, icon: Clock3 },
              { label: 'Active', value: metrics?.queue?.active || 0, icon: Activity },
              { label: 'Completed', value: metrics?.queue?.completed || 0, icon: CheckCircle2 },
              { label: 'Failed', value: metrics?.queue?.failed || 0, icon: XCircle },
              { label: 'Delayed', value: metrics?.queue?.delayed || 0, icon: TrendingUp },
            ].map(({ label, value, icon: Icon }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.12 + index * 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                <Card>
                  <CardContent className="flex items-center justify-between p-0">
                    <div>
                      <p className="section-kicker">{label}</p>
                      <p className="mt-3 font-display text-4xl text-white">{value}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/6">
                      <Icon className="h-5 w-5 text-zinc-200" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-4 flex items-center gap-3">
            <TimerReset className="h-5 w-5 text-zinc-300" />
            <h2 className="text-lg font-semibold uppercase tracking-[0.26em] text-zinc-300">
              Execution Statistics
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Total Executions', value: metrics?.executions?.total || 0, suffix: '' },
              { label: 'Successful', value: metrics?.executions?.success || 0, suffix: metrics?.executions?.successRate || '' },
              { label: 'Failed', value: metrics?.executions?.failed || 0, suffix: '' },
              {
                label: 'Avg Execution Time',
                value: Math.round(metrics?.executions?.avgExecutionTime || 0),
                suffix: 'ms',
              },
            ].map(({ label, value, suffix }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.18 + index * 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                <Card>
                  <CardContent className="p-0">
                    <p className="section-kicker">{label}</p>
                    <p className="mt-4 font-display text-5xl text-white">
                      {value}
                      {suffix === 'ms' ? <span className="ml-1 text-2xl text-zinc-500">ms</span> : null}
                    </p>
                    {suffix && suffix !== 'ms' ? (
                      <p className="mt-3 text-sm text-zinc-500">{suffix}</p>
                    ) : null}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="p-0">
                <p className="section-kicker">Fastest Execution</p>
                <p className="mt-4 font-display text-4xl text-white">
                  {metrics?.executions?.minExecutionTime || 0}
                  <span className="ml-1 text-xl text-zinc-500">ms</span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-0">
                <p className="section-kicker">Slowest Execution</p>
                <p className="mt-4 font-display text-4xl text-white">
                  {metrics?.executions?.maxExecutionTime || 0}
                  <span className="ml-1 text-xl text-zinc-500">ms</span>
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
};

export default Metrics;
