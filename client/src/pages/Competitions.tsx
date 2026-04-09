import { ChevronRight } from 'lucide-react';

const competitions = [
  {
    id: 1,
    name: 'UEFA Champions League',
    country: 'Europe',
    sport: 'Football',
    teams: 32,
    season: '2024/25',
    initials: 'UCL',
    color: '#1a56db',
  },
  {
    id: 2,
    name: 'Premier League',
    country: 'England',
    sport: 'Football',
    teams: 20,
    season: '2024/25',
    initials: 'PL',
    color: '#38003c',
  },
  {
    id: 3,
    name: 'NBA',
    country: 'USA',
    sport: 'Basketball',
    teams: 30,
    season: '2024/25',
    initials: 'NBA',
    color: '#c9243f',
  },
  {
    id: 4,
    name: 'LaLiga',
    country: 'Spain',
    sport: 'Football',
    teams: 20,
    season: '2024/25',
    initials: 'LL',
    color: '#ee8707',
  },
  {
    id: 5,
    name: 'Bundesliga',
    country: 'Germany',
    sport: 'Football',
    teams: 18,
    season: '2024/25',
    initials: 'BL',
    color: '#d20515',
  },
  {
    id: 6,
    name: 'Serie A',
    country: 'Italy',
    sport: 'Football',
    teams: 20,
    season: '2024/25',
    initials: 'SA',
    color: '#024494',
  },
];

/* Group by sport */
const grouped = competitions.reduce((acc, comp) => {
  if (!acc[comp.sport]) acc[comp.sport] = [];
  acc[comp.sport].push(comp);
  return acc;
}, {} as Record<string, typeof competitions>);

export default function Competitions() {
  return (
    <div>
      {Object.entries(grouped).map(([sport, comps]) => (
        <div key={sport} className="sf-card overflow-hidden mb-3">

          {/* Sport group header */}
          <div
            className="comp-header px-3 flex items-center"
            style={{ height: '36px' }}
          >
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'hsl(var(--muted-foreground))', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {sport}
            </span>
          </div>

          {/* Competition rows */}
          {comps.map((comp, idx) => (
            <div
              key={comp.id}
              className="flex items-center gap-3 px-3 py-3 cursor-pointer transition-colors"
              style={{
                borderBottom: idx < comps.length - 1 ? '1px solid hsl(var(--border))' : 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'hsl(var(--card-hover))')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              {/* League badge */}
              <div
                className="shrink-0 rounded flex items-center justify-center"
                style={{
                  width: '36px',
                  height: '36px',
                  background: `${comp.color}22`,
                  border: `1px solid ${comp.color}40`,
                }}
              >
                <span style={{ fontSize: '10px', fontWeight: 800, color: comp.color, letterSpacing: '0.02em' }}>
                  {comp.initials}
                </span>
              </div>

              {/* Name + meta */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-semibold truncate"
                  style={{ color: 'hsl(var(--foreground))', lineHeight: 1.3 }}
                >
                  {comp.name}
                </p>
                <p style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', marginTop: '1px' }}>
                  {comp.country} · {comp.teams} teams · {comp.season}
                </p>
              </div>

              {/* Arrow */}
              <ChevronRight size={15} style={{ color: 'hsl(var(--surface-3))', flexShrink: 0 }} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
