"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import toast from "react-hot-toast";
import { Dumbbell, UserPlus } from "lucide-react";
import Button from "../../components/ui/Button.jsx";
import { Input, Label } from "../../components/ui/Input.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import ImageUpload from "../../components/ImageUpload.jsx";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path fill="#EA4335" d="M12 11v3.4h5.4c-.2 1.4-1.6 4.1-5.4 4.1-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.8 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.9 14.6 3 12 3 6.9 3 2.8 7.1 2.8 12S6.9 21 12 21c6.9 0 9.2-4.8 9.2-7.3 0-.5 0-.9-.1-1.3H12z"/>
    </svg>
  );
}

function RegisterForm() {
  const { user, isPending, register, loginWithGoogle } = useAuth();
  const router = useRouter();

  const [initialCheck, setInitialCheck] = useState(true);

  useEffect(() => {
    if (!isPending) setInitialCheck(false);
  }, [isPending]);

  useEffect(() => {
    if (user && !isPending) {
      router.push("/dashboard");
    }
  }, [user, isPending, router]);

  if (initialCheck || user) return <div className="flex min-h-screen items-center justify-center">Loading...</div>;

  const [form, setForm] = useState({ name: "", email: "", image: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (form.password.length < 6) e.password = "Min 6 characters";
    if (!/[A-Z]/.test(form.password) || !/[0-9]/.test(form.password)) e.password = "Use 1 uppercase letter and 1 number";
    if (form.password !== form.confirm) e.confirm = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    try {
      const u = await register(form);
      toast.success(`Welcome to FitNova, ${u.name.split(" ")[0]}!`);
    } catch (err) { toast.error(err.message); }
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
      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Join FitNova and book your first class today.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" placeholder="Alex Morgan" value={form.name} onChange={onChange("name")} />
              {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@studio.com" value={form.email} onChange={onChange("email")} />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
            </div>
            <div>
              <ImageUpload
                label="Profile image (optional)"
                value={form.image}
                onChange={(url) => setForm((f) => ({ ...f, image: url }))}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="pw">Password</Label>
                <Input id="pw" type="password" placeholder="••••••••" value={form.password} onChange={onChange("password")} />
                {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
              </div>
              <div>
                <Label htmlFor="cf">Confirm</Label>
                <Input id="cf" type="password" placeholder="••••••••" value={form.confirm} onChange={onChange("confirm")} />
                {errors.confirm && <p className="mt-1 text-xs text-destructive">{errors.confirm}</p>}
              </div>
            </div>

            <Button type="submit" variant="hero" size="lg" className="w-full"><UserPlus className="h-4 w-4" /> Create account</Button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
          </div>

          <Button variant="outline" size="lg" className="w-full" onClick={handleGoogleSignIn}>
            <GoogleIcon /> Continue with Google
          </Button>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account? <Link href="/login" className="font-medium text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </div>

      <div className="relative hidden overflow-hidden lg:block">
        <img
          alt=""
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1400&q=70"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[oklch(0.24_0.06_258)]/90 via-[oklch(0.24_0.06_258)]/60 to-transparent" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur"><Dumbbell className="h-5 w-5" /></div>
            <span className="text-lg font-bold">FitNova</span>
          </Link>
          <div>
            <h2 className="text-4xl font-semibold leading-tight">Train smarter. Book faster. Show up stronger.</h2>
          </div>
          <p className="text-xs text-white/60">© FitNova Systems Inc.</p>
        </div>
      </div>
    </div>
  );
}

export default function Register() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
