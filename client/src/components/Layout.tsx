import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Trophy, Star, User, Menu, X } from 'lucide-react';
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
      {/* ── Top header ─────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: 'hsl(var(--card))',
          borderColor: 'hsl(var(--border))',
        }}
      >
        <div className="max-w-5xl mx-auto px-3 sm:px-4">
          <div className="flex items-center gap-3 h-12">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div
                className="w-7 h-7 rounded flex items-center justify-center"
                style={{ background: 'hsl(var(--primary))' }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6" stroke="white" strokeWidth="1.5" />
                  <path d="M4 7h6M7 4v6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <span
                className="font-black text-base tracking-tight hidden sm:inline"
                style={{ color: 'hsl(var(--foreground))' }}
              >
                SportScore
              </span>
            </Link>

            {/* Search — fills remaining space */}
            <div className="flex-1 hidden md:block">
              <SearchBar />
            </div>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1 shrink-0">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors"
                    style={{
                      color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                      background: isActive ? 'rgba(244,115,28,0.1)' : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.color = 'hsl(var(--foreground))';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.color = 'hsl(var(--muted-foreground))';
                    }}
                  >
                    <item.icon size={15} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile: hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden ml-auto p-1.5 rounded transition-colors"
              style={{ color: 'hsl(var(--muted-foreground))' }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* ── Mobile dropdown ───────────────────────────────── */}
        {mobileMenuOpen && (
          <div
            className="md:hidden border-t animate-fade-in"
            style={{
              background: 'hsl(var(--card))',
              borderColor: 'hsl(var(--border))',
            }}
          >
            <div className="px-3 py-3 border-b" style={{ borderColor: 'hsl(var(--border))' }}>
              <SearchBar />
            </div>
            <nav className="px-2 py-2 flex flex-col gap-0.5">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium"
                    style={{
                      color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                      background: isActive ? 'rgba(244,115,28,0.08)' : 'transparent',
                    }}
                  >
                    <item.icon size={17} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* ── Page content ───────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-3 sm:px-4 py-4">
        {children}
      </main>
    </div>
  );
}
