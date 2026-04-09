import { Link } from 'react-router-dom';

interface PlayerBadgeProps {
  id: string;
  number: number;
  name: string;
  position: string;
  isCaptain?: boolean;
}

const positionColor: Record<string, string> = {
  GK:  '#fcca22',
  DEF: '#3b82f6',
  MID: '#4ade80',
  FWD: '#e03434',
  F:   '#e03434',
  M:   '#4ade80',
  D:   '#3b82f6',
  G:   '#fcca22',
};

export function PlayerBadge({ id, number, name, position, isCaptain }: PlayerBadgeProps) {
  const posColor = positionColor[position.toUpperCase()] ?? 'hsl(var(--muted-foreground))';

  return (
    <Link
      to={`/player/${id}`}
      className="flex items-center gap-2.5 px-2 py-1.5 rounded transition-colors"
      style={{ textDecoration: 'none' }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'hsl(var(--card-hover))')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      {/* Jersey number */}
      <span
        className="font-mono text-xs font-bold tabular-nums shrink-0 text-center"
        style={{ width: '18px', color: 'hsl(var(--muted-foreground))' }}
      >
        {number}
      </span>

      {/* Name */}
      <span
        className="text-sm flex-1 truncate"
        style={{ color: 'hsl(var(--foreground))', fontWeight: 400 }}
      >
        {name}
        {isCaptain && (
          <span
            className="ml-1.5 text-xs font-bold"
            style={{ color: '#fcca22' }}
            title="Captain"
          >
            (C)
          </span>
        )}
      </span>

      {/* Position badge */}
      <span
        className="text-xs font-bold shrink-0"
        style={{
          color: posColor,
          background: `${posColor}18`,
          padding: '1px 6px',
          borderRadius: '3px',
          fontFamily: 'monospace',
          letterSpacing: '0.03em',
        }}
      >
        {position}
      </span>
    </Link>
  );
}
