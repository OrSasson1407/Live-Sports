import { Link } from 'react-router-dom';
import { Crown } from 'lucide-react';

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
      className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-primary/10 transition-all group border border-transparent hover:border-primary/30"
    >
      <div className="flex items-center gap-3">
        <span className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 text-center text-xs font-black leading-7 text-white shadow-md group-hover:scale-110 transition">
          {number}
        </span>
        <span className="text-sm font-medium">
          {name} {isCaptain && <Crown size={12} className="inline text-yellow-500 ml-1" />}
        </span>
      </div>
      <span className="text-xs text-muted-foreground uppercase font-mono">{position}</span>
    </Link>
  );
}