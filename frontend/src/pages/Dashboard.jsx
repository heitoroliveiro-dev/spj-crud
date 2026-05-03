import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Scale } from 'lucide-react';
import { api } from '../services/api';
import { ProcessoCard } from '../components/ProcessoCard';

export function Dashboard() {
    const [processos, setProcessos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetch() {
            try {
            const data = await api.getProcessos();
            setProcessos(data);
            } catch (err) {
            setError(err.message || 'Erro ao carregar os processos');
            } finally {
            setLoading(false);
            }
        }
        fetch();
    }, []);

    async function recarregarProcessos() {
        setLoading(true);
        setError('');
        try {
            const data = await api.getProcessos();
            setProcessos(data);
        } catch (err) {
            setError(err.message || 'Erro ao atualizar a lista.');
        } finally {
            setLoading(false);
        }
    }

    const filteredProcessos = useMemo(() => {
        if(!searchTerm) return processos;

    const termo = searchTerm.toLowerCase();
    return processos.filter((p) =>
        p.numeroProcesso?.toLowerCase().includes(termo) ||
        p.cliente?.toLowerCase().includes(termo) ||
        p.advogado?.toLowerCase().includes(termo) ||
        p.uf?.toLowerCase().includes(termo)
    );
    }, [processos, searchTerm]);

return (
    <div className="app-shell">
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="page-container py-6">
          <div className="flex items-center gap-3">
            <Scale size={32} />
            <h1 className="text-3xl font-semibold">Sistema de Processos Judiciais</h1>
          </div>
        </div>
      </header>

      <main className="page-container">
        <div className="page-header">
          <div>
            <h2 className="text-2xl font-semibold">Processos Cadastrados</h2>
            <p className="text-muted-foreground">{filteredProcessos.length} processo(s) encontrado(s)</p>
          </div>
          <button className="button-primary"><Plus size={18} /> Novo Processo</button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            className="w-full rounded-md border border-border bg-card py-3 pl-11 pr-4"
            placeholder="Buscar por número, cliente, advogado ou UF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Feedback visual aprimorado para o usuário */}
        {loading && (
          <div className="flex justify-center py-8">
            <p className="text-muted-foreground animate-pulse">Carregando processos...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md border border-destructive/20 mb-6">
            <p>{error}</p>
            <button onClick={recarregarProcessos} className="text-sm underline mt-2">Tentar novamente</button>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {filteredProcessos.map((processo) => (
              <ProcessoCard
                key={processo.id}
                processo={processo}
                onEdit={(p) => console.log('editar', p)}
                onDelete={(id) => console.log('deletar', id)}
              />
            ))}
            
            {/* Tratamento para "Empty State" quando a busca não retorna nada */}
            {filteredProcessos.length === 0 && processos.length > 0 && (
               <div className="col-span-full text-center py-12 text-muted-foreground">
                 <p>Nenhum processo encontrado para a busca "{searchTerm}".</p>
               </div>
            )}
          </div>
        )}
      </main>
    </div>
);
}