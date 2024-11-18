// src/hooks/useFormValidation.ts
import { useState } from 'react';

interface ValidationRules {
  required?: boolean;
  minLength?: number;
  email?: boolean;
  match?: string;
}

interface Validations {
  [key: string]: ValidationRules;
}

export function useFormValidation<T extends object>(initialState: T, validations: Validations) {
  const [values, setValues] = useState<T>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const validateField = (name: keyof T, value: any) => {
    const rules = validations[name as string];
    if (!rules) {
      return '';
    }

    if (rules.required && !value) {
      return 'This field is required';
    }

    if (rules.minLength && value.length < rules.minLength) {
      return `Must be at least ${rules.minLength} characters`;
    }

    if (rules.email && !/\S+@\S+\.\S+/.test(value)) {
      return 'Must be a valid email';
    }

    if (rules.match && value !== values[rules.match as keyof T]) {
      return 'Passwords do not match';
    }

    return '';
  };

  const handleChange = (name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateAll = () => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(validations).forEach(key => {
      const error = validateField(key as keyof T, values[key as keyof T]);
      if (error) {
        newErrors[key as keyof T] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  return { values, errors, handleChange, validateAll };
}
