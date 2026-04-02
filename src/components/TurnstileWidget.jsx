import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, RefreshCw } from 'lucide-react';

const TURNSTILE_SCRIPT_ID = 'cloudflare-turnstile-script';
const TURNSTILE_SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const TURNSTILE_TEST_SITE_KEY = '1x00000000000000000000AA';

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

const TurnstileWidget = () => {
  const widgetContainerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isWidgetReady, setIsWidgetReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const siteKey = getTurnstileSiteKey();
  const isUsingTestKey = import.meta.env.DEV && !import.meta.env.VITE_TURNSTILE_SITE_KEY;
  const configurationError = !siteKey
    ? 'Cloudflare Turnstile is not configured. Add VITE_TURNSTILE_SITE_KEY to enable the footer widget.'
    : '';

  useEffect(() => {
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
          appearance: 'interaction-only',
          execution: 'render',
          action: 'footer_widget',
          retry: 'auto',
          'refresh-expired': 'auto',
          callback: () => {
            setIsVerified(true);
            setErrorMessage('');
          },
          'expired-callback': () => {
            setIsVerified(false);
            setErrorMessage('Verification expired. Cloudflare will refresh the check automatically.');
            if (widgetIdRef.current !== null && window.turnstile) {
              window.turnstile.reset(widgetIdRef.current);
            }
          },
          'error-callback': () => {
            setIsVerified(false);
            setErrorMessage('Verification failed. Retry the widget or check your Turnstile configuration.');
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
  }, [siteKey]);

  const handleRetry = () => {
    setErrorMessage('');

    if (widgetIdRef.current !== null && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  };

  return (
    <section className="turnstile-footer-widget" aria-label="Cloudflare Turnstile verification">
      <div className="turnstile-footer-header">
        <div className="turnstile-footer-badge">
          <ShieldCheck className="icon-small" />
          <span>Cloudflare Turnstile</span>
        </div>
        <p className="turnstile-footer-copy">
          Background verification runs here without blocking the page. Cloudflare may still request interaction for suspicious traffic.
        </p>
      </div>

      {isUsingTestKey && (
        <p className="turnstile-footer-note">
          Development mode is using Cloudflare&apos;s public test site key.
        </p>
      )}

      <div className="turnstile-footer-frame">
        <div ref={widgetContainerRef} className="turnstile-footer-slot" />
      </div>

      {!configurationError && !isWidgetReady && !errorMessage && (
        <p className="turnstile-footer-status">Checking browser integrity...</p>
      )}

      {isVerified && <p className="turnstile-footer-success">Verification passed.</p>}

      {(configurationError || errorMessage) && (
        <div className="turnstile-footer-error-block">
          <p className="turnstile-footer-error">{configurationError || errorMessage}</p>
          {!configurationError && (
            <button type="button" className="turnstile-footer-retry" onClick={handleRetry}>
              <RefreshCw className="icon-small" />
              <span>Retry</span>
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default TurnstileWidget;