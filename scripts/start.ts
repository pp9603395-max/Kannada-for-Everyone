/**
 * Production entrypoint.
 *
 * `npm start` must serve the built Vite bundle instead of the Vite dev
 * middleware. Setting NODE_ENV here keeps the command identical on Windows,
 * Linux, Docker, Render, Railway, and Cloud Run.
 */
process.env.NODE_ENV = 'production';

await import('../server.ts');
