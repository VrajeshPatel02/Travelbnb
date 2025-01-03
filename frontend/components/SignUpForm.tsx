'use client';

import { useSignUpForm } from '@/hooks/useSignUpForm';
import Image from 'next/image';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';

const SignUpForm = () => {
    const { form, isLoading, onSubmit } = useSignUpForm();

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
            <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
                <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
                    {/* <div className="flex flex-col items-center">
                        <Image
                            src="/airbnb.svg"
                            width={100}
                            height={100}
                            alt="Airbnb Logo"
                        />
                    </div> */}
                    <div className="mt-12 flex flex-col items-center">
                        <h1 className="text-2xl xl:text-3xl font-extrabold">Sign Up</h1>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex-1 mt-8">
                                <div className="mx-auto max-w-xs">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Name"
                                                        disabled={isLoading}
                                                        {...field}
                                                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Username"
                                                        disabled={isLoading}
                                                        {...field}
                                                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="Email"
                                                        disabled={isLoading}
                                                        {...field}
                                                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="Password"
                                                        disabled={isLoading}
                                                        {...field}
                                                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    

                                    <Button
                                        type="submit"
                                        className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Signing up...' : 'Sign Up'}
                                    </Button>

                                    <p className="text-sm text-gray-600 mt-4 text-center">
                                        Already have an account?{' '}
                                        <a href="/pages/login" className="text-indigo-500 hover:underline">
                                            Login
                                        </a>
                                    </p>
                                    <p className="text-xs text-gray-600 mt-4 text-center">
                                        By signing up, you agree to our{' '}
                                        <a href="#" className="text-indigo-500 hover:underline">
                                            Terms of Service
                                        </a>{' '}
                                        and{' '}
                                        <a href="#" className="text-indigo-500 hover:underline">
                                            Privacy Policy
                                        </a>.
                                    </p>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
                <div className="hidden lg:flex items-center justify-center flex-1 bg-cover bg-center"
                    style={{ backgroundImage: "url('/airbnbimg.jpeg')" }}>
                    <div className="w-full h-full bg-white opacity-75" />
                </div>
            </div>
        </div>
    );
};

export default SignUpForm;
