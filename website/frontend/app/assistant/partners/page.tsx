'use client';

import { useEffect, useState } from 'react';

import type { PartnerRecord } from '@/lib/partner/types';

type PartnerCategory = PartnerRecord['category'];
type PartnerApprovalStatus = PartnerRecord['approvalStatus'];

const CATEGORY_LABELS: Record<PartnerCategory, string> = {
  guide: 'Guide',
  artisan: 'Artisan',
  observatory: 'Observatory',
  preservation_org: 'Preservation Org',
  local_maker: 'Local Maker',
  hospitality: 'Hospitality',
  transport: 'Transport',
};

const STATUS_LABELS: Record<PartnerApprovalStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  suspended: 'Suspended',
  inactive: 'Inactive',
};

const STATUS_COLORS: Record<PartnerApprovalStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  suspended: 'bg-red-100 text-red-800',
  inactive: 'bg-gray-100 text-gray-800',
};

export default function PartnersPage() {
  const [partners, setPartners] = useState<PartnerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<PartnerApprovalStatus | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<PartnerCategory | 'all'>('all');

  useEffect(() => {
    async function loadPartners() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filterStatus !== 'all') params.set('status', filterStatus);
        if (filterCategory !== 'all') params.set('category', filterCategory);

        const response = await fetch(`/api/partners?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to load partners');

        const data = await response.json();
        setPartners(data.partners);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    loadPartners();
  }, [filterStatus, filterCategory]);

  async function handleStatusChange(partnerId: string, newStatus: PartnerApprovalStatus) {
    try {
      const response = await fetch(`/api/partners/${partnerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approvalStatus: newStatus,
          changedBy: 'operator',
          reason: `Status changed to ${newStatus}`,
        }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      const data = await response.json();
      setPartners((prev) =>
        prev.map((p) => (p.id === partnerId ? data.partner : p))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Partner Management</h1>
        <div className="animate-pulse">Loading partners...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Partner Management</h1>
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Partner Management</h1>
        <span className="text-sm text-gray-500">
          {partners.length} partner{partners.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as PartnerApprovalStatus | 'all')}
            className="border rounded px-3 py-2"
          >
            <option value="all">All Statuses</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as PartnerCategory | 'all')}
            className="border rounded px-3 py-2"
          >
            <option value="all">All Categories</option>
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Partner List */}
      {partners.length === 0 ? (
        <div className="text-gray-500 text-center py-8 border rounded">
          No partners found. Partners will appear here when onboarded.
        </div>
      ) : (
        <div className="space-y-4">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">{partner.displayName}</h2>
                  <p className="text-sm text-gray-600">{partner.legalName}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {CATEGORY_LABELS[partner.category]}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${STATUS_COLORS[partner.approvalStatus]}`}
                    >
                      {STATUS_LABELS[partner.approvalStatus]}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{partner.contact.email}</p>
                  <p className="text-xs text-gray-400">
                    {partner.contact.primaryContactName}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-4 pt-4 border-t flex gap-2">
                {partner.approvalStatus === 'pending' && (
                  <button
                    onClick={() => handleStatusChange(partner.id, 'approved')}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                )}
                {partner.approvalStatus === 'approved' && (
                  <button
                    onClick={() => handleStatusChange(partner.id, 'suspended')}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Suspend
                  </button>
                )}
                {partner.approvalStatus === 'suspended' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(partner.id, 'approved')}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Reinstate
                    </button>
                    <button
                      onClick={() => handleStatusChange(partner.id, 'inactive')}
                      className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                      Deactivate
                    </button>
                  </>
                )}
              </div>

              {/* Details */}
              <details className="mt-3">
                <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                  View Details
                </summary>
                <div className="mt-2 text-sm grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-medium">Revenue Model:</span>{' '}
                    {partner.revenueModel.replace('_', ' ')}
                  </div>
                  {partner.defaultCommissionRate !== undefined && (
                    <div>
                      <span className="font-medium">Commission:</span>{' '}
                      {(partner.defaultCommissionRate * 100).toFixed(1)}%
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Service Area:</span>{' '}
                    {partner.serviceArea ?? 'Not specified'}
                  </div>
                  <div>
                    <span className="font-medium">Can Publish:</span>{' '}
                    {partner.cmsRights.canPublish ? 'Yes' : 'No'}
                  </div>
                  <div>
                    <span className="font-medium">Insurance Verified:</span>{' '}
                    {partner.liability.insuranceVerified ? 'Yes' : 'No'}
                  </div>
                  <div>
                    <span className="font-medium">Waiver Accepted:</span>{' '}
                    {partner.liability.waiverAccepted ? 'Yes' : 'No'}
                  </div>
                </div>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
