'use client';

import { useEffect } from 'react';

export default function FontLoader() {
  useEffect(() => {
    const loadFonts = () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=Michroma&family=Work+Sans:wght@400;700&display=swap';
      document.head.appendChild(link);

      const preconnect1 = document.createElement('link');
      preconnect1.rel = 'preconnect';
      preconnect1.href = 'https://fonts.googleapis.com';
      document.head.appendChild(preconnect1);

      const preconnect2 = document.createElement('link');
      preconnect2.rel = 'preconnect';
      preconnect2.href = 'https://fonts.gstatic.com';
      preconnect2.crossOrigin = 'anonymous';
      document.head.appendChild(preconnect2);
    };

    loadFonts();
  }, []);

  return null;
}
