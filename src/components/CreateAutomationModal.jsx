import { useEffect, useRef, useState } from 'react';
import { automationAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Globe, Tag, DollarSign, Briefcase, ChevronDown, Check, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';

const AUTOMATION_TYPES = [
  {
    value: 'WEBSITE_UPTIME',
    label: 'Website Uptime Monitor',
    description: 'Periodically checks if a website is reachable and measures response time.',
    icon: Globe,
    fields: [
      { id: 'url', label: 'Target URL', placeholder: 'https://example.com', type: 'url', required: true, hint: 'The URL to monitor for uptime.' },
    ],
  },
  {
    value: 'PRICE_MONITOR',
    label: 'Price Monitor',
    description: 'Tracks a product price and alerts you when it drops to your target.',
    icon: DollarSign,
    fields: [
      { id: 'url', label: 'Product URL', placeholder: 'https://amazon.com/product/…', type: 'url', required: true, hint: 'URL of the product page.' },
      { id: 'selector', label: 'Price Selector', placeholder: '.price, #priceblock_ourprice', type: 'text', required: true, hint: 'CSS selector that targets the price element.' },
      { id: 'targetPrice', label: 'Target Price', placeholder: '2000', type: 'number', required: true, hint: 'Alert me when the price drops to this value or below.' },
    ],
  },
  {
    value: 'JOB_MONITOR',
    label: 'Job Listings Monitor',
    description: 'Watches a careers page and notifies you when new job listings appear.',
    icon: Briefcase,
    fields: [
      { id: 'url', label: 'Careers Page URL', placeholder: 'https://company.com/careers', type: 'url', required: true, hint: 'URL of the careers/jobs page.' },
      { id: 'selector', label: 'Job Card Selector', placeholder: '.job-card, .position-item', type: 'text', required: true, hint: 'CSS selector for each listing element.' },
      { id: 'keyword', label: 'Keyword Filter', placeholder: 'frontend, react (optional)', type: 'text', required: false, hint: 'Only notify when a listing contains this keyword.' },
    ],
  },
];

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

const NAME_PLACEHOLDERS = {
  WEBSITE_UPTIME: 'e.g. Monitor Main Website Uptime',
  PRICE_MONITOR: 'e.g. Track iPhone Price Drop',
  JOB_MONITOR: 'e.g. Watch Frontend Jobs Page',
};

const CreateAutomationModal = ({
  onClose,
  onCreate,
  onCreateFailed,
  mode = 'create',
  initialAutomation = null,
  onUpdated,
  onUpdateFailed,
}) => {
  const [name, setName] = useState('');
  const [schedule, setSchedule] = useState('*/5 * * * *');
  const [automationType, setAutomationType] = useState(AUTOMATION_TYPES[0].value);
  const [config, setConfig] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [typeMenuOpen, setTypeMenuOpen] = useState(false);
  const [scheduleMenuOpen, setScheduleMenuOpen] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});
  const typeMenuRef = useRef(null);
  const scheduleMenuRef = useRef(null);

  const selectedType = AUTOMATION_TYPES.find((t) => t.value === automationType);
  const namePlaceholder = NAME_PLACEHOLDERS[automationType] || 'e.g. Create Automation';
  const isEditMode = mode === 'edit';

  useEffect(() => {
    if (!isEditMode || !initialAutomation) return;

    setName(initialAutomation.name || '');
    setSchedule(initialAutomation.schedule || '*/5 * * * *');
    setAutomationType(initialAutomation.automationType || AUTOMATION_TYPES[0].value);
    setConfig(initialAutomation.config || {});
  }, [isEditMode, initialAutomation]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (typeMenuRef.current && !typeMenuRef.current.contains(event.target)) {
        setTypeMenuOpen(false);
      }
      if (scheduleMenuRef.current && !scheduleMenuRef.current.contains(event.target)) {
        setScheduleMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleTypeChange = (value) => {
    setAutomationType(value);
    setConfig({});
    setTouchedFields({});
    setError('');
    setTypeMenuOpen(false);
  };

  const handleScheduleChange = (cron) => {
    setSchedule(cron);
    setScheduleMenuOpen(false);
  };

  const handleConfigChange = (field, value) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleFieldBlur = (fieldId) => {
    setTouchedFields((prev) => ({ ...prev, [fieldId]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEditMode && initialAutomation?.id) {
        await automationAPI.update(initialAutomation.id, { name, schedule, automationType, config });
        onUpdated?.();
      } else {
        await automationAPI.create({ name, schedule, automationType, config });
        onCreate?.();
      }
    } catch (err) {
      setError(
        err.response?.data?.errMessage ||
        (isEditMode ? 'Failed to update automation' : 'Failed to create automation')
      );

      if (isEditMode) {
        onUpdateFailed?.();
      } else {
        onCreateFailed?.();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex w-[92vw] max-h-[92vh] max-w-[980px] flex-col gap-0 overflow-hidden p-0">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex max-h-[inherit] flex-col"
        >
          <div className="pointer-events-none absolute inset-x-10 top-0 h-24 rounded-full bg-white/10 blur-3xl" />

          {/* Sticky header */}
          <div className="relative flex-shrink-0 px-5 pb-4 pt-5">
            <DialogHeader>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/12 bg-white text-black shadow-[0_12px_32px_rgba(255,255,255,0.12)]">
                {selectedType ? <selectedType.icon className="h-5 w-5" /> : null}
              </div>
              <DialogTitle className="text-[1.4rem] tracking-[0.04em] sm:text-[1.55rem]">
                {isEditMode ? 'Edit Automation' : 'Create New Automation'}
              </DialogTitle>
              <DialogDescription className="max-w-2xl text-sm leading-6 text-zinc-300">
                {isEditMode
                  ? 'Update the configuration and schedule for this workflow.'
                  : 'Choose a type, configure the target, and schedule your new workflow.'}
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Scrollable body — inline dropdowns live here so no overflow clipping */}
          <div className="min-h-0 flex-1 overflow-y-auto px-5">
            {error && (
              <Card className="mb-4 border-white/12 bg-white/8 p-0">
                <CardContent className="flex items-start gap-2.5 p-3 text-sm text-zinc-300">
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <p>{error}</p>
                </CardContent>
              </Card>
            )}

            <form id="create-automation-form" onSubmit={handleSubmit}>
              <div className="grid gap-5 pb-5 lg:grid-cols-[1fr_0.9fr] lg:items-start lg:gap-6">
                {/* Left column */}
                <div className="space-y-4">
                  {/* Automation Type — inline expanding list (no absolute, no clipping) */}
                  <div className="space-y-2" ref={typeMenuRef}>
                    <label className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-300">Automation Type</label>
                    <button
                      type="button"
                      onClick={() => { setTypeMenuOpen((c) => !c); setScheduleMenuOpen(false); }}
                      className="flex h-11 w-full items-center justify-between rounded-2xl border border-white/16 bg-black/70 px-4 text-left transition hover:border-white/30"
                    >
                      <span className="flex items-center gap-3">
                        {selectedType && (
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/12 bg-white/6">
                            <selectedType.icon className="h-3.5 w-3.5 text-zinc-100" />
                          </span>
                        )}
                        <span className="text-sm font-semibold text-zinc-50">{selectedType?.label}</span>
                      </span>
                      <ChevronDown className={`h-4 w-4 flex-shrink-0 text-zinc-400 transition-transform duration-200 ${typeMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {typeMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="mt-1 space-y-1 rounded-2xl border border-white/12 bg-zinc-950 p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
                            {AUTOMATION_TYPES.map((option) => {
                              const isActive = option.value === automationType;
                              const OptionIcon = option.icon;
                              return (
                                <button
                                  key={option.value}
                                  type="button"
                                  onClick={() => handleTypeChange(option.value)}
                                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition ${
                                    isActive
                                      ? 'border border-white/20 bg-white/10'
                                      : 'border border-transparent hover:border-white/10 hover:bg-white/5'
                                  }`}
                                >
                                  <span className="flex items-center gap-3">
                                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border border-white/12 bg-white/6">
                                      <OptionIcon className="h-3.5 w-3.5 text-zinc-100" />
                                    </span>
                                    <span className="text-sm font-medium text-zinc-100">{option.label}</span>
                                  </span>
                                  {isActive && <Check className="h-4 w-4 flex-shrink-0 text-white" />}
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Automation Name */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-300">Automation Name</label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                      <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-10 border-white/16 pl-11 text-zinc-50 placeholder:text-zinc-500"
                        placeholder={namePlaceholder}
                        required
                      />
                    </div>
                  </div>

                  {/* Schedule — inline expanding list */}
                  <div className="space-y-2" ref={scheduleMenuRef}>
                    <label className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-300">Schedule</label>
                    <button
                      type="button"
                      onClick={() => { setScheduleMenuOpen((c) => !c); setTypeMenuOpen(false); }}
                      className="flex h-10 w-full items-center justify-between rounded-2xl border border-white/16 bg-black/60 px-4 text-sm text-zinc-50 transition hover:border-white/30"
                    >
                      <span>{`Every ${scheduleOptions.find((o) => o.cron === schedule)?.label || schedule}`}</span>
                      <ChevronDown className={`h-4 w-4 flex-shrink-0 text-zinc-400 transition-transform duration-200 ${scheduleMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {scheduleMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="mt-1 rounded-2xl border border-white/12 bg-zinc-950 p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
                            {scheduleOptions.map((option) => {
                              const isActive = option.cron === schedule;
                              return (
                                <button
                                  key={option.cron}
                                  type="button"
                                  onClick={() => handleScheduleChange(option.cron)}
                                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
                                    isActive ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/6 hover:text-white'
                                  }`}
                                >
                                  <span>{`Every ${option.label}`}</span>
                                  {isActive && <Check className="h-3.5 w-3.5" />}
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Right column: Type Configuration */}
                <div className="self-start rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                  <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-300">
                    <Sparkles className="h-3.5 w-3.5" />
                    Type Configuration
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={automationType}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-3"
                    >
                      {selectedType?.fields.map((field) => (
                        <div key={field.id}>
                          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-400">
                            {field.label}
                            {!field.required && <span className="ml-2 normal-case tracking-normal text-zinc-500">(optional)</span>}
                          </label>
                          <Input
                            type={field.type === 'number' ? 'number' : 'text'}
                            value={config[field.id] || ''}
                            onChange={(e) => handleConfigChange(field.id, e.target.value)}
                            onBlur={() => handleFieldBlur(field.id)}
                            placeholder={field.placeholder}
                            required={field.required}
                            min={field.type === 'number' ? '0' : undefined}
                            step={field.type === 'number' ? 'any' : undefined}
                            className="h-9 border-white/14 text-sm text-zinc-50 placeholder:text-zinc-500"
                          />
                          <AnimatePresence>
                            {field.hint && touchedFields[field.id] && (
                              <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.15 }}
                                className="mt-1.5 overflow-hidden text-xs leading-4 text-zinc-500"
                              >
                                {field.hint}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </form>
          </div>

          {/* Sticky footer — always visible, no dead space */}
          <div className="relative flex-shrink-0 border-t border-white/10 px-5 py-3">
            <div className="flex items-center justify-end gap-2">
              <Button type="button" size="sm" variant="secondary" onClick={onClose} disabled={loading} className="h-9 px-5">
                Cancel
              </Button>
              <Button type="submit" size="sm" form="create-automation-form" disabled={loading} className="h-9 px-5">
                {loading ? (isEditMode ? 'Saving…' : 'Creating…') : (isEditMode ? 'Save Changes' : 'Create Automation')}
              </Button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAutomationModal;
