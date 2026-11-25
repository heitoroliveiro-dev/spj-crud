import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/*
 * Spec 002 (modo demonstração): com VITE_DEMO_EMAIL e VITE_DEMO_PASSWORD no build, a tela mostra a
 * conta de teste pública e esconde cadastro e "esqueci minha senha" (sem e-mail na demonstração).
 */
const DEMO =
  import.meta.env.VITE_DEMO_EMAIL && import.meta.env.VITE_DEMO_PASSWORD
    ? { email: import.meta.env.VITE_DEMO_EMAIL, senha: import.meta.env.VITE_DEMO_PASSWORD }
    : null;
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

        {DEMO && (
          <div className="mb-5 rounded-md border border-accent/30 bg-accent/10 p-3 text-sm">
            <p className="font-medium">Conta de demonstração</p>
            <p className="mt-1 text-muted-foreground">
              E-mail: <span className="font-mono">{DEMO.email}</span>
              <br />
              Senha: <span className="font-mono">{DEMO.senha}</span>
            </p>
            <p className="mt-1 text-muted-foreground">Os dados voltam ao início todo dia às 4h.</p>
            <button
              type="button"
              className="button-primary mt-3 w-full"
              onClick={() => {
                setEmail(DEMO.email);
                setSenha(DEMO.senha);
              }}
            >
              Usar conta de demonstração
            </button>
          </div>
        )}

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

        {!DEMO && (
          <div className="mt-4 flex flex-col gap-1 text-sm text-muted-foreground">
            <Link to="/esqueci-senha" className="hover:underline">Esqueci minha senha</Link>
            <span>
              Não tem conta?{' '}
              <Link to="/cadastro" className="text-accent hover:underline">Cadastre-se</Link>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
