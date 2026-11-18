import {
  BLOG_LIVE_BASELINES,
  BLOG_SLUGS,
  BUSINESS_INVARIANTS,
  CHROME_LIMITS,
  EXPECTED_TITLE_MAX_LEN,
  LIVE_ROUTE_BASELINES,
  SERVICE_AREA_LIVE_BASELINES,
  SERVICE_LIVE_BASELINES,
  VIEWPORTS,
} from './baselines.mjs';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runCheck(id, tier, area, name, fn) {
  try {
    const out = await fn();
    return {
      id,
      tier,
      area,
      name,
      passed: out.passed,
      details: out.details,
    };
  } catch (err) {
    return {
      id,
      tier,
      area,
      name,
      passed: false,
      details: `Error: ${err?.message || String(err)}`,
    };
  }
}

async function getLivePageAudit(cdp) {
  return cdp.evalJson(`(() => {
    const wordCount = (el) => {
      if (!el) return 0;
      const t = (el.innerText || '').trim();
      return t ? t.split(/\\s+/).length : 0;
    };
    const title = document.title.trim();
    const descEl = document.querySelector('meta[name="description"]');
    const description = descEl ? (descEl.getAttribute('content') || '') : '';
    const robotsEl = document.querySelector('meta[name="robots"]');
    const robots = robotsEl ? (robotsEl.getAttribute('content') || '') : '';
    const canonicalEl = document.querySelector('link[rel="canonical"]');
    const canonical = canonicalEl ? (canonicalEl.getAttribute('href') || '') : '';
    const ogUrlEl = document.querySelector('meta[property="og:url"]');
    const ogUrl = ogUrlEl ? (ogUrlEl.getAttribute('content') || '') : '';

    const mainEl = document.querySelector('main#main-content') || document.querySelector('main');
    const footerEl = document.querySelector('footer.site-footer') || document.querySelector('footer');
    const globalCtaEl = document.querySelector('[data-testid="global-cta"]');

    const headings = Array.from((mainEl || document.body).querySelectorAll('h1,h2,h3,h4,h5,h6')).map((h) => ({
      level: Number.parseInt(h.tagName.slice(1), 10),
      text: (h.innerText || '').trim().slice(0, 60),
    }));
    const h1Count = headings.filter((h) => h.level === 1).length;
    const headingSkips = [];
    for (let i = 1; i < headings.length; i++) {
      if (headings[i].level > headings[i - 1].level + 1) {
        headingSkips.push('h' + headings[i - 1].level + '->h' + headings[i].level + '(' + headings[i].text + ')');
      }
    }

    const jsonLdScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map((s) => s.textContent || '');
    const jsonLdParseErrors = [];
    const jsonLdHtmlUrls = [];
    const walkUrls = (val) => {
      if (typeof val === 'string') {
        if ((val.startsWith('http://') || val.startsWith('https://') || val.startsWith('/')) && /\\.html(?:$|[?#])/i.test(val)) {
          jsonLdHtmlUrls.push(val);
        }
        return;
      }
      if (Array.isArray(val)) val.forEach(walkUrls);
      else if (val && typeof val === 'object') Object.values(val).forEach(walkUrls);
    };
    for (const raw of jsonLdScripts) {
      try {
        walkUrls(JSON.parse(raw));
      } catch (e) {
        jsonLdParseErrors.push(String(e));
      }
    }

    const bodyText = document.body.innerText || '';
    const gluedMatch = bodyText.match(/[a-zA-Z](?:https?:\\/\\/|sfcleaningconcepts\\.com)/);

    const imgs = Array.from(document.querySelectorAll('img')).map((img) => ({
      src: img.getAttribute('src') || '',
      alt: img.getAttribute('alt'),
      complete: img.complete,
      naturalWidth: img.naturalWidth,
    }));
    const missingAlt = imgs.filter((i) => !i.alt || i.alt.trim() === '').map((i) => i.src);
    const brokenImgs = imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src);

    return {
      pathname: location.pathname,
      hash: location.hash,
      scrollY: Math.round(window.scrollY),
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      headerHeight: document.querySelector('header.site-header')?.getBoundingClientRect().height || 0,
      title,
      description,
      robots,
      canonical,
      ogUrl,
      bodyWords: wordCount(document.body),
      mainWords: wordCount(mainEl),
      footerWords: wordCount(footerEl),
      hasGlobalCta: Boolean(globalCtaEl),
      globalCtaWords: wordCount(globalCtaEl),
      h1Count,
      headingSkips,
      jsonLdCount: jsonLdScripts.length,
      jsonLdParseErrors,
      jsonLdHtmlUrls,
      gluedUrlMatch: gluedMatch ? gluedMatch[0] : null,
      missingAlt,
      brokenImgs,
      bodyText,
      mainText: mainEl ? (mainEl.innerText || '') : '',
    };
  })()`);
}

// ── TIER 1 BROWSER CHECKS ────────────────────────────────────────────────────

