"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  ExternalLink,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { signOutAdmin } from "@/app/admin/(protected)/actions";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/admin/dashboard", label: "Visão geral", icon: LayoutDashboard },
  { href: "/admin/orcamentos", label: "Orçamentos", icon: ClipboardList },
];

export function AdminShell({
  children,
  userLabel,
}: {
  children: React.ReactNode;
  userLabel: string;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-brand-dark">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-black/5 bg-brand-dark p-6 text-white lg:flex">
        <Link href="/admin/dashboard" aria-label="Painel JMartins">
          <Image
            src="/brand/logo-full.png"
            alt="JMartins Móveis"
            width={827}
            height={333}
            className="h-14 w-auto brightness-0 invert"
            priority
          />
        </Link>

        <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-white/35">
          Administração
        </p>
        <nav className="mt-4 space-y-2" aria-label="Administração">
          {navigation.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition",
                  active
                    ? "bg-brand-red text-white"
                    : "text-white/65 hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-white/10 pt-5">
          <p className="truncate text-sm font-semibold text-white/75">{userLabel}</p>
          <div className="mt-4 flex items-center justify-between gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 text-sm text-white/55 hover:text-white"
            >
              Ver site <ExternalLink className="h-4 w-4" />
            </Link>
            <form action={signOutAdmin}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 text-sm text-white/55 hover:text-white"
              >
                <LogOut className="h-4 w-4" /> Sair
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-black/5 bg-white/90 px-5 py-4 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-4">
            <Link href="/admin/dashboard" className="font-heading text-lg font-bold">
              JMartins Admin
            </Link>
            <form action={signOutAdmin}>
              <button type="submit" className="rounded-xl border border-black/10 p-2.5" aria-label="Sair">
                <LogOut className="h-5 w-5" />
              </button>
            </form>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto" aria-label="Administração mobile">
            {navigation.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "whitespace-nowrap rounded-xl px-4 py-2 text-sm font-bold",
                    active ? "bg-brand-red text-white" : "bg-brand-light text-brand-dark/70",
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </header>
        {children}
      </div>
    </div>
  );
}
