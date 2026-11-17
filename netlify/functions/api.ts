/**
 * South Florida Cleaning Concepts — Netlify Serverless Function API (v2)
 * Handles SiteGround Direct SMTP lead notifications, client quote confirmations,
 * operational status checks, and authenticated SMTP test dispatches.
 */
import crypto from 'node:crypto';
import { validateQuoteFields } from '../../src/utils/netlifyForm';
import {
  getEmailProviderStatus,
  verifySiteGroundSmtpConnection,
  sendInternalLeadAlertEmail,
  sendClientQuoteConfirmationEmail,
  sendSiteGroundTestEmail,
  type QuoteLeadDetails,
} from './mailer';

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-admin-secret',
};

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...CORS_HEADERS,
    },
  });
}

function timingSafeMatch(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function isAuthorizedAdmin(req: Request, parsedBody?: any): boolean {
  const expected = (process.env.ADMIN_SECRET || '').trim();
  if (!expected) return false;

  const authHeader = req.headers.get('authorization') || '';
  const bearer = authHeader.toLowerCase().startsWith('bearer ')
    ? authHeader.slice(7).trim()
    : '';
  const candidate = String(
    parsedBody?.adminSecret || req.headers.get('x-admin-secret') || bearer || ''
  ).trim();

  if (!candidate) return false;
  return timingSafeMatch(candidate, expected);
}

export default async function handler(req: Request): Promise<Response> {
  const method = req.method.toUpperCase();
  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  const url = new URL(req.url);
  const pathname = url.pathname.replace(/^\/\.netlify\/functions\/api/, '/api');

  // 1. GET /api/email/status (Non-secret operational health check)
  if (method === 'GET' && (pathname === '/api/email/status' || pathname === '/api/health')) {
    return jsonResponse(200, {
      ok: true,
      email: getEmailProviderStatus(),
    });
  }

  // 2. POST /api/quote (Lead alert to contact@sfcleaningconcepts.com + Client confirmation email)
  if (method === 'POST' && pathname === '/api/quote') {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

    // Silent honeypot drop
    const botField = String(body.botField ?? body['bot-field'] ?? '').trim();
    if (botField.length > 0) {
      return jsonResponse(200, { ok: true, honeypotTripped: true });
    }

    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim();
    const phone = String(body.phone || '').trim();
    const message = String(body.message || '').trim();
    const source = String(body.source || 'Website Quote Form').trim();
    const pageUrl = String(body.pageUrl || body.page_url || '/').trim();

    const validation = validateQuoteFields({ name, email, phone, message });
    if (!validation.isValid) {
      return jsonResponse(400, {
        ok: false,
        error: 'Please check your name, email, 10-digit phone number, and cleaning notes.',
        errors: validation.errors,
      });
    }

    const referenceId = `SFCC-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
    const lead: QuoteLeadDetails = {
      referenceId,
      name,
      email,
      phone,
      message,
      source,
      pageUrl,
      submittedAt: new Date().toISOString(),
    };

    const [teamAlert, clientConfirmation] = await Promise.all([
      sendInternalLeadAlertEmail(lead),
      sendClientQuoteConfirmationEmail(lead),
    ]);

    return jsonResponse(200, {
      ok: true,
      referenceId,
      teamAlert: {
        status: teamAlert.status,
        provider: teamAlert.provider,
        messageId: teamAlert.messageId,
      },
      clientConfirmation: {
        status: clientConfirmation.status,
        provider: clientConfirmation.provider,
        messageId: clientConfirmation.messageId,
      },
    });
  }

  // 3. POST /api/email/test (Admin-authenticated live SiteGround SMTP test)
  if (method === 'POST' && pathname === '/api/email/test') {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    if (!isAuthorizedAdmin(req, body)) {
      return jsonResponse(401, { error: 'Unauthorized' });
    }

    const recipient = String(body.to || 'contact@sfcleaningconcepts.com').trim();
    if (!recipient.includes('@')) {
      return jsonResponse(400, { error: 'Valid recipient email required.' });
    }

    const connection = await verifySiteGroundSmtpConnection();
    const dispatch = await sendSiteGroundTestEmail(recipient);

    return jsonResponse(dispatch.status === 'failed' ? 502 : 200, {
      ok: dispatch.status !== 'failed',
      connection,
      dispatch,
    });
  }

  return jsonResponse(404, { error: `Endpoint not found: ${method} ${pathname}` });
}