async function runTier1BrowserChecks(cdp, baseUrl) {
  const results = [];
  await cdp.setViewport(VIEWPORTS.desktop);

  // T1-A-PUSH-RESET: Normal PUSH route transition resets scrollY <= 5 at t+50ms and stays free afterward
  results.push(
    await runCheck(
      'T1-A-PUSH-RESET',
      1,
      'R1 Scroll Behavior',
      'PUSH route transition (/ -> /our-services) resets scrollY <= 5 cleanly & manual scroll stays put',
      async () => {
        cdp.clearErrors();
        await cdp.navigate(`${baseUrl}/`);
        await cdp.scrollToInstant(2500);
        await cdp.domClick('nav.desktop-nav a[href="/our-services"]');
        await sleep(50);
        const at50 = await cdp.evalJson(`({ path: location.pathname, y: Math.round(window.scrollY) })`);
        await sleep(600);
        const at650 = await cdp.evalJson(`({ path: location.pathname, y: Math.round(window.scrollY) })`);
        await cdp.scrollToInstant(1200);
        await sleep(200);
        const afterManual = await cdp.evalJson(`Math.round(window.scrollY)`);
        const errors = cdp.getErrors();

        const failures = [];
        if (at50.path !== '/our-services') failures.push(`expected /our-services at 50ms, got ${at50.path}`);
        if (at50.y > 5) failures.push(`t+50ms scrollY=${at50.y} (> 5px, smooth-scroll lag)`);
        if (at650.y > 5) failures.push(`t+650ms scrollY=${at650.y} (> 5px)`);
        if (afterManual < 1150) failures.push(`manual scroll snapped back to y=${afterManual} (expected >= 1150)`);
        if (errors.length > 0) failures.push(`console/page errors: ${errors.map((e) => e.text).join('; ')}`);

        return {
          passed: failures.length === 0,
          details: failures.length === 0 ? `t+50ms y=${at50.y}, t+650ms y=${at650.y}, manual=${afterManual}` : failures.join('; '),
        };
      }
    )
  );

  // T1-A-HASH-FOOTER-CAREERS: Footer "We're Hiring" (/about-us#careers) clears 81px sticky header
  results.push(
    await runCheck(
      'T1-A-HASH-FOOTER-CAREERS',
      1,
      'R1 Scroll Behavior',
      'Hash navigation via Footer link (/about-us#careers) scrolls #careers into [60px, 180px]',
      async () => {
        cdp.clearErrors();
        await cdp.navigate(`${baseUrl}/our-services`);
        await cdp.scrollToInstant(1500);
        await cdp.domClick('footer.site-footer a[href="/about-us#careers"]');
        await cdp.waitForCondition(`location.pathname === '/about-us' && Boolean(document.getElementById('careers'))`);
        await sleep(400);
        const state = await cdp.evalJson(`(() => {
          const el = document.getElementById('careers');
          return {
            full: location.pathname + location.hash,
            y: Math.round(window.scrollY),
            rectTop: el ? Math.round(el.getBoundingClientRect().top) : null,
          };
        })()`);
        const failures = [];
        if (state.full !== '/about-us#careers') failures.push(`route=${state.full}`);
        if (state.y <= 500) failures.push(`scrollY=${state.y} (expected > 500)`);
        if (state.rectTop === null || state.rectTop < 60 || state.rectTop > 180) {
          failures.push(`#careers rect.top=${state.rectTop}px outside [60, 180]`);
        }
        if (cdp.getErrors().length > 0) failures.push('console errors occurred');
        return {
          passed: failures.length === 0,
          details: failures.length === 0 ? `y=${state.y}, #careers rect.top=${state.rectTop}px` : failures.join('; '),
        };
      }
    )
  );

  // T1-A-HASH-ABOUT-CAREERS: AboutPage main link (/contact-us#careers)
  results.push(
    await runCheck(
      'T1-A-HASH-ABOUT-CAREERS',
      1,
      'R1 Scroll Behavior',
      'Hash navigation from AboutPage (main#main-content a[href="/contact-us#careers"]) scrolls #careers cleanly',
      async () => {
        cdp.clearErrors();
        await cdp.navigate(`${baseUrl}/about-us`);
        await cdp.scrollToInstant(0);
        await cdp.domClick('main#main-content a[href="/contact-us#careers"]');
        await cdp.waitForCondition(`location.pathname === '/contact-us' && Boolean(document.getElementById('careers'))`);
        await sleep(400);
        const state = await cdp.evalJson(`(() => {
          const el = document.getElementById('careers');
          return {
            full: location.pathname + location.hash,
            y: Math.round(window.scrollY),
            rectTop: el ? Math.round(el.getBoundingClientRect().top) : null,
          };
        })()`);
        const failures = [];
        if (state.full !== '/contact-us#careers') failures.push(`route=${state.full}`);
        if (state.y <= 500) failures.push(`scrollY=${state.y} (expected > 500)`);
        if (state.rectTop === null || state.rectTop < 60 || state.rectTop > 200) {
          failures.push(`#careers rect.top=${state.rectTop}px outside [60, 200]`);
        }
        return {
          passed: failures.length === 0,
          details: failures.length === 0 ? `y=${state.y}, #careers rect.top=${state.rectTop}px` : failures.join('; '),
        };
      }
    )
  );

  // T1-A-HASH-CONTACT-QUOTE: Direct /contact-us#quote hash scroll
  results.push(
    await runCheck(
      'T1-A-HASH-CONTACT-QUOTE',
      1,
      'R1 Scroll Behavior',
      'Direct hash navigation /contact-us#quote scrolls #quote within [60px, 180px]',
      async () => {
        cdp.clearErrors();
        await cdp.navigate(`${baseUrl}/contact-us#quote`);
        await sleep(400);
        const state = await cdp.evalJson(`(() => {
          const el = document.getElementById('quote');
          return {
            full: location.pathname + location.hash,
            y: Math.round(window.scrollY),
            rectTop: el ? Math.round(el.getBoundingClientRect().top) : null,
            hasForm: Boolean(document.getElementById('lead-quote-form')),
          };
        })()`);
        const failures = [];
        if (!state.hasForm) failures.push('missing #lead-quote-form');
        if (state.y <= 300) failures.push(`scrollY=${state.y} (expected > 300)`);
        if (state.rectTop === null || state.rectTop < 60 || state.rectTop > 180) {
          failures.push(`#quote rect.top=${state.rectTop}px outside [60, 180]`);
        }
        return {
          passed: failures.length === 0,
          details: failures.length === 0 ? `y=${state.y}, #quote rect.top=${state.rectTop}px` : failures.join('; '),
        };
      }
    )
  );

  // T1-A-POP-RESTORATION: Back/Forward POP scroll restoration (/service-areas -> /service-area/jupiter -> back -> forward)
  results.push(
    await runCheck(
      'T1-A-POP-RESTORATION',
      1,
      'R1 Scroll Behavior',
      'Back/Forward POP scroll restoration (/service-areas y=1500 -> jupiter -> back -> forward)',
      async () => {
        cdp.clearErrors();
        await cdp.navigate(`${baseUrl}/service-areas`);
        await cdp.scrollToInstant(1500);
        await cdp.domClick('main#main-content a[href="/service-area/jupiter"]');
        await sleep(50);
        const pushState = await cdp.evalJson(`({ path: location.pathname, y: Math.round(window.scrollY) })`);
        await sleep(150);
        await cdp.evalJson(`history.back()`);
        await cdp.waitForCondition(`location.pathname === '/service-areas'`);
        await sleep(250);
        const backState = await cdp.evalJson(`({ path: location.pathname, y: Math.round(window.scrollY) })`);
        await cdp.evalJson(`history.forward()`);
        await cdp.waitForCondition(`location.pathname === '/service-area/jupiter'`);
        await sleep(100);
        const fwdState = await cdp.evalJson(`({ path: location.pathname, y: Math.round(window.scrollY) })`);

        const failures = [];
        if (pushState.path !== '/service-area/jupiter' || pushState.y > 5) {
          failures.push(`push to jupiter had path=${pushState.path}, y=${pushState.y} (expected <= 5)`);
        }
        if (backState.y < 1000 || Math.abs(backState.y - 1500) > 150) {
          failures.push(`history.back() restored scrollY=${backState.y} (expected ~1500 ±150)`);
        }
        if (fwdState.path !== '/service-area/jupiter') {
          failures.push(`history.forward() ended at ${fwdState.path}`);
        }
        return {
          passed: failures.length === 0,
          details: failures.length === 0 ? `push y=${pushState.y}, back y=${backState.y}, forward=${fwdState.path}` : failures.join('; '),
        };
      }
    )
  );

  // T1-A-SERVICE-AREA-NO-OVERRIDE: ServiceArea pages do not fight scroll via duplicate post-paint scrollTo(0, 0)
  results.push(
    await runCheck(
      'T1-A-SERVICE-AREA-NO-OVERRIDE',
      1,
      'R1 Scroll Behavior',
      'ServiceAreaDetailPage (/service-area/jupiter) does not snap manual scroll back to y=0 after mount',
      async () => {
        cdp.clearErrors();
        await cdp.navigate(`${baseUrl}/service-area/jupiter`);
        await cdp.scrollToInstant(900);
        await sleep(200);
        const yAfter = await cdp.evalJson(`Math.round(window.scrollY)`);
        const errors = cdp.getErrors();
        const failures = [];
        if (yAfter < 850) failures.push(`scrollY snapped back to ${yAfter} (expected >= 850)`);
        if (errors.length > 0) failures.push(`errors: ${errors.map((e) => e.text).join('; ')}`);
        return {
          passed: failures.length === 0,
          details: failures.length === 0 ? `scrollY remained ${yAfter}` : failures.join('; '),
        };
      }
    )
  );

  // T1-E-PROMO-VIDEO: PromoVideoShowcase reel tabs switch without scroll drift
  results.push(
    await runCheck(
      'T1-E-PROMO-VIDEO',
      1,
      'Interactive UI',
      'PromoVideoShowcase 4 reel tabs switch active video without scroll jump or console errors',
      async () => {
        cdp.clearErrors();
        await cdp.navigate(`${baseUrl}/`);
        const before = await cdp.evalJson(`(() => {
          const s = document.querySelector('section[data-testid="promo-video-showcase"]');
          if (!s) return null;
          const top = Math.max(0, Math.round(s.getBoundingClientRect().top + window.scrollY - 120));
          window.scrollTo({ top, behavior: 'instant' });
          return { y: Math.round(window.scrollY), active: s.getAttribute('data-active-video'), tabs: s.querySelectorAll('[role="tab"]').length };
        })()`);
        const failures = [];
        if (!before || before.tabs !== 4) {
          failures.push(`expected 4 tabs, got ${before?.tabs}`);
        } else {
          await cdp.evalJson(`document.querySelectorAll('[data-testid="promo-video-showcase"] [role="tab"]')[2]?.click()`);
          await sleep(80);
          const after = await cdp.evalJson(`({
            y: Math.round(window.scrollY),
            active: document.querySelector('section[data-testid="promo-video-showcase"]')?.getAttribute('data-active-video')
          })`);
          if (after.active === before.active) failures.push('tab click did not update data-active-video');
          if (Math.abs(after.y - before.y) > 15) failures.push(`scroll drift ${before.y} -> ${after.y}`);
        }
        if (cdp.getErrors().length > 0) failures.push('console errors occurred');
        return {
          passed: failures.length === 0,
          details: failures.length === 0 ? `4 tabs verified, scroll preserved at y=${before.y}` : failures.join('; '),
        };
      }
    )
  );

  // T1-E-CLEANING-ESTIMATOR: CleaningEstimator category, frequency & sqft slider update recommendation without scroll drift
  results.push(
    await runCheck(
      'T1-E-CLEANING-ESTIMATOR',
      1,
      'Interactive UI',
      'CleaningEstimator category/frequency/sqft controls update recommended service & price without scroll jump',
      async () => {
        cdp.clearErrors();
        await cdp.navigate(`${baseUrl}/`);
        const beforeY = await cdp.evalJson(`(() => {
          const s = document.getElementById('estimator-section');
          const top = Math.max(0, Math.round(s.getBoundingClientRect().top + window.scrollY - 120));
          window.scrollTo({ top, behavior: 'instant' });
          return Math.round(window.scrollY);
        })()`);
        await cdp.clickByText('button', 'Local Office', '#estimator-section');
        await cdp.clickByText('button', 'Every Week', '#estimator-section');
        await cdp.setInputValue('#estimator-sqft', '10000');
        await sleep(80);
        const after = await cdp.evalJson(`({
          y: Math.round(window.scrollY),
          h3: document.querySelector('#estimator-section h3')?.textContent?.trim(),
          link: document.querySelector('#estimator-section a[href^="/service/"]')?.getAttribute('href'),
          price: Array.from(document.querySelectorAll('#estimator-section .tabular-nums'))
            .map((e) => (e.textContent || '').trim())
            .find((t) => t.startsWith('$')) || null,
        })`);
        const failures = [];
        if (!after.h3?.includes('Office Cleaning')) failures.push(`h3="${after.h3}"`);
        if (after.link !== '/service/office-cleaning') failures.push(`link="${after.link}"`);
        if (!after.price || !after.price.includes('$')) failures.push(`missing or invalid $ price output (${after.price})`);
        if (Math.abs(after.y - beforeY) > 15) failures.push(`scroll drift ${beforeY} -> ${after.y}`);
        if (cdp.getErrors().length > 0) failures.push('console errors occurred');
        return {
          passed: failures.length === 0,
          details: failures.length === 0 ? `h3="${after.h3}", price="${after.price}", y=${after.y}` : failures.join('; '),
        };
      }
    )
  );

  // T1-E-TESTIMONIALS-SLIDER: TestimonialsSlider Prev/Next controls update slide without scroll drift
  results.push(
    await runCheck(
      'T1-E-TESTIMONIALS-SLIDER',
      1,
      'Interactive UI',
      'TestimonialsSlider Next/Prev buttons cycle quotes without scroll jump or console errors',
      async () => {
        cdp.clearErrors();
        await cdp.navigate(`${baseUrl}/`);
        const before = await cdp.evalJson(`(() => {
          const s = document.querySelector('.testimonials-section');
          const top = Math.max(0, Math.round(s.getBoundingClientRect().top + window.scrollY - 120));
          window.scrollTo({ top, behavior: 'instant' });
          return { y: Math.round(window.scrollY), quote: s.querySelector('blockquote')?.textContent?.trim() };
        })()`);
        await cdp.domClick('button[aria-label="Next testimonial"]');
        await sleep(80);
        const nextState = await cdp.evalJson(`({
          y: Math.round(window.scrollY),
          quote: document.querySelector('.testimonials-section blockquote')?.textContent?.trim()
        })`);
        await cdp.domClick('button[aria-label="Previous testimonial"]');
        await sleep(80);
        const prevState = await cdp.evalJson(`({
          y: Math.round(window.scrollY),
          quote: document.querySelector('.testimonials-section blockquote')?.textContent?.trim()
        })`);
        const failures = [];
        if (!nextState.quote || nextState.quote === before.quote) failures.push('Next did not change quote');
        if (prevState.quote !== before.quote) failures.push('Prev did not return to initial quote');
        if (Math.abs(prevState.y - before.y) > 15) failures.push(`scroll drift ${before.y} -> ${prevState.y}`);
        if (cdp.getErrors().length > 0) failures.push('console errors occurred');
        return {
          passed: failures.length === 0,
          details: failures.length === 0 ? `Next/Prev cycled cleanly, y=${prevState.y}` : failures.join('; '),
        };
      }
    )
  );

  // T1-E-FAQ-ACCORDION: FaqAccordion category tabs & accordion items toggle without scroll drift
  results.push(
    await runCheck(
      'T1-E-FAQ-ACCORDION',
      1,
      'Interactive UI',
      'FaqAccordion category tabs (5) and question toggles update aria-expanded without scroll jump',
      async () => {
        cdp.clearErrors();
        await cdp.navigate(`${baseUrl}/faqs`);
        const before = await cdp.evalJson(`(() => {
          const c = document.querySelector('.faq-accordion-container');
          const top = Math.max(0, Math.round(c.getBoundingClientRect().top + window.scrollY - 100));
          window.scrollTo({ top, behavior: 'instant' });
          return {
            y: Math.round(window.scrollY),
            tabs: c.querySelectorAll('[role="tab"]').length,
            expanded: document.getElementById('faq-heading-0')?.getAttribute('aria-expanded'),
          };
        })()`);
        await cdp.clickByText('[role="tab"]', 'Rotation System', '.faq-accordion-container');
        await cdp.domClick('#faq-heading-0');
        await sleep(80);
        const after = await cdp.evalJson(`({
          y: Math.round(window.scrollY),
          expanded: document.getElementById('faq-heading-0')?.getAttribute('aria-expanded'),
        })`);
        const failures = [];
        if (before.tabs !== 5) failures.push(`expected 5 FAQ tabs, got ${before.tabs}`);
        if (after.expanded === before.expanded) failures.push('aria-expanded did not toggle');
        if (Math.abs(after.y - before.y) > 15) failures.push(`scroll drift ${before.y} -> ${after.y}`);
        if (cdp.getErrors().length > 0) failures.push('console errors occurred');
        return {
          passed: failures.length === 0,
          details: failures.length === 0 ? `5 tabs, aria-expanded ${before.expanded}->${after.expanded}, y=${after.y}` : failures.join('; '),
        };
      }
    )
  );

  // T1-E-QUOTE-FORM-VALIDATION: QuoteForm client validation triggers alerts without scroll jump or navigation
  results.push(
    await runCheck(
      'T1-E-QUOTE-FORM-VALIDATION',
      1,
      'Interactive UI',
      'QuoteForm empty submit renders [role="alert"] validation messages without scroll jump',
      async () => {
        cdp.clearErrors();
        await cdp.navigate(`${baseUrl}/contact-us`);
        const beforeY = await cdp.evalJson(`(() => {
          const f = document.getElementById('lead-quote-form');
          const top = Math.max(0, Math.round(f.getBoundingClientRect().top + window.scrollY - 120));
          window.scrollTo({ top, behavior: 'instant' });
          return Math.round(window.scrollY);
        })()`);
        await cdp.domClick('#quote-submit-btn');
        await sleep(80);
        const after = await cdp.evalJson(`({
          y: Math.round(window.scrollY),
          alerts: document.querySelectorAll('#lead-quote-form [role="alert"]').length,
          path: location.pathname,
        })`);
        const failures = [];
        if (after.alerts === 0) failures.push('0 [role="alert"] elements rendered');
        if (after.path !== '/contact-us') failures.push(`navigated away to ${after.path}`);
        if (Math.abs(after.y - beforeY) > 15) failures.push(`scroll drift ${beforeY} -> ${after.y}`);
        if (cdp.getErrors().length > 0) failures.push('console errors occurred');
        return {
          passed: failures.length === 0,
          details: failures.length === 0 ? `${after.alerts} alerts rendered, y=${after.y}` : failures.join('; '),
        };
      }
    )
  );

  // T1-E-DIRECTORY-FILTERS: ServiceDirectoryPage, PublicationsPage & ServiceAreaDirectoryPage search/filter controls
  results.push(
    await runCheck(
      'T1-E-DIRECTORY-FILTERS',
      1,
      'Interactive UI',
      'Directory search/filter controls (/service, /our-publications, /service-areas) filter live without scroll jump',
      async () => {
        cdp.clearErrors();
        const failures = [];
        // /service
        await cdp.navigate(`${baseUrl}/service`);
        const svcInit = await cdp.evalJson(`document.querySelectorAll('main#main-content a[href^="/service/"]').length`);
        await cdp.setInputValue('input[aria-label="Filter cleaning services"]', 'Medical');
        await sleep(60);
        const svcFilt = await cdp.evalJson(`document.querySelectorAll('main#main-content a[href^="/service/"]').length`);
        if (svcFilt === 0 || svcFilt >= svcInit) failures.push(`/service filter failed (${svcInit} -> ${svcFilt})`);

        // /our-publications
        await cdp.navigate(`${baseUrl}/our-publications`);
        const pubInit = await cdp.evalJson(`document.querySelectorAll('main#main-content article').length`);
        await cdp.clickByText('[aria-label="Filter publications by category"] [role="tab"]', 'Healthcare Sanitation');
        await sleep(60);
        const pubFilt = await cdp.evalJson(`document.querySelectorAll('main#main-content article').length`);
        if (pubFilt === 0 || pubFilt >= pubInit) failures.push(`/our-publications filter failed (${pubInit} -> ${pubFilt})`);

        // /service-areas
        await cdp.navigate(`${baseUrl}/service-areas`);
        const areaInit = await cdp.evalJson(`document.querySelectorAll('main#main-content a[href^="/service-area/"]').length`);
        await cdp.setInputValue('input[aria-label="Search service areas by city or neighborhood"]', 'Jupiter');
        await sleep(60);
        const areaFilt = await cdp.evalJson(`document.querySelectorAll('main#main-content a[href^="/service-area/"]').length`);
        if (areaFilt === 0 || areaFilt >= areaInit) failures.push(`/service-areas filter failed (${areaInit} -> ${areaFilt})`);
        if (cdp.getErrors().length > 0) failures.push('console errors occurred');

        return {
          passed: failures.length === 0,
          details: failures.length === 0 ? `Filtered: /service (${svcInit}->${svcFilt}), /our-publications (${pubInit}->${pubFilt}), /service-areas (${areaInit}->${areaFilt})` : failures.join('; '),
        };
      }
    )
  );

  // T1-B-LIVE-CHROME: Footer <= 240w, GlobalCTA <= 115w & omitted on /contact-us and /404
  results.push(
    await runCheck(
      'T1-B-LIVE-CHROME',
      1,
      'R2 Copy Condensation',
      'Live chrome condensed (Footer <= 240w, GlobalCTA <= 115w, omitted on /contact-us & /404)',
      async () => {
        const failures = [];
        await cdp.navigate(`${baseUrl}/`);
        const home = await getLivePageAudit(cdp);
        if (home.footerWords > CHROME_LIMITS.footerMaxWords) {
          failures.push(`Footer live words=${home.footerWords} (expected <= ${CHROME_LIMITS.footerMaxWords}, baseline ${CHROME_LIMITS.footerBaseline})`);
        }
        if (!home.hasGlobalCta) {
          failures.push('GlobalCTA missing on /');
        } else if (home.globalCtaWords > CHROME_LIMITS.globalCtaMaxWords) {
          failures.push(`GlobalCTA live words=${home.globalCtaWords} (expected <= ${CHROME_LIMITS.globalCtaMaxWords})`);
        }

        await cdp.navigate(`${baseUrl}/contact-us`);
        const contact = await getLivePageAudit(cdp);
        if (contact.hasGlobalCta) {
          failures.push('GlobalCTA should be omitted on /contact-us');
        }

        await cdp.navigate(`${baseUrl}/nonexistent-cta-check`, { allow404: true });
        const errPage = await getLivePageAudit(cdp);
        if (errPage.hasGlobalCta) {
          failures.push('GlobalCTA should be omitted on /404');
        }

        return {
          passed: failures.length === 0,
          details: failures.length === 0 ? `Footer=${home.footerWords}w, GlobalCTA=${home.globalCtaWords}w, omitted on /contact-us & /404` : failures.join('; '),
        };
      }
    )
  );

  // T1-B-LIVE-CORE: Core routes live bodyWords & mainWords < pre-edit baseline & >= floor
  results.push(
    await runCheck(
      'T1-B-LIVE-CORE',
      1,
      'R2 Copy Condensation',
      'Live React DOM word counts reduced below baseline & above anti-stub floor on core routes',
      async () => {
        const failures = [];
        const summary = [];
        for (const [route, base] of Object.entries(LIVE_ROUTE_BASELINES)) {
          if (route === '/service-areas') continue;
          await cdp.navigate(`${baseUrl}${route}`, { allow404: route === '/404' });
          const audit = await getLivePageAudit(cdp);
          if (audit.bodyWords >= base.baselineBody) {
            failures.push(`${route}: live bodyWords=${audit.bodyWords} >= baseline ${base.baselineBody}`);
          }
          const mainFail = base.allowEqualMain ? audit.mainWords > base.baselineMain : audit.mainWords >= base.baselineMain;
          if (mainFail) {
            failures.push(`${route}: live mainWords=${audit.mainWords} not reduced vs baseline ${base.baselineMain}`);
          }
          if (audit.mainWords < base.floorMain) {
            failures.push(`${route}: live mainWords=${audit.mainWords} < ${base.floorMain}w floor`);
          }
          summary.push(`${route}:${audit.mainWords}w`);
        }
        return {
          passed: failures.length === 0,
          details: failures.length === 0 ? summary.join(', ') : failures.slice(0, 6).join('; '),
        };
      }
    )
  );

  // T1-B-LIVE-SERVICE-BLOG: Representative service routes + all 11 blog routes live DOM < baseline & >= floor
  results.push(
    await runCheck(
      'T1-B-LIVE-SERVICE-BLOG',
      1,
      'R2 Copy Condensation',
      'Live React DOM word counts reduced below per-slug baseline & >= floor (services >=220w, all 11 blogs >=200w)',
      async () => {
        const failures = [];
        for (const slug of SERVICE_LIVE_BASELINES.representativeSlugs) {
          const route = `/service/${slug}`;
          await cdp.navigate(`${baseUrl}${route}`);
          const audit = await getLivePageAudit(cdp);
          const base = SERVICE_LIVE_BASELINES.perSlug[slug];
          if (audit.bodyWords >= base.body) {
            failures.push(`${route}: live bodyWords=${audit.bodyWords} >= baseline ${base.body}`);
          }
          if (audit.mainWords >= base.main) {
            failures.push(`${route}: live mainWords=${audit.mainWords} >= baseline ${base.main}`);
          }
          if (audit.mainWords < SERVICE_LIVE_BASELINES.floorMain) {
            failures.push(`${route}: live mainWords=${audit.mainWords} < 220w floor`);
          }
        }

        for (const slug of BLOG_SLUGS) {
          const route = `/blog/${slug}`;
          await cdp.navigate(`${baseUrl}${route}`);
          const audit = await getLivePageAudit(cdp);
          const base = BLOG_LIVE_BASELINES.perSlug[slug];
          if (audit.bodyWords >= base.body) {
            failures.push(`${route}: live bodyWords=${audit.bodyWords} >= baseline ${base.body}`);
          }
          if (audit.mainWords >= base.main) {
            failures.push(`${route}: live mainWords=${audit.mainWords} >= baseline ${base.main}`);
          }
          if (audit.mainWords < BLOG_LIVE_BASELINES.floorMain) {
            failures.push(`${route}: live mainWords=${audit.mainWords} < 200w floor`);
          }
        }
        return {
          passed: failures.length === 0,
          details: failures.length === 0 ? '3/3 representative services >=220w & 11/11 blogs reduced and >=200w' : failures.slice(0, 6).join('; '),
        };
      }
    )
  );

  // T1-B-LIVE-AREAS: /service-areas & representative /service-area/:slug live reduction & >=350w floor
  results.push(
    await runCheck(
      'T1-B-LIVE-AREAS',
      1,
      'R2 Copy Condensation',
      'Live React DOM word counts reduced on /service-areas and representative /service-area/:slug (>=350w floor)',
      async () => {
        const failures = [];
        await cdp.navigate(`${baseUrl}/service-areas`);
        const dirAudit = await getLivePageAudit(cdp);
        const dirBase = LIVE_ROUTE_BASELINES['/service-areas'];
        if (dirAudit.bodyWords >= dirBase.baselineBody || dirAudit.mainWords >= dirBase.baselineMain) {
          failures.push(`/service-areas: body=${dirAudit.bodyWords}/${dirBase.baselineBody}, main=${dirAudit.mainWords}/${dirBase.baselineMain}`);
        }
        if (dirAudit.mainWords < dirBase.floorMain) {
          failures.push(`/service-areas: main=${dirAudit.mainWords} < ${dirBase.floorMain}w`);
        }

        for (const slug of SERVICE_AREA_LIVE_BASELINES.representativeSlugs) {
          const route = `/service-area/${slug}`;
          await cdp.navigate(`${baseUrl}${route}`);
          const audit = await getLivePageAudit(cdp);
          const base = SERVICE_AREA_LIVE_BASELINES.perSlug[slug] ?? {
            body: SERVICE_AREA_LIVE_BASELINES.minBaselineBody,
            main: SERVICE_AREA_LIVE_BASELINES.minBaselineMain,
          };
          if (audit.bodyWords >= base.body) {
            failures.push(`${route}: live bodyWords=${audit.bodyWords} >= baseline ${base.body}`);
          }
          if (audit.mainWords >= base.main) {
            failures.push(`${route}: live mainWords=${audit.mainWords} >= baseline ${base.main}`);
          }
          if (audit.mainWords < SERVICE_AREA_LIVE_BASELINES.floorMain) {
            failures.push(`${route}: live mainWords=${audit.mainWords} < 350w floor`);
          }
        }
        return {
          passed: failures.length === 0,
          details: failures.length === 0 ? 'Service Areas directory & 4 representative cities condensed above floors' : failures.slice(0, 6).join('; '),
        };
      }
    )
  );

  // T1-C-LIVE-PROMOS-TRUST: Live DOM promos, trust, hiring, guarantee, Facebook URL & 0 forbidden strings
  results.push(
    await runCheck(
      'T1-C-LIVE-PROMOS-TRUST',
      1,
      'Business & Geo Invariants',
      'Live DOM retains 12% promo, 4.8 rating, We Are Hiring!, Love Your Clean guarantee, Facebook link, 0 forbidden tokens',
      async () => {
        const failures = [];
        await cdp.navigate(`${baseUrl}/`);
        const home = await getLivePageAudit(cdp);
        if (!home.bodyText.includes(BUSINESS_INVARIANTS.discountToken)) failures.push('/: missing 12% promo');
        if (!home.bodyText.includes(BUSINESS_INVARIANTS.ratingToken)) failures.push('/: missing 4.8 rating');
        if (!home.bodyText.includes(BUSINESS_INVARIANTS.guaranteePrefix)) failures.push('/: missing Love Your Clean guarantee');
        if (!/(Monday\s*[–-]\s*Sunday|Mon\s*[–-]\s*Sun)/i.test(home.bodyText)) failures.push('/: missing Monday-Sunday / Mon-Sun hours in live footer');
        const hasFb = await cdp.evalJson(`Boolean(document.querySelector('a[href*="facebook.com/SFCLEAN"]'))`);
        if (!hasFb) failures.push('/: missing facebook.com/SFCLEAN link');

        for (const route of ['/about-us', '/contact-us']) {
          await cdp.navigate(`${baseUrl}${route}`);
          const a = await getLivePageAudit(cdp);
          if (!a.bodyText.includes(BUSINESS_INVARIANTS.hiringToken)) {
            failures.push(`${route}: missing "${BUSINESS_INVARIANTS.hiringToken}"`);
          }
          for (const bad of BUSINESS_INVARIANTS.forbiddenStrings) {
            if (a.bodyText.toLowerCase().includes(bad.toLowerCase())) {
              failures.push(`${route}: contains forbidden "${bad}"`);
            }
          }
        }
        return {
          passed: failures.length === 0,
          details: failures.length === 0 ? 'All promos, trust, hiring, guarantee & Facebook invariants verified' : failures.join('; '),
        };
      }
    )
  );

  // T1-C-LIVE-TESTIMONIALS: All 4 source testimonial authors accessible in TestimonialsSlider
  results.push(
    await runCheck(
      'T1-C-LIVE-TESTIMONIALS',
      1,
      'Business & Geo Invariants',
      'All 4 source testimonial authors (Lindsey J. Crowley, Adrian James, Una Walker, Sonia Paige) rendered in TestimonialsSlider',
      async () => {
        await cdp.navigate(`${baseUrl}/`);
        const found = new Set();
        for (let i = 0; i < 4; i++) {
          const text = await cdp.evalJson(`document.querySelector('.testimonials-section')?.innerText || ''`);
          for (const author of BUSINESS_INVARIANTS.testimonialAuthors) {
            if (text.includes(author)) found.add(author);
          }
          await cdp.domClick('button[aria-label="Next testimonial"]');
          await sleep(60);
        }
        const missing = BUSINESS_INVARIANTS.testimonialAuthors.filter((a) => !found.has(a));
        return {
          passed: missing.length === 0,
          details: missing.length === 0 ? 'All 4 testimonial authors verified' : `Missing authors: ${missing.join(', ')}`,
        };
      }
    )
  );

  // T1-D-LIVE-HEAD-AND-FAQS: Live hydrated DOM SEO checks (titles, canonicals, /faqs h1->h2, single JSON-LD, 0 glued URLs, alt)
  results.push(
    await runCheck(
      'T1-D-LIVE-HEAD-AND-FAQS',
      1,
      'Automated SEO',
      'Live hydrated DOM SEO parity (<=60 title, /faqs no h1->h3 skip, single JSON-LD with 0 .html URLs, 0 glued URLs, valid imgs)',
      async () => {
        const failures = [];
        const routes = [
          '/',
          '/faqs',
          '/service/office-cleaning',
          '/service-area/jupiter',
          '/blog/medical-office-cleaning-guide',
          '/blog/deep-cleaning-for-homes-and-offices',
        ];
        for (const route of routes) {
          await cdp.navigate(`${baseUrl}${route}`);
          const a = await getLivePageAudit(cdp);
          if (!a.title || a.title.length > EXPECTED_TITLE_MAX_LEN) {
            failures.push(`${route}: live title "${a.title}" (${a.title.length} chars)`);
          }
          if (!a.description || a.description.length > 160) {
            failures.push(`${route}: live description len=${a.description.length}`);
          }
          if (!a.canonical || /\.html$/i.test(a.canonical)) {
            failures.push(`${route}: live canonical="${a.canonical}"`);
          }
          if (a.h1Count !== 1) failures.push(`${route}: live h1Count=${a.h1Count}`);
          if (a.headingSkips.length > 0) failures.push(`${route}: live heading skips: ${a.headingSkips.join(', ')}`);
          if (a.jsonLdCount !== 1) failures.push(`${route}: live jsonLdCount=${a.jsonLdCount} (expected 1)`);
          if (a.jsonLdParseErrors.length > 0) failures.push(`${route}: live JSON-LD parse error`);
          if (a.jsonLdHtmlUrls.length > 0) failures.push(`${route}: live JSON-LD .html URLs: ${a.jsonLdHtmlUrls[0]}`);
          if (a.gluedUrlMatch) failures.push(`${route}: glued plain-text URL "${a.gluedUrlMatch}"`);
          if (a.missingAlt.length > 0) failures.push(`${route}: missing alt on ${a.missingAlt[0]}`);
          if (a.brokenImgs.length > 0) failures.push(`${route}: broken img ${a.brokenImgs[0]}`);
        }
        return {
          passed: failures.length === 0,
          details: failures.length === 0 ? '6/6 representative routes pass all live DOM SEO invariants' : failures.slice(0, 6).join('; '),
        };
      }
    )
  );

  return results;
}

