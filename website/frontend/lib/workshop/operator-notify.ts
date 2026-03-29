import { appendJsonLine, getDataPath } from '@/lib/server/repo';
import type { WorkshopRegistration } from '@/lib/workshop/types';

export async function notifyOperatorOfWorkshopRegistration(registration: WorkshopRegistration) {
  const notifiedAt = new Date().toISOString();
  await appendJsonLine(getDataPath('assistant-logs', 'workshop-registrations.jsonl'), {
    notifiedAt,
    registrationId: registration.id,
    workshopSlug: registration.workshopSlug,
    sessionId: registration.sessionId,
    guestEmail: registration.guestEmail,
  });

  return notifiedAt;
}
