import Category from '../models/category.model.js';

// Basic keyword maps. Extendable by users via Category docs. Slugs should be lowercase kebab-case.
const DEFAULT_CATEGORY_MAP = [
  { slug: 'ott', keywords: ['netflix', 'hotstar', 'hoststar', 'disney+', 'prime video', 'amazon prime', 'hulu', 'sony liv', 'zee5', 'paramount+', 'apple tv', 'jio cinema', 'jiocinema'] },
  { slug: 'gaming', keywords: ['xbox game pass', 'playstation plus', 'ps plus', 'ea play', 'ubisoft+', 'steam', 'epic', 'riot', 'battlenet'] },
  { slug: 'music', keywords: ['spotify', 'apple music', 'youtube music', 'gaana', 'wynk', 'saavn'] },
  { slug: 'cloud', keywords: ['google drive', 'google one', 'dropbox', 'onedrive', 'icloud'] },
  { slug: 'productivity', keywords: ['notion', 'todoist', 'evernote', 'microsoft 365', 'office 365', 'slack', 'zoom'] },
  { slug: 'education', keywords: ['coursera', 'udemy', 'udacity', 'byjus', 'unacademy', 'skillshare'] },
  { slug: 'finance', keywords: ['zerodha', 'moneycontrol', 'quickbooks', 'xero'] },
  { slug: 'utilities', keywords: ['vpn', 'expressvpn', 'nordvpn', 'surfshark', '1password', 'lastpass'] },
  { slug: 'news', keywords: ['nyt', 'washington post', 'the hindu', 'the times', 'wsj'] },
  { slug: 'health', keywords: ['cult', 'cult fit', 'curefit', 'fitbit premium', 'whoop'] },
];

export async function ensureDefaultCategories(userId = null) {
  // Create essential defaults if missing (global ones with user=null)
  const defaults = [
    { name: 'OTT', slug: 'ott', color: '#F59E0B' },
    { name: 'Gaming', slug: 'gaming', color: '#8B5CF6' },
    { name: 'Music', slug: 'music', color: '#10B981' },
    { name: 'Cloud', slug: 'cloud', color: '#3B82F6' },
    { name: 'Productivity', slug: 'productivity', color: '#6366F1' },
    { name: 'Education', slug: 'education', color: '#EF4444' },
    { name: 'Finance', slug: 'finance', color: '#22C55E' },
    { name: 'Utilities', slug: 'utilities', color: '#06B6D4' },
    { name: 'News', slug: 'news', color: '#EA580C' },
    { name: 'Health', slug: 'health', color: '#14B8A6' },
    { name: 'Other', slug: 'other', color: '#9CA3AF' },
  ];
  for (const d of defaults) {
    await Category.updateOne({ user: null, slug: d.slug }, { $setOnInsert: d }, { upsert: true });
  }
}

export async function autoCategorize({ userId, name, provider }) {
  const hay = `${(provider || '')} ${(name || '')}`.toLowerCase();
  // 1) Try user-defined categories by keywords in description (future: custom rules)
  // 2) Fallback to default keyword map
  for (const entry of DEFAULT_CATEGORY_MAP) {
    if (entry.keywords.some((k) => hay.includes(k))) return entry.slug;
  }
  return 'other';
}
