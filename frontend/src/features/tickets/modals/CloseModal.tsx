import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Modal, Button, Textarea } from '@/design-system';
import { useChangeTicketStatus } from '@/hooks/useTickets';
import type { Ticket } from '@/types';

const schema = z.object({
  note: z.string().min(5, 'Please add a closure note (min 5 characters)'),
});
type FormData = z.infer<typeof schema>;

interface CloseModalProps {
  ticket: Ticket;
  isOpen: boolean;
  onClose: () => void;
}

export function CloseModal({ ticket, isOpen, onClose }: CloseModalProps) {
  const { mutate: changeStatus, isPending } = useChangeTicketStatus();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    changeStatus(
      { id: ticket.id, status: 'closed', resolution: data.note },
      {
        onSuccess: () => {
          toast.success(`${ticket.ticket_number} closed`);
          reset();
          onClose();
        },
        onError: () => toast.error('Failed to close ticket'),
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Close ${ticket.ticket_number}`}
      size="sm"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose} disabled={isPending}>Cancel</Button>
          <Button variant="danger" size="sm" onClick={handleSubmit(onSubmit)} isLoading={isPending} data-testid="close-confirm-btn">
            Close Ticket
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <p className="text-sm text-text-secondary">
          Closing: <span className="font-medium text-text-primary">{ticket.subject}</span>
        </p>
        <Textarea
          label="Closure note"
          placeholder="Briefly describe why this ticket is being closed..."
          error={errors.note?.message}
          rows={3}
          {...register('note')}
        />
      </form>
    </Modal>
  );
}
