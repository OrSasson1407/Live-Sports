import { Link } from 'react-router-dom';

interface Event {
  id: string | number;
  minute: string;
  type: string;
  player: string;
  playerId?: string;
  team: string;
}

/* Inline SVG icons — no extra deps, pixel-precise like Sofascore */
const GoalIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5 7l1.5 1.5L9.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const YellowCardIcon = () => (
  <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
    <rect x="1" y="1" width="8" height="12" rx="1.5" fill="#fcca22" />
  </svg>
);

const RedCardIcon = () => (
  <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
    <rect x="1" y="1" width="8" height="12" rx="1.5" fill="#e03434" />
  </svg>
);

const SubIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 2v4l2-2" stroke="#3b82f6" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 12V8l-2 2" stroke="#e03434" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const eventConfig: Record<string, {
  icon: React.ReactNode;
  label: string;
  color: string;
}> = {
  GOAL:         { icon: <GoalIcon />,       label: 'Goal',         color: '#4ade80' },
  YELLOW_CARD:  { icon: <YellowCardIcon />, label: 'Yellow card',  color: '#fcca22' },
  RED_CARD:     { icon: <RedCardIcon />,    label: 'Red card',     color: '#e03434' },
  SUBSTITUTION: { icon: <SubIcon />,        label: 'Substitution', color: '#3b82f6' },
};

export function EventTimeline({ events }: { events: Event[] }) {
  if (!events.length) {
    return (
      <div
        className="text-center py-10 text-sm"
        style={{ color: 'hsl(var(--muted-foreground))' }}
      >
        No events yet
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {events.map((event, idx) => {
        const config = eventConfig[event.type] ?? {
          icon: <span style={{ fontSize: '12px' }}>•</span>,
          label: event.type.replace('_', ' '),
          color: 'hsl(var(--muted-foreground))',
        };

        return (
          <div
            key={event.id}
            className="flex items-center gap-3 py-2.5 animate-fade-in"
            style={{
              animationDelay: `${idx * 0.03}s`,
              borderBottom: idx < events.length - 1 ? '1px solid hsl(var(--border))' : 'none',
            }}
          >
            {/* Minute */}
            <span
              className="font-mono text-xs font-bold tabular-nums shrink-0 text-right"
              style={{ width: '28px', color: 'hsl(var(--muted-foreground))' }}
            >
              {event.minute}
            </span>

            {/* Icon */}
            <span className="shrink-0" style={{ color: config.color, display: 'flex', alignItems: 'center' }}>
              {config.icon}
            </span>

            {/* Player + team */}
            <div className="flex-1 min-w-0">
              {event.playerId ? (
                <Link
                  to={`/player/${event.playerId}`}
                  className="text-sm font-medium hover:underline"
                  style={{ color: 'hsl(var(--foreground))' }}
                >
                  {event.player}
                </Link>
              ) : (
                <span className="text-sm font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                  {event.player}
                </span>
              )}
              <span
                className="text-xs ml-2"
                style={{ color: 'hsl(var(--muted-foreground))' }}
              >
                {event.team}
              </span>
            </div>

            {/* Event type label */}
            <span
              className="text-xs shrink-0 hidden sm:block"
              style={{ color: config.color, fontWeight: 500 }}
            >
              {config.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
