import type { WorkshopProgram } from '@/lib/workshop/content-types';
import type { WorkshopRegistration } from '@/lib/workshop/types';

import { storeWorkshopEmailCapture } from '@/lib/workshop/store';

export async function sendWorkshopConfirmation(program: WorkshopProgram, registration: WorkshopRegistration) {
  const capture = await storeWorkshopEmailCapture({
    template: 'workshop-confirmation',
    recipient: registration.guestEmail,
    subject: `Workshop confirmation for ${program.title}`,
    registrationId: registration.id,
    payload: {
      workshopSlug: registration.workshopSlug,
      sessionId: registration.sessionId,
      guestName: registration.guestName,
      registeredAt: registration.registeredAt,
      intakeSchemaRef: registration.intakeSchemaRef,
    },
  });

  return {
    mode: 'scaffold' as const,
    capture,
  };
}
