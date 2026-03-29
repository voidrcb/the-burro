'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

import type { RentalBooking, InspectionPhoto } from '@/lib/rental/types';

interface WorkflowProps {
  checkoutBookings: RentalBooking[];
  checkinBookings: RentalBooking[];
}

type InspectionType = 'checkout' | 'checkin';
type PhotoAngle = 'front' | 'back' | 'left' | 'right' | 'console' | 'damage';

const REQUIRED_ANGLES: PhotoAngle[] = ['front', 'back', 'left', 'right', 'console'];
const ANGLE_LABELS: Record<PhotoAngle, string> = {
  front: 'Front View',
  back: 'Back View',
  left: 'Left Side',
  right: 'Right Side',
  console: 'Operator Console',
  damage: 'Damage Close-up',
};

interface CapturedPhoto {
  angle: PhotoAngle;
  dataUrl: string;
  capturedAt: string;
  notes?: string;
}

export function MobileInspectionWorkflow({ checkoutBookings, checkinBookings }: WorkflowProps) {
  const [selectedBooking, setSelectedBooking] = useState<RentalBooking | null>(null);
  const [inspectionType, setInspectionType] = useState<InspectionType | null>(null);
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [currentAngle, setCurrentAngle] = useState<PhotoAngle>('front');
  const [damageNoted, setDamageNoted] = useState(false);
  const [damageDescription, setDamageDescription] = useState('');
  const [operatorNotes, setOperatorNotes] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const allBookings = [
    ...checkoutBookings.map((b) => ({ ...b, _type: 'checkout' as const })),
    ...checkinBookings.map((b) => ({ ...b, _type: 'checkin' as const })),
  ];

  // Start inspection for a booking
  function startInspection(booking: RentalBooking, type: InspectionType) {
    setSelectedBooking(booking);
    setInspectionType(type);
    setPhotos([]);
    setCurrentAngle('front');
    setDamageNoted(false);
    setDamageDescription('');
    setOperatorNotes('');
    setCustomerName('');
    setError(null);
    setSuccess(false);
  }

  // Cancel and go back
  function cancelInspection() {
    stopCamera();
    setSelectedBooking(null);
    setInspectionType(null);
    setPhotos([]);
  }

  // Camera functions
  async function startCamera() {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Prefer back camera
        audio: false,
      });
      setStream(mediaStream);
      setCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Unable to access camera. Please use file upload instead.');
    }
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  }

  function captureFromCamera() {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);

    addPhoto(dataUrl);
    stopCamera();
  }

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      addPhoto(dataUrl);
    };
    reader.readAsDataURL(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function addPhoto(dataUrl: string) {
    const newPhoto: CapturedPhoto = {
      angle: currentAngle,
      dataUrl,
      capturedAt: new Date().toISOString(),
    };
    setPhotos((prev) => [...prev.filter((p) => p.angle !== currentAngle), newPhoto]);

    // Auto-advance to next required angle
    const capturedAngles = [...photos.map((p) => p.angle), currentAngle];
    const nextAngle = REQUIRED_ANGLES.find((a) => !capturedAngles.includes(a));
    if (nextAngle) {
      setCurrentAngle(nextAngle);
    }
  }

  function removePhoto(angle: PhotoAngle) {
    setPhotos((prev) => prev.filter((p) => p.angle !== angle));
  }

  // Submit inspection
  async function handleSubmit() {
    if (!selectedBooking || !inspectionType) return;

    // Validate required photos
    const capturedAngles = photos.map((p) => p.angle);
    const missingAngles = REQUIRED_ANGLES.filter((a) => !capturedAngles.includes(a));
    if (missingAngles.length > 0) {
      setError(`Missing required photos: ${missingAngles.map((a) => ANGLE_LABELS[a]).join(', ')}`);
      return;
    }

    if (damageNoted && !damageDescription.trim()) {
      setError('Please describe the damage noted.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Convert photos to API format
      const apiPhotos: InspectionPhoto[] = photos.map((p, idx) => ({
        id: `photo_${Date.now()}_${idx}`,
        url: p.dataUrl, // In production, upload to S3 first
        angle: p.angle,
        capturedAt: p.capturedAt,
        notes: p.notes,
      }));

      const response = await fetch('/api/rentals/inspection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: selectedBooking.id,
          type: inspectionType,
          photos: apiPhotos,
          operatorNotes: operatorNotes || undefined,
          damageNoted,
          damageDescription: damageNoted ? damageDescription : undefined,
          customerAcknowledged: !!customerName,
          customerSignature: customerName || undefined,
          capturedBy: 'mobile_operator',
          deviceInfo: navigator.userAgent,
          offlineQueued: false,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit inspection');
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit inspection');
    } finally {
      setSubmitting(false);
    }
  }

  // Success state
  if (success) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="mt-6 font-display text-2xl text-text-strong">Inspection Submitted</h2>
        <p className="mt-2 text-text-muted">
          {inspectionType === 'checkout' ? 'Equipment is now active.' : 'Equipment has been inspected.'}
        </p>
        <button
          onClick={cancelInspection}
          className="mt-8 rounded-full bg-text-strong px-6 py-3 text-sm font-semibold text-text-inverse"
        >
          Back to Inspections
        </button>
      </div>
    );
  }

  // Inspection form
  if (selectedBooking && inspectionType) {
    const capturedAngles = photos.map((p) => p.angle);
    const progress = (capturedAngles.length / REQUIRED_ANGLES.length) * 100;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-earth">
              {inspectionType === 'checkout' ? 'Checkout' : 'Checkin'} Inspection
            </p>
            <h2 className="mt-1 font-display text-xl text-text-strong">
              {selectedBooking.assetName}
            </h2>
          </div>
          <button
            onClick={cancelInspection}
            className="rounded-full border border-text-strong/20 px-4 py-2 text-sm text-text-muted"
          >
            Cancel
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-2 overflow-hidden rounded-full bg-text-strong/10">
          <div
            className="h-full bg-accent-earth transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center text-xs text-text-muted">
          {capturedAngles.length} of {REQUIRED_ANGLES.length} required photos captured
        </p>

        {/* Photo capture section */}
        <div className="rounded-[28px] border border-text-strong/10 bg-white p-4">
          <h3 className="text-sm font-semibold text-text-strong">
            Capture: {ANGLE_LABELS[currentAngle]}
          </h3>

          {/* Camera view or capture buttons */}
          {cameraActive ? (
            <div className="mt-4 space-y-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-[18px] bg-black"
              />
              <div className="flex gap-3">
                <button
                  onClick={captureFromCamera}
                  className="flex-1 rounded-full bg-accent-earth py-3 text-sm font-semibold text-white"
                >
                  Capture Photo
                </button>
                <button
                  onClick={stopCamera}
                  className="rounded-full border border-text-strong/20 px-4 py-3 text-sm text-text-muted"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                onClick={startCamera}
                className="flex flex-col items-center justify-center rounded-[18px] border-2 border-dashed border-text-strong/20 p-6 text-center transition-colors hover:border-accent-earth hover:bg-accent-earth/5"
              >
                <svg className="h-8 w-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="mt-2 text-sm font-medium text-text-strong">Use Camera</span>
              </button>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-[18px] border-2 border-dashed border-text-strong/20 p-6 text-center transition-colors hover:border-accent-earth hover:bg-accent-earth/5">
                <svg className="h-8 w-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="mt-2 text-sm font-medium text-text-strong">Upload Photo</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Angle selector */}
          <div className="mt-4 flex flex-wrap gap-2">
            {REQUIRED_ANGLES.map((angle) => {
              const isCaptured = capturedAngles.includes(angle);
              const isCurrent = currentAngle === angle;
              return (
                <button
                  key={angle}
                  onClick={() => setCurrentAngle(angle)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    isCurrent
                      ? 'bg-accent-earth text-white'
                      : isCaptured
                        ? 'bg-green-100 text-green-800'
                        : 'bg-text-strong/5 text-text-muted'
                  }`}
                >
                  {isCaptured && !isCurrent && '✓ '}
                  {ANGLE_LABELS[angle]}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentAngle('damage')}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                currentAngle === 'damage'
                  ? 'bg-red-600 text-white'
                  : capturedAngles.includes('damage')
                    ? 'bg-red-100 text-red-800'
                    : 'bg-red-50 text-red-600'
              }`}
            >
              + Damage Photo
            </button>
          </div>
        </div>

        {/* Photo thumbnails */}
        {photos.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {photos.map((photo) => (
              <div key={photo.angle} className="relative aspect-square">
                <Image
                  src={photo.dataUrl}
                  alt={ANGLE_LABELS[photo.angle]}
                  fill
                  className="rounded-[12px] object-cover"
                />
                <span className="absolute bottom-1 left-1 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">
                  {ANGLE_LABELS[photo.angle]}
                </span>
                <button
                  onClick={() => removePhoto(photo.angle)}
                  className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Damage section */}
        <div className="rounded-[28px] border border-text-strong/10 bg-white p-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={damageNoted}
              onChange={(e) => setDamageNoted(e.target.checked)}
              className="h-5 w-5 rounded border-text-strong/20 text-red-600 focus:ring-red-600"
            />
            <span className="text-sm font-semibold text-text-strong">Damage Noted</span>
          </label>

          {damageNoted && (
            <textarea
              value={damageDescription}
              onChange={(e) => setDamageDescription(e.target.value)}
              placeholder="Describe the damage..."
              rows={3}
              className="mt-3 w-full rounded-[18px] border border-text-strong/10 bg-surface-base px-4 py-3 text-sm"
            />
          )}
        </div>

        {/* Operator notes */}
        <div className="rounded-[28px] border border-text-strong/10 bg-white p-4">
          <label className="block text-sm font-semibold text-text-strong">
            Operator Notes (optional)
          </label>
          <textarea
            value={operatorNotes}
            onChange={(e) => setOperatorNotes(e.target.value)}
            placeholder="Any additional observations..."
            rows={2}
            className="mt-2 w-full rounded-[18px] border border-text-strong/10 bg-surface-base px-4 py-3 text-sm"
          />
        </div>

        {/* Customer acknowledgement */}
        <div className="rounded-[28px] border border-text-strong/10 bg-white p-4">
          <label className="block text-sm font-semibold text-text-strong">
            Customer Acknowledgement
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Customer prints name to acknowledge"
            className="mt-2 w-full rounded-[18px] border border-text-strong/10 bg-surface-base px-4 py-3 text-sm"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-[18px] bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting || capturedAngles.length < REQUIRED_ANGLES.length}
          className="w-full rounded-full bg-accent-earth py-4 text-sm font-semibold text-white transition-colors hover:bg-accent-earth/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Submitting...' : `Submit ${inspectionType === 'checkout' ? 'Checkout' : 'Checkin'} Inspection`}
        </button>
      </div>
    );
  }

  // Booking selection
  return (
    <div className="space-y-6">
      {allBookings.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-text-strong/5">
            <svg className="h-8 w-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="mt-4 font-display text-xl text-text-strong">No Inspections Needed</h2>
          <p className="mt-2 text-sm text-text-muted">
            All equipment is either awaiting delivery or has been inspected.
          </p>
        </div>
      ) : (
        <>
          <h2 className="font-display text-lg text-text-strong">Select Equipment to Inspect</h2>

          <div className="space-y-4">
            {allBookings.map((booking) => (
              <button
                key={booking.id}
                onClick={() => startInspection(booking, booking._type)}
                className="w-full rounded-[28px] border border-text-strong/10 bg-white p-4 text-left shadow-soft transition-shadow hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold uppercase ${
                      booking._type === 'checkout'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {booking._type === 'checkout' ? 'Checkout' : 'Checkin'}
                  </span>
                  <svg className="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h3 className="mt-2 font-display text-lg text-text-strong">
                  {booking.assetName}
                </h3>
                <p className="mt-1 text-sm text-text-muted">
                  {booking.customerName} &bull; {booking.customerPhone}
                </p>
                <p className="mt-1 text-xs text-text-muted">
                  {booking.startDate} to {booking.endDate}
                </p>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
