import { LogoutButton } from '@/components/auth/LogoutButton';

export default function AssistantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-earth">
            Operator Dashboard
          </p>
          <p className="mt-1 text-sm text-text-muted">
            Internal tools for Chuck, Susan, and authorized operators
          </p>
        </div>
        <LogoutButton />
      </div>
      {children}
    </div>
  );
}
