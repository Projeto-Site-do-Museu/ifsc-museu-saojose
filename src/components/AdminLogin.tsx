'use client';

import { X } from 'lucide-react';
import { useState } from 'react';

interface AdminUser {
  id: number;
  nome: string;
  email: string;
  role: string;
}

interface AdminLoginProps {
  onClose: () => void;
  onLoginSuccess: (token: string, user: AdminUser) => void;
}

export default function AdminLogin({
  onClose,
  onLoginSuccess,
}: AdminLoginProps) {
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro no login');
      }

      // Verifica se é admin
      if (data.user.role !== 'admin') {
        throw new Error('Acesso restrito a administradores');
      }

      // Salva token no localStorage
      localStorage.setItem('adminToken', data.token);
      onLoginSuccess(data.token, data.user);
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro inesperado');
    } finally {
      setCarregando(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-secondary-foreground">
          Login Administrador
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-secondary-foreground/70 hover:text-secondary-foreground"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {erro && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {erro}
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium mb-1 text-secondary-foreground"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-primary"
            placeholder="admin@museu.com.br"
          />
        </div>

        <div>
          <label
            htmlFor="senha"
            className="block text-sm font-medium text-secondary-foreground mb-1"
          >
            Senha
          </label>
          <input
            type="password"
            id="senha"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-primary"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={carregando}
          className="w-full bg-primary text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
        >
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
