import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { User, Lock, Shield, Calendar } from 'lucide-react';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { PageHeader } from '@/layout/PageHeader';
import { Button, Input, Avatar, RoleBadge } from '@/design-system';
import { formatDate } from '@/utils';

const profileSchema = z.object({
  first_name: z.string().min(2, 'Min 2 characters'),
  last_name: z.string().min(2, 'Min 2 characters'),
  email: z.string().email('Invalid email'),
});
type ProfileFormData = z.infer<typeof profileSchema>;

const passwordSchema = z.object({
  current_password: z.string().min(1, 'Required'),
  new_password: z.string().min(8, 'Min 8 characters'),
  confirm_password: z.string().min(1, 'Required'),
}).refine((d) => d.new_password === d.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
});
type PasswordFormData = z.infer<typeof passwordSchema>;

export function ProfilePage() {
  const { user } = useAuthStore();

  const {
    register: regProfile,
    handleSubmit: handleProfile,
    formState: { errors: profileErrors, isSubmitting: profileSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: user?.first_name ?? '',
      last_name: user?.last_name ?? '',
      email: user?.email ?? '',
    },
  });

  const {
    register: regPw,
    handleSubmit: handlePw,
    reset: resetPw,
    formState: { errors: pwErrors, isSubmitting: pwSubmitting },
  } = useForm<PasswordFormData>({ resolver: zodResolver(passwordSchema) });

  const onSaveProfile = (_data: ProfileFormData) => {
    toast.success('Profile updated');
  };

  const onChangePassword = (_data: PasswordFormData) => {
    toast.success('Password changed (Phase 1 — mock)');
    resetPw();
  };

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="My Profile" subtitle="Manage your account details and security" />

      {/* Avatar + identity card */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-card p-6 flex items-center gap-6">
        <Avatar name={user.full_name} size="lg" className="h-16 w-16 text-xl flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-text-primary">{user.full_name}</h2>
          <p className="text-sm text-text-muted">{user.email}</p>
          <div className="flex items-center gap-3 mt-2">
            <RoleBadge role={user.role} />
            {user.department && (
              <span className="text-xs text-text-muted flex items-center gap-1">
                <Shield className="h-3 w-3" aria-hidden="true" /> {user.department.name}
              </span>
            )}
            <span className="text-xs text-text-muted flex items-center gap-1">
              <Calendar className="h-3 w-3" aria-hidden="true" /> Joined {formatDate(user.date_joined)}
            </span>
          </div>
        </div>
      </div>

      {/* Profile form */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-card p-6">
        <h3 className="text-sm font-semibold text-text-primary mb-5 flex items-center gap-2">
          <User className="h-4 w-4 text-brand-purple" aria-hidden="true" />
          Personal Information
        </h3>
        <form onSubmit={handleProfile(onSaveProfile)} noValidate className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              error={profileErrors.first_name?.message}
              {...regProfile('first_name')}
            />
            <Input
              label="Last Name"
              error={profileErrors.last_name?.message}
              {...regProfile('last_name')}
            />
          </div>
          <Input
            label="Email Address"
            type="email"
            error={profileErrors.email?.message}
            hint="Contact your admin to change your email address"
            disabled
            {...regProfile('email')}
          />
          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="sm" isLoading={profileSubmitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>

      {/* Password form */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-card p-6">
        <h3 className="text-sm font-semibold text-text-primary mb-5 flex items-center gap-2">
          <Lock className="h-4 w-4 text-brand-purple" aria-hidden="true" />
          Change Password
        </h3>
        <form onSubmit={handlePw(onChangePassword)} noValidate className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            error={pwErrors.current_password?.message}
            {...regPw('current_password')}
          />
          <Input
            label="New Password"
            type="password"
            hint="Minimum 8 characters"
            error={pwErrors.new_password?.message}
            {...regPw('new_password')}
          />
          <Input
            label="Confirm New Password"
            type="password"
            error={pwErrors.confirm_password?.message}
            {...regPw('confirm_password')}
          />
          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="sm" isLoading={pwSubmitting}>
              Update Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
