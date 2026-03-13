import { motion } from 'framer-motion';
import { Globe, Clock3, Trash2, Power, PowerOff, ArrowUpRight } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

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
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel group relative overflow-hidden p-6"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_28%)] opacity-0 transition duration-500 group-hover:opacity-100" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="section-kicker mb-3">Automation node</p>
          <h3 className="text-xl font-semibold text-white sm:text-2xl">
          {automation.name}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => onToggle(automation.id)}
            variant={automation.isActive ? 'default' : 'secondary'}
            size="icon"
            title={automation.isActive ? 'Deactivate' : 'Activate'}
          >
            {automation.isActive ? (
              <Power className="h-4 w-4" />
            ) : (
              <PowerOff className="h-4 w-4" />
            )}
          </Button>
          <Button
            onClick={() => onDelete(automation.id)}
            variant="ghost"
            size="icon"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative mt-8 space-y-5">
        <div className="flex items-start gap-3 rounded-3xl border border-white/8 bg-black/50 px-4 py-4">
          <Globe className="mt-0.5 h-4 w-4 flex-shrink-0 text-zinc-500" />
          <a
            href={automation.targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-start gap-2 break-all text-sm text-zinc-200 transition hover:text-white"
          >
            {automation.targetUrl}
            <ArrowUpRight className="mt-0.5 h-4 w-4 flex-shrink-0" />
          </a>
        </div>

        <div className="flex items-center gap-3 text-sm text-zinc-300">
          <Clock3 className="h-4 w-4 text-zinc-500" />
          <span>
            Every <span className="font-semibold text-white">{cronToHuman(automation.schedule)}</span>
          </span>
        </div>

        <div className="hairline" />

        <div className="flex items-center justify-between gap-4">
          <Badge variant={automation.isActive ? 'default' : 'muted'}>
            {automation.isActive ? 'Active' : 'Inactive'}
          </Badge>
          <span className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
            {new Date(automation.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </motion.article>
  );
};

export default AutomationCard;
