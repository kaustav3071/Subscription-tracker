import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import subscriptionApi from '../services/subscriptionApi';
import categoryApi from '../services/categoryApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';

const PAYMENT_METHOD_OPTIONS = [
  { value: '', label: '💳 Select payment method', icon: '💳' },
  { value: 'card', label: '💳 Credit/Debit Card', icon: '💳' },
  { value: 'bank', label: '🏦 Bank Transfer', icon: '🏦' },
  { value: 'paypal', label: '🅿️ PayPal', icon: '🅿️' },
  { value: 'upi', label: '📱 UPI', icon: '📱' },
  { value: 'crypto', label: '₿ Cryptocurrency', icon: '₿' },
  { value: 'cash', label: '💵 Cash', icon: '💵' },
  { value: 'other', label: '🔄 Other', icon: '🔄' },
];

const BILLING_CYCLES = [
  { value: 'daily', label: 'Daily', icon: '📅' },
  { value: 'weekly', label: 'Weekly', icon: '📆' },
  { value: 'monthly', label: 'Monthly', icon: '🗓️' },
  { value: 'quarterly', label: 'Quarterly', icon: '📊' },
  { value: 'yearly', label: 'Yearly', icon: '🎯' }
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active', icon: '✅', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
  { value: 'paused', label: 'Paused', icon: '⏸️', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
  { value: 'canceled', label: 'Canceled', icon: '❌', color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
];

const SubscriptionEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true); setError(null);
    subscriptionApi.get(id)
      .then(data => { 
        if (!active) return; 
        setForm({ 
          ...data, 
          tags: (data.tags || []).join(', '),
          nextChargeDate: data.nextChargeDate ? data.nextChargeDate.substring(0,10) : '',
          startDate: data.startDate ? data.startDate.substring(0,10) : '',
        }); 
      })
      .catch(err => { if (active) setError(err.response?.data?.message || err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  useEffect(() => {
    let active = true;
    categoryApi.list()
      .then(data => { if (!active) return; setCategories(data || []); })
      .catch(() => {})
      .finally(() => { if (active) setCatLoading(false); });
    return () => { active = false; };
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setError(null);
  };

  const submit = async e => {
    e.preventDefault(); 
    setSaving(true); 
    setError(null);
    setSuccess(false);
    
    const payload = { ...form };
    payload.amount = payload.amount ? Number(payload.amount) : undefined;
    if (payload.tags) payload.tags = payload.tags.split(',').map(t=> t.trim()).filter(Boolean);
    
    try {
      await subscriptionApi.update(id, payload);
      setSuccess(true);
      setTimeout(() => navigate('/subscriptions'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await subscriptionApi.remove(id);
      navigate('/subscriptions');
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
      setShowDeleteConfirm(false);
    } finally { setDeleting(false); }
  };

  const categoryOptions = categories.map(c => ({ value: c.slug || c.name?.toLowerCase(), label: c.name }));

  if (loading) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/20">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading subscription...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/20">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <div className="rounded-xl border-2 border-red-200 bg-red-50 p-6 text-center dark:border-red-800/50 dark:bg-red-900/20">
            <p className="text-red-700 dark:text-red-300">{error || 'Subscription not found'}</p>
            <Button variant="outline" onClick={() => navigate('/subscriptions')} className="mt-4">
              Back to Subscriptions
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/20">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDAsIDAsIDAsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40 dark:opacity-20" />
      
      <div className="relative mx-auto max-w-5xl px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Edit Subscription</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Update details for <span className="font-medium text-indigo-600 dark:text-indigo-400">{form.name}</span></p>
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate(-1)} className="w-fit">
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </Button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 animate-shake rounded-xl border-2 border-red-200 bg-red-50 p-4 shadow-sm dark:border-red-800/50 dark:bg-red-900/20">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/40">
                <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 dark:text-red-200">Error</h3>
                <p className="mt-1 text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 animate-fade-in rounded-xl border-2 border-green-200 bg-green-50 p-4 shadow-sm dark:border-green-800/50 dark:bg-green-900/20">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/40">
                <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-green-900 dark:text-green-200">Success!</h3>
                <p className="mt-1 text-sm text-green-700 dark:text-green-300">Subscription updated successfully. Redirecting...</p>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="mx-4 w-full max-w-md animate-fade-in rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
                <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Subscription</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Are you sure you want to delete <span className="font-medium text-gray-900 dark:text-white">{form.name}</span>? This action cannot be undone.
              </p>
              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} className="flex-1" disabled={deleting}>
                  Cancel
                </Button>
                <Button onClick={handleDelete} disabled={deleting} className="flex-1 bg-red-600 text-white hover:bg-red-700">
                  {deleting ? (
                    <>
                      <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Deleting...
                    </>
                  ) : 'Delete'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={submit} className="space-y-6">
          {/* Status Card */}
          <Card className="overflow-hidden shadow-xl ring-1 ring-gray-900/5 dark:ring-white/10">
            <CardHeader className="border-b border-gray-200/70 bg-gradient-to-r from-gray-50 to-white dark:border-gray-800/70 dark:from-gray-900 dark:to-gray-900/50">
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="text-xl">📊</span>
                Subscription Status
              </CardTitle>
              <CardDescription>Current state of this subscription</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-4 sm:grid-cols-3">
                {STATUS_OPTIONS.map(opt => (
                  <label
                    key={opt.value}
                    className={`relative flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                      form.status === opt.value
                        ? 'border-indigo-500 bg-indigo-50/50 shadow-md dark:border-indigo-400 dark:bg-indigo-900/20'
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={opt.value}
                      checked={form.status === opt.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="text-2xl">{opt.icon}</span>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">{opt.label}</span>
                    </div>
                    {form.status === opt.value && (
                      <svg className="absolute right-3 top-3 h-5 w-5 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card className="shadow-xl ring-1 ring-gray-900/5 dark:ring-white/10">
            <CardHeader className="border-b border-gray-200/70 bg-gradient-to-r from-gray-50 to-white dark:border-gray-800/70 dark:from-gray-900 dark:to-gray-900/50">
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="text-xl">📝</span>
                Basic Information
              </CardTitle>
              <CardDescription>Essential details about your subscription</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    Subscription Name <span className="text-red-500">*</span>
                  </Label>
                  <Input id="name" name="name" value={form.name || ''} onChange={handleChange} placeholder="e.g., Netflix Premium" required className="h-11" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount" className="flex items-center gap-2">
                    Amount <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                    <Input id="amount" name="amount" value={form.amount ?? ''} onChange={handleChange} type="number" step="0.01" placeholder="0.00" required className="h-11 pl-8" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input id="currency" name="currency" value={form.currency || ''} onChange={handleChange} placeholder="INR" className="h-11" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select id="category" name="category" value={form.category || ''} onChange={handleChange} disabled={catLoading} className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="">{catLoading ? '⏳ Loading...' : '📁 Select category'}</option>
                    {categoryOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provider">Provider</Label>
                  <Input id="provider" name="provider" value={form.provider || ''} onChange={handleChange} placeholder="e.g., Netflix, Spotify" className="h-11" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="plan">Plan</Label>
                  <Input id="plan" name="plan" value={form.plan || ''} onChange={handleChange} placeholder="e.g., Premium, Basic" className="h-11" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Billing Details */}
          <Card className="shadow-xl ring-1 ring-gray-900/5 dark:ring-white/10">
            <CardHeader className="border-b border-gray-200/70 bg-gradient-to-r from-gray-50 to-white dark:border-gray-800/70 dark:from-gray-900 dark:to-gray-900/50">
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="text-xl">💰</span>
                Billing Details
              </CardTitle>
              <CardDescription>Payment schedule and billing cycle</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-6">
                <Label className="mb-3 block">Billing Cycle</Label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  {BILLING_CYCLES.map(cycle => (
                    <label
                      key={cycle.value}
                      className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all ${
                        form.billingCycle === cycle.value
                          ? 'border-indigo-500 bg-indigo-50/50 shadow-md dark:border-indigo-400 dark:bg-indigo-900/20'
                          : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="billingCycle"
                        value={cycle.value}
                        checked={form.billingCycle === cycle.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className="text-2xl">{cycle.icon}</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{cycle.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="intervalCount">Interval Count</Label>
                  <Input id="intervalCount" name="intervalCount" value={form.intervalCount ?? 1} onChange={handleChange} type="number" min="1" className="h-11" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">e.g., "2" with monthly = every 2 months</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nextChargeDate">Next Charge Date</Label>
                  <Input id="nextChargeDate" name="nextChargeDate" value={form.nextChargeDate || ''} onChange={handleChange} type="date" className="h-11" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <select id="paymentMethod" name="paymentMethod" value={form.paymentMethod || ''} onChange={handleChange} className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                    {PAYMENT_METHOD_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountEmail">Account Email</Label>
                  <Input id="accountEmail" name="accountEmail" value={form.accountEmail || ''} onChange={handleChange} type="email" placeholder="account@example.com" className="h-11" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card className="shadow-xl ring-1 ring-gray-900/5 dark:ring-white/10">
            <CardHeader className="border-b border-gray-200/70 bg-gradient-to-r from-gray-50 to-white dark:border-gray-800/70 dark:from-gray-900 dark:to-gray-900/50">
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="text-xl">📋</span>
                Additional Details
              </CardTitle>
              <CardDescription>Optional information for better tracking</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label htmlFor="url">Website URL</Label>
                  <Input id="url" name="url" value={form.url || ''} onChange={handleChange} placeholder="https://example.com" className="h-11" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input id="tags" name="tags" value={form.tags || ''} onChange={handleChange} placeholder="work, personal, entertainment" className="h-11" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">Separate multiple tags with commas</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description || ''}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Add any notes about this subscription..."
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={saving || deleting}
              className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950"
            >
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Subscription
            </Button>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => navigate('/subscriptions')} disabled={saving}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30"
              >
                {saving ? (
                  <>
                    <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubscriptionEdit;
