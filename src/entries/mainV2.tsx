import { initSentry } from '../lib/sentry';
initSentry();

import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '../components/shared/ErrorBoundary';
import { lazy, Suspense } from 'react';

import '../../css/tokens.css';

const TripPage = lazy(() => import('../pages/TripPage'));
const ManagePage = lazy(() => import('../pages/ManagePage'));
const AdminPageV2 = lazy(() => import('../pages/AdminPageV2'));

const DEFAULT_TRIP = 'okinawa-trip-2026-Ray';
const FALLBACK_STYLE = { padding: '2rem', textAlign: 'center' as const };

function LegacyRedirect() {
  return <Navigate to={`/trip/${DEFAULT_TRIP}`} replace />;
}

const el = document.getElementById('reactRoot');
if (el) {
  createRoot(el).render(
    <ErrorBoundary>
      <HashRouter>
        <Suspense fallback={<div style={FALLBACK_STYLE}>載入中…</div>}>
          <Routes>
            <Route path="/trip/:tripId" element={<TripPage />} />
            <Route path="/manage" element={<ManagePage />} />
            <Route path="/admin" element={<AdminPageV2 />} />
            <Route path="*" element={<LegacyRedirect />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </ErrorBoundary>
  );
}
