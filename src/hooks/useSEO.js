import { useEffect } from 'react';

const SITE_NAME = 'QuickDevGuide';
const SITE_SUFFIX = 'QuickDevGuide | Developer Quick Reference';

function setMeta(name, content, attr = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function useSEO({ title, description, keywords }) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_SUFFIX}` : SITE_SUFFIX;

    if (description) {
      setMeta('description', description);
      setMeta('og:description', description, 'property');
      setMeta('twitter:description', description);
    }

    if (keywords) {
      setMeta('keywords', keywords);
    }

    const pageTitle = title ? `${title} | ${SITE_SUFFIX}` : SITE_SUFFIX;
    setMeta('og:title', pageTitle, 'property');
    setMeta('twitter:title', pageTitle);
  }, [title, description, keywords]);
}
