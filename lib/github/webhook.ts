import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Verify the X-Hub-Signature-256 header GitHub attaches to every webhook.
 * Returns true iff the HMAC-SHA256 of the raw body with our secret matches.
 *
 * If your webhook secret contains characters that need escaping in env vars,
 * remember to quote it when setting `GITHUB_WEBHOOK_SECRET`.
 */
export function verifyGithubSignature(rawBody: string, signatureHeader: string | null): boolean {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret || !signatureHeader) return false;
  const expected = "sha256=" + createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
  const expectedBuf = Buffer.from(expected);
  const providedBuf = Buffer.from(signatureHeader);
  if (expectedBuf.length !== providedBuf.length) return false;
  return timingSafeEqual(expectedBuf, providedBuf);
}
