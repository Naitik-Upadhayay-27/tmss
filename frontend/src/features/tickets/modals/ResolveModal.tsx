import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Modal, Button, Textarea } from '@/design-system';
import { useChangeTicketStatus } from '@/hooks/useTickets';
import type { Ticket } from '@/types';

const schema = z.object({
  resolution: z.string().min(10, 'Please describe the resolution (min 10 characters)'),
});

type FormData = z.infer<typeof schema>;

interface ResolveModalProps {
  ticket: Ticket;
  isOpen: boolean;
  onClose: () => void;
}

export function ResolveModal({ ticket, isOpen, onClose }: ResolveModalProps) {
  const { mutate: changeStatus, isPending } = useChangeTicketStatus();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    changeStatus(
      { id: ticket.id, status: 'resolved', resolution: data.resolution },
      {
        onSuccess: () => {
          toast.success(`${ticket.ticket_number} marked as resolved`);
          reset();
          onClose();
        },
        onError: () => toast.error('Failed to resolve ticket'),
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Resolve ${ticket.ticket_number}`}
      size="sm"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose} disabled={isPending}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={handleSubmit(onSubmit)} isLoading={isPending} data-testid="resolve-confirm-btn">
            Mark Resolved
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <p className="text-sm text-text-secondary">
          Resolving: <span className="font-medium text-text-primary">{ticket.subject}</span>
        </p>
        <Textarea
          label="Resolution summary"
          placeholder="Describe how this ticket was resolved..."
          error={errors.resolution?.message}
          rows={5}
          {...register('resolution')}
          data-testid="resolution-textarea"
        />
      </form>
    </Modal>
  );
}
