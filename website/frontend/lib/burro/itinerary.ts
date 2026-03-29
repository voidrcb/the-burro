import { listBookableExperienceProducts } from '@/lib/content/experiences';
import { listAvailableUnits } from '@/lib/content/units';
import { listPublishedWorkshopPrograms } from '@/lib/content/workshops';
import { applyPricingRules, expandDateRange } from '@/lib/itinerary/engine';
import type { ItineraryComponent } from '@/lib/itinerary/types';

const templateKeywords = [
  { id: 'template_weekend_stargazing', label: 'Weekend Stargazing Reset', keywords: ['stars', 'stargazing', 'night', 'sky', 'photography'] },
  { id: 'template_river_retreat', label: 'River + Dark Sky Retreat', keywords: ['river', 'paddle', 'boquillas', 'water'] },
  { id: 'template_craft_retreat', label: 'Craft and Slow Mornings', keywords: ['craft', 'tile', 'pottery', 'maker'] },
];

function detectTemplate(prompt: string): { id: string; label: string } {
  const lowered = prompt.toLowerCase();
  return templateKeywords.find((template) => template.keywords.some((keyword) => lowered.includes(keyword))) ?? templateKeywords[0];
}

export async function generateBurroDraft(payload: {
  prompt: string;
  title?: string;
  guestName?: string;
  guestEmail?: string;
  startDate: string;
  endDate: string;
  participantCount: number;
}) {
  const [units, workshops, experiences] = await Promise.all([
    listAvailableUnits(),
    listPublishedWorkshopPrograms(),
    listBookableExperienceProducts(),
  ]);

  const template = detectTemplate(payload.prompt);
  const lowered = payload.prompt.toLowerCase();
  const chosenExperience =
    experiences.find((experience) => lowered.includes(experience.category.replace('_', ' '))) ??
    experiences.find((experience) => template.label.toLowerCase().includes(experience.category.replace('_', ' '))) ??
    experiences[0];

  const chosenUnit = units[0];
  const chosenWorkshop =
    lowered.includes('workshop') || lowered.includes('craft') || lowered.includes('photo')
      ? workshops.find((workshop) => (lowered.includes('craft') ? workshop.category === 'craft' : true)) ?? workshops[0]
      : null;

  if (!chosenUnit || !chosenExperience) {
    throw new Error('Burro could not assemble a draft because no units or experience products are published yet.');
  }

  const dateSpan = expandDateRange(payload.startDate, payload.endDate);
  const components: ItineraryComponent[] = [
    {
      type: 'lodging',
      refId: chosenUnit.id,
      title: chosenUnit.name,
      dates: dateSpan,
      quantity: 1,
      priceAtDraft: 225 * Math.max(1, dateSpan.length - 1),
      holdStatus: 'pending',
      notes: 'Base lodging anchor selected from current public stay inventory.',
    },
    {
      type: 'experience',
      refId: chosenExperience.id,
      title: chosenExperience.name,
      dates: [payload.startDate],
      quantity: Math.max(1, payload.participantCount),
      priceAtDraft: chosenExperience.priceUsd * Math.max(1, payload.participantCount),
      holdStatus: 'pending',
      notes: `Burro matched the prompt to ${chosenExperience.category}.`,
    },
  ];

  if (chosenWorkshop?.schedule[0]) {
    components.push({
      type: 'workshop',
      refId: `${chosenWorkshop.slug}::${chosenWorkshop.schedule[0].id}`,
      title: chosenWorkshop.title,
      dates: [chosenWorkshop.schedule[0].date],
      quantity: Math.max(1, Math.min(payload.participantCount, chosenWorkshop.capacity.max)),
      priceAtDraft: chosenWorkshop.pricing.basePrice * Math.max(1, payload.participantCount),
      holdStatus: 'pending',
      notes: 'Optional workshop anchor added because the preference prompt signaled a guided session.',
    });
  }

  const pricing = await applyPricingRules(components, undefined, payload.participantCount, payload.startDate);

  return {
    title: payload.title ?? `${template.label} draft`,
    source: 'burro' as const,
    templateRef: template.id,
    dateRange: {
      start: payload.startDate,
      end: payload.endDate,
    },
    components,
    totalPrice: pricing.totalPrice,
    pricingRuleIds: pricing.pricingRuleIds,
    status: 'pending_review' as const,
    guestName: payload.guestName,
    guestEmail: payload.guestEmail,
    notes: payload.prompt,
    fallbackSuggestions: [
      'Keep a second partner-led experience ready in case weather or staffing changes.',
      'Share the printable itinerary link before committing any manual partner outreach.',
    ],
    validationNotes: [
      'Burro-generated itineraries remain internal-first and require operator approval before they become commitments.',
    ],
  };
}
