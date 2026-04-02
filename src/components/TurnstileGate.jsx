import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, RefreshCw } from 'lucide-react';

const TURNSTILE_SCRIPT_ID = 'cloudflare-turnstile-script';
const TURNSTILE_SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const TURNSTILE_SESSION_KEY = 'quickdevguide.turnstile.verifiedUntil';
const TURNSTILE_SESSION_WINDOW_MS = 1000 * 60 * 60 * 6;
const TURNSTILE_TEST_SITE_KEY = '1x00000000000000000000AA';

let turnstileScriptPromise;

function getStoredVerification() {
  const storedValue = window.sessionStorage.getItem(TURNSTILE_SESSION_KEY);
  const verifiedUntil = Number(storedValue);

  if (!Number.isFinite(verifiedUntil)) {
    return false;
  }

  return verifiedUntil > Date.now();
}

function persistVerification() {
  const verifiedUntil = Date.now() + TURNSTILE_SESSION_WINDOW_MS;
  window.sessionStorage.setItem(TURNSTILE_SESSION_KEY, String(verifiedUntil));
}

function getTurnstileSiteKey() {
  const configuredSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim();

  if (configuredSiteKey) {
    return configuredSiteKey;
  }

  if (import.meta.env.DEV) {
    return TURNSTILE_TEST_SITE_KEY;
  }

  return '';
}

function loadTurnstileScript() {
  if (window.turnstile) {
    return Promise.resolve(window.turnstile);
  }

  if (turnstileScriptPromise) {
    return turnstileScriptPromise;
  }

  turnstileScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(TURNSTILE_SCRIPT_ID);

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.turnstile), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Cloudflare Turnstile.')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = TURNSTILE_SCRIPT_ID;
    script.src = TURNSTILE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.turnstile);
    script.onerror = () => reject(new Error('Failed to load Cloudflare Turnstile.'));
    document.head.appendChild(script);
  });

  return turnstileScriptPromise;
}

const TurnstileGate = ({ children }) => {
  const widgetContainerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [isVerified, setIsVerified] = useState(() => getStoredVerification());
  const [isWidgetReady, setIsWidgetReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const siteKey = getTurnstileSiteKey();
  const isUsingTestKey = import.meta.env.DEV && !import.meta.env.VITE_TURNSTILE_SITE_KEY;
  const configurationError = !siteKey
    ? 'Cloudflare Turnstile is not configured. Add VITE_TURNSTILE_SITE_KEY to enable bot protection.'
    : '';

  useEffect(() => {
    if (isVerified) {
      return undefined;
    }

    if (!siteKey) {
      return undefined;
    }

    let isCancelled = false;

    const renderWidget = async () => {
      try {
        setErrorMessage('');
        setIsWidgetReady(false);

        const turnstile = await loadTurnstileScript();

        if (isCancelled || !widgetContainerRef.current || !turnstile) {
          return;
        }

        if (widgetIdRef.current !== null) {
          turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        }

        widgetContainerRef.current.innerHTML = '';
        widgetIdRef.current = turnstile.render(widgetContainerRef.current, {
          sitekey: siteKey,
          theme: 'light',
          appearance: 'always',
          callback: () => {
            persistVerification();
            setIsVerified(true);
            setErrorMessage('');
          },
          'expired-callback': () => {
            setIsVerified(false);
            setErrorMessage('Verification expired. Please complete the challenge again.');
            if (widgetIdRef.current !== null && window.turnstile) {
              window.turnstile.reset(widgetIdRef.current);
            }
          },
          'error-callback': () => {
            setErrorMessage('Verification failed. Please retry the Turnstile challenge.');
          }
        });

        setIsWidgetReady(true);
      } catch (error) {
        if (!isCancelled) {
          setErrorMessage(error.message || 'Failed to initialize Cloudflare Turnstile.');
        }
      }
    };

    renderWidget();

    return () => {
      isCancelled = true;
    };
  }, [isVerified, siteKey]);

  const handleRetry = () => {
    setErrorMessage('');

    if (widgetIdRef.current !== null && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
      return;
    }

    setIsWidgetReady(false);
    turnstileScriptPromise = undefined;
    const existingScript = document.getElementById(TURNSTILE_SCRIPT_ID);
    if (existingScript) {
      existingScript.remove();
    }
    setIsVerified(false);
  };

  return (
    <div className="turnstile-shell">
      <div className={`turnstile-app-frame ${isVerified ? 'is-verified' : 'is-locked'}`} aria-hidden={!isVerified}>
        {children}
      </div>

      {!isVerified && (
        <div className="turnstile-overlay" role="dialog" aria-modal="true" aria-labelledby="turnstile-title">
          <div className="turnstile-card">
            <div className="turnstile-badge">
              <ShieldCheck className="icon" />
              <span>Protected by Cloudflare Turnstile</span>
            </div>

            <h1 id="turnstile-title" className="turnstile-title">Verify access to QuickDevGuide</h1>
            <p className="turnstile-copy">
              Complete the challenge to continue into the developer guide. This reduces automated traffic against the public app.
            </p>

            {isUsingTestKey && (
              <p className="turnstile-note">
                Development mode is using Cloudflare's public test site key. Set `VITE_TURNSTILE_SITE_KEY` for real protection.
              </p>
            )}

            <div className="turnstile-widget-frame">
              <div ref={widgetContainerRef} className="turnstile-widget" />
            </div>

            {!isWidgetReady && !errorMessage && (
              <p className="turnstile-status">Loading verification challenge...</p>
            )}

            {(errorMessage || configurationError) && (
              <div className="turnstile-error-block">
                <p className="turnstile-error">{errorMessage || configurationError}</p>
                {!configurationError && (
                  <button type="button" className="turnstile-retry-btn" onClick={handleRetry}>
                    <RefreshCw className="icon-small" />
                    <span>Retry</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TurnstileGate;