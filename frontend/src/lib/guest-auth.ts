export const GUEST_SESSION_KEY = "ablespace-guest-session";

export function isGuestSessionActive() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(GUEST_SESSION_KEY) === "active";
}

export function startGuestSession() {
  localStorage.setItem(GUEST_SESSION_KEY, "active");
}

export function endGuestSession() {
  localStorage.removeItem(GUEST_SESSION_KEY);
}
