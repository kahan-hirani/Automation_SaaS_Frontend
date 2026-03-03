import { Globe, Clock, Trash2, Power, PowerOff } from 'lucide-react';

// Convert cron to human-readable format
const cronToHuman = (cron) => {
  const cronMap = {
    '*/1 * * * *': 'minute',
    '*/5 * * * *': '5 minutes',
    '*/10 * * * *': '10 minutes',
    '*/30 * * * *': '30 minutes',
    '0 */1 * * *': 'hour',
    '0 */2 * * *': '2 hours',
    '0 */6 * * *': '6 hours',
    '0 */12 * * *': '12 hours',
    '0 0 * * *': 'day',
  };
  return cronMap[cron] || cron;
};

const AutomationCard = ({ automation, onDelete, onToggle }) => {
  return (
    <div className="card hover:shadow-md transition-shadow duration-200 animate-fade-in">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
          {automation.name}
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onToggle(automation.id)}
            className={`p-1.5 rounded-lg transition-colors ${
              automation.isActive
                ? 'bg-green-100 text-green-600 hover:bg-green-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={automation.isActive ? 'Deactivate' : 'Activate'}
          >
            {automation.isActive ? (
              <Power className="h-4 w-4" />
            ) : (
              <PowerOff className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={() => onDelete(automation.id)}
            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-start space-x-2">
          <Globe className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <a
            href={automation.targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary-600 hover:text-primary-700 hover:underline break-all"
          >
            {automation.targetUrl}
          </a>
        </div>

        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            Every <span className="font-medium">{cronToHuman(automation.schedule)}</span>
          </span>
        </div>

        <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
          <span
            className={`badge ${
              automation.isActive ? 'badge-success' : 'badge-pending'
            }`}
          >
            {automation.isActive ? 'Active' : 'Inactive'}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(automation.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AutomationCard;
