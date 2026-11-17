/**
 * South Florida Cleaning Concepts — Cross-Inbox Responsive Transactional & Lead Mailer
 *
 * Engineered for 100% compatibility and fluid mobile responsiveness across:
 * - Gmail (Web, iOS, Android, & Non-Google IMAP accounts with <style> stripped)
 * - Apple Mail (macOS, iPhone, iPad, Apple Watch)
 * - Microsoft Outlook (Classic Windows Word/MSO VML engine, New Outlook, Outlook.com, M365)
 * - Yahoo Mail, AOL, Samsung Mail, Proton Mail, & Fastmail
 */
import crypto from 'node:crypto';
import nodemailer from 'nodemailer';
import { BUSINESS_NAP } from '../../src/data/siteData';

export const DEFAULT_CONTACT_EMAIL = 'contact@sfcleaningconcepts.com';
export const DEFAULT_FROM_HEADER = `South Florida Cleaning Concepts <${DEFAULT_CONTACT_EMAIL}>`;
export const DEFAULT_SITEGROUND_SMTP_HOST = 'mail.sfcleaningconcepts.com';
export const DEFAULT_SITEGROUND_SMTP_PORT = 465;
export const BRAND_SITE_URL = 'https://sfcleaningconcepts.com';

const SANS_STACK =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const MONO_STACK = "'Courier New',Consolas,Menlo,Monaco,monospace";

export interface SiteGroundSmtpResolvedConfig {
  host: string;
  port: number;
  secure: boolean;
  requireTLS: boolean;
  user: string;
  pass: string;
  fromAddress: string;
  envelopeFrom: string;
  replyTo: string;
  leadRecipients: string[];
  tlsServername?: string;
  hasPassword: boolean;
}

export interface EmailProviderStatus {
  provider: 'siteground-smtp' | 'local-outbox';
  label: string;
  fromAddress: string;
  replyTo: string;
  leadRecipients: string[];
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUser: string;
  liveConfigured: boolean;
  ready: boolean;
}

export interface EmailDispatchRecord {
  id: string;
  to: string;
  from: string;
  replyTo: string;
  subject: string;
  template: string;
  provider: 'siteground-smtp' | 'local-outbox';
  status: 'sent' | 'queued-local' | 'failed';
  messageId?: string;
  error?: string;
  createdAt: string;
}

export interface QuoteLeadDetails {
  referenceId: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  source?: string;
  pageUrl?: string;
  submittedAt?: string;
}

export function extractEnvelopeEmail(headerOrEmail: string): string {
  const trimmed = String(headerOrEmail || '').trim();
  const angleMatch = trimmed.match(/<([^<>@\s]+@[^<>@\s]+)>/);
  if (angleMatch?.[1]) {
    return angleMatch[1].trim().toLowerCase();
  }
  if (trimmed.includes('@') && !trimmed.includes(' ')) {
    return trimmed.toLowerCase();
  }
  return DEFAULT_CONTACT_EMAIL;
}

