import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');
  return (
    <header className="sticky top-0 z-30 w-full border-b border-gray-200/70 bg-gradient-to-b from-white/95 via-white/90 to-white/80 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:from-gray-950/90 dark:via-gray-900/85 dark:to-gray-900/70 dark:border-gray-800/70">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5">
        <Link to="/" className="flex items-center gap-2 text-xl font-semibold tracking-tight">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900 text-white font-bold shadow-sm ring-1 ring-gray-900/10 dark:bg-brand-600 dark:ring-brand-500/40">S</span>
          <span className="text-gray-900 dark:text-gray-100 tracking-tight">SubTrack</span>
        </Link>
        <div className="flex items-center gap-6">
          <ul className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
            {[
              ["/","Home"],
              ...(user ? [[user.role === 'admin' ? '/admindashboard' : '/dashboard', user.role === 'admin' ? 'Admin' : 'Dashboard']] : []),
              ...(user ? [["/subscriptions","Subscriptions"]] : []),
              ...(user && user.role !== 'admin' ? [["/support","Support"]] : []),
              ...(user && user.role==='admin' ? [["/admin/support","Admin Inbox"],["/categories","Categories"]] : []),
              ["/login","Login"],
              ["/register","Register"],
            ]
            .filter(r=> r[0]!=="/login"||!user)
            .filter(r=> r[0]!=="/register"||!user)
            .map(([to,label]) => (
              <li key={to}>
                <NavLink to={to} end={to==='/' } className={({isActive})=> {
                  const base='relative rounded-full px-4 py-2 transition';
                  return isActive
                    ? base+' bg-gray-900 text-white shadow-sm dark:bg-gray-100 dark:text-gray-900'
                    : base+' text-gray-600 hover:text-gray-900 hover:bg-gray-100/70 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800/60';
                }}>{label}</NavLink>
              </li>
            ))}
            {user && <li><button onClick={logout} className="rounded-full px-4 py-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">Logout</button></li>}
            <li>
              <button onClick={toggleTheme} aria-label="Toggle theme" className="group relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white/70 text-gray-600 shadow-sm transition hover:border-gray-400 hover:bg-white dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-300 dark:hover:bg-gray-700">
                {theme === 'dark' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3a1 1 0 0 1 1 1 7 7 0 0 0 7 7 1 1 0 0 1 0 2 7 7 0 0 0-7 7 1 1 0 0 1-2 0 7 7 0 0 0-7-7 1 1 0 0 1 0-2 7 7 0 0 0 7-7 1 1 0 0 1 1-1Z"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.07 6.07-1.42-1.42M8.35 9.35 6.93 7.93m0 8.14 1.42-1.42m8.14-8.14-1.42 1.42"/></svg>
                )}
              </button>
            </li>
          </ul>
          {user ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/profile')}
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white text-sm font-semibold ring-2 ring-gray-900/5 dark:from-brand-600 dark:via-brand-500 dark:to-brand-500 dark:ring-brand-400/30 hover:scale-[1.03] transition"
                aria-label="View profile"
              >
                {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
              </button>
              <span className="hidden sm:inline text-sm text-gray-500 dark:text-gray-400 max-w-[160px] truncate">{user.email}</span>
              <button onClick={logout} className="md:hidden rounded-lg border px-3 py-1.5 text-sm font-medium border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">Logout</button>
              <button onClick={toggleTheme} className="md:hidden rounded-lg border px-3 py-1.5 text-sm font-medium border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">{theme==='dark'?'Light':'Dark'}</button>
            </div>
          ) : (
            <div className="flex md:hidden gap-3">
              <Link to="/login" className="rounded-lg border px-3 py-1.5 text-sm font-medium border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">Login</Link>
              <Link to="/register" className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white shadow hover:bg-brand-500">Sign up</Link>
              <button onClick={toggleTheme} className="rounded-lg border px-3 py-1.5 text-sm font-medium border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">{theme==='dark'?'☀':'🌙'}</button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
