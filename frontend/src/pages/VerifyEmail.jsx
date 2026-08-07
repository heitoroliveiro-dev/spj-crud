import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Scale } from 'lucide-react';
import { api } from '../services/api';

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState(token ? 'carregando' : 'erro');
  const [mensagem, setMensagem] = useState(token ? '' : 'Link de confirmação inválido.');

  useEffect(() => {
    if (!token) {
      return;
    }

    api.verifyEmail(token)
      .then((res) => {
        setStatus('sucesso');
        setMensagem(res.message || 'E-mail confirmado com sucesso.');
      })
      .catch((err) => {
        setStatus('erro');
        setMensagem(err.message || 'Não foi possível confirmar o e-mail.');
      });
  }, [token]);

  return (
    <div className="app-shell flex min-h-screen items-center justify-center">
      <div className="section-card w-full max-w-md text-center">
        <Scale size={28} className="mx-auto mb-4" />

        {status === 'carregando' && <p className="text-muted-foreground">Confirmando seu e-mail...</p>}

        {status === 'sucesso' && (
          <>
            <CheckCircle2 size={40} className="mx-auto mb-4 text-success" />
            <h1 className="text-xl font-semibold mb-2">E-mail confirmado</h1>
            <p className="text-muted-foreground mb-6">{mensagem}</p>
            <Link to="/login" className="button-primary inline-flex">Ir para o login</Link>
          </>
        )}

        {status === 'erro' && (
          <>
            <XCircle size={40} className="mx-auto mb-4 text-destructive" />
            <h1 className="text-xl font-semibold mb-2">Não foi possível confirmar</h1>
            <p className="text-muted-foreground mb-6">{mensagem}</p>
            <Link to="/login" className="button-secondary inline-flex">Voltar ao login</Link>
          </>
        )}
      </div>
    </div>
  );
}