export function escapeHtml(input: string): string {
  return String(input || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function resolveSiteGroundSmtpConfig(
  env: Record<string, string | undefined> = process.env
): SiteGroundSmtpResolvedConfig {
  const host = (env.SMTP_HOST || DEFAULT_SITEGROUND_SMTP_HOST).trim();
  const parsedPort = Number(env.SMTP_PORT || String(DEFAULT_SITEGROUND_SMTP_PORT));
  const port =
    Number.isFinite(parsedPort) && parsedPort > 0 ? parsedPort : DEFAULT_SITEGROUND_SMTP_PORT;
  const secure =
    env.SMTP_SECURE !== undefined && env.SMTP_SECURE.trim() !== ''
      ? env.SMTP_SECURE.trim().toLowerCase() === 'true'
      : port === 465;
  const user = (env.SMTP_USER || DEFAULT_CONTACT_EMAIL).trim();
  const pass = (env.SMTP_PASS || '').trim();
  const fromAddress = (env.EMAIL_FROM || DEFAULT_FROM_HEADER).trim();
  const replyTo = (env.EMAIL_REPLY_TO || DEFAULT_CONTACT_EMAIL).trim();
  const rawLeadRecipients = (env.EMAIL_LEAD_RECIPIENTS || replyTo || DEFAULT_CONTACT_EMAIL)
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.includes('@'));
  const leadRecipients =
    rawLeadRecipients.length > 0 ? rawLeadRecipients : [DEFAULT_CONTACT_EMAIL];
  const tlsServername = env.SMTP_TLS_SERVERNAME?.trim() || undefined;
  const envelopeFrom = user.includes('@') ? user.toLowerCase() : extractEnvelopeEmail(fromAddress);

  return {
    host,
    port,
    secure,
    requireTLS: !secure && port === 587,
    user,
    pass,
    fromAddress,
    envelopeFrom,
    replyTo,
    leadRecipients,
    tlsServername,
    hasPassword: pass.length > 0,
  };
}

export function getEmailProviderStatus(
  env: Record<string, string | undefined> = process.env
): EmailProviderStatus {
  const cfg = resolveSiteGroundSmtpConfig(env);

  if (cfg.hasPassword) {
    return {
      provider: 'siteground-smtp',
      label: `SiteGround Direct SMTP (${cfg.host}:${cfg.port} ${cfg.secure ? 'SSL/TLS' : 'STARTTLS'})`,
      fromAddress: cfg.fromAddress,
      replyTo: cfg.replyTo,
      leadRecipients: cfg.leadRecipients,
      smtpHost: cfg.host,
      smtpPort: cfg.port,
      smtpSecure: cfg.secure,
      smtpUser: cfg.user,
      liveConfigured: true,
      ready: true,
    };
  }

  return {
    provider: 'local-outbox',
    label: `SiteGround SMTP Staged (${cfg.host}:${cfg.port} — Set SMTP_PASS in Netlify to go live)`,
    fromAddress: cfg.fromAddress,
    replyTo: cfg.replyTo,
    leadRecipients: cfg.leadRecipients,
    smtpHost: cfg.host,
    smtpPort: cfg.port,
    smtpSecure: cfg.secure,
    smtpUser: cfg.user,
    liveConfigured: false,
    ready: false,
  };
}

function createSiteGroundTransporter(cfg: SiteGroundSmtpResolvedConfig) {
  return nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    requireTLS: cfg.requireTLS,
    auth: {
      user: cfg.user,
      pass: cfg.pass,
    },
    tls: cfg.tlsServername
      ? {
          servername: cfg.tlsServername,
          minVersion: 'TLSv1.2',
        }
      : {
          minVersion: 'TLSv1.2',
        },
    connectionTimeout: 8_000,
    greetingTimeout: 8_000,
    socketTimeout: 10_000,
  });
}

export async function verifySiteGroundSmtpConnection(): Promise<{
  verified: boolean;
  liveConfigured: boolean;
  host: string;
  port: number;
  secure: boolean;
  user: string;
  message: string;
}> {
  const cfg = resolveSiteGroundSmtpConfig();
  if (!cfg.hasPassword) {
    return {
      verified: false,
      liveConfigured: false,
      host: cfg.host,
      port: cfg.port,
      secure: cfg.secure,
      user: cfg.user,
      message: `SiteGround SMTP defaults are staged (${cfg.host}:${cfg.port} as ${cfg.user}). Set SMTP_PASS in Netlify Environment Variables to activate live delivery.`,
    };
  }

  try {
    const transporter = createSiteGroundTransporter(cfg);
    await transporter.verify();
    return {
      verified: true,
      liveConfigured: true,
      host: cfg.host,
      port: cfg.port,
      secure: cfg.secure,
      user: cfg.user,
      message: `Connected and authenticated with SiteGround SMTP (${cfg.host}:${cfg.port}) as ${cfg.user}.`,
    };
  } catch (err: any) {
    return {
      verified: false,
      liveConfigured: true,
      host: cfg.host,
      port: cfg.port,
      secure: cfg.secure,
      user: cfg.user,
      message: err?.message || 'Unable to complete SiteGround SMTP handshake.',
    };
  }
}

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  template: string;
  replyTo?: string;
}

