import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Briefcase, Calendar, FileText, MapPin, Plus, Trash2, Pencil, User } from 'lucide-react';
import { api } from '../services/api';
import { formatDate } from '../utils/formatters';
import { AndamentoForm } from '../components/AndamentoForm';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Modal } from '../components/Modal';
import { Toast } from '../components/Toast';

async function buscarDetalhesProcesso(processoId) {
  const [processoData, andamentosData] = await Promise.all([
    api.getProcessoById(processoId),
    api.getAndamentosByProcesso(processoId),
  ]);

  return { processoData, andamentosData };
}

export function DetalhesProcesso() {
  const { id } = useParams();
  const navigate = useNavigate();
  

  const [processo, setProcesso] = useState(null);
  const [andamentos, setAndamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [andamentoModalOpen, setAndamentoModalOpen] = useState(false);
  const [editingAndamento, setEditingAndamento] = useState(null);
  const [deleteAndamentoId, setDeleteAndamentoId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  async function carregarDetalhes() {
    setLoading(true);
    setError('');

    try {
      const { processoData, andamentosData } = await buscarDetalhesProcesso(id);

      setProcesso(processoData);
      setAndamentos(andamentosData);
    } catch (err) {
      setError(err.message || 'Erro ao carregar os detalhes do processo.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!id) return;

    let isActive = true;

    buscarDetalhesProcesso(id)
      .then(({ processoData, andamentosData }) => {
        if (!isActive) return;

        setProcesso(processoData);
        setAndamentos(andamentosData);
      })
      .catch((err) => {
        if (!isActive) return;

        setError(err.message || 'Erro ao carregar os detalhes do processo.');
      })
      .finally(() => {
        if (!isActive) return;

        setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [id]);

  function abrirNovoAndamento() {
    setFeedback('');
    setError('');
    setEditingAndamento(null);
    setAndamentoModalOpen(true);
  }

  function abrirEdicaoAndamento(andamento) {
    setFeedback('');
    setError('');
    setEditingAndamento(andamento);
    setAndamentoModalOpen(true);
  }

  async function salvarAndamento(payload) {
    setSubmitting(true);

    try {
      if (editingAndamento) {
        await api.updateAndamento(editingAndamento.id, payload);
        setFeedback('Andamento atualizado com sucesso.');
      } else {
        await api.createAndamento(id, payload);
        setFeedback('Andamento criado com sucesso.');
      }

      setAndamentoModalOpen(false);
      await carregarDetalhes();
    } catch (err) {
      setError(err.message || 'Erro ao salvar o andamento.');
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmarExclusaoAndamento() {
    setSubmitting(true);

    try {
      await api.deleteAndamento(deleteAndamentoId);
      setDeleteAndamentoId(null);
      setFeedback('Andamento excluído com sucesso.');
      await carregarDetalhes();
    } catch (err) {
      setError(err.message || 'Erro ao excluir o andamento.');
    } finally {
      setSubmitting(false);
    }
  }


  if (loading) {
    return (
      <main className="page-container flex h-[50vh] items-center justify-center">
        <p className="animate-pulse text-muted-foreground">Carregando detalhes do processo...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-container py-8">
        <div className="rounded-md border border-destructive/20 bg-destructive/10 p-4 text-destructive">
          <p>{error}</p>
          <button onClick={() => navigate('/processos')} className="mt-4 underline">Voltar para a listagem</button>
        </div>
      </main>
    );
  }

  if (!processo) return null;

  return (
    <div className="app-shell">
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="page-container py-6">
          <button 
            className="mb-6 inline-flex items-center gap-2 transition-opacity hover:opacity-80" 
            onClick={() => navigate('/processos')}
          >
            <ArrowLeft size={18} /> Voltar para Dashboard
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold">Detalhes do Processo</h1>
            <span className="rounded bg-accent px-2 py-1 text-sm font-medium">{processo.uf}</span>
          </div>
        </div>
      </header>

      <main className="page-container space-y-8 py-8">
        <section className="section-card rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-primary">
            <FileText size={24} className="text-accent" /> {processo.numeroProcesso}
          </h2>

          <p className="mb-8 text-gray-700 leading-relaxed">{processo.descricao}</p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Info icon={<User />} label="Cliente" value={processo.cliente} />
            <Info icon={<Briefcase />} label="Advogado" value={processo.advogado} />
            <Info icon={<MapPin />} label="Estado" value={processo.uf} />
            <Info icon={<Calendar />} label="Data de Abertura" value={formatDate(processo.dataAbertura)} />
          </div>
        </section>

        <section className="section-card rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="page-header mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-bold text-primary">Andamentos do Processo</h2>
            <button
              type="button"
              onClick={abrirNovoAndamento}
              className="button-primary mt-4 flex items-center gap-2 sm:mt-0"
            >
              <Plus size={18} /> Novo Andamento
            </button>
          </div>

          <div className="table-shell overflow-x-auto rounded-md border border-border">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="p-4 font-medium">Data</th>
                  <th className="p-4 font-medium">Descrição</th>
                  <th className="p-4 text-right font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {andamentos.map((andamento) => (
                  <tr key={andamento.id} className="transition-colors hover:bg-muted/50">
                    <td className="whitespace-nowrap p-4 font-medium text-primary">
                      {formatDate(andamento.data)}
                    </td>
                    <td className="p-4 text-gray-700">{andamento.descricao}</td>
                    <td className="p-4">
                      <div className="action-row flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => abrirEdicaoAndamento(andamento)}
                          className="text-muted-foreground hover:text-accent transition-colors"
                          aria-label="Editar andamento"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteAndamentoId(andamento.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          aria-label="Excluir andamento"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {andamentos.length === 0 && (
                  <tr>
                    <td colSpan="3" className="p-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <FileText size={32} className="opacity-20" />
                        <p>Nenhum andamento registrado neste processo.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <Modal
        isOpen={andamentoModalOpen}
        title={editingAndamento ? 'Editar Andamento' : 'Novo Andamento'}
        onClose={() => setAndamentoModalOpen(false)}
      >
        <AndamentoForm
          initialData={editingAndamento}
          onSubmit={salvarAndamento}
          onCancel={() => setAndamentoModalOpen(false)}
          isSubmitting={submitting}
          minDate={processo.dataAbertura}
        />
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteAndamentoId)}
        title="Excluir andamento"
        message="Tem certeza que deseja excluir este andamento?"
        confirmLabel="Excluir"
        onCancel={() => setDeleteAndamentoId(null)}
        onConfirm={confirmarExclusaoAndamento}
        isSubmitting={submitting}
      />

      <Toast message={feedback} onClose={() => setFeedback('')} />
    </div>
  );
}

function Info({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-accent">{icon}</span>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="font-semibold text-primary">{value || '-'}</p>
      </div>
    </div>
  );
}
