import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Trophy, Star, User, Menu, X, Zap } from 'lucide-react';
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
    <div className="min-h-screen" style={{ background: 'hsl(var(--background))' }}>
      <header className="sticky top-0 z-50 header-blur">
        <div className="max-w-5xl mx-auto px-4 sm:px-5">
          {/* ── Single row: logo + search + nav/hamburger ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', height: '52px' }}>

            {/* Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0, textDecoration: 'none' }}>
              <div className="logo-mark">
                <Zap size={14} color="white" strokeWidth={2.5} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                <span style={{
                  fontWeight: 800, fontSize: '14px', letterSpacing: '-0.04em',
                  color: 'hsl(var(--foreground))',
                }}>
                  SPORT<span style={{ color: 'hsl(var(--primary))' }}>SCORE</span>
                </span>
                <span style={{
                  fontSize: '9px', fontWeight: 600, letterSpacing: '0.12em',
                  color: 'hsl(var(--muted))', textTransform: 'uppercase', marginTop: '2px',
                }}>Live</span>
              </div>
            </Link>

            {/* Search — desktop only, takes remaining space */}
            <div style={{ flex: 1, display: 'none' }} className="md-search">
              <SearchBar />
            </div>
            <style>{`@media(min-width:768px){.md-search{display:block!important}}`}</style>

            {/* Desktop nav — hidden on mobile */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '2px', marginLeft: 'auto', flexShrink: 0 }} className="desktop-nav">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path} className={`nav-item ${isActive ? 'active' : ''}`}>
                    <item.icon size={14} strokeWidth={isActive ? 2.5 : 2} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <style>{`@media(max-width:767px){.desktop-nav{display:none!important}}`}</style>

            {/* Mobile hamburger — hidden on desktop */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-hamburger"
              style={{
                marginLeft: 'auto', padding: '7px', borderRadius: '8px', cursor: 'pointer',
                color: 'hsl(var(--muted))', background: mobileMenuOpen ? 'hsl(var(--surface-1))' : 'transparent',
                border: 'none', display: 'none', flexShrink: 0,
              }}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <style>{`@media(max-width:767px){.mobile-hamburger{display:flex!important;align-items:center}}`}</style>
          </div>
        </div>

        {/* ── Mobile dropdown — only visible on mobile when open ── */}
        {mobileMenuOpen && (
          <div
            className="animate-fade-in mobile-menu"
            style={{ borderTop: '1px solid hsl(var(--border))', background: 'hsl(var(--background))' }}
          >
            <div style={{ padding: '12px 16px', borderBottom: '1px solid hsl(var(--border-subtle))' }}>
              <SearchBar />
            </div>
            <nav style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    style={{ padding: '10px 12px', borderRadius: '8px' }}
                  >
                    <item.icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-5 py-5">
        {children}
      </main>
    </div>
  );
}
