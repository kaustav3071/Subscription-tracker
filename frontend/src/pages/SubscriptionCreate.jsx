import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import subscriptionApi from '../services/subscriptionApi';
import categoryApi from '../services/categoryApi';

const PAYMENT_METHOD_OPTIONS = [
  { value: '', label: 'Select method' },
  { value: 'card', label: 'Card' },
  { value: 'bank', label: 'Bank' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'upi', label: 'UPI' },
  { value: 'crypto', label: 'Crypto' },
  { value: 'cash', label: 'Cash' },
  { value: 'other', label: 'Other' },
];

const SubscriptionCreate = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', amount: '', currency: 'INR', billingCycle: 'monthly', intervalCount: 1,
    startDate: '', nextChargeDate: '', category: '', provider: '', plan: '', url: '', accountEmail: '', paymentMethod: '', tags: '', description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState(null);

  useEffect(() => {
    let active = true;
    categoryApi.list()
      .then(data => { if (!active) return; setCategories(data || []); })
      .catch(e => { if (active) setCatError(e.response?.data?.message || e.message); })
      .finally(()=> { if (active) setCatLoading(false); });
    return () => { active = false; };
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };
  const submit = async e => {
    e.preventDefault();
    setSubmitting(true); setError(null);
    const payload = { ...form, amount: form.amount ? Number(form.amount) : undefined };
    if (payload.tags) payload.tags = payload.tags.split(',').map(t=> t.trim()).filter(Boolean);
    try {
      await subscriptionApi.create(payload);
      navigate('/subscriptions');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const categoryOptions = categories.map(c => ({ value: c.slug || c.name?.toLowerCase(), label: c.name }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">New Subscription</h1>
        <button onClick={()=> navigate(-1)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">Back</button>
      </div>
      <form onSubmit={submit} className="space-y-8">
        {error && <div className="rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-600 dark:border-red-600/40 dark:bg-red-900/30 dark:text-red-300">{error}</div>}
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Name"><input name="name" value={form.name} onChange={handleChange} required className="input" /></Field>
          <Field label="Amount"><input name="amount" value={form.amount} onChange={handleChange} type="number" step="0.01" required className="input" /></Field>
          <Field label="Currency"><input name="currency" value={form.currency} onChange={handleChange} className="input" /></Field>
          <Field label="Billing Cycle">
            <select name="billingCycle" value={form.billingCycle} onChange={handleChange} className="input">
              {['daily','weekly','monthly','quarterly','yearly','custom'].map(v=> <option key={v} value={v}>{v}</option>)}
            </select>
          </Field>
          <Field label="Interval Count"><input name="intervalCount" value={form.intervalCount} onChange={handleChange} type="number" min="1" className="input" /></Field>
          <Field label="Category">
            {catError && <p className="mb-1 text-[11px] text-red-600 dark:text-red-400">{catError}</p>}
            <select name="category" value={form.category} onChange={handleChange} disabled={catLoading || !!catError} className="input">
              <option value="">{catLoading ? 'Loading categories...' : 'Select category'}</option>
              {categoryOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </Field>
          <Field label="Provider"><input name="provider" value={form.provider} onChange={handleChange} className="input" /></Field>
          <Field label="Plan"><input name="plan" value={form.plan} onChange={handleChange} className="input" /></Field>
          <Field label="Start Date"><input name="startDate" value={form.startDate} onChange={handleChange} type="date" className="input" /></Field>
          <Field label="Next Charge Date"><input name="nextChargeDate" value={form.nextChargeDate} onChange={handleChange} type="date" className="input" /></Field>
          <Field label="Account Email"><input name="accountEmail" value={form.accountEmail} onChange={handleChange} className="input" /></Field>
          <Field label="Payment Method">
            <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange} className="input">
              {PAYMENT_METHOD_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Tags (comma separated)"><input name="tags" value={form.tags} onChange={handleChange} className="input" /></Field>
        <Field label="URL"><input name="url" value={form.url} onChange={handleChange} className="input" /></Field>
        <Field label="Description"><textarea name="description" value={form.description} onChange={handleChange} rows={4} className="input" /></Field>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={()=> navigate('/subscriptions')} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">Cancel</button>
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

export default SubscriptionCreate;
