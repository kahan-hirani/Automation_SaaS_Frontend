import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { logsAPI } from '../services/api';
import { ScrollText, CheckCircle, XCircle, Clock, Loader } from 'lucide-react';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

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

  const filteredLogs = logs.filter((log) => {
    if (filter === 'all') return true;
    return log.status === filter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Execution Logs</h1>
          <p className="mt-1 text-sm text-gray-600">
            View and monitor your automation execution history
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Executions</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <ScrollText className="h-10 w-10 text-gray-400" />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Successful</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{stats.success}</p>
                </div>
                <CheckCircle className="h-10 w-10 text-green-400" />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Failed</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">{stats.failed}</p>
                </div>
                <XCircle className="h-10 w-10 text-red-400" />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Time</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">
                    {Math.round(stats.avgExecutionTime)}ms
                  </p>
                </div>
                <Clock className="h-10 w-10 text-blue-400" />
              </div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            All ({logs.length})
          </button>
          <button
            onClick={() => setFilter('success')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'success'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Success ({logs.filter((l) => l.status === 'success').length})
          </button>
          <button
            onClick={() => setFilter('failed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'failed'
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Failed ({logs.filter((l) => l.status === 'failed').length})
          </button>
        </div>

        {/* Logs Table */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader className="h-8 w-8 text-primary-600 animate-spin" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="card text-center py-12">
            <ScrollText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No logs found</h3>
            <p className="text-gray-600">Logs will appear here once automations run</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Automation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {log.Automation?.name || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {log.Automation?.targetUrl}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`badge ${
                            log.status === 'success' ? 'badge-success' : 'badge-error'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {log.status === 'success' ? (
                          <div className="text-sm text-gray-900">
                            <div>Title: {log.result?.title || 'N/A'}</div>
                            <div className="text-gray-500">
                              HTTP {log.result?.httpStatus} • {log.result?.executionTime}ms
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-red-600 max-w-xs truncate">
                            {log.error}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.result?.executionTime}ms
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logs;
