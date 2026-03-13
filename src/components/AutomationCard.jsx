import { motion } from 'framer-motion';
import { Globe, Clock3, Trash2, Power, PowerOff, ArrowUpRight, DollarSign, Briefcase } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

// Convert cron to human-readable format
const cronToHuman = (cron) => {
  const cronMap = {
    '*/1 * * * *':  'minute',
    '*/5 * * * *':  '5 minutes',
    '*/10 * * * *': '10 minutes',
    '*/30 * * * *': '30 minutes',
    '0 */1 * * *':  'hour',
    '0 */2 * * *':  '2 hours',
    '0 */6 * * *':  '6 hours',
    '0 */12 * * *': '12 hours',
    '0 0 * * *':    'day',
  };
  return cronMap[cron] || cron;
};

const TYPE_META = {
  WEBSITE_UPTIME: { label: 'Uptime',    Icon: Globe,       color: 'text-zinc-400' },
  PRICE_MONITOR:  { label: 'Price',     Icon: DollarSign,  color: 'text-zinc-400' },
  JOB_MONITOR:    { label: 'Jobs',      Icon: Briefcase,   color: 'text-zinc-400' },
};

const shortenUrl = (url, maxLength = 56) => {
  if (!url) return '';

  try {
    const parsed = new URL(url);
    const compact = `${parsed.hostname}${parsed.pathname}`;
    if (compact.length <= maxLength) return compact;
    return `${compact.slice(0, maxLength - 1)}...`;
  } catch {
    if (url.length <= maxLength) return url;
    return `${url.slice(0, maxLength - 1)}...`;
  }
};

const AutomationCard = ({ automation, onDelete, onToggle, onOpen }) => {
  const meta = TYPE_META[automation.automationType] || TYPE_META.WEBSITE_UPTIME;
  const TypeIcon = meta.Icon;
  // Resolve display URL: prefer config.url, fallback to targetUrl (legacy)
  const displayUrl = automation.config?.url || automation.targetUrl;
  const compactUrl = shortenUrl(displayUrl);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onOpen && onOpen(automation)}
      className="glass-panel group relative cursor-pointer overflow-hidden p-4"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_28%)] opacity-0 transition duration-500 group-hover:opacity-100" />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5">
              <TypeIcon className={`h-3 w-3 ${meta.color}`} />
              <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-zinc-400">{meta.label}</span>
            </div>
          </div>
          <h3 className="text-base font-semibold text-white sm:text-lg">
            {automation.name}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={(event) => {
              event.stopPropagation();
              onToggle(automation);
            }}
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
            onClick={(event) => {
              event.stopPropagation();
              onDelete(automation);
            }}
            variant="ghost"
            size="icon"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative mt-3 space-y-3">
        {/* Main URL or type-specific config summary */}
        {displayUrl && (
          <div className="flex items-start gap-2.5 rounded-2xl border border-white/8 bg-black/50 px-3 py-2.5">
            <Globe className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-zinc-500" />
            <a
              href={displayUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={displayUrl}
              className="inline-flex min-w-0 items-start gap-1.5 text-xs text-zinc-300 transition hover:text-white"
            >
              <span className="truncate">{compactUrl}</span>
              <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
            </a>
          </div>
        )}

        {/* Extra config chips for non-uptime types */}
        {automation.automationType === 'PRICE_MONITOR' && automation.config?.targetPrice && (
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <DollarSign className="h-3.5 w-3.5 text-zinc-500" />
            Target price: <span className="ml-0.5 font-semibold text-white">{automation.config.targetPrice}</span>
          </div>
        )}
        {automation.automationType === 'JOB_MONITOR' && automation.config?.keyword && (
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <Briefcase className="h-3.5 w-3.5 text-zinc-500" />
            Keyword: <span className="ml-0.5 font-semibold text-white">{automation.config.keyword}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Clock3 className="h-3.5 w-3.5 text-zinc-500" />
          <span>
            Every <span className="font-semibold text-zinc-200">{cronToHuman(automation.schedule)}</span>
          </span>
        </div>

        <div className="hairline" />

        <div className="flex items-center justify-between gap-3">
          <Badge variant={automation.isActive ? 'default' : 'muted'}>
            {automation.isActive ? 'Active' : 'Inactive'}
          </Badge>
          <span className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">
            {new Date(automation.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </motion.article>
  );
};

export default AutomationCard;
