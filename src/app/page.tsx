import Image from "next/image";
import { LoginForm } from "@/components/login-form";
import { placeholderImages } from "@/lib/placeholder-images.json";
import { Layers } from "lucide-react";

export default function LoginPage() {
  const loginImage = placeholderImages.find((p) => p.id === "login-background");

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-4 text-center">
            <div className="flex items-center justify-center gap-2">
               <Layers className="h-8 w-8 text-primary-foreground fill-primary" />
               <h1 className="text-3xl font-bold font-headline">TimeFlow</h1>
            </div>
            <p className="text-balance text-muted-foreground">
              Log in to your account to intelligently manage your schedule
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative">
        {loginImage && (
            <Image
            src={loginImage.imageUrl}
            alt={loginImage.description}
            data-ai-hint={loginImage.imageHint}
            fill
            className="object-cover"
            priority
            />
        )}
      </div>
    </div>
  );
}
