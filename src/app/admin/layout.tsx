import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard, FileSearch } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { buttonVariants } from "@/src/components/ui";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Applications", href: "/admin/applications", icon: FileSearch },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-secondary/50">
      <header className="border-b border-border bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Image
              src="/favicon.png"
              alt="Docsimus logo"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
              priority
            />
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Docsimus Admin</p>
              <p className="text-lg font-semibold text-foreground">Physicians Portal</p>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "flex items-center gap-2")}
              >
                <item.icon className="h-4 w-4 text-primary" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {children}
      </main>
    </div>
  );
}
