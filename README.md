# Graphify: Interactive Graphing Calculator

Graphify is a responsive, Firebase-backed graphing calculator web application designed to provide an interactive experience similar to Desmos. Users can plot multiple functions, save their work, and explore mathematical concepts on both desktop and mobile devices.

## Features

*   **Graphing Engine**: Plot various function types (linear, polynomial, trigonometric, exponential, logarithmic, etc.).
*   **Real-time Interaction**: Smooth pan and zoom functionality with mouse and touch.
*   **Dynamic Axes & Grid**: Customizable axes labeling and grid density.
*   **Starter Panel**: Quick-access to 10 sample equations for easy exploration.
*   **Function Management**: Add, edit, delete, color-code, and toggle visibility for multiple functions.
*   **Persistence & Sync**: User authentication via Firebase Auth, with graph sets saved to Firestore and synced across devices.
*   **Performance**: Client-side expression parsing with `math.js`.
*   **PWA Support**: Offline caching for core assets and last opened graph, with an "Install" prompt.

## Technical Stack

*   **Frontend**: Next.js, React, TypeScript
*   **Styling**: Tailwind CSS (mobile-first, dark mode support)
*   **Expression Parser**: `math.js`
*   **Graphing Library**: `function-plot` (built on D3.js)
*   **Backend & Hosting**: Firebase (Authentication, Firestore, Cloud Functions, Hosting)
*   **PWA**: `next-pwa`
*   **Testing**:
    *   Unit/Integration: Jest & React Testing Library
    *   E2E: Cypress or Playwright (to be configured)
*   **CI/CD**: GitHub Actions with Firebase CLI

## Project Structure

*   `/src/app`: Next.js App Router, pages and layouts.
*   `/src/components`: Reusable React components.
    *   `/src/components/graphify`: Components specific to the Graphify calculator.
    *   `/src/components/ui`: Shared UI elements (buttons, inputs, cards from ShadCN/UI).
    *   `/src/components/debug`: Components for debugging and testing.
*   `/src/hooks`: Custom React hooks.
*   `/src/lib`: Utility functions, Firebase configuration, `math.js` integration.
*   `/src/styles`: Global styles and Tailwind configuration.
*   `/functions`: Firebase Cloud Functions (if any).

## Getting Started

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm or yarn
*   Firebase Account & Project Setup

### Environment Variables

Create a `.env.local` file in the root directory by copying `.env.example` and fill in your Firebase project configuration details:

```env
# Firebase SDK Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id (optional)

# Sentry DSN (Optional - for error reporting)
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd graphify
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) (or your configured port) in your browser.

## Validation & QA

This project emphasizes robust validation and quality assurance through various testing strategies.

### Unit & Integration Tests

*   **Framework**: Jest with React Testing Library.
*   **Coverage**: Core logic for expression parsing (`math.js` interaction), state management (graph configurations, function lists), and individual UI components.
*   **Running Tests**:
    ```bash
    npm test
    # or
    yarn test
    ```
    This will run all `*.test.ts` and `*.test.tsx` files.

### End-to-End (E2E) Tests

*   **Framework**: Cypress or Playwright (setup pending).
*   **Coverage**: Full user flows including:
    *   User signup/login.
    *   Adding, editing, and deleting functions.
    *   Saving and loading graph sets from Firestore.
    *   Graph interactions (pan, zoom).
    *   PWA installation prompt and basic offline functionality.
*   **Running E2E Tests**: (Commands will be added once framework is configured)
    ```bash
    # npm run test:e2e (example)
    ```

### Accessibility Audit

*   **Tools**: Lighthouse (built into Chrome DevTools), Axe DevTools browser extension.
*   **Checks**:
    *   ARIA roles and attributes for all interactive elements.
    *   Keyboard-only navigation for all features.
    *   Sufficient color contrast.
    *   Semantic HTML structure.

### Performance Profiling

*   **Tools**: React Profiler, Chrome DevTools Performance tab.
*   **Metrics**:
    *   Initial load time.
    *   Graph rendering time, especially with multiple (10+) complex functions.
    *   Responsiveness of pan/zoom operations.
    *   Optimization of re-renders to avoid unnecessary computations.

## Debugging & Fine-Tuning

### Error Handling & Logging

*   **Client-Side**: Robust `try/catch` blocks around `math.js` evaluations and Firebase operations. User-friendly error messages displayed in the UI. Detailed errors logged to the browser console.
*   **Cloud Functions**: (If used) Comprehensive error handling and logging to Firebase Cloud Logging.
*   **Runtime Error Reporting**: Sentry (or Firebase Crashlytics) is integrated for capturing and reporting runtime errors in production. Initialize Sentry in `src/lib/sentry.ts` and `src/app/layout.tsx`.

### Development Experience

*   **Hot Reload**: Next.js provides fast refresh out-of-the-box for rapid development cycles.
*   **Linting**: ESLint and Prettier are configured for code consistency and quality. Run linters with:
    ```bash
    npm run lint
    # To fix automatically:
    # npm run lint:fix
    # npm run format
    ```
    CI pipeline will fail builds on linting errors.

### Debug Mode

*   A "Debug Mode" toggle is available in the application (typically in a development build or accessible via a specific setting).
*   When enabled, it can:
    *   Overlay live coordinate readouts on the graph.
    *   Display performance metrics (e.g., render times, number of points plotted).
    *   Provide more verbose console logging.
    *   Access the Test Harness page.

### Test Harness Page

*   Accessible at `/testharness` in development mode.
*   Allows developers to quickly input and test edge-case equations or specific scenarios for the graphing engine, such as:
    *   Division by zero.
    *   Functions with vertical asymptotes.
    *   Complex number outputs (how they are handled or ignored).
    *   Functions requiring high precision or many plot points.

## Deployment

*   **Platform**: Firebase Hosting.
*   **Environments**: Separate Firebase projects/hosting targets for development (`dev`) and production (`prod`) are recommended.
*   **CI/CD**: GitHub Actions workflow (`.github/workflows/main.yml`) handles:
    *   Running linters and tests on push/pull_request.
    *   Building the Next.js application.
    *   Deploying to Firebase Hosting upon merge to the main branch (or specific branches).
*   **Manual Deployment**:
    ```bash
    npm run build
    firebase deploy --only hosting # (Ensure Firebase CLI is configured)
    ```

## Contributing

Please refer to `CONTRIBUTING.md` for guidelines on contributing to Graphify. (Create this file if you have contribution guidelines).
