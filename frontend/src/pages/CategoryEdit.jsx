import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import categoryApi from '../services/categoryApi';

const CategoryEdit = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(()=> { if (user && user.role !== 'admin') navigate('/dashboard'); }, [user, navigate]);
  useEffect(()=> {
    let active = true;
    setLoading(true); setError(null);
    categoryApi.list()
      .then(list => { if (!active) return; const found = list.find(c=> c._id === id); if (found) setForm(found); else setError('Category not found'); })
      .catch(err => { if (active) setError(err.response?.data?.message || err.message); })
      .finally(()=> { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  if (loading) return <div className="mx-auto max-w-3xl px-4 py-10 md:py-14"><p className="text-sm text-gray-500 dark:text-gray-400">Loading category…</p></div>;
  if (error) return <div className="mx-auto max-w-3xl px-4 py-10 md:py-14"><p className="text-sm text-red-600 dark:text-red-400">{error}</p></div>;
  if (!form) return null;

  const handleChange = e => { const { name, value } = e.target; setForm(f=> ({...f, [name]: value})); };
  const submit = async e => { e.preventDefault(); setSaving(true); setError(null); try { await categoryApi.update(id, form); navigate('/categories'); } catch (err) { setError(err.response?.data?.message || err.message); } finally { setSaving(false); } };
  const remove = async () => {
    if (!form.user) { alert('Global categories cannot be deleted.'); return; }
    if (!window.confirm(`Delete category "${form.name}"?`)) return;
    try { setDeleting(true); await categoryApi.remove(id); navigate('/categories'); } catch (err) { alert(err.response?.data?.message || 'Delete failed'); } finally { setDeleting(false); }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">Edit Category</h1>
        <button onClick={()=> navigate(-1)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">Back</button>
      </div>
      <form onSubmit={submit} className="space-y-8">
        {error && <div className="rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-600 dark:border-red-600/40 dark:bg-red-900/30 dark:text-red-300">{error}</div>}
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Name"><input name="name" value={form.name} onChange={handleChange} className="input" /></Field>
          <Field label="Slug"><input name="slug" value={form.slug} onChange={handleChange} className="input" /></Field>
          <Field label="Color"><input type="color" name="color" value={form.color || '#6366f1'} onChange={handleChange} className="h-10 w-full rounded-md border border-gray-300 bg-white/70 px-2 py-1 dark:border-gray-700 dark:bg-gray-800/70" /></Field>
          <Field label="Icon"><input name="icon" value={form.icon || ''} onChange={handleChange} className="input" /></Field>
        </div>
        <Field label="Description"><textarea name="description" value={form.description || ''} onChange={handleChange} rows={4} className="input" /></Field>
        <div className="flex justify-end gap-3">
          {form.user ? (
            <button type="button" disabled={deleting} onClick={remove} className="rounded-lg border border-red-300 bg-red-500/90 px-4 py-2 text-sm font-medium text-white shadow hover:bg-red-600 disabled:opacity-60 dark:border-red-700 dark:bg-red-700 dark:hover:bg-red-800" title="Delete this category">{deleting ? 'Deleting...' : 'Delete'}</button>
          ) : (
            <button type="button" disabled className="cursor-not-allowed rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-400 dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-500" title="Global default categories cannot be deleted">Delete</button>
          )}
          <button type="button" onClick={()=> navigate('/categories')} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">Cancel</button>
          <button type="submit" disabled={saving} className="rounded-lg bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-pink-600 px-6 py-2 text-sm font-semibold text-white shadow hover:brightness-110 disabled:opacity-60">{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </form>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400">{label}</label>
    {children}
  </div>
);

export default CategoryEdit;
