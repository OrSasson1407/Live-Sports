import { Trophy, MapPin, Calendar, Sparkles } from 'lucide-react';

const competitions = [
  { id: 1, name: 'UEFA Champions League', country: 'Europe', teams: 32, matches: 125, color: 'from-blue-600 to-purple-600' },
  { id: 2, name: 'Premier League', country: 'England', teams: 20, matches: 380, color: 'from-red-600 to-orange-600' },
  { id: 3, name: 'NBA', country: 'USA', teams: 30, matches: 1230, color: 'from-orange-500 to-yellow-600' },
  { id: 4, name: 'LaLiga', country: 'Spain', teams: 20, matches: 380, color: 'from-yellow-600 to-red-600' },
];

export default function Competitions() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-black bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">All Competitions</h2>
      <div className="grid gap-4">
        {competitions.map((comp) => (
          <div
            key={comp.id}
            className="group flex items-center gap-4 p-4 glass-card rounded-xl hover:border-primary/50 transition-all cursor-pointer shadow-lg hover:shadow-2xl"
          >
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${comp.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition`}>
              <Trophy size={22} className="text-white drop-shadow-md" />
            </div>
            <div className="flex-1">
              <h3 className="font-black group-hover:text-primary transition">{comp.name}</h3>
              <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                <span className="flex items-center gap-1"><MapPin size={12} /> {comp.country}</span>
                <span className="flex items-center gap-1"><Calendar size={12} /> {comp.teams} teams</span>
                <span className="flex items-center gap-1"><Sparkles size={12} /> {comp.matches} matches</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}