import { randomUUID } from 'crypto';
import { readdir } from 'fs/promises';
import path from 'path';

import { getDataPath, getCmsPath, readJsonFile, writeJsonFile } from '@/lib/server/repo';
import { logAnalyticsEvent } from '@/lib/analytics/store';

import { createTransition, applyTransition } from './state-machine';
import {
  commissionRuleSchema,
  localMakerGoodsRefSchema,
  marketplaceItemSchema,
  partnerExperienceLinkSchema,
  partnerRecordSchema,
  type CommissionRule,
  type LocalMakerGoodsRef,
  type MarketplaceItem,
  type MarketplacePublicationState,
  type PartnerApprovalStatus,
  type PartnerExperienceLink,
  type PartnerRecord,
} from './types';

// Path helpers
function getPartnerPath(id: string): string {
  return getDataPath('partners', `${id}.json`);
}

function getMarketplaceItemPath(id: string): string {
  return getDataPath('marketplace', `${id}.json`);
}

function getCommissionRulePath(id: string): string {
  return getDataPath('commission-rules', `${id}.json`);
}

function getPartnerExperienceLinkPath(experienceId: string): string {
  return getDataPath('partner-experience-links', `${experienceId}.json`);
}

function getLocalMakerGoodsPath(id: string): string {
  return getCmsPath('marketplace', 'local-makers', `${id}.json`);
}

// ID generators
function generatePartnerId(): string {
  return `partner_${Date.now()}_${randomUUID().slice(0, 8)}`;
}

function generateMarketplaceItemId(): string {
  return `mkt_${Date.now()}_${randomUUID().slice(0, 8)}`;
}

function generateCommissionRuleId(): string {
  return `comm_${Date.now()}_${randomUUID().slice(0, 8)}`;
}

function generateGateId(): string {
  return `gate_${Date.now()}_${randomUUID().slice(0, 8)}`;
}

function generateLocalMakerGoodsId(): string {
  return `lmg_${Date.now()}_${randomUUID().slice(0, 8)}`;
}

// Partner Record Operations

export async function createPartner(
  payload: Omit<PartnerRecord, 'id' | 'approvalStatusHistory' | 'createdAt' | 'updatedAt'>
): Promise<PartnerRecord> {
  const now = new Date().toISOString();
  const partner = partnerRecordSchema.parse({
    ...payload,
    id: generatePartnerId(),
    approvalStatusHistory: [
      {
        status: payload.approvalStatus,
        changedAt: now,
        changedBy: payload.onboardedBy ?? 'system',
        reason: 'Initial registration',
      },
    ],
    createdAt: now,
    updatedAt: now,
  });

  await writeJsonFile(getPartnerPath(partner.id), partner);

  // Log analytics event per HF-2408
  await logAnalyticsEvent('assistant_interaction', '/api/partners', {
    metadata: {
      action: 'partner_onboarded',
      partnerId: partner.id,
      category: partner.category,
    },
  });

  return partner;
}

export async function getPartner(id: string): Promise<PartnerRecord | null> {
  const data = await readJsonFile<unknown>(getPartnerPath(id), null);
  if (!data) return null;

  const parsed = partnerRecordSchema.safeParse(data);
  return parsed.success ? parsed.data : null;
}

