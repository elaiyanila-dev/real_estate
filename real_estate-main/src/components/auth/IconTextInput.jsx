import React, { useId, useMemo } from 'react';

export default function IconTextInput({
  icon: Icon,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  name,
  required = true,
  inputMode,
}) {
  const id = useId();
  const inputId = name || id;

  const inputClass = useMemo(
    () =>
      [
        'auth-input',
        'pr-11',
        // icon-only inputs need left padding, but keep consistent spacing
        'pl-11',
      ].join(' '),
    []
  );

  return (
    <label htmlFor={inputId} className="block text-sm font-bold text-[#1F2937]">
      {label}
      <div className="relative mt-2">
        <div
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center text-[#0F766E]"
          aria-hidden="true"
        >
          {Icon ? <Icon size={16} /> : null}
        </div>
        <input
          id={inputId}
          name={name}
          className={inputClass}
          type={type}
          value={value}
          inputMode={inputMode}
          autoComplete={autoComplete}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          required={required}
        />
      </div>
    </label>
  );
}

