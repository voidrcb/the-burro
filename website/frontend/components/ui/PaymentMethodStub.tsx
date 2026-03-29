import { ComingSoonBadge } from './ComingSoonBadge';

interface PaymentMethodStubProps {
  className?: string;
}

const paymentMethods = [
  {
    id: 'credit-card',
    name: 'Credit Card',
    description: 'Visa, Mastercard, Amex',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        />
      </svg>
    ),
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Pay with your PayPal account',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7.076 21.337H2.47a.641.641 0 01-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797H9.603c-.725 0-1.142.457-1.265 1.136l-.993 5.95-.155.92h-1.04a.641.641 0 01-.074 0z" />
      </svg>
    ),
  },
  {
    id: 'venmo',
    name: 'Venmo',
    description: 'Pay with Venmo',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.5 3c.67 1.05 1.5 2.7 1.5 4.35 0 4.05-3.3 9.3-6 12.9H7.35L4.5 3.75l6.3-.6.9 12.75c1.65-2.55 3.6-6.6 3.6-9.3 0-1.2-.3-2.25-.6-3l4.8-.6z" />
      </svg>
    ),
  },
  {
    id: 'zelle',
    name: 'Zelle',
    description: 'Direct bank transfer',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.559 24h-2.841a.483.483 0 01-.483-.483v-2.765H4.198a.483.483 0 01-.388-.777l9.561-12.528H5.07a.483.483 0 01-.483-.483V4.198a.483.483 0 01.483-.483h6.165V.483c0-.267.216-.483.483-.483h2.841c.267 0 .483.216.483.483v3.232h5.89c.365 0 .582.408.388.777L12.277 17.02h8.654c.267 0 .483.216.483.483v2.766a.483.483 0 01-.483.483h-7.372v2.765a.483.483 0 01-.483.483h-.517z" />
      </svg>
    ),
  },
];

export function PaymentMethodStub({ className }: PaymentMethodStubProps) {
  return (
    <div className={className}>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
          Payment Options
        </p>
        <ComingSoonBadge variant="inline" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className="relative rounded-[18px] border border-text-strong/10 bg-white/60 p-4 opacity-60"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-elevated text-text-muted">
                {method.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-text-strong">{method.name}</p>
                <p className="text-xs text-text-muted">{method.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-center text-xs text-text-muted">
        Secure payment processing coming soon. For now, submit your order request and we&apos;ll
        follow up directly to arrange payment.
      </p>
    </div>
  );
}
