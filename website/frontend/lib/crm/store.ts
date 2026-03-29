import { randomUUID } from 'crypto';
import { readdir } from 'fs/promises';
import path from 'path';

import { getDataPath, readJsonFile, writeJsonFile } from '@/lib/server/repo';

import {
  customerProfileSchema,
  recommendationRuleSchema,
  recommendationSchema,
  lifecycleAutomationSchema,
  scheduledAutomationRunSchema,
  type CustomerProfile,
  type RecommendationRule,
  type Recommendation,
  type LifecycleAutomation,
  type ScheduledAutomationRun,
  type CommunicationPreferences,
} from './types';
import { normalizeGuestEmail } from './events';
import { getEventHistory, getEventCountsByType, getEventDateRange } from './history';

// ============================================================================
// Path Helpers
// ============================================================================

function getProfilePath(id: string): string {
  return getDataPath('crm', 'profiles', `${id}.json`);
}

function getRecommendationRulePath(id: string): string {
  return getDataPath('crm', 'rules', `${id}.json`);
}

function getRecommendationPath(id: string): string {
  return getDataPath('crm', 'recommendations', `${id}.json`);
}

function getAutomationPath(id: string): string {
  return getDataPath('crm', 'automations', `${id}.json`);
}

function getScheduledRunPath(id: string): string {
  return getDataPath('crm', 'scheduled-runs', `${id}.json`);
}

// ============================================================================
// ID Generators
// ============================================================================

function generateProfileId(): string {
  return `profile_${Date.now()}_${randomUUID().slice(0, 8)}`;
}

function generateRuleId(): string {
  return `rule_${Date.now()}_${randomUUID().slice(0, 8)}`;
}

function generateRecommendationId(): string {
  return `rec_${Date.now()}_${randomUUID().slice(0, 8)}`;
}

function generateAutomationId(): string {
  return `auto_${Date.now()}_${randomUUID().slice(0, 8)}`;
}

function generateScheduledRunId(): string {
  return `run_${Date.now()}_${randomUUID().slice(0, 8)}`;
}

// ============================================================================
// Customer Profile Operations per A-3.2.1
// ============================================================================

export async function createCustomerProfile(
  payload: {
    primaryEmail: string;
    aliasEmails?: string[];
    externalIds?: CustomerProfile['externalIds'];
    displayName?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    tags?: string[];
    communicationPreferences?: Partial<CommunicationPreferences>;
    createdBy?: string;
  }
): Promise<CustomerProfile> {
  const now = new Date().toISOString();
  const normalizedEmail = normalizeGuestEmail(payload.primaryEmail);

  // Check for existing profile with same email
  const existing = await getProfileByEmail(normalizedEmail);
  if (existing) {
    throw new Error(`Profile already exists for email: ${normalizedEmail}`);
  }

  const profile = customerProfileSchema.parse({
    ...payload,
    profileId: generateProfileId(),
    primaryEmail: normalizedEmail,
    aliasEmails: (payload.aliasEmails ?? []).map(normalizeGuestEmail),
    externalIds: payload.externalIds ?? [],
    tags: payload.tags ?? [],
    communicationPreferences: {
      marketingOptIn: false,
      workshopNotifications: true,
      followUpAllowed: true,
      unsubscribedAt: null,
      ...payload.communicationPreferences,
    },
    mergeHistory: [],
    createdAt: now,
    updatedAt: now,
  });

  await writeJsonFile(getProfilePath(profile.profileId), profile);
  return profile;
}

export async function getProfile(profileId: string): Promise<CustomerProfile | null> {
  const data = await readJsonFile<unknown>(getProfilePath(profileId), null);
  if (!data) return null;

  const parsed = customerProfileSchema.safeParse(data);
  return parsed.success ? parsed.data : null;
}

