"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Sun, Moon, ChevronDown, LogOut, LayoutDashboard, User as UserIcon } from "lucide-react";
import Button from "../ui/Button.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import { cn } from "../../utils/helpers.js";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/classes", label: "All Classes" },
    { href: "/community", label: "Community" },
  ];
  if (user) links.push({ href: "/dashboard", label: "Dashboard" });

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center">
            <img src="/favicon.ico" alt="FitNova Logo" className="h-5 w-5 object-contain" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Fit<span className="gradient-text">Nova</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-lg px-3.5 py-2 text-sm font-medium transition",
                pathname === l.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="hidden h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground md:flex"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {!user ? (
            <div className="hidden items-center gap-2 md:flex">
              <Button as={Link} href="/login" variant="ghost" size="sm">Login</Button>
              <Button as={Link} href="/register" variant="primary" size="sm">Get Started</Button>
            </div>
          ) : (
            <div className="relative hidden md:block">
              <button
                onClick={() => setMenu((v) => !v)}
                className="flex items-center gap-2 rounded-lg border border-border px-2 py-1.5 hover:bg-muted"
              >
                <img src={user.image} alt="" className="h-7 w-7 rounded-full object-cover" />
                <span className="text-sm font-medium">{user.name.split(" ")[0]}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
              {menu && (
                <div
                  onMouseLeave={() => setMenu(false)}
                  className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-popover shadow-xl"
                >
                  <div className="border-b border-border px-4 py-3">
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <Link href="/dashboard" onClick={() => setMenu(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                  <Link href="/profile" onClick={() => setMenu(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted">
                    <UserIcon className="h-4 w-4" /> Profile Settings
                  </Link>
                  <button
                    onClick={() => { logout(); setMenu(false); router.push("/"); }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-muted"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground md:hidden"
            aria-label="Open menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="space-y-1 px-4 py-3">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted">
                {l.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-border" />
            <button onClick={toggle} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />} Toggle theme
            </button>
            {!user ? (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button as={Link} href="/login" variant="outline" size="sm" onClick={() => setOpen(false)}>Login</Button>
                <Button as={Link} href="/register" variant="primary" size="sm" onClick={() => setOpen(false)}>Sign up</Button>
              </div>
            ) : (
              <>
                <Link href="/profile" onClick={() => setOpen(false)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted">
                  <UserIcon className="h-4 w-4" /> Profile Settings
                </Link>
                <button onClick={() => { logout(); setOpen(false); router.push("/"); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-muted">
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
