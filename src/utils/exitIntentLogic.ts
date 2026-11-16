export const EXIT_INTENT_SESSION_KEY = 'sfcc_exit_intent_shown_v1';
export const EXIT_INTENT_QUOTE_SUBMITTED_KEY = 'sfcc_quote_submitted_v1';

export const MIN_DESKTOP_DWELL_MS = 10_000;
export const MIN_MOBILE_DWELL_MS = 15_000;
export const MIN_MOBILE_SCROLL_DEPTH_PX = 420;
export const MIN_MOBILE_UPWARD_DELTA_PX = 60;

export interface ExitIntentGateState {
  alreadyShown: boolean;
  alreadyConverted: boolean;
  isOtherModalOpen: boolean;
  pathname: string;
}

export interface DesktopExitIntentInput extends ExitIntentGateState {
  elapsedMs: number;
  hasInteracted: boolean;
  clientY: number;
  hasRelatedTarget: boolean;
}

export interface MobileScrollExitIntentInput extends ExitIntentGateState {
  elapsedMs: number;
  maxScrollY: number;
  previousScrollY: number;
  currentScrollY: number;
}

/**
 * Determines if the current route and session state allow showing the exit-intent offer.
 * Suppresses on dedicated contact pages where the user is already actively filling out the primary form.
 */
export function isExitIntentEligibleRoute(state: ExitIntentGateState): boolean {
  if (state.alreadyShown || state.alreadyConverted || state.isOtherModalOpen) {
    return false;
  }

  const normalized = state.pathname.toLowerCase().replace(/\.html$/, '').replace(/\/+$/, '') || '/';
  if (normalized === '/contact-us' || normalized === '/contact' || normalized === '/404') {
    return false;
  }

  return true;
}

/**
 * Evaluates desktop top-of-viewport mouseleave exit intent.
 * Enforces >= 10s dwell + prior user interaction ("No Arrival Popups" rule).
 */
export function shouldTriggerDesktopExitIntent(input: DesktopExitIntentInput): boolean {
  if (!isExitIntentEligibleRoute(input)) {
    return false;
  }
  if (!input.hasInteracted || input.elapsedMs < MIN_DESKTOP_DWELL_MS) {
    return false;
  }
  if (input.hasRelatedTarget) {
    return false;
  }
  return input.clientY <= 12;
}

/**
 * Evaluates mobile upward-scroll exit intent after meaningful content engagement.
 */
export function shouldTriggerMobileScrollExitIntent(input: MobileScrollExitIntentInput): boolean {
  if (!isExitIntentEligibleRoute(input)) {
    return false;
  }
  if (input.elapsedMs < MIN_MOBILE_DWELL_MS) {
    return false;
  }
  if (input.maxScrollY < MIN_MOBILE_SCROLL_DEPTH_PX) {
    return false;
  }
  const upwardDelta = input.previousScrollY - input.currentScrollY;
  return upwardDelta >= MIN_MOBILE_UPWARD_DELTA_PX && input.currentScrollY <= 260;
}

/**
 * Checks whether ?exit_intent=1 is present in the URL query string for deterministic QA preview.
 */
export function isPreviewExitIntentRequested(search: string): boolean {
  if (!search) return false;
  const params = new URLSearchParams(search.startsWith('?') ? search : `?${search}`);
  return params.get('exit_intent') === '1';
}
