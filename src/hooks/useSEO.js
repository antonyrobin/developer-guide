import { useEffect } from 'react';
import { SITE_URL, SITE_NAME, DEFAULT_IMAGE, HOME_SEO } from '../data/seo';

function setMeta(name, content, attr = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function setJsonLd(data) {
  let el = document.getElementById('page-jsonld');
  if (!data) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = 'page-jsonld';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/**
 * Sets per-page title, description, keywords, canonical URL, Open Graph /
 * Twitter tags and JSON-LD. `path` is the canonical path ("/react", "/react/hooks").
 */
export function useSEO({ title, description, keywords, path, jsonLd, type = 'website' }) {
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : '';

  useEffect(() => {
    const pageTitle = title ? `${title} | ${SITE_NAME}` : HOME_SEO.title;
    document.title = pageTitle;
    setMeta('og:title', pageTitle, 'property');
    setMeta('twitter:title', pageTitle);

    if (description) {
      setMeta('description', description);
      setMeta('og:description', description, 'property');
      setMeta('twitter:description', description);
    }

    if (keywords) setMeta('keywords', keywords);

    if (path !== undefined) {
      const url = `${SITE_URL}${path === '/' ? '/' : path}`;
      setCanonical(url);
      setMeta('og:url', url, 'property');
    }

    setMeta('og:type', type, 'property');
    setMeta('og:image', DEFAULT_IMAGE, 'property');
    setMeta('twitter:image', DEFAULT_IMAGE);
    setJsonLd(jsonLdKey ? JSON.parse(jsonLdKey) : null);
  }, [title, description, keywords, path, type, jsonLdKey]);
}
