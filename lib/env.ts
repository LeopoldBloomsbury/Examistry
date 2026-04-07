export const serverEnv = {
  appUrl: (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  resendFromEmail: process.env.RESEND_FROM_EMAIL ?? ""
};

export const integrations = {
  supabasePublic: Boolean(serverEnv.supabaseUrl && serverEnv.supabaseAnonKey),
  supabaseAdmin: Boolean(serverEnv.supabaseUrl && serverEnv.supabaseServiceRoleKey),
  stripe: Boolean(serverEnv.stripeSecretKey),
  stripeWebhooks: Boolean(serverEnv.stripeSecretKey && serverEnv.stripeWebhookSecret),
  resend: Boolean(serverEnv.resendApiKey && serverEnv.resendFromEmail)
};

export function absoluteUrl(path = "/") {
  return new URL(path, serverEnv.appUrl).toString();
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}
