export default function SelectField({
    label,
    value,
    onChange,
    options = [],
    placeholder = 'Bitte wählen',
    error,
    className = '',
    ...props
  }) {
    return (
      <div className="form-control w-full">
        {label && (
          <label className="label">
            <span className="label-text">{label}</span>
          </label>
        )}
        <select
          value={value}
          onChange={onChange}
          className={`select select-bordered w-full ${error ? 'select-error' : ''} ${className}`}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-error text-sm mt-1">{error}</p>}
      </div>
    );
  }
  