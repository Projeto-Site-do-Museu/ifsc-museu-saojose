'use client';

import { Tag } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ColecaoSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ColecaoSelector({
  value,
  onChange,
}: ColecaoSelectorProps) {
  const [colecoes, setColecoes] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredColecoes, setFilteredColecoes] = useState<string[]>([]);

  useEffect(() => {
    fetchColecoes();
  }, []);

  useEffect(() => {
    if (value.trim() === '') {
      setFilteredColecoes(colecoes);
    } else {
      setFilteredColecoes(
        colecoes.filter((colecao) =>
          colecao.toLowerCase().includes(value.toLowerCase()),
        ),
      );
    }
  }, [value, colecoes]);

  const fetchColecoes = async () => {
    try {
      const response = await fetch('/api/colecoes');
      if (response.ok) {
        const data = await response.json();
        setColecoes(data);
        setFilteredColecoes(data);
      }
    } catch (error) {
      console.error('Erro ao buscar coleções:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowDropdown(true);
  };

  const handleSelectColecao = (colecao: string) => {
    onChange(colecao);
    setShowDropdown(false);
  };

  const handleInputFocus = () => {
    setShowDropdown(true);
  };

  const handleInputBlur = () => {
    // Delay para permitir clique no dropdown
    setTimeout(() => {
      setShowDropdown(false);
    }, 150);
  };

  return (
    <div className="bg-card border border-border rounded p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <Tag size={20} className="text-muted-foreground" />
        <label
          htmlFor="colecao"
          className="text-base font-semibold text-card-foreground"
        >
          Coleção
        </label>
      </div>

      <div className="relative">
        <input
          type="text"
          id="colecao"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className="w-full px-4 py-4 text-card-foreground bg-background border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
          placeholder="Digite o nome da coleção ou selecione uma existente"
        />

        {showDropdown && filteredColecoes.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {filteredColecoes.map((colecao) => (
              <button
                key={`colecao-${colecao}`}
                type="button"
                onMouseDown={() => handleSelectColecao(colecao)}
                className="w-full px-4 py-2 text-left text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors"
              >
                {colecao}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
