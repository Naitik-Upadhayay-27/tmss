import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Modal, Button, Select, Textarea } from '@/design-system';
import { useChangeTicketStatus } from '@/hooks/useTickets';
import type { Ticket, TicketStatus } from '@/types';

const ALLOWED_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  open: ['assigned', 'escalated', 'on_hold'],
  assigned: ['in_progress', 'escalated', 'on_hold'],
  in_progress: ['resolved', 'escalated', 'on_hold', 'review'],
  resolved: ['closed', 'open'],
  closed: ['open'],
  escalated: ['in_progress', 'on_hold'],
  on_hold: ['in_progress', 'escalated'],
  review: ['resolved', 'in_progress'],
};

const STATUS_LABELS: Record<TicketStatus, string> = {
  open: 'Open', assigned: 'Assigned', in_progress: 'In Progress',
  resolved: 'Resolved', closed: 'Closed', escalated: 'Escalated',
  on_hold: 'On Hold', review: 'In Review',
};

const schema = z.object({
  status: z.string().min(1, 'Please select a status'),
  note: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface StatusModalProps {
  ticket: Ticket;
  isOpen: boolean;
  onClose: () => void;
}

export function StatusModal({ ticket, isOpen, onClose }: StatusModalProps) {
  const { mutate: changeStatus, isPending } = useChangeTicketStatus();

  const allowedStatuses = ALLOWED_TRANSITIONS[ticket.status] ?? [];
  const statusOptions = allowedStatuses.map((s) => ({ value: s, label: STATUS_LABELS[s] }));

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    changeStatus(
      { id: ticket.id, status: data.status as TicketStatus, resolution: data.note },
      {
        onSuccess: () => {
          toast.success('Status updated');
          reset();
          onClose();
        },
        onError: () => toast.error('Failed to update status'),
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Update Status — ${ticket.ticket_number}`}
      size="sm"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose} disabled={isPending}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={handleSubmit(onSubmit)} isLoading={isPending} data-testid="status-confirm-btn">
            Update
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Select
          label="New status"
          options={statusOptions}
          placeholder="Select status"
          error={errors.status?.message}
          {...register('status')}
          data-testid="status-select"
        />
        <Textarea
          label="Note (optional)"
          placeholder="Add a note about this status change..."
          {...register('note')}
        />
      </form>
    </Modal>
  );
}
