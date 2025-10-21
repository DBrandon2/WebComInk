// Utilitaire centralisé pour construire les URLs vers le backend API
const _RAW_API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
const RAW_BASE = _RAW_API_BASE.replace(/\/$/, "");
const API_BASE = RAW_BASE.endsWith("/api") ? RAW_BASE : RAW_BASE + "/api";

export function getApiBase() {
  return API_BASE;
}

export function toApiUrl(path) {
  if (!path) return API_BASE;
  if (path.startsWith("/")) {
    // éviter //
    return API_BASE + path;
  }
  return API_BASE + "/" + path;
}

export default { getApiBase, toApiUrl };
