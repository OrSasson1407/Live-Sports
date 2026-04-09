import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Heart, Activity, Calendar, User as UserIcon } from 'lucide-react';

export default function PlayerView() {
  const { playerId } = useParams();
  const navigate = useNavigate();

  // Enhanced mock data
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
    stats: {
      appearances: 15,
      goals: 12,
      assists: 8,
      rating: 8.9,
      minutes: 1250,
      shots: 45,
      passes: 890,
    },
    bio: 'Seven-time Ballon d\'Or winner. Considered one of the greatest footballers of all time.',
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-5">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
        {/* Hero section */}
        <div className="relative bg-gradient-to-r from-primary/10 to-transparent p-6 pb-8">
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <div className="w-28 h-28 rounded-full bg-secondary flex items-center justify-center text-4xl font-bold border-4 border-primary/20 shadow-lg">
              {player.name.charAt(0)}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl md:text-3xl font-bold">{player.name}</h1>
              <p className="text-muted-foreground mt-1">{player.position} • {player.team}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                <span className="text-xs bg-secondary px-2 py-1 rounded-full">#{player.number}</span>
                <span className="text-xs bg-secondary px-2 py-1 rounded-full">{player.nationality}</span>
                <span className="text-xs bg-secondary px-2 py-1 rounded-full">{player.age} years</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="p-6 pt-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Season Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Appearances" value={player.stats.appearances} icon={Calendar} />
            <StatCard label="Goals" value={player.stats.goals} icon={Trophy} color="text-green-500" />
            <StatCard label="Assists" value={player.stats.assists} icon={Heart} color="text-blue-500" />
            <StatCard label="Rating" value={player.stats.rating} icon={Activity} color="text-yellow-500" />
          </div>
        </div>

        {/* Detailed stats */}
        <div className="p-6 pt-0 border-t border-border mt-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Detailed</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <DetailRow label="Minutes played" value={player.stats.minutes} />
            <DetailRow label="Shots" value={player.stats.shots} />
            <DetailRow label="Passes completed" value={player.stats.passes} />
            <DetailRow label="Height" value={player.height} />
            <DetailRow label="Weight" value={player.weight} />
          </div>
        </div>

        {/* Bio */}
        <div className="p-6 pt-0 border-t border-border">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">About</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{player.bio}</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color = 'text-foreground' }: { label: string; value: string | number; icon: any; color?: string }) {
  return (
    <div className="bg-secondary/30 rounded-xl p-3 text-center hover:bg-secondary/50 transition-colors">
      <Icon size={20} className={`mx-auto mb-2 ${color} opacity-80`} />
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-border/50">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}