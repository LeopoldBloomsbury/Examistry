import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .transform((value) => value || undefined);

const booleanish = z.preprocess(
  (value) => value === true || value === "true" || value === "on",
  z.boolean()
);

export const leadCaptureSchema = z.object({
  email: z.string().trim().email(),
  fullName: optionalText,
  examDate: optionalText,
  targetSection: optionalText,
  marketingOptIn: booleanish.default(false),
  source: optionalText,
  utmSource: optionalText,
  utmMedium: optionalText,
  utmCampaign: optionalText,
  referrer: optionalText,
  freeGuideSlug: z.string().trim().min(1)
});

export const checkoutSchema = z.object({
  packSlug: z.string().trim().min(1),
  email: z
    .string()
    .trim()
    .email()
    .optional()
    .or(z.literal(""))
    .transform((value) => value || undefined)
});

export const authEmailSchema = z.object({
  email: z.string().trim().email()
});
