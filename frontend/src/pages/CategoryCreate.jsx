import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import categoryApi from '../services/categoryApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';

const PRESET_COLORS = [
  { name: 'Indigo', value: '#6366f1', gradient: 'from-indigo-500 to-indigo-600' },
  { name: 'Purple', value: '#a855f7', gradient: 'from-purple-500 to-purple-600' },
  { name: 'Pink', value: '#ec4899', gradient: 'from-pink-500 to-pink-600' },
  { name: 'Red', value: '#ef4444', gradient: 'from-red-500 to-red-600' },
  { name: 'Orange', value: '#f97316', gradient: 'from-orange-500 to-orange-600' },
  { name: 'Yellow', value: '#eab308', gradient: 'from-yellow-500 to-yellow-600' },
  { name: 'Green', value: '#10b981', gradient: 'from-green-500 to-green-600' },
  { name: 'Teal', value: '#14b8a6', gradient: 'from-teal-500 to-teal-600' },
  { name: 'Blue', value: '#3b82f6', gradient: 'from-blue-500 to-blue-600' },
  { name: 'Cyan', value: '#06b6d4', gradient: 'from-cyan-500 to-cyan-600' },
  { name: 'Rose', value: '#f43f5e', gradient: 'from-rose-500 to-rose-600' },
  { name: 'Gray', value: '#6b7280', gradient: 'from-gray-500 to-gray-600' },
];

const CATEGORY_ICONS = [
  { emoji: '📺', name: 'Entertainment' },
  { emoji: '🎵', name: 'Music' },
  { emoji: '🎮', name: 'Gaming' },
  { emoji: '☁️', name: 'Cloud' },
  { emoji: '💼', name: 'Business' },
  { emoji: '🎓', name: 'Education' },
  { emoji: '🏋️', name: 'Fitness' },
  { emoji: '🍔', name: 'Food' },
  { emoji: '🚗', name: 'Transport' },
  { emoji: '🏠', name: 'Utilities' },
  { emoji: '📱', name: 'Mobile' },
  { emoji: '💻', name: 'Software' },
  { emoji: '🎨', name: 'Design' },
  { emoji: '📰', name: 'News' },
  { emoji: '🛡️', name: 'Security' },
  { emoji: '📚', name: 'Books' },
];

