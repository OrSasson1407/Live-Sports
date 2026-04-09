import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Trophy, User, Menu, X, Star, Flame } from 'lucide-react';
import SearchBar from './SearchBar';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Matches', icon: Home },
    { path: '/competitions', label: 'Competitions', icon: Trophy },
    { path: '/favourites', label: 'Favourites', icon: Star },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-white/10 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="flex items-center gap-2 shrink-0 group">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition">
                <Flame size={16} className="text-white" />
              </div>
              <span className="font-black text-lg bg-gradient-to-r from-white to-primary bg-clip-text text-transparent hidden sm:inline">
                SportScore
              </span>
            </Link>

            <div className="hidden md:flex flex-1 justify-center px-6">
              <SearchBar />
            </div>

            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                      isActive
                        ? 'bg-primary/20 text-primary shadow-md border border-primary/30'
                        : 'text-muted-foreground hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <item.icon size={16} />
                      {item.label}
                    </div>
                  </Link>
                );
              })}
            </nav>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-white hover:bg-white/10 rounded-lg transition"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-card/90 backdrop-blur-md p-3 animate-fade-in">
            <div className="mb-4"><SearchBar /></div>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold ${
                  location.pathname === item.path ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-white hover:bg-white/10'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">{children}</main>
    </div>
  );
}