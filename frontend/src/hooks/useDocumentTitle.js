import { useEffect } from 'react';


export function useDocumentTitle(title, options = {}) {
  const { separator = ' | ', siteName = 'Subscription Tracker' } = options;

  useEffect(() => {
    if (!title) {
      document.title = siteName;
      return;
    }
    document.title = `${title}${separator}${siteName}`;
  }, [title, separator, siteName]);
}
