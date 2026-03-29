import { MobileInspectionWorkflow } from '@/components/rental/MobileInspectionWorkflow';
import { listActiveRentalBookings } from '@/lib/rental/store';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Equipment Inspection | Big Bend Burro',
  description: 'Mobile-first inspection workflow for equipment checkout and checkin.',
};

export default async function InspectionPage() {
  const bookings = await listActiveRentalBookings();

  // Filter bookings that need inspection
  const needsCheckout = bookings.filter(
    (b) => b.state === 'delivered' && !b.checkoutInspectionId
  );
  const needsCheckin = bookings.filter(
    (b) => b.state === 'returned' && !b.checkinInspectionId
  );

  return (
    <div className="min-h-screen bg-surface-base">
      {/* Mobile-optimized header */}
      <header className="sticky top-0 z-10 border-b border-text-strong/10 bg-white/95 px-4 py-3 backdrop-blur">
        <h1 className="font-display text-xl text-text-strong">Equipment Inspection</h1>
        <p className="text-sm text-text-muted">Mobile-first field workflow</p>
      </header>

      <main className="p-4">
        <MobileInspectionWorkflow
          checkoutBookings={needsCheckout}
          checkinBookings={needsCheckin}
        />
      </main>
    </div>
  );
}
