/**
 * API Configuration File
 *
 * Instructions:
 * - To run with LOCALHOST: Uncomment the LOCALHOST_URL line and comment the SAKURA_URL line
 * - To run with SAKURA: Uncomment the SAKURA_URL line and comment the LOCALHOST_URL line
 *
 * Example for LOCALHOST:
 *   export const API_BASE_URL = 'http://localhost:3000/api'; // LOCALHOST - ACTIVE
 *   // export const API_BASE_URL = 'https://sakura-api.sakuraentcenter.com/api'; // SAKURA - INACTIVE
 *
 * Example for SAKURA:
 *   // export const API_BASE_URL = 'http://localhost:3000/api'; // LOCALHOST - INACTIVE
 *   export const API_BASE_URL = 'https://sakura-api.sakuraentcenter.com/api'; // SAKURA - ACTIVE
 */

// ============================================
// CONFIGURATION - Choose one and comment the other
// ============================================

// LOCALHOST - For local development
// export const API_BASE_URL = 'http://localhost:3000/api'; // LOCALHOST - INACTIVE

// SAKURA - For production/staging
export const API_BASE_URL = 'https://sakura-api.sakuraentcenter.com/api'; // SAKURA - ACTIVE

/** Base URL for static uploads (avatars, etc.) – same host as API, without /api. Use for [src] that point to /uploads/... */
export const UPLOADS_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');