export async function dispatchTransactionalEmail(
  params: SendEmailParams,
  env: Record<string, string | undefined> = process.env
): Promise<EmailDispatchRecord> {
  const cfg = resolveSiteGroundSmtpConfig(env);
  const status = getEmailProviderStatus(env);
  const replyTo = params.replyTo || cfg.replyTo;
  const toHeader = Array.isArray(params.to) ? params.to.join(', ') : params.to;
  const createdAt = new Date().toISOString();
  const recordId = `sfcc_mail_${crypto.randomUUID().slice(0, 10)}`;

  if (env.SFCC_TEST_MODE === 'true') {
    return {
      id: recordId,
      to: toHeader,
      from: cfg.fromAddress,
      replyTo,
      subject: params.subject,
      template: params.template,
      provider: 'local-outbox',
      status: 'queued-local',
      createdAt,
    };
  }

  if (status.provider === 'siteground-smtp') {
    try {
      const transporter = createSiteGroundTransporter(cfg);
      const info = await transporter.sendMail({
        from: cfg.fromAddress,
        to: params.to,
        replyTo,
        envelope: {
          from: cfg.envelopeFrom,
          to: params.to,
        },
        headers: {
          'X-Mailer': 'South Florida Cleaning Concepts Dispatch Engine',
          'X-Entity-Ref-ID': recordId,
          'List-Help': `<mailto:${cfg.replyTo}>`,
        },
        subject: params.subject,
        text: params.text,
        html: params.html,
      });

      return {
        id: recordId,
        to: toHeader,
        from: cfg.fromAddress,
        replyTo,
        subject: params.subject,
        template: params.template,
        provider: 'siteground-smtp',
        status: 'sent',
        messageId: info.messageId,
        createdAt,
      };
    } catch (err: any) {
      return {
        id: recordId,
        to: toHeader,
        from: cfg.fromAddress,
        replyTo,
        subject: params.subject,
        template: params.template,
        provider: 'siteground-smtp',
        status: 'failed',
        error: err?.message || 'SiteGround SMTP send failed',
        createdAt,
      };
    }
  }

  return {
    id: recordId,
    to: toHeader,
    from: cfg.fromAddress,
    replyTo,
    subject: params.subject,
    template: params.template,
    provider: 'local-outbox',
    status: 'queued-local',
    createdAt,
  };
}

/**
 * Renders a completely responsive, all-inbox Client Contact & Quote Request Profile Card.
 * Stacks label/value pairs cleanly on <= 600px screens while remaining readable even when
 * <style> blocks are stripped (e.g., Gmail IMAP / Non-Google accounts).
 */
export function renderLeadContactCard(
  lead: QuoteLeadDetails,
  heading: string = 'Client Contact & Property Details'
): string {
  const dialDigits = lead.phone.replace(/[^+\d]/g, '');
  const fullPageUrl = lead.pageUrl
    ? lead.pageUrl.startsWith('http')
      ? lead.pageUrl
      : `${BRAND_SITE_URL}${lead.pageUrl.startsWith('/') ? '' : '/'}${lead.pageUrl}`
    : BRAND_SITE_URL;

  const rows: Array<{ label: string; htmlValue: string }> = [
    {
      label: 'Reference ID',
      htmlValue: `<span style="font-family:${MONO_STACK};font-weight:700;color:#071536;">${escapeHtml(
        lead.referenceId
      )}</span>`,
    },
    {
      label: 'Client Name',
      htmlValue: `<strong>${escapeHtml(lead.name)}</strong>`,
    },
    {
      label: 'Phone Number',
      htmlValue: dialDigits
        ? `<a href="tel:${escapeHtml(dialDigits)}" style="color:#12582e;text-decoration:underline;font-weight:700;">${escapeHtml(
            lead.phone
          )}</a>`
        : escapeHtml(lead.phone),
    },
    {
      label: 'Email Address',
      htmlValue: `<a href="mailto:${escapeHtml(
        lead.email
      )}" style="color:#12582e;text-decoration:underline;font-weight:600;word-break:break-word;overflow-wrap:anywhere;">${escapeHtml(
        lead.email
      )}</a>`,
    },
  ];

  if (lead.source) {
    rows.push({
      label: 'Booking Source',
      htmlValue: escapeHtml(lead.source),
    });
  }

  if (lead.pageUrl) {
    rows.push({
      label: 'Submitted From',
      htmlValue: `<a href="${escapeHtml(
        fullPageUrl
      )}" target="_blank" rel="noopener noreferrer" style="color:#071536;text-decoration:underline;word-break:break-all;">${escapeHtml(
        lead.pageUrl
      )}</a>`,
    });
  }

  const trHtml = rows
    .map((r, idx) => {
      const borderRule = idx < rows.length - 1 ? 'border-bottom:1px solid #E2E8F0;' : '';
      return `<tr>
        <td class="sfcc-contact-label" valign="top" width="132" style="padding:9px 12px 9px 0;width:132px;font-family:${SANS_STACK};font-size:12px;font-weight:700;color:#475569;${borderRule}">${escapeHtml(
        r.label
      )}</td>
        <td class="sfcc-contact-val" valign="top" style="padding:9px 0;font-family:${SANS_STACK};font-size:13px;line-height:1.5;color:#0F172A;word-break:break-word;overflow-wrap:anywhere;${borderRule}">${
        r.htmlValue
      }</td>
      </tr>`;
    })
    .join('');

  return `<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#F8FAFC" style="margin:20px 0;background-color:#F8FAFC;border:1px solid #CBD5E1;border-radius:12px;border-collapse:separate;mso-table-lspace:0pt;mso-table-rspace:0pt;">
    <tr>
      <td class="sfcc-card-pad" style="padding:18px 20px;">
        <div style="font-family:${SANS_STACK};font-size:11px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;color:#12582e;margin-bottom:10px;">${escapeHtml(
          heading
        )}</div>
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
          ${trHtml}
        </table>
      </td>
    </tr>
  </table>`;
}

