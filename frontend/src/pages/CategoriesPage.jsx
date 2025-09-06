import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import categoryApi from '../services/categoryApi';

const CategoriesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(()=> { if (user && user.role !== 'admin') navigate('/dashboard'); }, [user, navigate]);

  useEffect(() => {
    let active = true;
    setLoading(true); setError(null);
    categoryApi.list()
      .then(data => { if (active) setCats(data); })
      .catch(err => { if (active) setError(err.response?.data?.message || err.message); })
      .finally(()=> { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    let list = cats;
    if (!query) return list;
    const q = query.toLowerCase();
    return list.filter(c => [c.name, c.slug, c.description].some(v => v && v.toLowerCase().includes(q)));
  }, [cats, query]);

  const handleDelete = async (cat) => {
    if (!window.confirm(`Delete category "${cat.name}"?`)) return;
    try {
      await categoryApi.remove(cat._id);
      setCats(cs => cs.filter(c => c._id !== cat._id));
    } catch (e) {
      alert(e.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">Categories</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage subscription categories.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input value={query} onChange={e=> setQuery(e.target.value)} placeholder="Search..." className="w-56 rounded-lg border border-gray-300 bg-white/80 px-3 py-2 text-sm shadow-sm backdrop-blur focus:border-gray-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-100" />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">⌕</span>
          </div>
          <button onClick={()=> navigate('/categories/new')} className="rounded-lg bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-pink-600 px-4 py-2 text-sm font-medium text-white shadow hover:brightness-110">New Category</button>
        </div>
      </div>
      {error && <div className="mb-6 rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-600 dark:border-red-600/40 dark:bg-red-900/30 dark:text-red-300">{error}</div>}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading && <p className="text-sm text-gray-500 dark:text-gray-400">Loading categories...</p>}
        {!loading && filtered.map(c => (
          <div key={c._id} className="group relative overflow-hidden rounded-2xl border border-gray-200/70 bg-white/70 p-5 backdrop-blur transition hover:shadow-lg dark:border-gray-800/70 dark:bg-gray-900/60">
            <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition" style={{background:`linear-gradient(140deg,${c.color || '#6366f1'}30,transparent)`}} />
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold text-white shadow" style={{background:c.color || '#6366f1'}}>{c.name?.charAt(0)}</span>
                <div>
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{c.name}</h2>
                  <p className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">{c.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={()=> navigate(`/categories/${c._id}/edit`)} className="rounded-md border border-indigo-300 bg-indigo-50 px-2 py-1 text-[11px] font-medium text-indigo-700 hover:bg-indigo-100 dark:border-indigo-600/60 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50">Edit</button>
                {c.user ? (
                  <button onClick={()=> handleDelete(c)} className="rounded-md border border-red-300 bg-red-50 px-2 py-1 text-[11px] font-medium text-red-700 hover:bg-red-100 dark:border-red-600/60 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50" title="Delete category">Del</button>
                ) : (
                  <button disabled className="cursor-not-allowed rounded-md border border-gray-300 bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-400 dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-600" title="Global category cannot be deleted">Del</button>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3 min-h-[42px]">{c.description}</p>
          </div>
        ))}
        {!loading && !error && filtered.length===0 && <p className="text-sm text-gray-500 dark:text-gray-400">No categories.</p>}
      </div>
    </div>
  );
};

export default CategoriesPage;
