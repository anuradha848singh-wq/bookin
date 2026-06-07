import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Define a local fallback if Upstash isn't configured
const cache = new Map();

const isUpstashConfigured =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

// Create a new ratelimiter, that allows 10 requests per 10 seconds
export const rateLimit = isUpstashConfigured
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, "10 s"),
      analytics: true,
      prefix: "@upstash/ratelimit",
    })
  : {
      limit: async (identifier: string) => {
        const now = Date.now();
        const windowSize = 10000; // 10 seconds
        const maxRequests = 10;

        let record = cache.get(identifier);
        if (!record || record.timestamp < now - windowSize) {
          record = { count: 1, timestamp: now };
        } else {
          record.count++;
        }
        
        cache.set(identifier, record);

        return {
          success: record.count <= maxRequests,
          limit: maxRequests,
          remaining: Math.max(0, maxRequests - record.count),
          reset: record.timestamp + windowSize,
        };
      },
    };
