import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Book, Zap, CreditCard, Bell, FolderOpen, Shield, ChevronRight } from 'lucide-react';

const sections = [
  {
    id: 'getting-started',
    icon: Zap,
    title: 'Getting Started',
    content: `
## Welcome to SubTrack

SubTrack helps you track and manage all your subscription services in one place. Here's how to get started:

### 1. Create an Account
Sign up with your email address. You'll receive a verification email to confirm your account.

### 2. Add Your First Subscription
Click "Add Subscription" from your dashboard. Enter the service name, cost, and billing cycle.

### 3. Explore Your Dashboard
View your total monthly spend, upcoming renewals, and spending breakdown by category.
    `,
  },
  {
    id: 'subscriptions',
    icon: CreditCard,
    title: 'Managing Subscriptions',
    content: `
## Managing Your Subscriptions

### Adding a Subscription
1. Navigate to Dashboard or Subscriptions page
2. Click "Add Subscription"
3. Fill in the details:
   - **Name**: The service name (e.g., Netflix, Spotify)
   - **Amount**: Monthly or yearly cost
   - **Billing Cycle**: Weekly, Monthly, Quarterly, or Yearly
   - **Start Date**: When the subscription began
   - **Category**: Auto-assigned or choose manually

### Editing Subscriptions
Click on any subscription to edit its details. Changes are saved automatically.

### Pausing or Cancelling
Mark subscriptions as "paused" or "cancelled" to keep a record without affecting your active spending totals.
    `,
  },
  {
    id: 'notifications',
    icon: Bell,
    title: 'Notifications & Reminders',
    content: `
## Stay Informed

### Renewal Reminders
SubTrack sends you email reminders 3 days before each subscription renews, giving you time to cancel if needed.

### Spending Alerts
Set a monthly budget threshold. When your total subscriptions exceed this amount, you'll receive an alert.

### Configuring Notifications
Visit your Profile settings to customize notification preferences:
- Enable/disable email reminders
- Set spending alert threshold
- Choose reminder timing
    `,
  },
  {
    id: 'categories',
    icon: FolderOpen,
    title: 'Categories',
    content: `
## Organizing with Categories

### Default Categories
SubTrack includes pre-built categories:
- **Streaming** (Netflix, Spotify, Disney+)
- **Software** (Adobe, Microsoft 365)
- **Gaming** (Xbox, PlayStation Plus)
- **Cloud** (Dropbox, iCloud)
- **News** (NYT, WSJ)
- **Fitness** (Gym memberships, Peloton)
- **Other** (Everything else)

### Custom Categories
Create your own categories from the Categories page. Each category can have:
- Custom name
- Color for easy identification
- Icon (optional)

### Auto-Categorization
SubTrack automatically assigns categories based on the subscription name. You can always change it manually.
    `,
  },
  {
    id: 'security',
    icon: Shield,
    title: 'Security & Privacy',
    content: `
## Your Data is Safe

### Account Security
- Passwords are hashed using bcrypt
- JWT tokens expire after 7 days
- Logged-out tokens are blacklisted

### Data Privacy
- We never share your data with third parties
- All connections are encrypted (HTTPS)
- You can export or delete your data anytime

### Two-Factor Authentication
Coming soon! We're working on adding 2FA for extra security.

### Need Help?
Contact our [support team](/support) for security-related questions.
    `,
  },
];

export default function Docs() {
  const [activeSection, setActiveSection] = useState('getting-started');

  useEffect(() => {
    document.title = 'Documentation | SubTrack';
  }, []);

  const currentSection = sections.find((s) => s.id === activeSection);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Documentation</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Learn how to use SubTrack effectively.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                  activeSection === section.id
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                <section.icon className="h-5 w-5" />
                {section.title}
                {activeSection === section.id && (
                  <ChevronRight className="ml-auto h-4 w-4" />
                )}
              </button>
            ))}
          </nav>

          {/* Content */}
          <div className="rounded-xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
            <div className="prose prose-gray max-w-none dark:prose-invert">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                  <currentSection.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="m-0 text-2xl font-bold">{currentSection.title}</h2>
              </div>
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {currentSection.content.trim().split('\n').map((line, i) => {
                  if (line.startsWith('## ')) {
                    return <h2 key={i} className="mb-4 mt-8 text-xl font-bold text-gray-900 dark:text-white">{line.replace('## ', '')}</h2>;
                  }
                  if (line.startsWith('### ')) {
                    return <h3 key={i} className="mb-3 mt-6 text-lg font-semibold text-gray-900 dark:text-white">{line.replace('### ', '')}</h3>;
                  }
                  if (line.startsWith('- **')) {
                    const match = line.match(/- \*\*(.+?)\*\* \((.+?)\)/);
                    if (match) {
                      return (
                        <div key={i} className="mb-2 flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500" />
                          <span><strong>{match[1]}</strong> ({match[2]})</span>
                        </div>
                      );
                    }
                    const simpleMatch = line.match(/- \*\*(.+?)\*\*:? ?(.+)?/);
                    if (simpleMatch) {
                      return (
                        <div key={i} className="mb-2 flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500" />
                          <span><strong>{simpleMatch[1]}</strong>{simpleMatch[2] ? `: ${simpleMatch[2]}` : ''}</span>
                        </div>
                      );
                    }
                  }
                  if (line.startsWith('- ')) {
                    return (
                      <div key={i} className="mb-2 flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gray-400" />
                        <span>{line.replace('- ', '')}</span>
                      </div>
                    );
                  }
                  if (line.match(/^\d\./)) {
                    return <p key={i} className="mb-2 ml-4">{line}</p>;
                  }
                  if (line.trim() === '') return <div key={i} className="h-2" />;
                  return <p key={i} className="mb-2">{line}</p>;
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Help CTA */}
        <div className="mt-12 rounded-xl border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-800 dark:bg-gray-900/50">
          <Book className="mx-auto h-10 w-10 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            Can't find what you're looking for?
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Our support team is here to help.
          </p>
          <Link
            to="/support"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
