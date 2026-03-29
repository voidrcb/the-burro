import { NextResponse } from 'next/server';

import { getWorkshopProgramBySlug } from '@/lib/content/workshops';
import { sendWorkshopConfirmation } from '@/lib/workshop/confirmation';
import { notifyOperatorOfWorkshopRegistration } from '@/lib/workshop/operator-notify';
import { createWorkshopRegistration, saveWorkshopRegistration } from '@/lib/workshop/store';

export async function POST(request: Request) {
  try {
    const registration = await createWorkshopRegistration(await request.json());
    const program = await getWorkshopProgramBySlug(registration.workshopSlug);
    if (!program) {
      throw new Error('Workshop program not found after registration.');
    }

    await sendWorkshopConfirmation(program, registration);
    const operatorNotifiedAt = await notifyOperatorOfWorkshopRegistration(registration);
    await saveWorkshopRegistration({
      ...registration,
      confirmationSent: true,
      notes: operatorNotifiedAt,
    });

    return NextResponse.json({ registrationId: registration.id, status: registration.status });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to register workshop guest.' }, { status: 400 });
  }
}
