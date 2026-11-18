import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import {
  cancelSmoothScroll,
  prefersReducedMotion,
  smoothScrollToElement,
} from '../../utils/smoothScroll';

interface ScrollPosition {
  x: number;
  y: number;
}

const SCROLL_STORAGE_KEY = 'sfcc_scroll_positions_v1';
const MAX_STORED_ENTRIES = 50;
const memoryScrollMap = new Map<string, ScrollPosition>();

function buildScrollKey(pathname: string, search: string, hash: string, key: string): string {
  // React Router assigns key === 'default' to all browser-initiated entries lacking
  // Router history state; include route + hash so distinct 'default' entries never collide.
  return key === 'default'
    ? `${pathname}${search}${hash}:${key}`
    : `${pathname}${search}:${key}`;
}

function setMemoryPosition(scrollKey: string, pos: ScrollPosition): void {
  if (memoryScrollMap.has(scrollKey)) {
    memoryScrollMap.delete(scrollKey);
  }
  memoryScrollMap.set(scrollKey, pos);
  while (memoryScrollMap.size > MAX_STORED_ENTRIES) {
    const oldestKey = memoryScrollMap.keys().next().value;
    if (oldestKey === undefined) break;
    memoryScrollMap.delete(oldestKey);
  }
}

function readScrollPosition(scrollKey: string): ScrollPosition | null {
  const cached = memoryScrollMap.get(scrollKey);
  if (cached) {
    return cached;
  }

  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(SCROLL_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== 'object') return null;

    for (const [entryKey, entryVal] of Object.entries(parsed)) {
      if (
        entryVal &&
        typeof entryVal === 'object' &&
        typeof (entryVal as ScrollPosition).x === 'number' &&
        typeof (entryVal as ScrollPosition).y === 'number' &&
        Number.isFinite((entryVal as ScrollPosition).x) &&
        Number.isFinite((entryVal as ScrollPosition).y)
      ) {
        setMemoryPosition(entryKey, {
          x: (entryVal as ScrollPosition).x,
          y: (entryVal as ScrollPosition).y,
        });
      }
    }

    return memoryScrollMap.get(scrollKey) ?? null;
  } catch {
    return null;
  }
}

function flushSessionStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    const payload = Object.fromEntries(memoryScrollMap.entries());
    window.sessionStorage.setItem(SCROLL_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore sessionStorage quota or privacy-mode errors
  }
}

function scrollToHashElement(
  rawHash: string,
  behavior: ScrollBehavior,
  onSettled?: () => void
): boolean {
  const fragment = rawHash.startsWith('#') ? rawHash.slice(1) : rawHash;
  if (!fragment) return false;

  let decodedId = fragment;
  try {
    decodedId = decodeURIComponent(fragment);
  } catch {
    decodedId = fragment;
  }

  if (decodedId.toLowerCase() === 'top') {
    cancelSmoothScroll();
    window.scrollTo({ left: 0, top: 0, behavior: 'instant' });
    onSettled?.();
    return true;
  }

  const target = document.getElementById(decodedId);
  if (target) {
    smoothScrollToElement(target, {
      block: 'start',
      behavior,
      onComplete: onSettled,
    });
    return true;
  }

  return false;
}

export function ScrollToTop() {
  const { pathname, search, hash, key } = useLocation();
  const navigationType = useNavigationType();
  const scrollKey = buildScrollKey(pathname, search, hash, key);

  const activeKeyRef = useRef<string>(scrollKey);
  const prevCommittedRef = useRef<{ pathname: string; scrollKey: string } | null>(null);
  const currentCommittedRef = useRef<{ pathname: string; scrollKey: string } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    let storageRafId: number | null = null;

    const flush = () => {
      storageRafId = null;
      flushSessionStorage();
    };

    const handleScroll = () => {
      setMemoryPosition(activeKeyRef.current, {
        x: window.scrollX,
        y: window.scrollY,
      });
      if (storageRafId === null) {
        storageRafId = window.requestAnimationFrame(flush);
      }
    };

    const handlePageHide = () => {
      if (storageRafId !== null) {
        window.cancelAnimationFrame(storageRafId);
        storageRafId = null;
      }
      flushSessionStorage();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      cancelSmoothScroll();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pagehide', handlePageHide);
      if (storageRafId !== null) {
        window.cancelAnimationFrame(storageRafId);
        storageRafId = null;
      }
      flushSessionStorage();
    };
  }, []);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    // Cancel any in-flight rAF smooth scroll synchronously before resetting or restoring
    // scroll position so outgoing animation frames can never land on the destination route.
    cancelSmoothScroll();

    // Must be updated before any window.scrollTo so outgoing scroll events
    // never overwrite the previous route's saved scroll position.
    activeKeyRef.current = scrollKey;

    if (currentCommittedRef.current?.scrollKey !== scrollKey) {
      prevCommittedRef.current = currentCommittedRef.current;
      currentCommittedRef.current = { pathname, scrollKey };
    }

    const prev = prevCommittedRef.current;
    const isInitialMount = prev === null;
    const isSamePathname = !isInitialMount && prev.pathname === pathname;

    let rafId: number | null = null;
    const recordSettledPosition = () => {
      setMemoryPosition(activeKeyRef.current, { x: window.scrollX, y: window.scrollY });
    };

    if (navigationType === 'POP') {
      const navEntry = window.performance?.getEntriesByType?.('navigation')?.[0] as
        | PerformanceNavigationTiming
        | undefined;
      const isFreshDocumentNavigate = isInitialMount && navEntry?.type === 'navigate';
      const saved = isFreshDocumentNavigate ? null : readScrollPosition(scrollKey);

      if (saved) {
        window.scrollTo({ left: saved.x, top: saved.y, behavior: 'instant' });
        rafId = window.requestAnimationFrame(() => {
          if (Math.abs(window.scrollY - saved.y) > 2) {
            window.scrollTo({ left: saved.x, top: saved.y, behavior: 'instant' });
          }
        });
      } else if (hash) {
        if (!scrollToHashElement(hash, 'instant', recordSettledPosition)) {
          rafId = window.requestAnimationFrame(() => {
            if (
              !scrollToHashElement(hash, 'instant', recordSettledPosition) &&
              !isSamePathname &&
              (isFreshDocumentNavigate || !isInitialMount)
            ) {
              window.scrollTo({ left: 0, top: 0, behavior: 'instant' });
              setMemoryPosition(scrollKey, { x: 0, y: 0 });
            }
          });
        }
      } else if (isFreshDocumentNavigate || !isInitialMount) {
        window.scrollTo({ left: 0, top: 0, behavior: 'instant' });
        setMemoryPosition(scrollKey, { x: 0, y: 0 });
      } else {
        setMemoryPosition(scrollKey, { x: window.scrollX, y: window.scrollY });
      }
    } else if (hash) {
      const behavior: ScrollBehavior =
        isSamePathname && !prefersReducedMotion() ? 'smooth' : 'instant';

      if (!scrollToHashElement(hash, behavior, recordSettledPosition)) {
        rafId = window.requestAnimationFrame(() => {
          if (!scrollToHashElement(hash, behavior, recordSettledPosition) && !isSamePathname) {
            window.scrollTo({ left: 0, top: 0, behavior: 'instant' });
            setMemoryPosition(scrollKey, { x: 0, y: 0 });
          }
        });
      }
    } else {
      window.scrollTo({ left: 0, top: 0, behavior: 'instant' });
      setMemoryPosition(scrollKey, { x: 0, y: 0 });
    }

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [pathname, search, hash, key, scrollKey, navigationType]);

  return null;
}