// ── TIER 2 BROWSER BOUNDARY CHECKS ───────────────────────────────────────────

async function runTier2BrowserChecks(cdp, baseUrl) {
  const results = [];

  // T2-VIEWPORTS-OVERFLOW-SCROLL: Desktop 1440x900 & Mobile 375x812 zero horizontal overflow
  results.push(
    await runCheck(
      'T2-VIEWPORTS-OVERFLOW-SCROLL',
      2,
      'Boundary & Corner Cases',
      'Desktop (1440x900) & Mobile (375x812) zero horizontal overflow & header dimensions across key routes',
      async () => {
        const failures = [];
        const routes = ['/', '/our-services', '/service-areas', '/service-area/jupiter-inlet-colony', '/faqs', '/contact-us'];
        for (const vp of [VIEWPORTS.desktop, VIEWPORTS.mobile]) {
          await cdp.setViewport(vp);
          for (const route of routes) {
            await cdp.navigate(`${baseUrl}${route}`);
            const a = await getLivePageAudit(cdp);
            if (a.scrollWidth > a.innerWidth) {
              failures.push(`${vp.name} ${route}: horizontal overflow scrollWidth=${a.scrollWidth} > innerWidth=${a.innerWidth}`);
            }
            if (a.headerHeight > vp.headerMaxHeight) {
              failures.push(`${vp.name} ${route}: headerHeight=${a.headerHeight} > ${vp.headerMaxHeight}`);
            }
          }
        }
        return {
          passed: failures.length === 0,
          details: failures.length === 0 ? '0 horizontal overflow across 6 routes × 2 viewports' : failures.slice(0, 6).join('; '),
        };
      }
    )
  );

  // T2-INSTANT-RESET-NO-LAG: t+50ms scrollY <= 5 on both Desktop and Mobile
  results.push(
    await runCheck(
      'T2-INSTANT-RESET-NO-LAG',
      2,
      'Boundary & Corner Cases',
      'Instant route scroll reset at t+50ms (no smooth-scroll lag) on Desktop (1440x900) & Mobile (375x812)',
      async () => {
        const failures = [];
        // Desktop
        await cdp.setViewport(VIEWPORTS.desktop);
        await cdp.navigate(`${baseUrl}/`);
        await cdp.scrollToInstant(2500);
        await cdp.domClick('nav.desktop-nav a[href="/our-services"]');
        await sleep(50);
        const d50 = await cdp.evalJson(`({ path: location.pathname, y: Math.round(window.scrollY) })`);
        if (d50.path !== '/our-services' || d50.y > 5) {
          failures.push(`Desktop t+50ms: path=${d50.path}, scrollY=${d50.y} (expected <= 5)`);
        }

        // Mobile via drawer
        await cdp.setViewport(VIEWPORTS.mobile);
        await cdp.navigate(`${baseUrl}/`);
        await cdp.scrollToInstant(2500);
        await cdp.domClick('button.mobile-nav-toggle[data-react-managed="true"]');
        await sleep(50);
        await cdp.clickByText('button.mobile-accordion-toggle', 'Our Services', '#mobile-nav-drawer');
        await sleep(50);
        await cdp.domClick('#mobile-nav-drawer a[href="/our-services"]');
        await sleep(50);
        const m50 = await cdp.evalJson(`({ path: location.pathname, y: Math.round(window.scrollY), overflow: document.body.style.overflow })`);
        if (m50.path !== '/our-services' || m50.y > 5) {
          failures.push(`Mobile t+50ms: path=${m50.path}, scrollY=${m50.y} (expected <= 5)`);
        }
        if (m50.overflow !== '') {
          failures.push(`Mobile drawer nav left body.style.overflow="${m50.overflow}"`);
        }
        return {
          passed: failures.length === 0,
          details: failures.length === 0 ? `Desktop t+50ms y=${d50.y}, Mobile t+50ms y=${m50.y}` : failures.join('; '),
        };
      }
    )
  );

  // T2-RAPID-ROUTE-SWITCH: Rapid 30ms route clicks settle cleanly at /faqs
  results.push(
    await runCheck(
      'T2-RAPID-ROUTE-SWITCH',
      2,
      'Boundary & Corner Cases',
      'Rapid sequential route switching (30ms intervals) settles on /faqs with y<=5, jsonLdCount=1, 0 errors',
      async () => {
        cdp.clearErrors();
        await cdp.setViewport(VIEWPORTS.desktop);
        await cdp.navigate(`${baseUrl}/`);
        for (const href of ['/about-us', '/our-services', '/service-areas', '/our-publications', '/faqs']) {
          await cdp.domClick(`nav.desktop-nav a[href="${href}"]`);
          await sleep(30);
        }
        await cdp.waitForCondition(`location.pathname === '/faqs'`);
        await sleep(150);
        const a = await getLivePageAudit(cdp);
        const errors = cdp.getErrors();
        const failures = [];
        if (a.pathname !== '/faqs') failures.push(`ended on ${a.pathname}`);
        if (a.scrollY > 5) failures.push(`scrollY=${a.scrollY}`);
        if (a.jsonLdCount !== 1) failures.push(`jsonLdCount=${a.jsonLdCount}`);
        if (a.h1Count !== 1) failures.push(`h1Count=${a.h1Count}`);
        if (errors.length > 0) failures.push(`errors: ${errors.map((e) => e.text).join('; ')}`);
        return {
          passed: failures.length === 0,
          details: failures.length === 0 ? 'Rapid 5-click chain settled cleanly at /faqs' : failures.join('; '),
        };
      }
    )
  );

  // T2-404-BOUNDARY: Unknown route returns 404, noindex, 0 live JSON-LD, omitted GlobalCTA, clean / recovery
  results.push(
    await runCheck(
      'T2-404-BOUNDARY',
      2,
      'Boundary & Corner Cases',
      '404 boundary: HTTP 404, noindex/nofollow, 0 live JSON-LD scripts, omitted GlobalCTA, clean / recovery',
      async () => {
        cdp.clearErrors();
        await cdp.setViewport(VIEWPORTS.desktop);
        const url404 = `${baseUrl}/nonexistent-route-check`;
        const { statusCode } = await cdp.navigate(url404, { allow404: true });
        const a404 = await getLivePageAudit(cdp);
        const failures = [];
        if (statusCode !== 404) failures.push(`HTTP status=${statusCode} (expected 404)`);
        if (!/noindex/i.test(a404.robots) || !/nofollow/i.test(a404.robots)) {
          failures.push(`robots="${a404.robots}" missing noindex, nofollow`);
        }
        if (a404.jsonLdCount !== 0) {
          failures.push(`live /404 DOM has ${a404.jsonLdCount} JSON-LD scripts (expected 0)`);
        }
        if (a404.hasGlobalCta) failures.push('GlobalCTA present on /404 (expected omitted)');

        await cdp.scrollToInstant(200);
        await cdp.domClick('main#main-content a[href="/"]');
        await cdp.waitForCondition(`location.pathname === '/'`);
        await sleep(100);
        const home = await getLivePageAudit(cdp);
        if (home.pathname !== '/' || home.scrollY > 5) failures.push(`recovery failed: path=${home.pathname}, y=${home.scrollY}`);
        if (home.jsonLdCount !== 1) failures.push(`recovered / has jsonLdCount=${home.jsonLdCount}`);
        if (cdp.getErrors().length > 0) failures.push(`unexpected errors: ${cdp.getErrors().map((e) => e.text).join('; ')}`);
        return {
          passed: failures.length === 0,
          details: failures.length === 0 ? 'HTTP 404, noindex, 0 JSON-LD, omitted GlobalCTA, clean / recovery' : failures.join('; '),
        };
      }
    )
  );

  // T2-SCROLL-HASH-EDGE-CASES: #top, missing hash, and smooth-hash interrupted by PUSH
  results.push(
    await runCheck(
      'T2-SCROLL-HASH-EDGE-CASES',
      2,
      'Boundary & Corner Cases',
      'ScrollToTop handles #top instant reset, missing cross-path hash fallback to y=0, and cancels mid-flight #hash smooth scroll on PUSH',
      async () => {
        cdp.clearErrors();
        const failures = [];
        await cdp.setViewport(VIEWPORTS.desktop);

        // 1) Cross-path missing hash resets to y=0
        await cdp.navigate(`${baseUrl}/about-us`);
        await cdp.scrollToInstant(1000);
        await cdp.navigate(`${baseUrl}/faqs#nonexistent-anchor`);
        await sleep(120);
        const missingDirectY = await cdp.evalJson(`Math.round(window.scrollY)`);
        if (missingDirectY > 5) failures.push(`/faqs#nonexistent-anchor stayed at y=${missingDirectY}`);

        // 2) #top resets scrolled same-pathname page to y=0
        await cdp.navigate(`${baseUrl}/about-us`);
        await cdp.scrollToInstant(1000);
        await cdp.evalJson(`window.history.pushState({}, '', '/about-us#top'); window.dispatchEvent(new PopStateEvent('popstate'));`);
        await sleep(80);
        const topY = await cdp.evalJson(`Math.round(window.scrollY)`);
        if (topY > 5) failures.push(`/about-us#top stayed at y=${topY}`);

        // 3) Smooth #careers scroll interrupted mid-flight by PUSH to /our-services must settle at y=0
        await cdp.navigate(`${baseUrl}/about-us`);
        await cdp.scrollToInstant(0);
        await cdp.domClick('footer.site-footer a[href="/about-us#careers"]');
        await sleep(40);
        await cdp.domClick('nav.desktop-nav a[href="/our-services"]');
        await cdp.waitForCondition(`location.pathname === '/our-services'`);
        await sleep(400);
        const interrupted = await cdp.evalJson(`({ path: location.pathname, y: Math.round(window.scrollY) })`);
        if (interrupted.path !== '/our-services' || interrupted.y > 5) {
          failures.push(`Interrupted hash leaked onto ${interrupted.path} at y=${interrupted.y}`);
        }

        // 4) Same-path missing hash preserves current scrollY instead of snapping to y=0
        await cdp.navigate(`${baseUrl}/about-us`);
        await cdp.scrollToInstant(1000);
        await cdp.evalJson(`window.history.pushState({}, '', '/about-us#nonexistent-same-path'); window.dispatchEvent(new PopStateEvent('popstate'));`);
        await sleep(120);
        const missingSamePathY = await cdp.evalJson(`Math.round(window.scrollY)`);
        if (Math.abs(missingSamePathY - 1000) > 10) {
          failures.push(`/about-us#nonexistent-same-path snapped to y=${missingSamePathY} (expected ~1000)`);
        }

        // 5) In-app POP to a route missing from memoryScrollMap resets scrollY to 0 instead of inheriting outgoing scrollY
        await cdp.navigate(`${baseUrl}/our-services`);
        await cdp.evalJson(`window.history.pushState({}, '', '/faqs')`);
        await cdp.domClick('nav.desktop-nav a[href="/about-us"]');
        await cdp.waitForCondition(`location.pathname === '/about-us'`);
        await cdp.scrollToInstant(1000);
        await sleep(80);
        await cdp.evalJson(`history.back()`);
        await cdp.waitForCondition(`location.pathname === '/faqs'`);
        await sleep(120);
        const popMissingY = await cdp.evalJson(`Math.round(window.scrollY)`);
        if (popMissingY > 5) {
          failures.push(`In-app POP to missing entry /faqs inherited outgoing scroll y=${popMissingY} (expected 0)`);
        }

        // 6) In-app POP to cross-path missing hash with no saved entry resets scrollY to 0
        await cdp.navigate(`${baseUrl}/our-services`);
        await cdp.evalJson(`window.history.pushState({}, '', '/faqs#nonexistent-pop')`);
        await cdp.domClick('nav.desktop-nav a[href="/about-us"]');
        await cdp.waitForCondition(`location.pathname === '/about-us'`);
        await cdp.scrollToInstant(1000);
        await sleep(80);
        await cdp.evalJson(`history.back()`);
        await cdp.waitForCondition(`location.pathname === '/faqs' && location.hash === '#nonexistent-pop'`);
        await sleep(120);
        const popMissingHashY = await cdp.evalJson(`Math.round(window.scrollY)`);
        if (popMissingHashY > 5) {
          failures.push(`In-app POP to missing hash /faqs#nonexistent-pop inherited outgoing scroll y=${popMissingHashY} (expected 0)`);
        }

        if (cdp.getErrors().length > 0) failures.push('console errors occurred');

        return {
          passed: failures.length === 0,
          details: failures.length === 0 ? 'Missing hash (cross-path, same-path & POP), #top, interrupted hash PUSH, and missing POP fallback all settled cleanly' : failures.join('; '),
        };
      }
    )
  );

  // T2-PHYSICAL-HTML-HYDRATION-PARITY: .html aliases, uppercase slug parity, and 404 -> blog -> / noindex cleanup
  results.push(
    await runCheck(
      'T2-PHYSICAL-HTML-HYDRATION-PARITY',
      2,
      'Boundary & Corner Cases',
      'Physical .html aliases (/service.html, /service/index.html, /contact.html, /about-us.html), uppercase :slug parity, and 404->blog->/ transitions',
      async () => {
        cdp.clearErrors();
        const failures = [];
        await cdp.setViewport(VIEWPORTS.desktop);

        const htmlAliases = [
          { path: '/service.html', expectedCanonical: 'https://sfcleaningconcepts.com/service', expectedH1: 'Services Directory', expectCta: true },
          { path: '/service/index.html', expectedCanonical: 'https://sfcleaningconcepts.com/service', expectedH1: 'Services Directory', expectCta: true },
          { path: '/contact.html', expectedCanonical: 'https://sfcleaningconcepts.com/contact-us', expectedH1: 'Interested in Cleaning Services', expectCta: false },
          { path: '/about-us.html', expectedCanonical: 'https://sfcleaningconcepts.com/about-us', expectedH1: 'About Us', expectCta: true },
        ];
        for (const item of htmlAliases) {
          await cdp.navigate(`${baseUrl}${item.path}`);
          const a = await getLivePageAudit(cdp);
          if (a.canonical !== item.expectedCanonical) {
            failures.push(`${item.path}: canonical="${a.canonical}" (expected "${item.expectedCanonical}")`);
          }
          if (/noindex/i.test(a.robots)) {
            failures.push(`${item.path}: falsely hydrated into noindex`);
          }
          if (a.jsonLdCount !== 1) {
            failures.push(`${item.path}: jsonLdCount=${a.jsonLdCount} (expected 1)`);
          }
          if (!a.mainText.includes(item.expectedH1)) {
            failures.push(`${item.path}: hydrated page missing expected H1 "${item.expectedH1}"`);
          }
          if (a.hasGlobalCta !== item.expectCta) {
            failures.push(`${item.path}: hasGlobalCta=${a.hasGlobalCta} (expected ${item.expectCta})`);
          }
        }

        // Case-insensitive :slug parity
        await cdp.navigate(`${baseUrl}/SERVICE-AREA/JUPITER`);
        const upperArea = await getLivePageAudit(cdp);
        if (upperArea.canonical !== 'https://sfcleaningconcepts.com/service-area/jupiter') {
          failures.push(`/SERVICE-AREA/JUPITER: canonical="${upperArea.canonical}"`);
        }
        if (/noindex/i.test(upperArea.robots) || upperArea.jsonLdCount !== 1 || !upperArea.mainText.includes('Jupiter')) {
          failures.push(`/SERVICE-AREA/JUPITER failed hydration parity (robots=${upperArea.robots}, jsonLd=${upperArea.jsonLdCount})`);
        }

        // 404 -> blog -> / SPA transition clears noindex and restores JSON-LD + hreflang
        await cdp.navigate(`${baseUrl}/nonexistent-parity-probe`, { allow404: true });
        const errAudit = await getLivePageAudit(cdp);
        if (!/noindex/i.test(errAudit.robots) || errAudit.jsonLdCount !== 0) {
          failures.push(`404 initial state invalid (robots=${errAudit.robots}, jsonLd=${errAudit.jsonLdCount})`);
        }
        await cdp.domClick('footer.site-footer a[href="/our-publications"]');
        await cdp.waitForCondition(`location.pathname === '/our-publications'`);
        await cdp.domClick('main#main-content a[href="/blog/medical-office-cleaning-guide"]');
        await cdp.waitForCondition(`location.pathname === '/blog/medical-office-cleaning-guide'`);
        await sleep(80);
        const blogAudit = await getLivePageAudit(cdp);
        if (/noindex/i.test(blogAudit.robots) || blogAudit.jsonLdCount !== 1 || blogAudit.canonical !== 'https://sfcleaningconcepts.com/blog/medical-office-cleaning-guide') {
          failures.push(`404 -> blog failed cleanup (robots=${blogAudit.robots}, jsonLd=${blogAudit.jsonLdCount}, canonical=${blogAudit.canonical})`);
        }
        await cdp.domClick('nav.desktop-nav a[href="/"]');
        await cdp.waitForCondition(`location.pathname === '/'`);
        await sleep(80);
        const homeAudit = await getLivePageAudit(cdp);
        if (/noindex/i.test(homeAudit.robots) || homeAudit.jsonLdCount !== 1 || homeAudit.canonical !== 'https://sfcleaningconcepts.com/') {
          failures.push(`blog -> / failed cleanup (robots=${homeAudit.robots}, jsonLd=${homeAudit.jsonLdCount}, canonical=${homeAudit.canonical})`);
        }

        if (cdp.getErrors().length > 0) failures.push('console errors occurred');
        return {
          passed: failures.length === 0,
          details: failures.length === 0 ? '4/4 .html aliases, uppercase :slug, and 404->blog->/ transitions verified' : failures.slice(0, 5).join('; '),
        };
      }
    )
  );

  return results;
}

