interface StatBarProps {
  label: string;
  home: number;
  away: number;
}

export function StatBar({ label, home, away }: StatBarProps) {
  const total = home + away || 1;
  const homePercent = (home / total) * 100;

  return (
    <div className="group">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono text-foreground font-medium">
          {home} - {away}
        </span>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden bg-secondary">
        <div
          className="bg-primary transition-all duration-500 group-hover:opacity-80"
          style={{ width: `${homePercent}%` }}
        />
        <div
          className="bg-muted-foreground/50 transition-all duration-500"
          style={{ width: `${100 - homePercent}%` }}
        />
      </div>
    </div>
  );
}