import { Resend } from "resend";
import { absoluteUrl, serverEnv } from "@/lib/env";
import type { FreeGuide, StudyPack } from "@/types";

let resendClient: Resend | null = null;

export function getResend() {
  if (!serverEnv.resendApiKey) {
    return null;
  }

  if (!resendClient) {
    resendClient = new Resend(serverEnv.resendApiKey);
  }

  return resendClient;
}

export async function sendGuideDeliveryEmail({
  email,
  guide,
  relatedPack
}: {
  email: string;
  guide: FreeGuide;
  relatedPack?: StudyPack;
}) {
  const resend = getResend();

  if (!resend || !serverEnv.resendFromEmail) {
    return;
  }

  const guideUrl = absoluteUrl(`/free-guides/${guide.slug}/thank-you`);
  const nextStep = relatedPack
    ? `<p style="margin:16px 0 0;color:#44403c;">Next step: <a href="${absoluteUrl(`/packs/${relatedPack.slug}`)}" style="color:#1d4ed8;">${relatedPack.title}</a></p>`
    : "";

  await resend.emails.send({
    from: serverEnv.resendFromEmail,
    to: email,
    subject: `${guide.title} from CertKit`,
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#18181b;">
        <p style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#71717a;">CertKit</p>
        <h1 style="font-size:28px;line-height:1.2;margin:16px 0 12px;">${guide.title}</h1>
        <p style="margin:0 0 12px;color:#52525b;">${guide.subtitle}</p>
        <p style="margin:0 0 18px;color:#3f3f46;">Open your guide here: <a href="${guideUrl}" style="color:#1d4ed8;">${guideUrl}</a></p>
        ${nextStep}
      </div>
    `
  });
}

export async function sendPurchaseAccessEmail({
  email,
  pack
}: {
  email: string;
  pack: StudyPack;
}) {
  const resend = getResend();

  if (!resend || !serverEnv.resendFromEmail) {
    return;
  }

  await resend.emails.send({
    from: serverEnv.resendFromEmail,
    to: email,
    subject: `Your ${pack.title} access is ready`,
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#18181b;">
        <p style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#71717a;">CertKit</p>
        <h1 style="font-size:28px;line-height:1.2;margin:16px 0 12px;">${pack.title}</h1>
        <p style="margin:0 0 18px;color:#52525b;">Your purchase has been fulfilled. Open your study dashboard below.</p>
        <p style="margin:0;"><a href="${absoluteUrl("/dashboard")}" style="color:#1d4ed8;">Go to dashboard</a></p>
      </div>
    `
  });
}

export async function sendPendingClaimEmail({
  email,
  pack
}: {
  email: string;
  pack: StudyPack;
}) {
  const resend = getResend();

  if (!resend || !serverEnv.resendFromEmail) {
    return;
  }

  await resend.emails.send({
    from: serverEnv.resendFromEmail,
    to: email,
    subject: `Claim your ${pack.title} access`,
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#18181b;">
        <p style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#71717a;">CertKit</p>
        <h1 style="font-size:28px;line-height:1.2;margin:16px 0 12px;">Claim your access</h1>
        <p style="margin:0 0 18px;color:#52525b;">We received your purchase for ${pack.title}. Sign in with the same email you used at checkout and we will reconcile your entitlement automatically.</p>
        <p style="margin:0;"><a href="${absoluteUrl("/sign-in")}" style="color:#1d4ed8;">Sign in to claim access</a></p>
      </div>
    `
  });
}
