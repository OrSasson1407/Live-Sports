import { Link } from 'react-router-dom';

interface PlayerBadgeProps {
  id: string;
  number: number;
  name: string;
  position: string;
  isCaptain?: boolean;
}

export function PlayerBadge({ id, number, name, position, isCaptain }: PlayerBadgeProps) {
  return (
    <Link
      to={`/player/${id}`}
      className="flex items-center justify-between p-2 rounded-md hover:bg-secondary/50 transition-colors group"
    >
      <div className="flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-secondary text-center text-xs font-bold leading-6 text-muted-foreground group-hover:text-primary">
          {number}
        </span>
        <span className="text-sm font-medium">
          {name} {isCaptain && <span className="text-xs text-muted-foreground">(C)</span>}
        </span>
      </div>
      <span className="text-xs text-muted-foreground uppercase">{position}</span>
    </Link>
  );
}