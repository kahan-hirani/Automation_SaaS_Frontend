import { useState } from 'react';
import { automationAPI } from '../services/api';
import { X, AlertCircle } from 'lucide-react';

const CreateAutomationModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [schedule, setSchedule] = useState('*/1 * * * *'); // Default: every 1 minute
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const scheduleOptions = [
    { label: '1 minute', cron: '*/1 * * * *' },
    { label: '5 minutes', cron: '*/5 * * * *' },
    { label: '10 minutes', cron: '*/10 * * * *' },
    { label: '30 minutes', cron: '*/30 * * * *' },
    { label: '1 hour', cron: '0 */1 * * *' },
    { label: '2 hours', cron: '0 */2 * * *' },
    { label: '6 hours', cron: '0 */6 * * *' },
    { label: '12 hours', cron: '0 */12 * * *' },
    { label: '1 day', cron: '0 0 * * *' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await automationAPI.create({ name, targetUrl, schedule });
      onCreate();
    } catch (err) {
      setError(err.response?.data?.errMessage || 'Failed to create automation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        {/* Overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Create New Automation
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Automation Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="e.g., Check Google Homepage"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="input"
                placeholder="https://example.com"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                The webpage you want to automate
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schedule <span className="text-red-500">*</span>
              </label>
              <select
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                className="input"
                required
              >
                {scheduleOptions.map((option) => (
                  <option key={option.cron} value={option.cron}>
                    Every {option.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                How often to run this automation
              </p>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Automation'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAutomationModal;
