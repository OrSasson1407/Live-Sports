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
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-muted-foreground font-medium">{label}</span>
        <span className="font-mono text-foreground font-bold">
          {home} – {away}
        </span>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden bg-white/10 shadow-inner">
        <div
          className="bg-gradient-to-r from-primary to-accent transition-all duration-500 group-hover:brightness-110"
          style={{ width: `${homePercent}%` }}
        />
        <div
          className="bg-white/20 transition-all duration-500"
          style={{ width: `${100 - homePercent}%` }}
        />
      </div>
    </div>
  );
}