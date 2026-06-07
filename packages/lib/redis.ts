import Redis from "ioredis";
import { validateEnv } from "@book-in/config";

let redisInstance: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redisInstance) {
    const env = validateEnv();
    const url = env.REDIS_URL || "redis://localhost:6379";
    
    redisInstance = new Redis(url, {
      lazyConnect: true,          // don't connect until first command
      enableOfflineQueue: false,  // don't queue commands when disconnected
      maxRetriesPerRequest: 0,    // fail immediately, no retry spam
      retryStrategy: () => null,  // never reconnect — just stay dead
    });

    redisInstance.on("error", (err) => {
      // Gracefully silence the connection refused error to avoid flooding logs
    });
  }
  return redisInstance;
}

// 1. Slot Locking (SET NX with TTL in seconds, default 5-minute/300s)
export async function acquireSlotLock(
  slotId: string,
  sessionId: string,
  ttlSeconds: number = 300
): Promise<boolean> {
  const redis = getRedisClient();
  const lockKey = `slot:lock:${slotId}`;
  
  try {
    // NX - Only set if not exists, EX ttlSeconds - Expiry in seconds
    const result = await redis.set(lockKey, sessionId, "EX", ttlSeconds, "NX");
    return result === "OK";
  } catch (err) {
    console.error(`[Redis] Failed to acquire lock for slot ${slotId}:`, err);
    // Redis locking failure is critical and must return false (blocks booking)
    return false;
  }
}

export async function releaseSlotLock(slotId: string, sessionId: string): Promise<boolean> {
  const redis = getRedisClient();
  const lockKey = `slot:lock:${slotId}`;

  // Use Lua script to safely release lock only if it matches sessionId
  const luaScript = `
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("del", KEYS[1])
    else
      return 0
    end
  `;

  try {
    const result = await redis.eval(luaScript, 1, lockKey, sessionId);
    return result === 1;
  } catch (err) {
    console.error(`[Redis] Failed to release lock for slot ${slotId}:`, err);
    return false;
  }
}

// 2. Clinic Config Cache (60 seconds TTL)
export async function getCachedClinicConfig(slug: string): Promise<any | null> {
  const redis = getRedisClient();
  const key = `clinic:config:${slug}`;
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.warn(`[Redis] Cache read failed for clinic slug ${slug}:`, err);
    return null; // Graceful fallback to DB
  }
}

export async function cacheClinicConfig(slug: string, config: any): Promise<void> {
  const redis = getRedisClient();
  const key = `clinic:config:${slug}`;
  try {
    await redis.set(key, JSON.stringify(config), "EX", 60);
  } catch (err) {
    console.warn(`[Redis] Cache write failed for clinic slug ${slug}:`, err);
  }
}

export async function invalidateClinicConfig(slug: string): Promise<void> {
  const redis = getRedisClient();
  const key = `clinic:config:${slug}`;
  try {
    await redis.del(key);
  } catch (err) {
    console.warn(`[Redis] Cache invalidation failed for clinic slug ${slug}:`, err);
  }
}

export async function invalidateSlotsCache(clinicSlug: string, serviceId: string): Promise<void> {
  const redis = getRedisClient();
  const key = `slots:availability:${clinicSlug}:${serviceId}`;
  try {
    await redis.del(key);
  } catch (err) {
    console.warn(`[Redis] Slots cache invalidation failed for ${clinicSlug}:${serviceId}:`, err);
  }
}

// 3. OTP Verification Stashing (10 minutes / 600s TTL)
export async function stashOTP(phone: string, hashedOtp: string): Promise<boolean> {
  const redis = getRedisClient();
  const key = `otp:${phone}`;
  try {
    const result = await redis.set(key, hashedOtp, "EX", 600);
    return result === "OK";
  } catch (err) {
    console.error(`[Redis] Failed to stash OTP for ${phone}:`, err);
    return false;
  }
}

export async function getStashedOTP(phone: string): Promise<string | null> {
  const redis = getRedisClient();
  const key = `otp:${phone}`;
  try {
    return await redis.get(key);
  } catch (err) {
    console.error(`[Redis] Failed to get stashed OTP for ${phone}:`, err);
    return null;
  }
}

export async function clearOTP(phone: string): Promise<void> {
  const redis = getRedisClient();
  try {
    await redis.del(`otp:${phone}`, `otp:attempts:${phone}`);
  } catch (err) {
    console.warn(`[Redis] Failed to clear OTP keys for ${phone}:`, err);
  }
}

// 4. OTP Attempts Rate Limiting (max 3 verification attempts)
export async function incrementOtpAttempt(phone: string): Promise<number> {
  const redis = getRedisClient();
  const key = `otp:attempts:${phone}`;
  try {
    const attempts = await redis.incr(key);
    if (attempts === 1) {
      await redis.expire(key, 600); // 10 minutes TTL
    }
    return attempts;
  } catch (err) {
    console.error(`[Redis] Failed to increment OTP attempts for ${phone}:`, err);
    return 1;
  }
}

// 5. OTP Requests Rate Limiting (max 3 OTP sends per phone per 10 mins)
export async function getOtpSendRate(phone: string): Promise<number> {
  const redis = getRedisClient();
  const key = `otp:rate:${phone}`;
  try {
    const val = await redis.get(key);
    return val ? parseInt(val, 10) : 0;
  } catch (err) {
    console.error(`[Redis] Failed to read OTP rate for ${phone}:`, err);
    return 0;
  }
}

export async function incrementOtpSendRate(phone: string): Promise<number> {
  const redis = getRedisClient();
  const key = `otp:rate:${phone}`;
  try {
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, 600); // 10 mins TTL
    }
    return count;
  } catch (err) {
    console.error(`[Redis] Failed to increment OTP rate for ${phone}:`, err);
    return 1;
  }
}

export async function checkIpRateLimit(
  ip: string,
  routePrefix: string,
  limit: number = 60,
  windowSeconds: number = 60
): Promise<{ allowed: boolean; remaining: number }> {
  const redis = getRedisClient();
  const key = `ip:rl:${ip}:${routePrefix}`;
  
  try {
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, windowSeconds);
    }
    const remaining = Math.max(0, limit - count);
    return {
      allowed: count <= limit,
      remaining
    };
  } catch (err) {
    console.error(`[Redis] Rate limiting error for IP ${ip}:`, err);
    // Fail open in case of Redis connection issue to prevent service denial
    return { allowed: true, remaining: 1 };
  }
}

