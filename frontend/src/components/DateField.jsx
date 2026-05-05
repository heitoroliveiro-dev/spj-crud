import DatePicker, { registerLocale } from 'react-datepicker';
import { Controller } from 'react-hook-form';
import { ptBR } from 'date-fns/locale/pt-BR';
import { clampFutureDate, getTodayDate, normalizeDate } from '../utils/dateUtils';
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('pt-BR', ptBR);

export function DateField({ control, name, label, error, requiredMessage, minDate }) {
  const normalizedMinDate = normalizeDate(minDate);

  return (
    <label className="form-field">
      {label}
      <Controller
        name={name}
        control={control}
        rules={{ required: requiredMessage }}
        render={({ field }) => (
          <DatePicker
            selected={field.value || null}
            onChange={(date) => field.onChange(clampFutureDate(date))}
            onBlur={field.onBlur}
            dateFormat="dd/MM/yyyy"
            locale="pt-BR"
            minDate={normalizedMinDate || undefined}
            maxDate={getTodayDate()}
            placeholderText="dd/mm/aaaa"
            className="w-full"
            wrapperClassName="w-full"
            todayButton="Hoje"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />
        )}
      />
      {error && <span className="text-sm text-red-600">{error}</span>}
    </label>
  );
}
