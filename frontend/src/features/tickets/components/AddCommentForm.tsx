import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button, Textarea } from '@/design-system';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { addComment } from '@/api/comments.api';
import type { Comment } from '@/types';

const schema = z.object({
  body: z.string().min(5, 'Comment must be at least 5 characters'),
  is_internal: z.boolean(),
});
type FormData = z.infer<typeof schema>;

interface AddCommentFormProps {
  ticketId: number;
  onAdd: (comment: Comment) => void;
}

export function AddCommentForm({ ticketId, onAdd }: AddCommentFormProps) {
  const { user } = useAuthStore();
  const canAddInternal = user?.role !== 'CALLER';
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { is_internal: false },
  });

  const onSubmit = async (data: FormData) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const comment = await addComment(ticketId, data.body, data.is_internal);
      onAdd(comment);
      reset();
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Failed to add comment:', error);
      toast.error('Failed to add comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
      <Textarea
        placeholder="Write a comment..."
        error={errors.body?.message}
        {...register('body')}
        data-testid="comment-textarea"
        className="!h-24 !max-h-24 !min-h-[96px] !overflow-y-auto !resize-none"
      />
      <div className="flex items-center justify-between">
        {canAddInternal && (
          <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer select-none">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-surface-border text-brand-purple focus:ring-brand-purple"
              {...register('is_internal')}
              data-testid="internal-note-checkbox"
            />
            Internal note (not visible to caller)
          </label>
        )}
        <div className={canAddInternal ? '' : 'ml-auto'}>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
            leftIcon={<Send className="h-4 w-4" aria-hidden="true" />}
            data-testid="add-comment-btn"
          >
            Add Comment
          </Button>
        </div>
      </div>
    </form>
  );
}
