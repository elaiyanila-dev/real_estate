import React from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

export default function PasswordInput({
  label = 'Password',
  value,
  onChange,
  show,
  setShow,
  placeholder = 'Enter password',
  required = true,
}) {
  return (
    <label className="block text-sm font-bold text-[#1F2937]">
      {label}
      <div className="relative mt-2">
        <div
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center text-[#0F766E]"
          aria-hidden="true"
        >
          <Lock size={16} />
        </div>
        <input
          className="auth-input pl-11 pr-11"
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          required={required}
          aria-label={label}
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl p-2 text-[#6B7280] transition-colors duration-200 hover:text-[#0F766E] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#0F766E]/20"
          onClick={() => setShow?.(!show)}
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </label>
  );
}

