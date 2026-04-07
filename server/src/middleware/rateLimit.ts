import rateLimit from 'express-rate-limit';

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: { 
    error: 'Too many requests', 
    message: 'Please try again later.',
    retryAfter: 60 
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limiter for expensive endpoints
export const strictLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { 
    error: 'Rate limit exceeded', 
    message: 'This endpoint has a lower rate limit. Please slow down.'
  },
});

// WebSocket connection limiter
export const wsConnectionLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Too many WebSocket connection attempts' },
});