// ── TIER 3 CROSS-FEATURE COMBINATIONS ────────────────────────────────────────

async function runTier3Checks(cdp, baseUrl) {
  const results = [];

  // T3-QUOTE-MODAL-SCROLL-LOCK
  results.push(
    await runCheck(
      'T3-QUOTE-MODAL-SCROLL-LOCK',
      3,
      'Cross-Feature Combinations',
      'QuoteModal open/close while scrolled preserves scrollY and restores body.style.overflow (Desktop & Mobile)',
      async () => {
        cdp.clearErrors();
        const failures = [];
        // Desktop at y=1200
        await cdp.setViewport(VIEWPORTS.desktop);
        await cdp.navigate(`${baseUrl}/`);
        await cdp.scrollToInstant(1200);
        await cdp.domClick('header.site-header .header-cta button');
        await cdp.waitForCondition(`Boolean(document.querySelector('.quote-modal-portal[role="dialog"]'))`);
        const dOpen = await cdp.evalJson(`({ overflow: document.body.style.overflow, y: Math.round(window.scrollY) })`);
        if (dOpen.overflow !== 'hidden') failures.push(`Desktop modal open overflow="${dOpen.overflow}"`);
        if (Math.abs(dOpen.y - 1200) > 10) failures.push(`Desktop modal open y=${dOpen.y} drifted from 1200`);
        await cdp.domClick('.quote-modal-portal button[aria-label="Close quote modal"]');
        await cdp.waitForCondition(`!document.querySelector('.quote-modal-portal[role="dialog"]')`);
        const dClose = await cdp.evalJson(`({ overflow: document.body.style.overflow, y: Math.round(window.scrollY) })`);
        if (dClose.overflow !== '') failures.push(`Desktop modal close overflow="${dClose.overflow}"`);
        if (Math.abs(dClose.y - 1200) > 10) failures.push(`Desktop modal close y=${dClose.y} drifted from 1200`);

        // Also Escape key close on Desktop
        await cdp.domClick('header.site-header .header-cta button');
        await cdp.waitForCondition(`Boolean(document.querySelector('.quote-modal-portal[role="dialog"]'))`);
        await cdp.pressEscape();
        await cdp.waitForCondition(`!document.querySelector('.quote-modal-portal[role="dialog"]')`);

        // Mobile at y=800
        await cdp.setViewport(VIEWPORTS.mobile);
        await cdp.navigate(`${baseUrl}/`);
        await cdp.scrollToInstant(800);
        await cdp.domClick('nav.mobile-bottom-bar button.bottom-bar-quote');
        await cdp.waitForCondition(`Boolean(document.querySelector('.quote-modal-portal[role="dialog"]'))`);
        const mOpen = await cdp.evalJson(`({ overflow: document.body.style.overflow, y: Math.round(window.scrollY) })`);
        if (mOpen.overflow !== 'hidden') failures.push(`Mobile modal open overflow="${mOpen.overflow}"`);
        await cdp.domClick('.quote-modal-portal button[aria-label="Close quote modal"]');
        await cdp.waitForCondition(`!document.querySelector('.quote-modal-portal[role="dialog"]')`);
        const mClose = await cdp.evalJson(`({ overflow: document.body.style.overflow, y: Math.round(window.scrollY) })`);
        if (mClose.overflow !== '') failures.push(`Mobile modal close overflow="${mClose.overflow}"`);
        if (Math.abs(mClose.y - 800) > 10) failures.push(`Mobile modal close y=${mClose.y} drifted from 800`);
        if (cdp.getErrors().length > 0) failures.push('console errors occurred');

        return {
          passed: failures.length === 0,
          details: failures.length === 0 ? `Desktop (y=${dClose.y}) & Mobile (y=${mClose.y}) scroll & overflow preserved` : failures.join('; '),
        };
      }
    )
  );

  // T3-MOBILE-DRAWER-SCROLL-AND-NAV
  results.push(
    await runCheck(
      'T3-MOBILE-DRAWER-SCROLL-AND-NAV',
      3,
      'Cross-Feature Combinations',
      'Mobile drawer open/close at y=1000 preserves scroll; accordion nav closes drawer, restores overflow & resets y<=5 at t+50ms',
      async () => {
        cdp.clearErrors();
        const failures = [];
        await cdp.setViewport(VIEWPORTS.mobile);
        await cdp.navigate(`${baseUrl}/`);
        await cdp.scrollToInstant(1000);
        await cdp.domClick('button.mobile-nav-toggle[data-react-managed="true"]');
        await sleep(60);
        const open = await cdp.evalJson(`({
          active: document.getElementById('mobile-nav-drawer')?.classList.contains('is-active'),
          overflow: document.body.style.overflow,
          y: Math.round(window.scrollY)
        })`);
        if (!open.active) failures.push('mobile drawer did not become .is-active');
        if (open.overflow !== 'hidden') failures.push(`drawer open overflow="${open.overflow}"`);

        await cdp.domClick('#mobile-nav-drawer button[aria-label="Close navigation menu"]');
        await sleep(60);
        const closed = await cdp.evalJson(`({
          active: document.getElementById('mobile-nav-drawer')?.classList.contains('is-active'),
          overflow: document.body.style.overflow,
          y: Math.round(window.scrollY)
        })`);
        if (closed.active) failures.push('mobile drawer remained .is-active after close');
        if (closed.overflow !== '') failures.push(`drawer close overflow="${closed.overflow}"`);
        if (Math.abs(closed.y - 1000) > 10) failures.push(`drawer close y=${closed.y} drifted from 1000`);

        // Re-open & navigate via accordion link
        await cdp.domClick('button.mobile-nav-toggle[data-react-managed="true"]');
        await sleep(60);
        await cdp.clickByText('button.mobile-accordion-toggle', 'Service Areas', '#mobile-nav-drawer');
        await sleep(60);
        await cdp.domClick('#mobile-nav-drawer a[href="/service-area/jupiter"]');
        await sleep(50);
        const nav = await cdp.evalJson(`({
          path: location.pathname,
          y: Math.round(window.scrollY),
          active: document.getElementById('mobile-nav-drawer')?.classList.contains('is-active'),
          overflow: document.body.style.overflow
        })`);
        if (nav.path !== '/service-area/jupiter') failures.push(`did not navigate to /service-area/jupiter (${nav.path})`);
        if (nav.y > 5) failures.push(`t+50ms scrollY=${nav.y} (> 5)`);
        if (nav.active) failures.push('drawer still active after navigation');
        if (nav.overflow !== '') failures.push(`overflow not restored: "${nav.overflow}"`);
        return {
          passed: failures.length === 0,
          details: failures.length === 0 ? `close y=${closed.y}, nav t+50ms y=${nav.y}` : failures.join('; '),
        };
      }
    )
  );

  // T3-AREA-FILTER-NAV-BACK
  results.push(
    await runCheck(
      'T3-AREA-FILTER-NAV-BACK',
      3,
      'Cross-Feature Combinations',
      '/service-areas search "Jupiter" + navigate /service-area/jupiter + history.back() preserves scroll & single JSON-LD',
      async () => {
        cdp.clearErrors();
        const failures = [];
        await cdp.setViewport(VIEWPORTS.desktop);
        await cdp.navigate(`${baseUrl}/service-areas`);
        await cdp.setInputValue('input[aria-label="Search service areas by city or neighborhood"]', 'Jupiter');
        await sleep(100);
        const maxScroll = await cdp.evalJson(`Math.max(0, document.documentElement.scrollHeight - window.innerHeight)`);
        const targetY = Math.min(800, maxScroll);
        await cdp.scrollToInstant(targetY);
        await cdp.domClick('main#main-content a[href="/service-area/jupiter"]');
        await sleep(50);
        const pushAudit = await getLivePageAudit(cdp);
        if (pushAudit.pathname !== '/service-area/jupiter') failures.push(`path=${pushAudit.pathname}`);
        if (pushAudit.scrollY > 5) failures.push(`push t+50ms y=${pushAudit.scrollY} (> 5)`);
        if (pushAudit.jsonLdCount !== 1) failures.push(`/service-area/jupiter jsonLdCount=${pushAudit.jsonLdCount}`);

        await cdp.evalJson(`history.back()`);
        await cdp.waitForCondition(`location.pathname === '/service-areas'`);
        await sleep(250);
        const backAudit = await getLivePageAudit(cdp);
        if (targetY >= 200 && Math.abs(backAudit.scrollY - targetY) > 150) {
          failures.push(`history.back() scrollY=${backAudit.scrollY} (expected ~${targetY} ±150)`);
        }
        if (backAudit.jsonLdCount !== 1) failures.push(`after back jsonLdCount=${backAudit.jsonLdCount}`);
        return {
          passed: failures.length === 0,
          details: failures.length === 0 ? `targetY=${targetY}, backY=${backAudit.scrollY}, jsonLdCount=1` : failures.join('; '),
        };
      }
    )
  );

  // T3-HERO-SMOOTH-SCROLL-FOCUS
  results.push(
    await runCheck(
      'T3-HERO-SMOOTH-SCROLL-FOCUS',
      3,
      'Cross-Feature Combinations',
      'HeroVideo primary CTA smooth scroll + #quote-name focus without viewport snap (Desktop & Mobile)',
      async () => {
        cdp.clearErrors();
        const failures = [];
        for (const vp of [VIEWPORTS.desktop, VIEWPORTS.mobile]) {
          await cdp.setViewport(vp);
          await cdp.navigate(`${baseUrl}/`);
          await cdp.scrollToInstant(900);
          await cdp.domClick('section[data-testid="splash-parallax-slider"] button.btn-primary');
          await sleep(400);
          const at400 = await cdp.evalJson(`({ y: Math.round(window.scrollY), activeId: document.activeElement?.id || '' })`);
          await sleep(400);
          const at800 = await cdp.evalJson(`({ y: Math.round(window.scrollY), activeId: document.activeElement?.id || '' })`);
          if (at800.activeId !== 'quote-name') {
            failures.push(`${vp.name}: activeElement.id="${at800.activeId}" (expected "quote-name")`);
          }
          if (Math.abs(at800.y - at400.y) > 20) {
            failures.push(`${vp.name}: viewport snapped between 400ms (${at400.y}) and 800ms (${at800.y})`);
          }
        }
        return {
          passed: failures.length === 0,
          details: failures.length === 0 ? 'Desktop & Mobile focused #quote-name cleanly with <=20px settle delta' : failures.join('; '),
        };
      }
    )
  );

  // T3-SPA-NAV-SEO-PARITY
  results.push(
    await runCheck(
      'T3-SPA-NAV-SEO-PARITY',
      3,
      'Cross-Feature Combinations',
      'Multi-route SPA navigation preserves jsonLdCount===1, updated title/canonical, 0 heading skips, and 0 JSON-LD on /404',
      async () => {
        cdp.clearErrors();
        const failures = [];
        await cdp.setViewport(VIEWPORTS.desktop);
        await cdp.navigate(`${baseUrl}/`);

        const steps = [
          { click: 'nav.desktop-nav a[href="/service-areas"]', expected: '/service-areas' },
          { click: 'main#main-content a[href="/service-area/jupiter"]', expected: '/service-area/jupiter' },
          { click: 'nav.desktop-nav a[href="/our-publications"]', expected: '/our-publications' },
          { click: 'main#main-content a[href="/blog/medical-office-cleaning-guide"]', expected: '/blog/medical-office-cleaning-guide' },
          { click: 'nav.desktop-nav a[href="/faqs"]', expected: '/faqs' },
        ];

        let prevTitle = '';
        for (const step of steps) {
          await cdp.domClick(step.click);
          await cdp.waitForCondition(`location.pathname === ${JSON.stringify(step.expected)}`);
          await sleep(100);
          const a = await getLivePageAudit(cdp);
          if (a.jsonLdCount !== 1) failures.push(`${step.expected}: SPA nav jsonLdCount=${a.jsonLdCount} (expected 1)`);
          if (a.jsonLdHtmlUrls.length > 0) failures.push(`${step.expected}: .html URL in SPA JSON-LD`);
          if (a.h1Count !== 1) failures.push(`${step.expected}: h1Count=${a.h1Count}`);
          if (a.headingSkips.length > 0) failures.push(`${step.expected}: heading skips ${a.headingSkips.join(', ')}`);
          if (!a.canonical.endsWith(step.expected)) failures.push(`${step.expected}: canonical="${a.canonical}" did not update`);
          if (a.title === prevTitle) failures.push(`${step.expected}: title did not update ("${a.title}")`);
          prevTitle = a.title;
        }

        await cdp.navigate(`${baseUrl}/nonexistent-spa-seo`, { allow404: true });
        const a404 = await getLivePageAudit(cdp);
        if (a404.jsonLdCount !== 0) failures.push(`/404: jsonLdCount=${a404.jsonLdCount} (expected 0)`);

        return {
          passed: failures.length === 0,
          details: failures.length === 0 ? 'All 5 SPA hops + /404 maintained exact JSON-LD, heading & head parity' : failures.slice(0, 6).join('; '),
        };
      }
    )
  );

  // T3-EXIT-INTENT-PREVIEW-DISMISS-NO-REOPEN (G1)
  results.push(
    await runCheck(
      'T3-EXIT-INTENT-PREVIEW-DISMISS-NO-REOPEN',
      3,
      'Cross-Feature Combinations',
      'Dismissed ?exit_intent=1 banner stays dismissed after QuoteModal open/close & restores body.style.overflow',
      async () => {
        cdp.clearErrors();
        const failures = [];
        await cdp.setViewport(VIEWPORTS.desktop);
        await cdp.navigate(`${baseUrl}/?exit_intent=1`);
        await cdp.waitForCondition(`Boolean(document.querySelector('[data-testid="exit-intent-banner"]'))`);

        const openOverflow = await cdp.evalJson(`document.body.style.overflow`);
        if (openOverflow !== 'hidden') failures.push(`open overflow="${openOverflow}" (expected "hidden")`);

        await cdp.clickByText('button', 'No thanks', '[data-testid="exit-intent-banner"]');
        await cdp.waitForCondition(`!document.querySelector('[data-testid="exit-intent-banner"]')`);
        const dismissedOverflow = await cdp.evalJson(`document.body.style.overflow`);
        if (dismissedOverflow !== '') failures.push(`dismissed overflow="${dismissedOverflow}" (expected "")`);

        await cdp.domClick('header.site-header .header-cta button');
        await cdp.waitForCondition(`Boolean(document.querySelector('.quote-modal-portal[role="dialog"]'))`);
        await cdp.domClick('.quote-modal-portal button[aria-label="Close quote modal"]');
        await cdp.waitForCondition(`!document.querySelector('.quote-modal-portal[role="dialog"]')`);
        await sleep(80);

        const after = await cdp.evalJson(`({
          bannerOpen: Boolean(document.querySelector('[data-testid="exit-intent-banner"]')),
          overflow: document.body.style.overflow
        })`);
        if (after.bannerOpen) failures.push('ExitIntentBanner re-opened after QuoteModal close despite prior dismissal');
        if (after.overflow !== '') failures.push(`body.style.overflow="${after.overflow}" after QuoteModal close`);
        if (cdp.getErrors().length > 0) failures.push('console errors occurred');

        return {
          passed: failures.length === 0,
          details: failures.length === 0 ? 'Banner stayed dismissed & overflow="" after QuoteModal cycle' : failures.join('; '),
        };
      }
    )
  );

  // T3-MOBILE-DRAWER-ACCORDION-ISOLATION (G2)
  results.push(
    await runCheck(
      'T3-MOBILE-DRAWER-ACCORDION-ISOLATION',
      3,
      'Cross-Feature Combinations',
      'Mobile drawer "Our Services" accordion toggle does not mutate "Service Areas" accordion state or .is-open class',
      async () => {
        cdp.clearErrors();
        await cdp.setViewport(VIEWPORTS.mobile);
        await cdp.navigate(`${baseUrl}/`);
        await cdp.domClick('button.mobile-nav-toggle[data-react-managed="true"]');
        await sleep(60);
        await cdp.clickByText('button.mobile-accordion-toggle', 'Our Services', '#mobile-nav-drawer');
        await sleep(60);

        const state = await cdp.evalJson(`(() => {
          const toggles = Array.from(document.querySelectorAll('#mobile-nav-drawer button.mobile-accordion-toggle'));
          const lists = Array.from(document.querySelectorAll('#mobile-nav-drawer .mobile-accordion-content'));
          return {
            servicesExpanded: toggles[0]?.getAttribute('aria-expanded'),
            areasExpanded: toggles[1]?.getAttribute('aria-expanded'),
            servicesHasIsOpen: lists[0]?.classList.contains('is-open'),
            areasHasIsOpen: lists[1]?.classList.contains('is-open'),
          };
        })()`);

        const failures = [];
        if (state.servicesExpanded !== 'true' || !state.servicesHasIsOpen) {
          failures.push(`Our Services did not open cleanly: ${JSON.stringify(state)}`);
        }
        if (state.areasExpanded !== 'false' || state.areasHasIsOpen) {
          failures.push(`Service Areas accordion leaked state/class: ${JSON.stringify(state)}`);
        }
        if (cdp.getErrors().length > 0) failures.push('console errors occurred');
        return {
          passed: failures.length === 0,
          details: failures.length === 0 ? 'Accordions isolated cleanly' : failures.join('; '),
        };
      }
    )
  );

  // T3-OVERLAY-ESCAPE-AND-LOCK-PRECEDENCE (G3)
  results.push(
    await runCheck(
      'T3-OVERLAY-ESCAPE-AND-LOCK-PRECEDENCE',
      3,
      'Cross-Feature Combinations',
      'Mobile drawer + ExitIntentBanner do not double-dismiss on a single Escape & preserve body scroll lock until last overlay closes',
      async () => {
        cdp.clearErrors();
        await cdp.setViewport(VIEWPORTS.mobile);
        await cdp.navigate(`${baseUrl}/?exit_intent=1`);
        await cdp.waitForCondition(`Boolean(document.querySelector('[data-testid="exit-intent-banner"]'))`);
        await cdp.domClick('button.mobile-nav-toggle[data-react-managed="true"]');
        await sleep(60);

        await cdp.pressEscape();
        await sleep(80);

        const afterFirstEsc = await cdp.evalJson(`({
          drawerOpen: Boolean(document.getElementById('mobile-nav-drawer')?.classList.contains('is-active')),
          bannerOpen: Boolean(document.querySelector('[data-testid="exit-intent-banner"]')),
          overflow: document.body.style.overflow
        })`);

        const failures = [];
        if (!afterFirstEsc.drawerOpen && !afterFirstEsc.bannerOpen) {
          failures.push('Single Escape dismissed BOTH mobile drawer and ExitIntentBanner simultaneously');
        }
        if ((afterFirstEsc.drawerOpen || afterFirstEsc.bannerOpen) && afterFirstEsc.overflow !== 'hidden') {
          failures.push(`Remaining overlay lost body scroll lock: overflow="${afterFirstEsc.overflow}"`);
        }

        // Second Escape closes the remaining drawer and restores overflow=''
        await cdp.pressEscape();
        await sleep(80);
        const afterSecondEsc = await cdp.evalJson(`({
          drawerOpen: Boolean(document.getElementById('mobile-nav-drawer')?.classList.contains('is-active')),
          bannerOpen: Boolean(document.querySelector('[data-testid="exit-intent-banner"]')),
          overflow: document.body.style.overflow
        })`);
        if (afterSecondEsc.drawerOpen || afterSecondEsc.bannerOpen) {
          failures.push(`Second Escape left overlay open: ${JSON.stringify(afterSecondEsc)}`);
        }
        if (afterSecondEsc.overflow !== '') {
          failures.push(`Final overflow not restored: "${afterSecondEsc.overflow}"`);
        }
        if (cdp.getErrors().length > 0) failures.push('console errors occurred');

        return {
          passed: failures.length === 0,
          details: failures.length === 0 ? 'Single Escape dismissed only topmost overlay and preserved lock until final Escape' : failures.join('; '),
        };
      }
    )
  );

  // T3-HERO-SCROLL-INTERRUPT-AND-FALLBACK (G7)
  results.push(
    await runCheck(
      'T3-HERO-SCROLL-INTERRUPT-AND-FALLBACK',
      3,
      'Cross-Feature Combinations',
      'HeroVideo smooth scroll aborts cleanly on wheel & route click without stealing focus, respects reduced-motion, and falls back to QuoteModal after form submit',
      async () => {
        cdp.clearErrors();
        const failures = [];
        await cdp.setViewport(VIEWPORTS.desktop);

        // 1) Wheel interrupt from y=2000 must abort smooth scroll & NOT focus #quote-name
        await cdp.navigate(`${baseUrl}/`);
        await cdp.scrollToInstant(2000);
        await cdp.domClick('section[data-testid="splash-parallax-slider"] button.btn-primary');
        await sleep(40);
        await cdp.evalJson(`window.dispatchEvent(new WheelEvent('wheel', { deltaY: -100 }))`);
        await sleep(450);
        const wheelRes = await cdp.evalJson(`({ y: Math.round(window.scrollY), activeId: document.activeElement?.id || '' })`);
        if (wheelRes.y < 1500) failures.push(`wheel interrupt did not stop scroll: y=${wheelRes.y}`);
        if (wheelRes.activeId === 'quote-name') failures.push('wheel-interrupted smooth scroll still focused #quote-name');

        // 2) Route click mid-scroll settles destination at y=0
        await cdp.navigate(`${baseUrl}/`);
        await cdp.scrollToInstant(2000);
        await cdp.domClick('section[data-testid="splash-parallax-slider"] button.btn-primary');
        await sleep(40);
        await cdp.domClick('nav.desktop-nav a[href="/about-us"]');
        await cdp.waitForCondition(`location.pathname === '/about-us'`);
        await sleep(450);
        const routeRes = await cdp.evalJson(`({ y: Math.round(window.scrollY), activeId: document.activeElement?.id || '' })`);
        if (routeRes.y > 5 || routeRes.activeId === 'quote-name') failures.push(`route interrupt leaked: ${JSON.stringify(routeRes)}`);

        // 3) Reduced motion instant focus
        await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
        await cdp.navigate(`${baseUrl}/`);
        await cdp.scrollToInstant(900);
        await cdp.domClick('section[data-testid="splash-parallax-slider"] button.btn-primary');
        await sleep(30);
        const rmRes = await cdp.evalJson(`({ y: Math.round(window.scrollY), activeId: document.activeElement?.id || '' })`);
        await cdp.send('Emulation.setEmulatedMedia', { features: [] });
        if (rmRes.y > 200 || rmRes.activeId !== 'quote-name') failures.push(`reduced-motion failed: ${JSON.stringify(rmRes)}`);

        // 4) Post-submission fallback opens QuoteModal when #quote-name unmounts
        await cdp.navigate(`${baseUrl}/`);
        await cdp.evalJson(`(() => {
          window.fetch = async () => new Response('ok', { status: 200 });
          const setVal = (el, val) => {
            const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
            Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, val);
            el.dispatchEvent(new Event('input', { bubbles: true }));
          };
          setVal(document.getElementById('quote-name'), 'Test User');
          setVal(document.getElementById('quote-email'), 'test@example.com');
          setVal(document.getElementById('quote-phone'), '5615551234');
          setVal(document.getElementById('quote-message'), 'Need weekly home cleaning in Boca Raton.');
          document.getElementById('quote-submit-btn').click();
        })()`);
        await cdp.waitForCondition(`Boolean(document.getElementById('quote-success-banner'))`);
        await cdp.domClick('section[data-testid="splash-parallax-slider"] button.btn-primary');
        await cdp.waitForCondition(`Boolean(document.querySelector('.quote-modal-portal[role="dialog"]'))`);
        if (cdp.getErrors().length > 0) failures.push('console errors occurred');

        return {
          passed: failures.length === 0,
          details: failures.length === 0 ? 'Wheel/route interrupts, reduced-motion, and QuoteModal fallback verified' : failures.join('; '),
        };
      }
    )
  );

  // T3-MODALS-BACKDROP-AND-EXIT-INTENT (G8)
  results.push(
    await runCheck(
      'T3-MODALS-BACKDROP-AND-EXIT-INTENT',
      3,
      'Cross-Feature Combinations',
      'QuoteModal backdrop click and ExitIntentBanner premature mouseout guard, ESC, and backdrop dismissal preserve scrollY and overflow',
      async () => {
        cdp.clearErrors();
        const failures = [];
        await cdp.setViewport(VIEWPORTS.desktop);

        // QuoteModal backdrop click
        await cdp.navigate(`${baseUrl}/`);
        await cdp.scrollToInstant(700);
        await cdp.domClick('header.site-header .header-cta button');
        await cdp.waitForCondition(`Boolean(document.querySelector('.quote-modal-portal[role="dialog"]'))`);
        await cdp.domClick('.quote-modal-portal .modal-backdrop');
        await cdp.waitForCondition(`!document.querySelector('.quote-modal-portal[role="dialog"]')`);
        const modalClosed = await cdp.evalJson(`({ overflow: document.body.style.overflow, y: Math.round(window.scrollY) })`);
        if (modalClosed.overflow !== '' || Math.abs(modalClosed.y - 700) > 10) {
          failures.push(`QuoteModal backdrop close failed: ${JSON.stringify(modalClosed)}`);
        }

        // Premature desktop mouseout (<10s dwell) must NOT open ExitIntentBanner
        await cdp.evalJson(`sessionStorage.clear()`);
        await cdp.navigate(`${baseUrl}/`);
        await cdp.evalJson(`document.dispatchEvent(new MouseEvent('mouseout', { clientY: 2, relatedTarget: null, bubbles: true }))`);
        await sleep(60);
        if (await cdp.evalJson(`Boolean(document.querySelector('[data-testid="exit-intent-banner"]'))`)) {
          failures.push('ExitIntentBanner triggered before 10s dwell');
        }

        // ExitIntentBanner ESC & backdrop dismissal restore body.style.overflow
        await cdp.navigate(`${baseUrl}/?exit_intent=1`);
        await cdp.waitForCondition(`Boolean(document.querySelector('[data-testid="exit-intent-banner"]'))`);
        await cdp.pressEscape();
        await cdp.waitForCondition(`!document.querySelector('[data-testid="exit-intent-banner"]')`);
        if ((await cdp.evalJson(`document.body.style.overflow`)) !== '') {
          failures.push('ExitIntentBanner ESC left body.style.overflow locked');
        }

        await cdp.evalJson(`sessionStorage.clear()`);
        await cdp.navigate(`${baseUrl}/?exit_intent=1`);
        await cdp.waitForCondition(`Boolean(document.querySelector('[data-testid="exit-intent-banner"]'))`);
        await cdp.domClick('[data-testid="exit-intent-banner"] > div.fixed');
        await cdp.waitForCondition(`!document.querySelector('[data-testid="exit-intent-banner"]')`);
        if ((await cdp.evalJson(`document.body.style.overflow`)) !== '') {
          failures.push('ExitIntentBanner backdrop click left body.style.overflow locked');
        }
        if (cdp.getErrors().length > 0) failures.push('console errors occurred');

        return {
          passed: failures.length === 0,
          details: failures.length === 0 ? 'QuoteModal backdrop + ExitIntentBanner ESC/backdrop/dwell guard verified' : failures.join('; '),
        };
      }
    )
  );

  // T3-EXIT-INTENT-ROUTE-NAV-NO-FALSE-TRIGGER (R2-G1)
  results.push(
    await runCheck(
      'T3-EXIT-INTENT-ROUTE-NAV-NO-FALSE-TRIGGER',
      3,
      'Cross-Feature Combinations',
      'ScrollToTop route reset after >=15s dwell & >=420px scroll does not falsely open ExitIntentBanner on arrival, while real upward scroll still works',
      async () => {
        cdp.clearErrors();
        const failures = [];

        for (const vp of [VIEWPORTS.mobile, VIEWPORTS.desktop]) {
          await cdp.setViewport(vp);
          await cdp.navigate(`${baseUrl}/`);
          await cdp.evalJson(`(() => {
            sessionStorage.clear();
            window.__origNow = Date.now;
            Date.now = () => window.__origNow() + 20000;
          })()`);
          await cdp.scrollToInstant(1000);
          await sleep(100);

          await cdp.domClick('footer.site-footer a[href="/our-services"]');
          await cdp.waitForCondition(`location.pathname === '/our-services'`);
          await sleep(250);

          const afterNav = await cdp.evalJson(`({
            bannerOpen: Boolean(document.querySelector('[data-testid="exit-intent-banner"]')),
            overflow: document.body.style.overflow,
            y: Math.round(window.scrollY)
          })`);
          await cdp.evalJson(`if (window.__origNow) { Date.now = window.__origNow; delete window.__origNow; }`);

          if (afterNav.bannerOpen) {
            failures.push(`${vp.name}: ExitIntentBanner falsely opened after route nav to /our-services`);
          }
          if (afterNav.overflow !== '') {
            failures.push(`${vp.name}: body.style.overflow="${afterNav.overflow}" after route nav`);
          }
        }

        // Control check: genuine manual downward-then-upward scroll on mobile after 20s dwell STILL triggers ExitIntentBanner
        await cdp.setViewport(VIEWPORTS.mobile);
        await cdp.navigate(`${baseUrl}/`);
        await cdp.evalJson(`(() => {
          sessionStorage.clear();
          window.__origNow = Date.now;
          Date.now = () => window.__origNow() + 20000;
        })()`);
        await cdp.scrollToInstant(700);
        await sleep(80);
        await cdp.scrollToInstant(100);
        await sleep(120);
        const manualUpwardOpen = await cdp.evalJson(`Boolean(document.querySelector('[data-testid="exit-intent-banner"]'))`);
        await cdp.evalJson(`if (window.__origNow) { Date.now = window.__origNow; delete window.__origNow; }`);
        if (!manualUpwardOpen) {
          failures.push('Genuine mobile upward scroll after 20s dwell failed to trigger ExitIntentBanner');
        }
        if (cdp.getErrors().length > 0) failures.push('console errors occurred');

        return {
          passed: failures.length === 0,
          details: failures.length === 0 ? 'Route nav reset suppressed & genuine upward scroll trigger intact' : failures.join('; '),
        };
      }
    )
  );

  // T3-DRAWER-SAME-PATH-POP-AND-HANDOFF (R2-G2)
  results.push(
    await runCheck(
      'T3-DRAWER-SAME-PATH-POP-AND-HANDOFF',
      3,
      'Cross-Feature Combinations',
      'Mobile drawer closes on same-pathname POP, isolates dual accordions, and cleanly hands off scroll lock to QuoteModal',
      async () => {
        cdp.clearErrors();
        const failures = [];
        await cdp.setViewport(VIEWPORTS.mobile);

        // 1) Same-pathname POP closes drawer and restores overflow
        await cdp.navigate(`${baseUrl}/about-us#careers`);
        await sleep(120);
        await cdp.domClick('button.mobile-nav-toggle[data-react-managed="true"]');
        await sleep(50);
        await cdp.domClick('#mobile-nav-drawer a[href="/about-us"]');
        await sleep(80);
        await cdp.domClick('button.mobile-nav-toggle[data-react-managed="true"]');
        await sleep(50);
        await cdp.evalJson(`history.back()`);
        await sleep(120);
        const afterPop = await cdp.evalJson(`({
          hash: location.hash,
          drawerOpen: Boolean(document.getElementById('mobile-nav-drawer')?.classList.contains('is-active')),
          overflow: document.body.style.overflow
        })`);
        if (afterPop.drawerOpen || afterPop.overflow !== '') {
          failures.push(`Same-path POP left drawer open/locked: ${JSON.stringify(afterPop)}`);
        }

        // 2) Dual-accordion persistence + Drawer -> QuoteModal lock handoff
        await cdp.navigate(`${baseUrl}/`);
        await cdp.scrollToInstant(600);
        await cdp.domClick('button.mobile-nav-toggle[data-react-managed="true"]');
        await sleep(60);
        await cdp.clickByText('button.mobile-accordion-toggle', 'Service Areas', '#mobile-nav-drawer');
        await cdp.clickByText('button.mobile-accordion-toggle', 'Our Services', '#mobile-nav-drawer');
        await cdp.clickByText('button.mobile-accordion-toggle', 'Our Services', '#mobile-nav-drawer');
        await sleep(60);
        const acc = await cdp.evalJson(`(() => {
          const toggles = document.querySelectorAll('#mobile-nav-drawer button.mobile-accordion-toggle');
          const lists = document.querySelectorAll('#mobile-nav-drawer .mobile-accordion-content');
          return {
            svc: toggles[0]?.getAttribute('aria-expanded') + ':' + lists[0]?.classList.contains('is-open'),
            area: toggles[1]?.getAttribute('aria-expanded') + ':' + lists[1]?.classList.contains('is-open'),
          };
        })()`);
        if (acc.svc !== 'false:false' || acc.area !== 'true:true') {
          failures.push(`Dual accordion state desynced: ${JSON.stringify(acc)}`);
        }

        await cdp.domClick('#mobile-nav-drawer .drawer-footer button.btn-primary');
        await cdp.waitForCondition(`Boolean(document.querySelector('.quote-modal-portal[role="dialog"]'))`);
        const handoff = await cdp.evalJson(`({
          drawerOpen: Boolean(document.getElementById('mobile-nav-drawer')?.classList.contains('is-active')),
          overflow: document.body.style.overflow
        })`);
        if (handoff.drawerOpen || handoff.overflow !== 'hidden') {
          failures.push(`Drawer -> QuoteModal handoff invalid: ${JSON.stringify(handoff)}`);
        }

        await cdp.domClick('.quote-modal-portal button[aria-label="Close quote modal"]');
        await cdp.waitForCondition(`!document.querySelector('.quote-modal-portal[role="dialog"]')`);
        const restored = await cdp.evalJson(`({ overflow: document.body.style.overflow, y: Math.round(window.scrollY) })`);
        if (restored.overflow !== '' || Math.abs(restored.y - 600) > 10) {
          failures.push(`QuoteModal close after drawer failed: ${JSON.stringify(restored)}`);
        }
        if (cdp.getErrors().length > 0) failures.push('console errors occurred');

        return {
          passed: failures.length === 0,
          details: failures.length === 0 ? 'Same-path POP closed drawer, dual accordions isolated, and drawer->QuoteModal handoff clean' : failures.join('; '),
        };
      }
    )
  );

  return results;
}

