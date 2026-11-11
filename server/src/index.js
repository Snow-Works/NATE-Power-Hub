// the whole web application rendering lives here 
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';


const log = pino({ level: process.env.LOG_LEVEL ?? 'info'});
const PORT = Number(process.env.PORT ?? 4000);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173';

if (!process.env.CLIENT_ORIGIN) {
    log.warn(`CLIENT_ORIGIN not set - defaulting to ${CLIENT_ORIGIN}`);
}

const app = express();

// Belt order matters: security headers → CORS → body parsing → logging → routes.
// LEARN: Helmet first because it must run even if the request is later rejected.
// CORS next because the Origin header must be inspected before anything decides
// what the response is. Body parser next because it can reject a bad payload
// early with a 400. pino-http logs last so the log line includes a response status.

app.use(helmet());
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json({ limit: '100kb' }));
app.use(pinoHttp({ logger: log }));

// The one route for Step 0. It returns no business data — only proof of life.
// The client uses this in Step 0b to prove the network path works end to end.
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'kelvinate-server',
    time: new Date().toISOString(),
  });
});

// 404 for anything that fell through the belt.
// LEARN: Same JSON shape as the error handler below. The client must only ever
// parse one shape: { error: { code, message } }. Two shapes means two branches
// on every fetch in the client — one shape means one.
app.use((_req, res) => {
  res.status(404).json({
    error: { code: 'NOT_FOUND', message: 'Route not found' },
  });
});

// Central error handler. Express identifies it by the FOUR-argument signature.
// Every future controller calls next(err); only this function decides the wire
// format, and only this function decides whether stack details are leaked.
// In production (NODE_ENV=production) a 500 always says "Something went wrong".
app.use((err, req, res, _next) => {
  req.log?.error?.(err);
  const status = Number.isInteger(err.status) ? err.status : 500;
  const code = err.code ?? 'INTERNAL_ERROR';
  const message = status === 500 ? 'Something went wrong' : err.message;
  res.status(status).json({ error: { code, message } });
});

app.listen(PORT, () => {
  log.info(`kelvinate-server listening on http://localhost:${PORT}`);
});