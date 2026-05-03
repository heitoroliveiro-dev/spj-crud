import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

function toDateInput(value) {
  if (!value) return '';
  return String(value).slice(0, 10);
}

export function AndamentoForm({ initialData, onSubmit, onCancel, isSubmitting = false }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    reset({
      data: toDateInput(initialData?.data),
      descricao: initialData?.descricao || '',
    });
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <label className="form-field">
        Data
        <input type="date" {...register('data', { required: 'Informe a data do andamento' })} />
        {errors.data && <span className="text-sm text-red-600">{errors.data.message}</span>}
      </label>

      <label className="form-field">
        Descrição
        <textarea rows="4" {...register('descricao', { required: 'Informe a descrição do andamento' })} />
        {errors.descricao && <span className="text-sm text-red-600">{errors.descricao.message}</span>}
      </label>

      <div className="action-row">
        <button type="button" onClick={onCancel} className="button-secondary">
          Cancelar
        </button>

        <button type="submit" disabled={isSubmitting} className="button-primary">
          {isSubmitting ? 'Salvando...' : 'Salvar Andamento'}
        </button>
      </div>
    </form>
  );
}
