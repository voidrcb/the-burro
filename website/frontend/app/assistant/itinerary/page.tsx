import { ItineraryWorkbench } from '@/components/assistant/ItineraryWorkbench';
import { listExperienceProducts, listPackagePricingRules } from '@/lib/content/experiences';
import { listUnits } from '@/lib/content/units';
import { listWorkshopPrograms } from '@/lib/content/workshops';
import { listGroupBookings, listItineraryDrafts } from '@/lib/itinerary/store';

export default async function AssistantItineraryPage() {
  const [units, workshops, experiences, drafts, groupBookings, pricingRules] = await Promise.all([
    listUnits(),
    listWorkshopPrograms(),
    listExperienceProducts(),
    listItineraryDrafts(),
    listGroupBookings(),
    listPackagePricingRules(),
  ]);

  return <ItineraryWorkbench units={units} workshops={workshops} experiences={experiences} drafts={drafts} groupBookings={groupBookings} pricingRules={pricingRules} />;
}
