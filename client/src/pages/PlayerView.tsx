import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PlayerView() {
  const { playerId } = useParams();
  const navigate = useNavigate();

  const player = {
    id: playerId,
    name: 'Lionel Messi',
    team: 'Inter Miami CF',
    position: 'Forward',
    number: 10,
    nationality: 'Argentina',
    age: 36,
    height: '170 cm',
    weight: '72 kg',
    foot: 'Left',
    stats: {
      appearances: 15,
      goals: 12,
      assists: 8,
      rating: 8.9,
      minutes: 1250,
      shots: 45,
      passes: 890,
      yellowCards: 1,
      redCards: 0,
    },
    bio: "Seven-time Ballon d'Or winner. Considered one of the greatest footballers of all time.",
  };

  const ratingColor = (r: number) =>
    r >= 8 ? '#4ade80' : r >= 6.5 ? '#fcca22' : '#e03434';

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }} className="animate-fade-in">

      {/* ── Back ─────────────────────────────────────────── */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 mb-4 transition-colors"
        style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'hsl(var(--foreground))')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'hsl(var(--muted-foreground))')}
      >
        <ArrowLeft size={15} /> Back
      </button>

      {/* ── Player hero card ─────────────────────────────── */}
      <div className="sf-card overflow-hidden mb-3">
        {/* Top band — team color strip */}
        <div style={{ height: '4px', background: 'hsl(var(--primary))' }} />

        <div className="flex items-center gap-4 px-4 py-4">
          {/* Avatar */}
          <div
            className="shrink-0 rounded-full flex items-center justify-center"
            style={{
              width: '64px',
              height: '64px',
              background: 'hsl(var(--surface-3))',
              fontSize: '24px',
              fontWeight: 900,
              color: 'hsl(var(--foreground))',
            }}
          >
            {player.name.charAt(0)}
          </div>

          {/* Name + meta */}
          <div className="flex-1 min-w-0">
            <h1
              className="font-bold truncate"
              style={{ fontSize: '20px', color: 'hsl(var(--foreground))', lineHeight: 1.2 }}
            >
              {player.name}
            </h1>
            <p style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))', marginTop: '2px' }}>
              {player.position} · {player.team}
            </p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {[`#${player.number}`, player.nationality, `${player.age} yrs`].map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: '11px',
                    fontWeight: 500,
                    color: 'hsl(var(--muted-foreground))',
                    background: 'hsl(var(--surface-2))',
                    border: '1px solid hsl(var(--border))',
                    padding: '2px 8px',
                    borderRadius: '4px',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Rating badge */}
          <div
            className="shrink-0 flex flex-col items-center justify-center rounded"
            style={{
              width: '52px',
              height: '52px',
              background: `${ratingColor(player.stats.rating)}18`,
              border: `1px solid ${ratingColor(player.stats.rating)}40`,
            }}
          >
            <span style={{ fontSize: '20px', fontWeight: 900, color: ratingColor(player.stats.rating), lineHeight: 1 }}>
              {player.stats.rating.toFixed(1)}
            </span>
            <span style={{ fontSize: '9px', fontWeight: 600, color: 'hsl(var(--muted-foreground))', letterSpacing: '0.04em', marginTop: '2px' }}>
              RATING
            </span>
          </div>
        </div>
      </div>

      {/* ── Season stats ─────────────────────────────────── */}
      <div className="sf-card mb-3 overflow-hidden">
        <SectionHeader title="Season statistics" />

        {/* Key stats grid */}
        <div
          className="grid grid-cols-4"
          style={{ borderBottom: '1px solid hsl(var(--border))' }}
        >
          {[
            { label: 'Goals',       value: player.stats.goals },
            { label: 'Assists',     value: player.stats.assists },
            { label: 'Appearances', value: player.stats.appearances },
            { label: 'Minutes',     value: player.stats.minutes },
          ].map(({ label, value }, i) => (
            <div
              key={label}
              className="flex flex-col items-center py-4 gap-1"
              style={{
                borderRight: i < 3 ? '1px solid hsl(var(--border))' : 'none',
              }}
            >
              <span style={{ fontSize: '22px', fontWeight: 800, color: 'hsl(var(--foreground))', lineHeight: 1 }}>
                {value}
              </span>
              <span style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', fontWeight: 500 }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Detailed stat rows */}
        <div className="px-4 py-2">
          {[
            { label: 'Shots',           value: player.stats.shots },
            { label: 'Passes completed', value: player.stats.passes },
            { label: 'Yellow cards',     value: player.stats.yellowCards },
            { label: 'Red cards',        value: player.stats.redCards },
          ].map(({ label, value }) => (
            <StatRow key={label} label={label} value={value} />
          ))}
        </div>
      </div>

      {/* ── Personal info ────────────────────────────────── */}
      <div className="sf-card mb-3 overflow-hidden">
        <SectionHeader title="Player info" />
        <div className="px-4 py-2">
          {[
            { label: 'Height',        value: player.height },
            { label: 'Weight',        value: player.weight },
            { label: 'Preferred foot', value: player.foot },
            { label: 'Nationality',   value: player.nationality },
          ].map(({ label, value }) => (
            <StatRow key={label} label={label} value={value} />
          ))}
        </div>
      </div>

      {/* ── Bio ──────────────────────────────────────────── */}
      <div className="sf-card overflow-hidden">
        <SectionHeader title="About" />
        <p className="px-4 py-3" style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))', lineHeight: 1.6 }}>
          {player.bio}
        </p>
      </div>
    </div>
  );
}

/* ── Shared sub-components ─────────────────────────────────── */

function SectionHeader({ title }: { title: string }) {
  return (
    <div
      className="px-4 py-2.5"
      style={{
        background: 'hsl(var(--surface-2))',
        borderBottom: '1px solid hsl(var(--border))',
      }}
    >
      <span style={{ fontSize: '12px', fontWeight: 600, color: 'hsl(var(--muted-foreground))', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {title}
      </span>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div
      className="flex items-center justify-between py-2.5"
      style={{ borderBottom: '1px solid hsl(var(--border))' }}
    >
      <span style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))' }}>{label}</span>
      <span style={{ fontSize: '13px', fontWeight: 600, color: 'hsl(var(--foreground))' }}>{value}</span>
    </div>
  );
}
