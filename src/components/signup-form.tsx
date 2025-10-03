"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";
import { FirebaseError } from "firebase/app";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Google, Microsoft } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useAuth } from "@/firebase/provider";
import { createUserWithEmailAndPassword } from "firebase/auth";

const signUpSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    setIsSubmitting(true);
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      toast({
        title: "Account Created!",
        description: "Welcome! Redirecting you to the dashboard.",
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Sign Up Error:", error);
      let title = "An unexpected error occurred.";
      let description = "Please try again later.";

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/email-already-in-use":
            title = "Email Already in Use";
            description =
              "This email is already associated with an account. Please sign in.";
            break;
          case "auth/invalid-email":
            title = "Invalid Email";
            description = "Please enter a valid email address.";
            break;
          case "auth/weak-password":
            title = "Weak Password";
            description = "Your password should be at least 6 characters long.";
            break;
          default:
            title = "Sign-Up Error";
            description = error.message;
            break;
        }
      }

      toast({
        variant: "destructive",
        title: title,
        description: description,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            {...form.register("email")}
            autoComplete="email"
          />
          {form.formState.errors.email && (
            <p className="text-sm text-destructive">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>
        <div className="grid gap-2 relative">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            {...form.register("password")}
            autoComplete="new-password"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute bottom-1 right-1 h-7 w-7"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
          </Button>
          {form.formState.errors.password && (
            <p className="text-sm text-destructive">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </Button>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" onClick={() => toast({ title: "Feature not implemented" })}>
          <Google className="mr-2 h-4 w-4" />
          Google
        </Button>
        <Button variant="outline" onClick={() => toast({ title: "Feature not implemented" })}>
          <Microsoft className="mr-2 h-4 w-4" />
          Microsoft
        </Button>
      </div>
      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link href="/" className="underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
