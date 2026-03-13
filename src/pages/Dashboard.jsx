import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import AutomationCard from '../components/AutomationCard';
import CreateAutomationModal from '../components/CreateAutomationModal';
import { automationAPI } from '../services/api';
import { Plus, Bot, Loader, Orbit, Activity, Radar, ArrowRight } from 'lucide-react';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const Dashboard = () => {
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchAutomations();
  }, []);

  const fetchAutomations = async () => {
    try {
      const { data } = await automationAPI.getAll();
      setAutomations(data.automations || []);
    } catch (error) {
      console.error('Failed to fetch automations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setShowModal(false);
    fetchAutomations();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this automation?')) {
      try {
        await automationAPI.delete(id);
        fetchAutomations();
      } catch (error) {
        alert('Failed to delete automation');
      }
    }
  };

  const handleToggle = async (id) => {
    try {
      await automationAPI.toggle(id);
      fetchAutomations();
    } catch (error) {
      alert('Failed to toggle automation');
    }
  };

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
          <div className="relative grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <div>
              <p className="section-kicker">Automation Studio</p>
              <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[0.94] tracking-[0.05em] text-white sm:text-6xl">
                Build a quieter, faster automation command center.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-400">
                Your workflows, schedules, and target surfaces now sit inside a fully monochrome control room with sharper hierarchy and motion-led feedback.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  onClick={() => setShowModal(true)}
                  className="min-w-[220px]"
                >
                  <Plus className="h-4 w-4" />
                  Create Automation
                </Button>
                <Badge variant="outline">{automations.length} total workflows</Badge>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {[
                { icon: Orbit, label: 'Active surface', value: `${automations.filter((item) => item.isActive).length}` },
                { icon: Radar, label: 'Inactive nodes', value: `${automations.filter((item) => !item.isActive).length}` },
                { icon: Activity, label: 'System mode', value: 'Live' },
              ].map(({ icon: Icon, label, value }, index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.1 + index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Card className="bg-white/[0.03] p-5">
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
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8"
        >
          {loading ? (
            <div className="glass-panel flex h-64 items-center justify-center gap-3 text-sm uppercase tracking-[0.3em] text-zinc-400">
              <Loader className="h-4 w-4 animate-spin" />
              Loading automations
            </div>
          ) : automations.length === 0 ? (
            <Card className="mesh-panel overflow-hidden px-6 py-10 sm:px-10 sm:py-12">
              <CardHeader className="items-center text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white text-black">
                  <Bot className="h-10 w-10" />
                </div>
                <p className="section-kicker">No automations yet</p>
                <CardTitle className="text-center">Start with your first workflow</CardTitle>
                <CardDescription className="max-w-xl text-center">
                  Create a scheduled automation and the dashboard will start filling with live nodes, logs, and system metrics.
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-6 flex justify-center">
                <Button onClick={() => setShowModal(true)}>
                  <ArrowRight className="h-4 w-4" />
                  Launch Builder
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {automations.map((automation) => (
                <AutomationCard
                  key={automation.id}
                  automation={automation}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          )}
        </motion.section>
      </main>

      {showModal && (
        <CreateAutomationModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}

      <Footer />
    </div>
  );
};

export default Dashboard;