export async function getPartnerBySlug(slug: string): Promise<PartnerRecord | null> {
  const all = await listPartners();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function updatePartner(
  id: string,
  updates: Partial<PartnerRecord>
): Promise<PartnerRecord | null> {
  const existing = await getPartner(id);
  if (!existing) return null;

  const updated = partnerRecordSchema.parse({
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  });

  await writeJsonFile(getPartnerPath(id), updated);
  return updated;
}

export async function updatePartnerApprovalStatus(
  id: string,
  newStatus: PartnerApprovalStatus,
  changedBy: string,
  reason?: string
): Promise<PartnerRecord | null> {
  const existing = await getPartner(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const updated = partnerRecordSchema.parse({
    ...existing,
    approvalStatus: newStatus,
    approvalStatusHistory: [
      ...existing.approvalStatusHistory,
      {
        status: newStatus,
        changedAt: now,
        changedBy,
        reason,
      },
    ],
    updatedAt: now,
  });

  await writeJsonFile(getPartnerPath(id), updated);
  return updated;
}

export async function listPartners(filter?: {
  status?: PartnerApprovalStatus;
  category?: PartnerRecord['category'];
}): Promise<PartnerRecord[]> {
  const directory = getDataPath('partners');
  const entries = await readdir(directory).catch(() => [] as string[]);
  const files = entries.filter((entry) => entry.endsWith('.json'));
  const records: PartnerRecord[] = [];

  for (const fileName of files) {
    const data = await readJsonFile<unknown>(path.join(directory, fileName), null);
    const parsed = partnerRecordSchema.safeParse(data);
    if (parsed.success) {
      let include = true;
      if (filter?.status && parsed.data.approvalStatus !== filter.status) {
        include = false;
      }
      if (filter?.category && parsed.data.category !== filter.category) {
        include = false;
      }
      if (include) {
        records.push(parsed.data);
      }
    }
  }

  return records.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listApprovedPartners(): Promise<PartnerRecord[]> {
  return listPartners({ status: 'approved' });
}

// Marketplace Item Operations

export async function createMarketplaceItem(
  payload: Omit<MarketplaceItem, 'id' | 'publicationState' | 'stateHistory' | 'createdAt' | 'updatedAt'>
): Promise<MarketplaceItem> {
  const now = new Date().toISOString();
  const initialTransition = createTransition(null, 'draft', 'system', 'Item created');

  const item = marketplaceItemSchema.parse({
    ...payload,
    id: generateMarketplaceItemId(),
    publicationState: 'draft',
    stateHistory: [initialTransition],
    createdAt: now,
    updatedAt: now,
  });

  await writeJsonFile(getMarketplaceItemPath(item.id), item);
  return item;
}

export async function getMarketplaceItem(id: string): Promise<MarketplaceItem | null> {
  const data = await readJsonFile<unknown>(getMarketplaceItemPath(id), null);
  if (!data) return null;

  const parsed = marketplaceItemSchema.safeParse(data);
  return parsed.success ? parsed.data : null;
}

export async function transitionMarketplaceItemState(
  id: string,
  toState: MarketplacePublicationState,
  operatorId: string,
  notes?: string
): Promise<MarketplaceItem> {
  const item = await getMarketplaceItem(id);
  if (!item) {
    throw new Error(`Marketplace item not found: ${id}`);
  }

  const result = applyTransition(item, toState, operatorId, notes);
  if (!result.success || !result.item) {
    throw new Error(result.error ?? 'State transition failed');
  }

  await writeJsonFile(getMarketplaceItemPath(id), result.item);

  // Log analytics event for publication per HF-2408
  if (toState === 'published') {
    await logAnalyticsEvent('assistant_interaction', '/api/marketplace', {
      metadata: {
        action: 'marketplace_item_published',
        itemId: id,
        partnerId: result.item.partnerId,
        itemType: result.item.itemType,
      },
    });
  }

  return result.item;
}

export async function listMarketplaceItems(filter?: {
  partnerId?: string;
  itemType?: MarketplaceItem['itemType'];
  state?: MarketplacePublicationState;
}): Promise<MarketplaceItem[]> {
  const directory = getDataPath('marketplace');
  const entries = await readdir(directory).catch(() => [] as string[]);
  const files = entries.filter((entry) => entry.endsWith('.json'));
  const records: MarketplaceItem[] = [];

  for (const fileName of files) {
    const data = await readJsonFile<unknown>(path.join(directory, fileName), null);
    const parsed = marketplaceItemSchema.safeParse(data);
    if (parsed.success) {
      let include = true;
      if (filter?.partnerId && parsed.data.partnerId !== filter.partnerId) {
        include = false;
      }
      if (filter?.itemType && parsed.data.itemType !== filter.itemType) {
        include = false;
      }
      if (filter?.state && parsed.data.publicationState !== filter.state) {
        include = false;
      }
      if (include) {
        records.push(parsed.data);
      }
    }
  }

  return records.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listPublishedMarketplaceItems(): Promise<MarketplaceItem[]> {
  return listMarketplaceItems({ state: 'published' });
}

export async function listPendingReviewItems(): Promise<MarketplaceItem[]> {
  return listMarketplaceItems({ state: 'pending_review' });
}

// Commission Rule Operations

export async function createCommissionRule(
  payload: Omit<CommissionRule, 'id' | 'createdAt' | 'updatedAt'>
): Promise<CommissionRule> {
  const now = new Date().toISOString();
  const rule = commissionRuleSchema.parse({
    ...payload,
    id: generateCommissionRuleId(),
    createdAt: now,
    updatedAt: now,
  });

  await writeJsonFile(getCommissionRulePath(rule.id), rule);
  return rule;
}

export async function getCommissionRule(id: string): Promise<CommissionRule | null> {
  const data = await readJsonFile<unknown>(getCommissionRulePath(id), null);
  if (!data) return null;

  const parsed = commissionRuleSchema.safeParse(data);
  return parsed.success ? parsed.data : null;
}

export async function listCommissionRules(): Promise<CommissionRule[]> {
  const directory = getDataPath('commission-rules');
  const entries = await readdir(directory).catch(() => [] as string[]);
  const files = entries.filter((entry) => entry.endsWith('.json'));
  const records: CommissionRule[] = [];

  for (const fileName of files) {
    const data = await readJsonFile<unknown>(path.join(directory, fileName), null);
    const parsed = commissionRuleSchema.safeParse(data);
    if (parsed.success) {
      records.push(parsed.data);
    }
  }

  // Sort by priority (higher first), then by createdAt
  return records.sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return b.createdAt.localeCompare(a.createdAt);
  });
}

export async function getApplicableCommissionRule(
  partnerId: string,
  productType: CommissionRule['productType']
): Promise<CommissionRule | null> {
  const now = new Date().toISOString();
  const rules = await listCommissionRules();

  // Find applicable rule in priority order
  for (const rule of rules) {
    // Check validity period
    if (rule.validFrom > now) continue;
    if (rule.validTo && rule.validTo < now) continue;

    // Check partner match (specific partner or 'default')
    if (rule.partnerId !== partnerId && rule.partnerId !== 'default') continue;

    // Check product type match
    if (rule.productType !== productType && rule.productType !== 'all') continue;

    return rule;
  }

  return null;
}

// Partner Experience Link Operations per A-2.4.2

export async function linkPartnerToExperience(
  experienceId: string,
  partnerId: string,
  linkedBy: string,
  commissionRuleId?: string
): Promise<PartnerExperienceLink> {
  const now = new Date().toISOString();
  const link = partnerExperienceLinkSchema.parse({
    experienceId,
    partnerId,
    linkedAt: now,
    linkedBy,
    commissionRuleId,
  });

  await writeJsonFile(getPartnerExperienceLinkPath(experienceId), link);

  // Log analytics event per HF-2408
  await logAnalyticsEvent('assistant_interaction', '/api/partner-experiences', {
    metadata: {
      action: 'partner_experience_linked',
      experienceId,
      partnerId,
    },
  });

  return link;
}

export async function getPartnerExperienceLink(experienceId: string): Promise<PartnerExperienceLink | null> {
  const data = await readJsonFile<unknown>(getPartnerExperienceLinkPath(experienceId), null);
  if (!data) return null;

  const parsed = partnerExperienceLinkSchema.safeParse(data);
  return parsed.success ? parsed.data : null;
}

export async function listPartnerExperienceLinks(): Promise<PartnerExperienceLink[]> {
  const directory = getDataPath('partner-experience-links');
  const entries = await readdir(directory).catch(() => [] as string[]);
  const files = entries.filter((entry) => entry.endsWith('.json'));
  const records: PartnerExperienceLink[] = [];

  for (const fileName of files) {
    const data = await readJsonFile<unknown>(path.join(directory, fileName), null);
    const parsed = partnerExperienceLinkSchema.safeParse(data);
    if (parsed.success) {
      records.push(parsed.data);
    }
  }

  return records.sort((a, b) => b.linkedAt.localeCompare(a.linkedAt));
}

// Local Maker Goods Operations per A-2.4.5

export async function createLocalMakerGoodsRef(
  payload: Omit<LocalMakerGoodsRef, 'id' | 'createdAt' | 'updatedAt'>
): Promise<LocalMakerGoodsRef> {
  // Enforce single featured maker constraint per A-2.4.5
  if (payload.featured) {
    const existing = await listLocalMakerGoods();
    const currentFeatured = existing.find((g) => g.featured);
    if (currentFeatured) {
      throw new Error(`Only one featured maker allowed. Current featured: ${currentFeatured.name}`);
    }
  }

  const now = new Date().toISOString();
  const goods = localMakerGoodsRefSchema.parse({
    ...payload,
    id: generateLocalMakerGoodsId(),
    createdAt: now,
    updatedAt: now,
  });

  await writeJsonFile(getLocalMakerGoodsPath(goods.id), goods);
  return goods;
}

export async function getLocalMakerGoods(id: string): Promise<LocalMakerGoodsRef | null> {
  const data = await readJsonFile<unknown>(getLocalMakerGoodsPath(id), null);
  if (!data) return null;

  const parsed = localMakerGoodsRefSchema.safeParse(data);
  return parsed.success ? parsed.data : null;
}

export async function listLocalMakerGoods(): Promise<LocalMakerGoodsRef[]> {
  const directory = getCmsPath('marketplace', 'local-makers');
  const entries = await readdir(directory).catch(() => [] as string[]);
  const files = entries.filter((entry) => entry.endsWith('.json'));
  const records: LocalMakerGoodsRef[] = [];

  for (const fileName of files) {
    const data = await readJsonFile<unknown>(path.join(directory, fileName), null);
    const parsed = localMakerGoodsRefSchema.safeParse(data);
    if (parsed.success) {
      records.push(parsed.data);
    }
  }

  return records.sort((a, b) => {
    // Featured first, then by createdAt
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return b.createdAt.localeCompare(a.createdAt);
  });
}

export async function getFeaturedMaker(): Promise<LocalMakerGoodsRef | null> {
  const all = await listLocalMakerGoods();
  return all.find((g) => g.featured) ?? null;
}

// Export gate ID generator for orchestration store
export { generateGateId };
