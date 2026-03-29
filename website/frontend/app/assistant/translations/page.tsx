'use client';

import { useCallback, useEffect, useState } from 'react';

import type { TranslationRecord, TranslationStatus } from '@/lib/i18n/types';
import { TRANSLATION_NAMESPACES } from '@/lib/i18n/types';

const STATUS_LABELS: Record<TranslationStatus, string> = {
  draft: 'Draft',
  reviewed: 'Reviewed',
  approved: 'Approved',
  deprecated: 'Deprecated',
};

const STATUS_COLORS: Record<TranslationStatus, string> = {
  draft: 'bg-gray-100 text-gray-800',
  reviewed: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  deprecated: 'bg-red-100 text-red-800',
};

interface CoverageStats {
  total: number;
  draft: number;
  reviewed: number;
  approved: number;
  deprecated: number;
  coveragePercent: number;
}

export default function TranslationsPage() {
  const [translations, setTranslations] = useState<TranslationRecord[]>([]);
  const [coverage, setCoverage] = useState<CoverageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterNamespace, setFilterNamespace] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<TranslationStatus | 'all'>('all');
  const [selectedRecord, setSelectedRecord] = useState<TranslationRecord | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      // Load coverage stats
      const coverageRes = await fetch('/api/i18n/translations?locale=es&coverage=true');
      if (coverageRes.ok) {
        const coverageData = await coverageRes.json();
        setCoverage(coverageData.coverage);
      }

      // Load translations
      const params = new URLSearchParams({ locale: 'es' });
      if (filterNamespace !== 'all') params.set('namespace', filterNamespace);
      if (filterStatus !== 'all') params.set('status', filterStatus);

      const res = await fetch(`/api/i18n/translations?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load translations');

      const data = await res.json();
      setTranslations(data.translations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [filterNamespace, filterStatus]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleStatusTransition(record: TranslationRecord, newStatus: TranslationStatus) {
    try {
      const res = await fetch(`/api/i18n/translations/${record.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale: record.targetLocale,
          namespace: record.namespace,
          action: 'transition',
          newStatus,
          actorId: 'operator',
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Transition failed');
      }

      await loadData();
      setSelectedRecord(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transition failed');
    }
  }

  if (loading && translations.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Translation Management</h1>
        <div className="animate-pulse">Loading translations...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Translation Management</h1>
        {coverage && (
          <div className="text-sm">
            <span className="font-medium">{coverage.coveragePercent.toFixed(1)}%</span> coverage
            <span className="text-gray-500 ml-2">
              ({coverage.approved} approved / {coverage.total - coverage.deprecated} active)
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 text-sm underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Coverage Summary */}
      {coverage && (
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-white border rounded p-3 text-center">
            <div className="text-2xl font-bold">{coverage.total}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
          <div className="bg-gray-100 border rounded p-3 text-center">
            <div className="text-2xl font-bold">{coverage.draft}</div>
            <div className="text-xs text-gray-500">Draft</div>
          </div>
          <div className="bg-yellow-100 border rounded p-3 text-center">
            <div className="text-2xl font-bold">{coverage.reviewed}</div>
            <div className="text-xs text-gray-500">Reviewed</div>
          </div>
          <div className="bg-green-100 border rounded p-3 text-center">
            <div className="text-2xl font-bold">{coverage.approved}</div>
            <div className="text-xs text-gray-500">Approved</div>
          </div>
          <div className="bg-red-100 border rounded p-3 text-center">
            <div className="text-2xl font-bold">{coverage.deprecated}</div>
            <div className="text-xs text-gray-500">Deprecated</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Namespace
          </label>
          <select
            value={filterNamespace}
            onChange={(e) => setFilterNamespace(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="all">All Namespaces</option>
            {TRANSLATION_NAMESPACES.map((ns) => (
              <option key={ns} value={ns}>
                {ns}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as TranslationStatus | 'all')}
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Translation List */}
        <div>
          <h2 className="text-lg font-semibold mb-3">
            Translations ({translations.length})
          </h2>
          {translations.length === 0 ? (
            <div className="text-gray-500 text-center py-8 border rounded">
              No translations found. Translations will appear here when created.
            </div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {translations.map((record) => (
                <div
                  key={record.id}
                  onClick={() => setSelectedRecord(record)}
                  className={`border rounded p-3 cursor-pointer hover:bg-gray-50 ${
                    selectedRecord?.id === record.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <code className="text-sm text-gray-600 block truncate">
                        {record.sourceKey}
                      </code>
                      <p className="text-sm text-gray-400 truncate">
                        {record.sourceText}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-2">
                      <span className={`text-xs px-2 py-1 rounded ${STATUS_COLORS[record.status]}`}>
                        {STATUS_LABELS[record.status]}
                      </span>
                      {record.machineTranslated && !record.humanEdited && (
                        <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                          MT
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Translation Detail */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Details</h2>
          {selectedRecord ? (
            <div className="border rounded p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Key</label>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded block mt-1">
                  {selectedRecord.sourceKey}
                </code>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Namespace</label>
                <span className="text-sm">{selectedRecord.namespace}</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Source (English)</label>
                <p className="text-sm bg-gray-50 p-2 rounded mt-1">{selectedRecord.sourceText}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Translation (Spanish)</label>
                <p className="text-sm bg-blue-50 p-2 rounded mt-1">{selectedRecord.translatedText}</p>
              </div>

              <div className="flex gap-4 text-sm">
                <div>
                  <span className="font-medium">Machine Translated:</span>{' '}
                  {selectedRecord.machineTranslated ? 'Yes' : 'No'}
                </div>
                <div>
                  <span className="font-medium">Human Edited:</span>{' '}
                  {selectedRecord.humanEdited ? 'Yes' : 'No'}
                </div>
              </div>

              <div className="flex gap-2">
                <span className={`text-sm px-2 py-1 rounded ${STATUS_COLORS[selectedRecord.status]}`}>
                  {STATUS_LABELS[selectedRecord.status]}
                </span>
              </div>

              {/* Status Actions */}
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Actions</h4>
                <div className="flex gap-2 flex-wrap">
                  {selectedRecord.status === 'draft' && (
                    <button
                      onClick={() => handleStatusTransition(selectedRecord, 'reviewed')}
                      className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700"
                    >
                      Mark Reviewed
                    </button>
                  )}
                  {selectedRecord.status === 'reviewed' && (
                    <>
                      <button
                        onClick={() => handleStatusTransition(selectedRecord, 'approved')}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                        disabled={!selectedRecord.humanEdited && selectedRecord.namespace === 'policy'}
                        title={!selectedRecord.humanEdited && selectedRecord.namespace === 'policy' ? 'Policy content must be human-edited before approval' : ''}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusTransition(selectedRecord, 'draft')}
                        className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                      >
                        Return to Draft
                      </button>
                    </>
                  )}
                  {selectedRecord.status === 'approved' && (
                    <>
                      <button
                        onClick={() => handleStatusTransition(selectedRecord, 'deprecated')}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Deprecate
                      </button>
                      <button
                        onClick={() => handleStatusTransition(selectedRecord, 'draft')}
                        className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                      >
                        Revise (Draft)
                      </button>
                    </>
                  )}
                  {selectedRecord.status === 'deprecated' && (
                    <button
                      onClick={() => handleStatusTransition(selectedRecord, 'draft')}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Reactivate (Draft)
                    </button>
                  )}
                </div>
              </div>

              {/* Audit info */}
              {(selectedRecord.reviewedBy || selectedRecord.approvedBy) && (
                <div className="pt-4 border-t text-sm text-gray-500">
                  {selectedRecord.reviewedBy && (
                    <p>Reviewed by {selectedRecord.reviewedBy} at {selectedRecord.reviewedAt}</p>
                  )}
                  {selectedRecord.approvedBy && (
                    <p>Approved by {selectedRecord.approvedBy} at {selectedRecord.approvedAt}</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8 border rounded">
              Select a translation to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
