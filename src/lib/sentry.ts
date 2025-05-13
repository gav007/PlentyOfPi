// src/lib/sentry.ts
import * as Sentry from "@sentry/nextjs";

export function initSentry() {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      // Adjust measures संक्रमण दर to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 1.0,

      // Setting this option to true will print useful information to the console while you're setting up Sentry.
      debug: process.env.NODE_ENV === 'development',

      replaysOnErrorSampleRate: 1.0,

      // This sets the sample rate for session-based tracing,
      // which monitors the performance of sessions as a whole.
      replaysSessionSampleRate: 0.1,

      // You can remove this option if you're not planning to use the Sentry Session Replay feature:
      integrations: [
        Sentry.replayIntegration({
          // Additional Replay configuration goes in here, for example:
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
    });
    console.log("Sentry initialized");
  } else {
    console.warn("Sentry DSN not found. Sentry will not be initialized.");
  }
}
