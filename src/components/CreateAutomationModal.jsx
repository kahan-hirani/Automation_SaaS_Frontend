import { useState } from 'react';
import { automationAPI } from '../services/api';
import { motion } from 'framer-motion';
import { AlertCircle, Orbit } from 'lucide-react';
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

const CreateAutomationModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [schedule, setSchedule] = useState('*/1 * * * *');
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
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="pointer-events-none absolute inset-x-10 top-0 h-36 rounded-full bg-white/10 blur-3xl" />
          <DialogHeader className="relative">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-3xl border border-white/12 bg-white text-black shadow-[0_12px_32px_rgba(255,255,255,0.12)]">
              <Orbit className="h-6 w-6" />
            </div>
            <DialogTitle>Create New Automation</DialogTitle>
            <DialogDescription>
              Configure a target, cadence, and launch a new monitoring workflow.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="relative mt-8 space-y-5">
            {error && (
              <Card className="border-white/12 bg-white/8 p-0">
                <CardContent className="flex items-start gap-3 p-4 text-sm text-zinc-300">
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <p>{error}</p>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <label className="section-kicker block">Automation Name</label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Check Google Homepage"
                  required
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="section-kicker block">Target URL</label>
                <Input
                  type="url"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://example.com"
                  required
                />
                <p className="text-xs uppercase tracking-[0.26em] text-zinc-500">
                  The page this workflow monitors.
                </p>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="section-kicker block">Schedule</label>
                <select
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  className="flex h-12 w-full rounded-2xl border border-white/12 bg-black/60 px-4 py-3 text-sm text-white transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  required
                >
                  {scheduleOptions.map((option) => (
                    <option key={option.cron} value={option.cron} className="bg-black text-white">
                      Every {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Automation'}
              </Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAutomationModal;
