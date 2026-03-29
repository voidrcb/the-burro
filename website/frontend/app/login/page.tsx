import { Suspense } from 'react';
import { LoginForm } from './LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md rounded-panel border border-text-strong/10 bg-white/90 p-8 shadow-soft">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">
            Operator Access
          </p>
          <h1 className="mt-2 font-display text-3xl text-text-strong">
            Sign in to Burro
          </h1>
          <p className="mt-3 text-sm text-text-muted">
            This area is for Chuck, Susan, and authorized operators only.
          </p>
        </div>

        <Suspense fallback={<LoginFormSkeleton />}>
          <LoginForm />
        </Suspense>

        <p className="mt-6 text-center text-xs text-text-muted">
          Need help? Contact RCB for account setup.
        </p>
      </div>
    </div>
  );
}

function LoginFormSkeleton() {
  return (
    <div className="mt-8 space-y-5 animate-pulse">
      <div className="h-10 bg-surface-base rounded-[12px]" />
      <div className="h-10 bg-surface-base rounded-[12px]" />
      <div className="h-12 bg-surface-base rounded-pill" />
    </div>
  );
}
