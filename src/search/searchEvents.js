/** Lets any component open the global search modal owned by the Header. */
export const OPEN_SEARCH_EVENT = 'qdg:open-search';

export const openSearch = () => window.dispatchEvent(new Event(OPEN_SEARCH_EVENT));
