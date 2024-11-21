'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginRequest } from '../../types/auth';
import { authService } from '../../services/authService';

const LoginPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    username: '',
    password: '',
  });

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = {
      username: '',
      password: '',
    };

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const loginResponse = await authService.login(formData);
      // toast.success('Login successful!');
      router.push('/pages/dashboard');
    } catch (error) {
      if (error instanceof Error && error.message.includes('401')) {
        // toast.error('Invalid username or password');
      } else {
        // toast.error('An error occurred during login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div>
            {/* <img
              src="https://storage.googleapis.com/devitary-image-host.appspot.com/15846435184459982716-LogoMakr_7POjrN.png"
              className="w-32 mx-auto"
            /> */}
          </div>
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">Log in to your account</h1>
            <div className="w-full flex-1 mt-8">
              <form className="mx-auto max-w-xs" onSubmit={handleSubmit}>
                <input
                  className={`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border ${
                    errors.username ? 'border-red-500' : 'border-gray-200'
                  } placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`}
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                )}
                <input
                  className={`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border ${
                    errors.password ? 'border-red-500' : 'border-gray-200'
                  } placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5`}
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
                <button
                  type="submit"
                  className={`mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Log in'}
                </button>
              </form>
              <p className="mt-6 text-xs text-gray-600 text-center">
                Don't have an account?{' '}
                <button
                  className="border-b border-gray-500 border-dotted"
                  onClick={() => router.push('/pages/sign-up')}
                >
                  Sign up here
                </button>
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 w-40 bg-indigo-90 text-center hidden lg:flex items-center justify-center m-50">
          <div
            className="m-12 xl:m-16 w-full h-full bg-center bg-no-repeat bg-cover"
            style={{
              backgroundImage:
                "url('https://media.istockphoto.com/id/1392494719/photo/woman-with-pink-suitcase-and-passport-with-boarding-pass-standing-on-passengers-ladder-of.jpg?s=612x612&w=0&k=20&c=MVUZvIdaUmvRKdG-B5EEGGkIVFj51jss-b6IkxqY3fg=')",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