export async function getProfileByEmail(email: string): Promise<CustomerProfile | null> {
  const normalizedEmail = normalizeGuestEmail(email);
  const profiles = await listProfiles();

  // Check primary and alias emails
  return profiles.find((p) =>
    p.primaryEmail === normalizedEmail ||
    p.aliasEmails.includes(normalizedEmail)
  ) ?? null;
}

export async function updateProfile(
  profileId: string,
  updates: Partial<CustomerProfile>
): Promise<CustomerProfile | null> {
  const existing = await getProfile(profileId);
  if (!existing) return null;

  const updated = customerProfileSchema.parse({
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  });

  await writeJsonFile(getProfilePath(profileId), updated);
  return updated;
}

export async function listProfiles(): Promise<CustomerProfile[]> {
  const directory = getDataPath('crm', 'profiles');
  const entries = await readdir(directory).catch(() => [] as string[]);
  const files = entries.filter((f) => f.endsWith('.json'));
  const profiles: CustomerProfile[] = [];

  for (const file of files) {
    const data = await readJsonFile<unknown>(path.join(directory, file), null);
    const parsed = customerProfileSchema.safeParse(data);
    if (parsed.success) {
      profiles.push(parsed.data);
    }
  }

  return profiles.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getOrCreateProfile(email: string): Promise<CustomerProfile> {
  const existing = await getProfileByEmail(email);
  if (existing) return existing;

  return createCustomerProfile({
    primaryEmail: email,
  });
}

export async function mergeProfiles(
  targetProfileId: string,
  sourceProfileId: string,
  mergedBy: string,
  reason?: string
): Promise<CustomerProfile | null> {
  const target = await getProfile(targetProfileId);
  const source = await getProfile(sourceProfileId);

  if (!target || !source) {
    throw new Error('Both profiles must exist for merge');
  }

  const now = new Date().toISOString();

  // Merge alias emails
  const allAliases = new Set([
    ...target.aliasEmails,
    source.primaryEmail,
    ...source.aliasEmails,
  ]);
  allAliases.delete(target.primaryEmail);

  // Merge external IDs
  const allExternalIds = [...target.externalIds, ...source.externalIds];

  // Merge tags
  const allTags = [...new Set([...target.tags, ...source.tags])];

  // Count migrated events
  const sourceEvents = await getEventHistory({ email: source.primaryEmail });
  const eventsMigrated = sourceEvents.length;

  // Update target profile
  const updated = customerProfileSchema.parse({
    ...target,
    aliasEmails: Array.from(allAliases),
    externalIds: allExternalIds,
    tags: allTags,
    mergeHistory: [
      ...target.mergeHistory,
      {
        mergedProfileId: source.profileId,
        mergedEmail: source.primaryEmail,
        mergedAt: now,
        mergedBy,
        reason,
        eventsMigrated,
      },
    ],
    updatedAt: now,
  });

  await writeJsonFile(getProfilePath(targetProfileId), updated);

  // Note: Source profile could be deleted or marked as merged
  // For safety, we leave it intact with a note

  return updated;
}

export async function updateCommunicationPreferences(
  profileId: string,
  preferences: Partial<CommunicationPreferences>
): Promise<CustomerProfile | null> {
  const profile = await getProfile(profileId);
  if (!profile) return null;

  const now = new Date().toISOString();
  const updated = customerProfileSchema.parse({
    ...profile,
    communicationPreferences: {
      ...profile.communicationPreferences,
      ...preferences,
      consentUpdatedAt: now,
    },
    updatedAt: now,
  });

  await writeJsonFile(getProfilePath(profileId), updated);
  return updated;
}

export async function unsubscribeProfile(
  profileId: string,
  reason?: string
): Promise<CustomerProfile | null> {
  return updateCommunicationPreferences(profileId, {
    marketingOptIn: false,
    unsubscribedAt: new Date().toISOString(),
    unsubscribeReason: reason,
  });
}

// ============================================================================
// Profile Stats (Computed)
// ============================================================================

export async function computeProfileStats(profileId: string): Promise<CustomerProfile['stats']> {
  const profile = await getProfile(profileId);
  if (!profile) {
    return undefined;
  }

  const events = await getEventHistory({ email: profile.primaryEmail });
  const counts = await getEventCountsByType(profile.primaryEmail);
  const dateRange = await getEventDateRange(profile.primaryEmail);

  // Calculate lifetime value from purchases and bookings
  let lifetimeValue = 0;
  for (const event of events) {
    const amount = (event.metadata?.amount as number) ?? 0;
    lifetimeValue += amount;
  }

  return {
    totalBookings: counts['booking'] ?? 0,
    totalWorkshops: counts['registration'] ?? 0,
    totalPurchases: counts['purchase'] ?? 0,
    firstEventAt: dateRange.firstEventAt,
    lastEventAt: dateRange.lastEventAt,
    lifetimeValueUsd: lifetimeValue,
  };
}

// ============================================================================
// Recommendation Rules per A-3.2.3
// ============================================================================

export async function createRecommendationRule(
  payload: Omit<RecommendationRule, 'id' | 'createdAt' | 'updatedAt'>
): Promise<RecommendationRule> {
  const now = new Date().toISOString();
  const rule = recommendationRuleSchema.parse({
    ...payload,
    id: generateRuleId(),
    createdAt: now,
    updatedAt: now,
  });

  await writeJsonFile(getRecommendationRulePath(rule.id), rule);
  return rule;
}

export async function getRecommendationRule(id: string): Promise<RecommendationRule | null> {
  const data = await readJsonFile<unknown>(getRecommendationRulePath(id), null);
  if (!data) return null;

  const parsed = recommendationRuleSchema.safeParse(data);
  return parsed.success ? parsed.data : null;
}

export async function listRecommendationRules(options?: {
  enabledOnly?: boolean;
}): Promise<RecommendationRule[]> {
  const directory = getDataPath('crm', 'rules');
  const entries = await readdir(directory).catch(() => [] as string[]);
  const files = entries.filter((f) => f.endsWith('.json'));
  const rules: RecommendationRule[] = [];

  for (const file of files) {
    const data = await readJsonFile<unknown>(path.join(directory, file), null);
    const parsed = recommendationRuleSchema.safeParse(data);
    if (parsed.success) {
      if (options?.enabledOnly && !parsed.data.enabled) continue;
      rules.push(parsed.data);
    }
  }

  // Sort by priority (higher first)
  return rules.sort((a, b) => b.priority - a.priority);
}

export async function updateRecommendationRule(
  id: string,
  updates: Partial<RecommendationRule>
): Promise<RecommendationRule | null> {
  const existing = await getRecommendationRule(id);
  if (!existing) return null;

  const updated = recommendationRuleSchema.parse({
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  });

  await writeJsonFile(getRecommendationRulePath(id), updated);
  return updated;
}

// ============================================================================
// Recommendations
// ============================================================================

export async function createRecommendation(
  payload: Omit<Recommendation, 'id' | 'generatedAt' | 'dismissed' | 'accepted'>
): Promise<Recommendation> {
  const rec = recommendationSchema.parse({
    ...payload,
    id: generateRecommendationId(),
    generatedAt: new Date().toISOString(),
    dismissed: false,
    accepted: false,
  });

  await writeJsonFile(getRecommendationPath(rec.id), rec);
  return rec;
}

export async function listRecommendations(options?: {
  profileId?: string;
  includeDismissed?: boolean;
}): Promise<Recommendation[]> {
  const directory = getDataPath('crm', 'recommendations');
  const entries = await readdir(directory).catch(() => [] as string[]);
  const files = entries.filter((f) => f.endsWith('.json'));
  const recs: Recommendation[] = [];

  for (const file of files) {
    const data = await readJsonFile<unknown>(path.join(directory, file), null);
    const parsed = recommendationSchema.safeParse(data);
    if (parsed.success) {
      if (options?.profileId && parsed.data.profileId !== options.profileId) continue;
      if (!options?.includeDismissed && parsed.data.dismissed) continue;
      recs.push(parsed.data);
    }
  }

  return recs.sort((a, b) => b.generatedAt.localeCompare(a.generatedAt));
}

export async function dismissRecommendation(id: string): Promise<Recommendation | null> {
  const directory = getDataPath('crm', 'recommendations');
  const data = await readJsonFile<unknown>(path.join(directory, `${id}.json`), null);
  if (!data) return null;

  const parsed = recommendationSchema.safeParse(data);
  if (!parsed.success) return null;

  const updated = recommendationSchema.parse({
    ...parsed.data,
    dismissed: true,
    dismissedAt: new Date().toISOString(),
  });

  await writeJsonFile(getRecommendationPath(id), updated);
  return updated;
}

export async function acceptRecommendation(id: string): Promise<Recommendation | null> {
  const directory = getDataPath('crm', 'recommendations');
  const data = await readJsonFile<unknown>(path.join(directory, `${id}.json`), null);
  if (!data) return null;

  const parsed = recommendationSchema.safeParse(data);
  if (!parsed.success) return null;

  const updated = recommendationSchema.parse({
    ...parsed.data,
    accepted: true,
    acceptedAt: new Date().toISOString(),
  });

  await writeJsonFile(getRecommendationPath(id), updated);
  return updated;
}

// ============================================================================
// Lifecycle Automations per A-3.2.5
// ============================================================================

export async function createLifecycleAutomation(
  payload: Omit<LifecycleAutomation, 'id' | 'createdAt' | 'updatedAt'>
): Promise<LifecycleAutomation> {
  const now = new Date().toISOString();
  const automation = lifecycleAutomationSchema.parse({
    ...payload,
    id: generateAutomationId(),
    createdAt: now,
    updatedAt: now,
  });

  await writeJsonFile(getAutomationPath(automation.id), automation);
  return automation;
}

export async function listLifecycleAutomations(options?: {
  status?: LifecycleAutomation['status'];
}): Promise<LifecycleAutomation[]> {
  const directory = getDataPath('crm', 'automations');
  const entries = await readdir(directory).catch(() => [] as string[]);
  const files = entries.filter((f) => f.endsWith('.json'));
  const automations: LifecycleAutomation[] = [];

  for (const file of files) {
    const data = await readJsonFile<unknown>(path.join(directory, file), null);
    const parsed = lifecycleAutomationSchema.safeParse(data);
    if (parsed.success) {
      if (options?.status && parsed.data.status !== options.status) continue;
      automations.push(parsed.data);
    }
  }

  return automations;
}

// ============================================================================
// Scheduled Automation Runs
// ============================================================================

export async function scheduleAutomationRun(
  payload: Omit<ScheduledAutomationRun, 'id' | 'status' | 'createdAt'>
): Promise<ScheduledAutomationRun> {
  const run = scheduledAutomationRunSchema.parse({
    ...payload,
    id: generateScheduledRunId(),
    status: 'pending',
    createdAt: new Date().toISOString(),
  });

  await writeJsonFile(getScheduledRunPath(run.id), run);
  return run;
}

export async function listPendingRuns(): Promise<ScheduledAutomationRun[]> {
  const directory = getDataPath('crm', 'scheduled-runs');
  const entries = await readdir(directory).catch(() => [] as string[]);
  const files = entries.filter((f) => f.endsWith('.json'));
  const runs: ScheduledAutomationRun[] = [];

  const now = new Date().toISOString();

  for (const file of files) {
    const data = await readJsonFile<unknown>(path.join(directory, file), null);
    const parsed = scheduledAutomationRunSchema.safeParse(data);
    if (parsed.success && parsed.data.status === 'pending' && parsed.data.scheduledFor <= now) {
      runs.push(parsed.data);
    }
  }

  return runs.sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor));
}
