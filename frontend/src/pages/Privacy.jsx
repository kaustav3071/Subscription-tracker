import { useEffect } from 'react';

export default function Privacy() {
  useEffect(() => {
    document.title = 'Privacy Policy | SubTrack';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Last updated: December 30, 2025</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">1. Introduction</h2>
            <p>
              SubTrack ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our subscription tracking service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">2. Information We Collect</h2>
            <p className="mb-3">We collect information you provide directly to us:</p>
            <ul className="ml-4 list-disc space-y-2">
              <li><strong>Account Information:</strong> Name, email address, and password when you register.</li>
              <li><strong>Subscription Data:</strong> Details about subscriptions you add, including service names, costs, and billing cycles.</li>
              <li><strong>Usage Data:</strong> Information about how you interact with our service.</li>
              <li><strong>Communications:</strong> Messages you send to our support team.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">3. How We Use Your Information</h2>
            <p className="mb-3">We use the information we collect to:</p>
            <ul className="ml-4 list-disc space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Send you renewal reminders and spending alerts</li>
              <li>Respond to your support requests</li>
              <li>Protect against fraudulent or unauthorized activity</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">4. Data Sharing</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may share information only in the following circumstances:
            </p>
            <ul className="ml-4 mt-3 list-disc space-y-2">
              <li>With your consent</li>
              <li>To comply with legal requirements</li>
              <li>To protect our rights and prevent fraud</li>
              <li>With service providers who assist our operations (under strict confidentiality)</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">5. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data, including:
            </p>
            <ul className="ml-4 mt-3 list-disc space-y-2">
              <li>Password hashing with bcrypt</li>
              <li>Encrypted connections (HTTPS/TLS)</li>
              <li>Secure token-based authentication</li>
              <li>Regular security audits</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">6. Your Rights</h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="ml-4 list-disc space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data in a portable format</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">7. Cookies</h2>
            <p>
              We use essential cookies to maintain your session and preferences. We do not use tracking cookies or third-party analytics that compromise your privacy.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">9. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at{' '}
              <a href="/support" className="text-blue-600 hover:underline dark:text-blue-400">
                our support page
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
