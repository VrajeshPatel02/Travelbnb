'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SignUpRequest } from '../../types/auth';
import { authService } from '../../services/authService';
import Image from 'next/image';

const SignUpPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SignUpRequest>({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'ROLE_USER', // Default role
  });
  const [errors, setErrors] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = {
      name: '',
      username: '',
      email: '',
      password: '',
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    }

    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      await authService.signUp(formData);
      router.push('/pages/login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className='flex flex-col items-center'>
            {/* <img
              src="airbnb.svg"
              className="w-32 mx-auto"
              alt="Logo"
            /> */}
            <Image src="/airbnb.svg"
              width={300}
              height={300}
              alt="Airbnb Logo" />
          </div>
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">Sign up</h1>
            <form className="w-full flex-1 mt-8" onSubmit={handleSubmit}>
              <div className="mx-auto max-w-xs">
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}

                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                />
                {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}

                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                />
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}

                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full px-8 py-4 mt-5 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                >
                  <option value="ROLE_USER">User</option>
                  <option value="ROLE_ADMIN">Admin</option>
                </select>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                >
                  {isLoading ? 'Signing up...' : 'Sign Up'}
                </button>
                <p className="mt-6 text-xs text-gray-600 text-center">
                  Already have an account? {' '}
                  <a href='/pages/login' className="border-b border-gray-500 border-dotted">Login</a>
                </p>

                <p className="mt-6 text-xs text-gray-600 text-center">
                  I agree to abide by the platform’s{' '}
                  <a href="#" className="border-b border-gray-500 border-dotted">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="border-b border-gray-500 border-dotted">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
        <div className="flex-1 w-40 bg-indigo-90 text-center hidden lg:flex items-center justify-center m-50">
          <div
            className="m-12 xl:m-16 w-full h-full bg-center bg-no-repeat bg-cover"
            style={{
              backgroundImage: "url('/airbnbimg.jpeg')",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
