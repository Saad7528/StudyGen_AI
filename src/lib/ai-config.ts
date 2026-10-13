/**
 * StudyGen AI Centralized Model & Network Configuration
 */
export const AI_CONFIG = {
  TIMEOUT_MS: 20000,
  IMAGE_MAX_DIMENSION: 1400,
  IMAGE_COMPRESSION_QUALITY: 0.80,
  DEFAULT_MODELS: [
    'gemini-flash-lite-latest',
    'gemini-3.5-flash-lite',
    'gemini-3.1-flash-lite',
    'gemini-flash-latest',
    'gemini-3.5-flash',
    'gemini-3.8-flash'
  ]
} as const;

export const STATUS_CODES = { UNAVAILABLE: 503, RATE_LIMIT: 429, BAD_REQUEST: 400 } as const;

export const CANVAS_SETTINGS = { imageSmoothingEnabled: true, imageSmoothingQuality: 'high' } as const;
