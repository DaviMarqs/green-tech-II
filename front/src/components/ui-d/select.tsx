type Option = { label: string; value: string };

export function ProductNativeSelect({
  value,
  onChange,
  options,
  placeholder = "Escolha um produto",
  disabled,
  id,
}: {
  value?: string;
  onChange: (v: string) => void;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  id?: string;
}) {
  return (
    <select
      id={id}
      value={value ?? ""} // controla o select
      onChange={(e) => onChange(e.target.value)} // envia o value (string)
      disabled={disabled}
      className="
        w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
        shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        focus-visible:ring-gray-900 disabled:opacity-50
      "
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
