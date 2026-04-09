import { Trophy, Calendar, MapPin } from 'lucide-react';

const competitions = [
  { id: 1, name: 'UEFA Champions League', sport: 'Football', country: 'Europe', teams: 32, matches: 125 },
  { id: 2, name: 'English Premier League', sport: 'Football', country: 'England', teams: 20, matches: 380 },
  { id: 3, name: 'NBA', sport: 'Basketball', country: 'USA', teams: 30, matches: 1230 },
  { id: 4, name: 'La Liga', sport: 'Football', country: 'Spain', teams: 20, matches: 380 },
];

export default function Competitions() {
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Competitions</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {competitions.map((comp) => (
          <div key={comp.id} className="bg-card rounded-xl border border-border p-4 hover:border-primary/30 transition-all cursor-pointer group">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Trophy size={20} className="text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold group-hover:text-primary transition-colors">{comp.name}</h3>
                <p className="text-sm text-muted-foreground">{comp.sport}</p>
                <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin size={12} /> {comp.country}</span>
                  <span className="flex items-center gap-1"><Calendar size={12} /> {comp.teams} teams</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}