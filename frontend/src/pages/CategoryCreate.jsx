import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import categoryApi from '../services/categoryApi';

const CategoryCreate = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', slug: '', color: '#6366f1', icon: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(()=> { if (user && user.role !== 'admin') navigate('/dashboard'); }, [user, navigate]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };
  const submit = async e => {
    e.preventDefault(); setSubmitting(true); setError(null);
    try {
      await categoryApi.create(form);
      navigate('/categories');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally { setSubmitting(false); }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">New Category</h1>
        <button onClick={()=> navigate(-1)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">Back</button>
      </div>
      <form onSubmit={submit} className="space-y-8">
        {error && <div className="rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-600 dark:border-red-600/40 dark:bg-red-900/30 dark:text-red-300">{error}</div>}
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Name"><input name="name" value={form.name} onChange={handleChange} required className="input" /></Field>
            <Field label="Slug"><input name="slug" value={form.slug} onChange={handleChange} required className="input" /></Field>
          <Field label="Color"><input type="color" name="color" value={form.color} onChange={handleChange} className="h-10 w-full rounded-md border border-gray-300 bg-white/70 px-2 py-1 dark:border-gray-700 dark:bg-gray-800/70" /></Field>
          <Field label="Icon"><input name="icon" value={form.icon} onChange={handleChange} placeholder="mdi:television-classic" className="input" /></Field>
        </div>
        <Field label="Description"><textarea name="description" value={form.description} onChange={handleChange} rows={4} className="input" /></Field>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={()=> navigate('/categories')} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">Cancel</button>
          <button type="submit" disabled={submitting} className="rounded-lg bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-pink-600 px-6 py-2 text-sm font-semibold text-white shadow hover:brightness-110 disabled:opacity-60">{submitting ? 'Creating...' : 'Create'}</button>
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

export default CategoryCreate;
