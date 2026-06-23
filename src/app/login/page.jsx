"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import toast from "react-hot-toast";
import { Dumbbell, LogIn, ShieldCheck, User, UserCog } from "lucide-react";
import Button from "../../components/ui/Button.jsx";
import { Input, Label } from "../../components/ui/Input.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path fill="#EA4335" d="M12 11v3.4h5.4c-.2 1.4-1.6 4.1-5.4 4.1-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.8 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.9 14.6 3 12 3 6.9 3 2.8 7.1 2.8 12S6.9 21 12 21c6.9 0 9.2-4.8 9.2-7.3 0-.5 0-.9-.1-1.3H12z"/>
    </svg>
  );
}

function LoginForm() {
  const { user, isPending, login, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  useEffect(() => {
    if (user && !isPending) {
      router.push("/dashboard");
    }
  }, [user, isPending, router]);

  if (isPending || user) return <div className="flex min-h-screen items-center justify-center">Loading...</div>;

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const u = await login(email, pw);
      toast.success(`Welcome back, ${u.name.split(" ")[0]}!`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="relative grid min-h-[calc(100vh-4rem)] grid-cols-1 lg:grid-cols-2">
      <div className="hidden flex-col justify-between gradient-brand p-12 text-white lg:flex">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur"><Dumbbell className="h-5 w-5" /></div>
          <span className="text-lg font-bold">FitNova</span>
        </Link>
        <div>
          <h2 className="text-4xl font-semibold leading-tight">Run your studio like the top 1%.</h2>
          <p className="mt-4 max-w-md text-white/85">Members, trainers, and admins — one platform, every workflow.</p>
          <div className="mt-10 grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur"><p className="text-2xl font-bold">12.4k</p><p className="text-white/75">Members</p></div>
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur"><p className="text-2xl font-bold">184</p><p className="text-white/75">Classes</p></div>
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur"><p className="text-2xl font-bold">4.9★</p><p className="text-white/75">Avg rating</p></div>
          </div>
        </div>
        <p className="text-xs text-white/60">© FitNova Systems Inc.</p>
      </div>

      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to your FitNova account.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required placeholder="you@studio.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="pw">Password</Label>
              <Input id="pw" type="password" required placeholder="••••••••" value={pw} onChange={(e) => setPw(e.target.value)} />
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full"><LogIn className="h-4 w-4" /> Sign in</Button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
          </div>

          <Button variant="outline" size="lg" className="w-full" onClick={handleGoogleSignIn}>
            <GoogleIcon /> Continue with Google
          </Button>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New to FitNova? <Link href="/register" className="font-medium text-primary hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
