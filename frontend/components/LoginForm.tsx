"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { LoginRequest } from "@/types/auth";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/Input";
import { toast, useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  username: z.string().min(1, {
    message: "Username is required",
  }),
  password: z.string().min(4, {
    message: "Password must be at least 4 characters",
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const { toast } = useToast();

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);

    try {
      await authService.login(data);
      router.push("/dashboard");
      toast({
        title: "Success",
        description: "You have successfully logged in.",
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes("401")) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid username or password.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Something went wrong. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">
              Log in to your account
            </h1>
            <div className="w-full flex-1 mt-8">
              <div className="mx-auto max-w-xs">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your username"
                              disabled={isLoading}
                              {...field}
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
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter your password"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full py-6 bg-indigo-500 hover:bg-indigo-700"
                      disabled={isLoading}
                    >
                      {isLoading ? "Logging in..." : "Log in"}
                    </Button>
                  </form>
                </Form>
                <p className="mt-6 text-xs text-gray-600 text-center">
                  Don't have an account?{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto font-normal"
                    onClick={() => router.push("/sign-up")}
                  >
                    Sign up here
                  </Button>
                </p>
              </div>
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

export default LoginForm;