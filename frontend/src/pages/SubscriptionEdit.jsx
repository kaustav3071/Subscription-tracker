import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import subscriptionApi from '../services/subscriptionApi';

const SubscriptionEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true); setError(null);
    subscriptionApi.get(id)
      .then(data => { if (!active) return; setForm({ ...data, tags: (data.tags || []).join(', ')}); })
      .catch(err => { if (active) setError(err.response?.data?.message || err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  if (loading) return <div className="mx-auto max-w-3xl px-4 py-10 md:py-14"><p className="text-sm text-gray-500 dark:text-gray-400">Loading subscription…</p></div>;
  if (error) return <div className="mx-auto max-w-3xl px-4 py-10 md:py-14"><p className="text-sm text-red-600 dark:text-red-400">{error}</p></div>;
  if (!form) return null;

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };
  const submit = async e => {
    e.preventDefault(); setSaving(true); setError(null);
    const payload = { ...form };
    payload.amount = payload.amount ? Number(payload.amount) : undefined;
    if (payload.tags) payload.tags = payload.tags.split(',').map(t=> t.trim()).filter(Boolean);
    try {
      await subscriptionApi.update(id, payload);
      navigate('/subscriptions');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this subscription?')) return;
    try {
      setSaving(true);
      await subscriptionApi.remove(id);
      navigate('/subscriptions');
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    } finally { setSaving(false); }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">Edit Subscription</h1>
        <button onClick={()=> navigate(-1)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">Back</button>
      </div>
      <form onSubmit={submit} className="space-y-8">
        {error && <div className="rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-600 dark:border-red-600/40 dark:bg-red-900/30 dark:text-red-300">{error}</div>}
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Name"><input name="name" value={form.name || ''} onChange={handleChange} required className="input" /></Field>
          <Field label="Amount"><input name="amount" value={form.amount ?? ''} onChange={handleChange} type="number" step="0.01" required className="input" /></Field>
          <Field label="Currency"><input name="currency" value={form.currency || ''} onChange={handleChange} className="input" /></Field>
          <Field label="Billing Cycle">
            <select name="billingCycle" value={form.billingCycle || 'monthly'} onChange={handleChange} className="input">
              {['daily','weekly','monthly','quarterly','yearly','custom'].map(v=> <option key={v} value={v}>{v}</option>)}
            </select>
          </Field>
          <Field label="Interval Count"><input name="intervalCount" value={form.intervalCount ?? 1} onChange={handleChange} type="number" min="1" className="input" /></Field>
          <Field label="Category"><input name="category" value={form.category || ''} onChange={handleChange} className="input" /></Field>
          <Field label="Provider"><input name="provider" value={form.provider || ''} onChange={handleChange} className="input" /></Field>
          <Field label="Plan"><input name="plan" value={form.plan || ''} onChange={handleChange} className="input" /></Field>
          <Field label="Next Charge Date"><input name="nextChargeDate" value={form.nextChargeDate ? form.nextChargeDate.substring(0,10) : ''} onChange={handleChange} type="date" className="input" /></Field>
          <Field label="Account Email"><input name="accountEmail" value={form.accountEmail || ''} onChange={handleChange} className="input" /></Field>
          <Field label="Payment Method"><input name="paymentMethod" value={form.paymentMethod || ''} onChange={handleChange} className="input" /></Field>
          <Field label="Status">
            <select name="status" value={form.status || 'active'} onChange={handleChange} className="input">
              {['active','paused','canceled'].map(v=> <option key={v} value={v}>{v}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Tags (comma separated)"><input name="tags" value={form.tags || ''} onChange={handleChange} className="input" /></Field>
        <Field label="URL"><input name="url" value={form.url || ''} onChange={handleChange} className="input" /></Field>
        <Field label="Description"><textarea name="description" value={form.description || ''} onChange={handleChange} rows={4} className="input" /></Field>
        <div className="flex flex-wrap justify-between gap-3">
          <button type="button" onClick={handleDelete} disabled={saving} className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-60 dark:border-red-600/60 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50">{saving ? '...' : 'Delete'}</button>
          <div className="ml-auto flex gap-3">
            <button type="button" onClick={()=> navigate('/subscriptions')} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">Cancel</button>
            <button type="submit" disabled={saving} className="rounded-lg bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-pink-600 px-6 py-2 text-sm font-semibold text-white shadow hover:brightness-110 disabled:opacity-60">{saving ? 'Saving...' : 'Save'}</button>
          </div>
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

export default SubscriptionEdit;
