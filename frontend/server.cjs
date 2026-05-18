// Frontend production server — serves Vite dist with gzip + security headers
// CommonJS (.cjs) to avoid ES Module conflicts with Vite's package.json "type":"module"
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const DIST = path.join(__dirname, 'dist');

// ── Manual gzip middleware (no extra deps needed) ────────────────────────────
// Serve pre-gzipped .gz files if browser supports it
app.use((req, res, next) => {
  const acceptEncoding = req.headers['accept-encoding'] || '';
  if (acceptEncoding.includes('gzip')) {
    const gzPath = path.join(DIST, req.path + '.gz');
    if (fs.existsSync(gzPath)) {
      res.setHeader('Content-Encoding', 'gzip');
      req.url = req.url + '.gz';
    }
  }
  next();
});

// ── Security Headers (fixes Lighthouse Best Practices) ───────────────────────
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://*.googleapis.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https://images.unsplash.com https://*.up.railway.app https://lh3.googleusercontent.com",
      "connect-src 'self' https://*.up.railway.app https://accounts.google.com https://oauth2.googleapis.com https://generativelanguage.googleapis.com",
      "frame-src https://accounts.google.com",
      "object-src 'none'",
      "base-uri 'self'"
    ].join('; ')
  );
  next();
});

// ── Long-term caching for hashed Vite assets ─────────────────────────────────
app.use('/assets', express.static(path.join(DIST, 'assets'), {
  maxAge: '1y',
  immutable: true,
  etag: false
}));

// ── Serve remaining static files (index.html, public files) ──────────────────
app.use(express.static(DIST, {
  maxAge: '1h',
  etag: true,
  index: false   // we handle index.html manually below
}));

// ── SPA Fallback: all unknown routes → index.html ────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(DIST, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ NutriAI Frontend serving production build on port ${PORT}`);
});
