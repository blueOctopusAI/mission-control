interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header
      className="px-8 py-6"
      style={{ borderBottom: "1px solid var(--border-subtle)" }}
    >
      <h1 className="font-display text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          {subtitle}
        </p>
      )}
    </header>
  );
}
