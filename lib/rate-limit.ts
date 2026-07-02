import { db } from "@/lib/db";

const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 3;

export async function checkRateLimit(ip: string, action: string): Promise<boolean> {
  const cutoff = new Date(Date.now() - WINDOW_MS);

  await db.rateLimit.deleteMany({
    where: { createdAt: { lt: cutoff } },
  });

  const count = await db.rateLimit.count({
    where: {
      ip,
      action,
      createdAt: { gte: cutoff },
    },
  });

  if (count >= MAX_REQUESTS) return false;

  await db.rateLimit.create({
    data: { ip, action },
  });

  return true;
}
