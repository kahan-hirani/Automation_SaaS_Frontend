import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';

const ConfirmActionModal = ({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="max-w-xl overflow-hidden" showClose={!loading}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="pointer-events-none absolute inset-x-10 top-0 h-32 rounded-full bg-white/10 blur-3xl" />
          <DialogHeader className="relative">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl border border-white/12 bg-white text-black shadow-[0_12px_32px_rgba(255,255,255,0.12)]">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4">
            <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
              {cancelLabel}
            </Button>
            <Button type="button" variant="destructive" onClick={onConfirm} disabled={loading}>
              {loading ? 'Please wait...' : confirmLabel}
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmActionModal;
