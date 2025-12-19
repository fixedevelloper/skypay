import React, { memo } from "react";

type InputFieldProps = {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
};

const InputField = memo(({ id, label, value, placeholder, onChange }: InputFieldProps) => {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-[#014d74] outline-none text-gray-800"
      />
    </div>
  );
});

export default InputField;
