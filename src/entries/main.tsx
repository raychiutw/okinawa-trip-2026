import { initSentry } from '../lib/sentry';
initSentry();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistration().then((reg) => {
    if (reg) reg.update();
  });
}

/* V1/V2 路由切換 — Blue-Green Tailwind 遷移 */
const params = new URLSearchParams(window.location.search);
const forceV1 = params.get('v1') === '1';
const forceV2 = params.get('v2') === '1';
const storedV2 = typeof localStorage !== 'undefined' && localStorage.getItem('tripline-v2') === '1';
export const useV2 = !forceV1 && (forceV2 || storedV2);

/* V2 模式：redirect 到獨立 HTML entry（完全隔離 CSS） */
if (useV2) {
  const v2Url = new URL(window.location.href);
  v2Url.pathname = '/v2.html';
  v2Url.hash = window.location.pathname + window.location.search;
  window.location.replace(v2Url.toString());
} else {
  import('./mainV1');
}
