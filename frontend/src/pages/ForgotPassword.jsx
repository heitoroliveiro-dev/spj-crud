import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Scale, MailCheck } from 'lucide-react';
import { api } from '../services/api';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [enviado, setEnviado] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await api.forgotPassword(email);
      setEnviado(true);
    } catch (err) {
      setError(err.message || 'Não foi possível processar o pedido.');
    } finally {
      setSubmitting(false);
    }
  }

  if (enviado) {
    return (
      <div className="app-shell flex min-h-screen items-center justify-center">
        <div className="section-card w-full max-w-md text-center">
          <MailCheck size={40} className="mx-auto mb-4 text-accent" />
          <h1 className="text-xl font-semibold mb-2">Verifique seu e-mail</h1>
          <p className="text-muted-foreground mb-6">
            Se {email} estiver cadastrado, você vai receber um link para redefinir sua senha.
          </p>
          <Link to="/login" className="button-primary inline-flex">Voltar ao login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell flex min-h-screen items-center justify-center">
      <div className="section-card w-full max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <Scale size={28} />
          <h1 className="text-xl font-semibold">Esqueci minha senha</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="form-field">
            E-mail cadastrado
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </label>

          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md border border-destructive/20 text-sm">
              {error}
            </div>
          )}

          <button type="submit" disabled={submitting} className="button-primary w-full">
            {submitting ? 'Enviando...' : 'Enviar link de redefinição'}
          </button>
        </form>

        <p className="mt-4 text-sm text-muted-foreground">
          <Link to="/login" className="text-accent hover:underline">Voltar ao login</Link>
        </p>
      </div>
    </div>
  );
}
