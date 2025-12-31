import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  { value: 'yearly', label: 'Yearly', icon: '🎯' },
  { value: 'custom', label: 'Custom', icon: '⚙️' },
];

const SubscriptionCreate = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', amount: '', currency: 'INR', billingCycle: 'monthly', intervalCount: 1,
    startDate: '', nextChargeDate: '', category: '', provider: '', plan: '', url: '', accountEmail: '', paymentMethod: '', tags: '', description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
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
    setError(null);
  };

  const submit = async e => {
    e.preventDefault();
    setSubmitting(true); 
    setError(null);
    setSuccess(false);
    
    const payload = { ...form, amount: form.amount ? Number(form.amount) : undefined };
    if (payload.tags) payload.tags = payload.tags.split(',').map(t=> t.trim()).filter(Boolean);
    
    try {
      await subscriptionApi.create(payload);
      setSuccess(true);
      setTimeout(() => navigate('/subscriptions'), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create subscription. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  const categoryOptions = categories.map(c => ({ value: c.slug || c.name?.toLowerCase(), label: c.name }));

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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Add New Subscription</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Track your recurring expenses efficiently</p>
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
                <p className="mt-1 text-sm text-green-700 dark:text-green-300">Subscription created successfully. Redirecting...</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={submit} className="space-y-6">
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
                  <Input id="name" name="name" value={form.name} onChange={handleChange} placeholder="e.g., Netflix Premium" required className="h-11" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount" className="flex items-center gap-2">
                    Amount <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                    <Input id="amount" name="amount" value={form.amount} onChange={handleChange} type="number" step="0.01" placeholder="0.00" required className="h-11 pl-8" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input id="currency" name="currency" value={form.currency} onChange={handleChange} placeholder="INR" className="h-11" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  {catError && <p className="text-xs text-red-600 dark:text-red-400">{catError}</p>}
                  <select id="category" name="category" value={form.category} onChange={handleChange} disabled={catLoading || !!catError} className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="">{catLoading ? '⏳ Loading...' : '📁 Select category'}</option>
                    {categoryOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provider">Provider</Label>
                  <Input id="provider" name="provider" value={form.provider} onChange={handleChange} placeholder="e.g., Netflix, Spotify" className="h-11" />
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
              <CardDescription>Configure your billing cycle and payment information</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="billingCycle">Billing Cycle</Label>
                  <select id="billingCycle" name="billingCycle" value={form.billingCycle} onChange={handleChange} className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    {BILLING_CYCLES.map(c => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="intervalCount">Interval Count</Label>
                  <Input id="intervalCount" name="intervalCount" value={form.intervalCount} onChange={handleChange} type="number" min="1" placeholder="1" className="h-11" />
                  <p className="text-xs text-gray-500">Number of billing cycles</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" name="startDate" value={form.startDate} onChange={handleChange} type="date" className="h-11" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nextChargeDate">Next Charge Date</Label>
                  <Input id="nextChargeDate" name="nextChargeDate" value={form.nextChargeDate} onChange={handleChange} type="date" className="h-11" />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <select id="paymentMethod" name="paymentMethod" value={form.paymentMethod} onChange={handleChange} className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    {PAYMENT_METHOD_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="plan">Plan Name</Label>
                  <Input id="plan" name="plan" value={form.plan} onChange={handleChange} placeholder="e.g., Premium, Pro, Basic" className="h-11" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="shadow-xl ring-1 ring-gray-900/5 dark:ring-white/10">
            <CardHeader className="border-b border-gray-200/70 bg-gradient-to-r from-gray-50 to-white dark:border-gray-800/70 dark:from-gray-900 dark:to-gray-900/50">
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="text-xl">🔗</span>
                Additional Information
              </CardTitle>
              <CardDescription>Optional details for better organization</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="accountEmail">Account Email</Label>
                  <Input id="accountEmail" name="accountEmail" value={form.accountEmail} onChange={handleChange} type="email" placeholder="account@example.com" className="h-11" />
                  <p className="text-xs text-gray-500">Email associated with this subscription</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url">Website URL</Label>
                  <Input id="url" name="url" value={form.url} onChange={handleChange} type="url" placeholder="https://example.com" className="h-11" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input id="tags" name="tags" value={form.tags} onChange={handleChange} placeholder="streaming, entertainment, monthly" className="h-11" />
                  <p className="text-xs text-gray-500">Comma-separated tags for easy filtering</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea id="description" name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Additional notes about this subscription..." className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => navigate('/subscriptions')} className="h-11">
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="h-11 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50">
              {submitting ? (
                <>
                  <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Create Subscription
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubscriptionCreate;
