import { notFound } from 'next/navigation';

import { WorkshopRegistrationForm } from '@/components/workshop/WorkshopRegistrationForm';
import { getWorkshopIntakeSchema, getPublishedWorkshopProgramBySlug, listPublishedWorkshopPrograms } from '@/lib/content/workshops';

export async function generateStaticParams() {
  const workshops = await listPublishedWorkshopPrograms();
  return workshops.map((workshop) => ({ slug: workshop.slug }));
}

export default async function WorkshopRegisterPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { sessionId?: string };
}) {
  const workshop = await getPublishedWorkshopProgramBySlug(params.slug);
  if (!workshop) {
    notFound();
  }

  const intakeSchema = await getWorkshopIntakeSchema(workshop.intakeSchemaRef);
  const sessionId = searchParams?.sessionId ?? workshop.schedule[0]?.id;
  if (!sessionId) {
    notFound();
  }

  return <WorkshopRegistrationForm program={workshop} intakeSchema={intakeSchema} sessionId={sessionId} />;
}
