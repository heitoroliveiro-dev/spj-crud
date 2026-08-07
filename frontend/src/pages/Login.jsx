import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scale } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, senha);
      navigate('/processos');
    } catch (err) {
      setError(err.message || 'Não foi possível entrar.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="app-shell flex min-h-screen items-center justify-center">
      <div className="section-card w-full max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <Scale size={28} />
          <h1 className="text-xl font-semibold">Entrar no SPJ</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="form-field">
            E-mail
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </label>

          <label className="form-field">
            Senha
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>

          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md border border-destructive/20 text-sm">
              {error}
            </div>
          )}

          <button type="submit" disabled={submitting} className="button-primary w-full">
            {submitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-4 flex flex-col gap-1 text-sm text-muted-foreground">
          <Link to="/esqueci-senha" className="hover:underline">Esqueci minha senha</Link>
          <span>
            Não tem conta?{' '}
            <Link to="/cadastro" className="text-accent hover:underline">Cadastre-se</Link>
          </span>
        </div>
      </div>
    </div>
  );
}
