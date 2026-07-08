import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Modal, Button, Textarea } from '@/design-system';
import { useChangeTicketStatus } from '@/hooks/useTickets';
import type { Ticket } from '@/types';

const schema = z.object({
  reason: z.string().min(10, 'Please provide a reopen reason (min 10 characters)'),
});
type FormData = z.infer<typeof schema>;

interface ReopenModalProps {
  ticket: Ticket;
  isOpen: boolean;
  onClose: () => void;
}

export function ReopenModal({ ticket, isOpen, onClose }: ReopenModalProps) {
  const { mutate: changeStatus, isPending } = useChangeTicketStatus();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    changeStatus(
      { id: ticket.id, status: 'open', resolution: data.reason },
      {
        onSuccess: () => {
          toast.success(`${ticket.ticket_number} reopened`);
          reset();
          onClose();
        },
        onError: () => toast.error('Failed to reopen ticket'),
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Reopen ${ticket.ticket_number}`}
      size="sm"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose} disabled={isPending}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={handleSubmit(onSubmit)} isLoading={isPending} data-testid="reopen-confirm-btn">
            Reopen Ticket
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <p className="text-sm text-text-secondary">
          Reopening: <span className="font-medium text-text-primary">{ticket.subject}</span>
        </p>
        <Textarea
          label="Reason for reopening"
          placeholder="Explain why this ticket needs to be reopened..."
          error={errors.reason?.message}
          rows={4}
          {...register('reason')}
        />
      </form>
    </Modal>
  );
}
