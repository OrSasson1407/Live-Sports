interface StatBarProps {
  label: string;
  home: number;
  away: number;
}

export function StatBar({ label, home, away }: StatBarProps) {
  const total = home + away || 1;
  const homePercent = Math.round((home / total) * 100);
  const awayPercent = 100 - homePercent;

  const isHomeWinning = home > away;
  const isAwayWinning = away > home;

  return (
    <div>
      {/* ── Values + label ──────────────────────────────── */}
      <div className="flex items-center justify-between mb-1.5" style={{ gap: '8px' }}>
        <span
          className="font-mono text-sm font-bold tabular-nums w-8 text-left"
          style={{ color: isHomeWinning ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}
        >
          {home}
        </span>
        <span
          className="text-xs text-center flex-1 truncate"
          style={{ color: 'hsl(var(--muted-foreground))', fontWeight: 500 }}
        >
          {label}
        </span>
        <span
          className="font-mono text-sm font-bold tabular-nums w-8 text-right"
          style={{ color: isAwayWinning ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}
        >
          {away}
        </span>
      </div>

      {/* ── Dual bar ────────────────────────────────────── */}
      <div className="flex h-1 rounded-full overflow-hidden gap-px" style={{ background: 'hsl(var(--surface-3))' }}>
        <div
          className="h-full transition-all duration-500 rounded-l-full"
          style={{
            width: `${homePercent}%`,
            background: isHomeWinning ? 'hsl(var(--primary))' : 'hsl(var(--surface-3))',
            opacity: isHomeWinning ? 1 : 0.5,
          }}
        />
        <div
          className="h-full transition-all duration-500 rounded-r-full"
          style={{
            width: `${awayPercent}%`,
            background: isAwayWinning ? 'hsl(var(--muted-foreground))' : 'hsl(var(--surface-3))',
            opacity: isAwayWinning ? 0.7 : 0.3,
          }}
        />
      </div>
    </div>
  );
}