/**
 * Bulletproof CTA Button with Microsoft Outlook VML <v:roundrect> fallback AND
 * full-width tap-target expansion (.sfcc-btn) on mobile screens.
 */
export function renderPrimaryButton(
  label: string,
  href: string,
  tone: 'emerald' | 'navy' = 'emerald'
): string {
  const bg = tone === 'navy' ? '#071536' : '#12582e';
  const safeHref = escapeHtml(href);
  const safeLabel = escapeHtml(label);

  return `<table role="presentation" class="sfcc-btn" border="0" cellspacing="0" cellpadding="0" style="margin:22px 0 8px;border-collapse:separate;mso-table-lspace:0pt;mso-table-rspace:0pt;">
    <tr>
      <td align="center" bgcolor="${bg}" style="border-radius:10px;background-color:${bg};">
        <!--[if mso]>
        <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${safeHref}" style="height:46px;v-text-anchor:middle;width:280px;" arcsize="22%" stroke="f" fillcolor="${bg}">
          <w:anchorlock/>
          <center style="color:#FFFFFF;font-family:Segoe UI,Arial,sans-serif;font-size:14px;font-weight:bold;">
            ${safeLabel} &rarr;
          </center>
        </v:roundrect>
        <![endif]-->
        <!--[if !mso]><!-->
        <a href="${safeHref}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:13px 26px;font-family:${SANS_STACK};font-size:14px;font-weight:700;line-height:20px;color:#FFFFFF;background-color:${bg};text-decoration:none;border-radius:10px;-webkit-text-size-adjust:none;">
          ${safeLabel} &rarr;
        </a>
        <!--<![endif]-->
      </td>
    </tr>
  </table>`;
}

export interface EmailShellOptions {
  title: string;
  preheader: string;
  badgeLabel: string;
  badgeTone?: 'emerald' | 'navy';
  bodyHtml: string;
  replyInbox?: string;
}

/**
 * Universal All-Inbox Responsive Email Document Shell for South Florida Cleaning Concepts.
 */
