import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { metricsAPI } from '../services/api';
import { Activity, TrendingUp, Clock, CheckCircle, XCircle, Loader } from 'lucide-react';

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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <Loader className="h-8 w-8 text-primary-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">System Metrics</h1>
          <p className="mt-1 text-sm text-gray-600">
            Real-time monitoring of your automation system
          </p>
        </div>

        {/* Queue Status */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Queue Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Waiting</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-1">
                    {metrics?.queue?.waiting || 0}
                  </p>
                </div>
                <Clock className="h-10 w-10 text-yellow-400" />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-3xl font-bold text-blue-600 mt-1">
                    {metrics?.queue?.active || 0}
                  </p>
                </div>
                <Activity className="h-10 w-10 text-blue-400 animate-pulse" />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">
                    {metrics?.queue?.completed || 0}
                  </p>
                </div>
                <CheckCircle className="h-10 w-10 text-green-400" />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Failed</p>
                  <p className="text-3xl font-bold text-red-600 mt-1">
                    {metrics?.queue?.failed || 0}
                  </p>
                </div>
                <XCircle className="h-10 w-10 text-red-400" />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Delayed</p>
                  <p className="text-3xl font-bold text-purple-600 mt-1">
                    {metrics?.queue?.delayed || 0}
                  </p>
                </div>
                <TrendingUp className="h-10 w-10 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Execution Statistics */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Execution Statistics (Last Hour)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card">
              <p className="text-sm text-gray-600 mb-2">Total Executions</p>
              <p className="text-3xl font-bold text-gray-900">
                {metrics?.executions?.total || 0}
              </p>
            </div>

            <div className="card">
              <p className="text-sm text-gray-600 mb-2">Successful</p>
              <p className="text-3xl font-bold text-green-600">
                {metrics?.executions?.success || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {metrics?.executions?.successRate}
              </p>
            </div>

            <div className="card">
              <p className="text-sm text-gray-600 mb-2">Failed</p>
              <p className="text-3xl font-bold text-red-600">
                {metrics?.executions?.failed || 0}
              </p>
            </div>

            <div className="card">
              <p className="text-sm text-gray-600 mb-2">Avg Execution Time</p>
              <p className="text-3xl font-bold text-blue-600">
                {Math.round(metrics?.executions?.avgExecutionTime || 0)}
                <span className="text-lg text-gray-500">ms</span>
              </p>
            </div>
          </div>

          {/* Min/Max Execution Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="card">
              <p className="text-sm text-gray-600 mb-2">Fastest Execution</p>
              <p className="text-2xl font-bold text-green-600">
                {metrics?.executions?.minExecutionTime || 0}ms
              </p>
            </div>

            <div className="card">
              <p className="text-sm text-gray-600 mb-2">Slowest Execution</p>
              <p className="text-2xl font-bold text-orange-600">
                {metrics?.executions?.maxExecutionTime || 0}ms
              </p>
            </div>
          </div>
        </div>

        {/* Auto-refresh indicator */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Metrics auto-refresh every 30 seconds
          </p>
        </div>
      </div>
    </div>
  );
};

export default Metrics;
