'use client';

import { useEffect, useState } from 'react';

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewVisitor, setIsNewVisitor] = useState(false);

  useEffect(() => {
    const initCounter = async () => {
      try {
        const postResponse = await fetch('/api/counter', {
          method: 'POST',
        });

        if (postResponse.ok) {
          const data = await postResponse.json();
          setCount(data.count);
          setIsNewVisitor(data.counted);
        } else {
          const getResponse = await fetch('/api/counter');
          if (getResponse.ok) {
            const data = await getResponse.json();
            setCount(data.count);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar contador:', error);
      } finally {
        setLoading(false);
      }
    };

    initCounter();
  }, []);

  useEffect(() => {
    if (count === null) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/counter');
        if (response.ok) {
          const data = await response.json();
          if (data.count !== count) {
            setCount(data.count);
          }
        }
      } catch (error) {
        console.error('Erro ao atualizar contador:', error);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [count]);

  useEffect(() => {
    if (isNewVisitor) {
      const timeout = setTimeout(() => {
        setIsNewVisitor(false);
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [isNewVisitor]);

  if (loading) {
    return (
      <section className="w-full py-12 px-4 bg-black">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="inline-block px-8 py-4">
              <div className="animate-pulse">
                <div className="w-32 h-4 bg-gray-600 rounded mb-3 mx-auto" />
                <div className="w-20 h-8 bg-gray-600 rounded mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12 px-4 bg-black">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <div
            className={`inline-block transition-all duration-200 ${isNewVisitor ? 'ring-1 ring-gray-600' : ''} px-8 py-4`}
          >
            <p className="text-gray-400 text-xs font-mono uppercase tracking-wider mb-2">
              {isNewVisitor ? 'Novo visitante' : 'Visitantes únicos'}
            </p>

            <div className="mb-2">
              <span className="text-white text-2xl md:text-3xl font-mono font-bold tabular-nums">
                {count?.toLocaleString('pt-BR') || '0'}
              </span>
            </div>

            {isNewVisitor && (
              <p className="text-green-400 text-xs font-mono">Contabilizado</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
