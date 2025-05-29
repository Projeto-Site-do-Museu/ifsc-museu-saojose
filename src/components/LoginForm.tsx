import { useState } from 'react';

export default function LoginForm({ onClose, onLoginSuccess }: { onClose: () => void, onLoginSuccess: (usuario: { nome: string, email: string }) => void }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setSucesso('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });
    const data = await res.json();
    if (!res.ok) {
      setErro(data.error || 'Erro ao logar.');
    } else {
      setSucesso('Login realizado!');
      setEmail('');
      setSenha('');
      onLoginSuccess({ nome: data.nome, email: data.email });
      onClose();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4">
      <h2 className="text-lg font-bold text-center">Login</h2>
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="border rounded px-3 py-2 text-black"
        required
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={e => setSenha(e.target.value)}
        className="border rounded px-3 py-2 text-black"
        required
      />
      {erro && <div className="text-red-600 text-sm">{erro}</div>}
      {sucesso && <div className="text-green-600 text-sm">{sucesso}</div>}
      <button type="submit" className="bg-primary text-white rounded py-2 mt-2">Entrar</button>
      <button type="button" onClick={onClose} className="text-black text-sm mt-2 underline">Fechar</button>
    </form>
  );
}