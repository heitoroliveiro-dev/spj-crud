import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../utils/formatters';

export function ProcessoCard({ processo, onEdit, onDelete }) {
    const navigate = useNavigate();
    const isMg = processo.uf === 'MG';

    return (
        <article className='section-card'>
            <div className='flex items-center gap-3 mb-2'>
                <h3 className='font-bold text-lg'>{processo.numeroProcesso}</h3>
                <span className={isMg ? 'rounded bg-accent px-2 py-1 text-xs text-white' : 'roudned bg-muted px-2 py-1 text-xs'}>
                    {processo.uf}
                </span>
            </div>

            <p className='text-sm text-muted-foreground mb-2'>{processo.descricao}</p>

            <div className='grid grid-cols-2 gap-4 text-sm mb-5'>
                <div>
                    <span className='text-muted-foreground'>Cliente:</span>
                    <p className='font-semibold'>{processo.cliente}</p>
                </div>
                <div>
                    <span className='text-muted-foreground'>Advogado:</span>
                    <p className='font-semibold'>{processo.advogado}</p>
                </div>
                <div>
                    <span className='text-muted-foreground'>Data de Abertura:</span>
                    <p className='font-semibold'>{formatDate(processo.dataAbertura)}</p>
                </div>
                <div>
                    <span className='text-muted-foreground'>Andamentos:</span>
                    <p className='font-semibold'>{processo.andamentos?.length || 0}</p>
                </div>
            </div>

            <div className='action-row border-t border-border pt-4'>
                <button className='button-secondary flex-1' onClick={() => navigate(`/processos/${processo.id}`)}><Eye size={16} />Ver Detalhes</button>
                <button className='button-secondary' onClick={() => onEdit(processo)}><Pencil size={16} /></button>
                <button className='button-secondary text-destructive' onClick={() => onDelete(processo.id)}><Trash2 size={16} /></button>
            </div>
        </article>
    );
}