// ── TIER 4 REAL-WORLD USER JOURNEYS ──────────────────────────────────────────

async function runTier4Journeys(cdp, baseUrl) {
  const results = [];

  // T4-J1-DESKTOP-COMMERCIAL-BUYER
  results.push(
    await runCheck(
      'T4-J1-DESKTOP-COMMERCIAL-BUYER',
      4,
      'User Journeys',
      'Desktop Commercial Buyer: / -> CleaningEstimator (Office, Weekly, 10k sqft) -> /service/office-cleaning -> /contact-us#quote',
      async () => {
        cdp.clearErrors();
        const failures = [];
        await cdp.setViewport(VIEWPORTS.desktop);
        await cdp.navigate(`${baseUrl}/`);
        await cdp.evalJson(`window.scrollTo({ top: document.getElementById('estimator-section').getBoundingClientRect().top + window.scrollY - 120, behavior: 'instant' })`);
        await cdp.clickByText('button', 'Local Office', '#estimator-section');
        await cdp.clickByText('button', 'Every Week', '#estimator-section');
        await cdp.setInputValue('#estimator-sqft', '10000');
        await sleep(80);
        await cdp.domClick('#estimator-section a[href="/service/office-cleaning"]');
        await cdp.waitForCondition(`location.pathname === '/service/office-cleaning'`);
        await sleep(60);
        const svc = await getLivePageAudit(cdp);
        if (svc.scrollY > 5) failures.push(`/service/office-cleaning t+60ms y=${svc.scrollY}`);
        if (svc.h1Count !== 1 || svc.jsonLdCount !== 1) failures.push(`service SEO invalid (h1=${svc.h1Count}, jsonLd=${svc.jsonLdCount})`);

        await cdp.navigate(`${baseUrl}/contact-us#quote`);
        await sleep(350);
        const qRect = await cdp.evalJson(`Math.round(document.getElementById('quote')?.getBoundingClientRect().top ?? -1)`);
        if (qRect < 60 || qRect > 180) failures.push(`#quote rect.top=${qRect}px outside [60, 180]`);
        await cdp.domClick('#quote-submit-btn');
        await sleep(60);
        const alerts = await cdp.evalJson(`document.querySelectorAll('#lead-quote-form [role="alert"]').length`);
        if (alerts === 0) failures.push('#lead-quote-form validation failed');
        if (cdp.getErrors().length > 0) failures.push(`errors: ${cdp.getErrors().map((e) => e.text).join('; ')}`);

        return {
          passed: failures.length === 0,
          details: failures.length === 0 ? `Completed commercial journey (#quote top=${qRect}px, alerts=${alerts})` : failures.join('; '),
        };
      }
    )
  );

  // T4-J2-MOBILE-LOCAL-HOMEOWNER
  results.push(
    await runCheck(
      'T4-J2-MOBILE-LOCAL-HOMEOWNER',
      4,
      'User Journeys',
      'Mobile Local Homeowner (375x812): / -> drawer -> /service-areas -> search "Jupiter" -> jupiter-inlet-colony -> guide tabs',
      async () => {
        cdp.clearErrors();
        const failures = [];
        await cdp.setViewport(VIEWPORTS.mobile);
        await cdp.navigate(`${baseUrl}/`);
        await cdp.domClick('button.mobile-nav-toggle[data-react-managed="true"]');
        await sleep(60);
        await cdp.clickByText('button.mobile-accordion-toggle', 'Service Areas', '#mobile-nav-drawer');
        await sleep(60);
        await cdp.domClick('#mobile-nav-drawer a[href="/service-areas"]');
        await cdp.waitForCondition(`location.pathname === '/service-areas'`);
        await sleep(80);

        await cdp.setInputValue('input[aria-label="Search service areas by city or neighborhood"]', 'Jupiter');
        await sleep(80);
        await cdp.domClick('main#main-content a[href="/service-area/jupiter-inlet-colony"]');
        await cdp.waitForCondition(`location.pathname === '/service-area/jupiter-inlet-colony'`);
        await sleep(80);

        const city = await getLivePageAudit(cdp);
        if (city.scrollY > 5) failures.push(`city page scrollY=${city.scrollY}`);
        if (city.title.length > EXPECTED_TITLE_MAX_LEN) failures.push(`title "${city.title}" length=${city.title.length} > 60`);
        if (city.mainWords >= 1825 || city.mainWords < 350) failures.push(`mainWords=${city.mainWords} (expected <1825 and >=350)`);
        if (city.jsonLdCount !== 1) failures.push(`jsonLdCount=${city.jsonLdCount}`);
        if (city.scrollWidth > 375) failures.push(`mobile overflow scrollWidth=${city.scrollWidth}`);
        const hasMap = await cdp.evalJson(`Boolean(document.querySelector('[data-testid="service-area-map"] iframe'))`);
        if (!hasMap) failures.push('missing ServiceAreaMap iframe');

        await cdp.clickByText('[role="tab"]', 'Iconic Landmarks', '[aria-label*="landmarks and things to do"]');
        await sleep(60);
        if (cdp.getErrors().length > 0) failures.push(`errors: ${cdp.getErrors().map((e) => e.text).join('; ')}`);

        return {
          passed: failures.length === 0,
          details: failures.length === 0 ? `Completed mobile homeowner journey (title=${city.title.length}c, words=${city.mainWords})` : failures.join('; '),
        };
      }
    )
  );

  // T4-J3-HEALTHCARE-MANAGER
  results.push(
    await runCheck(
      'T4-J3-HEALTHCARE-MANAGER',
      4,
      'User Journeys',
      'Healthcare Practice Manager (1440x900): /our-publications -> Healthcare Sanitation -> medical blog -> medical service -> QuoteModal',
      async () => {
        cdp.clearErrors();
        const failures = [];
        await cdp.setViewport(VIEWPORTS.desktop);
        await cdp.navigate(`${baseUrl}/our-publications`);
        await cdp.clickByText('[aria-label="Filter publications by category"] [role="tab"]', 'Healthcare Sanitation');
        await sleep(60);
        await cdp.domClick('main#main-content article a[href="/blog/medical-office-cleaning-guide"]');
        await cdp.waitForCondition(`location.pathname === '/blog/medical-office-cleaning-guide'`);
        await sleep(80);

        const blog = await getLivePageAudit(cdp);
        if (blog.scrollY > 5) failures.push(`blog scrollY=${blog.scrollY}`);
        if (blog.mainWords < 200 || blog.mainWords >= 1750) failures.push(`blog mainWords=${blog.mainWords} (expected <1750 and >=200)`);
        if (blog.jsonLdCount !== 1) failures.push(`blog jsonLdCount=${blog.jsonLdCount}`);
        if (blog.gluedUrlMatch) failures.push(`blog glued URL: ${blog.gluedUrlMatch}`);

        await cdp.navigate(`${baseUrl}/service/medical-office-cleaning`);
        await cdp.scrollToInstant(800);
        await cdp.domClick('header.site-header .header-cta button');
        await cdp.waitForCondition(`Boolean(document.querySelector('.quote-modal-portal[role="dialog"]'))`);
        await cdp.domClick('.quote-modal-portal button[aria-label="Close quote modal"]');
        await cdp.waitForCondition(`!document.querySelector('.quote-modal-portal[role="dialog"]')`);
        const afterY = await cdp.evalJson(`Math.round(window.scrollY)`);
        if (Math.abs(afterY - 800) > 10) failures.push(`QuoteModal close drifted scrollY=${afterY}`);
        if (cdp.getErrors().length > 0) failures.push(`errors: ${cdp.getErrors().map((e) => e.text).join('; ')}`);

        return {
          passed: failures.length === 0,
          details: failures.length === 0 ? `Completed healthcare journey (blog=${blog.mainWords}w, modal y=${afterY})` : failures.join('; '),
        };
      }
    )
  );

  // T4-J4-FAQ-CAREERS-EXPLORER
  results.push(
    await runCheck(
      'T4-J4-FAQ-CAREERS-EXPLORER',
      4,
      'User Journeys',
      'FAQ & Careers Explorer (Desktop & Mobile): /faqs (h1->h2, 12% promo, toggle) -> /about-us#careers -> /contact-us#careers',
      async () => {
        cdp.clearErrors();
        const failures = [];
        for (const vp of [VIEWPORTS.desktop, VIEWPORTS.mobile]) {
          await cdp.setViewport(vp);
          await cdp.navigate(`${baseUrl}/faqs`);
          const faqs = await getLivePageAudit(cdp);
          if (faqs.headingSkips.length > 0) failures.push(`${vp.name} /faqs heading skips: ${faqs.headingSkips.join(', ')}`);
          const hasPromo = await cdp.evalJson(`(document.body.textContent || '').includes('12%')`);
          if (!hasPromo) failures.push(`${vp.name} /faqs missing 12% promo`);
          await cdp.domClick('#faq-heading-0');
          await sleep(60);

          await cdp.domClick('footer.site-footer a[href="/about-us#careers"]');
          await cdp.waitForCondition(`location.pathname === '/about-us' && Boolean(document.getElementById('careers'))`);
          await sleep(400);
          const aboutTop = await cdp.evalJson(`({ top: Math.round(document.getElementById('careers').getBoundingClientRect().top), hasHiring: document.body.innerText.includes('We Are Hiring!') })`);
          if (!aboutTop.hasHiring) failures.push(`${vp.name} /about-us missing "We Are Hiring!"`);
          if (aboutTop.top < 45 || aboutTop.top > 180) failures.push(`${vp.name} /about-us#careers rect.top=${aboutTop.top}`);

          await cdp.domClick('main#main-content a[href="/contact-us#careers"]');
          await cdp.waitForCondition(`location.pathname === '/contact-us' && Boolean(document.getElementById('careers'))`);
          await sleep(400);
          const contactTop = await cdp.evalJson(`Math.round(document.getElementById('careers').getBoundingClientRect().top)`);
          if (contactTop < 45 || contactTop > 200) failures.push(`${vp.name} /contact-us#careers rect.top=${contactTop}`);
        }
        if (cdp.getErrors().length > 0) failures.push(`errors: ${cdp.getErrors().map((e) => e.text).join('; ')}`);
        return {
          passed: failures.length === 0,
          details: failures.length === 0 ? 'Desktop & Mobile FAQ -> Careers journey passed' : failures.join('; '),
        };
      }
    )
  );

  // T4-J5-LEGACY-REDIRECT-AND-404-RECOVERY
  results.push(
    await runCheck(
      'T4-J5-LEGACY-REDIRECT-AND-404-RECOVERY',
      4,
      'User Journeys',
      'Legacy WP Redirect & 404 Recovery: legacy WP slug -> /blog/medical-office-cleaning-guide -> /nonexistent -> /',
      async () => {
        cdp.clearErrors();
        const failures = [];
        await cdp.setViewport(VIEWPORTS.desktop);
        const legacyUrl = `${baseUrl}/medical-office-cleaning-with-south-florida-cleaning-concepts-a-comprehensive-guide`;
        await cdp.navigate(legacyUrl);
        const redirected = await getLivePageAudit(cdp);
        if (redirected.pathname !== '/blog/medical-office-cleaning-guide') {
          failures.push(`legacy redirect landed on ${redirected.pathname}`);
        }
        if (redirected.jsonLdCount !== 1 || redirected.mainWords < 200) {
          failures.push(`redirected blog invalid (jsonLd=${redirected.jsonLdCount}, words=${redirected.mainWords})`);
        }

        const unknownUrl = `${baseUrl}/nonexistent-cleaning-page`;
        const { statusCode } = await cdp.navigate(unknownUrl, { allow404: true });
        const errAudit = await getLivePageAudit(cdp);
        if (statusCode !== 404 || !/noindex/i.test(errAudit.robots) || errAudit.jsonLdCount !== 0) {
          failures.push(`404 state invalid (status=${statusCode}, robots=${errAudit.robots}, jsonLd=${errAudit.jsonLdCount})`);
        }

        await cdp.domClick('main#main-content a[href="/"]');
        await cdp.waitForCondition(`location.pathname === '/'`);
        await sleep(80);
        const home = await getLivePageAudit(cdp);
        if (home.pathname !== '/' || home.scrollY > 5 || home.jsonLdCount !== 1) {
          failures.push(`recovery invalid (path=${home.pathname}, y=${home.scrollY}, jsonLd=${home.jsonLdCount})`);
        }
        if (cdp.getErrors().length > 0) failures.push(`unexpected errors: ${cdp.getErrors().map((e) => e.text).join('; ')}`);

        return {
          passed: failures.length === 0,
          details: failures.length === 0 ? '301 legacy blog redirect -> 404 noindex/0-JSONLD -> / recovery passed' : failures.join('; '),
        };
      }
    )
  );

  return results;
}

export async function runBrowserChecks({ cdp, baseUrl, tiers }) {
  const results = [];
  if (tiers.includes(1)) results.push(...(await runTier1BrowserChecks(cdp, baseUrl)));
  if (tiers.includes(2)) results.push(...(await runTier2BrowserChecks(cdp, baseUrl)));
  if (tiers.includes(3)) results.push(...(await runTier3Checks(cdp, baseUrl)));
  if (tiers.includes(4)) results.push(...(await runTier4Journeys(cdp, baseUrl)));
  return results;
}
