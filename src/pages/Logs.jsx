import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { logsAPI } from '../services/api';
import {
  ScrollText,
  CheckCircle2,
  XCircle,
  Clock3,
  Loader,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  RotateCw,
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { cn } from '../lib/utils';

const HEALTH_FILTERS = {
  ALL: 'all',
  HEALTHY: 'healthy',
  DEGRADED: 'degraded',
  UNHEALTHY: 'unhealthy',
  FAILED: 'failed',
};

const getHealthLevel = (log) => {
  if (log.status === 'failed') {
    return HEALTH_FILTERS.FAILED;
  }

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

  if (httpStatus >= 400 || httpStatus === 0) {
    return HEALTH_FILTERS.UNHEALTHY;
  }

  if (responseTime >= 5000 || contentLength <= 0) {
    return HEALTH_FILTERS.DEGRADED;
  }

  return HEALTH_FILTERS.HEALTHY;
};

const getHealthBadgeVariant = (health) => {
  if (health === HEALTH_FILTERS.HEALTHY) return 'default';
  return 'muted';
};

const DEFAULT_PAGE_SIZE = 10;

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [pageInput, setPageInput] = useState('1');

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, []);

  const fetchLogs = async () => {
    try {
      const { data } = await logsAPI.getAll(100);
      setLogs(data.logs || []);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await logsAPI.getStats();
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const logsWithHealth = logs.map((log) => ({
    ...log,
    healthLevel: getHealthLevel(log),
  }));

  const healthyCount = logsWithHealth.filter((l) => l.healthLevel === HEALTH_FILTERS.HEALTHY).length;
  const degradedCount = logsWithHealth.filter((l) => l.healthLevel === HEALTH_FILTERS.DEGRADED).length;
  const unhealthyCount = logsWithHealth.filter((l) => l.healthLevel === HEALTH_FILTERS.UNHEALTHY).length;
  const failedCount = logsWithHealth.filter((l) => l.healthLevel === HEALTH_FILTERS.FAILED).length;

  const filteredLogs = logsWithHealth.filter((log) => {
    if (filter === HEALTH_FILTERS.ALL) return true;
    return log.healthLevel === filter;
  });

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
    setPageInput('1');
  }, [filter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setPageInput(String(safeCurrentPage));
  }, [safeCurrentPage]);

  const handlePageJump = () => {
    const nextPage = Number(pageInput);
    if (!Number.isFinite(nextPage) || nextPage < 1) {
      setPageInput(String(safeCurrentPage));
      return;
    }

    const clampedPage = Math.min(totalPages, Math.floor(nextPage));
    setCurrentPage(clampedPage);
    setPageInput(String(clampedPage));
  };

  const pageButtons = Array.from({ length: totalPages }, (_, index) => index + 1).slice(
    Math.max(0, safeCurrentPage - 3),
    Math.max(0, safeCurrentPage - 3) + 5
  );

  return (
    <div className="app-shell">
      <div className="noise-overlay" />
      <Navbar />

      <main className="page-frame">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <p className="section-kicker">Execution History</p>
            <h1 className="mt-4 font-display text-5xl leading-none tracking-[0.05em] text-white sm:text-6xl">
              Logs
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
              Scan outcomes, timing, and automation details inside a denser monochrome table built for quick review.
            </p>
          </div>

          <div className="glass-panel flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-[0.28em] text-zinc-400">
            <ScrollText className="h-4 w-4" />
            {filteredLogs.length === 0
              ? '0 visible records'
              : `${startIndex + 1}-${Math.min(endIndex, filteredLogs.length)} of ${filteredLogs.length}`}
          </div>
        </motion.section>

        {stats && (
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Total Executions', value: stats.total, icon: ScrollText },
              { label: 'Successful', value: stats.success, icon: CheckCircle2 },
              { label: 'Failed', value: stats.failed, icon: XCircle },
              { label: 'Avg Time', value: `${Math.round(stats.avgExecutionTime)}ms`, icon: Clock3 },
            ].map(({ label, value, icon: Icon }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 + index * 0.06, ease: [0.22, 1, 0.36, 1] }}
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
        )}

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-6 flex flex-wrap gap-2">
            {[
              { key: HEALTH_FILTERS.ALL, label: `All (${logs.length})` },
              { key: HEALTH_FILTERS.HEALTHY, label: `Healthy (${healthyCount})` },
              { key: HEALTH_FILTERS.DEGRADED, label: `Degraded (${degradedCount})` },
              { key: HEALTH_FILTERS.UNHEALTHY, label: `Unhealthy (${unhealthyCount})` },
              { key: HEALTH_FILTERS.FAILED, label: `Failed (${failedCount})` },
            ].map((item) => (
              <Button
                key={item.key}
                onClick={() => {
                  setFilter(item.key);
                  setCurrentPage(1);
                }}
                variant={filter === item.key ? 'default' : 'secondary'}
                size="sm"
              >
                {item.label}
              </Button>
            ))}
          </div>

          {loading ? (
            <div className="glass-panel flex h-64 items-center justify-center gap-3 text-sm uppercase tracking-[0.3em] text-zinc-400">
              <Loader className="h-4 w-4 animate-spin" />
              Loading logs
            </div>
          ) : filteredLogs.length === 0 ? (
            <Card className="mesh-panel px-6 py-12 text-center sm:px-10">
              <CardContent className="p-0">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white text-black">
                  <ScrollText className="h-10 w-10" />
                </div>
                <h2 className="font-display text-4xl text-white">No logs found</h2>
                <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-zinc-400">
                  Once automations begin executing, this table will populate with outcomes, timing, and target metadata.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead className="border-b border-white/10 bg-white/[0.03] text-left text-[10px] uppercase tracking-[0.32em] text-zinc-500">
                    <tr>
                      <th className="px-6 py-4 font-medium">Automation</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Details</th>
                      <th className="px-6 py-4 font-medium">Time</th>
                      <th className="px-6 py-4 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedLogs.map((log) => (
                      <tr
                        key={log.id}
                        className="border-b border-white/6 transition hover:bg-white/[0.03]"
                      >
                        <td className="px-6 py-5 align-top">
                          <div className="text-sm font-semibold text-white">
                            {log.Automation?.name || 'Unknown'}
                          </div>
                          <div className="mt-2 max-w-xs text-sm leading-6 text-zinc-500">
                            {log.Automation?.targetUrl}
                          </div>
                        </td>
                        <td className="px-6 py-5 align-top">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant={getHealthBadgeVariant(log.healthLevel)}>
                              {log.healthLevel}
                            </Badge>
                            <Badge variant="muted">
                              run: {log.status}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-6 py-5 align-top">
                          {log.status === 'success' ? (
                            <div className="text-sm leading-6 text-zinc-300">
                              <div className="font-medium text-white">Title: {log.result?.title || 'N/A'}</div>
                              <div className="text-zinc-500">
                                HTTP {log.result?.httpStatus} • {log.result?.executionTime}ms
                              </div>
                            </div>
                          ) : (
                            <div className="max-w-xs text-sm leading-6 text-zinc-400">
                              {log.error}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-5 align-top text-sm text-zinc-400">
                          {log.result?.executionTime}ms
                        </td>
                        <td className={cn('px-6 py-5 align-top text-sm text-zinc-500')}>
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col gap-3 border-t border-white/10 bg-white/[0.02] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                    {filteredLogs.length === 0
                      ? 'Showing 0 records'
                      : `Showing ${startIndex + 1}-${Math.min(endIndex, filteredLogs.length)} of ${filteredLogs.length}`}
                  </p>
                  <div className="flex items-center gap-2">
                    <label className="text-xs uppercase tracking-[0.24em] text-zinc-500">Rows</label>
                    <select
                      value={pageSize}
                      onChange={(event) => {
                        const nextPageSize = Number(event.target.value);
                        setPageSize(nextPageSize);
                        setCurrentPage(1);
                        setPageInput('1');
                      }}
                      className="h-9 rounded-full border border-white/12 bg-black/70 px-3 text-xs uppercase tracking-[0.16em] text-zinc-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black"
                    >
                      {[5, 10, 20, 50].map((size) => (
                        <option key={size} value={size} className="bg-black text-white">
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setCurrentPage(1)}
                    disabled={safeCurrentPage === 1}
                    title="First page"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={safeCurrentPage === 1}
                    title="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {pageButtons.map((page) => (
                    <Button
                      key={page}
                      size="sm"
                      variant={page === safeCurrentPage ? 'default' : 'secondary'}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}

                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={safeCurrentPage === totalPages}
                    title="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={safeCurrentPage === totalPages}
                    title="Last page"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center gap-2 rounded-full border border-white/12 bg-black/70 px-2 py-1">
                    <span className="px-1 text-[10px] uppercase tracking-[0.22em] text-zinc-500">Page</span>
                    <input
                      value={pageInput}
                      onChange={(event) => setPageInput(event.target.value.replace(/[^0-9]/g, ''))}
                      onBlur={handlePageJump}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          handlePageJump();
                        }
                      }}
                      className="h-7 w-14 rounded-full border border-white/12 bg-black px-2 text-center text-xs text-zinc-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                    <span className="px-1 text-[10px] uppercase tracking-[0.22em] text-zinc-500">/ {totalPages}</span>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={fetchLogs}
                    title="Refresh logs"
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </motion.section>
      </main>

      <Footer />
    </div>
  );
};

export default Logs;
