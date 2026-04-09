import { Link } from 'react-router-dom';
import { Goal, AlertCircle, Shield, RefreshCw } from 'lucide-react';

interface Event {
  id: string | number;
  minute: string;
  type: string;
  player: string;
  playerId?: string;
  team: string;
}

const eventConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  GOAL: { icon: <Goal size={14} />, color: 'text-green-500', bg: 'bg-green-500/10' },
  YELLOW_CARD: { icon: <AlertCircle size={14} />, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  RED_CARD: { icon: <Shield size={14} />, color: 'text-red-500', bg: 'bg-red-500/10' },
  SUBSTITUTION: { icon: <RefreshCw size={14} />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
};

export function EventTimeline({ events }: { events: Event[] }) {
  if (!events.length) {
    return <div className="text-center text-muted-foreground py-8 text-sm bg-white/5 rounded-xl">No events yet</div>;
  }

  return (
    <div className="relative space-y-3 pl-4 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1.5px] before:bg-gradient-to-b before:from-primary before:to-accent">
      {events.map((event, idx) => {
        const config = eventConfig[event.type] || { icon: <span>📋</span>, color: 'text-muted-foreground', bg: 'bg-white/5' };
        return (
          <div key={event.id} className="relative group animate-fade-in" style={{ animationDelay: `${idx * 0.03}s` }}>
            <div className="absolute -left-[17px] top-1.5 w-3 h-3 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-card shadow-lg group-hover:scale-150 transition-transform" />
            <div className={`${config.bg} rounded-xl p-3 hover:brightness-110 transition-all shadow-md`}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`${config.color} drop-shadow-sm`}>{config.icon}</span>
                <span className="font-mono text-xs font-bold text-primary">{event.minute}</span>
                <span className={`text-[11px] font-bold uppercase ${config.color}`}>
                  {event.type.replace('_', ' ')}
                </span>
              </div>
              <div className="text-sm">
                {event.playerId ? (
                  <Link to={`/player/${event.playerId}`} className="font-semibold hover:text-primary transition-colors">
                    {event.player}
                  </Link>
                ) : (
                  <span className="font-semibold">{event.player}</span>
                )}
                <span className="text-muted-foreground mx-1.5 text-xs">•</span>
                <span className="text-muted-foreground text-xs">{event.team}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}