import { Link } from 'react-router-dom';

interface Event {
  id: string | number;
  minute: string;
  type: string;
  player: string;
  playerId?: string;
  team: string;
}

const eventColors: Record<string, string> = {
  GOAL: 'text-green-500',
  YELLOW_CARD: 'text-yellow-500',
  RED_CARD: 'text-red-500',
  SUBSTITUTION: 'text-blue-500',
};

const eventIcons: Record<string, string> = {
  GOAL: '⚽',
  YELLOW_CARD: '🟨',
  RED_CARD: '🟥',
  SUBSTITUTION: '🔄',
};

export function EventTimeline({ events }: { events: Event[] }) {
  if (!events.length) {
    return <div className="text-center text-muted-foreground py-8">No events yet</div>;
  }

  return (
    <div className="relative space-y-4 pl-4 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border">
      {events.map((event, idx) => (
        <div key={event.id} className="relative group animate-fade-in" style={{ animationDelay: `${idx * 0.05}s` }}>
          <div className="absolute -left-[17px] top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-card group-hover:scale-150 transition-transform" />
          <div className="bg-secondary/30 rounded-lg p-3 hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{eventIcons[event.type] || '📋'}</span>
              <span className="font-mono text-sm font-bold text-primary">{event.minute}</span>
              <span className={`text-xs font-semibold ${eventColors[event.type] || 'text-muted-foreground'}`}>
                {event.type}
              </span>
            </div>
            <div className="text-sm">
              {event.playerId ? (
                <Link to={`/player/${event.playerId}`} className="font-medium hover:text-primary transition-colors">
                  {event.player}
                </Link>
              ) : (
                <span className="font-medium">{event.player}</span>
              )}
              <span className="text-muted-foreground mx-2">•</span>
              <span className="text-muted-foreground">{event.team}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}