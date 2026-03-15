import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { metricsAPI } from '../services/api';
import { Clock3, CheckCircle2, XCircle, Loader, Activity, TimerReset } from 'lucide-react';
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

  const queue = metrics?.queue || {};
  const executions = metrics?.executions || {};

  const totalRuns = executions.total || 0;
  const successfulRuns = executions.success || 0;
  const failedRuns = executions.failed || 0;
  const successRate = executions.successRate || '0%';
  const avgExecutionTime = Math.round(executions.avgExecutionTime || 0);
  const pendingTasks = (queue.waiting || 0) + (queue.delayed || 0);
  const runningTasks = queue.active || 0;

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
          <p className="section-kicker">Performance Overview</p>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-display text-4xl leading-none tracking-[0.05em] text-white sm:text-6xl">
                Metrics
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
                Simple health summary for your automations in the last 24 hours.
              </p>
            </div>
            <div className="glass-panel px-5 py-4 text-xs uppercase tracking-[0.3em] text-zinc-400">
              Auto-refresh 30s
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <div className="mb-5 flex items-center gap-3">
            <Activity className="h-5 w-5 text-zinc-300" />
            <h2 className="text-lg font-semibold uppercase tracking-[0.22em] text-zinc-300">What matters now</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              {
                label: 'Total runs (24h)',
                value: totalRuns,
                helper: 'All automation executions recorded in the last 24 hours.',
                icon: Activity,
              },
              {
                label: 'Success rate',
                value: successRate,
                helper: `${successfulRuns} successful and ${failedRuns} failed runs.`,
                icon: CheckCircle2,
              },
              {
                label: 'Average run time',
                value: `${avgExecutionTime} ms`,
                helper: 'Average execution duration for successful runs.',
                icon: TimerReset,
              },
            ].map(({ label, value, helper, icon: Icon }, index) => (
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
                      <p className="mt-2 text-sm text-zinc-500">{helper}</p>
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
            <Clock3 className="h-5 w-5 text-zinc-300" />
            <h2 className="text-lg font-semibold uppercase tracking-[0.26em] text-zinc-300">
              Queue snapshot
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2">
            {[
              {
                label: 'Pending tasks',
                value: pendingTasks,
                helper: 'Jobs waiting or delayed in queue.',
              },
              {
                label: 'Running now',
                value: runningTasks,
                helper: 'Jobs currently being processed.',
              },
            ].map(({ label, value, helper }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.18 + index * 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                <Card>
                  <CardContent className="p-0">
                    <p className="section-kicker">{label}</p>
                    <p className="mt-4 font-display text-5xl text-white">{value}</p>
                    <p className="mt-3 text-sm text-zinc-500">{helper}</p>
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

export default Metrics;
