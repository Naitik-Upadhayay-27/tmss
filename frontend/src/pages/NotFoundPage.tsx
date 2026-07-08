import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/design-system';

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <p className="text-8xl font-black text-brand-purple-faint select-none">404</p>
      <h1 className="text-2xl font-bold text-text-primary mt-2">Page not found</h1>
      <p className="text-text-muted text-sm mt-2 max-w-sm">
        The page you're looking for doesn't exist or you don't have permission to view it.
      </p>
      <div className="flex items-center gap-3 mt-8">
        <Button variant="secondary" size="sm" onClick={() => navigate(-1)} leftIcon={<ArrowLeft className="h-4 w-4" />}>
          Go back
        </Button>
        <Button variant="primary" size="sm" onClick={() => navigate('/dashboard')} leftIcon={<Home className="h-4 w-4" />}>
          Dashboard
        </Button>
      </div>
    </div>
  );
}
