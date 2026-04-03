import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, RefreshCw } from 'lucide-react';

const TURNSTILE_SCRIPT_ID = 'cloudflare-turnstile-script';
const TURNSTILE_SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const TURNSTILE_TEST_SITE_KEY = '1x00000000000000000000AA';
const VERIFICATION_STORAGE_KEY = 'turnstile_verified';

let turnstileScriptPromise;

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
  const [isVerified, setIsVerified] = useState(() => {
    // Check session storage on initial render
    return sessionStorage.getItem(VERIFICATION_STORAGE_KEY) === 'true';
  });
  const [isWidgetReady, setIsWidgetReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const siteKey = getTurnstileSiteKey();
  const isUsingTestKey = import.meta.env.DEV && !import.meta.env.VITE_TURNSTILE_SITE_KEY;
  const configurationError = !siteKey
    ? 'Cloudflare Turnstile is not configured. Add VITE_TURNSTILE_SITE_KEY to enable bot detection.'
    : '';

  useEffect(() => {
    // If already verified from session, skip
    if (isVerified) {
      return;
    }

    if (!siteKey) {
      setIsLoading(false);
      return undefined;
    }

    let isCancelled = false;

    const renderWidget = async () => {
      try {
        setErrorMessage('');
        setIsWidgetReady(false);
        setIsLoading(true);

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
          execution: 'render',
          action: 'website_entry',
          retry: 'auto',
          'refresh-expired': 'auto',
          callback: () => {
            setIsVerified(true);
            sessionStorage.setItem(VERIFICATION_STORAGE_KEY, 'true');
            setErrorMessage('');
            setIsLoading(false);
          },
          'expired-callback': () => {
            setIsVerified(false);
            sessionStorage.removeItem(VERIFICATION_STORAGE_KEY);
            setErrorMessage('Verification expired. Please verify again.');
            if (widgetIdRef.current !== null && window.turnstile) {
              window.turnstile.reset(widgetIdRef.current);
            }
          },
          'error-callback': () => {
            setIsVerified(false);
            sessionStorage.removeItem(VERIFICATION_STORAGE_KEY);
            setErrorMessage('Verification failed. Please try again.');
            setIsLoading(false);
          }
        });

        setIsWidgetReady(true);
        setIsLoading(false);
      } catch (error) {
        if (!isCancelled) {
          setErrorMessage(error.message || 'Failed to initialize Cloudflare Turnstile.');
          setIsLoading(false);
        }
      }
    };

    renderWidget();

    return () => {
      isCancelled = true;
    };
  }, [siteKey, isVerified]);

  const handleRetry = () => {
    setErrorMessage('');
    setIsLoading(true);

    if (widgetIdRef.current !== null && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  };

  if (isVerified) {
    return children;
  }

  return (
    <div className="turnstile-gate-overlay">
      <div className="turnstile-gate-container">
        <div className="turnstile-gate-content">
          <div className="turnstile-gate-header">
            <ShieldCheck className="turnstile-gate-icon" />
            <h1 className="turnstile-gate-title">Verify you're human</h1>
            <p className="turnstile-gate-subtitle">
              This helps us keep our site secure.
            </p>
          </div>

          <div className="turnstile-gate-widget-wrapper">
            {isUsingTestKey && (
              <div className="turnstile-gate-test-notice">
                <span>Test Mode</span>
              </div>
            )}

            <div className="turnstile-gate-widget">
              <div ref={widgetContainerRef} className="turnstile-gate-slot" />
            </div>

            {isLoading && !errorMessage && !configurationError && (
              <div className="turnstile-gate-loading">
                <div className="turnstile-gate-spinner"></div>
                <span>Loading verification...</span>
              </div>
            )}

            {configurationError && (
              <div className="turnstile-gate-error">
                <p>{configurationError}</p>
              </div>
            )}

            {errorMessage && !configurationError && (
              <div className="turnstile-gate-error">
                <p>{errorMessage}</p>
                <button type="button" className="turnstile-gate-retry" onClick={handleRetry}>
                  <RefreshCw className="icon-small" />
                  <span>Try again</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TurnstileGate;