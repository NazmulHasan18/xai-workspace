import { Logo } from "./logo";

const LINKS = ["Privacy", "Terms", "Security", "Status"];

export function Footer() {
  return (
    <footer className="border-t border-foreground/9 px-24 py-12">
      <div className="mx-auto flex max-w-content items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Logo size={18} />
          <span className="text-[13px] text-muted">Xai Intelligence Workspace</span>
        </div>
        <div className="flex items-center gap-6">
          {LINKS.map((link) => (
            <a
              key={link}
              href="#"
              className="text-[12.5px] text-muted transition-colors hover:text-foreground"
            >
              {link}
            </a>
          ))}
        </div>
        <span className="font-mono text-[11px] text-muted">© 2026 Xai, Inc.</span>
      </div>
    </footer>
  );
}
