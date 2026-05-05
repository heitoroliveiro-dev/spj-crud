import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { DateField } from './DateField';
import { toDateObject } from '../utils/dateUtils';

export function AndamentoForm({ initialData, onSubmit, onCancel, isSubmitting = false, minDate }) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    reset({
      data: toDateObject(initialData?.data),
      descricao: initialData?.descricao || '',
    });
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <DateField
        control={control}
        name="data"
        label="Data"
        requiredMessage="Informe a data do andamento"
        error={errors.data?.message}
        minDate={minDate}
      />

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