const CategoryCreate = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', slug: '', color: '#6366f1', icon: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(()=> { if (user && user.role !== 'admin') navigate('/dashboard'); }, [user, navigate]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setError(null);
    
    // Auto-generate slug from name
    if (name === 'name' && !form.slug) {
      const autoSlug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      setForm(f => ({ ...f, slug: autoSlug }));
    }
  };

  const selectColor = (color) => {
    setForm(f => ({ ...f, color }));
  };

  const selectIcon = (icon) => {
    setForm(f => ({ ...f, icon }));
  };

  const submit = async e => {
    e.preventDefault(); 
    setSubmitting(true); 
    setError(null);
    setSuccess(false);
    
    try {
      await categoryApi.create(form);
      setSuccess(true);
      setTimeout(() => navigate('/categories'), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally { 
      setSubmitting(false); 
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/20">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDAsIDAsIDAsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40 dark:opacity-20" />
      
      <div className="relative mx-auto max-w-4xl px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 shadow-lg">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Create New Category</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Organize your subscriptions with custom categories</p>
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
                <p className="mt-1 text-sm text-green-700 dark:text-green-300">Category created successfully. Redirecting...</p>
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
              <CardDescription>Define your category name and identifier</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    Category Name <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={form.name} 
                    onChange={handleChange} 
                    placeholder="e.g., Streaming Services, Software Tools" 
                    required 
                    className="h-11 text-base"
                  />
                  <p className="text-xs text-gray-500">Choose a descriptive name for this category</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug" className="flex items-center gap-2">
                    Slug <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    id="slug" 
                    name="slug" 
                    value={form.slug} 
                    onChange={handleChange} 
                    placeholder="e.g., streaming-services" 
                    required 
                    className="h-11 font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500">URL-friendly identifier (auto-generated from name)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea 
                    id="description" 
                    name="description" 
                    value={form.description} 
                    onChange={handleChange} 
                    rows={3} 
                    placeholder="Describe what types of subscriptions belong in this category..."
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <p className="text-xs text-gray-500">Optional description to help identify this category</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visual Customization */}
          <Card className="shadow-xl ring-1 ring-gray-900/5 dark:ring-white/10">
            <CardHeader className="border-b border-gray-200/70 bg-gradient-to-r from-gray-50 to-white dark:border-gray-800/70 dark:from-gray-900 dark:to-gray-900/50">
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="text-xl">🎨</span>
                Visual Appearance
              </CardTitle>
              <CardDescription>Customize the look and feel of your category</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Color Selection */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    Color Theme
                  </Label>
                  <div className="grid grid-cols-6 gap-3 sm:grid-cols-8 md:grid-cols-12">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => selectColor(color.value)}
                        className={`group relative h-12 w-12 rounded-xl bg-gradient-to-br ${color.gradient} shadow-md transition-all hover:scale-110 hover:shadow-lg ${
                          form.color === color.value ? 'ring-4 ring-offset-2 ring-offset-white dark:ring-offset-gray-900' : ''
                        }`}
                        title={color.name}
                        style={{ boxShadow: form.color === color.value ? `0 0 0 4px ${color.value}40` : '' }}
                      >
                        {form.color === color.value && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="h-6 w-6 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
                    <Label htmlFor="color" className="text-xs font-medium">Custom Color:</Label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        id="color"
                        name="color" 
                        value={form.color} 
                        onChange={handleChange} 
                        className="h-10 w-16 cursor-pointer rounded-lg border-2 border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700"
                      />
                      <span className="font-mono text-sm font-medium text-gray-700 dark:text-gray-300">{form.color}</span>
                    </div>
                  </div>
                </div>

                {/* Icon Selection */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    Category Icon
                  </Label>
                  <div className="grid grid-cols-8 gap-2 sm:grid-cols-10 md:grid-cols-16">
                    {CATEGORY_ICONS.map((item) => (
                      <button
                        key={item.emoji}
                        type="button"
                        onClick={() => selectIcon(item.emoji)}
                        className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 text-2xl transition-all hover:scale-110 hover:shadow-md ${
                          form.icon === item.emoji 
                            ? 'border-indigo-500 bg-indigo-50 shadow-md dark:border-indigo-400 dark:bg-indigo-900/30' 
                            : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'
                        }`}
                        title={item.name}
                      >
                        {item.emoji}
                      </button>
                    ))}
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
                    <Label htmlFor="icon" className="mb-2 block text-xs font-medium">Or enter custom icon/emoji:</Label>
                    <Input 
                      id="icon"
                      name="icon" 
                      value={form.icon} 
                      onChange={handleChange} 
                      placeholder="e.g., 🎬 or mdi:television-classic" 
                      className="h-10 font-mono text-sm"
                    />
                    <p className="mt-1 text-xs text-gray-500">Supports emojis or icon names</p>
                  </div>
                </div>

                {/* Preview */}
                {form.name && (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div className="flex items-center gap-3 rounded-xl border-2 border-dashed border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                      <div 
                        className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl text-2xl shadow-md"
                        style={{ backgroundColor: form.color + '20', color: form.color }}
                      >
                        {form.icon || '📁'}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{form.name || 'Category Name'}</h3>
                        {form.description && (
                          <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">{form.description}</p>
                        )}
                      </div>
                      <div 
                        className="h-8 w-8 rounded-full shadow-inner"
                        style={{ backgroundColor: form.color }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => navigate('/categories')} className="h-11">
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="h-11 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 px-8 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50">
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
                  Create Category
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryCreate;
