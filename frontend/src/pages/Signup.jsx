import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Scale, MailCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Signup() {
  const { signup } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [cadastroConcluido, setCadastroConcluido] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await signup(email, senha, nome);
      setCadastroConcluido(true);
    } catch (err) {
      setError(err.message || 'Não foi possível concluir o cadastro.');
    } finally {
      setSubmitting(false);
    }
  }

  if (cadastroConcluido) {
    return (
      <div className="app-shell flex min-h-screen items-center justify-center">
        <div className="section-card w-full max-w-md text-center">
          <MailCheck size={40} className="mx-auto mb-4 text-accent" />
          <h1 className="text-xl font-semibold mb-2">Confira seu e-mail</h1>
          <p className="text-muted-foreground mb-6">
            Enviamos um link de confirmação para <strong>{email}</strong>. Clique nele para
            ativar sua conta antes de entrar.
          </p>
          <Link to="/login" className="button-primary inline-flex">Ir para o login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell flex min-h-screen items-center justify-center">
      <div className="section-card w-full max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <Scale size={28} />
          <h1 className="text-xl font-semibold">Criar conta no SPJ</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="form-field">
            Nome
            <input value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="name" />
          </label>

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
              minLength={8}
              autoComplete="new-password"
            />
            <span className="text-xs text-muted-foreground">Mínimo de 8 caracteres.</span>
          </label>

          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md border border-destructive/20 text-sm">
              {error}
            </div>
          )}

          <button type="submit" disabled={submitting} className="button-primary w-full">
            {submitting ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <p className="mt-4 text-sm text-muted-foreground">
          Já tem conta?{' '}
          <Link to="/login" className="text-accent hover:underline">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
