import { Avatar, EmptyState } from '@/design-system';
import { MessageSquare, Lock } from 'lucide-react';
import { formatRelative } from '@/utils';
import { useAuthStore } from '@/features/auth/useAuthStore';
import type { Comment } from '@/types';

interface CommentListProps {
  comments: Comment[];
}

export function CommentList({ comments }: CommentListProps) {
  const { user } = useAuthStore();
  const canSeeInternal = user?.role !== 'CALLER';

  const visibleComments = comments.filter((c) => canSeeInternal || !c.is_internal);

  if (visibleComments.length === 0) {
    return (
      <EmptyState
        icon={<MessageSquare className="h-8 w-8" aria-hidden="true" />}
        title="No comments yet"
        description="Be the first to add a comment or internal note."
      />
    );
  }

  return (
    <ul className="space-y-4" role="list">
      {visibleComments.map((comment) => (
        <li
          key={comment.id}
          className={`flex gap-3 ${comment.is_internal ? 'opacity-90' : ''}`}
          role="listitem"
        >
          <Avatar name={comment.author.full_name} size="sm" className="flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-text-primary">{comment.author.full_name}</span>
              {comment.is_internal && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium border border-amber-200">
                  <Lock className="h-3 w-3" aria-hidden="true" />
                  Internal
                </span>
              )}
              <span className="text-xs text-text-muted">{formatRelative(comment.created_at)}</span>
            </div>
            <div
              className={`text-sm text-text-secondary prose prose-sm max-w-none rounded-lg px-3 py-2.5 ${
                comment.is_internal
                  ? 'bg-amber-50 border border-amber-100'
                  : 'bg-surface-secondary border border-surface-border'
              }`}
              dangerouslySetInnerHTML={{ __html: comment.body }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
