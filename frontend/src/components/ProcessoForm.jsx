import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { DateField } from './DateField';
import { toDateObject } from '../utils/dateUtils';

const UFS = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'];

export function ProcessoForm({ initialData, onSubmit, onCancel, isSubmitting = false, fieldErrors = {} }) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    reset({
      numeroProcesso: initialData?.numeroProcesso || '',
      dataAbertura: toDateObject(initialData?.dataAbertura),
      descricao: initialData?.descricao || '',
      cliente: initialData?.cliente || '',
      advogado: initialData?.advogado || '',
      uf: initialData?.uf || 'MG',
    });
  }, [initialData, reset]);

  const numeroProcessoError = errors.numeroProcesso?.message || fieldErrors.numeroProcesso;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="form-grid">
        <label className="form-field">
          Número do Processo
          <input {...register('numeroProcesso', { required: 'Informe o número do processo' })} />
          {numeroProcessoError && <span className="text-sm text-red-600">{numeroProcessoError}</span>}
        </label>

        <DateField
          control={control}
          name="dataAbertura"
          label="Data de Abertura"
          requiredMessage="Informe a data de abertura"
          error={errors.dataAbertura?.message}
        />

        <label className="form-field">
          Cliente
          <input {...register('cliente', { required: 'Informe o cliente' })} />
          {errors.cliente && <span className="text-sm text-red-600">{errors.cliente.message}</span>}
        </label>

        <label className="form-field">
          Advogado
          <input {...register('advogado', { required: 'Informe o advogado' })} />
          {errors.advogado && <span className="text-sm text-red-600">{errors.advogado.message}</span>}
        </label>

        <label className="form-field">
          UF
          <select {...register('uf', { required: 'Informe a UF' })}>
            {UFS.map((uf) => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="form-field">
        Descrição
        <textarea rows="4" {...register('descricao', { required: 'Informe a descrição' })} />
        {errors.descricao && <span className="text-sm text-red-600">{errors.descricao.message}</span>}
      </label>

      <div className="action-row">
        <button type="button" onClick={onCancel} className="button-secondary">
          Cancelar
        </button>

        <button type="submit" disabled={isSubmitting} className="button-primary">
          {isSubmitting ? 'Salvando...' : 'Salvar Processo'}
        </button>
      </div>
    </form>
  );
}
