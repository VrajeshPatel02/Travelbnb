import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { SignUpRequest } from '@/types/auth';
import { authService } from '@/services/authService';

export const useSignUpForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignUpRequest>({
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      role: 'ROLE_USER'
    },
  });

  const validationRules = {
    name: {
      required: 'Name is required',
      minLength: {
        value: 3,
        message: 'Name must be at least 3 characters long',
      },
    },
    username: {
      required: 'Username is required',
      minLength: {
        value: 3,
        message: 'Username must be at least 3 characters long',
      },
    },
    email: {
      required: 'Email is required',
      pattern: {
        value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: 'Enter a valid email address',
      },
    },
    password: {
      required: 'Password is required',
      minLength: {
        value: 6,
        message: 'Password must be at least 6 characters long',
      },
    },
  };

  const onSubmit = async (data: SignUpRequest) => {
    setIsLoading(true);
    try {
      await authService.signUp(data);
      console.log(data);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    onSubmit,
    validationRules,
  };
};
