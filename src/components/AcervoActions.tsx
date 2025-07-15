'use client';

import Link from 'next/link';

export default function AcervoActions() {
  return (
    <div className="mt-16 flex justify-center">
      <Link href="/acervo/completo">
        <button
          type="button"
          className="bg-black text-white px-10 py-4 rounded-2xl text-xl md:text-2xl font-semibold shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Ver acervo completo
        </button>
      </Link>
    </div>
  );
} 
