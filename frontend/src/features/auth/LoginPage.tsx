import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { LogIn, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuthStore } from './useAuthStore';
import { Input, Button } from '@/design-system';
import type { Role } from '@/types';

const schema = z.object({
  email:    z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
type FormData = z.infer<typeof schema>;

const ROLE_HOME: Record<Role, string> = {
  SUPER_ADMIN: '/dashboard',
  DEPT_HEAD:   '/head/dashboard',
  CALLER:      '/agent/dashboard',
  MEMBER:      '/member/dashboard',
};

type UATAccount = { label: string; email: string; password: string; dept?: string };

const UAT_TABS: { id: string; label: string; badge: string; accounts: UATAccount[] }[] = [
  {
    id: 'admin', label: 'Super Admin', badge: 'bg-purple-100 text-purple-700',
    accounts: [
      { label: 'Vikram Mehta', email: 'admin@fatakpay.com', password: 'Admin@1234' },
    ],
  },
  {
    id: 'hod', label: 'HOD', badge: 'bg-blue-100 text-blue-700',
    accounts: [
      { label: 'Arjun Sharma',   email: 'arjun.sharma@fatakpay.com',   password: 'Head@1234', dept: 'IT' },
      { label: 'Priya Nair',     email: 'priya.nair@fatakpay.com',     password: 'Head@1234', dept: 'Product' },
      { label: 'Rohit Verma',    email: 'rohit.verma@fatakpay.com',    password: 'Head@1234', dept: 'Marketing' },
      { label: 'Sneha Kapoor',   email: 'sneha.kapoor@fatakpay.com',   password: 'Head@1234', dept: 'Sales' },
      { label: 'Manish Gupta',   email: 'manish.gupta@fatakpay.com',   password: 'Head@1234', dept: 'Calling' },
      { label: 'Divya Pillai',   email: 'divya.pillai@fatakpay.com',   password: 'Head@1234', dept: 'Activation' },
      { label: 'Suresh Iyer',    email: 'suresh.iyer@fatakpay.com',    password: 'Head@1234', dept: 'IT Admin' },
      { label: 'Karan Malhotra', email: 'karan.malhotra@fatakpay.com', password: 'Head@1234', dept: 'Prod Support' },
      { label: 'Ananya Bose',    email: 'ananya.bose@fatakpay.com',    password: 'Head@1234', dept: 'Legal' },
      { label: 'Rahul Joshi',    email: 'rahul.joshi@fatakpay.com',    password: 'Head@1234', dept: 'Data' },
      { label: 'Pooja Singh',    email: 'pooja.singh@fatakpay.com',    password: 'Head@1234', dept: 'Operations' },
      { label: 'Amit Agarwal',   email: 'amit.agarwal@fatakpay.com',   password: 'Head@1234', dept: 'Finance' },
    ],
  },
  {
    id: 'member', label: 'Member', badge: 'bg-green-100 text-green-700',
    accounts: [
      { label: 'Nikhil Pandey',       email: 'nikhil.pandey@fatakpay.com',       password: 'Member@1234', dept: 'IT' },
      { label: 'Aditya Kumar',        email: 'aditya.kumar@fatakpay.com',        password: 'Member@1234', dept: 'Product' },
      { label: 'Tanvi Shah',          email: 'tanvi.shah@fatakpay.com',          password: 'Member@1234', dept: 'Marketing' },
      { label: 'Akash Yadav',         email: 'akash.yadav@fatakpay.com',         password: 'Member@1234', dept: 'Sales' },
      { label: 'Mohit Bansal',        email: 'mohit.bansal@fatakpay.com',        password: 'Member@1234', dept: 'Calling' },
      { label: 'Gaurav Bajaj',        email: 'gaurav.bajaj@fatakpay.com',        password: 'Member@1234', dept: 'Activation' },
      { label: 'Vishal Thakur',       email: 'vishal.thakur@fatakpay.com',       password: 'Member@1234', dept: 'IT Admin' },
      { label: 'Tushar Pawar',        email: 'tushar.pawar@fatakpay.com',        password: 'Member@1234', dept: 'Prod Support' },
      { label: 'Siddharth Mukherjee', email: 'siddharth.mukherjee@fatakpay.com', password: 'Member@1234', dept: 'Legal' },
      { label: 'Kartik Arora',        email: 'kartik.arora@fatakpay.com',        password: 'Member@1234', dept: 'Data' },
      { label: 'Sumit Bhatia',        email: 'sumit.bhatia@fatakpay.com',        password: 'Member@1234', dept: 'Operations' },
      { label: 'Hemant Joshi',        email: 'hemant.joshi@fatakpay.com',        password: 'Member@1234', dept: 'Finance' },
    ],
  },
  {
    id: 'caller', label: 'Caller', badge: 'bg-orange-100 text-orange-700',
    accounts: [
      { label: 'Ritu Saxena',     email: 'ritu.saxena@fatakpay.com',     password: 'Caller@1234', dept: 'IT' },
      { label: 'Kavya Reddy',     email: 'kavya.reddy@fatakpay.com',     password: 'Caller@1234', dept: 'Product' },
      { label: 'Neha Jain',       email: 'neha.jain@fatakpay.com',       password: 'Caller@1234', dept: 'Marketing' },
      { label: 'Simran Kaur',     email: 'simran.kaur@fatakpay.com',     password: 'Caller@1234', dept: 'Sales' },
      { label: 'Preeti Soni',     email: 'preeti.soni@fatakpay.com',     password: 'Caller@1234', dept: 'Calling' },
      { label: 'Pooja Rawat',     email: 'pooja.rawat@fatakpay.com',     password: 'Caller@1234', dept: 'Activation' },
      { label: 'Amit Srivastava', email: 'amit.srivastava@fatakpay.com', password: 'Caller@1234', dept: 'IT Admin' },
      { label: 'Ravi Shukla',     email: 'ravi.shukla@fatakpay.com',     password: 'Caller@1234', dept: 'Prod Support' },
      { label: 'Sunita Rao',      email: 'sunita.rao@fatakpay.com',      password: 'Caller@1234', dept: 'Legal' },
      { label: 'Deepa Pillai',    email: 'deepa.pillai@fatakpay.com',    password: 'Caller@1234', dept: 'Data' },
      { label: 'Alok Tiwari',     email: 'alok.tiwari@fatakpay.com',     password: 'Caller@1234', dept: 'Operations' },
      { label: 'Geeta Sharma',    email: 'geeta.sharma@fatakpay.com',    password: 'Caller@1234', dept: 'Finance' },
    ],
  },
];

export function LoginPage() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('admin');
  const [showUAT, setShowUAT] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      const user = useAuthStore.getState().user;
      navigate(user ? ROLE_HOME[user.role] : '/dashboard', { replace: true });
    } catch {
      toast.error('Invalid credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const fill = (acc: UATAccount) => {
    setValue('email', acc.email);
    setValue('password', acc.password);
  };

  const currentTab = UAT_TABS.find(t => t.id === activeTab)!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A0A4A] via-[#2D1275] to-[#3D1A8E] flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
        backgroundSize: '32px 32px',
      }} aria-hidden="true" />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
            <Zap className="h-7 w-7 text-brand-orange" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-white">फटाक</span>
            <span className="text-brand-orange">PAY</span>
          </h1>
          <p className="text-white/60 text-sm mt-1 font-medium tracking-wide uppercase">Ticket Management System</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-lg font-bold text-text-primary mb-1">Welcome back</h2>
          <p className="text-sm text-text-muted mb-6">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <Input
              label="Email address" type="email" placeholder="you@fatakpay.com"
              error={errors.email?.message} autoComplete="email"
              {...register('email')} data-testid="email-input"
            />
            <Input
              label="Password" type="password" placeholder="Enter your password"
              error={errors.password?.message} autoComplete="current-password"
              {...register('password')} data-testid="password-input"
            />
            <Button type="submit" variant="primary" className="w-full mt-2"
              isLoading={isLoading} leftIcon={<LogIn className="h-4 w-4" />} data-testid="login-btn">
              Sign in
            </Button>
          </form>

          {/* UAT Panel */}
          <div className="mt-6 pt-5 border-t border-surface-border">
            <button
              type="button"
              onClick={() => setShowUAT(v => !v)}
              className="w-full flex items-center justify-between text-xs font-semibold text-text-muted hover:text-text-primary transition-colors uppercase tracking-wide"
            >
              <span>UAT Test Accounts</span>
              {showUAT ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>

            {showUAT && (
              <div className="mt-3">
                {/* Role tabs */}
                <div className="flex gap-1 p-1 bg-surface-secondary rounded-lg mb-3">
                  {UAT_TABS.map(tab => (
                    <button
                      key={tab.id} type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                        activeTab === tab.id
                          ? 'bg-white text-brand-purple shadow-sm'
                          : 'text-text-muted hover:text-text-primary'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Account list */}
                <div className="max-h-48 overflow-y-auto space-y-1 scrollbar-thin">
                  {currentTab.accounts.map(acc => (
                    <button
                      key={acc.email} type="button"
                      onClick={() => fill(acc)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-surface-border hover:border-brand-purple/40 hover:bg-brand-purple-faint/40 transition-all text-left"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-text-primary truncate">{acc.label}</p>
                        {acc.dept && <p className="text-[10px] text-text-muted">{acc.dept}</p>}
                      </div>
                      <span className={`flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded ml-2 ${currentTab.badge}`}>
                        {currentTab.label}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-text-muted mt-2 text-center">Click any account to fill credentials</p>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-white/40 text-xs mt-6">
          © 2024 FatakPay Technologies Pvt Ltd
        </p>
      </div>
    </div>
  );
}