export function wrapEmailShell(options: EmailShellOptions): string {
  const safeInbox = escapeHtml(options.replyInbox || DEFAULT_CONTACT_EMAIL);
  const badgePalette =
    options.badgeTone === 'navy'
      ? { bg: '#E0E7FF', text: '#1E3A8A', border: '#C7D2FE' }
      : { bg: '#E8F5EE', text: '#12582e', border: '#A7F3D0' };

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="color-scheme" content="light only" />
  <meta name="supported-color-schemes" content="light only" />
  <title>${escapeHtml(options.title)}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #F1F5F9; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
    u + #body a { color: inherit; text-decoration: none; font-size: inherit; font-family: inherit; font-weight: inherit; line-height: inherit; }
    #MessageViewBody a { color: inherit; text-decoration: none; font-size: inherit; font-family: inherit; font-weight: inherit; line-height: inherit; }
    @media only screen and (max-width: 600px) {
      .sfcc-outer { padding: 12px 8px !important; }
      .sfcc-container { width: 100% !important; max-width: 100% !important; border-radius: 14px !important; }
      .sfcc-px { padding-left: 18px !important; padding-right: 18px !important; }
      .sfcc-py { padding-top: 22px !important; padding-bottom: 22px !important; }
      .sfcc-card-pad { padding: 14px 15px !important; }
      .sfcc-header-col { display: block !important; width: 100% !important; text-align: left !important; }
      .sfcc-badge-col { display: block !important; width: 100% !important; text-align: left !important; padding-top: 12px !important; }
      .sfcc-contact-label { display: block !important; width: 100% !important; padding: 8px 0 2px 0 !important; border-bottom: none !important; }
      .sfcc-contact-val { display: block !important; width: 100% !important; padding: 0 0 9px 0 !important; }
      .sfcc-btn { width: 100% !important; }
      .sfcc-btn td { width: 100% !important; display: block !important; }
      .sfcc-btn a { width: 100% !important; display: block !important; box-sizing: border-box !important; text-align: center !important; padding-left: 16px !important; padding-right: 16px !important; }
      .sfcc-h1 { font-size: 21px !important; line-height: 1.28 !important; }
    }
  </style>
</head>
<body id="body" bgcolor="#F1F5F9" style="margin:0;padding:0;width:100%;background-color:#F1F5F9;font-family:${SANS_STACK};color:#0F172A;-webkit-font-smoothing:antialiased;">
  <!-- Inbox Preview Preheader + Whitespace Padding Guard -->
  <div style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;">
    ${escapeHtml(options.preheader)}&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;
  </div>
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#F1F5F9" style="width:100%;background-color:#F1F5F9;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
    <tr>
      <td class="sfcc-outer" align="center" style="padding:26px 12px;">
        <!--[if mso]>
        <table role="presentation" width="600" align="center" border="0" cellspacing="0" cellpadding="0">
        <tr>
        <td>
        <![endif]-->
        <table role="presentation" class="sfcc-container" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" style="width:100%;max-width:600px;background-color:#FFFFFF;border:1px solid #CBD5E1;border-radius:16px;overflow:hidden;border-collapse:separate;mso-table-lspace:0pt;mso-table-rspace:0pt;">
          <!-- 3-Segment Brand Accent Bar -->
          <tr>
            <td style="padding:0;font-size:0;line-height:0;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                <tr>
                  <td width="65%" bgcolor="#071536" style="height:6px;background-color:#071536;font-size:0;line-height:0;">&nbsp;</td>
                  <td width="25%" bgcolor="#12582e" style="height:6px;background-color:#12582e;font-size:0;line-height:0;">&nbsp;</td>
                  <td width="10%" bgcolor="#10B981" style="height:6px;background-color:#10B981;font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Responsive Brand Header -->
          <tr>
            <td class="sfcc-px" bgcolor="#071536" style="padding:22px 28px;background-color:#071536;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                <tr>
                  <td class="sfcc-header-col" valign="middle" align="left">
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                      <tr>
                        <td valign="middle" width="40" height="40" bgcolor="#12582e" align="center" style="width:40px;height:40px;background-color:#12582e;border-radius:10px;text-align:center;font-family:${SANS_STACK};font-size:14px;font-weight:800;color:#FFFFFF;letter-spacing:0.04em;">
                          SFCC
                        </td>
                        <td valign="middle" style="padding-left:12px;">
                          <a href="${BRAND_SITE_URL}" target="_blank" rel="noopener noreferrer" style="font-family:${SANS_STACK};font-size:18px;font-weight:800;color:#FFFFFF;text-decoration:none;letter-spacing:-0.01em;">${escapeHtml(
    BUSINESS_NAP.name
  )}</a>
                          <div style="font-family:${SANS_STACK};font-size:11px;line-height:1.35;color:#A3E6BE;margin-top:2px;">Palm Beach &middot; Broward &middot; Miami-Dade &middot; ${escapeHtml(
    BUSINESS_NAP.phone
  )}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td class="sfcc-badge-col" valign="middle" align="right">
                    <span style="display:inline-block;padding:5px 11px;border-radius:999px;background-color:${badgePalette.bg};border:1px solid ${badgePalette.border};font-family:${SANS_STACK};color:${badgePalette.text};font-size:10px;font-weight:800;letter-spacing:0.06em;text-transform:uppercase;white-space:nowrap;">
                      ${escapeHtml(options.badgeLabel)}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Main Body -->
          <tr>
            <td class="sfcc-px sfcc-py" bgcolor="#FFFFFF" style="padding:28px 28px 26px;background-color:#FFFFFF;font-family:${SANS_STACK};font-size:14px;line-height:1.65;color:#1E293B;word-break:break-word;">
              ${options.bodyHtml}
            </td>
          </tr>
          <!-- Responsive Company Contact & Guarantee Footer -->
          <tr>
            <td class="sfcc-px" bgcolor="#F8FAFC" style="padding:22px 28px;background-color:#F8FAFC;border-top:1px solid #E2E8F0;font-family:${SANS_STACK};font-size:12px;line-height:1.6;color:#475569;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                <tr>
                  <td style="padding-bottom:10px;word-break:break-word;">
                    <strong style="color:#071536;">${escapeHtml(BUSINESS_NAP.legalName)}</strong><br />
                    Phone: <a href="tel:${escapeHtml(BUSINESS_NAP.phoneRaw)}" style="color:#12582e;text-decoration:underline;font-weight:700;">${escapeHtml(
    BUSINESS_NAP.phone
  )}</a> &nbsp;&middot;&nbsp;
                    Email: <a href="mailto:${safeInbox}" style="color:#12582e;text-decoration:underline;font-weight:600;">${safeInbox}</a><br />
                    Hours: ${escapeHtml(BUSINESS_NAP.hours)} &nbsp;&middot;&nbsp; Headquarters: Boynton Beach, FL
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:10px;font-size:12px;line-height:1.8;">
                    <a href="${BRAND_SITE_URL}/our-services" target="_blank" rel="noopener noreferrer" style="color:#071536;text-decoration:underline;white-space:nowrap;">Cleaning Services</a> &nbsp;&middot;&nbsp;
                    <a href="${BRAND_SITE_URL}/service-areas" target="_blank" rel="noopener noreferrer" style="color:#071536;text-decoration:underline;white-space:nowrap;">Service Areas</a> &nbsp;&middot;&nbsp;
                    <a href="${BRAND_SITE_URL}/contact-us" target="_blank" rel="noopener noreferrer" style="color:#071536;text-decoration:underline;white-space:nowrap;">Request a Quote</a> &nbsp;&middot;&nbsp;
                    <a href="${escapeHtml(BUSINESS_NAP.facebookUrl)}" target="_blank" rel="noopener noreferrer" style="color:#071536;text-decoration:underline;white-space:nowrap;">Facebook (${escapeHtml(
    BUSINESS_NAP.facebookHandle
  )})</a>
                  </td>
                </tr>
                <tr>
                  <td style="font-size:11px;color:#64748B;">
                    100% Love-Your-Clean Guarantee &middot; Licensed, Bonded &amp; Insured across South Florida.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <!--[if mso]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * 1. Internal Team Dispatch Alert (sent to contact@sfcleaningconcepts.com / EMAIL_LEAD_RECIPIENTS)
 */
export async function sendInternalLeadAlertEmail(
  lead: QuoteLeadDetails,
  env: Record<string, string | undefined> = process.env
): Promise<EmailDispatchRecord> {
  const cfg = resolveSiteGroundSmtpConfig(env);
  const dialDigits = lead.phone.replace(/[^+\d]/g, '') || BUSINESS_NAP.phoneRaw;
  const contactCardHtml = renderLeadContactCard(lead, 'New Website Quote Request · Client Profile');

  const bodyHtml = `<h1 class="sfcc-h1" style="margin:0 0 10px;font-family:${SANS_STACK};font-size:22px;font-weight:800;line-height:1.3;color:#071536;">New Cleaning Quote Request from ${escapeHtml(
    lead.name
  )}</h1>
    <p style="margin:0 0 16px;color:#334155;">A new website quote inquiry (eligible for the <strong>12% Website Booking Offer</strong>) was just submitted on <strong>sfcleaningconcepts.com</strong>. Hit <strong>Reply</strong> to email ${escapeHtml(
      lead.name
    )} directly, or tap below to call.</p>

    ${contactCardHtml}

    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ECFDF5" style="margin:18px 0;background-color:#ECFDF5;border:1px solid #A7F3D0;border-radius:12px;border-collapse:separate;mso-table-lspace:0pt;mso-table-rspace:0pt;">
      <tr>
        <td class="sfcc-card-pad" style="padding:16px 20px;font-family:${SANS_STACK};color:#064E3B;">
          <div style="font-size:11px;font-weight:800;letter-spacing:0.06em;text-transform:uppercase;color:#12582e;margin-bottom:6px;">Property &amp; Cleaning Notes</div>
          <div style="font-size:14px;line-height:1.6;color:#0F172A;white-space:pre-line;">${escapeHtml(
            lead.message
          )}</div>
        </td>
      </tr>
    </table>

    ${renderPrimaryButton(`Call ${lead.name} (${lead.phone})`, `tel:${dialDigits}`, 'emerald')}`;

  const html = wrapEmailShell({
    title: `New Quote Request (${lead.referenceId}) — ${lead.name}`,
    preheader: `${lead.name} (${lead.phone}) requested a quote from ${lead.source || 'sfcleaningconcepts.com'}.`,
    badgeLabel: 'New Quote Lead',
    badgeTone: 'emerald',
    bodyHtml,
    replyInbox: cfg.replyTo,
  });

  const text = [
    `NEW QUOTE REQUEST — ${BUSINESS_NAP.name} (${lead.referenceId})`,
    `Client Name: ${lead.name}`,
    `Phone: ${lead.phone}`,
    `Email: ${lead.email}`,
    `Source: ${lead.source || 'Website Quote Form'}`,
    `Page: ${lead.pageUrl || '/'}`,
    ``,
    `Property & Cleaning Notes:`,
    lead.message,
  ].join('\n');

  return dispatchTransactionalEmail(
    {
      to: cfg.leadRecipients,
      replyTo: lead.email,
      subject: `[New Quote ${lead.referenceId}] ${lead.name} — ${lead.phone} (${lead.source || 'Website'})`,
      html,
      text,
      template: 'internal_quote_lead_alert',
    },
    env
  );
}

/**
 * 2. Client Quote Confirmation Auto-Reply (sent to the customer's email)
 */
export async function sendClientQuoteConfirmationEmail(
  lead: QuoteLeadDetails,
  env: Record<string, string | undefined> = process.env
): Promise<EmailDispatchRecord> {
  const cfg = resolveSiteGroundSmtpConfig(env);
  const firstName = lead.name.trim().split(/\s+/)[0] || 'there';
  const contactCardHtml = renderLeadContactCard(lead, 'Your Submitted Request Summary');

  const bodyHtml = `<h1 class="sfcc-h1" style="margin:0 0 10px;font-family:${SANS_STACK};font-size:23px;font-weight:800;line-height:1.3;color:#071536;">We Got Your Quote Request, ${escapeHtml(
    firstName
  )}!</h1>
    <p style="margin:0 0 16px;color:#334155;">Thank you for reaching out to <strong>${escapeHtml(
      BUSINESS_NAP.name
    )}</strong>! Our local South Florida scheduling team is reviewing your property details right now and will call or text you shortly at <strong>${escapeHtml(
    lead.phone
  )}</strong>.</p>

    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ECFDF5" style="margin:18px 0;background-color:#ECFDF5;border:1px solid #A7F3D0;border-radius:12px;border-collapse:separate;mso-table-lspace:0pt;mso-table-rspace:0pt;">
      <tr>
        <td class="sfcc-card-pad" style="padding:16px 20px;font-family:${SANS_STACK};color:#064E3B;">
          <div style="font-size:11px;font-weight:800;letter-spacing:0.06em;text-transform:uppercase;color:#12582e;margin-bottom:4px;">Website Booking Savings Locked In</div>
          <div style="font-size:14px;font-weight:700;color:#071536;">${escapeHtml(
            BUSINESS_NAP.websiteDiscountHeadline
          )}</div>
          <div style="font-size:13px;color:#334155;margin-top:4px;">${escapeHtml(
            BUSINESS_NAP.websiteDiscountDetail
          )}</div>
        </td>
      </tr>
    </table>

    ${contactCardHtml}

    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#F8FAFC" style="margin:16px 0;background-color:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;border-collapse:separate;mso-table-lspace:0pt;mso-table-rspace:0pt;">
      <tr>
        <td class="sfcc-card-pad" style="padding:14px 18px;font-family:${SANS_STACK};font-size:13px;color:#334155;">
          <strong style="color:#071536;">Your Notes:</strong><br />
          <span style="white-space:pre-line;">${escapeHtml(lead.message)}</span>
        </td>
      </tr>
    </table>

    <p style="margin:16px 0 0;font-size:13px;color:#475569;">Need same-day scheduling or want to speak with us right away? Call us directly at <a href="tel:${escapeHtml(
      BUSINESS_NAP.phoneRaw
    )}" style="color:#12582e;font-weight:700;text-decoration:underline;">${escapeHtml(
    BUSINESS_NAP.phone
  )}</a> or reply directly to this email.</p>

    ${renderPrimaryButton(`Call Us Now: ${BUSINESS_NAP.phone}`, `tel:${BUSINESS_NAP.phoneRaw}`, 'emerald')}`;

  const html = wrapEmailShell({
    title: `Quote Request Received (${lead.referenceId}) — ${BUSINESS_NAP.name}`,
    preheader: `Thanks ${firstName}! Your 12% Website Booking Discount is locked in — our team will reach out shortly at ${lead.phone}.`,
    badgeLabel: 'Request Confirmed',
    badgeTone: 'emerald',
    bodyHtml,
    replyInbox: cfg.replyTo,
  });

  const text = [
    `Hi ${firstName},`,
    ``,
    `Thank you for requesting a quote from ${BUSINESS_NAP.name}!`,
    `Reference ID: ${lead.referenceId}`,
    `12% Website Offer: ${BUSINESS_NAP.websiteDiscountDetail}`,
    ``,
    `Our local South Florida team is reviewing your note and will call or text you shortly at ${lead.phone}.`,
    `Need immediate help? Call ${BUSINESS_NAP.phone} (${BUSINESS_NAP.hours}) or reply to ${cfg.replyTo}.`,
    ``,
    `Your Submitted Notes:`,
    lead.message,
  ].join('\n');

  return dispatchTransactionalEmail(
    {
      to: lead.email,
      replyTo: cfg.replyTo,
      subject: `We Got Your Quote Request (${lead.referenceId}) — ${BUSINESS_NAP.name}`,
      html,
      text,
      template: 'client_quote_confirmation',
    },
    env
  );
}

/**
 * 3. Live SiteGround SMTP Diagnostic Test Email
 */
export async function sendSiteGroundTestEmail(
  recipientEmail: string,
  env: Record<string, string | undefined> = process.env
): Promise<EmailDispatchRecord> {
  const cfg = resolveSiteGroundSmtpConfig(env);
  const timestamp = new Date().toISOString();
  const sampleLead: QuoteLeadDetails = {
    referenceId: 'SFCC-TEST-001',
    name: 'South Florida Cleaning Test',
    email: recipientEmail,
    phone: BUSINESS_NAP.phone,
    message:
      'Responsive all-inbox SiteGround SMTP verification test across Gmail, Apple Mail/iOS, Outlook Windows (MSO/VML), and <=600px mobile layouts.',
    source: 'SiteGround SMTP Live Verification',
    pageUrl: '/contact-us',
    submittedAt: timestamp,
  };

  const bodyHtml = `<h1 class="sfcc-h1" style="margin:0 0 10px;font-family:${SANS_STACK};font-size:22px;font-weight:800;line-height:1.3;color:#071536;">SiteGround Direct SMTP Is Live!</h1>
    <p style="margin:0 0 16px;color:#334155;">Outbound transactional &amp; lead dispatch from <strong>${escapeHtml(
      cfg.fromAddress
    )}</strong> via <strong>${escapeHtml(cfg.host)}:${cfg.port}</strong> (SSL/TLS) is authenticated and delivering cleanly.</p>
    ${renderLeadContactCard(sampleLead, 'Sample Responsive Lead Profile Card')}
    ${renderPrimaryButton('Visit South Florida Cleaning Concepts', BRAND_SITE_URL, 'navy')}`;

  const html = wrapEmailShell({
    title: `SiteGround SMTP Verified — ${BUSINESS_NAP.name}`,
    preheader: `Verified outbound SSL/TLS delivery from ${cfg.user} via ${cfg.host}:${cfg.port}.`,
    badgeLabel: 'SMTP Verified',
    badgeTone: 'navy',
    bodyHtml,
    replyInbox: cfg.replyTo,
  });

  return dispatchTransactionalEmail(
    {
      to: recipientEmail,
      subject: `South Florida Cleaning Concepts — SiteGround SMTP Live Test (${cfg.user})`,
      html,
      text: `SiteGround SMTP test from ${cfg.fromAddress} via ${cfg.host}:${cfg.port} at ${timestamp}.`,
      template: 'siteground_smtp_test',
    },
    env
  );
}
