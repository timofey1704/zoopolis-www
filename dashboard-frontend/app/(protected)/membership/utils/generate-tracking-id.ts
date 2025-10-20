export const generateTrackingId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `trk_${crypto.randomUUID()}`
  }
  // fallback
  return `trk_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
}

// trk_f47ac10b-58cc-4372-a567-0e02b2c3d479
