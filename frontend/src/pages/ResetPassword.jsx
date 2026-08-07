import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Scale, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [concluido, setConcluido] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (novaSenha !== confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }

    if (!token) {
      setError('Link de redefinição inválido.');
      return;
    }

    setSubmitting(true);

    try {
      await api.resetPassword(token, novaSenha);
      setConcluido(true);
    } catch (err) {
      setError(err.message || 'Não foi possível redefinir a senha.');
    } finally {
      setSubmitting(false);
    }
  }

  if (concluido) {
    return (
      <div className="app-shell flex min-h-screen items-center justify-center">
        <div className="section-card w-full max-w-md text-center">
          <CheckCircle2 size={40} className="mx-auto mb-4 text-success" />
          <h1 className="text-xl font-semibold mb-2">Senha redefinida</h1>
          <p className="text-muted-foreground mb-6">Você já pode entrar com a nova senha.</p>
          <button type="button" onClick={() => navigate('/login')} className="button-primary">
            Ir para o login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell flex min-h-screen items-center justify-center">
      <div className="section-card w-full max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <Scale size={28} />
          <h1 className="text-xl font-semibold">Definir nova senha</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="form-field">
            Nova senha
            <input
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </label>

          <label className="form-field">
            Confirmar nova senha
            <input
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </label>

          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md border border-destructive/20 text-sm">
              {error}
            </div>
          )}

          <button type="submit" disabled={submitting} className="button-primary w-full">
            {submitting ? 'Salvando...' : 'Redefinir senha'}
          </button>
        </form>

        <p className="mt-4 text-sm text-muted-foreground">
          <Link to="/login" className="text-accent hover:underline">Voltar ao login</Link>
        </p>
      </div>
    </div>
  );
}
