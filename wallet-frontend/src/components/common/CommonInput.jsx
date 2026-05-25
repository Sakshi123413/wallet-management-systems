import React from 'react';

const CommonInput = ({
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  label,
  error,
  icon: Icon,
  ...props
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label 
          htmlFor={name} 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3 rounded-lg border transition-all duration-200 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${Icon ? 'pl-10' : ''}
            ${error 
              ? 'border-red-500 bg-red-50 animate-shake' 
              : 'border-gray-300 bg-white hover:border-gray-400'
            }
            placeholder-gray-400 text-gray-900
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${name}-error` : undefined}
          {...props}
        />
      </div>
      {error && (
        <p 
          id={`${name}-error`} 
          className="mt-2 text-sm text-red-600 flex items-center gap-1"
          role="alert"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default CommonInput;
