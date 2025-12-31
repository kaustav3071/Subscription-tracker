import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 border-t border-gray-200/70 bg-gradient-to-b from-white/60 via-white to-white/70 backdrop-blur-sm dark:from-gray-950/40 dark:via-gray-950/60 dark:to-gray-900/70 dark:border-gray-800/70">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">SubTrack</h3>
          <p className="mt-3 text-xs leading-relaxed text-gray-600 dark:text-gray-400">Clarity for every recurring cost. Track, predict, and optimize your subscription stack.</p>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Product</h4>
          <ul className="mt-3 space-y-2 text-xs text-gray-600 dark:text-gray-400">
            <li><Link className="hover:text-gray-900 dark:hover:text-gray-200" to="/features">Features</Link></li>
            <li><Link className="hover:text-gray-900 dark:hover:text-gray-200" to="/changelog">Changelog</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Resources</h4>
          <ul className="mt-3 space-y-2 text-xs text-gray-600 dark:text-gray-400">
            <li><Link className="hover:text-gray-900 dark:hover:text-gray-200" to="/docs">Docs</Link></li>
            <li><Link className="hover:text-gray-900 dark:hover:text-gray-200" to="/support">Support</Link></li>
            <li><a className="hover:text-gray-900 dark:hover:text-gray-200" href="https://github.com/kaustav3071" target="_blank" rel="noopener noreferrer">GitHub</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Legal</h4>
          <ul className="mt-3 space-y-2 text-xs text-gray-600 dark:text-gray-400">
            <li><Link className="hover:text-gray-900 dark:hover:text-gray-200" to="/privacy">Privacy</Link></li>
            <li><Link className="hover:text-gray-900 dark:hover:text-gray-200" to="/terms">Terms</Link></li>
            <li><Link className="hover:text-gray-900 dark:hover:text-gray-200" to="/security">Security</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-200/60 px-6 py-6 dark:border-gray-800/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-center sm:flex-row">
          <p className="text-xs text-gray-500 dark:text-gray-400">© {year} SubTrack. All rights reserved.</p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500">Built for visibility and efficiency.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
