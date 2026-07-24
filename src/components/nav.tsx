import Link from "next/link";
import { Logo } from "./logo";

const NAV_LINKS = [
  { label: "Product", href: "#" },
  { label: "Intelligence", href: "#", active: true },
  { label: "Pricing", href: "#" },
  { label: "Docs", href: "#" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-foreground/9 border-foreground/9 bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-content items-center justify-between px-24 py-3.75">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo />
            <span className="text-base font-normal tracking-[-0.32px] text-foreground">Xai</span>
          </Link>
          <nav className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`rounded-control px-3 py-1.5 text-[13.5px] transition-colors ${
                  link.active
                    ? "bg-foreground/6 text-accent rounded-md hover:bg-foreground/9 hover:text-foreground"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="#"
            className="rounded-control border border-muted hover:border-foreground px-4.25 py-2 text-[13.5px] text-muted transition-colors hover:text-foreground rounded-md"
          >
            Log in
          </Link>
          <Link
            href="#"
            className="rounded-control bg-accent px-4 py-1.75 text-[13.5px] font-medium text-ink transition-opacity rounded-md hover:opacity-90"
          >
            Get access
          </Link>
        </div>
      </div>
    </header>
  );
}
