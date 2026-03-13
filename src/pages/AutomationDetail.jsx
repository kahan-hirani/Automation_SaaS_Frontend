import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Clock3,
  Globe,
  DollarSign,
  Briefcase,
  Loader,
  ScrollText,
  Pencil,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ToastStack from '../components/ToastStack';
import CreateAutomationModal from '../components/CreateAutomationModal';
import { automationAPI, logsAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const TYPE_META = {
  WEBSITE_UPTIME: { label: 'Uptime', Icon: Globe },
  PRICE_MONITOR: { label: 'Price', Icon: DollarSign },
  JOB_MONITOR: { label: 'Jobs', Icon: Briefcase },
};

const HEALTH_FILTERS = {
  HEALTHY: 'healthy',
  DEGRADED: 'degraded',
  UNHEALTHY: 'unhealthy',
  FAILED: 'failed',
};

const cronToMinutesLabel = (cron) => {
  if (!cron || typeof cron !== 'string') return 'N/A';

  if (cron === '0 0 * * *') return '1440 minutes';

  const everyMinuteMatch = cron.match(/^\*\/(\d+) \* \* \* \*$/);
  if (everyMinuteMatch) {
    const minutes = Number(everyMinuteMatch[1]);
    return `${minutes} minute${minutes === 1 ? '' : 's'}`;
  }

  const everyHourMatch = cron.match(/^0 \*\/(\d+) \* \* \*$/);
  if (everyHourMatch) {
    const minutes = Number(everyHourMatch[1]) * 60;
    return `${minutes} minutes`;
  }

  return cron;
};

const getHealthLevel = (log, automationType) => {
  if (log.status === 'failed') return HEALTH_FILTERS.FAILED;
  if (automationType !== 'WEBSITE_UPTIME') return HEALTH_FILTERS.HEALTHY;

  const explicitHealth = log.result?.health?.level;
  if (
    explicitHealth === HEALTH_FILTERS.HEALTHY ||
    explicitHealth === HEALTH_FILTERS.DEGRADED ||
    explicitHealth === HEALTH_FILTERS.UNHEALTHY
  ) {
    return explicitHealth;
  }

  const httpStatus = Number(log.result?.httpStatus || 0);
  const responseTime = Number(log.result?.responseTime || 0);
  const contentLength = Number(log.result?.contentLength || 0);

  if (httpStatus >= 400 || httpStatus === 0) return HEALTH_FILTERS.UNHEALTHY;
  if (responseTime >= 5000 || contentLength <= 0) return HEALTH_FILTERS.DEGRADED;
  return HEALTH_FILTERS.HEALTHY;
};

const renderLogDetails = (log, automationType) => {
  const result = log.result || {};

  if (log.status !== 'success') {
    return <div className="text-sm text-zinc-400">{log.error || 'No error details'}</div>;
  }

  if (automationType === 'PRICE_MONITOR') {
    return (
      <div className="space-y-1 text-sm leading-6">
        <div className="font-medium text-white">
          {result.currentPrice !== undefined ? `Current: $${result.currentPrice}` : 'Price: N/A'}
        </div>
        {result.previousPrice !== undefined && (
          <div className="text-zinc-500">Prev: ${result.previousPrice}</div>
        )}
        {result.priceDropped && <div className="text-zinc-200">Price dropped below target</div>}
      </div>
    );
  }

  if (automationType === 'JOB_MONITOR') {
    return (
      <div className="space-y-1 text-sm leading-6">
        <div className="font-medium text-white">
          {result.jobCount !== undefined ? `${result.jobCount} listings found` : 'N/A'}
        </div>
        {result.newJobs > 0 && <div className="text-zinc-300">{result.newJobs} new job(s) detected</div>}
        {result.keyword && <div className="text-zinc-500">Keyword: {result.keyword}</div>}
      </div>
    );
  }

  return (
    <div className="space-y-1 text-sm leading-6">
      <div className="font-medium text-white">{result.title || 'No title'}</div>
      <div className="text-zinc-500">HTTP {result.httpStatus || 'N/A'}</div>
      <div className="text-zinc-500">Response: {result.responseTime || result.executionTime || 'N/A'}ms</div>
    </div>
  );
};

const AutomationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [automation, setAutomation] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [toasts, setToasts] = useState([]);

  const notify = (type, message) => {
    const toastId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((current) => [...current, { id: toastId, type, message }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== toastId));
    }, 3500);
  };

  const dismissToast = (toastId) => {
    setToasts((current) => current.filter((toast) => toast.id !== toastId));
  };

  const fetchAutomation = async () => {
    setLoading(true);
    try {
      const { data } = await automationAPI.getOne(id);
      setAutomation(data.automation || null);
    } catch (error) {
      setAutomation(null);
      notify('error', 'Failed to load automation details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    setLogsLoading(true);
    try {
      const { data } = await logsAPI.getByAutomation(id, 100);
      setLogs(data.logs || []);
    } catch (error) {
      setLogs([]);
      notify('error', 'Failed to load automation logs.');
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    fetchAutomation();
    fetchLogs();
  }, [id]);

  const typeKey = automation?.automationType || 'WEBSITE_UPTIME';
  const typeMeta = TYPE_META[typeKey] || TYPE_META.WEBSITE_UPTIME;
  const TypeIcon = typeMeta.Icon;

  const logsWithHealth = useMemo(() => {
    return logs.map((log) => ({
      ...log,
      healthLevel: getHealthLevel(log, typeKey),
    }));
  }, [logs, typeKey]);

  return (
    <div className="app-shell">
      <div className="noise-overlay" />
      <Navbar />

      <main className="page-frame">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <p className="section-kicker">Automation Detail</p>
          </div>

          {automation && (
            <Button size="sm" onClick={() => setShowEditModal(true)}>
              <Pencil className="h-4 w-4" />
              Edit Automation
            </Button>
          )}
        </motion.section>

        {loading ? (
          <div className="glass-panel flex h-64 items-center justify-center gap-3 text-sm uppercase tracking-[0.3em] text-zinc-400">
            <Loader className="h-4 w-4 animate-spin" />
            Loading automation
          </div>
        ) : !automation ? (
          <Card className="px-6 py-10 text-center sm:px-10">
            <CardContent className="p-0">
              <AlertTriangle className="mx-auto mb-3 h-10 w-10 text-zinc-400" />
              <h2 className="text-2xl font-semibold text-white">Automation not found</h2>
              <p className="mt-2 text-sm text-zinc-400">This automation may have been removed.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-8 overflow-hidden">
              <CardHeader>
                <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  <TypeIcon className="h-3.5 w-3.5 text-zinc-300" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-300">
                    {typeMeta.label}
                  </span>
                </div>
                <CardTitle className="text-3xl text-white">{automation.name}</CardTitle>
                <CardDescription className="mb-4">
                  Configure, monitor, and review all execution logs for this automation.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="section-kicker">Status</p>
                  <div className="mt-2">
                    <Badge variant={automation.isActive ? 'default' : 'muted'}>
                      {automation.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="section-kicker">Schedule</p>
                  <p className="mt-2 text-sm text-white">Every {cronToMinutesLabel(automation.schedule)}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="section-kicker">Target URL</p>
                  <p className="mt-2 truncate text-sm text-zinc-300">{automation.config?.url || automation.targetUrl || 'N/A'}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="section-kicker">Created</p>
                  <p className="mt-2 text-sm text-zinc-300">{new Date(automation.createdAt).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ScrollText className="h-4 w-4 text-zinc-300" />
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-300">Automation Logs</p>
                </div>
                <Badge variant="outline">{logs.length} records</Badge>
              </div>

              {logsLoading ? (
                <div className="glass-panel flex h-56 items-center justify-center gap-3 text-sm uppercase tracking-[0.3em] text-zinc-400">
                  <Loader className="h-4 w-4 animate-spin" />
                  Loading logs
                </div>
              ) : logsWithHealth.length === 0 ? (
                <Card className="px-6 py-10 text-center sm:px-8">
                  <CardContent className="p-0">
                    <h3 className="text-xl font-semibold text-white">No logs yet</h3>
                    <p className="mt-2 text-sm text-zinc-400">Logs for this automation will appear after executions run.</p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="overflow-hidden p-0">
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                      <thead className="border-b border-white/10 bg-white/[0.03] text-left text-[10px] uppercase tracking-[0.32em] text-zinc-500">
                        <tr>
                          <th className="px-6 py-4 font-medium">Health</th>
                          <th className="px-6 py-4 font-medium">Details</th>
                          <th className="px-6 py-4 font-medium">Execution</th>
                          <th className="px-6 py-4 font-medium">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logsWithHealth.map((log) => (
                          <tr key={log.id} className="border-b border-white/6 transition hover:bg-white/[0.03]">
                            <td className="px-6 py-5 align-top">
                              <div className="inline-flex items-center gap-2 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-zinc-400" />
                                <Badge variant={log.healthLevel === HEALTH_FILTERS.HEALTHY ? 'default' : 'muted'}>
                                  {log.healthLevel}
                                </Badge>
                              </div>
                            </td>
                            <td className="px-6 py-5 align-top">{renderLogDetails(log, typeKey)}</td>
                            <td className="px-6 py-5 align-top text-sm text-zinc-400">
                              <div className="flex items-center gap-2">
                                <Clock3 className="h-3.5 w-3.5" />
                                {log.result?.executionTime || log.result?.responseTime || 'N/A'}ms
                              </div>
                            </td>
                            <td className="px-6 py-5 align-top text-sm text-zinc-500">
                              {new Date(log.createdAt).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
            </motion.section>
          </>
        )}
      </main>

      {showEditModal && automation && (
        <CreateAutomationModal
          mode="edit"
          initialAutomation={automation}
          onClose={() => setShowEditModal(false)}
          onUpdated={async () => {
            setShowEditModal(false);
            await fetchAutomation();
            notify('success', 'Automation updated successfully.');
          }}
          onUpdateFailed={() => {
            notify('error', 'Could not update automation. Please check your input.');
          }}
        />
      )}

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
      <Footer />
    </div>
  );
};

export default AutomationDetail;
